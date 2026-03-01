// src/pages/Progress.jsx
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { ThemeContext } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import './Progress.css';

function Progress() {
  const [questions, setQuestions] = useState([]);
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // ✅ Fetch all questions
        const questionsRes = await API.get('/questions');
        setQuestions(questionsRes.data || []);

        // ✅ Fetch solved progress
        const progressRes = await API.get(
          `/progress/all/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const solvedIds = (progressRes.data || [])
          .filter((q) => q.solved === 1)
          .map((q) => q.id);

        setSolvedQuestions(solvedIds);
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  const solvedCount = solvedQuestions.length;

  // 🔐 If not logged in
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

  // ⏳ Loading state
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
                    style={
                      isSolved
                        ? { cursor: 'pointer', color: '#007bff' }
                        : {}
                    }
                    onClick={() => {
                      if (isSolved) {
                        navigate('/dashboard', {
                          state: { questionId: q.id },
                        });
                      }
                    }}
                  >
                    <strong>{q.title}</strong>
                    <br />
                    <span className="question-description">
                      {q.description}
                    </span>
                  </td>

                  <td>{q.difficulty}</td>

                  <td
                    className={`status ${
                      isSolved ? 'solved' : 'unsolved'
                    }`}
                  >
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