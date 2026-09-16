import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

// ─── GET /api/coupons ────────────────────────────────────────────────────────
/**
 * List all active coupons
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      select: {
        id: true,
        code: true,
        discountPercent: true,
        minOrderValue: true,
        maxUses: true,
        usedCount: true,
        expiresAt: true,
      },
      orderBy: { expiresAt: 'asc' },
    })

    res.json({ data: coupons })
  } catch (error) {
    next(error)
  }
})

// ─── POST /api/coupons/validate ────────────────────────────────────────────
/**
 * Validate coupon code and return discount
 * Body: { code: string, subtotal: number }
 */
router.post('/validate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, subtotal } = req.body

    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Invalid coupon code' })
      return
    }

    if (!subtotal || subtotal < 0) {
      res.status(400).json({ error: 'Invalid subtotal' })
      return
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      res.status(404).json({ error: 'Coupon not found' })
      return
    }

    if (!coupon.isActive) {
      res.status(400).json({ error: 'Coupon is inactive' })
      return
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      res.status(400).json({ error: 'Coupon has expired' })
      return
    }

    if (coupon.usedCount >= coupon.maxUses) {
      res.status(400).json({ error: 'Coupon usage limit reached' })
      return
    }

    if (subtotal < coupon.minOrderValue) {
      res.status(400).json({
        error: `Minimum order value is ${coupon.minOrderValue.toLocaleString('vi-VN')}đ`,
        minOrderValue: coupon.minOrderValue,
      })
      return
    }

    // Calculate discount
    const discount = Math.floor((subtotal * coupon.discountPercent) / 100)

    res.json({
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discount,
        finalSubtotal: subtotal - discount,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
