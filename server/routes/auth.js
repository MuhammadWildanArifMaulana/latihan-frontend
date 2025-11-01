const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

// Register
router.post("/register", async (req, res) => {
  const { name, fullname, email, password } = req.body;
  if (!name || !fullname || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const client = await pool.connect();
    const check = await client.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    if (check.rowCount > 0) {
      client.release();
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await client.query(
      "INSERT INTO users (name, fullname, email, password, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, fullname, email, role",
      [name, fullname, email, hashed, "user"]
    );
    client.release();

    res.status(201).json({ message: "User created", user: result.rows[0] });
  } catch (err) {
    // print full stack for debugging
    console.error(err && err.stack ? err.stack : err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, name, fullname, email, password, role FROM users WHERE email=$1",
      [email]
    );
    client.release();

    if (result.rowCount === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        fullname: user.fullname,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "12h",
      }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    // print full stack for debugging
    console.error(err && err.stack ? err.stack : err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
