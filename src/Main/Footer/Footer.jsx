import React from "react";
import "./Footer.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaTelegram, 
  FaGithub, 
  FaLinkedin, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaCalendarAlt,
  FaCloudSun,
  FaHome,
  FaUser,
  FaInfoCircle,
  FaChartLine,
  FaQuestionCircle
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const Footer = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletter = () => {
    if (!isAuthenticated) {
      navigate('/register');
    } else {
      // Agar foydalanuvchi ro'yxatdan o'tgan bo'lsa
      alert("Obunangiz uchun rahmat! Yangiliklar bizdan.");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="var(--primaryColor)" fillOpacity="0.1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="footer-content">
        <div className="container">
          {/* Top Section - Soddalashtirilgan */}
          <div className="footer-top">
            <div className="footer-brand">
              <div className="brand-logo">
                <FaCloudSun className="logo-icon" />
                <h2 className="logo-text">WeatherPro</h2>
              </div>
              <p className="brand-tagline">
                Ob-havo ma'lumotlari OpenWeather API orqali taqdim etiladi
              </p>
            </div>

            <div className="footer-newsletter">
              <h3>Yangiliklardan xabardor bo'ling</h3>
              <div className="newsletter-form">
                <button 
                  className="newsletter-btn"
                  onClick={handleNewsletter}
                >
                  {isAuthenticated ? "Siz obuna bo'lgansiz" : "Obuna bo'lish"}
                </button>
                {isAuthenticated && (
                  <p className="newsletter-thanks">
                    Obunangiz uchun rahmat! 💌
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Middle Section - Soddalashtirilgan */}
          <div className="footer-middle">
            <div className="footer-column">
              <h3 className="column-title">Asosiy</h3>
              <ul className="footer-links">
                <li>
                  <NavLink to="/" onClick={scrollToTop}>
                    <FaHome className="link-icon" />
                    <span>Bosh sahifa</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile" onClick={scrollToTop}>
                    <FaUser className="link-icon" />
                    <span>Profil</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" onClick={scrollToTop}>
                    <FaInfoCircle className="link-icon" />
                    <span>Biz haqimizda</span>
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="column-title">Statistika</h3>
              <ul className="footer-links">
                <li>
                  <NavLink to="/profile?tab=stats" onClick={scrollToTop}>
                    <FaChartLine className="link-icon" />
                    <span>Foydalanuvchi statistikasi</span>
                  </NavLink>
                </li>
                <li>
                  <a href="#top-cities">
                    <FaChartLine className="link-icon" />
                    <span>Eng ko'p qidirilgan shaharlar</span>
                  </a>
                </li>
                <li>
                  <a href="#monthly-stats">
                    <FaChartLine className="link-icon" />
                    <span>Oylik hisobotlar</span>
                  </a>
                </li>
              </ul>
            </div>


            <div className="footer-column">
              <h3 className="column-title">Bog'lanish</h3>
              <ul className="footer-contacts">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>Toshkent shahri, O'zbekiston</span>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <span>+998 90 160 05 28</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>tojimatovumidjon1@gmail.com</span>
                </li>
                <li>
                  <FaCalendarAlt className="contact-icon" />
                  <span>24/7 ishlaymiz</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section - Soddalashtirilgan */}
          <div className="footer-bottom">
            <div className="copyright">
              <p>
                © {currentYear} WeatherPro. Barcha huquqlar himoyalangan.
              </p>
              <p className="api-credit">
                Powered by OpenWeather API
              </p>
            </div>

            <div className="footer-social">
              <h4>Biz bilan bog'laning</h4>
              <div className="social-icons">
                <a 
                  href="https://t.me/umid_web" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Telegram"
                >
                  <FaTelegram className="social-icon" />
                  <span className="social-tooltip">Telegram</span>
                </a>
                <a 
                  href="https://github.com/umid-web" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="GitHub"
                >
                  <FaGithub className="social-icon" />
                  <span className="social-tooltip">GitHub</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/umid-web" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="social-icon" />
                  <span className="social-tooltip">LinkedIn</span>
                </a>
              </div>
            </div>

            <div className="footer-actions">
              <button className="back-to-top" onClick={scrollToTop}>
                Yuqoriga qaytish ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;