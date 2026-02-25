// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { initDB, testConnection, getDB } = require('./db');

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const progressRoutes = require('./routes/progress');

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// ✅ Attach DB instance to req for all routes
app.use((req, res, next) => {
  req.db = getDB();
  next();
});

// ✅ Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/progress', progressRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.send('🚀 Code Vibe Backend is running!');
});

// Initialize DB and start server
const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await initDB();
    await testConnection();
    app.listen(PORT, () => {
      console.log(`🌐 Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
})();
