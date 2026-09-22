import { NextRequest, NextResponse } from 'next/server'

const BACKEND = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '')

type RouteContext = { params: { id: string } }

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const auth = req.headers.get('Authorization') || ''
    const cookie = req.headers.get('cookie') || ''
    const response = await fetch(`${BACKEND}/api/orders/${params.id}`, {
      headers: {
        ...(auth ? { Authorization: auth } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
      },
      cache: 'no-store',
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 })
  }
}
