// backend/controllers/questionController.js

const { getDB } = require('../db');

// ================= GET ALL QUESTIONS =================
exports.getQuestions = async (req, res) => {
  const db = req.db || getDB();

  try {
    const [questions] = await db.query('SELECT * FROM questions ORDER BY id ASC');

    res.json(questions);

  } catch (err) {
    console.error('Get Questions Error:', err);
    res.status(500).json({ message: 'Server error while fetching questions' });
  }
};

// ================= GET ONE QUESTION =================
exports.getQuestion = async (req, res) => {
  const db = req.db || getDB();
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM questions WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error('Get Question Error:', err);
    res.status(500).json({ message: 'Server error while fetching question' });
  }
};

// ================= SUBMIT CODE =================
exports.submitCode = async (req, res) => {
  const db = req.db || getDB();

  const { user_id, question_id, code } = req.body;

  try {

    // simple validation
    const isCorrect = code.toLowerCase().includes('return');

    await db.query(
      'INSERT INTO submissions (user_id, question_id, code, is_correct) VALUES (?, ?, ?, ?)',
      [user_id, question_id, code, isCorrect]
    );

    res.json({
      success: true,
      correct: isCorrect,
      message: isCorrect
        ? '✅ Correct Solution!'
        : '❌ Incorrect. Try again.'
    });

  } catch (err) {
    console.error('Submit Code Error:', err);
    res.status(500).json({ message: 'Server error while submitting code' });
  }
};