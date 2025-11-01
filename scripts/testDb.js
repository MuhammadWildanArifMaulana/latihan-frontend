(async () => {
  try {
    console.log("ENV DB_PASSWORD (raw):", process.env.DB_PASSWORD);
    console.log("Type of DB_PASSWORD:", typeof process.env.DB_PASSWORD);
    const { Pool } = require("pg");
    const cfg = {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "tugas_fe_kedua",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgrecuy",
    };
    console.log("Using DB config:", cfg);
    const pool = new Pool(cfg);
    const client = await pool.connect();
    const res = await client.query("SELECT NOW() as now");
    console.log("DB time:", res.rows[0]);
    client.release();
  } catch (err) {
    console.error("DB test error:", err);
  }
})();
