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
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* ✅ Use imported image */}
        <img src={logo} alt="Code Vibe Logo" className="navbar-logo" />
        <span className="navbar-title">CODE-VIBE</span>
      </div>

      <div className="navbar-right">
        <button className="navbar-btn" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
        <button className="navbar-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
