import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const res = await fetch(`${BACKEND}/api/reviews?${searchParams.toString()}`, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Backend unavailable', data: [] }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = req.headers.get('Authorization') || ''
    const res = await fetch(`${BACKEND}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': auth },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 })
  }
}
