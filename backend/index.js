// backend/index.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import leadRoutes from './routes/leads.js';
import specificationsRoute from "./routes/specifications.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// CORS: allow origins from env (comma separated) or allow all for quick testing
// Example env: ALLOWED_ORIGINS="https://my-vercel-app.vercel.app,http://localhost:3000"
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = allowedOriginsEnv.split(',').map(s => s.trim()).filter(Boolean);

// Temporary development fallback: if no origins provided, allow all (you can tighten later)
const corsOptions = allowedOrigins.length
  ? {
      origin: function (origin, callback) {
        // allow non-browser clients (curl, Postman) where origin is undefined
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    }
  : { origin: true, credentials: true };

app.use(cors(corsOptions));

// Serve static files (image uploads) — note: on Render this is ephemeral; use cloud storage for production
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/specifications', specificationsRoute);

// Health and debug endpoints
app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: !!process.env.DATABASE_URL, env: process.env.NODE_ENV || 'development' });
});

app.get('/__routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(mw => {
    if (mw.route && mw.route.path) routes.push(mw.route.path);
    else if (mw.name === 'router' && mw.handle && mw.handle.stack) {
      mw.handle.stack.forEach(r => {
        if (r.route && r.route.path) routes.push(r.route.path);
      });
    }
  });
  res.json({ routes });
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend started. PORT=${PORT} NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ ALLOWED_ORIGINS=${allowedOriginsEnv || '*'}`);
});
