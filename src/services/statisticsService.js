import { 
  doc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  serverTimestamp, 
  getDoc 
} from 'firebase/firestore';
import { db } from '../firebase';

class StatisticsService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map(); // Track ongoing requests
  }

  // Foydalanuvchi qidiruvini qayd etish
  async trackSearch(userId, city, weatherData) {
    if (!userId) {
      console.warn('No userId provided for tracking search');
      return;
    }

    if (!city || !weatherData) {
      console.warn('Missing city or weatherData for tracking search');
      return;
    }

    try {
      const now = new Date();
      const monthKey = now.toISOString().slice(0, 7); // YYYY-MM

      // Qidiruv yozuvi - unique ID qo'shamiz dublikatlarni oldini olish uchun
      const searchRecord = {
        id: `${userId}_${city}_${now.getTime()}`, // Unique identifier
        city: city.trim(),
        timestamp: serverTimestamp(),
        clientTimestamp: now.toISOString(), // Fallback timestamp
        weather: weatherData.weather?.[0]?.description || '',
        temperature: Math.round(weatherData.main?.temp) || 0,
        humidity: weatherData.main?.humidity || 0,
        windSpeed: weatherData.wind?.speed || 0
      };

      // Statistikani yangilash
      await this.updateUserStats(userId, city.trim(), monthKey, searchRecord);

      // Qidiruv tarixiga qo'shish
      await this.addToSearchHistory(userId, searchRecord);

      // Keshni tozalash
      this.cache.delete(`stats_${userId}`);

      console.log('Search tracked successfully for user:', userId);

    } catch (error) {
      console.error('Statistics tracking error:', error);
      // Don't throw error to prevent app crashes
    }
  }

  async updateUserStats(userId, city, monthKey, searchRecord) {
    try {
      // Use subcollection structure: users/{userId}/statistics/{userId}
      const statsRef = doc(db, 'users', userId, 'statistics', userId);
      const statsDoc = await getDoc(statsRef);

      if (!statsDoc.exists()) {
        await setDoc(statsRef, {
          totalSearches: 1,
          monthlySearches: {
            [monthKey]: [searchRecord]
          },
          popularLocations: [{ name: city, count: 1 }],
          lastSearch: searchRecord,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        const data = statsDoc.data();
        const monthlySearches = data.monthlySearches || {};

        // Update monthly searches
        if (!monthlySearches[monthKey]) {
          monthlySearches[monthKey] = [searchRecord];
        } else {
          monthlySearches[monthKey].push(searchRecord);
        }

        // Update popular locations
        const popularLocations = data.popularLocations || [];
        const existingLocation = popularLocations.find(loc => loc.name === city);
        
        if (existingLocation) {
          existingLocation.count += 1;
        } else {
          popularLocations.push({ name: city, count: 1 });
        }

        await updateDoc(statsRef, {
          totalSearches: (data.totalSearches || 0) + 1,
          monthlySearches,
          popularLocations,
          lastSearch: searchRecord,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  async addToSearchHistory(userId, searchRecord) {
    try {
      // Use subcollection structure: users/{userId}/searchHistory/{userId}
      const historyRef = doc(db, 'users', userId, 'searchHistory', userId);
      const historyDoc = await getDoc(historyRef);

      if (!historyDoc.exists()) {
        await setDoc(historyRef, { searches: [searchRecord] });
      } else {
        // Check for duplicates before adding
        const existingSearches = historyDoc.data().searches || [];
        const isDuplicate = existingSearches.some(search => 
          search.city === searchRecord.city && 
          search.weather === searchRecord.weather &&
          Math.abs(new Date(search.timestamp || search.clientTimestamp).getTime() - 
                   new Date(searchRecord.timestamp || searchRecord.clientTimestamp).getTime()) < 60000 // Within 1 minute
        );

        if (!isDuplicate) {
          await updateDoc(historyRef, {
            searches: arrayUnion(searchRecord)
          });
          console.log('Added new search to history');
        } else {
          console.log('Duplicate search detected, skipping');
        }
      }
    } catch (error) {
      console.error('Error adding to search history:', error);
      throw error;
    }
  }

  async initializeUserStats(userId) {
    try {
      // Use subcollection structure: users/{userId}/statistics/{userId}
      const statsRef = doc(db, 'users', userId, 'statistics', userId);
      await setDoc(statsRef, {
        totalSearches: 0,
        monthlySearches: {},
        popularLocations: [],
        createdAt: serverTimestamp()
      });
      console.log('Initial stats document created for user:', userId);
    } catch (error) {
      console.error('Error initializing user stats:', error);
      // Don't throw error to prevent app crashes
    }
  }

  async getUserStatistics(userId) {
    console.log('🔍 statisticsService.getUserStatistics called for:', userId);
    
    if (!userId) {
      console.warn('❌ No userId provided for getUserStatistics');
      return this.getDefaultStats();
    }

    // Check cache first
    const cacheKey = `stats_${userId}`;
    if (this.cache.has(cacheKey)) {
      console.log('📦 Returning cached stats for user:', userId);
      return this.cache.get(cacheKey);
    }

    // Check if request is already pending
    if (this.pendingRequests.has(cacheKey)) {
      console.log('⏳ Request already pending, waiting for result...');
      return this.pendingRequests.get(cacheKey);
    }

    // Create and track the request
    const requestPromise = this.fetchUserStatsFromFirestore(userId);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(cacheKey);
    }
  }

  async fetchUserStatsFromFirestore(userId) {
    try {
      console.log('📊 Fetching stats from Firestore for user:', userId);
      // Use subcollection structure: users/{userId}/statistics/{userId}
      const statsRef = doc(db, 'users', userId, 'statistics', userId);
      let statsDoc = await getDoc(statsRef);

      if (!statsDoc.exists()) {
        console.log('📄 No statistics document found for user:', userId);
        console.log('🔧 Initializing user stats...');
        // Create initial stats document for new users
        await this.initializeUserStats(userId);
        console.log('✅ User stats initialized, returning default stats');
        const defaultStats = this.getDefaultStats();
        this.cache.set(`stats_${userId}`, defaultStats);
        return defaultStats;
      }

      const rawData = statsDoc.data();
      console.log('📈 Raw stats data from Firestore:', rawData);
      const processedStats = this.processStatsData(rawData);
      console.log('📊 Processed stats data:', processedStats);

      // Cache 5 daqiqa
      this.cache.set(`stats_${userId}`, processedStats);
      setTimeout(() => this.cache.delete(`stats_${userId}`), 300000);

      return processedStats;
    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      // Handle permission errors gracefully
      if (error.message && error.message.includes('Missing or insufficient permissions')) {
        console.warn('⚠️ Firebase permissions error - user may not be authenticated or rules not deployed');
      } else if (error.code === 'unavailable') {
        console.warn('⚠️ Firebase unavailable - using default stats');
      } else if (error.code === 'permission-denied') {
        console.warn('⚠️ Permission denied - check Firebase security rules deployment');
      }
      return this.getDefaultStats();
    }
  }

  processStatsData(rawData) {
    const totalSearches = rawData.totalSearches || 0;

    const monthlySearches = Object.entries(rawData.monthlySearches || {})
      .map(([month, searches]) => ({
        month,
        count: Array.isArray(searches) ? searches.length : searches.count || 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);

    const popularLocations = (rawData.popularLocations || [])
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Timestamp handling with proper fallbacks
    const recentSearches = (rawData.activityData?.recentSearches || [])
      .map(search => ({
        ...search,
        // Safe timestamp conversion with fallbacks
        timestamp: this.safeTimestampToDate(search.timestamp) || search.clientTimestamp || new Date()
      }))
      .sort((a, b) => {
        const timeA = this.safeTimestampToDate(a.timestamp) || a.clientTimestamp || new Date(0);
        const timeB = this.safeTimestampToDate(b.timestamp) || b.clientTimestamp || new Date(0);
        return new Date(timeB) - new Date(timeA);
      })
      .slice(0, 20);

    return {
      totalSearches,
      monthlySearches,
      popularLocations,
      recentSearches, // No redundant fallback needed
      activityData: { recentSearches, lastSearch: rawData.lastSearch },
      joinDate: rawData.joinDate
    };
  }

  // Safe timestamp conversion helper
  safeTimestampToDate(timestamp) {
    if (!timestamp) return null;
    
    try {
      // Handle Firestore Timestamp
      if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate();
      }
      
      // Handle ISO string
      if (typeof timestamp === 'string') {
        return new Date(timestamp);
      }
      
      // Handle number (milliseconds)
      if (typeof timestamp === 'number') {
        return new Date(timestamp);
      }
      
      // Handle Date object
      if (timestamp instanceof Date) {
        return timestamp;
      }
      
      return null;
    } catch (error) {
      console.warn('Error converting timestamp:', error);
      return null;
    }
  }

  getDefaultStats() {
    return {
      totalSearches: 0,
      monthlySearches: [],
      popularLocations: [],
      activityData: { recentSearches: [] }
    };
  }

  clearCache(userId) {
    if (userId) this.cache.delete(`stats_${userId}`);
  }
}

export const statisticsService = new StatisticsService();
