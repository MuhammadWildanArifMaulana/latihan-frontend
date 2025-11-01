const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { verifyToken } = require("../middleware/auth");

// Get all products with category info
router.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ORDER BY p.created_at DESC`
    );
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single product with category info
router.get("/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = $1`,
      [req.params.id]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Get products by category
router.get("/category/:categoryId", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.category_id = $1 
       ORDER BY p.created_at DESC`,
      [req.params.categoryId]
    );
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Create product (protected, admin only)
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const { name, description, price, stock, category_id } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO products 
       (name, description, price, stock, category_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, description, price, stock || 0, category_id]
    );
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Update product (protected, admin only)
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const { name, description, price, stock, category_id } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      `UPDATE products 
         SET name = $1, description = $2, price = $3, 
             stock = $4, category_id = $5,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 
         RETURNING *`,
      [name, description, price, stock, category_id, req.params.id]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product (protected, admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
