import { Request, Response, NextFunction } from 'express'
import { verifyToken, getTokenFromHeader } from '../utils/jwt'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
  }
}

/**
 * Middleware to verify JWT and attach user to request
 */
export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = getTokenFromHeader(req.headers.authorization)

    if (!token) {
      res.status(401).json({ error: 'Missing authorization token' })
      return
    }

    const payload = await verifyToken(token)
    req.user = {
      userId: payload.userId,
      email: payload.email,
    }

    next()
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

/**
 * Optional auth middleware (doesn't fail, just adds user if token exists)
 */
export async function optionalAuthMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = getTokenFromHeader(req.headers.authorization)

    if (token) {
      const payload = await verifyToken(token)
      req.user = {
        userId: payload.userId,
        email: payload.email,
      }
    }

    next()
  } catch (error) {
    // Silently fail, continue without auth
    next()
  }
}
