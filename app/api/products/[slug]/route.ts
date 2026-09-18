import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/data/products'

const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const res = await fetch(`${BACKEND}/api/products/${params.slug}`, { cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    const product = products.find(item => item.slug === params.slug)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...product,
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      tags: product.tags,
      ingredients: product.ingredients || [],
      isBestseller: !!product.isBestseller,
      isNew: !!product.isNew,
      inStock: !!product.inStock,
      avgRating: 4.8,
      reviewCount: 12,
      reviews: [
        {
          id: 'fallback-review-1',
          rating: 5,
          title: 'Rất ngon',
          content: 'Hương vị rất ổn và phục vụ nhanh.',
          verified: true,
          user: { id: 'demo-user', name: 'Khách hàng Modtra' },
          createdAt: new Date().toISOString(),
        },
      ],
    })
  }
}
