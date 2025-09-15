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
  const Api_key = "a0da998d604c8d0c60ea4b420652beeb";

  // useParams orqali city olinadi — URL: /service/:city
  const params = useParams();
  const rawCity = params.city || "";
  const city = rawCity ? decodeURIComponent(rawCity) : "";

  const [aqi, setAqi] = useState(null);
  const [extra, setExtra] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
            onClick={() => navigate(`/service/${encodeURIComponent(city)}`)}
            style={{ marginLeft: 8 }}
          >
            🔄 Yangilash
          </button>
        </div>
      </div>
    </div>
  );
};

export default Service;
