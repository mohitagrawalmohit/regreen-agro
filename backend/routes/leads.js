// backend/routes/leads.js
import express from "express";
const router = express.Router();
import pool from "../db.js";

router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO leads (name, email, phone, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, phone, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit lead' });
  }
});

export default router;
