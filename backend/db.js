const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

let pool;

function initDB() {
  if (pool) return pool;

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log('✅ PostgreSQL pool created');
  return pool;
}

function getDB() {
  return pool;
}

async function testConnection() {
  try {
    const db = initDB();
    await db.query('SELECT 1');
    console.log('✅ DB test succeeded');
  } catch (err) {
    console.error('❌ DB test failed:', err);
  }
}

module.exports = {
  initDB,
  getDB,
  testConnection
};