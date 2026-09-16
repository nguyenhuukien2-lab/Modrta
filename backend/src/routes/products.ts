import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { validateQuery } from '../middleware/validation'

const router = Router()

// ─── GET /api/products ────────────────────────────────────────────────────────
/**
 * Advanced product filter + search + sort + pagination
 * Query params:
 *   - category: matcha-nghi-thuc | matcha-sang-tao | ca-phe | trang-mieng | dung-cu | all
 *   - q: search text (name, description, tags)
 *   - minPrice: minimum price (VND)
 *   - maxPrice: maximum price (VND)
 *   - minRating: minimum rating (1-5)
 *   - sort: popularity | newest | price-asc | price-desc | rating
 *   - limit: default 100 (max 100)
 *   - offset: default 0
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      category = 'all', 
      q = '', 
      minPrice = '0',
      maxPrice = '999999999',
      minRating = '0',
      sort = 'popularity',
      limit = '100', 
      offset = '0' 
    } = req.query

    // ⚠️ SECURITY: Validate & sanitize
    const validCategories = ['all', 'matcha-nghi-thuc', 'matcha-sang-tao', 'ca-phe', 'trang-mieng', 'dung-cu']
    const safeCategory = validCategories.includes(String(category)) ? String(category) : 'all'
    const safeQ = String(q).trim().slice(0, 100)
    const safeMinPrice = Math.max(parseInt(String(minPrice)) || 0, 0)
    const safeMaxPrice = Math.min(parseInt(String(maxPrice)) || 999999999, 999999999)
    const safeMinRating = Math.max(Math.min(parseInt(String(minRating)) || 0, 5), 0)
    const safeSort = ['popularity', 'newest', 'price-asc', 'price-desc', 'rating'].includes(String(sort)) ? String(sort) : 'popularity'
    const safeLimit = Math.min(Math.max(parseInt(String(limit)) || 100, 1), 100)
    const safeOffset = Math.max(parseInt(String(offset)) || 0, 0)

    // Build where clause
    const where: any = {
      price: { gte: safeMinPrice, lte: safeMaxPrice },
    }

    if (safeCategory !== 'all') {
      // Filter by category enum value (matcha, coffee, dessert, equipment)
      where.category = safeCategory === 'matcha-nghi-thuc' || safeCategory === 'matcha-sang-tao' 
        ? 'matcha' 
        : safeCategory === 'ca-phe' 
        ? 'coffee'
        : safeCategory === 'trang-mieng'
        ? 'dessert'
        : 'equipment'
    }

    if (safeQ) {
      where.OR = [
        { name: { contains: safeQ, mode: 'insensitive' } },
        { description: { contains: safeQ, mode: 'insensitive' } },
        { tags: { hasSome: [safeQ] } },
      ]
    }

    // Build orderBy
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
        // Would need to join with reviews, skip for now
        orderBy = [{ createdAt: 'desc' }]
        break
      default: // popularity
        orderBy = [{ isBestseller: 'desc' }, { isNew: 'desc' }, { createdAt: 'desc' }]
    }

    // Fetch products
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

    // Calculate average ratings and map categoryRef to category
    const productsWithRating = products.map(p => {
      const { categoryRef, reviews, ...rest } = p
      return {
        ...rest,
        category: categoryRef?.slug || p.category, // Return slug instead of object
        avgRating: reviews.length > 0 
          ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
          : null,
        reviewCount: reviews.length,
      }
    })

    // Apply minRating filter (post-fetch since we calculated ratings)
    const filtered = productsWithRating.filter(p => {
      if (safeMinRating === 0) return true
      return (p.avgRating || 0) >= safeMinRating
    })

    res.json({
      data: filtered,
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

// ─── GET /api/products/:id ────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // ⚠️ SECURITY: Validate slug format
    if (!/^[a-z0-9-]+$/.test(id)) {
      res.status(400).json({ error: 'Invalid product ID' })
      return
    }

    const product = await prisma.product.findUnique({
      where: { slug: id },
      include: { 
        categoryRef: true,
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? Number((product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1))
      : null

    // Map categoryRef to category for consistent API response
    const { categoryRef, ...productData } = product
    
    res.json({
      ...productData,
      category: categoryRef?.slug || productData.category,
      avgRating,
      reviewCount: product.reviews.length,
    })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/products/related/:id ────────────────────────────────────────────
/**
 * Get related products (same category, different product)
 */
router.get('/related/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { slug: id },
      select: { 
        categoryId: true,
      },
    })

    if (!product || !product.categoryId) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        slug: { not: id },
      },
      take: 4,
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        image: true,
        isBestseller: true,
      },
    })

    res.json(related)
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/products/search/autocomplete ────────────────────────────────────
/**
 * Search autocomplete suggestions
 */
router.get('/search/autocomplete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q = '' } = req.query
    const safeQ = String(q).trim().slice(0, 50)

    if (safeQ.length < 2) {
      res.json([])
      return
    }

    const suggestions = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: safeQ, mode: 'insensitive' } },
          { tags: { hasSome: [safeQ] } },
        ],
      },
      select: { name: true, slug: true },
      take: 5,
      distinct: ['name'],
    })

    res.json(suggestions)
  } catch (error) {
    next(error)
  }
})

export default router
