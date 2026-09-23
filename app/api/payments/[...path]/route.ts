import { NextRequest, NextResponse } from 'next/server'

const BACKEND = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '')

type RouteContext = { params: { path: string[] } }

async function proxy(request: NextRequest, context: RouteContext) {
  const path = context.params.path.join('/')
  const headers = new Headers()
  const authorization = request.headers.get('authorization')
  const cookie = request.headers.get('cookie')

  if (authorization) headers.set('authorization', authorization)
  if (cookie) headers.set('cookie', cookie)
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    headers.set('content-type', request.headers.get('content-type') || 'application/json')
  }

  try {
    const response = await fetch(`${BACKEND}/api/payments/${path}`, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text(),
      cache: 'no-store',
    })

    const responseHeaders = new Headers()
    const contentType = response.headers.get('content-type')
    if (contentType) responseHeaders.set('content-type', contentType)

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: responseHeaders,
    })
  } catch {
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 })
  }
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
