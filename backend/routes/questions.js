// backend/routes/questions.js

const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const TEMP_DIR = path.join(__dirname, '../temp');

// create temp folder if not exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}


// ================= GET ALL QUESTIONS =================
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.query('SELECT * FROM questions ORDER BY id ASC');

    res.json(rows || []);

  } catch (err) {
    console.error('❌ Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});


// ================= SUBMIT CODE =================
router.post('/submit', async (req, res) => {

  const { user_id, question_id, code, language } = req.body;

  if (!code || !language || !question_id || !user_id) {
    return res.status(400).json({
      output: 'Missing input',
      success: false
    });
  }

  try {

    const db = getDB();

    const [rows] = await db.query(
      'SELECT expected_output, required_keywords FROM questions WHERE id = ?',
      [question_id]
    );

    if (!rows.length) {
      return res.status(404).json({
        output: 'Question not found',
        success: false
      });
    }

    const expectedOutput = rows[0].expected_output.trim();

    const requiredKeywords = rows[0].required_keywords
      ? rows[0].required_keywords.split(',').map(k => k.trim()).filter(Boolean)
      : [];

    let filePath;
    let command;


    // ================= PYTHON =================
    if (language === 'python') {

      const filename = `temp_${Date.now()}.py`;
      filePath = path.join(TEMP_DIR, filename);

      fs.writeFileSync(filePath, code);

      command = `python "${filePath}"`;
    }


    // ================= JAVA =================
    else if (language === 'java') {

      const javaFile = path.join(TEMP_DIR, 'Temp.java');
      const classFile = path.join(TEMP_DIR, 'Temp.class');

      if (fs.existsSync(javaFile)) fs.unlinkSync(javaFile);
      if (fs.existsSync(classFile)) fs.unlinkSync(classFile);

      const fixedCode = code.replace(
        /public\s+class\s+\w+/,
        'public class Temp'
      );

      fs.writeFileSync(javaFile, fixedCode);

      filePath = javaFile;

      command = `javac "${javaFile}" && java -cp "${TEMP_DIR}" Temp`;
    }


    // ================= C++ =================
    else if (language === 'cpp') {

      const filename = `temp_${Date.now()}.cpp`;
      const outputFile = `temp_${Date.now()}`;

      filePath = path.join(TEMP_DIR, filename);

      fs.writeFileSync(filePath, code);

      command = `g++ "${filePath}" -o "${TEMP_DIR}/${outputFile}" && "${TEMP_DIR}/${outputFile}"`;
    }


    else {
      return res.status(400).json({
        output: 'Unsupported language.',
        success: false
      });
    }


    // ================= RUN CODE =================
    exec(command, { timeout: 5000 }, async (err, stdout, stderr) => {

      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch {}

      if (err) {
        console.error('❌ Execution Error:', stderr || err.message);

        return res.json({
          output: stderr || 'Execution error.',
          success: false
        });
      }

      const output = stdout.trim();

      const isOutputCorrect = output === expectedOutput;


      // ================= KEYWORD CHECK =================
      let missingKeywords = [];

      if (requiredKeywords.length > 0) {

        const lowerCode = code.toLowerCase();

        for (const keyword of requiredKeywords) {

          if (!lowerCode.includes(keyword.toLowerCase())) {
            missingKeywords.push(keyword);
          }

        }
      }


      const success = isOutputCorrect && missingKeywords.length === 0;

      let message = '';

      if (!isOutputCorrect) {
        message =
          `Output incorrect. Expected: "${expectedOutput}", Got: "${output}"`;
      }

      if (missingKeywords.length > 0) {

        message +=
          (message ? ' | ' : '') +
          `Missing keyword(s): ${missingKeywords.join(', ')}`;
      }


      // ================= SAVE SUBMISSION =================
      try {

        await db.query(
          `INSERT INTO submissions (user_id, question_id, code, is_correct)
           VALUES (?, ?, ?, ?)`,
          [user_id, question_id, code, success]
        );

      } catch (dbErr) {

        console.error("❌ DB Insert Error:", dbErr);

      }


      res.json({
        output,
        success,
        message
      });

    });

  } catch (err) {

    console.error('❌ Submission Error:', err);

    res.status(500).json({
      output: 'Internal server error.',
      success: false
    });

  }

});


module.exports = router;