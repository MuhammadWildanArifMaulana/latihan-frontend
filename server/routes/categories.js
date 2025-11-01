const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { verifyToken } = require("../middleware/auth");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM categories ORDER BY created_at DESC"
    );
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single category
router.get("/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM categories WHERE id = $1",
      [req.params.id]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Create category (protected, admin only)
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Update category (protected, admin only)
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  try {
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description, req.params.id]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete category (protected, admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
