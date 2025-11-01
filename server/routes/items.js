const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// GET /items
router.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, title, description, created_at FROM items ORDER BY id DESC"
    );
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /items
router.post("/", async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO items (title, description) VALUES ($1,$2) RETURNING id, title, description, created_at",
      [title, description || null]
    );
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /items/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });
  try {
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE items SET title=$1, description=$2 WHERE id=$3 RETURNING id, title, description, created_at",
      [title, description || null, id]
    );
    client.release();
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Item not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /items/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    const result = await client.query(
      "DELETE FROM items WHERE id=$1 RETURNING id",
      [id]
    );
    client.release();
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Deleted", id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
