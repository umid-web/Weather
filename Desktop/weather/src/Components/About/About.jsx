import React from "react";
import "./About.scss";

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
 <h1 className="about-title">🌦 About This Weather App</h1>

      <p className="about-description">
        Ushbu loyiha foydalanuvchilarga shahar nomi bo‘yicha ob-havo
        ma’lumotlarini tez va aniq ko‘rsatish uchun ishlab chiqilgan.
      </p>

      <div className="tech-box">
        <h2 className="tech-title">🛠 Foydalanilgan Texnologiyalar</h2>
        <ul>
          <li>⚛️ React.js</li>
          <li>🎨 SCSS (Sass)</li>
          <li>☁️ RapidAPI (OpenWeather API)</li>
        </ul>
      </div>

      <div className="api-info">
        <h2 className="api-title">🔗 API Manbasi</h2>
        <p className="api-description">
          Ob-havo ma’lumotlari <span>OpenWeather API</span> orqali olinadi.
        </p>
      </div>

      <div className="author-box">
        <h2 className="author-title">👨‍💻 Loyiha Yaratuvchisi</h2>
        <p className="author-description">Ushbu ilova Umidjon Tojimatov tomonidan o‘rganish va tajriba uchun ishlab chiqildi.</p>
        <a className="author-email" href="mailto:umidjontojimatov1@gmail.com">✉️ Email: umidjontojimatov1@gmail.com</a>
      </div>
      </div>
    </div>
  );
};

export default About;
