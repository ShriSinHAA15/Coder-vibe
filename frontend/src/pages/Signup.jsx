import { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reuse same CSS for styling

function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post('/auth/register', { username, email, password });
      alert('Account created! Please log in.');
      navigate('/');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Signup for <span>Code Vibe</span></h2>
        
        <input
          className="login-input"
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="login-input"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        
        <button className="login-button" onClick={handleSignup}>Signup</button>

        <p className="login-footer">
          Already have an account?{' '}
          <Link className="login-link" to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
