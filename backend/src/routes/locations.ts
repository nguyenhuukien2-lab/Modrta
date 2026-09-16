import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// ─── GET /api/locations ───────────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        district: true,
        city: true,
        phone: true,
        hours: true,
        features: true,
        image: true,
        lat: true,
        lng: true,
      },
      orderBy: { name: 'asc' },
    })

    res.json(locations)
  } catch (error) {
    next(error)
  }
})

export default router
