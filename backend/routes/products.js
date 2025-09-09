import express from "express";
import pool from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();


/* ---------- Multer storage ---------- */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    return cb(null, true);
  }
  cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only images or videos are allowed'));
};

const upload = multer({ storage, fileFilter });

const uploadFiveMedia = upload.fields([
  { name: 'media1', maxCount: 1 },
  { name: 'media2', maxCount: 1 },
  { name: 'media3', maxCount: 1 },
  { name: 'media4', maxCount: 1 },
  { name: 'media5', maxCount: 1 },
]);

// Helper to get uploaded file path
const getMediaPath = (files, key) => files && files[key] && files[key][0] ? `uploads/${files[key][0].filename}` : null;

/* ------------------ CREATE PRODUCT ------------------ */
router.post('/', uploadFiveMedia, async (req, res) => {
  try {
    const {
      title, description, category, price, mrp, features, cc,
      rating, specifications, idealFor, discountPercent, amountSaved,
    } = req.body;

    const featureArray = features ? features.split(',').map(f => f.trim()) : [];

    const media1 = getMediaPath(req.files, 'media1');
    const media2 = getMediaPath(req.files, 'media2');
    const media3 = getMediaPath(req.files, 'media3');
    const media4 = getMediaPath(req.files, 'media4');
    const media5 = getMediaPath(req.files, 'media5');

    const result = await pool.query(
      `INSERT INTO products 
        (title, description, category, price, mrp, features, cc, media1, media2, media3, media4, media5, rating, specifications, idealFor, discountPercent, amountSaved)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
      [title, description, category, price, mrp, featureArray, cc, media1, media2, media3, media4, media5, rating, specifications, idealFor, discountPercent, amountSaved]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* ------------------ GET ALL PRODUCTS ------------------ */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* ------------------ GET PRODUCT BY ID ------------------ */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id=$1', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* ------------------ UPDATE PRODUCT ------------------ */
router.put('/:id', uploadFiveMedia, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, category, price, mrp, features, cc, rating,
      discountPercent, amountSaved, specifications, idealFor,
      removeMedia1, removeMedia2, removeMedia3, removeMedia4, removeMedia5
    } = req.body;

    const featureArray = features ? features.split(',').map(f => f.trim()) : [];

    // Get existing product
    const old = await pool.query('SELECT * FROM products WHERE id=$1', [id]);
    if (!old.rows.length) return res.status(404).json({ error: 'Product not found' });
    const product = old.rows[0];

    // Prepare media updates
    const mediaUpdates = [];
    for (let i = 1; i <= 5; i++) {
      const removeFlag = req.body[`removeMedia${i}`] === 'true';
      const newFile = req.files[`media${i}`] ? req.files[`media${i}`][0].filename : null;
      let finalMedia = product[`media${i}`]; // default: keep existing

      if (removeFlag) {
        // delete old file
        if (product[`media${i}`] && fs.existsSync(path.join(__dirname, '..', product[`media${i}`]))) {
          fs.unlinkSync(path.join(__dirname, '..', product[`media${i}`]));
        }
        finalMedia = null;
      } else if (newFile) {
        // delete old file
        if (product[`media${i}`] && fs.existsSync(path.join(__dirname, '..', product[`media${i}`]))) {
          fs.unlinkSync(path.join(__dirname, '..', product[`media${i}`]));
        }
        finalMedia = `uploads/${newFile}`;
      }

      mediaUpdates.push(finalMedia);
    }

    // Update product in DB
    const result = await pool.query(
      `UPDATE products
       SET title=$1, description=$2, category=$3, price=$4, mrp=$5, features=$6, cc=$7,
           media1=$8, media2=$9, media3=$10, media4=$11, media5=$12,
           rating=$13, discountPercent=$14, amountSaved=$15,
           specifications=$16, idealFor=$17
       WHERE id=$18 RETURNING *`,
      [
        title, description, category, price, mrp, featureArray, cc,
        mediaUpdates[0], mediaUpdates[1], mediaUpdates[2], mediaUpdates[3], mediaUpdates[4],
        rating, discountPercent, amountSaved,
        specifications, idealFor,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/* ------------------ DELETE PRODUCT ------------------ */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const old = await pool.query('SELECT * FROM products WHERE id=$1', [id]);
    if (!old.rows.length) return res.status(404).json({ error: 'Product not found' });

    // Delete media files
    ['media1','media2','media3','media4','media5'].forEach(key => {
      if (old.rows[0][key] && fs.existsSync(path.join(__dirname, '..', old.rows[0][key]))) {
        fs.unlinkSync(path.join(__dirname, '..', old.rows[0][key]));
      }
    });

    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
