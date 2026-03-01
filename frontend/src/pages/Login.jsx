// src/pages/Login.jsx
import { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('⚠️ Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const res = await API.post('/auth/login', {
        email,
        password,
      });

      const { user, token } = res.data;

      if (!user || !token) {
        alert('Login failed: Invalid server response');
        return;
      }

      // ✅ Store complete user object
      const userObj = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('userId', user.id); // ⭐ important for Question.jsx
      localStorage.setItem('token', token);
      localStorage.setItem('username', user.username);

      // ✅ Go to welcome screen
      navigate('/welcome');

    } catch (err) {
      console.error('❌ Login error:', err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('❌ Login failed. Check your credentials or server.');
      }
    } finally {
      setLoading(false);
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="login-footer">
          Don’t have an account?{' '}
          <Link to="/signup" className="login-link">
            Signup
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;