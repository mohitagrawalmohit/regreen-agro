// routes/products.js (updated)
import express from "express";
import pool from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { fileURLToPath } from "url";

const router = express.Router();

// multer memory storage (we upload to S3 from server memory)
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    return cb(null, true);
  }
  cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only images or videos are allowed"));
};
const upload = multer({ storage, fileFilter });
const uploadFiveMedia = upload.fields([
  { name: "media1", maxCount: 1 },
  { name: "media2", maxCount: 1 },
  { name: "media3", maxCount: 1 },
  { name: "media4", maxCount: 1 },
  { name: "media5", maxCount: 1 },
]);

// S3 client
const s3 = new S3Client({ region: process.env.AWS_REGION });

// Helper: upload buffer to S3 -> returns object key and public URL
async function uploadBufferToS3(file, folder = "products") {
  if (!file) return null;
  const safeName = file.originalname.replace(/\s+/g, "-");
  const key = `${folder}/${Date.now()}-${safeName}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // only if you want objects to be public (dev). Consider removing and using presigned URL / CloudFront in prod.
  };
  await s3.send(new PutObjectCommand(params));

  // region-aware public URL:
  const region = process.env.AWS_REGION;
  const bucket = process.env.S3_BUCKET_NAME;
  // For most regions use this:
  const url = `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`;
  return { key, url };
}

// Helper to get key from an S3 URL (so you can delete)
function keyFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return decodeURIComponent(u.pathname.replace(/^\//, "")); // remove leading slash
  } catch {
    // maybe stored as raw key
    return url.replace(/^\/+/, "");
  }
}

/* -------------- CREATE PRODUCT --------------- */
router.post("/", uploadFiveMedia, async (req, res) => {
  try {
    const {
      title, description, category, price, mrp, features, cc, rating,
      specifications, idealFor, discountPercent, amountSaved
    } = req.body;

    const featureArray = features ? features.split(",").map(f => f.trim()) : [];

    // upload each file to S3 if provided
    const m1 = req.files?.media1?.[0] ? await uploadBufferToS3(req.files.media1[0]) : null;
    const m2 = req.files?.media2?.[0] ? await uploadBufferToS3(req.files.media2[0]) : null;
    const m3 = req.files?.media3?.[0] ? await uploadBufferToS3(req.files.media3[0]) : null;
    const m4 = req.files?.media4?.[0] ? await uploadBufferToS3(req.files.media4[0]) : null;
    const m5 = req.files?.media5?.[0] ? await uploadBufferToS3(req.files.media5[0]) : null;

    const result = await pool.query(
      `INSERT INTO products (title, description, category, price, mrp, features, cc, media1, media2, media3, media4, media5, rating, specifications, idealFor, discountPercent, amountSaved)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
      [
        title, description, category, price, mrp, featureArray, cc,
        m1?.url || null,
        m2?.url || null,
        m3?.url || null,
        m4?.url || null,
        m5?.url || null,
        rating, specifications, idealFor, discountPercent, amountSaved
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* -------------- UPDATE PRODUCT --------------- */
router.put("/:id", uploadFiveMedia, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, category, price, mrp, features, cc, rating,
      discountPercent, amountSaved, specifications, idealFor
    } = req.body;

    const featureArray = features ? features.split(",").map(f => f.trim()) : [];

    // Get existing product
    const old = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
    if (!old.rows.length) return res.status(404).json({ error: "Product not found" });
    const product = old.rows[0];

    // For each media slot: process remove flag, new upload, or keep old
    const newUrls = [];
    for (let i = 1; i <= 5; i++) {
      const removeFlag = req.body[`removeMedia${i}`] === "true";
      const newFile = req.files?.[`media${i}`]?.[0] ?? null;
      const oldUrl = product[`media${i}`];

      if (removeFlag) {
        // delete from S3 if it exists as S3 url
        if (oldUrl && oldUrl.includes(process.env.S3_BUCKET_NAME)) {
          const key = keyFromUrl(oldUrl);
          if (key) {
            await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key }));
          }
        }
        newUrls.push(null);
      } else if (newFile) {
        // upload new one and delete old if any
        const uploaded = await uploadBufferToS3(newFile);
        if (oldUrl && oldUrl.includes(process.env.S3_BUCKET_NAME)) {
          const oldKey = keyFromUrl(oldUrl);
          if (oldKey) await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: oldKey }));
        }
        newUrls.push(uploaded.url);
      } else {
        // keep existing url OR null
        newUrls.push(oldUrl || null);
      }
    }

    // Update DB (same structure as earlier)
    const result = await pool.query(
      `UPDATE products
       SET title=$1, description=$2, category=$3, price=$4, mrp=$5, features=$6, cc=$7,
           media1=$8, media2=$9, media3=$10, media4=$11, media5=$12,
           rating=$13, discountPercent=$14, amountSaved=$15,
           specifications=$16, idealFor=$17
       WHERE id=$18 RETURNING *`,
      [
        title, description, category, price, mrp, featureArray, cc,
        newUrls[0], newUrls[1], newUrls[2], newUrls[3], newUrls[4],
        rating, discountPercent, amountSaved, specifications, idealFor, id
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* -------------- DELETE PRODUCT --------------- */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const old = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
    if (!old.rows.length) return res.status(404).json({ error: "Product not found" });

    // Delete S3 files if they are S3 URLs
    for (const key of ["media1","media2","media3","media4","media5"]) {
      const url = old.rows[0][key];
      if (url && url.includes(process.env.S3_BUCKET_NAME)) {
        const s3Key = keyFromUrl(url);
        if (s3Key) {
          await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: s3Key }));
        }
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
