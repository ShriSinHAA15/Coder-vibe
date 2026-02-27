// backend/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let db;

async function initDB() {
  if (db) return db;

  db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,   // 🔥 VERY IMPORTANT
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