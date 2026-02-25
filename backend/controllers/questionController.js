const db = require('../db');

// Get all questions
exports.getQuestions = (req, res) => {
  const q = 'SELECT * FROM questions';
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

// Get one question
exports.getQuestion = (req, res) => {
  const q = 'SELECT * FROM questions WHERE id = ?';
  db.query(q, [req.params.id], (err, data) => {
    if (err || data.length === 0) return res.status(404).json('Not found');
    res.json(data[0]);
  });
};

// Submit solution
exports.submitCode = (req, res) => {
  const { user_id, question_id, code } = req.body;
  
  // Simple validation: if code includes "return" keyword, mark correct
  const isCorrect = code.toLowerCase().includes('return');

  const q = 'INSERT INTO submissions (user_id, question_id, code, is_correct) VALUES (?, ?, ?, ?)';
  db.query(q, [user_id, question_id, code, isCorrect], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: isCorrect ? 'Correct!' : 'Incorrect. Try again.' });
  });
};
