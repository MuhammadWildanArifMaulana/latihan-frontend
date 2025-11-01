const { Pool } = require("pg");

// Log environment variables for debugging
console.log("Environment variables:", {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
});

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "tugas_fe_kedua",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgrecuy",
});

// Test koneksi
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Successfully connected to database");
  release();
});

module.exports = { pool };
