// src/pages/Progress.jsx
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import './Progress.css';

function Progress() {
  const [questions, setQuestions] = useState([]);
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  // Read logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch all questions
        const questionsRes = await axios.get('http://localhost:5000/api/questions');
        setQuestions(questionsRes.data || []);

        // 2. Fetch solved questions for this user
        const progressRes = await axios.get(
          `http://localhost:5000/api/progress/all/${user.id}`
        );

        const solvedIds = (progressRes.data || [])
          .filter(q => q.solved === 1)
          .map(q => q.id);

        setSolvedQuestions(solvedIds);
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const solvedCount = solvedQuestions.length;

  if (!user?.id) {
    return (
      <div className={`progress-page ${theme}`}>
        <Navbar />
        <div className="progress-container">
          <p>Please log in to see your progress.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`progress-page ${theme}`}>
        <Navbar />
        <div className="progress-container">
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`progress-page ${theme}`}>
      {/* Navbar */}
      <Navbar />

      <div className="progress-container">
        <button
          className="back-dashboard-btn"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>

        <h2>YOUR PROGRESS</h2>
        <p className="progress-summary">
          Questions Solved: {solvedCount} / {questions.length}
        </p>

        <table className="progress-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title & Description</th>
              <th>Difficulty</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => {
              const isSolved = solvedQuestions.includes(q.id);

              return (
                <tr key={q.id}>
                  <td>Q{idx + 1}</td>
                  <td
                    className={isSolved ? 'question-link' : ''}
                    style={isSolved ? { cursor: 'pointer', color: '#007bff' } : {}}
                    onClick={() => {
                      if (isSolved) {
                        // ✅ Pass questionId instead of index
                        navigate('/dashboard', { state: { questionId: q.id } });
                      }
                    }}
                  >
                    <strong>{q.title}</strong>
                    <br />
                    <span className="question-description">{q.description}</span>
                  </td>
                  <td>{q.difficulty}</td>
                  <td className={`status ${isSolved ? 'solved' : 'unsolved'}`}>
                    {isSolved ? '✅ Solved' : '❌ Pending'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Progress;
