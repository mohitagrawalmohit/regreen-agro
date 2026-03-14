import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyUser } from "../middleware/authMiddleware.js";
import razorpay from "../utils/razorpay.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";

const router = express.Router();
const prisma = new PrismaClient();

const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
};

/* ===================================================
   🔹 GET MY ORDERS
=================================================== */
router.get("/", verifyUser, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
     include: {orderItems: {
          include: {
            product: true, // 👈 THIS FIXES IMAGE ISSUE
          },
        },
},


      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


/* ===================================================
   🔹 PLACE ORDER (Convert Cart → Order)
=================================================== */
router.post("/", verifyUser, async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
    } = req.body;

    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      return res.status(400).json({ message: "All address fields required" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    );

    // 🔥 Create Order with address snapshot
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        status: "pending",

        fullName,
        phone,
        addressLine,
        city,
        state,
        pincode,
      },
    });

    // 🔥 Create Order Items
    for (const item of cart.items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
        },
      });
    }

    // 🔥 Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create-razorpay-order", verifyUser, async (req, res) => {
  try {
    const { shipping } = req.body;

    // 1️⃣ Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { cart: { userId: req.user.id } },
      include: { product: true },
    });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2️⃣ Calculate total
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // 3️⃣ Create Order (PENDING)
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        fullName: shipping.fullName,
        phone: shipping.phone,
        addressLine: shipping.addressLine,
        city: shipping.city,
        state: shipping.state,
        pincode: shipping.pincode,
      },
    });

    // 4️⃣ Copy CartItems → OrderItems (SNAPSHOT)
    await prisma.orderItem.createMany({
      data: cartItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      })),
    });

    // 5️⃣ Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: order.id,
    });

    // 6️⃣ Save Razorpay Order ID
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      orderId: order.id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

router.post("/verify-payment", verifyUser, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  try {
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "FAILED" },
      });

      return res.status(400).json({ success: false });
    }

    // ✅ Mark Order Paid
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    // ✅ Clear Cart
    await prisma.cartItem.deleteMany({
      where: { cart: { userId: req.user.id } },
    });

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Verification failed" });
  }
});

router.get("/:id", verifyUser, async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

router.get("/invoice/:id", verifyUser, async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order.id}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Regreen Agro", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.moveDown();

    doc.text("Items:");
    doc.moveDown();

    order.orderItems.forEach(item => {
      doc.text(
        `${item.title} - ₹${item.price} × ${item.quantity}`
      );
    });

    doc.moveDown();
    doc.text(`Total: ₹${order.totalAmount}`, {
      align: "right",
    });

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
});

export default router;
