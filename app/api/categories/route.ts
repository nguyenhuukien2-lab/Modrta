import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function GET(_req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND}/api/categories`, {
      cache: 'no-store',
    })
    const data = await res.json()
    // Backend trả về array hoặc {data: []}
    const list = Array.isArray(data) ? data : (data.data || [])
    return NextResponse.json({ data: list })
  } catch (err) {
    return NextResponse.json({ error: 'Backend unavailable', data: [] }, { status: 503 })
  }
}
