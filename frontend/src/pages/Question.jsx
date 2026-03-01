// src/pages/Question.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../api';

function Question() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // ✅ Fetch question
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await API.get(`/questions/${id}`);
        setQuestion(res.data);
      } catch (err) {
        console.error('❌ Error fetching question:', err);
        alert('Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  // ✅ Submit solution
  const handleSubmit = async () => {
    if (!user?.id || !token) {
      alert('⚠️ Please login first');
      navigate('/login');
      return;
    }

    if (!code.trim()) {
      alert('⚠️ Code cannot be empty');
      return;
    }

    try {
      setSubmitting(true);

      const res = await API.post(
        '/progress/update',
        {
          user_id: user.id,
          question_id: id,
          code: code,
          solved: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || '✅ Submission saved!');
      navigate('/progress');

    } catch (err) {
      console.error('❌ Error submitting code:', err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('❌ Submission failed. Try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Loading state
  if (loading) return <p>Loading question...</p>;

  // ✅ Safety check
  if (!question) return <p>Question not found</p>;

  return (
    <div className="question-container">
      <button onClick={() => navigate('/dashboard')}>
        ⬅ Back to Dashboard
      </button>

      <h2>{question.title}</h2>

      <p>{question.description}</p>

      <p><strong>Difficulty:</strong> {question.difficulty}</p>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={12}
        placeholder="Write your code here..."
        style={{ width: '100%', marginTop: '10px' }}
      />

      <br />

      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Solution'}
      </button>
    </div>
  );
}

export default Question;