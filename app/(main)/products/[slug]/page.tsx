'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Heart, Share2, Star, Check, Minus, Plus, ShoppingCart, ArrowLeft, Loader, Send } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/lib/context/AuthContext'
import { formatPrice } from '@/lib/utils'

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Review {
  id: string
  rating: number
  title: string
  content: string
  verified: boolean
  user: { id: string; name: string }
  createdAt: string
}

interface ProductDetail {
  id: string
  slug: string
  name: string
  price: number
  image: string
  description: string
  tags: string[]
  ingredients: string[]
  isBestseller: boolean
  isNew: boolean
  inStock: boolean
  customIce?: boolean
  customSugar?: boolean
  customMilk?: string[]
  customSize?: string[]
  avgRating?: number
  reviewCount: number
  reviews: Review[]
}

// ─── STAR RATING INPUT ────────────────────────────────────────────────────────

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hover || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { addItem } = useCartStore()
  const { user, token } = useAuth()

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [customizations, setCustomizations] = useState({
    ice: '100%', sugar: '100%', milk: '', size: 'M',
  })

  // Wishlist state
  const [wishlisted, setWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // Review form state
  const [reviews, setReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewContent, setReviewContent] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reviewError, setReviewError] = useState('')

  // Load product
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch(`/api/products/${slug}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setProduct(data)
        setReviews(data.reviews || [])
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  // Load wishlist status
  useEffect(() => {
    if (!token || !product) return
    fetch('/api/wishlist', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        const list = d.data || []
        setWishlisted(list.some((w: any) => w.productId === product.id || w.product?.id === product.id))
      })
      .catch(() => {})
  }, [token, product])

  // Toggle wishlist
  const handleWishlist = async () => {
    if (!token) { alert('Vui lòng đăng nhập để lưu yêu thích'); return }
    if (!product) return
    setWishlistLoading(true)
    try {
      const method = wishlisted ? 'DELETE' : 'POST'
      await fetch('/api/wishlist', {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product.id }),
      })
      setWishlisted(!wishlisted)
    } catch {}
    finally { setWishlistLoading(false) }
  }

  // Add to cart
  const handleAddToCart = () => {
    if (!product) return
    addItem(product as any, customizations)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  // Submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) { setReviewError('Vui lòng đăng nhập để đánh giá'); return }
    if (!reviewTitle.trim() || !reviewContent.trim()) {
      setReviewError('Vui lòng điền tiêu đề và nội dung')
      return
    }
    try {
      setSubmittingReview(true)
      setReviewError('')
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          productId: product!.id,
          rating: reviewRating,
          title: reviewTitle,
          content: reviewContent,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gửi đánh giá thất bại')

      // Add review to list optimistically
      const newReview: Review = {
        id: data.data?.id || Date.now().toString(),
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent,
        verified: false,
        user: { id: user!.id, name: user!.name },
        createdAt: new Date().toISOString(),
      }
      setReviews(prev => [newReview, ...prev])
      setReviewSuccess(true)
      setShowReviewForm(false)
      setReviewTitle('')
      setReviewContent('')
      setReviewRating(5)
      setTimeout(() => setReviewSuccess(false), 4000)
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Gửi đánh giá thất bại')
    } finally {
      setSubmittingReview(false)
    }
  }

  // Share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product?.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Đã copy link!')
    }
  }

  // ── Loading / Not Found ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface-bg flex flex-col items-center justify-center gap-4">
        <p className="text-text-muted text-lg">Không tìm thấy sản phẩm</p>
        <Link href="/menu" className="text-brand-primary hover:underline">← Quay lại thực đơn</Link>
      </div>
    )
  }

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product.avgRating || 0

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-surface-card-alt">
        <div className="container-custom py-3 flex items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="hover:text-brand-primary">Trang chủ</Link>
          <span>/</span>
          <Link href="/menu" className="hover:text-brand-primary">Thực đơn</Link>
          <span>/</span>
          <span className="text-text-main font-medium">{product.name}</span>
        </div>
      </div>

      <div className="container-custom py-8">
        <Link href="/menu" className="inline-flex items-center gap-2 text-brand-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>

        {/* ── Product Info ── */}
        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-card-alt shadow-card">
            <Image src={product.image} alt={product.name} fill className="object-cover" priority />
            {product.isNew && (
              <div className="absolute top-4 right-4 bg-brand-accent text-white px-3 py-1 rounded-full text-sm font-semibold">Mới</div>
            )}
            {product.isBestseller && (
              <div className="absolute top-4 left-4 bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-semibold">⭐ Bestseller</div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-text-main mb-2">{product.name}</h1>

            {/* Rating summary */}
            {avgRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-text-muted">{avgRating.toFixed(1)} ({reviews.length} đánh giá)</span>
              </div>
            )}

            <div className="text-3xl font-bold text-brand-primary mb-4">{formatPrice(product.price)}</div>
            <p className="text-text-muted mb-6 leading-relaxed">{product.description}</p>

            {/* Ingredients */}
            {product.ingredients?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-text-main mb-2">Thành phần:</p>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="text-xs px-3 py-1 bg-surface-card-alt rounded-full text-text-muted">{ing}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Customizations */}
            <div className="space-y-3 mb-6 p-4 bg-surface-bg rounded-xl border border-surface-card-alt">
              {product.customSize && product.customSize.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-text-main mb-2 block">Size</label>
                  <div className="flex gap-2">
                    {product.customSize.map(size => (
                      <button key={size} onClick={() => setCustomizations(c => ({...c, size}))}
                        className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${customizations.size === size ? 'bg-brand-primary text-white' : 'bg-surface-card-alt text-text-main hover:bg-brand-accent/10'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {product.customIce && (
                <div>
                  <label className="text-sm font-semibold text-text-main mb-1 block">Đá</label>
                  <select value={customizations.ice} onChange={e => setCustomizations(c => ({...c, ice: e.target.value}))}
                    className="w-full px-3 py-2 border border-surface-card-alt rounded-lg text-sm">
                    <option value="0%">Không đá</option>
                    <option value="50%">50% đá</option>
                    <option value="100%">Nhiều đá</option>
                  </select>
                </div>
              )}
              {product.customSugar && (
                <div>
                  <label className="text-sm font-semibold text-text-main mb-1 block">Ngọt</label>
                  <select value={customizations.sugar} onChange={e => setCustomizations(c => ({...c, sugar: e.target.value}))}
                    className="w-full px-3 py-2 border border-surface-card-alt rounded-lg text-sm">
                    <option value="0%">Không ngọt</option>
                    <option value="50%">50% ngọt</option>
                    <option value="100%">100% ngọt</option>
                  </select>
                </div>
              )}
              {product.customMilk && product.customMilk.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-text-main mb-1 block">Loại sữa</label>
                  <select value={customizations.milk} onChange={e => setCustomizations(c => ({...c, milk: e.target.value}))}
                    className="w-full px-3 py-2 border border-surface-card-alt rounded-lg text-sm">
                    <option value="">Chọn loại sữa</option>
                    {product.customMilk.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border-2 border-surface-card-alt rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-surface-bg transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-text-main min-w-[2.5rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 hover:bg-surface-bg transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button onClick={handleAddToCart} disabled={!product.inStock}
                className={`flex-1 py-3 px-5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  addedToCart ? 'bg-green-500 text-white' : 'bg-brand-primary text-white hover:bg-brand-primary/90'
                } disabled:opacity-50`}>
                {addedToCart ? <><Check className="w-5 h-5" /> Đã thêm!</> : <><ShoppingCart className="w-5 h-5" /> Thêm vào giỏ</>}
              </button>

              {/* Wishlist */}
              <button onClick={handleWishlist} disabled={wishlistLoading}
                className={`p-3 border-2 rounded-xl transition-all ${wishlisted ? 'border-red-400 bg-red-50' : 'border-surface-card-alt hover:border-red-300'}`}
                title={wishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}>
                {wishlistLoading
                  ? <Loader className="w-5 h-5 animate-spin text-text-muted" />
                  : <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-text-muted'}`} />
                }
              </button>

              <button onClick={handleShare} className="p-3 border-2 border-surface-card-alt rounded-xl hover:border-brand-accent transition-all">
                <Share2 className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-brand-accent/10 text-brand-primary rounded-full font-medium">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews Section ── */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text-main">Đánh giá từ khách hàng</h2>
              {reviews.length > 0 && (
                <p className="text-text-muted text-sm mt-1">
                  {avgRating.toFixed(1)} ⭐ · {reviews.length} đánh giá
                </p>
              )}
            </div>

            {/* Nút viết review */}
            {user ? (
              <button onClick={() => setShowReviewForm(f => !f)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${showReviewForm ? 'bg-surface-card-alt text-text-main' : 'bg-brand-primary text-white hover:bg-brand-primary/90'}`}>
                {showReviewForm ? 'Đóng' : '✏️ Viết đánh giá'}
              </button>
            ) : (
              <Link href={`/login?redirect=products/${slug}`}
                className="px-4 py-2 rounded-xl font-semibold text-sm border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all">
                Đăng nhập để đánh giá
              </Link>
            )}
          </div>

          {/* Review success */}
          {reviewSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" /> Cảm ơn! Đánh giá của bạn đã được gửi thành công.
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-surface-bg rounded-2xl border-2 border-brand-accent/20">
              <h3 className="font-bold text-text-main mb-4">Đánh giá của bạn</h3>

              {/* Star rating */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-text-main mb-2 block">Số sao *</label>
                <StarRatingInput value={reviewRating} onChange={setReviewRating} />
                <p className="text-xs text-text-muted mt-1">
                  {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'][reviewRating]}
                </p>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-text-main mb-2 block">Tiêu đề *</label>
                <input type="text" value={reviewTitle} onChange={e => setReviewTitle(e.target.value)}
                  placeholder="VD: Matcha ngon tuyệt vời!"
                  className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-xl focus:border-brand-accent focus:outline-none"
                  maxLength={100} />
              </div>

              {/* Content */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-text-main mb-2 block">Nội dung *</label>
                <textarea value={reviewContent} onChange={e => setReviewContent(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-xl focus:border-brand-accent focus:outline-none resize-none"
                  rows={4} maxLength={500} />
                <p className="text-xs text-text-muted text-right mt-1">{reviewContent.length}/500</p>
              </div>

              {reviewError && (
                <p className="text-sm text-red-500 mb-3">{reviewError}</p>
              )}

              <div className="flex gap-3">
                <button type="submit" disabled={submittingReview}
                  className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                  {submittingReview ? <><Loader className="w-4 h-4 animate-spin" /> Đang gửi...</> : <><Send className="w-4 h-4" /> Gửi đánh giá</>}
                </button>
                <button type="button" onClick={() => setShowReviewForm(false)}
                  className="px-5 py-3 border-2 border-surface-card-alt rounded-xl font-semibold text-text-muted hover:border-brand-accent transition-colors">
                  Hủy
                </button>
              </div>
            </form>
          )}

          {/* Review List */}
          {reviews.length > 0 ? (
            <div className="space-y-5">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-surface-card-alt pb-5 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{review.user.name[0]?.toUpperCase()}</span>
                        </div>
                        <p className="font-semibold text-text-main text-sm">{review.user.name}</p>
                        {review.verified && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Đã mua
                          </span>
                        )}
                      </div>
                      <div className="flex gap-0.5 mt-1 ml-10">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-text-muted">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="font-semibold text-text-main text-sm mb-1 ml-10">{review.title}</p>
                  <p className="text-sm text-text-muted ml-10 leading-relaxed">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-text-muted">
              <Star className="w-12 h-12 mx-auto mb-3 text-gray-200" />
              <p className="font-medium">Chưa có đánh giá nào</p>
              <p className="text-sm mt-1">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
