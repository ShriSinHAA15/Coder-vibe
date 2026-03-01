import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
  
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 4000); // ⏱️ 4 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="welcome-screen">
      <div className="welcome-box">
        <h1 className="welcome-title">Welcome, Coder <span>{username}</span> 👋</h1>
        <p className="welcome-quote">“Let the journey to code mastery begin.”</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
