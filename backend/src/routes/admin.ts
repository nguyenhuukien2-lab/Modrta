import { Router, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware'

const router = Router()

// ⚠️ All admin routes require auth (TODO: Add admin role check)
router.use(authMiddleware)

// ─── Dashboard ────────────────────────────────────────────────────────────
router.get('/dashboard', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [totalOrders, revenue, totalUsers, totalProducts, pendingOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'paid' } }),
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count({ where: { status: 'pending' } }),
    ])

    res.json({
      data: {
        totalOrders,
        totalRevenue: revenue._sum.total || 0,
        totalUsers,
        totalProducts,
        pendingOrders,
      },
    })
  } catch (error) {
    next(error)
  }
})

// ─── Orders Management ────────────────────────────────────────────────────
router.get('/orders', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, limit = '20', offset = '0' } = req.query
    const where: any = {}
    if (status) where.status = String(status)

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } }, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        take: Math.min(parseInt(String(limit)) || 20, 100),
        skip: Math.max(parseInt(String(offset)) || 0, 0),
      }),
      prisma.order.count({ where }),
    ])

    res.json({ data: orders, pagination: { total } })
  } catch (error) {
    next(error)
  }
})

// ─── Products CRUD ────────────────────────────────────────────────────────
router.get('/products', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({
      include: { categoryRef: true, reviews: { select: { rating: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ data: products })
  } catch (error) {
    next(error)
  }
})

router.post('/products', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.create({ data: req.body })
    res.status(201).json({ data: product })
  } catch (error) {
    next(error)
  }
})

router.put('/products/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.update({ where: { id: req.params.id }, data: req.body })
    res.json({ data: product })
  } catch (error) {
    next(error)
  }
})

router.delete('/products/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } })
    res.json({ message: 'Product deleted' })
  } catch (error) {
    next(error)
  }
})

// ─── Coupons Management ───────────────────────────────────────────────────
router.get('/coupons', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ data: coupons })
  } catch (error) {
    next(error)
  }
})

router.post('/coupons', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const coupon = await prisma.coupon.create({
      data: {
        ...req.body,
        code: req.body.code.toUpperCase(),
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
      },
    })
    res.status(201).json({ data: coupon })
  } catch (error) {
    next(error)
  }
})

router.put('/coupons/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const coupon = await prisma.coupon.update({ where: { id: req.params.id }, data: req.body })
    res.json({ data: coupon })
  } catch (error) {
    next(error)
  }
})

router.delete('/coupons/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.coupon.delete({ where: { id: req.params.id } })
    res.json({ message: 'Coupon deleted' })
  } catch (error) {
    next(error)
  }
})

// ─── Users Management ─────────────────────────────────────────────────────
router.get('/users', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, phone: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ data: users })
  } catch (error) {
    next(error)
  }
})

// ─── Analytics ────────────────────────────────────────────────────────────
router.get('/analytics/sales', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { days = '30' } = req.query
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - parseInt(String(days)))

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: cutoff }, paymentStatus: 'paid' },
      select: { total: true, createdAt: true },
    })

    res.json({ data: orders })
  } catch (error) {
    next(error)
  }
})

export default router
