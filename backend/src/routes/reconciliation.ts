import express, { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/**
 * POST /api/admin/reconciliation/daily
 * Daily reconciliation job - check payment status and update order status
 * Requires CRON_SECRET in header: x-cron-secret
 * This should be called by a cron scheduler (e.g., GitHub Actions, n8n, etc.)
 */
router.post("/daily", async (req: Request, res: Response) => {
  try {
    const cronSecret = req.headers["x-cron-secret"];
    const expectedSecret = process.env.CRON_SECRET;

    // Verify cron secret
    if (!cronSecret || cronSecret !== expectedSecret) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log(
      `[RECONCILIATION] Starting daily reconciliation at ${new Date().toISOString()}`
    );

    // Get all pending payments from past 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pendingPayments = await prisma.payment.findMany({
      where: {
        status: "pending",
        createdAt: { gte: oneDayAgo },
      },
      include: { order: true },
    });

    console.log(`[RECONCILIATION] Found ${pendingPayments.length} pending payments`);

    let processedCount = 0;
    let failedCount = 0;

    // For each pending payment, check status and update if needed
    for (const payment of pendingPayments) {
      try {
        // In production, you would call MoMo API here to check payment status
        // For now, we just log and mark as reconciled
        console.log(
          `[RECONCILIATION] Processing payment: ${payment.transactionRef} (${payment.method})`
        );

        // Mark old pending payments as failed if they're older than 1 hour and MoMo didn't confirm
        if (
          payment.method === "momo" &&
          payment.createdAt < new Date(Date.now() - 60 * 60 * 1000) &&
          !payment.momoTransId
        ) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: "failed", updatedAt: new Date() },
          });

          if (payment.orderId) {
            await prisma.order.update({
              where: { id: payment.orderId },
              data: { paymentStatus: "failed" },
            });
          }

          failedCount++;
          console.log(
            `[RECONCILIATION] Marked payment ${payment.transactionRef} as failed`
          );
        }

        processedCount++;
      } catch (error) {
        console.error(
          `[RECONCILIATION] Error processing payment ${payment.id}:`,
          error
        );
      }
    }

    // Clean up old failed/refunded payments (older than 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const deletedCount = await prisma.payment.deleteMany({
      where: {
        status: { in: ["failed", "refunded"] },
        updatedAt: { lt: thirtyDaysAgo },
      },
    });

    console.log(`[RECONCILIATION] Deleted ${deletedCount.count} old payments`);

    // Update user tiers based on loyalty points
    const users = await prisma.user.findMany({
      where: {
        tier: { not: "gold" }, // Only check users not already gold
      },
    });

    let tierUpdatedCount = 0;
    for (const user of users) {
      let newTier = user.tier;

      if (user.loyaltyPoints >= 5000) {
        newTier = "gold";
      } else if (user.loyaltyPoints >= 1000) {
        newTier = "silver";
      } else {
        newTier = "member";
      }

      if (newTier !== user.tier) {
        await prisma.user.update({
          where: { id: user.id },
          data: { tier: newTier },
        });
        tierUpdatedCount++;
        console.log(
          `[RECONCILIATION] Updated user ${user.id} tier to ${newTier}`
        );
      }
    }

    const summary = {
      timestamp: new Date().toISOString(),
      pendingPaymentsChecked: pendingPayments.length,
      paymentsFailed: failedCount,
      paymentsProcessed: processedCount,
      oldPaymentsDeleted: deletedCount.count,
      userTiersUpdated: tierUpdatedCount,
    };

    console.log("[RECONCILIATION] Summary:", summary);

    res.json({
      success: true,
      message: "Daily reconciliation completed",
      summary,
    });
  } catch (error) {
    console.error("[RECONCILIATION] Error:", error);
    res.status(500).json({
      error: "Reconciliation failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
