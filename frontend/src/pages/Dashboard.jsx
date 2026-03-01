// src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import confetti from 'canvas-confetti';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const SOLVED_STORAGE_KEY = (userId) => `codevibe_solved_user_${userId || 'guest'}`;

const Dashboard = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [solved, setSolved] = useState({});
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [flashType, setFlashType] = useState(null);
  const [message, setMessage] = useState(null);

  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchQuestionsAndProgress = async () => {
      try {
        const questionsRes = await API.get('/questions');
        const fetchedQuestions = questionsRes.data || [];
        setQuestions(fetchedQuestions);

        let solvedMap = {};
        if (user?.id) {
          try {
            const progressRes = await API.get(`/progress/all/${user.id}`);
            const solvedFromDB = progressRes.data
              .filter((q) => q.solved === 1)
              .map((q) => q.id);

            solvedFromDB.forEach((id) => (solvedMap[id] = true));
          } catch {
            const raw = localStorage.getItem(SOLVED_STORAGE_KEY(user?.id));
            if (raw) solvedMap = JSON.parse(raw);
          }
        }

        setSolved(solvedMap);

        if (location.state?.questionId) {
          const qIndex = fetchedQuestions.findIndex(
            (q) => q.id === location.state.questionId
          );
          if (qIndex !== -1) {
            setCurrentIndex(qIndex);
            return;
          }
        }

        const firstUnsolvedIndex = fetchedQuestions.findIndex(
          (q) => !solvedMap[q.id]
        );

        setCurrentIndex(firstUnsolvedIndex >= 0 ? firstUnsolvedIndex : 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsAndProgress();
  }, [user, location.state]);

  useEffect(() => {
    if (!user?.id) return;
    localStorage.setItem(SOLVED_STORAGE_KEY(user.id), JSON.stringify(solved));
  }, [solved, user]);

  const triggerCelebration = () => {
    const duration = 1500;
    const animationEnd = Date.now() + duration;
    const colors = ['#90ee90', '#ffffff'];

    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 150, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 150, origin: { x: 1 }, colors });

      if (Date.now() < animationEnd) requestAnimationFrame(frame);
    })();
  };

  const triggerFlash = (type) => {
    setFlashType(type);
    setTimeout(() => setFlashType(null), 4000);
  };

  const runSubmission = async () => {
    if (!questions.length) return;

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setOutput('Running...');
    setMessage(null);
    setRunning(true);

    try {
      const res = await API.post('/questions/submit', {
        user_id: user?.id || 1,
        question_id: currentQ.id,
        code,
        language,
      });

      const {
        output: out = '',
        success = false,
        keywordMissing = false,
        requiredKeyword = '',
      } = res.data || {};

      setOutput(out);

      const normalize = (str) =>
        (str || '')
          .trim()
          .split('\n')
          .map((line) => line.trim())
          .join('\n');

      const expected = normalize(currentQ.expected_output);
      const actual = normalize(out);

      if (success && actual === expected && !keywordMissing) {
        setSolved((prev) => ({ ...prev, [currentQ.id]: true }));
        setMessage({
          type: 'success',
          text: '✅ Correct! You can now proceed to the next question.',
        });
        triggerCelebration();
        triggerFlash('success');
      } else {
        let errorText =
          '❌ Wrong answer — check the output carefully and try again.';

        if (keywordMissing)
          errorText = `❌ You must use the required keyword: "${requiredKeyword}" in your solution.`;

        setMessage({ type: 'error', text: errorText });
        triggerFlash('error');
      }
    } catch (err) {
      console.error(err);
      setOutput('Server error while submitting.');
      setMessage({
        type: 'error',
        text: 'Server error while submitting. Try again.',
      });
      triggerFlash('error');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = () => runSubmission();

  const handleNext = () => {
    if (!solved[questions[currentIndex].id]) {
      alert('❌ Solve the current question before proceeding.');
      return;
    }

    const nextIndex = questions.findIndex(
      (q, idx) => idx > currentIndex && !solved[q.id]
    );

    if (nextIndex >= 0) {
      setCurrentIndex(nextIndex);
      setCode('');
      setOutput('');
      setMessage(null);
    } else {
      setMessage({
        type: 'info',
        text: '🎉 You have solved all available questions!',
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCode('');
      setOutput('');
      setMessage(null);
    }
  };

  if (loading)
    return <div className="dashboard-loading">Loading questions...</div>;

  if (!questions.length)
    return <div className="dashboard-loading">No questions available.</div>;

  const question = questions[currentIndex];
  const solvedCount = Object.keys(solved).length;

  return (
    <div className={`dashboard-page ${theme}`}>
      <Navbar />

      <div className={`dashboard-container ${theme}`}>
        {flashType && <div className={`flash-overlay ${flashType}`} />}

        <div className="dashboard-top-bar">
          <div className="dashboard-progress-container">
            <div className="dashboard-progress-text">
              <strong>Progress:</strong> Q{currentIndex + 1}/{questions.length}
            </div>
            <div className="dashboard-progress-solved">
              <strong>Solved:</strong> {solvedCount}
            </div>
          </div>

          <button
            className="progress-page-btn"
            onClick={() => navigate('/progress')}
          >
            📊 View Progress
          </button>
        </div>

        <h2 className="dashboard-title">
          Q{currentIndex + 1}: {question.title} {solved[question.id] && '✅'}
        </h2>

        <p className="dashboard-difficulty">
          <strong>Difficulty:</strong> {question.difficulty}
        </p>

        <pre className="dashboard-description">{question.description}</pre>

        {question.required_keywords && (
          <p className="dashboard-keyword-hint">
            💡 Hint: Your solution must include{' '}
            <code>{question.required_keywords}</code>
          </p>
        )}

        <div className="dashboard-select-language">
          <label>
            <strong>Select Language:</strong>{' '}
          </label>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={running}
          >
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        {language === 'java' && (
          <p className="dashboard-java-note">
            ⚠️ Note: In Java, your class name <u>must be</u> <code>Temp</code>
          </p>
        )}

        <textarea
          className="dashboard-textarea"
          rows="10"
          placeholder="Write your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="dashboard-buttons-row">
          <button onClick={handleSubmit} disabled={running}>
            {running ? 'Running...' : 'Run Code'}
          </button>

          <button onClick={handlePrev} disabled={currentIndex === 0}>
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!solved[question.id]}
            title={
              !solved[question.id]
                ? 'Solve current question to proceed'
                : 'Next question'
            }
          >
            Next
          </button>
        </div>

        {message && (
          <div className={`dashboard-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="dashboard-output">
          <h4>Output:</h4>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;