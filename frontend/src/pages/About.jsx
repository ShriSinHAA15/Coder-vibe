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

      <div className="about-container">
        <h1 className="about-title">About Code Vibe</h1>

        <p className="about-description">
          <strong>Code Vibe</strong> is a hands-on coding platform designed to help programmers
          of all levels improve their problem-solving skills. It provides a curated set of
          coding challenges ranging from easy to hard, allowing users to practice, learn,
          and track their progress in real-time.
        </p>

        <section className="about-aim">
          <h2>🎯 Aim of the Project</h2>
          <p>
            The main goal of Code Vibe is to provide a simple yet effective environment
            for coding practice, progress tracking, and skill-building. We aim to make
            coding accessible, fun, and measurable with a system that unlocks questions
            as you solve previous ones — much like a gamified learning experience.
          </p>
        </section>

        <section className="about-owner">
          <h2>👩‍💻 Project Owner</h2>
          <p>
            <strong>Name:</strong> Shri Sinha <br />
            <strong>Email:</strong> <a href="mailto:shristysinha80921@gmail.com">shristysinha80921@gmail.com</a> <br />
            <strong>Role:</strong> Full Stack Developer & Project Creator
          </p>
        </section>

        <section className="about-footer">
          <p>
            Built with ❤️ using React, Node.js, MySQL, and a dash of creativity.
            Code Vibe is continuously evolving — your feedback helps make it better!
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;