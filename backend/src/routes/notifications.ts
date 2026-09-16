import { Router, Response, NextFunction } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware'

const router = Router()

router.use(authMiddleware)

// ─── GET /api/notifications ────────────────────────────────────────────────
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement notification system (store in DB or cache)
    res.json({
      data: [
        {
          id: '1',
          type: 'order',
          title: 'Đơn hàng đã giao',
          message: 'Đơn hàng #ORD-123 đã được giao thành công',
          read: false,
          createdAt: new Date(),
        },
      ],
    })
  } catch (error) {
    next(error)
  }
})

// ─── POST /api/notifications/read ──────────────────────────────────────────
router.post('/read', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { notificationId } = req.body
    // TODO: Mark as read
    res.json({ message: 'Marked as read' })
  } catch (error) {
    next(error)
  }
})

// ─── POST /api/notifications/subscribe ────────────────────────────────────
router.post('/subscribe', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { token, topics = [] } = req.body
    // TODO: Save FCM token for push notifications
    res.json({ message: 'Subscribed' })
  } catch (error) {
    next(error)
  }
})

export default router
