import express, { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// ─── LOYALTY POINTS ROUTES ────────────────────────────────────────────────

/**
 * GET /api/loyalty/status
 * Get current user's loyalty points and tier
 */
router.get("/status", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        tier: true,
        loyaltyPoints: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get recent point logs
    const recentLogs = await prisma.pointLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Tier upgrade thresholds
    const tierThresholds = {
      member: 0,
      silver: 1000, // 1000+ points
      gold: 5000, // 5000+ points
    };

    res.json({
      user,
      recentLogs,
      tierThresholds,
      nextTierPoints: user.tier === "gold" ? null : tierThresholds[user.tier === "member" ? "silver" : "gold"],
      nextTierPointsRemaining: user.tier === "gold" ? 0 : Math.max(0, tierThresholds[user.tier === "member" ? "silver" : "gold"] - user.loyaltyPoints),
    });
  } catch (error) {
    console.error("Get loyalty status error:", error);
    res.status(500).json({ error: "Failed to get loyalty status" });
  }
});

/**
 * POST /api/loyalty/add-points (Internal API - requires INTERNAL_API_SECRET)
 * Add points to user account
 * Body: { userId: string, amount: number, reason: string, orderId?: string }
 * Headers: { x-internal-secret: string }
 */
router.post("/add-points", async (req: Request, res: Response) => {
  try {
    const secret = req.headers["x-internal-secret"];
    const internalSecret = process.env.INTERNAL_API_SECRET;

    // Verify internal secret
    if (!secret || secret !== internalSecret) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { userId, amount, reason, orderId } = req.body;

    if (!userId || !amount || !reason) {
      return res.status(400).json({
        error: "userId, amount, and reason are required",
      });
    }

    if (typeof amount !== "number" || amount === 0) {
      return res.status(400).json({ error: "amount must be non-zero number" });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create point log
    const pointLog = await prisma.pointLog.create({
      data: {
        userId,
        amount,
        reason,
        orderId,
      },
    });

    // Update user loyalty points
    const newTotal = user.loyaltyPoints + amount;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { loyaltyPoints: newTotal },
    });

    // Check and update tier based on points
    let newTier = updatedUser.tier;
    if (newTotal >= 5000) {
      newTier = "gold";
    } else if (newTotal >= 1000) {
      newTier = "silver";
    } else {
      newTier = "member";
    }

    if (newTier !== updatedUser.tier) {
      await prisma.user.update({
        where: { id: userId },
        data: { tier: newTier },
      });
    }

    res.json({
      success: true,
      pointLog,
      user: {
        id: userId,
        loyaltyPoints: newTotal,
        tier: newTier,
      },
    });
  } catch (error) {
    console.error("Add points error:", error);
    res.status(500).json({ error: "Failed to add points" });
  }
});

/**
 * POST /api/loyalty/redeem
 * Redeem points for discount on checkout
 * Body: { amount: number } (amount of points to redeem)
 */
router.post(
  "/redeem",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.loyaltyPoints < amount) {
        return res.status(400).json({
          error: "Insufficient loyalty points",
          available: user.loyaltyPoints,
        });
      }

      // 1 point = 100 VND discount
      const discountVND = amount * 100;

      // Create point log for redemption
      await prisma.pointLog.create({
        data: {
          userId,
          amount: -amount,
          reason: "redeemed",
        },
      });

      // Update user loyalty points
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { loyaltyPoints: { decrement: amount } },
      });

      res.json({
        success: true,
        discountVND,
        message: `Redeemed ${amount} points for ${discountVND.toLocaleString()} VND discount`,
        remainingPoints: updatedUser.loyaltyPoints,
      });
    } catch (error) {
      console.error("Redeem points error:", error);
      res.status(500).json({ error: "Failed to redeem points" });
    }
  }
);

/**
 * GET /api/loyalty/history
 * Get user's loyalty point transaction history
 */
router.get(
  "/history",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const skip = (page - 1) * limit;

      const logs = await prisma.pointLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          // Optionally include order details if orderId is present
        },
      });

      const total = await prisma.pointLog.count({
        where: { userId },
      });

      res.json({
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get history error:", error);
      res.status(500).json({ error: "Failed to get history" });
    }
  }
);

export default router;
