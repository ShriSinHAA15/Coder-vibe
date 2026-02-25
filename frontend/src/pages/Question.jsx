import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../api';

function Question() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await API.get(`/questions/${id}`);
        setQuestion(res.data);
      } catch (err) {
        console.error('❌ Error fetching question:', err);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('⚠️ Please log in first');
        return;
      }

      const res = await API.post('/progress/update', {
        user_id: userId,
        question_id: id,
        code,
        solved: true // mark as solved (or run backend check for correctness)
      });

      alert(res.data.message || 'Submission saved!');
    } catch (err) {
      console.error('❌ Error submitting code:', err);
      alert('Failed to submit code');
    }
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div>
      <h2>{question.title}</h2>
      <p>{question.description}</p>

      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        rows={10}
        cols={60}
      />
      <br />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Question;
