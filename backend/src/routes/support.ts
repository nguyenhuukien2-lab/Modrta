import { Router, Response, NextFunction } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware'

const router = Router()

// ─── GET /api/support/help ─────────────────────────────────────────────────
router.get('/help', async (req, res: Response, next: NextFunction) => {
  try {
    res.json({
      data: [
        { category: 'orders', title: 'Đặt hàng & Thanh toán', articles: 12 },
        { category: 'delivery', title: 'Giao hàng', articles: 8 },
        { category: 'returns', title: 'Đổi trả & Hoàn tiền', articles: 6 },
      ],
    })
  } catch (error) {
    next(error)
  }
})

// ─── POST /api/support/tickets ─────────────────────────────────────────────
router.post('/tickets', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { subject, message, orderId } = req.body
    // TODO: Create support ticket in DB
    res.status(201).json({
      data: {
        id: 'TICKET-' + Date.now(),
        subject,
        status: 'open',
        createdAt: new Date(),
      },
    })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/support/tickets ──────────────────────────────────────────────
router.get('/tickets', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Fetch user tickets
    res.json({ data: [] })
  } catch (error) {
    next(error)
  }
})

export default router
