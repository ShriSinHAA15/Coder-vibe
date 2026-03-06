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
        {/* Project Description */}
        <section className="about-card animate-zoom-in">
          <h2>💡 What is Code Vibe?</h2>
          <p>
            <strong>Code Vibe</strong> is an interactive coding platform designed for
            developers of all levels. Solve challenges from easy to hard, track your
            progress, and grow your problem-solving skills in a gamified environment.
          </p>
        </section>

        {/* Aim */}
        <section className="about-card animate-zoom-in delay-1">
          <h2>🎯 Aim of the Project</h2>
          <p>
            Our mission is to provide a structured, fun, and rewarding coding experience.
            Unlock challenges as you progress, track your stats, and compete with
            yourself or others — making learning coding measurable and exciting.
          </p>
        </section>

        {/* Owner */}
        <section className="about-card animate-zoom-in delay-2">
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

        {/* Footer / Tech Stack */}
        <section className="about-card animate-zoom-in delay-3">
          <h2>🛠 Built With</h2>
          <p>
            React, Node.js, MySQL, CSS Animations, and a sprinkle of creativity.  
            Code Vibe is continuously evolving — your feedback fuels improvement!
          </p>
        </section>
      </div>

      {/* Animated background shapes */}
      <div className="background-shapes">
        <span className="shape shape-1"></span>
        <span className="shape shape-2"></span>
        <span className="shape shape-3"></span>
        <span className="shape shape-4"></span>
      </div>
    </div>
  );
};

export default About;