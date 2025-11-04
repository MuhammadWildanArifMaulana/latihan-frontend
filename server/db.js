const { Pool } = require("pg");
require("dotenv").config();

// Log environment variables for debugging
console.log("(db.js) Environment variables:", {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "[REDACTED]" : undefined,
});

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "tugas_fe_kedua",
  user: process.env.DB_USER || "postgres",
  // Avoid hardcoding secrets. Read password from environment only.
  // If DB_PASSWORD is not provided, leave it undefined.
  password: process.env.DB_PASSWORD || undefined,
});

// Test koneksi
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database (db.js):", err);
    return;
  }
  console.log("Successfully connected to database (db.js)");
  release();
});

module.exports = { pool };
