// src/pages/Leaderboard.jsx
import { useEffect, useState } from 'react';
import API from '../api';

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get('/progress/leaderboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(res.data || []);
      } catch (err) {
        console.error('❌ Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token]);

  if (loading) {
    return <p>Loading leaderboard...</p>;
  }

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>

      {users.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <ol>
          {users.map((u, index) => (
            <li key={u.user_id || index}>
              <strong>{u.username}</strong> — {u.solved_count} solved
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Leaderboard;