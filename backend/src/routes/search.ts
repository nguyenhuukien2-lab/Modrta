import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// ─── GET /api/search/trending ──────────────────────────────────────────────
/**
 * Get trending products (bestsellers + recently popular)
 */
router.get('/trending', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = '10' } = req.query
    const safeLimit = Math.min(Math.max(parseInt(String(limit)) || 10, 1), 100)

    const products = await prisma.product.findMany({
      where: { inStock: true },
      include: {
        categoryRef: { select: { id: true, name: true, slug: true } },
        reviews: { select: { id: true, rating: true } },
      },
      orderBy: [{ isBestseller: 'desc' }, { createdAt: 'desc' }],
      take: safeLimit,
    })

    const productsWithRating = products.map(p => {
      const { categoryRef, reviews, ...rest } = p
      return {
        ...rest,
        category: categoryRef,
        avgRating: reviews.length > 0
          ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
          : null,
        reviewCount: reviews.length,
      }
    })

    res.json({ data: productsWithRating })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/search/bestsellers ──────────────────────────────────────────
/**
 * Get best-selling products
 */
router.get('/bestsellers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = '10', category } = req.query
    const safeLimit = Math.min(Math.max(parseInt(String(limit)) || 10, 1), 100)

    const where: any = {
      inStock: true,
      isBestseller: true,
    }

    if (category && category !== 'all') {
      where.category = String(category)
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        categoryRef: { select: { id: true, name: true, slug: true } },
        reviews: { select: { id: true, rating: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: safeLimit,
    })

    const productsWithRating = products.map(p => {
      const { categoryRef, reviews, ...rest } = p
      return {
        ...rest,
        category: categoryRef,
        avgRating: reviews.length > 0
          ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
          : null,
        reviewCount: reviews.length,
      }
    })

    res.json({ data: productsWithRating })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/search/new-arrivals ────────────────────────────────────────
/**
 * Get newest products
 */
router.get('/new-arrivals', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = '10', days = '30', category } = req.query
    const safeLimit = Math.min(Math.max(parseInt(String(limit)) || 10, 1), 100)
    const safeDays = Math.max(parseInt(String(days)) || 30, 1)

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - safeDays)

    const where: any = {
      inStock: true,
      isNew: true,
      createdAt: { gte: cutoffDate },
    }

    if (category && category !== 'all') {
      where.category = String(category)
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        categoryRef: { select: { id: true, name: true, slug: true } },
        reviews: { select: { id: true, rating: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: safeLimit,
    })

    const productsWithRating = products.map(p => {
      const { categoryRef, reviews, ...rest } = p
      return {
        ...rest,
        category: categoryRef,
        avgRating: reviews.length > 0
          ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
          : null,
        reviewCount: reviews.length,
      }
    })

    res.json({ data: productsWithRating })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/search/top-rated ────────────────────────────────────────────
/**
 * Get top-rated products (calculated from reviews)
 */
router.get('/top-rated', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = '10', minReviews = '5' } = req.query
    const safeLimit = Math.min(Math.max(parseInt(String(limit)) || 10, 1), 100)
    const safeMinReviews = Math.max(parseInt(String(minReviews)) || 5, 1)

    const products = await prisma.product.findMany({
      where: { inStock: true },
      include: {
        categoryRef: { select: { id: true, name: true, slug: true } },
        reviews: { select: { rating: true } },
      },
    })

    const productsWithRating = products
      .map(p => {
        const { categoryRef, reviews, ...rest } = p
        const avgRating = reviews.length > 0
          ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
          : 0
        return {
          ...rest,
          category: categoryRef,
          avgRating,
          reviewCount: reviews.length,
        }
      })
      .filter(p => p.reviewCount >= safeMinReviews)
      .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
      .slice(0, safeLimit)

    res.json({ data: productsWithRating })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/search ──────────────────────────────────────────────────────
/**
 * Advanced search with filters
 * Query: q, category, minPrice, maxPrice, minRating, sort, limit, offset
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      q = '',
      category = 'all',
      minPrice = '0',
      maxPrice = '999999999',
      minRating = '0',
      sort = 'popularity',
      limit = '20',
      offset = '0',
    } = req.query

    const safeQ = String(q).trim().slice(0, 100)
    const safeCategory = String(category)
    const safeMinPrice = Math.max(parseInt(String(minPrice)) || 0, 0)
    const safeMaxPrice = Math.min(parseInt(String(maxPrice)) || 999999999, 999999999)
    const safeMinRating = Math.max(Math.min(parseInt(String(minRating)) || 0, 5), 0)
    const safeSort = ['popularity', 'newest', 'price-asc', 'price-desc', 'rating'].includes(String(sort))
      ? String(sort)
      : 'popularity'
    const safeLimit = Math.min(Math.max(parseInt(String(limit)) || 20, 1), 100)
    const safeOffset = Math.max(parseInt(String(offset)) || 0, 0)

    const where: any = {
      price: { gte: safeMinPrice, lte: safeMaxPrice },
      inStock: true,
    }

    if (safeCategory !== 'all') {
      where.category = safeCategory
    }

    if (safeQ) {
      where.OR = [
        { name: { contains: safeQ, mode: 'insensitive' } },
        { description: { contains: safeQ, mode: 'insensitive' } },
        { tags: { hasSome: [safeQ] } },
      ]
    }

    let orderBy: any = []
    switch (safeSort) {
      case 'newest':
        orderBy = [{ createdAt: 'desc' }]
        break
      case 'price-asc':
        orderBy = [{ price: 'asc' }]
        break
      case 'price-desc':
        orderBy = [{ price: 'desc' }]
        break
      case 'rating':
        orderBy = [{ createdAt: 'desc' }]
        break
      default:
        orderBy = [{ isBestseller: 'desc' }, { isNew: 'desc' }, { createdAt: 'desc' }]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          categoryRef: { select: { id: true, name: true, slug: true } },
          reviews: { select: { id: true, rating: true } },
        },
        orderBy,
        take: safeLimit,
        skip: safeOffset,
      }),
      prisma.product.count({ where }),
    ])

    const productsWithRating = products
      .map(p => {
        const { categoryRef, reviews, ...rest } = p
        return {
          ...rest,
          category: categoryRef,
          avgRating: reviews.length > 0
            ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
            : null,
          reviewCount: reviews.length,
        }
      })
      .filter(p => (p.avgRating || 0) >= safeMinRating)

    res.json({
      data: productsWithRating,
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
