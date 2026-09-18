import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

// ─── Generate Order Number ────────────────────────────────────────────────────
function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')

  return `ORD-${year}${month}${day}-${random}`
}

// ─── POST /api/orders ────────────────────────────────────────────────────────
/**
 * Create new order from cart
 * Body: {
 *   items: [{ productId, quantity, ice, sugar, milk, size, itemNote }],
 *   deliveryMethod: 'delivery' | 'pickup',
 *   paymentMethod: 'vietqr' | 'momo' | 'zalopay' | 'card' | 'cod',
 *   customerName, customerPhone, customerEmail,
 *   address, district, city, note,
 *   couponCode?: string,
 *   ecoPackaging?: boolean
 * }
 */
router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId || (req as any).userId
    const {
      items = [],
      deliveryMethod,
      paymentMethod,
      customerName,
      customerPhone,
      customerEmail,
      address,
      district,
      city,
      note,
      couponCode,
      ecoPackaging = false,
    } = req.body

    // ⚠️ SECURITY: Validate input
    if (!items.length) {
      res.status(400).json({ error: 'Cart is empty' })
      return
    }

    if (!['delivery', 'pickup'].includes(deliveryMethod)) {
      res.status(400).json({ error: 'Invalid delivery method' })
      return
    }

    if (!['vietqr', 'momo', 'zalopay', 'card', 'cod'].includes(paymentMethod)) {
      res.status(400).json({ error: 'Invalid payment method' })
      return
    }

    if (!customerName || !customerPhone) {
      res.status(400).json({ error: 'Missing customer info' })
      return
    }

    // Fetch all products to validate & calculate price
    const productIds = items.map((i: any) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, slug: true, name: true, price: true, inStock: true },
    })

    if (products.length !== items.length) {
      res.status(400).json({ error: 'Some products not found' })
      return
    }

    // Check stock
    for (const product of products) {
      if (!product.inStock) {
        res.status(400).json({ error: `${product.name} is out of stock` })
        return
      }
    }

    // Calculate subtotal
    let subtotal = 0
    const itemsWithPrice = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId)!
      const itemPrice = product.price * item.quantity
      subtotal += itemPrice
      return {
        ...item,
        unitPrice: product.price,
      }
    })

    // Apply coupon if provided
    let discount = 0
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      })

      if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (coupon.minOrderValue <= subtotal && coupon.usedCount < coupon.maxUses) {
          discount = Math.floor((subtotal * coupon.discountPercent) / 100)
        }
      }
    }

    // Calculate shipping (simple logic: 25k for delivery, 0 for pickup)
    const shipping = deliveryMethod === 'delivery' ? 25000 : 0

    // Calculate total
    const total = subtotal - discount + shipping

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        status: 'pending',
        deliveryMethod: deliveryMethod as any,
        paymentMethod: paymentMethod as any,
        paymentStatus: 'pending',
        customerName,
        customerPhone,
        customerEmail,
        address,
        district,
        city,
        note,
        subtotal,
        discount,
        shipping,
        total,
        ecoPackaging,
        userId,
        couponId: couponCode
          ? (await prisma.coupon.findUnique({
              where: { code: couponCode },
              select: { id: true },
            }))?.id
          : undefined,
        items: {
          create: itemsWithPrice.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            ice: item.ice,
            sugar: item.sugar,
            milk: item.milk,
            size: item.size,
            itemNote: item.itemNote,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        coupon: true,
      },
    })

    // Increment coupon usage if used
    if (couponCode) {
      await prisma.coupon.update({
        where: { code: couponCode },
        data: { usedCount: { increment: 1 } },
      })
    }

    res.status(201).json({
      data: order,
      message: 'Order created successfully. Proceed to payment.',
    })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/orders ────────────────────────────────────────────────────────
/**
 * Get user's order history (paginated)
 */
router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId
    const { limit = '20', offset = '0' } = req.query

    const safeLimit = Math.min(Math.max(parseInt(String(limit)) || 20, 1), 100)
    const safeOffset = Math.max(parseInt(String(offset)) || 0, 0)

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: true } }, coupon: true },
        orderBy: { createdAt: 'desc' },
        take: safeLimit,
        skip: safeOffset,
      }),
      prisma.order.count({ where: { userId } }),
    ])

    res.json({
      data: orders,
      pagination: {
        total,
        limit: safeLimit,
        offset: safeOffset,
        hasMore: safeOffset + safeLimit < total,
      },
    })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/orders/:id ────────────────────────────────────────────────────
/**
 * Get order detail (only owner can view)
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        coupon: true,
        user: { select: { id: true, name: true, email: true } },
      },
    })

    if (!order) {
      res.status(404).json({ error: 'Order not found' })
      return
    }

    // ⚠️ SECURITY: Only owner can view
    if (order.userId !== userId) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }

    res.json({ data: order })
  } catch (error) {
    next(error)
  }
})

// ─── PATCH /api/orders/:id/status ──────────────────────────────────────────
/**
 * Update order status (admin only)
 * Body: { status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled' }
 */
router.patch('/:id/status', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' })
      return
    }

    // ⚠️ SECURITY: Check admin role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    const isAdmin = user?.role === 'ADMIN'
    if (!isAdmin) {
      res.status(403).json({ error: 'Admin only' })
      return
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: { items: { include: { product: true } } },
    })

    res.json({ data: order })
  } catch (error) {
    next(error)
  }
})

// ─── PATCH /api/orders/:id/payment-status ──────────────────────────────────
/**
 * Update payment status (webhook from payment provider)
 */
router.patch('/:id/payment-status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { paymentStatus } = req.body

    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded']
    if (!validPaymentStatuses.includes(paymentStatus)) {
      res.status(400).json({ error: 'Invalid payment status' })
      return
    }

    // TODO: Verify webhook signature here

    const order = await prisma.order.update({
      where: { id },
      data: { paymentStatus: paymentStatus as any },
    })

    res.json({ data: order })
  } catch (error) {
    next(error)
  }
})

export default router
