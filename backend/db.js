// backend/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let db;

async function initDB() {
  if (db) return db;
  db = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'codevibe',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log('✅ MySQL pool created');
  return db;
}

function getDB() {
  return db;
}

async function testConnection() {
  const pool = await initDB();
  await pool.query('SELECT 1');
  console.log('✅ DB test succeeded');
}

module.exports = {
  initDB,
  getDB,
  testConnection
};
