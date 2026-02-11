const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'a0da998d604c8d0c60ea4b420652beeb';

export const weatherService = {
  // Get city coordinates
  async getCityCoordinates(city) {
    try {
      const response = await fetch(
        `${GEO_API_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
      );
      if (!response.ok) throw new Error('Shahar koordinatalarini olishda xatolik');
      const data = await response.json();
      if (!data.length) throw new Error('Shahar topilmadi');
      return data[0];
    } catch (error) {
      console.error('Xatolik yuz berdi:', error);
      throw error;
    }
  },

  // Get current weather by coordinates
  async getCurrentWeather(lat, lon) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=uz`
      );
      if (!response.ok) throw new Error('Ob-havo maʼlumotlarini olishda xatolik');
      return await response.json();
    } catch (error) {
      console.error('Xatolik yuz berdi:', error);
      throw error;
    }
  },

  // Get 4-day forecast by coordinates
  async getWeatherForecast(lat, lon) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=uz`
      );
      if (!response.ok) throw new Error('Ob-havo prognozini olishda xatolik');
      const data = await response.json();
      return data.list
        .filter(item => item.dt_txt.includes('12:00:00'))
        .slice(0, 4);
    } catch (error) {
      console.error('Xatolik yuz berdi:', error);
      throw error;
    }
  },

  // Get weather by city (current + forecast)
  async getWeatherByCity(city) {
    try {
      const location = await this.getCityCoordinates(city);
      const [current, forecast] = await Promise.all([
        this.getCurrentWeather(location.lat, location.lon),
        this.getWeatherForecast(location.lat, location.lon)
      ]);
      return { current, forecast, location };
    } catch (error) {
      console.error('Ob-havoni olishda xatolik:', error);
      throw error;
    }
  }
};
