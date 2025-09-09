// routes/specifications.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET all specifications (optional)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT "specId","productId","specName", description FROM public."Specifications" ORDER BY "specId" ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching specifications:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET specs for a product
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const result = await pool.query(
      `SELECT "specId","productId","specName", description
       FROM public."Specifications"
       WHERE "productId" = $1
       ORDER BY "specId" ASC`,
      [productId]
    );
    // return empty array if none
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching specifications:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST add single spec for a product -> returns inserted row
router.post("/:productId", async (req, res) => {
  const { productId } = req.params;
  const { specName, description } = req.body;

  if (!specName) {
    return res.status(400).json({ error: "specName is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO public."Specifications" ("productId", "specName", description)
       VALUES ($1, $2, $3)
       RETURNING "specId", "productId", "specName", description;`,
      [productId, specName, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting specification:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT update a spec (productId + specId) -> returns updated row
router.put("/:productId/:specId", async (req, res) => {
  const { productId, specId } = req.params;
  const { specName, description } = req.body;

  if (!specName) {
    return res.status(400).json({ error: "specName is required" });
  }

  try {
    const result = await pool.query(
      `UPDATE public."Specifications"
       SET "specName" = $1, description = $2
       WHERE "specId" = $3 AND "productId" = $4
       RETURNING "specId", "productId", "specName", description;`,
      [specName, description, specId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Specification not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating specification:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a spec (productId + specId) -> returns deleted row
router.delete("/:productId/:specId", async (req, res) => {
  const { productId, specId } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM public."Specifications"
       WHERE "specId" = $1 AND "productId" = $2
       RETURNING "specId", "productId", "specName", description;`,
      [specId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Specification not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error deleting specification:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
