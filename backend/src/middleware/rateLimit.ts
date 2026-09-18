import { Request, Response, NextFunction } from 'express'

interface RateLimitOptions {
  windowMs: number
  maxRequests: number
  message?: string
  keyGenerator?: (req: Request) => string
}

const store = new Map<string, { count: number; resetAt: number }>()

export function simpleRateLimit({
  windowMs,
  maxRequests,
  message = 'Too many requests, please try again later.',
  keyGenerator,
}: RateLimitOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resolvedKey = keyGenerator ? keyGenerator(req) : req.ip || req.headers['x-forwarded-for'] || 'global'
    const key = Array.isArray(resolvedKey) ? resolvedKey.join(',') : String(resolvedKey)
    const now = Date.now()
    const current = store.get(key)

    if (!current || current.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs })
      next()
      return
    }

    if (current.count >= maxRequests) {
      res.status(429).json({ error: message })
      return
    }

    current.count += 1
    next()
  }
}
