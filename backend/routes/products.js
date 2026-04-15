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
/* ==================================================
   🔹 update PRODUCT BY ID
================================================== */
router.put("/:id", async (req, res) => {
  const { title, description, price, mrp, categoryId, image } = req.body;

  await prisma.products.update({
    where: { id },
    data: {
      title,
      description,
      price,
      mrp,
      categoryId,
      image
    }
  });
});
/* ==================================================
   🔹 DELETE PRODUCT BY ID
================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deletedProduct = await prisma.products.delete({
      where: { id },
    });

    res.json({
      message: "Product deleted successfully",
      deletedProduct,
    });

  } catch (error) {
    console.error("Delete product error:", error);

    // Handle case when product doesn't exist
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

export default router;


