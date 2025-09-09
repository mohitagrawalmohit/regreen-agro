// backend/routes/leads.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

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

module.exports = router;
