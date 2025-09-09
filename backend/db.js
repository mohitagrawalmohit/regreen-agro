// backend/db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Render Postgres requires SSL
  },
});

export default pool;  // 👈 proper ESM export
