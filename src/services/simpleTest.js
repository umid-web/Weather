// Simple test for statistics service
import { statisticsService } from './statisticsService';

export const simpleTest = async () => {
  console.log('🧪 SIMPLE STATISTICS TEST');
  
  // Test 1: Default stats
  console.log('1. Testing default stats...');
  const defaultStats = statisticsService.getDefaultStats();
  console.log('✓ Default stats:', defaultStats);
  
  // Test 2: Get stats without user
  console.log('2. Testing get stats without user...');
  const noUserStats = await statisticsService.getUserStatistics(null);
  console.log('✓ No user stats:', noUserStats);
  
  // Test 3: Track search without user
  console.log('3. Testing track search without user...');
  await statisticsService.trackSearch(null, 'Test City', { weather: [{}], main: {}, wind: {} });
  console.log('✓ Track search without user completed');
  
  console.log('✅ Simple test completed successfully!');
  return true;
};

// Test with mock user
export const mockUserTest = async () => {
  console.log('🧪 MOCK USER TEST');
  
  const mockUser = { uid: 'mock-user-123', email: 'mock@test.com' };
  const mockWeatherData = {
    weather: [{ description: 'sunny' }],
    main: { temp: 30, humidity: 50 },
    wind: { speed: 2 }
  };
  
  try {
    // Test 1: Track search
    console.log('1. Tracking search for mock user...');
    await statisticsService.trackSearch(mockUser.uid, 'Tashkent', mockWeatherData);
    console.log('✓ Search tracked');
    
    // Test 2: Get stats
    console.log('2. Getting stats for mock user...');
    const stats = await statisticsService.getUserStatistics(mockUser.uid);
    console.log('✓ Stats retrieved:', stats);
    
    console.log('✅ Mock user test completed!');
    return { success: true, stats };
    
  } catch (error) {
    console.error('❌ Mock user test failed:', error);
    
    if (error.code === 'permission-denied') {
      console.warn('🔥 FIRESTORE PERMISSION ERROR!');
      console.warn('You need to deploy Firestore security rules:');
      console.warn('1. Install Firebase CLI: npm install -g firebase-tools');
      console.warn('2. Login: firebase login');
      console.warn('3. Deploy rules: firebase deploy --only firestore:rules');
    }
    
    return { success: false, error: error.message, code: error.code };
  }
};

// Global access
if (typeof window !== 'undefined') {
  window.simpleTest = simpleTest;
  window.mockUserTest = mockUserTest;
  console.log('🧪 Simple test functions ready:');
  console.log('- window.simpleTest() - Basic functionality test');
  console.log('- window.mockUserTest() - Test with mock user (requires Firestore rules)');
}
