import express from "express";
import pool from "../db.js";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const router = express.Router();

/* ---------- Configure AWS S3 v3 ---------- */
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/* ---------- Multer memory storage ---------- */
const upload = multer({ storage: multer.memoryStorage() });
const uploadFiveMedia = upload.fields([
  { name: "media1", maxCount: 1 },
  { name: "media2", maxCount: 1 },
  { name: "media3", maxCount: 1 },
  { name: "media4", maxCount: 1 },
  { name: "media5", maxCount: 1 },
]);

/* ---------- Helpers ---------- */
async function uploadToS3(file) {
  if (!file) return null;
  const ext = path.extname(file.originalname);
  const key = `${Date.now()}-${crypto.randomUUID()}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    })
  );

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

async function deleteFromS3(url) {
  if (!url) return;
  try {
    const key = decodeURIComponent(url.split("/").pop());
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
    );
    console.log("🗑️ Deleted from S3:", key);
  } catch (err) {
    console.error("❌ Error deleting from S3:", err);
  }
}

/* ------------------ CREATE PRODUCT ------------------ */
router.post("/", uploadFiveMedia, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      mrp,
      features,
      cc,
      rating,
      specifications,
      idealFor,
      discountPercent,
      amountSaved,
    } = req.body;

    const featureArray = features ? features.split(",").map((f) => f.trim()) : [];

    // Upload media to S3
    const media1 = req.files.media1 ? await uploadToS3(req.files.media1[0]) : null;
    const media2 = req.files.media2 ? await uploadToS3(req.files.media2[0]) : null;
    const media3 = req.files.media3 ? await uploadToS3(req.files.media3[0]) : null;
    const media4 = req.files.media4 ? await uploadToS3(req.files.media4[0]) : null;
    const media5 = req.files.media5 ? await uploadToS3(req.files.media5[0]) : null;

    const result = await pool.query(
      `INSERT INTO products 
        (title, description, category, price, mrp, features, cc, media1, media2, media3, media4, media5, rating, specifications, idealFor, discountPercent, amountSaved)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
      [
        title,
        description,
        category,
        price,
        mrp,
        featureArray,
        cc,
        media1,
        media2,
        media3,
        media4,
        media5,
        rating,
        specifications,
        idealFor,
        discountPercent,
        amountSaved,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ------------------ GET ALL PRODUCTS ------------------ */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ------------------ GET PRODUCT BY ID ------------------ */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Product not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching product by id:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ------------------ UPDATE PRODUCT ------------------ */
router.put("/:id", uploadFiveMedia, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      price,
      mrp,
      features,
      cc,
      rating,
      discountPercent,
      amountSaved,
      specifications,
      idealFor,
    } = req.body;

    const featureArray = features ? features.split(",").map((f) => f.trim()) : [];

    const old = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
    if (!old.rows.length) return res.status(404).json({ error: "Product not found" });
    const product = old.rows[0];

    const mediaUpdates = [];
    for (let i = 1; i <= 5; i++) {
      const key = `media${i}`;
      const removeFlag = req.body[`removeMedia${i}`] === "true";
      const newFile = req.files[key] ? await uploadToS3(req.files[key][0]) : null;
      let finalMedia = product[key]; // default: keep existing

      if (removeFlag) {
        if (product[key]) await deleteFromS3(product[key]);
        finalMedia = null;
      } else if (newFile) {
        if (product[key]) await deleteFromS3(product[key]);
        finalMedia = newFile;
      }

      mediaUpdates.push(finalMedia);
    }

    const result = await pool.query(
      `UPDATE products
       SET title=$1, description=$2, category=$3, price=$4, mrp=$5, features=$6, cc=$7,
           media1=$8, media2=$9, media3=$10, media4=$11, media5=$12,
           rating=$13, discountPercent=$14, amountSaved=$15,
           specifications=$16, idealFor=$17
       WHERE id=$18 RETURNING *`,
      [
        title,
        description,
        category,
        price,
        mrp,
        featureArray,
        cc,
        mediaUpdates[0],
        mediaUpdates[1],
        mediaUpdates[2],
        mediaUpdates[3],
        mediaUpdates[4],
        rating,
        discountPercent,
        amountSaved,
        specifications,
        idealFor,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ------------------ DELETE PRODUCT ------------------ */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const old = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
    if (!old.rows.length) return res.status(404).json({ error: "Product not found" });

    for (let i = 1; i <= 5; i++) {
      if (old.rows[0][`media${i}`]) {
        await deleteFromS3(old.rows[0][`media${i}`]);
      }
    }

    await pool.query("DELETE FROM products WHERE id=$1", [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
