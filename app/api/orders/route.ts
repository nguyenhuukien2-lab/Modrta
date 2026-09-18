import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = req.headers.get('Authorization') || ''

    if (!auth) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 })
    }

    const res = await fetch(`${BACKEND}/api/orders`, {
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

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('Authorization') || ''
    const { searchParams } = new URL(req.url)
    const res = await fetch(`${BACKEND}/api/orders?${searchParams.toString()}`, {
      headers: { 'Authorization': auth },
      cache: 'no-store',
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 })
  }
}
