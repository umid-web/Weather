import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.scss';
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaUserCog } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  // Add dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Get user's first letter for avatar
  const getUserInitial = () => {
    if (!user?.displayName) return 'U';
    return user.displayName.charAt(0).toUpperCase();
  };

  const toggleProfileDropdown = (e) => {
    if (isAuthenticated) {
      e.stopPropagation();
      setProfileDropdownOpen(!profileDropdownOpen);
    } else {
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
      setMenuOpen(false);
      setProfileDropdownOpen(false);
    } else {
      navigate('/login');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking inside profile dropdown or modal
      if (event.target.closest('.profile-dropdown') || 
          event.target.closest('.modal-overlay') ||
          event.target.closest('.modal-content')) {
        return;
      }
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      
      {/* Mobile Menu Toggle */}
      <div className="mobile-menu-toggle" onClick={toggleMenu}>
        {menuOpen ? (
          <FontAwesomeIcon icon={faTimes} />
        ) : (
          <FontAwesomeIcon icon={faBars} />
        )}
      </div>

      {/* Mobile Menu */}
      <div className={`overlay ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
            <div className="mobile-menu-header">
              <h2 className="logo">Weather</h2>
              <div className="mobile-menu-actions">
                <div className="dark-mode-toggle mobile" onClick={toggleMode}>
                  {darkMode ? (
                    <i className="fa-solid fa-sun"></i>
                  ) : (
                    <i className="fa-solid fa-moon"></i>
                  )}
                </div>
              </div>
            </div>
            <ul className="mobile-nav-links">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? 'active nav__link' : 'nav__link'
                  }
                  onClick={toggleMenu}
                >
                  Bosh sahifa
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? 'active nav__link' : 'nav__link'
                  }
                  onClick={toggleMenu}
                >
                  Biz haqimizda
                </NavLink>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <button 
                      className="nav__link nav__button user-profile-btn"
                      onClick={handleProfileClick}
                    >
                      <FaUserCircle className="btn-icon" />
                      {user?.displayName || 'Profil'}
                    </button>
                  </li>
                  <li>
                    <button 
                      className="nav__link nav__button logout-btn"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="btn-icon" />
                      Chiqish
                    </button>
                  </li>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <li>
                    <button 
                      className="nav__link nav__button login-btn"
                      onClick={() => {
                        navigate('/login');
                        setMenuOpen(false);
                      }}
                    >
                      Kirish
                    </button>
                  </li>
                  <li>
                    <button 
                      className="nav__link nav__button register-btn"
                      onClick={() => {
                        navigate('/register');
                        setMenuOpen(false);
                      }}
                    >
                      Ro'yxatdan o'tish
                    </button>
                  </li>
                </>
              )}
            </ul>
      </div>

      {/* Desktop Navbar */}
      <div className="desktop-navbar">
        <div className="nav-logo">
          <NavLink to="/">
            <h2>Weather</h2>
          </NavLink>
        </div>
        
        <ul className="desktop-nav-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active nav__link" : "nav__link"
              }
            >
              Bosh sahifa
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "active nav__link" : "nav__link"
              }
            >
              Biz haqimizda
            </NavLink>
          </li>
        </ul>

        <div className="nav-actions">
          <div className="dark-mode-toggle" onClick={toggleMode}>
            {darkMode ? (
              <i className="fa-solid fa-sun" style={{ color: "var(--titleColor)" }}></i>
            ) : (
              <i className="fa-solid fa-moon" style={{ color: "var(--btnColor)" }}></i>
            )}
          </div>

          {isAuthenticated ? (
            <div className="user-menu-container" ref={dropdownRef}>
              <div className="user-menu" onClick={toggleProfileDropdown}>
                <div className="user-avatar">
                  {user?.displayName ? (
                    <div className="avatar-circle">{getUserInitial()}</div>
                  ) : (
                    <FaUserCircle className="default-avatar" />
                  )}
                </div>
                <span className="user-name">
                  {user?.displayName || 'Profil'}
                </span>
                <FaChevronDown className={`dropdown-arrow ${profileDropdownOpen ? 'open' : ''}`} />
              </div>
              
              <div className={`profile-dropdown ${profileDropdownOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {user?.displayName ? (
                        <div className="avatar-circle">{getUserInitial()}</div>
                      ) : (
                        <FaUserCircle className="default-avatar" />
                      )}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user?.displayName || 'Foydalanuvchi'}</div>
                      <div className="user-email">{user?.email || ''}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleProfileClick}>
                    <FaUserCog className="dropdown-icon" />
                    <span>Profil sozlamalari</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon" />
                    <span>Chiqish</span>
                  </button>
                </div>
            </div>
          ) : (
            <div className="auth-buttons">
              {/* <NavLink to="/login" className="login-button">
                Kirish
              </NavLink> */}
              <NavLink to="/register" className="register-button">
                Ro'yxatdan o'tish
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
