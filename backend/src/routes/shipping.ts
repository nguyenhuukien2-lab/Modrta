import { Router, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// ─── GET /api/shipping/methods ────────────────────────────────────────────
router.get('/methods', async (req, res: Response, next: NextFunction) => {
  try {
    res.json({
      data: [
        { id: 'standard', name: 'Giao hàng tiêu chuẩn', price: 25000, time: '45-60 phút' },
        { id: 'express', name: 'Giao hàng nhanh', price: 35000, time: '20-30 phút' },
        { id: 'pickup', name: 'Lấy tại cửa hàng', price: 0, time: '15 phút' },
      ],
    })
  } catch (error) {
    next(error)
  }
})

// ─── POST /api/shipping/calculate ─────────────────────────────────────────
router.post('/calculate', async (req, res: Response, next: NextFunction) => {
  try {
    const { district, city, weight = 1 } = req.body
    
    // Simple logic: 25k base + 5k per kg
    const baseFee = 25000
    const weightFee = Math.ceil(weight) * 5000
    
    res.json({ data: { fee: baseFee + weightFee } })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/shipping/:orderId/track ─────────────────────────────────────
router.get('/:orderId/track', async (req, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      select: { status: true, createdAt: true, updatedAt: true },
    })

    if (!order) {
      res.status(404).json({ error: 'Order not found' })
      return
    }

    res.json({
      data: {
        status: order.status,
        timeline: [
          { status: 'pending', time: order.createdAt, label: 'Đơn hàng đã tạo' },
          { status: 'confirmed', time: order.updatedAt, label: 'Đã xác nhận' },
        ],
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
