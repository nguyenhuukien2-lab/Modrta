import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

// ⚠️ SECURITY: All cart routes require authentication
router.use(authMiddleware)

// ─── GET /api/cart ────────────────────────────────────────────────────────────
/**
 * Get user's cart items
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId

    // For now, we store cart in localStorage frontend-side
    // This is just a placeholder to fetch user's wishlist/favorites later
    res.json({
      message: 'Cart is managed client-side with localStorage',
      userId,
    })
  } catch (error) {
    next(error)
  }
})

export default router
