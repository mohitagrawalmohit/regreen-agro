import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();


// ✅ GET CART
router.get("/", verifyUser, async (req, res) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id }
      });
    }

    res.json(cart);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ ADD TO CART
router.post("/add", verifyUser, async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id }
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: 1
        }
      });
    }

    res.json({ message: "Added to cart" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ REMOVE ITEM
router.post("/remove", verifyUser, async (req, res) => {
  try {
    const { itemId } = req.body;

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    res.json({ message: "Item removed" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// 🔹 Update Quantity
router.post("/update", verifyUser, async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    res.json({ message: "Quantity updated" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
