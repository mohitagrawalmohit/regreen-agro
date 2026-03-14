import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/* ==================================================
   🔹 GET ALL PRODUCTS
================================================== */
router.get("/", async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==================================================
   🔹 GET SINGLE PRODUCT BY ID
================================================== */
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await prisma.products.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    console.error("Fetch single product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
