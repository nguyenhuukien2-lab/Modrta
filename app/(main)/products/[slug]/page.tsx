'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Heart, Share2, Star, Check, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react'
import { getProduct } from '@/lib/api'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils'
import ProductCard from '@/components/ProductCard'

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
  customIce?: boolean
  customSugar?: boolean
  customMilk?: string[]
  customSize?: string[]
  avgRating?: number
  reviewCount: number
  reviews: Review[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { addItem } = useCartStore()

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [customizations, setCustomizations] = useState({
    ice: '100%',
    sugar: '100%',
    milk: '',
    size: 'M',
  })

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        const data = await getProduct(slug)
        setProduct(data)
      } catch (err) {
        console.error('Failed to load product:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (product) {
      addItem(product as any, customizations)
      alert('Đã thêm vào giỏ hàng!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <p className="text-text-muted">Đang tải...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface-bg flex flex-col items-center justify-center">
        <p className="text-text-muted mb-4">Không tìm thấy sản phẩm</p>
        <Link href="/menu" className="text-brand-primary hover:underline">
          Quay lại thực đơn
        </Link>
      </div>
    )
  }

  const ratingStars = product.avgRating 
    ? Array.from({ length: 5 }, (_, i) => i < Math.floor(product.avgRating!) ? 'full' : 'empty')
    : []

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
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-card-alt">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.isNew && (
              <div className="absolute top-4 right-4 bg-brand-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                Mới
              </div>
            )}
            {product.isBestseller && (
              <div className="absolute top-4 left-4 bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                Bestseller
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold text-text-main mb-2">{product.name}</h1>
            
            {/* Rating */}
            {product.avgRating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {ratingStars.map((star, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${star === 'full' ? 'fill-yellow-400 text-yellow-400' : 'text-surface-card-alt'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-text-muted">
                  {product.avgRating} ({product.reviewCount} đánh giá)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="text-3xl font-bold text-brand-primary mb-4">
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            <p className="text-text-muted mb-6 leading-relaxed">{product.description}</p>

            {/* Ingredients */}
            {product.ingredients.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-text-main mb-2">Thành phần:</p>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 bg-surface-card-alt rounded-full text-text-muted">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Customizations */}
            <div className="space-y-4 mb-6 p-4 bg-surface-bg rounded-xl">
              {product.customIce && (
                <div>
                  <label className="text-sm font-semibold text-text-main mb-2 block">Lạnh</label>
                  <select
                    value={customizations.ice}
                    onChange={(e) => setCustomizations({...customizations, ice: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-surface-card-alt rounded-lg"
                  >
                    <option value="0%">Không đá</option>
                    <option value="50%">50% đá</option>
                    <option value="100%">100% đá</option>
                  </select>
                </div>
              )}

              {product.customSugar && (
                <div>
                  <label className="text-sm font-semibold text-text-main mb-2 block">Ngọt</label>
                  <select
                    value={customizations.sugar}
                    onChange={(e) => setCustomizations({...customizations, sugar: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-surface-card-alt rounded-lg"
                  >
                    <option value="0%">Không ngọt</option>
                    <option value="50%">50% ngọt</option>
                    <option value="100%">100% ngọt</option>
                  </select>
                </div>
              )}

              {product.customMilk && product.customMilk.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-text-main mb-2 block">Loại sữa</label>
                  <select
                    value={customizations.milk}
                    onChange={(e) => setCustomizations({...customizations, milk: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-surface-card-alt rounded-lg"
                  >
                    <option value="">Chọn loại sữa</option>
                    {product.customMilk.map((milk) => (
                      <option key={milk} value={milk}>{milk}</option>
                    ))}
                  </select>
                </div>
              )}

              {product.customSize && product.customSize.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-text-main mb-2 block">Size</label>
                  <div className="flex gap-2">
                    {product.customSize.map((size) => (
                      <button
                        key={size}
                        onClick={() => setCustomizations({...customizations, size})}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                          customizations.size === size
                            ? 'bg-brand-primary text-white'
                            : 'bg-surface-card-alt text-text-main hover:border-brand-accent'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 border-2 border-surface-card-alt rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-surface-card-alt"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-semibold min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-surface-card-alt"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-brand-primary text-white font-semibold rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Thêm vào giỏ ({quantity})
              </button>

              <button className="p-3 border-2 border-surface-card-alt rounded-lg hover:border-brand-accent">
                <Heart className="w-5 h-5" />
              </button>

              <button className="p-3 border-2 border-surface-card-alt rounded-lg hover:border-brand-accent">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-brand-accent/10 text-brand-primary rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <div className="bg-white rounded-2xl shadow-card p-8 mb-12">
            <h2 className="text-2xl font-bold text-text-main mb-6">Đánh giá từ khách hàng</h2>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b border-surface-card-alt pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-text-main">{review.user.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-surface-card-alt'}`}
                            />
                          ))}
                        </div>
                        {review.verified && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Đã mua
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-text-muted">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="font-medium text-text-main mb-1">{review.title}</p>
                  <p className="text-sm text-text-muted">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
