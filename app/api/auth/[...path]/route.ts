import { NextRequest, NextResponse } from 'next/server'

const backendUrl = (
  process.env.BACKEND_URL
  || process.env.NEXT_PUBLIC_API_URL
  || (process.env.NODE_ENV !== 'production' ? 'http://localhost:4000' : '')
).replace(/\/$/, '')

async function proxy(request: NextRequest, context: { params: { path: string[] } }) {
  if (!backendUrl) {
    return NextResponse.json({ error: 'Backend URL is not configured' }, { status: 503 })
  }

  const path = context.params.path.join('/')
  const headers = new Headers(request.headers)
  headers.delete('host')

  let response: Response
  try {
    response = await fetch(`${backendUrl}/api/auth/${path}`, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text(),
      cache: 'no-store',
    })
  } catch {
    return NextResponse.json({ error: 'Authentication backend is unavailable' }, { status: 503 })
  }

  const responseHeaders = new Headers()
  const contentType = response.headers.get('content-type')
  const setCookie = response.headers.get('set-cookie')
  if (contentType) responseHeaders.set('content-type', contentType)
  if (setCookie) responseHeaders.set('set-cookie', setCookie)

  return new NextResponse(await response.text(), {
    status: response.status,
    headers: responseHeaders,
  })
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
