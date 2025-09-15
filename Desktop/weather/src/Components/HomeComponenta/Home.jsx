import React, { useState } from "react";
import "../HomeComponenta/Home.scss";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const Api_key = "a0da998d604c8d0c60ea4b420652beeb";
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const navigate = useNavigate();

  const getWeather = async () => {
    if (!city.trim()) {
      alert("❌ Shahar nomini kiriting!");
      return;
    }
    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          city
        )}&limit=1&appid=${Api_key}`
      );
      if (!geoResponse.ok) throw new Error("Geocoding API ishlamadi!");
      const geoData = await geoResponse.json();
      if (!geoData.length) {
        alert("❌ Shahar topilmadi!");
        return;
      }
      const { lat, lon } = geoData[0];
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${Api_key}`
      );
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

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
      alert("❌ Xatolik yuz berdi: " + error.message);
    }
  };

  const clearWeather = () => {
    setWeather(null);
    setForecast([]);
    setCity("");
  };

  // -> tugma bilan ham yo'naltirish (Link o'rniga)
  const goToService = () => {
    if (!city.trim()) {
      alert("❌ Shahar nomini kiriting!");
      return;
    }
    navigate(`/service/${encodeURIComponent(city.trim())}`);
  };

  return (
    <div style={{ paddingTop: "100px" }} className="home">
      <div className="container">
        <h1 className="title">Which city do you want to know the weather in?</h1>
        <input
          type="text"
          placeholder="Shahar nomini kiriting..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather} className="search-button">
          Qidirish
        </button>
        <button onClick={clearWeather} className="clear-button">
          Clear
        </button>

        {/* Hozirgi ob-havo */}
        {weather && weather.main && (
          <div className="weather-info">
            <h2 className="city">{weather.name}</h2>
            <p className="temp">Harorat: {weather.main.temp}°C</p>
            <p className="description">
              Holat: {weather.weather?.[0]?.description}
            </p>
          </div>
        )}

        {/* 4 kunlik prognoz */}
        {forecast.length > 0 && (
          <div className="forecast">
            <h3>Keyingi 4 kunlik prognoz</h3>
            <div className="forecast-grid">
              {forecast.map((day, i) => (
                <div key={i} className="forecast-card">
                  <p>{day.dt_txt.split(" ")[0]}</p>
                  <p>{day.main.temp}°C</p>
                  <p>{day.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yo'naltirish: Link bilan (useParams uchun) */}
        <div className="service-link-box">
          <Link
            to={`/service/${encodeURIComponent(city.trim())}`}
            className="service-link"
            onClick={(e) => {
              if (!city.trim()) {
                e.preventDefault();
                alert("❌ Shahar nomini kiriting!");
              }
            }}
          >
            Batafsil ma’lumotni ko‘rish →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
