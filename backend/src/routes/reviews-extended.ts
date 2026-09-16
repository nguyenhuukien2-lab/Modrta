import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware'

const router = Router()

// ─── GET /api/reviews/:id ────────────────────────────────────────────────
/**
 * Get single review
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    })

    if (!review) {
      res.status(404).json({ error: 'Review not found' })
      return
    }

    res.json({ data: review })
  } catch (error) {
    next(error)
  }
})

// ─── PUT /api/reviews/:id ────────────────────────────────────────────────
/**
 * Update review (owner only)
 */
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params
    const { rating, title, content } = req.body

    const review = await prisma.review.findUnique({
      where: { id },
    })

    if (!review) {
      res.status(404).json({ error: 'Review not found' })
      return
    }

    if (review.userId !== userId) {
      res.status(403).json({ error: 'Cannot update other user reviews' })
      return
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating: Math.max(Math.min(rating, 5), 1) }),
        ...(title && { title }),
        ...(content && { content }),
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    })

    res.json({ data: updated })
  } catch (error) {
    next(error)
  }
})

// ─── DELETE /api/reviews/:id ────────────────────────────────────────────
/**
 * Delete review (owner only)
 */
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params

    const review = await prisma.review.findUnique({
      where: { id },
    })

    if (!review) {
      res.status(404).json({ error: 'Review not found' })
      return
    }

    if (review.userId !== userId) {
      res.status(403).json({ error: 'Cannot delete other user reviews' })
      return
    }

    await prisma.review.delete({
      where: { id },
    })

    res.json({ message: 'Review deleted' })
  } catch (error) {
    next(error)
  }
})

// ─── POST /api/reviews/:id/helpful ──────────────────────────────────────
/**
 * Mark review as helpful
 */
router.post('/:id/helpful', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const review = await prisma.review.findUnique({
      where: { id },
    })

    if (!review) {
      res.status(404).json({ error: 'Review not found' })
      return
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { helpful: { increment: 1 } },
    })

    res.json({ data: updated })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/reviews (with sorting) ────────────────────────────────────
/**
 * Get reviews with sorting
 * Query: productId, sort (helpful|recent|rating), limit, offset
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, sort = 'recent', limit = '10', offset = '0' } = req.query

    if (!productId) {
      res.status(400).json({ error: 'Product ID required' })
      return
    }

    const safeSort = ['helpful', 'recent', 'rating'].includes(String(sort)) ? String(sort) : 'recent'
    const safeLimit = Math.min(Math.max(parseInt(String(limit)) || 10, 1), 100)
    const safeOffset = Math.max(parseInt(String(offset)) || 0, 0)

    let orderBy: any = [{ createdAt: 'desc' }]
    switch (safeSort) {
      case 'helpful':
        orderBy = [{ helpful: 'desc' }, { createdAt: 'desc' }]
        break
      case 'rating':
        orderBy = [{ rating: 'desc' }, { createdAt: 'desc' }]
        break
      default:
        orderBy = [{ createdAt: 'desc' }]
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId: String(productId) },
        include: { user: { select: { id: true, name: true } } },
        orderBy,
        take: safeLimit,
        skip: safeOffset,
      }),
      prisma.review.count({ where: { productId: String(productId) } }),
    ])

    res.json({
      data: reviews,
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

export default router
