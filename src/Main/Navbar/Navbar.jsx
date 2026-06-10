import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.scss';
import {
  FaUserCircle,
  FaChevronDown,
  FaSignOutAlt,
  FaUserCog,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const getUserInitial = () => (user?.displayName ? user.displayName.charAt(0).toUpperCase() : '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);



  const toggleProfileDropdown = (e) => {
    if (!isAuthenticated) return navigate('/login');
    e.stopPropagation();
    setProfileDropdownOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) return navigate('/login');
    navigate('/profile');
    setMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      {/* Mobile toggle */}
      <div className="mobile-menu-toggle" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Mobile menu */}
      <div className={`overlay ${menuOpen ? 'active' : ''}`} onClick={toggleMenu} />
      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        <ul>
          <li><NavLink to="/" onClick={toggleMenu}>Bosh sahifa</NavLink></li>
          <li><NavLink to="/about" onClick={toggleMenu}>Biz haqimizda</NavLink></li>
        </ul>
      </div>

      {/* Desktop */}
      <div className="desktop-navbar">
        <NavLink to="/" className="logo">
          Weather
        </NavLink>
        <ul className="desktop-nav-links">
          <li>
            <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : undefined}>Bosh sahifa</NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : undefined}>Biz haqimizda</NavLink>
          </li>
        </ul>
        <div className="nav-actions">
           <button className="dark-mode-toggle" onClick={toggleMode}>🌙</button>
          {isAuthenticated ? (
            <div className="user-menu-container" ref={dropdownRef}>
              <div onClick={toggleProfileDropdown} className="user-menu">
                <div className="avatar-circle">
                  {getUserInitial() ? getUserInitial() : <FaUserCircle />}
                </div>
                <span>{user?.displayName || 'Profil'}</span>
                <FaChevronDown className="dropdown-arrow" />
              </div>
              {profileDropdownOpen && (
                <div className="profile-dropdown">
                  <button onClick={handleProfileClick}>
                    <FaUserCog /> Profile
                  </button>
                  <button onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/register">Ro'yxatdan o'tish</NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;