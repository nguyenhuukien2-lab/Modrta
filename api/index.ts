import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from '../backend/src/middleware/errorHandler'
import productsRouter from '../backend/src/routes/products'
import categoriesRouter from '../backend/src/routes/categories'
import locationsRouter from '../backend/src/routes/locations'
import authRouter from '../backend/src/routes/auth'
import reviewsRouter from '../backend/src/routes/reviews'
import ordersRouter from '../backend/src/routes/orders'
import couponsRouter from '../backend/src/routes/coupons'
import cartRouter from '../backend/src/routes/cart'
import searchRouter from '../backend/src/routes/search'
import wishlistRouter from '../backend/src/routes/wishlist'
import adminRouter from '../backend/src/routes/admin'
import paymentsRouter from '../backend/src/routes/payments'
import loyaltyRouter from '../backend/src/routes/loyalty'
import reconciliationRouter from '../backend/src/routes/reconciliation'
import shippingRouter from '../backend/src/routes/shipping'
import notificationsRouter from '../backend/src/routes/notifications'
import supportRouter from '../backend/src/routes/support'
import analyticsRouter from '../backend/src/routes/analytics'

dotenv.config({ path: '.env.production' })

const app = express()

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}))
app.use(express.json())

// ─── LOGGING ───────────────────────────────────────────────────────────────────
app.use((req: Request, _res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  })
})

// ─── API ROUTES ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/coupons', couponsRouter)
app.use('/api/search', searchRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/admin', adminRouter)
app.use('/api/admin/reconciliation', reconciliationRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/loyalty', loyaltyRouter)
app.use('/api/shipping', shippingRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/support', supportRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/locations', locationsRouter)

// ─── 404 HANDLER ───────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use(errorHandler)

export default app
