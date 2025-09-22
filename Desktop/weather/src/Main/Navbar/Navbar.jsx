import React, { useState, useEffect } from "react";
import "./Navbar.scss";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // modal holati

  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // body ga class qo‘shib turish
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="navbar">
        {menuOpen && <div className="overlay"></div>}
      {/* MODAL */}
      <div className={`modal ${menuOpen ? "active" : ""}`}>
        <h2 className="logo">Weather</h2>
        <ul>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "active nav__link" : "nav__link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "active nav__link" : "nav__link"
            }
          >
            About
          </NavLink>
        </ul>
        {/* Faqat Back tugmasi yopadi */}
        <button onClick={() => setMenuOpen(false)}>🔙Back</button>
      </div>

      {/* NAVBAR */}
      <div className="container">
        <h2 className="nav__logo">Weather</h2>
        <ul className="desktop-menu">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "active nav__link" : "nav__link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "active nav__link" : "nav__link"
            }
          >
            About
          </NavLink>
        </ul>

        <div className="corner">
          <div className="dark-mode" onClick={toggleMode}>
            {darkMode ? (
              <i
                className="fa-solid fa-sun"
                style={{ color: "var(--titleColor)" }}
              ></i>
            ) : (
              <i
                className="fa-solid fa-moon"
                style={{ color: "var(--btnColor)" }}
              ></i>
            )}
          </div>

          <i className="fa-solid fa-bars" onClick={toggleMenu}></i>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
