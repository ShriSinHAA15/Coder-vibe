import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import './About.css';

const About = () => {
  const { theme } = useContext(ThemeContext);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--mouse-x', `${mousePos.x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${mousePos.y}px`);
  }, [mousePos]);

  return (
    <div className={`about-page ${theme}`} onMouseMove={handleMouseMove}>
      <Navbar />

      {/* Hero */}
      <div className="about-hero">
        <h1 className="about-title animate-fade-in">🚀 Welcome to Code Vibe</h1>
        <p className="about-subtitle animate-slide-in">
          Elevate your coding skills and confidently prepare for your dream job.
        </p>
      </div>

      {/* Cards */}
      <div className="about-container">
        <section className="about-card animate-float-left">
          <h2>💡 What is Code Vibe?</h2>
          <p>
            <strong>Code Vibe</strong> is an interactive coding platform for developers of all levels. 
            Our mission is to make coding enjoyable and meaningful, helping users strengthen 
            problem-solving skills, gain confidence, and prepare for interviews. By practicing 
            consistently and tackling challenges from easy to hard, users grow their programming 
            skills while gaining real hands-on experience. Whether you're a beginner or aiming 
            to land your dream job, Code Vibe encourages daily learning, experimentation, and 
            growth as a developer.
          </p>
        </section>

        <section className="about-card animate-float-right">
          <h2>👩‍💻 Project Owner</h2>
          <div className="owner-details">
            <p><strong>Name:</strong> Shri Sinha</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:shristysinha80921@gmail.com">shristysinha80921@gmail.com</a>
            </p>
          </div>
        </section>
      </div>

      {/* Animated background bubbles */}
      <div className="background-bubbles">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} className={`bubble bubble-${i + 1}`}></span>
        ))}
      </div>
    </div>
  );
};

export default About;