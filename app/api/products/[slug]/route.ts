import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const res = await fetch(`${BACKEND}/api/products/${params.slug}`, { cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 })
  }
}
