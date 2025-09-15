import React from "react";
import "./Footer.scss";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* 🔹 Chap qism */}
        <div className="footer-left">
          <h2 className="logo">WeatherApp</h2>
          <p>Ob-havo ma'lumotlari OpenWeather API orqali olinadi.</p>
        </div>

        {/* 🔹 O'rta qism */}
        <div className="footer-center">
          <h3>Foydali havolalar</h3>
          <ul>
            <NavLink to="/"><li>Bosh sahifa</li></NavLink>
            <NavLink to="/about"><li>Biz haqimizda</li></NavLink>
            <NavLink to="#"><li>Aloqa</li></NavLink>
          </ul>
        </div>

        {/* 🔹 O'ng qism */}
        <div className="footer-right">
          <h3>Bog‘lanish</h3>
          <p>Email: info@weatherapp.com</p>
          <p>Telefon: +998 90 123 45 67</p>
          <div className="socials">
            <NavLink to="https://t.me/umid_web"><i className="fab fa-telegram"></i></NavLink>
            <NavLink to="https://github.com/umid-web"><i className="fab fa-github"></i></NavLink>
            <NavLink to="https://www.linkedin.com/in/umid-web"><i className="fab fa-linkedin"></i></NavLink>
          </div>
        </div>
      </div>

      {/* 🔹 Pastki qism */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} WeatherApp. Barcha huquqlar himoyalangan.</p>
      </div>
    </footer>
  );

};

export default Footer;
