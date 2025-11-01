require("dotenv").config();
const { pool } = require("../db");

(async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Create category and product tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS product (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        price NUMERIC(12,2) NOT NULL DEFAULT 0
      );
    `);

    // Ensure unique constraints/indexes needed for ON CONFLICT
    await client.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email);`
    );
    await client.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS category_name_unique ON category(name);`
    );
    await client.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS product_name_unique ON product(name);`
    );

    // Insert users (omit id so serial assigns; use ON CONFLICT on email)
    await client.query(`
      INSERT INTO users (name, email, password, fullname, role) VALUES
      ('alice', 'alice@example.com', '$2b$10$K1q2v3w4x5y6z7A8B9C0DeFGhIjklmnopQRstuVWxyz0123456789ab', 'Alice Putri', 'admin'),
      ('budi', 'budi.prasetyo@example.co.id', '$2b$10$L0m9n8o7p6q5r4s3t2u1VWxYzAbCdEfGhIjKLMnopqRSTuvwxyZ0123', 'Budi Prasetyo', 'customer'),
      ('clara', 'clara.sari@example.com', '$2b$10$Z9y8x7w6v5u4t3s2r1qPOnmLKJhgFEdcBa9876543210qwertyUIOP', 'Clara Sari', 'seller'),
      ('dedi', 'dedi.hartono@mail.com', '$2b$10$MnOpQrStUvWxYz0123456789abcdefghijklmnopqrstuvWXyzABCde', 'Dedi Hartono', 'customer'),
      ('evi', 'evi.setiawan@example.org', '$2b$10$AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123', 'Evi Setiawan', 'staff')
      ON CONFLICT (email) DO NOTHING;
    `);

    // Insert categories
    await client.query(`
      INSERT INTO category (name) VALUES
      ('Elektronik'),
      ('Pakaian'),
      ('Perawatan Rumah'),
      ('Makanan & Minuman'),
      ('Aksesoris')
      ON CONFLICT DO NOTHING;
    `);

    // Insert items
    await client.query(`
      INSERT INTO items (title, description, created_at) VALUES
      ('Promo Musim Panas: Diskon 20%', 'Diskon khusus untuk produk elektronik tertentu selama musim panas. Berlaku sampai stok habis. Cek kategori Elektronik untuk detail produk dan syarat.', '2025-10-31 09:15:00'),
      ('Koleksi Jaket Musim Dingin 2025', 'Rangkaian jaket terbaru dengan bahan tahan angin dan lapisan hangat. Tersedia berbagai ukuran dan warna populer.', '2025-10-30 14:25:10'),
      ('Tips Perawatan Rumah: Membersihkan Limas Kulit Sofa', 'Panduan langkah demi langkah membersihkan noda pada sofa berbahan kulit sintetis tanpa merusak permukaan.', '2025-10-29 08:05:00'),
      ('Resep Mingguan: Pancake Pisang Praktis', 'Resep mudah pancake pisang untuk sarapan cepat, cocok untuk keluarga. Bahan sederhana dan waktu masak kurang dari 20 menit.', '2025-10-28 16:40:25'),
      ('Aksesoris Terbaru: Gelang Kulit Lokal', 'Gelang kulit buatan tangan dari pengrajin lokal, cocok sebagai hadiah. Pilihan warna: cokelat, hitam, dan natural.', '2025-10-31 19:50:00')
      ON CONFLICT DO NOTHING;
    `);

    // Insert products
    await client.query(`
      INSERT INTO product (name, stock, price) VALUES
      ('Smartphone X200', 25, 3999999.00),
      ('Jaket Windbreaker All-Season - Size M', 48, 299000.00),
      ('Set Pembersih Rumah (Sapu + Lap + Ember)', 120, 125000.50),
      ('Paket 6 Kaleng Kopi Instant - Rasa Original', 200, 89000.00),
      ('Gelang Kulit Handmade (Cokelat)', 35, 150000.75)
      ON CONFLICT DO NOTHING;
    `);

    await client.query("COMMIT");
    console.log("Dummy data inserted successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error inserting dummy data:", err);
  } finally {
    client.release();
    process.exit(0);
  }
})();
