// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Question from './pages/Question';
import Progress from './pages/Progress';
import Leaderboard from './pages/Leaderboard';
import WelcomeScreen from './pages/WelcomeScreen';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser?.id) setUser(storedUser);
      } catch (err) {
        console.error('❌ Error fetching user from localStorage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div>Loading user info...</div>;

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Front Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Welcome Page */}
          <Route
            path="/welcome"
            element={user ? <WelcomeScreen user={user} /> : <Navigate to="/login" />}
          />

          {/* Main App Pages */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/question/:id"
            element={user ? <Question user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/progress"
            element={user ? <Progress user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/leaderboard"
            element={user ? <Leaderboard user={user} /> : <Navigate to="/login" />}
          />

          {/* Redirect unknown routes */}
          <Route
            path="*"
            element={<Navigate to={user ? '/welcome' : '/login'} />}
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
