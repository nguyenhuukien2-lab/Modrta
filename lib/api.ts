/**
 * API Client for Modtra Backend
 * Uses Next.js API proxy routes to avoid CORS issues
 */

// Client-side: use relative URLs (proxy). Server-side: use full URL.
const API_BASE = typeof window !== 'undefined'
  ? ''  // client → relative URL → Next.js proxy
  : (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') // server → direct

export interface ApiResponse<T> {
  data?: T
  error?: string
  pagination?: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

// ─── PRODUCTS ──────────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string
  q?: string
  limit?: number
  offset?: number
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sort?: 'popularity' | 'price-asc' | 'price-desc' | 'newest' | 'rating'
}

export async function getProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams()

  if (filters.category) params.append('category', filters.category)
  if (filters.q) params.append('q', filters.q)
  if (filters.limit) params.append('limit', String(filters.limit))
  if (filters.offset) params.append('offset', String(filters.offset))
  if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice))
  if (filters.minRating !== undefined) params.append('minRating', String(filters.minRating))
  if (filters.sort) params.append('sort', filters.sort)

  const res = await fetch(`${API_BASE}/api/products?${params.toString()}`, {
    cache: 'no-store', // Disable cache during development
  })

  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json() as Promise<ApiResponse<any[]>>
}

export async function getProduct(slug: string) {
  const res = await fetch(`${API_BASE}/api/products/${slug}`, {
    next: { revalidate: 300 }, // Cache 5 minutes
  })

  if (!res.ok) throw new Error('Product not found')
  return res.json()
}

export async function getRelatedProducts(productId: string, limit = 4) {
  const res = await fetch(`${API_BASE}/api/products/related/${productId}?limit=${limit}`, {
    next: { revalidate: 300 }, // Cache 5 minutes
  })

  if (!res.ok) throw new Error('Failed to fetch related products')
  return res.json() as Promise<ApiResponse<any[]>>
}

export async function getProductAutocomplete(q: string) {
  const params = new URLSearchParams()
  params.append('q', q)

  const res = await fetch(`${API_BASE}/api/products/search/autocomplete?${params.toString()}`, {
    next: { revalidate: 60 }, // Cache 1 minute
  })

  if (!res.ok) throw new Error('Failed to fetch autocomplete')
  return res.json() as Promise<{ suggestions: string[]; error?: string }>
}

// ─── ORDERS ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  productId: string
  quantity: number
  ice?: string
  sugar?: string
  milk?: string
  size?: string
  itemNote?: string
}

export interface CreateOrderInput {
  items: OrderItem[]
  deliveryMethod: 'delivery' | 'pickup'
  paymentMethod: 'vietqr' | 'momo' | 'zalopay' | 'card' | 'cod'
  customerName: string
  customerPhone: string
  customerEmail?: string
  address?: string
  district?: string
  city?: string
  note?: string
  couponCode?: string
  ecoPackaging?: boolean
}

export async function createOrder(order: CreateOrderInput, token: string) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(order),
  })

  if (!res.ok) throw new Error('Failed to create order')
  return res.json() as Promise<ApiResponse<any>>
}

export async function getOrders(token: string, limit = 20, offset = 0) {
  const params = new URLSearchParams()
  params.append('limit', String(limit))
  params.append('offset', String(offset))

  const res = await fetch(`${API_BASE}/api/orders?${params.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json() as Promise<ApiResponse<any[]>>
}

export async function getOrder(orderId: string, token: string) {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Failed to fetch order')
  return res.json() as Promise<ApiResponse<any>>
}

export async function updateOrderStatus(orderId: string, status: string, token: string) {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })

  if (!res.ok) throw new Error('Failed to update order')
  return res.json() as Promise<ApiResponse<any>>
}

// ─── COUPONS ───────────────────────────────────────────────────────────────────

export interface Coupon {
  id: string
  code: string
  discountPercent: number
  minOrderValue: number
  maxUses: number
  usedCount: number
  expiresAt?: string
}

export async function getCoupons() {
  const res = await fetch(`${API_BASE}/api/coupons`, {
    next: { revalidate: 60 }, // Cache 1 minute
  })

  if (!res.ok) throw new Error('Failed to fetch coupons')
  return res.json() as Promise<{ data: Coupon[]; error?: string }>
}

export async function validateCoupon(code: string, subtotal: number) {
  const res = await fetch(`${API_BASE}/api/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, subtotal }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Invalid coupon')
  }

  return res.json() as Promise<{
    data: {
      code: string
      discountPercent: number
      discount: number
      finalSubtotal: number
    }
  }>
}

export interface Review {
  id: string
  rating: number
  title: string
  content: string
  verified: boolean
  user: { id: string; name: string }
  createdAt: string
}

export interface ReviewInput {
  productId: string
  rating: number
  title: string
  content: string
}

export async function getReviews(productId: string) {
  const res = await fetch(`${API_BASE}/api/reviews?productId=${productId}`, {
    next: { revalidate: 60 }, // Cache 1 minute
  })

  if (!res.ok) throw new Error('Failed to fetch reviews')
  return res.json() as Promise<ApiResponse<Review[]>>
}

export async function createReview(review: ReviewInput, token: string) {
  const res = await fetch(`${API_BASE}/api/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(review),
  })

  if (!res.ok) throw new Error('Failed to create review')
  return res.json() as Promise<ApiResponse<Review>>
}

// ─── CATEGORIES ────────────────────────────────────────────────────────────────

export async function getCategories() {
  const res = await fetch(`${API_BASE}/api/categories`, {
    cache: 'no-store', // Disable cache during development
  })

  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

// ─── LOCATIONS ─────────────────────────────────────────────────────────────────

export async function getLocations() {
  const res = await fetch(`${API_BASE}/api/locations`, {
    next: { revalidate: 3600 }, // Cache 1 hour
  })

  if (!res.ok) throw new Error('Failed to fetch locations')
  return res.json()
}

// ─── AUTH ──────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) throw new Error('Login failed')
  return res.json() as Promise<AuthResponse>
}

export async function register(email: string, name: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, password }),
  })

  if (!res.ok) throw new Error('Registration failed')
  return res.json() as Promise<AuthResponse>
}

export async function getMe(token: string) {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json() as Promise<{ user: any }>
}

export async function updateProfile(
  profile: { name?: string; phone?: string; address?: string; district?: string; city?: string },
  token: string
) {
  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  })

  if (!res.ok) throw new Error('Failed to update profile')
  return res.json() as Promise<any>
}
