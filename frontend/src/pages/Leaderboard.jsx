import { useEffect, useState } from 'react';
import API from '../api';

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await API.get('/progress/leaderboard');
      setUsers(res.data);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ol>
        {users.map((u, i) => (
          <li key={i}>{u.username} - {u.solved_count} solved</li>
        ))}
      </ol>
    </div>
  );
}

export default Leaderboard;
