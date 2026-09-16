import express, { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/authMiddleware";
import crypto from "crypto";
import QRCode from "qrcode";

const router = Router();

// ─── VIETQR PAYMENT ROUTES ─────────────────────────────────────────────────

/**
 * POST /api/payments/vietqr
 * Generate VietQR code for payment
 * Body: { orderId: string }
 */
router.post("/vietqr", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = (req as any).userId;

    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Create transaction reference (format: ORD-{orderNumber}-{timestamp})
    const transactionRef = `VQR-${order.orderNumber}-${Date.now()}`;

    // VietQR format: 00020126360014com.vietqr.pay0713000001000...
    // Simplified: generate QR with transaction reference and amount
    const qrContent = `${transactionRef}|${order.total}|${order.customerPhone}`;

    // Generate QR code
    const qrCode = await QRCode.toDataURL(qrContent);

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        transactionRef,
        status: "pending",
        method: "vietqr",
        amount: order.total,
        qrCode,
        orderId,
        userId,
      },
    });

    // Update order payment status to pending
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "pending" },
    });

    res.json({
      success: true,
      transactionRef,
      qrCode,
      amount: order.total,
      orderNumber: order.orderNumber,
      message: "Scan QR code to complete payment",
    });
  } catch (error) {
    console.error("VietQR error:", error);
    res.status(500).json({ error: "Failed to generate VietQR" });
  }
});

/**
 * POST /api/payments/vietqr/verify
 * Manual verification of VietQR payment (for testing/manual confirmation)
 * Body: { transactionRef: string }
 */
router.post(
  "/vietqr/verify",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { transactionRef } = req.body;
      const userId = (req as any).userId;

      if (!transactionRef) {
        return res.status(400).json({ error: "transactionRef is required" });
      }

      // Find payment
      const payment = await prisma.payment.findUnique({
        where: { transactionRef },
        include: { order: true },
      });

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      if (payment.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      if (payment.status === "paid") {
        return res.json({ success: true, message: "Payment already confirmed" });
      }

      // Mark payment as paid
      const updatedPayment = await prisma.payment.update({
        where: { transactionRef },
        data: { status: "paid", updatedAt: new Date() },
      });

      // Update order payment status
      await prisma.order.update({
        where: { id: payment.orderId! },
        data: { paymentStatus: "paid" },
      });

      // Add loyalty points (1 point per 1000 VND)
      const pointsEarned = Math.floor(payment.amount / 1000);
      if (pointsEarned > 0) {
        await prisma.pointLog.create({
          data: {
            userId,
            amount: pointsEarned,
            reason: "order_purchase",
            orderId: payment.orderId,
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: { loyaltyPoints: { increment: pointsEarned } },
        });
      }

      res.json({
        success: true,
        message: "Payment confirmed",
        pointsEarned,
        totalPoints: (await prisma.user.findUnique({
          where: { id: userId },
        }))?.loyaltyPoints,
      });
    } catch (error) {
      console.error("VietQR verify error:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  }
);

// ─── MOMO PAYMENT ROUTES ──────────────────────────────────────────────────

/**
 * POST /api/payments/momo/init
 * Initialize MoMo payment
 * Body: { orderId: string }
 */
router.post("/momo/init", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = (req as any).userId;

    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const partnerCode = process.env.MOMO_PARTNER_CODE || "MOMOXXXXXX";
    const accessKey = process.env.MOMO_ACCESS_KEY || "";
    const secretKey = process.env.MOMO_SECRET_KEY || "";

    const requestId = `${Date.now()}-${order.id}`;
    const orderId_momo = `${order.orderNumber}-${Date.now()}`;
    const redirectUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/checkout/confirm?orderId=${orderId}`;
    const ipnUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payments/momo/callback`;
    const extraData = Buffer.from(JSON.stringify({ orderId, userId })).toString(
      "base64"
    );

    // Build signature string
    const signatureContent = `accessKey=${accessKey}&amount=${order.total}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId_momo}&orderInfo=Order ${order.orderNumber}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(signatureContent)
      .digest("hex");

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        transactionRef: requestId,
        status: "pending",
        method: "momo",
        amount: order.total,
        orderId,
        userId,
      },
    });

    // Return MoMo init response
    res.json({
      success: true,
      requestId,
      orderId: orderId_momo,
      amount: order.total,
      orderInfo: `Order ${order.orderNumber}`,
      partnerCode,
      redirectUrl,
      ipnUrl,
      signature,
      extraData,
      // For testing: return MoMo endpoint
      momoEndpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
    });
  } catch (error) {
    console.error("MoMo init error:", error);
    res.status(500).json({ error: "Failed to initialize MoMo payment" });
  }
});

/**
 * POST /api/payments/momo/callback
 * MoMo webhook callback (IPN)
 * This endpoint should verify signature and update payment status
 */
router.post("/momo/callback", async (req: Request, res: Response) => {
  try {
    const {
      requestId,
      resultCode,
      message,
      amount,
      orderId: orderId_momo,
      transId,
      extraData,
    } = req.body;

    console.log("MoMo callback received:", { requestId, resultCode, transId });

    // Decode extra data
    const decodedExtra = JSON.parse(
      Buffer.from(extraData, "base64").toString("utf8")
    );
    const { orderId, userId } = decodedExtra;

    // Find payment by requestId
    const payment = await prisma.payment.findUnique({
      where: { transactionRef: requestId },
      include: { order: true },
    });

    if (!payment) {
      return res.json({ success: false, message: "Payment not found" });
    }

    // Update payment status based on MoMo result code
    // 0 = success, 1001 = timeout, others = failure
    const isSuccess = resultCode === 0;

    const updatedPayment = await prisma.payment.update({
      where: { transactionRef: requestId },
      data: {
        status: isSuccess ? "paid" : "failed",
        momoTransId: transId,
        momoResultCode: resultCode,
        updatedAt: new Date(),
      },
    });

    // Update order payment status
    if (isSuccess) {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "paid" },
      });

      // Add loyalty points
      const pointsEarned = Math.floor(amount / 1000);
      if (pointsEarned > 0) {
        await prisma.pointLog.create({
          data: {
            userId,
            amount: pointsEarned,
            reason: "order_purchase",
            orderId,
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: { loyaltyPoints: { increment: pointsEarned } },
        });
      }
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "failed" },
      });
    }

    // Always return 200 to MoMo
    res.json({ success: true });
  } catch (error) {
    console.error("MoMo callback error:", error);
    // Still return 200 to prevent MoMo retries
    res.json({ success: false });
  }
});

// ─── GET PAYMENT STATUS ────────────────────────────────────────────────────

/**
 * GET /api/payments/:transactionRef
 * Get payment status by transaction reference
 */
router.get(
  "/:transactionRef",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { transactionRef } = req.params;
      const userId = (req as any).userId;

      const payment = await prisma.payment.findUnique({
        where: { transactionRef },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              total: true,
              status: true,
            },
          },
        },
      });

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      if (payment.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      res.json(payment);
    } catch (error) {
      console.error("Get payment error:", error);
      res.status(500).json({ error: "Failed to get payment" });
    }
  }
);

export default router;
