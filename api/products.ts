import { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../backend/src/lib/prisma'

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        reviews: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
    })

    res.status(200).json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}
