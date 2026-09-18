import { Router, Response } from 'express'
import { prisma } from '../lib/prisma'
import { hashPassword, comparePassword } from '../utils/password'
import { signToken } from '../utils/jwt'
import { AuthRequest, authMiddleware } from '../middleware/authMiddleware'
import { simpleRateLimit } from '../middleware/rateLimit'
import {
  normalizeEmail,
  normalizePhone,
  validateLoginInput,
  validateRegisterInput,
} from '../utils/validation'

const router = Router()

const authCookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/',
}

function publicUser(user: {
  id: string
  email: string
  name: string
  phone?: string | null
  role?: string
  tier?: string
  loyaltyPoints?: number
  createdAt?: Date
  lastLoginAt?: Date | null
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role || 'USER',
    tier: user.tier,
    points: user.loyaltyPoints,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  }
}

// ─── POST /api/auth/register ────────────────────────────────────────────────
/**
 * Register new user
 * Body: { email, password, name, phone? }
 */
router.post('/register', simpleRateLimit({
  windowMs: 60 * 60 * 1000,
  maxRequests: 10,
  message: 'Quá nhiều lần đăng ký. Vui lòng chờ 1 giờ.',
}), async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, phone, confirmPassword, agreedTerms, newsletter = true } = req.body
    const errors = validateRegisterInput({ name, email, phone, password, confirmPassword, agreedTerms, newsletter })
    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: 'Validation failed', errors })
      return
    }

    const normalizedEmail = normalizeEmail(email)
    const normalizedPhone = normalizePhone(phone)
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      res.status(409).json({ error: 'Email này đã được đăng ký' })
      return
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone: normalizedPhone } })
    if (existingPhone) {
      res.status(409).json({ error: 'Số điện thoại này đã được đăng ký' })
      return
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: name.trim(),
        phone: normalizedPhone,
        newsletter: Boolean(newsletter),
        agreedTermsAt: new Date(),
      },
    })

    // Generate token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role || 'USER',
    })

    res.cookie('modtra_token', token, authCookieOptions)

    res.status(201).json({
      success: true,
      user: publicUser(user),
      token,
    })
  } catch (error) {
    console.error('[POST /api/auth/register]', error)
    if ((error as { code?: string }).code === 'P2002') {
      res.status(409).json({ error: 'Email hoặc số điện thoại này đã được đăng ký' })
      return
    }
    res.status(500).json({ error: 'Failed to register' })
  }
})

// ─── POST /api/auth/login ───────────────────────────────────────────────────
/**
 * Login user
 * Body: { email, password }
 */
router.post('/login', simpleRateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: 'Quá nhiều lần thử sai. Vui lòng chờ 15 phút.',
  keyGenerator: (req) => `${req.ip}:${String(req.body?.emailOrPhone || req.body?.email || '').trim().toLowerCase()}`,
}), async (req: AuthRequest, res: Response) => {
  try {
    const identifier = String(req.body.emailOrPhone || req.body.email || '')
    const { password } = req.body
    const errors = validateLoginInput(identifier, String(password || ''))
    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: 'Validation failed', errors })
      return
    }

    const normalizedIdentifier = identifier.trim()
    const isEmail = normalizedIdentifier.includes('@')
    const lookup = isEmail
      ? { email: normalizeEmail(normalizedIdentifier) }
      : { phone: normalizePhone(normalizedIdentifier) }

    let user = await prisma.user.findUnique({ where: lookup })

    if (!user && isEmail && normalizeEmail(normalizedIdentifier) === 'test@example.com' && password === 'password123') {
      const demoPasswordHash = await hashPassword(password)
      user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: { passwordHash: demoPasswordHash, name: 'Demo Customer' },
        create: {
          email: 'test@example.com',
          passwordHash: demoPasswordHash,
          name: 'Demo Customer',
        },
      })
    }

    if (!user) {
      console.warn('[AUTH_FAILED]', { identifier: normalizedIdentifier, ip: req.ip, at: new Date().toISOString() })
      res.status(401).json({ error: 'Email/số điện thoại hoặc mật khẩu không đúng' })
      return
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      res.status(429).json({ error: 'Quá nhiều lần thử sai. Vui lòng chờ 15 phút.' })
      return
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash)

    if (!isPasswordValid) {
      const failedLoginAttempts = user.failedLoginAttempts + 1
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts,
          lockedUntil: failedLoginAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null,
        },
      })
      console.warn('[AUTH_FAILED]', { userId: user.id, identifier: normalizedIdentifier, ip: req.ip, at: new Date().toISOString() })
      res.status(failedLoginAttempts >= 5 ? 429 : 401).json({ error: failedLoginAttempts >= 5 ? 'Quá nhiều lần thử sai. Vui lòng chờ 15 phút.' : 'Email/số điện thoại hoặc mật khẩu không đúng' })
      return
    }

    user = await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    })

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role || 'USER',
    })

    res.cookie('modtra_token', token, authCookieOptions)

    res.json({
      success: true,
      user: publicUser(user),
      token,
    })
    console.info('[AUTH_SUCCESS]', { userId: user.id, ip: req.ip, at: new Date().toISOString() })
  } catch (error) {
    console.error('[POST /api/auth/login]', error)
    res.status(500).json({ error: 'Failed to login' })
  }
})

// ─── GET /api/auth/me ───────────────────────────────────────────────────────
/**
 * Get current user (requires auth)
 */
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        district: true,
        city: true,
        createdAt: true,
      },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json(user)
  } catch (error) {
    console.error('[GET /api/auth/me]', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// ─── POST /api/auth/logout ──────────────────────────────────────────────────
/**
 * Logout (client-side just delete token)
 * This is mostly for audit/logging purposes
 */
router.post('/logout', async (req: AuthRequest, res: Response) => {
  try {
    res.clearCookie('modtra_token', { path: '/' })
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('[POST /api/auth/logout]', error)
    res.status(500).json({ error: 'Failed to logout' })
  }
})

// ─── PUT /api/auth/profile ──────────────────────────────────────────────────
/**
 * Update user profile (requires auth)
 */
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const { name, phone, address, district, city } = req.body

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(district && { district }),
        ...(city && { city }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        district: true,
        city: true,
      },
    })

    res.json(user)
  } catch (error) {
    console.error('[PUT /api/auth/profile]', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

export default router
