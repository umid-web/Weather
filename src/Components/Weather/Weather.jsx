import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { weatherService } from '../../services/api';
import { statisticsService } from '../../services/statisticsService';
import './Weather.scss';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [hourlyData, setHourlyData] = useState([]);
  const [aqi, setAqi] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  
  const getWeather = async () => {
    if (!city.trim()) {
      setError('Iltimos, shahar nomini kiriting!');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await weatherService.getWeatherByCity(city);
      setWeather(data.current);
      setForecast(data.forecast);
      
      // Get hourly forecast and AQI data
      if (data.current.coord) {
        await getAdditionalData(data.current.coord.lat, data.current.coord.lon);
      }
      
      // Track the search using professional service
      if (currentUser) {
        await statisticsService.trackSearch(currentUser.uid, city.trim(), data.current);
      }
      
    } catch (error) {
      console.error('Xatolik yuz berdi:', error);
      setError(error.message || 'Ob-havo maʼlumotlarini olishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const getAdditionalData = async (lat, lon) => {
    const Api_key = import.meta.env.VITE_WEATHER_API_KEY;
    
    try {
      // Get hourly forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${Api_key}`
      );
      const forecastData = await forecastRes.json();
      setHourlyData(forecastData.list.slice(0, 8));

      // Get AQI data
      const airRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${Api_key}`
      );
      const airData = await airRes.json();
      setAqi(airData?.list?.[0]?.main?.aqi ?? null);
    } catch (error) {
      console.error('Additional data fetch error:', error);
    }
  };

  const getAqiText = (aqi) => {
    switch (aqi) {
      case 1:
        return "😃 Juda yaxshi";
      case 2:
        return "🙂 Yaxshi";
      case 3:
        return "😐 Oʻrtacha";
      case 4:
        return "😷 Yomon";
      case 5:
        return "☠️ Juda yomon";
      default:
        return "Maʼlumot yoʻq";
    }
  };

  const clearWeather = () => {
    setWeather(null);
    setForecast([]);
    setHourlyData([]);
    setAqi(null);
    setShowDetails(false);
    setCity('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWeather();
    }
  };

  const viewDetails = () => {
    if (!city.trim()) {
      setError('Iltimos, avval shahar nomini kiriting!');
      return;
    }
    setShowDetails(!showDetails);
  };

  return (
    <div className="weather-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Shahar nomini kiriting..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        <button 
          onClick={getWeather} 
          className="search-button"
          disabled={loading}
        >
          {loading ? 'Izlanyapti...' : 'Qidirish'}
        </button>
        <button 
          onClick={clearWeather} 
          className="clear-button"
          disabled={!weather && forecast.length === 0}
        >
          Tozalash
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {weather && (
        <div className="current-weather">
          <h2>{weather.name}, {weather.sys?.country}</h2>
          <div className="weather-main">
            <div className="temperature">
              {Math.round(weather.main?.temp)}°C
            </div>
            <div className="weather-details">
              <p>{weather.weather?.[0]?.description}</p>
              <p>Namlik: {weather.main?.humidity}%</p>
              <p>Shamol: {weather.wind?.speed} m/s</p>
              <p>Bosim: {weather.main?.pressure} hPa</p>
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          <h3>Keyingi 4 kunlik prognoz</h3>
          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-card">
                <p className="forecast-date">
                  {new Date(day.dt * 1000).toLocaleDateString('uz-UZ', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <p className="forecast-temp">{Math.round(day.main?.temp)}°C</p>
                <p className="forecast-desc">{day.weather?.[0]?.description}</p>
                <div className="forecast-details">
                  <span>⬇ {Math.round(day.main?.temp_min)}°C</span>
                  <span>⬆ {Math.round(day.main?.temp_max)}°C</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {weather && (
        <div className="details-button-container">
          <button onClick={viewDetails} className="details-button">
            {showDetails ? 'Yashirish ▲' : 'Batafsil maʼlumot ▼'}
          </button>
        </div>
      )}

      {showDetails && weather && (
        <div className="detailed-weather">
          <h3>🌤️ Batafsil ob-havo maʼlumotlari</h3>
          
          <div className="detailed-grid">
            <div className="detail-card">
              <h4>🌡️ Harorat</h4>
              <div className="detail-content">
                <p><strong>Joriy:</strong> {Math.round(weather.main?.temp)}°C</p>
                <p><strong>His qilinadigan:</strong> {Math.round(weather.main?.feels_like)}°C</p>
                <p><strong>Minimum:</strong> {Math.round(weather.main?.temp_min)}°C</p>
                <p><strong>Maksimum:</strong> {Math.round(weather.main?.temp_max)}°C</p>
              </div>
            </div>

            <div className="detail-card">
              <h4>💨 Shamol</h4>
              <div className="detail-content">
                <p><strong>Tezlik:</strong> {weather.wind?.speed} m/s</p>
                <p><strong>Yoʻnalish:</strong> {weather.wind?.deg}°</p>
                <p><strong>Shamol kuchilishi:</strong> {weather.wind?.gust || 'N/A'} m/s</p>
              </div>
            </div>

            <div className="detail-card">
              <h4>💧 Namlik</h4>
              <div className="detail-content">
                <p><strong>Namlik:</strong> {weather.main?.humidity}%</p>
                <p><strong>Bosim:</strong> {weather.main?.pressure} hPa</p>
                <p><strong>Dengiz sathidan balandlik:</strong> {weather.main?.sea_level || 'N/A'} m</p>
                <p><strong>Yerdan balandlik:</strong> {weather.main?.grnd_level || 'N/A'} m</p>
              </div>
            </div>

            <div className="detail-card">
              <h4>☁️ Bulutlar</h4>
              <div className="detail-content">
                <p><strong>Bulutlilik:</strong> {weather.clouds?.all}%</p>
                <p><strong>Ob-havo:</strong> {weather.weather?.[0]?.description}</p>
                <p><strong>Tavsif:</strong> {weather.weather?.[0]?.main}</p>
              </div>
            </div>

            <div className="detail-card">
              <h4>👁️ Koʻrish masofasi</h4>
              <div className="detail-content">
                <p><strong>Koʻrish masofasi:</strong> {weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A'} km</p>
              </div>
            </div>

            <div className="detail-card">
              <h4>🌅 Quyosh</h4>
              <div className="detail-content">
                <p><strong>Quyosh chiqishi:</strong> {weather.sys?.sunrise ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString('uz-UZ') : 'N/A'}</p>
                <p><strong>Quyosh botishi:</strong> {weather.sys?.sunset ? new Date(weather.sys.sunset * 1000).toLocaleTimeString('uz-UZ') : 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="additional-info">
            <h4>📍 Geografik maʼlumotlar</h4>
            <div className="geo-info">
              <p><strong>Shahar:</strong> {weather.name}, {weather.sys?.country}</p>
              <p><strong>Koordinatalar:</strong> {weather.coord?.lat || 'N/A'}, {weather.coord?.lon || 'N/A'}</p>
              <p><strong>Timezone:</strong> {weather.timezone ? `UTC${weather.timezone >= 0 ? '+' : ''}${weather.timezone / 3600}` : 'N/A'}</p>
              <p><strong>Maʼlumot vaqti:</strong> {new Date(weather.dt * 1000).toLocaleString('uz-UZ')}</p>
            </div>
          </div>

          {/* Havo sifati tahlili */}
          {aqi && (
            <div className="aqi-analysis">
              <h4>🔬 Havo sifati tahlili</h4>
              <div className="aqi-details">
                <p><strong>AQI Darajasi:</strong> {aqi} - {getAqiText(aqi)}</p>
                <div className="aqi-recommendations">
                  <h5>🏥 Tavsiyalar:</h5>
                  {aqi === 1 && <p>✅ Havo sifati a'lo. Faol hayot tarzidan bahramand bo'ling!</p>}
                  {aqi === 2 && <p>👍 Havo sifati yaxshi. Ochiq havoda vaqt o'tkazish foydali.</p>}
                  {aqi === 3 && <p>⚠️ Havo sifati o'rtacha. Nafas yo'llari kasalliklari bo'lganlar ehtiyot bo'lishi kerak.</p>}
                  {aqi === 4 && <p>😷 Havo sifati yomon. Tashqariga chiqishda niqob taqing.</p>}
                  {aqi === 5 && <p>☠️ Havo sifati juda yomon. Uyda qoling, ventilyatsiyadan foydalaning.</p>}
                </div>
              </div>
            </div>
          )}

          {/* Soatlik bashorat */}
          {hourlyData.length > 0 && (
            <div className="hourly-forecast">
              <h4>⏰ Soatlik bashorat</h4>
              <div className="hourly-grid">
                {hourlyData.map((hour, index) => (
                  <div key={index} className="hour-card">
                    <p className="hour-time">{new Date(hour.dt * 1000).toLocaleTimeString('uz-UZ', {hour: '2-digit', minute: '2-digit'})}</p>
                    <p className="hour-temp">{Math.round(hour.main.temp)}°C</p>
                    <p className="hour-desc">{hour.weather?.[0]?.description}</p>
                    <p className="hour-humidity">💧 {hour.main.humidity}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
