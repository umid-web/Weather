import React, { useState } from "react";
import "../HomeComponenta/Home.scss";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const Api_key = "a0da998d604c8d0c60ea4b420652beeb";
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getWeather = async () => {
    if (!city.trim()) {
      setError("❌ Shahar nomini kiriting!");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          city
        )}&limit=1&appid=${Api_key}`
      );
      
      if (!geoResponse.ok) throw new Error("Geocoding API ishlamadi!");
      const geoData = await geoResponse.json();
      
      if (!geoData.length) {
        setError("❌ Shahar topilmadi!");
        setLoading(false);
        return;
      }
      
      const { lat, lon } = geoData[0];
      
      // Hozirgi ob-havo ma'lumotlari
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${Api_key}`
      );
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

      // 4 kunlik prognoz
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${Api_key}`
      );
      const forecastData = await forecastResponse.json();

      const daily = forecastData.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .slice(0, 4);

      setForecast(daily);
    } catch (error) {
      console.error("❌ Error:", error);
      setError("❌ Xatolik yuz berdi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearWeather = () => {
    setWeather(null);
    setForecast([]);
    setCity("");
    setError(null);
  };

  const goToService = () => {
    if (!city.trim()) {
      setError("❌ Shahar nomini kiriting!");
      return;
    }
    navigate(`/service/${encodeURIComponent(city.trim())}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  // Ob-havo ikonini olish
  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes("clear")) return "☀️";
    if (desc.includes("cloud")) return "☁️";
    if (desc.includes("rain")) return "🌧️";
    if (desc.includes("snow")) return "❄️";
    if (desc.includes("thunderstorm")) return "⛈️";
    if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
    return "⛅";
  };

  return (
    <div style={{ paddingTop: "100px" }} className="home">
      <div className="container">
        <h1 className="title">Qaysi shaharning ob-havosini bilmoqchisiz?</h1>
        
        {/* Xato xabari */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Qidiruv formasi */}
        <div className="search-form">
          <input
            type="text"
            placeholder="Shahar nomini kiriting..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button 
            onClick={getWeather} 
            className="search-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Qidirilmoqda...
              </>
            ) : (
              "Qidirish"
            )}
          </button>
          <button 
            onClick={clearWeather} 
            className="clear-button"
            disabled={loading || (!weather && !forecast.length)}
          >
            Tozalash
          </button>
        </div>

        {/* Hozirgi ob-havo */}
        {weather && weather.main && (
          <div className="weather-info">
            <h2 className="city">{weather.name}, {weather.sys?.country}</h2>
            <p className="temp">{Math.round(weather.main.temp)}°C</p>
            <p className="description">
              {getWeatherIcon(weather.weather?.[0]?.description)} 
              {weather.weather?.[0]?.description}
            </p>
            
            {/* Qo'shimcha ma'lumotlar */}
            <div className="weather-details">
              <div className="detail-item">
                <span className="label">Namlik</span>
                <span className="value">{weather.main.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="label">Shamol</span>
                <span className="value">{weather.wind?.speed} m/s</span>
              </div>
              <div className="detail-item">
                <span className="label">Bosim</span>
                <span className="value">{weather.main.pressure} hPa</span>
              </div>
              <div className="detail-item">
                <span className="label">Ko'rish</span>
                <span className="value">{weather.visibility / 1000} km</span>
              </div>
            </div>
          </div>
        )}

        {/* 4 kunlik prognoz */}
        {forecast.length > 0 && (
          <div className="forecast">
            <h3>Keyingi 4 kunlik prognoz</h3>
            <div className="forecast-grid">
              {forecast.map((day, i) => (
                <div key={i} className="forecast-card">
                  <p>{new Date(day.dt_txt).toLocaleDateString('uz-UZ', { 
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short'
                  })}</p>
                  <div className="forecast-icon">
                    {getWeatherIcon(day.weather[0].description)}
                  </div>
                  <p>{Math.round(day.main.temp)}°C</p>
                  <p>{day.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yo'naltirish: Batafsil ma'lumot */}
        <div className="service-link-box">
          <Link
            to={`/service/${encodeURIComponent(city.trim())}`}
            className="service-link"
            onClick={(e) => {
              if (!city.trim()) {
                e.preventDefault();
                setError("❌ Shahar nomini kiriting!");
              }
            }}
            aria-disabled={!city.trim()}
          >
            Batafsil ma'lumotni ko'rish →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;