import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware'

const router = Router()

// ⚠️ All routes require authentication
router.use(authMiddleware)

// ─── GET /api/wishlist ────────────────────────────────────────────────────
/**
 * Get user's wishlist
 */
router.get('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    
    const userId = req.user.userId
    const { limit = '20', offset = '0' } = req.query

    const safeLimit = Math.min(Math.max(parseInt(String(limit)) || 20, 1), 100)
    const safeOffset = Math.max(parseInt(String(offset)) || 0, 0)

    const [wishlistItems, total] = await Promise.all([
      prisma.wishlistItem.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              categoryRef: { select: { id: true, name: true, slug: true } },
              reviews: { select: { rating: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: safeLimit,
        skip: safeOffset,
      }),
      prisma.wishlistItem.count({ where: { userId } }),
    ])

    const items = wishlistItems.map(item => {
      const { product, ...rest } = item
      const { categoryRef, reviews, ...productData } = product
      return {
        ...rest,
        product: {
          ...productData,
          category: categoryRef,
          avgRating: reviews.length > 0
            ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
            : null,
          reviewCount: reviews.length,
        },
      }
    })

    res.json({
      data: items,
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

// ─── POST /api/wishlist ───────────────────────────────────────────────────
/**
 * Add product to wishlist
 * Body: { productId: string }
 */
router.post('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    
    const userId = req.user.userId
    const { productId } = req.body

    if (!productId) {
      res.status(400).json({ error: 'Product ID is required' })
      return
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    })

    if (existing) {
      res.status(409).json({ error: 'Product already in wishlist' })
      return
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: { userId, productId },
      include: {
        product: {
          include: {
            categoryRef: { select: { id: true, name: true, slug: true } },
            reviews: { select: { rating: true } },
          },
        },
      },
    })

    res.status(201).json({
      data: {
        id: wishlistItem.id,
        product: wishlistItem.product,
        addedAt: wishlistItem.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
})

// ─── DELETE /api/wishlist/:productId ──────────────────────────────────────
/**
 * Remove product from wishlist
 */
router.delete('/:productId', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    
    const userId = req.user.userId
    const { productId } = req.params

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    })

    if (!wishlistItem) {
      res.status(404).json({ error: 'Item not in wishlist' })
      return
    }

    await prisma.wishlistItem.delete({
      where: { id: wishlistItem.id },
    })

    res.json({ message: 'Removed from wishlist' })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/wishlist/count ──────────────────────────────────────────────
/**
 * Get wishlist count
 */
router.get('/count', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    
    const userId = req.user.userId

    const count = await prisma.wishlistItem.count({
      where: { userId },
    })

    res.json({ count })
  } catch (error) {
    next(error)
  }
})

// ─── POST /api/wishlist/check ────────────────────────────────────────────
/**
 * Check if products are in wishlist
 * Body: { productIds: string[] }
 */
router.post('/check', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    
    const userId = req.user.userId
    const { productIds = [] } = req.body

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        userId,
        productId: { in: productIds },
      },
      select: { productId: true },
    })

    const inWishlist = new Set(wishlistItems.map(item => item.productId))

    res.json({
      data: productIds.reduce((acc: Record<string, boolean>, id: string) => {
        acc[id] = inWishlist.has(id)
        return acc
      }, {} as Record<string, boolean>),
    })
  } catch (error) {
    next(error)
  }
})

export default router
