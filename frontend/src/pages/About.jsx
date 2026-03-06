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
            <strong>Code Vibe</strong> is an interactive coding platform designed for
            developers of all levels. Solve challenges from easy to hard, track your
            progress, and grow your problem-solving skills in a gamified environment.
          </p>
        </section>

        <section className="about-card animate-float-right delay-1">
          <h2>🎯 Aim of the Project</h2>
          <p>
            Our mission is to provide a structured, fun, and rewarding coding experience.
            Unlock challenges as you progress, track your stats, and compete with
            yourself or others — making learning coding measurable and exciting.
          </p>
        </section>

        <section className="about-card animate-float-left delay-2">
          <h2>👩‍💻 Project Owner</h2>
          <div className="owner-details">
            <p><strong>Name:</strong> Shri Sinha</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:shristysinha80921@gmail.com">shristysinha80921@gmail.com</a>
            </p>
            <p><strong>Role:</strong> Full Stack Developer & Project Creator</p>
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