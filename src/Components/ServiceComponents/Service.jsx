import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Service.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Service = () => {
  const Api_key = import.meta.env.VITE_WEATHER_API_KEY;

  // useParams orqali city olinadi — URL: /service/:city
  const params = useParams();
  const rawCity = params.city || "";
  const city = rawCity ? decodeURIComponent(rawCity) : "";

  const [aqi, setAqi] = useState(null);
  const [extra, setExtra] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            city
          )}&limit=1&appid=${Api_key}`
        );
        if (!geoResponse.ok) throw new Error("Geocoding API ishlamadi!");
        const geoData = await geoResponse.json();
        if (!geoData.length) {
          setError("Shahar topilmadi.");
          setLoading(false);
          return;
        }
        const { lat, lon } = geoData[0];

        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${Api_key}`
        );
        const weatherData = await weatherRes.json();
        setExtra(weatherData);

        const airRes = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${Api_key}`
        );
        const airData = await airRes.json();
        setAqi(airData?.list?.[0]?.main?.aqi ?? null);

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${Api_key}`
        );
        const forecastData = await forecastRes.json();

        setHourlyData(forecastData.list.slice(0, 8));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Xatolik yuz berdi");
        setLoading(false);
      }
    };

    fetchData();
  }, [city, Api_key]);

  const getAqiText = (aqi) => {
    switch (aqi) {
      case 1:
        return "😃 Juda yaxshi";
      case 2:
        return "🙂 Yaxshi";
      case 3:
        return "😐 O‘rtacha";
      case 4:
        return "😷 Yomon";
      case 5:
        return "☠️ Juda yomon";
      default:
        return "Ma’lumot yo‘q";
    }
  };

  const chartData = {
    labels: hourlyData.map((d) => d.dt_txt.split(" ")[1].slice(0, 5)),
    datasets: [
      {
        label: "Harorat (°C)",
        data: hourlyData.map((d) => d.main.temp),
        // chart styling — agar siz o'zgartirmoqchi bo'lsangiz shu yerda
        borderColor: "blue",
        backgroundColor: "lightblue",
      },
    ],
  };

  return (
    <div className="service">
      <div className="container">
        <h1>{city}  Weather</h1>

        {!city && <p>❌ Shahar tanlanmagan. Iltimos, Home sahifadan shahar kiriting.</p>}

        {loading && <p>Yuklanmoqda...</p>}
        {error && <p style={{ color: "red" }}>❌ {error}</p>}

        {/* AQI */}
        {aqi && (
          <div className="aqi-box">
            <h2 className="title">Havo sifati indeksi (AQI)</h2>
            <p className="text">
              Daraja: {aqi} - {getAqiText(aqi)}
            </p>
          </div>
        )}

        {/* Qo‘shimcha ob-havo info */}
        {extra && (
          <div className="extra-info">
            <h2 className="title">{extra.name} - Qo‘shimcha ma’lumot</h2>
            <p className="text">🌡️ Harorat: {extra.main.temp}°C</p>
            <p className="text">📉 Bosim: {extra.main.pressure} hPa</p>
            <p className="text">💧 Namlik: {extra.main.humidity}%</p>
          </div>
        )}

        {/* Grafik */}
        {hourlyData.length > 0 && (
          <div className="chart-box">
            <h2 className="title">⏰ Soatlik harorat (24 soat)</h2>
            <Line data={chartData} />
          </div>
        )}

        {/* Sog‘liq bo‘yicha maslahat */}
        {aqi && (
          <div className="advice-box">
            <h2 className="title">🩺 Sog‘liq uchun maslahat</h2>
            {aqi >= 4 ? (
              <p className="text">😷 Niqob taqib yuring va ko‘proq uyda qoling!</p>
            ) : extra?.main.temp >= 35 ? (
              <p className="text">🥵 Issiq havo! Ko‘proq suv iching.</p>
            ) : extra?.main.temp <= 0 ? (
              <p className="text">🧣 Sovuq havo! Issiq kiyinib chiqing.</p>
            ) : (
              <p className="text">✅ Ob-havo yaxshi, bemalol sayr qilishingiz mumkin.</p>
            )}
          </div>
        )}

        <div className="buttons-box">
          <button onClick={() => navigate(-1)}>🔙 Orqaga</button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{ marginLeft: 8 }}
          >
            {showDetails ? '📊 Yashirish' : '📊 Qo\'shimcha ma\'lumotlar'}
          </button>
          <button
            onClick={() => navigate(`/service/${encodeURIComponent(city)}`)}
            style={{ marginLeft: 8 }}
          >
            🔄 Yangilash
          </button>
        </div>

        {/* Qo'shimcha detallik ma'lumotlar */}
        {showDetails && extra && (
          <div className="detailed-service-info">
            <h2 className="title">🌟 Batafsil ob-havo ma'lumotlari</h2>
            
            <div className="details-grid">
              <div className="detail-card">
                <h3>🌡️ Harorat tafsilotlari</h3>
                <p><strong>Joriy:</strong> {extra.main.temp}°C</p>
                <p><strong>His qilinadigan:</strong> {extra.main.feels_like}°C</p>
                <p><strong>Minimum:</strong> {extra.main.temp_min}°C</p>
                <p><strong>Maksimum:</strong> {extra.main.temp_max}°C</p>
              </div>

              <div className="detail-card">
                <h3>💨 Shamol ma'lumotlari</h3>
                <p><strong>Tezlik:</strong> {extra.wind?.speed || 'N/A'} m/s</p>
                <p><strong>Yo'nalish:</strong> {extra.wind?.deg || 'N/A'}°</p>
                <p><strong>Kuchilishi:</strong> {extra.wind?.gust || 'N/A'} m/s</p>
              </div>

              <div className="detail-card">
                <h3>🌍 Atmosfera ma'lumotlari</h3>
                <p><strong>Bosim:</strong> {extra.main.pressure} hPa</p>
                <p><strong>Dengiz sathi:</strong> {extra.main.sea_level || 'N/A'} hPa</p>
                <p><strong>Yerdan balandlik:</strong> {extra.main.grnd_level || 'N/A'} hPa</p>
                <p><strong>Namlik:</strong> {extra.main.humidity}%</p>
              </div>

              <div className="detail-card">
                <h3>☁️ Bulutlar va ko'rish</h3>
                <p><strong>Bulutlilik:</strong> {extra.clouds?.all || 'N/A'}%</p>
                <p><strong>Ko'rish masofasi:</strong> {extra.visibility ? (extra.visibility / 1000).toFixed(1) : 'N/A'} km</p>
                <p><strong>Ob-havo:</strong> {extra.weather?.[0]?.description || 'N/A'}</p>
                <p><strong>Tavsif:</strong> {extra.weather?.[0]?.main || 'N/A'}</p>
              </div>

              <div className="detail-card">
                <h3>🌅 Quyosh vaqt</h3>
                <p><strong>Quyosh chiqishi:</strong> {extra.sys?.sunrise ? new Date(extra.sys.sunrise * 1000).toLocaleTimeString('uz-UZ') : 'N/A'}</p>
                <p><strong>Quyosh botishi:</strong> {extra.sys?.sunset ? new Date(extra.sys.sunset * 1000).toLocaleTimeString('uz-UZ') : 'N/A'}</p>
                <p><strong>Mamlakat:</strong> {extra.sys?.country || 'N/A'}</p>
              </div>

              <div className="detail-card">
                <h3>📍 Geografik ma'lumotlar</h3>
                <p><strong>Shahar:</strong> {extra.name}</p>
                <p><strong>Koordinatalar:</strong> {extra.coord?.lat || 'N/A'}, {extra.coord?.lon || 'N/A'}</p>
                <p><strong>Timezone:</strong> {extra.timezone ? `UTC${extra.timezone >= 0 ? '+' : ''}${extra.timezone / 3600}` : 'N/A'}</p>
                <p><strong>Ma'lumot vaqti:</strong> {new Date(extra.dt * 1000).toLocaleString('uz-UZ')}</p>
              </div>
            </div>

            {/* Havo sifati tahlili */}
            {aqi && (
              <div className="aqi-analysis">
                <h3>🔬 Havo sifati tahlili</h3>
                <div className="aqi-details">
                  <p><strong>AQI Darajasi:</strong> {aqi} - {getAqiText(aqi)}</p>
                  <div className="aqi-recommendations">
                    <h4>🏥 Tavsiyalar:</h4>
                    {aqi === 1 && <p>✅ Havo sifati a'lo. Faol hayot tarzidan bahramand bo'ling!</p>}
                    {aqi === 2 && <p>👍 Havo sifati yaxshi. Ochiq havoda vaqt o'tkazish foydali.</p>}
                    {aqi === 3 && <p>⚠️ Havo sifati o'rtacha. Nafas yo'llari kasalliklari bo'lganlar ehtiyot bo'lishi kerak.</p>}
                    {aqi === 4 && <p>😷 Havo sifati yomon. Tashqariga chiqishda niqob taqing.</p>}
                    {aqi === 5 && <p>☠️ Havo sifati juda yomon. Uyda qoling, ventilyatsiyadan foydalaning.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Ob-havo bashorati */}
            {hourlyData.length > 0 && (
              <div className="hourly-forecast">
                <h3>⏰ Soatlik bashorat</h3>
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
    </div>
  );
};

export default Service;
