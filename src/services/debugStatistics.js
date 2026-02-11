// Debug statistics service
import { statisticsService } from './statisticsService';

// Test data
const testWeatherData = {
  weather: [{ description: 'clear sky' }],
  main: { temp: 25, humidity: 60 },
  wind: { speed: 3.5 }
};

export const debugStatistics = async () => {
  console.log('=== STATISTICS DEBUG START ===');
  
  try {
    // Step 1: Check if service is available
    console.log('1. Statistics service available:', !!statisticsService);
    
    // Step 2: Test with no user (should return default stats)
    console.log('2. Testing with no user...');
    const defaultStats = statisticsService.getUserStatistics(null);
    console.log('Default stats:', defaultStats);
    
    // Step 3: Test with fake user ID (should handle gracefully)
    console.log('3. Testing with fake user ID...');
    const fakeStats = await statisticsService.getUserStatistics('fake-user-123');
    console.log('Fake user stats:', fakeStats);
    
    // Step 4: Test tracking with no user (should handle gracefully)
    console.log('4. Testing track search with no user...');
    await statisticsService.trackSearch(null, 'Tashkent', testWeatherData);
    console.log('Track search with no user completed');
    
    // Step 5: Test tracking with fake user
    console.log('5. Testing track search with fake user...');
    await statisticsService.trackSearch('fake-user-123', 'Tashkent', testWeatherData);
    console.log('Track search with fake user completed');
    
    console.log('=== STATISTICS DEBUG END ===');
    return { success: true, message: 'Debug completed' };
    
  } catch (error) {
    console.error('=== STATISTICS DEBUG ERROR ===');
    console.error('Error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('=== DEBUG ERROR END ===');
    return { success: false, error: error.message };
  }
};

// Test with real authentication
export const testWithAuth = async (user) => {
  console.log('=== TESTING WITH AUTH ===');
  console.log('User:', user);
  
  if (!user || !user.uid) {
    console.error('No authenticated user provided');
    return { success: false, error: 'No authenticated user' };
  }
  
  try {
    // Test tracking search
    console.log('1. Tracking search for authenticated user...');
    await statisticsService.trackSearch(user.uid, 'Tashkent', testWeatherData);
    console.log('✓ Search tracked successfully');
    
    // Test getting statistics
    console.log('2. Getting user statistics...');
    const stats = await statisticsService.getUserStatistics(user.uid);
    console.log('✓ User statistics:', stats);
    
    // Test another search
    console.log('3. Tracking another search...');
    await statisticsService.trackSearch(user.uid, 'Samarkand', testWeatherData);
    console.log('✓ Second search tracked');
    
    // Get updated stats
    console.log('4. Getting updated statistics...');
    const updatedStats = await statisticsService.getUserStatistics(user.uid);
    console.log('✓ Updated statistics:', updatedStats);
    
    console.log('=== AUTH TESTING COMPLETED ===');
    return { success: true, stats: updatedStats };
    
  } catch (error) {
    console.error('=== AUTH TESTING ERROR ===');
    console.error('Error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Check for specific Firebase errors
    if (error.code === 'permission-denied') {
      console.warn('🔥 PERMISSION DENIED - Firestore security rules need to be deployed!');
      console.warn('Run: firebase deploy --only firestore:rules');
    }
    
    console.error('=== AUTH TESTING ERROR END ===');
    return { success: false, error: error.message, code: error.code };
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.debugStatistics = debugStatistics;
  window.testWithAuth = testWithAuth;
  console.log('Debug functions available:');
  console.log('- window.debugStatistics()');
  console.log('- window.testWithAuth(user)');
}
