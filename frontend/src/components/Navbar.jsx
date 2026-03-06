// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from './logocv.jpg'; // ✅ Import image from src/components

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-left">
        {/* ✅ Logo and title */}
        <img src={logo} alt="Code Vibe Logo" className="navbar-logo" />
        <span className="navbar-title">CODE-VIBE</span>
      </div>

      <div className="navbar-right">
        {/* About Page Link */}
        <button className="navbar-btn" onClick={() => navigate('/about')}>
          About
        </button>

        {/* Theme Toggle */}
        <button className="navbar-btn" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>

        {/* Logout */}
        <button className="navbar-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;