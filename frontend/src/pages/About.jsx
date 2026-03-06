// src/pages/About.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import './About.css';

const About = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`about-page ${theme}`}>
      <Navbar />

      <div className="about-hero">
        <h1 className="about-title animate-fade-in">🚀 Welcome to Code Vibe</h1>
        <p className="about-subtitle animate-slide-in">
          Elevate your coding skills, one challenge at a time.
        </p>
      </div>

      <div className="about-container">
        {/* Cards */}
        <section className="about-card animate-float-left">
          <h2>💡 What is Code Vibe?</h2>
          <p>
            <strong>Code Vibe</strong> is an interactive coding platform designed for developers of all levels. Our mission is to make coding enjoyable and meaningful, helping users strengthen their problem-solving skills and confidence. By solving challenges from easy to hard, tracking your progress, and practicing consistently, you can prepare effectively for technical interviews and real-world programming tasks. We believe that consistent practice and hands-on coding experience are the keys to success, and our platform provides a simple, structured, and motivating way to grow as a developer. Whether you are just starting out or aiming to land your dream job, Code Vibe encourages you to learn, experiment, and improve every day.
          </p>
        </section>

        <section className="about-card animate-float-left delay-2">
          <h2>👩‍💻 Project Owner</h2>
          <div className="owner-details">
            <p><strong>Name:</strong> Shristy Sinha</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:shristysinha80921@gmail.com">shristysinha80921@gmail.com</a>
            </p>
          </div>
        </section>

        <section className="about-card animate-float-right delay-3">
          <h2>🛠 Built With</h2>
          <p>
            React, Node.js, MySQL, CSS Animations, and creativity.  
            Code Vibe evolves continuously — your feedback fuels improvement!
          </p>
        </section>
      </div>

      {/* Animated background bubbles */}
      <div className="background-bubbles">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={`bubble bubble-${i + 1}`}></span>
        ))}
      </div>
    </div>
  );
};

export default About;