import { Router, Response, Request, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest, authMiddleware } from '../middleware/authMiddleware'

const router = Router()

// ─── GET /api/reviews?productId=xxx ────────────────────────────────────────
/**
 * Get reviews for a product
 * Query: productId, limit (default 10), offset (default 0)
 */
router.get('/', async (req: any, res: Response) => {
  try {
    const { productId, limit = '10', offset = '0' } = req.query

    if (!productId) {
      res.status(400).json({ error: 'productId is required' })
      return
    }

    const safeLimit = Math.min(Math.max(parseInt(String(limit)) || 10, 1), 50)
    const safeOffset = Math.max(parseInt(String(offset)) || 0, 0)

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId: String(productId) },
        include: {
          user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: safeLimit,
        skip: safeOffset,
      }),
      prisma.review.count({ where: { productId: String(productId) } }),
    ])

    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
      : null

    res.json({
      data: reviews,
      pagination: { total, limit: safeLimit, offset: safeOffset },
      avgRating,
    })
  } catch (error) {
    console.error('[GET /api/reviews]', error)
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
})

// ─── POST /api/reviews ────────────────────────────────────────────────────
/**
 * Create review (requires auth)
 * Body: { productId, rating, title, content }
 */
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const { productId, rating, title, content } = req.body

    // Validation
    if (!productId || !rating || !title || !content) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Rating must be 1-5' })
      return
    }

    if (title.length < 3 || title.length > 100) {
      res.status(400).json({ error: 'Title must be 3-100 characters' })
      return
    }

    if (content.length < 10 || content.length > 1000) {
      res.status(400).json({ error: 'Content must be 10-1000 characters' })
      return
    }

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user.userId,
        rating,
        title: title.trim(),
        content: content.trim(),
        verified: false, // Would check if user purchased this product
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    })

    res.status(201).json(review)
  } catch (error) {
    console.error('[POST /api/reviews]', error)
    res.status(500).json({ error: 'Failed to create review' })
  }
})

// ─── PUT /api/reviews/:id ───────────────────────────────────────────────────
/**
 * Update review (owner only)
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params
    const { rating, title, content } = req.body

    const review = await prisma.review.findUnique({ where: { id } })
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
    })

    res.json({ data: updated })
  } catch (error) {
    next(error)
  }
})

// ─── DELETE /api/reviews/:id ────────────────────────────────────────────────
/**
 * Delete review (owner only)
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params

    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) {
      res.status(404).json({ error: 'Review not found' })
      return
    }

    if (review.userId !== userId) {
      res.status(403).json({ error: 'Cannot delete other user reviews' })
      return
    }

    await prisma.review.delete({ where: { id } })
    res.json({ message: 'Review deleted' })
  } catch (error) {
    next(error)
  }
})

export default router
