import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/* ===================================================
   🔹 GET ALL ORDERS (ADMIN)
=================================================== */
router.get("/orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    console.error("Admin fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===================================================
   🔹 GET SINGLE ORDER (ADMIN)
=================================================== */
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        orderItems: true,
        user: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

/* ===================================================
   🔹 UPDATE ORDER STATUS (ADMIN)
=================================================== */
router.patch("/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
});

export default router;