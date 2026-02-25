// src/pages/Login.jsx
import { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { email, password });
      console.log('Login response:', res.data); // Optional: for debugging

      if (!res.data.user || !res.data.token) {
        alert('Login failed: Invalid response from server.');
        return;
      }

      // ✅ Store full user object in localStorage
      const userObj = {
        id: res.data.user.id,
        username: res.data.user.username,
        email: res.data.user.email,
      };
      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.username); // for WelcomeScreen

      // ✅ Navigate to welcome page first
      navigate('/welcome');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Check your email and password.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">
          Login to <span>Code Vibe</span>
        </h2>

        <input
          className="login-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        <p className="login-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="login-link">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
