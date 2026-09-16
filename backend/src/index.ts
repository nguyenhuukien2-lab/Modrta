import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler'
import { authMiddleware } from './middleware/authMiddleware'
import productsRouter from './routes/products'
import categoriesRouter from './routes/categories'
import locationsRouter from './routes/locations'
import authRouter from './routes/auth'
import reviewsRouter from './routes/reviews'
import ordersRouter from './routes/orders'
import couponsRouter from './routes/coupons'
import cartRouter from './routes/cart'
import searchRouter from './routes/search'
import wishlistRouter from './routes/wishlist'
import adminRouter from './routes/admin'
import paymentsRouter from './routes/payments'
import loyaltyRouter from './routes/loyalty'
import reconciliationRouter from './routes/reconciliation'
import shippingRouter from './routes/shipping'
import notificationsRouter from './routes/notifications'
import supportRouter from './routes/support'
import analyticsRouter from './routes/analytics'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  credentials: false,
}))
app.use(express.json())

// ─── LOGGING ───────────────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
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
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use(errorHandler)

// ─── START ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Modtra Backend running on http://localhost:${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/health`)
  console.log(`📊 API routes:`)
  console.log(`   - POST http://localhost:${PORT}/api/auth/register`)
  console.log(`   - POST http://localhost:${PORT}/api/auth/login`)
  console.log(`   - GET  http://localhost:${PORT}/api/auth/me (requires token)`)
  console.log(`   - GET  http://localhost:${PORT}/api/products`)
  console.log(`   - GET  http://localhost:${PORT}/api/categories`)
  console.log(`   - GET  http://localhost:${PORT}/api/locations`)
})

export default app
