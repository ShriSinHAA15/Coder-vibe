const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// ✅ GET all questions
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.query('SELECT * FROM questions');

    if (!rows.length) {
      return res.status(404).json({ message: 'No questions available.' });
    }

    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// ✅ SUBMIT code
router.post('/submit', async (req, res) => {
  const { user_id, question_id, code, language } = req.body;

  if (!code || !language || !question_id || !user_id) {
    return res.status(400).json({ output: 'Missing input', success: false });
  }

  try {
    const db = getDB();
    const [rows] = await db.query(
      'SELECT expected_output, required_keywords FROM questions WHERE id = ?',
      [question_id]
    );

    if (!rows.length) {
      return res.status(404).json({ output: 'Question not found', success: false });
    }

    const expectedOutput = rows[0].expected_output.trim();
    const requiredKeywords = rows[0].required_keywords
      ? rows[0].required_keywords.split(',').map(k => k.trim()).filter(Boolean)
      : [];

    let filePath, command;

    // ✅ Language handling
    if (language === 'python') {
      const filename = `temp_${Date.now()}.py`;
      filePath = path.join(__dirname, filename);
      fs.writeFileSync(filePath, code);
      command = `python "${filePath}"`;

    } else if (language === 'java') {
      const javaFile = path.join(__dirname, 'Temp.java');
      const classFile = path.join(__dirname, 'Temp.class');

      if (fs.existsSync(javaFile)) fs.unlinkSync(javaFile);
      if (fs.existsSync(classFile)) fs.unlinkSync(classFile);

      const fixedCode = code.replace(/public\s+class\s+\w+/, 'public class Temp');
      fs.writeFileSync(javaFile, fixedCode);
      filePath = javaFile;

      command = `javac "${javaFile}" && java -cp "${__dirname}" Temp`;

    } else {
      return res.status(400).json({ output: 'Unsupported language.', success: false });
    }

    // ✅ Execute code
    exec(command, { timeout: 5000, cwd: __dirname }, async (err, stdout, stderr) => {
      // Cleanup temp files
      fs.unlink(filePath, () => {});
      if (language === 'java') {
        const classFilePath = path.join(__dirname, 'Temp.class');
        if (fs.existsSync(classFilePath)) fs.unlinkSync(classFilePath);
      }

      if (err) {
        console.error('❌ Execution Error:', stderr || err.message);
        return res.json({ output: stderr || 'Execution error.', success: false });
      }

      const output = stdout.trim();
      const isOutputCorrect = output === expectedOutput;

      // ✅ Keyword check
      let missingKeywords = [];
      if (requiredKeywords.length > 0) {
        const lowerCode = code.toLowerCase();
        for (const keyword of requiredKeywords) {
          if (!lowerCode.includes(keyword.toLowerCase())) {
            missingKeywords.push(keyword);
          }
        }
      }

      // ✅ Final success condition
      const success = isOutputCorrect && missingKeywords.length === 0;

      let message = '';
      if (!isOutputCorrect) {
        message = `Output does not match expected result. Expected: "${expectedOutput}", Got: "${output}"`;
      }
      if (missingKeywords.length > 0) {
        message += (message ? ' | ' : '') +
          `Required keyword(s) missing: ${missingKeywords.join(', ')}`;
      }

      console.log('✅ Output:', output);
      console.log('🎯 Expected:', expectedOutput);
      console.log('🔑 Required keywords:', requiredKeywords);
      console.log('✔️ Success:', success);

      // ✅ Save submission in DB
      try {
        await db.query(
          `INSERT INTO submissions (user_id, question_id, code, is_correct)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
             code = VALUES(code),
             is_correct = VALUES(is_correct)`,
          [user_id, question_id, code, success]
        );
      } catch (dbErr) {
        console.error("❌ DB Insert Error:", dbErr);
      }

      res.json({ output, success, message });
    });

  } catch (err) {
    console.error('❌ Submission Error:', err);
    res.status(500).json({ output: 'Internal server error.', success: false });
  }
});

module.exports = router;
