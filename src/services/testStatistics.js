// Test file for statistics service
import { statisticsService } from './statisticsService.js';

// Test data
const testUserId = 'test-user-123';
const testCity = 'Tashkent';
const testWeatherData = {
  weather: [{ description: 'clear sky' }],
  main: { temp: 25, humidity: 60 },
  wind: { speed: 3.5 }
};

// Test functions
export const testStatisticsService = async () => {
  console.log('Testing Statistics Service...');
  
  try {
    // Test 1: Track a search
    console.log('Test 1: Tracking search...');
    await statisticsService.trackSearch(testUserId, testCity, testWeatherData);
    console.log('✓ Search tracking completed');
    
    // Test 2: Get user statistics
    console.log('Test 2: Getting user statistics...');
    const stats = await statisticsService.getUserStatistics(testUserId);
    console.log('✓ User statistics retrieved:', stats);
    
    // Test 3: Track another search
    console.log('Test 3: Tracking another search...');
    await statisticsService.trackSearch(testUserId, 'Samarkand', testWeatherData);
    console.log('✓ Second search tracking completed');
    
    // Test 4: Get updated statistics
    console.log('Test 4: Getting updated statistics...');
    const updatedStats = await statisticsService.getUserStatistics(testUserId);
    console.log('✓ Updated statistics:', updatedStats);
    
    console.log('All tests completed successfully!');
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
};

// Test with error cases
export const testErrorHandling = async () => {
  console.log('Testing error handling...');
  
  try {
    // Test with no userId
    await statisticsService.trackSearch(null, testCity, testWeatherData);
    console.log('✓ Handled null userId correctly');
    
    // Test with no city
    await statisticsService.trackSearch(testUserId, null, testWeatherData);
    console.log('✓ Handled null city correctly');
    
    // Test with no weatherData
    await statisticsService.trackSearch(testUserId, testCity, null);
    console.log('✓ Handled null weatherData correctly');
    
    // Test getting stats for non-existent user
    const stats = await statisticsService.getUserStatistics('non-existent-user');
    console.log('✓ Handled non-existent user correctly:', stats);
    
    console.log('Error handling tests completed successfully!');
    return true;
  } catch (error) {
    console.error('Error handling test failed:', error);
    return false;
  }
};
