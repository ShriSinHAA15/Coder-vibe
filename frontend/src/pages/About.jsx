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

        {/* Left - What is Code Vibe */}
        <section className="about-card left-card animate-float-left">
          <h2>💡 What is Code Vibe?</h2>
          <p>
            <strong>Code Vibe</strong> is an interactive coding platform designed for developers of all levels. 
            Our mission is to make coding enjoyable and meaningful, helping users strengthen their problem-solving 
            skills and confidence. Solve challenges from easy to hard, track your progress, and practice consistently 
            to prepare for interviews and real-world programming tasks. Consistent practice and hands-on coding experience 
            are the keys to success, and Code Vibe provides a clean, structured, and motivating environment to grow as a developer.
          </p>
        </section>

        {/* Right - Project Owner */}
        <section className="about-card right-card animate-float-right delay-1">
          <h2>👩‍💻 Project Owner</h2>
          <div className="owner-details">
            <p><strong>Name:</strong> Shristy Sinha</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:shristysinha80921@gmail.com">shristysinha80921@gmail.com</a>
            </p>
          </div>
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