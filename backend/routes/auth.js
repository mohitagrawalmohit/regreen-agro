import express from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyUser } from "../middleware/authMiddleware.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post("/admin-login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch the admin user (assuming single admin)
    const result = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7d" }
    );

    res.cookie("adminToken", token, {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // true in production (HTTPS)
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

res.json({ success: true });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword
      }
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   LOGIN
========================= */


router.post("/login", async (req, res) => {
  console.log("🔥 NEW LOGIN ROUTE EXECUTED");
  try {
    const { email, password } = req.body;
    

    console.log("Entered email:", email);
    console.log("Entered password:", password);

    const user = await prisma.user.findUnique({
      where: { email: email.trim() }
    });

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials - no user" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials - password mismatch" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: "Login successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/update-name", verifyUser, async (req, res) => {

  const { name } = req.body;

  await prisma.user.update({
    where: { id: req.user.id },
    data: { name }
  });

  res.json({ success: true });

});
router.get("/me", verifyUser, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
   select: { id: true, name: true, phone: true }

  });

  res.json(user);
});
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await prisma.otp.create({
    data: {
      phone,
      code: otp,
      expiresAt,
    },
  });

  console.log("OTP for", phone, "is", otp); // TEMP: for testing

  res.json({ message: "OTP sent successfully" });
});
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  const record = await prisma.otp.findFirst({
    where: {
      phone,
      code: otp,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { phone },
    });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Login successful" });
});



export default router;
