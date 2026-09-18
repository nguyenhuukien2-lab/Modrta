import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/data/products'

const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  try {
    const res = await fetch(`${BACKEND}/api/products?${searchParams.toString()}`, {
      cache: 'no-store',
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    const q = (searchParams.get('q') || '').trim().toLowerCase()
    const category = (searchParams.get('category') || 'all').toString()

    let filtered = [...products]
    if (category && category !== 'all') {
      filtered = filtered.filter(product => product.category === {
        'matcha-nghi-thuc': 'matcha',
        'matcha-sang-tao': 'matcha',
        'ca-phe': 'coffee',
        'trang-mieng': 'dessert',
        'dung-cu': 'equipment',
      }[category])
    }

    if (q) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.tags.some(tag => tag.toLowerCase().includes(q))
      )
    }

    return NextResponse.json({
      data: filtered,
      pagination: {
        total: filtered.length,
        limit: filtered.length || 1,
        offset: 0,
        hasMore: false,
      },
    })
  }
}
