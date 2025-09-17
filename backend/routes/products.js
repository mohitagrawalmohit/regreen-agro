import express from "express";
import pool from "../db.js";
import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";

const router = express.Router();

/* ---------- Configure AWS S3 ---------- */
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/* ---------- Multer S3 storage ---------- */
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      return cb(null, true);
    }
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only images or videos are allowed"));
  },
});

const uploadFiveMedia = upload.fields([
  { name: "media1", maxCount: 1 },
  { name: "media2", maxCount: 1 },
  { name: "media3", maxCount: 1 },
  { name: "media4", maxCount: 1 },
  { name: "media5", maxCount: 1 },
]);

// Helper: extract key from full S3 URL
function getS3KeyFromUrl(url) {
  if (!url) return null;
  try {
    const parts = url.split("/");
    return decodeURIComponent(parts[parts.length - 1]); // last part is object key
  } catch {
    return null;
  }
}

// Helper: delete file from S3
async function deleteFromS3(url) {
  const key = getS3KeyFromUrl(url);
  if (!key) return;
  try {
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
      .promise();
    console.log(`🗑️ Deleted from S3: ${key}`);
  } catch (err) {
    console.error("❌ Error deleting from S3:", err);
  }
}

// Helper: get uploaded file URL
const getMediaUrl = (files, key) =>
  files && files[key] && files[key][0] ? files[key][0].location : null;

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

    const media1 = getMediaUrl(req.files, "media1");
    const media2 = getMediaUrl(req.files, "media2");
    const media3 = getMediaUrl(req.files, "media3");
    const media4 = getMediaUrl(req.files, "media4");
    const media5 = getMediaUrl(req.files, "media5");

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
      const removeFlag = req.body[`removeMedia${i}`] === "true";
      const newFile = req.files[`media${i}`] ? req.files[`media${i}`][0].location : null;
      let finalMedia = product[`media${i}`]; // default: keep existing

      if (removeFlag) {
        if (product[`media${i}`]) await deleteFromS3(product[`media${i}`]);
        finalMedia = null;
      } else if (newFile) {
        if (product[`media${i}`]) await deleteFromS3(product[`media${i}`]);
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

    // Delete all S3 media for this product
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
