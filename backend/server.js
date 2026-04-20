// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { initDB, testConnection } = require('./db');

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const progressRoutes = require('./routes/progress');

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/progress', progressRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Code Vibe Backend is running!');
});

const PORT = process.env.PORT || 10000;

async function startServer() {
  try {
    await initDB();
    await testConnection();
    console.log('✅ Database Connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Server startup failed:', err);
    // ❌ Removed process.exit(1) so Render does not kill the app
  }
}

startServer();