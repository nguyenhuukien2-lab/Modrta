import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-me')
const JWT_EXPIRES_IN = '7d' // 7 days

export interface JWTPayload {
  userId: string
  email: string
  role?: string
  iat?: number
  exp?: number
}

/**
 * Sign JWT token
 */
export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET)

  return token
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as unknown as JWTPayload
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

/**
 * Extract token from Authorization header
 */
export function getTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null
  const [scheme, token] = authHeader.split(' ')
  return scheme === 'Bearer' ? token : null
}

export function getTokenFromCookie(cookieHeader?: string): string | null {
  if (!cookieHeader) return null

  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('modtra_token='))

  if (!cookie) return null

  const [, token] = cookie.split('=')
  return token ? decodeURIComponent(token) : null
}
