(async () => {
  try {
    const { pool } = require("../server/db");
    const client = await pool.connect();
    const name = "directtest";
    const email = "directtest@example.com";
    const password = "test123";
    const bcrypt = require("bcrypt");
    const hashed = await bcrypt.hash(password, 10);
    const res = await client.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id, name, email",
      [name, email, hashed]
    );
    console.log("Inserted:", res.rows[0]);
    client.release();
  } catch (err) {
    console.error("Direct register error:", err);
  }
})();
