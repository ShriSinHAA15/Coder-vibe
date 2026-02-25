const { getDB } = require('../db');

// ✅ Update progress when user solves a question
exports.updateProgress = async (req, res) => {
  try {
    const db = getDB();
    const { user_id, question_id, solved, code } = req.body;

    if (!user_id || !question_id) {
      return res.status(400).json({ error: 'Missing user_id or question_id' });
    }

    // Use UPSERT so we always keep latest submission
    await db.query(
      `INSERT INTO submissions (user_id, question_id, code, is_correct, submitted_at)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE 
         code = VALUES(code),
         is_correct = VALUES(is_correct),
         submitted_at = NOW()`,
      [user_id, question_id, code || '', solved ? 1 : 0]
    );

    res.json({
      message: 'Progress updated successfully',
      submission: {
        user_id,
        question_id,
        code: code || '',
        status: solved ? 'solved' : 'unsolved',
      },
    });
  } catch (err) {
    console.error('❌ Error updating progress:', err.sqlMessage || err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

// ✅ Get user progress (solved + firstUnsolvedIndex)
exports.getUserProgress = async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }

    // 1. Fetch solved questions
    const [rows] = await db.query(
      'SELECT question_id FROM submissions WHERE user_id = ? AND is_correct = 1 ORDER BY question_id ASC',
      [userId]
    );
    const solvedQuestions = rows.map(r => r.question_id);

    // 2. Fetch all questions
    const [questions] = await db.query(
      'SELECT id FROM questions ORDER BY id ASC'
    );

    // 3. Find first unsolved index
    let firstUnsolvedIndex = 0;
    for (let i = 0; i < questions.length; i++) {
      if (!solvedQuestions.includes(questions[i].id)) {
        firstUnsolvedIndex = i;
        break;
      }
      // If all are solved → point to last question
      if (i === questions.length - 1) {
        firstUnsolvedIndex = questions.length - 1;
      }
    }

    res.json({
      solvedQuestions,
      firstUnsolvedIndex
    });
  } catch (err) {
    console.error('❌ Error fetching progress:', err.sqlMessage || err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};

// ✅ Get all submissions for a user (for progress table)
exports.getUserSubmissions = async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }

    const [rows] = await db.query(
      `SELECT s.id, q.title AS question, s.code, s.is_correct, s.submitted_at
       FROM submissions s
       JOIN questions q ON s.question_id = q.id
       WHERE s.user_id = ?
       ORDER BY s.submitted_at DESC`,
      [userId]
    );

    // Normalize response for frontend
    const submissions = rows.map(r => ({
      id: r.id,
      question: r.question,
      code: r.code,
      status: r.is_correct ? 'solved' : 'unsolved',
      submittedAt: r.submitted_at,
    }));

    res.json({ submissions });
  } catch (err) {
    console.error('❌ Error fetching submissions:', err.sqlMessage || err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};
