import express from "express";
const router = express.Router();
import pool from "../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { apiKeyAuth } from "../middleware/apiKeyAuth.js";

/* ========================
   POST /api/leads → Create a new lead (public)
======================== */
router.post("/", async (req, res) => {
  const { name, email, phone, state, machinery, message, landingPageUrl } = req.body;

  if (!name || !phone || !state || !machinery || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO leads (name, email, phone, state, machinery, message, landing_page_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, email, phone, state, machinery, message, landingPageUrl]
    );

    res.status(201).json({
      success: true,
      message: "Lead submitted successfully",
      lead: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error saving lead:", err);
    res.status(500).json({ error: "Failed to submit lead" });
  }
});

/* ========================
   GET /api/leads → Get all leads (protected)
======================== */
router.get(
  "/",
  (req, res, next) => {
    console.log("🛡️ /api/leads GET route hit");

    const apiKey = req.headers["x-api-key"];
    const envKey = process.env.API_SECRET_KEY;

    console.log("🔎 API Key header:", apiKey || "(none)");
    console.log("🔎 Env Key loaded:", envKey ? "✅ Yes" : "❌ Missing");

    // If API key is valid, skip JWT verification
    if (apiKey && envKey && apiKey === envKey) {
      console.log("✅ Access allowed via API key");
      return next();
    }

    // Otherwise verify admin JWT token
    console.log("🔐 Checking JWT token...");
    verifyToken(req, res, next);
  },
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, name, email, phone, state, machinery, message, landing_page_url, created_at
         FROM leads
         ORDER BY created_at DESC`
      );

      console.log(`✅ Returning ${result.rows.length} leads`);
      res.status(200).json({
        success: true,
        count: result.rows.length,
        leads: result.rows,
      });
    } catch (err) {
      console.error("❌ Error fetching leads:", err);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  }
);

/* ========================
   GET /api/leads/:id → Get a specific lead by ID (protected)
======================== */
router.get(
  "/:id",
  (req, res, next) => {
    console.log("🛡️ /api/leads/:id route hit");

    const apiKey = req.headers["x-api-key"];
    const envKey = process.env.API_SECRET_KEY;

    if (apiKey && envKey && apiKey === envKey) {
      console.log("✅ Access allowed via API key");
      return next();
    }

    console.log("🔐 Checking JWT token...");
    verifyToken(req, res, next);
  },
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(`SELECT * FROM leads WHERE id = $1`, [id]);

      if (result.rows.length === 0) {
        console.warn("⚠️ Lead not found:", id);
        return res.status(404).json({ error: "Lead not found" });
      }

      console.log("✅ Returning lead ID:", id);
      res.status(200).json({ success: true, lead: result.rows[0] });
    } catch (err) {
      console.error("❌ Error fetching lead:", err);
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  }
);

export default router;
