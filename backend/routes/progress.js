// backend/routes/progress.js
const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

router.get('/all/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT 
          q.id, q.title, q.description, q.difficulty,
          IF(EXISTS(
            SELECT 1 FROM submissions s 
            WHERE s.user_id = ? 
              AND s.question_id = q.id 
              AND s.is_correct = 1
          ), 1, 0) AS solved
       FROM questions q
       ORDER BY q.id`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

module.exports = router;
