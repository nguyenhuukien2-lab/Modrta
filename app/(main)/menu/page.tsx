// 🍵 TRANG THỰC ĐƠN - Menu Page
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { useCartStore } from '@/lib/store/cartStore'

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem, totalItems } = useCartStore()

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.data || []))
      .catch(() => setCategories([]))
  }, [])

  // Fetch products
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedCategory !== 'all') params.append('category', selectedCategory)
    if (searchQuery) params.append('q', searchQuery)

    fetch(`/api/products?${params.toString()}`)
      .then(r => r.json())
      .then(d => {
        setProducts(d.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Fetch products error:', err)
        setProducts([])
        setLoading(false)
      })
  }, [selectedCategory, searchQuery])

  const handleAddToCart = (product: any) => {
    addItem(product, undefined)
  }

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-brand-primary to-brand-accent text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="text-sm font-medium mb-3 opacity-90 uppercase tracking-wide">
              Thực Đơn Modtra
            </p>
            <h1 className="text-h1 font-bold mb-4">
              Thực đơn Modtra — <span className="font-serif italic">Vị thanh mát tự nhiên</span>
            </h1>
            <p className="text-lg opacity-90">
              Từ nghi thức Matcha Uji truyền thống đến những ly cà phê Cold Brew sáng tạo.
              Tất cả đều được chế biến thủ công với nguyên liệu hữu cơ.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container-custom">

          {/* Search & Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-zen mb-6 sticky top-24 z-10">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm món... (VD: Matcha Latte, Cold Brew)"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-surface-card-alt focus:border-brand-accent focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <SlidersHorizontal className="w-5 h-5 text-text-muted flex-shrink-0" />
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-brand-primary text-white shadow-zen'
                    : 'bg-surface-card-alt text-text-main hover:bg-brand-accent/10 hover:text-brand-primary'
                }`}
              >
                Tất cả
              </button>
              {categories.filter(c => c.slug !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat.slug
                      ? 'bg-brand-primary text-white shadow-zen'
                      : 'bg-surface-card-alt text-text-main hover:bg-brand-accent/10 hover:text-brand-primary'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div className="mb-4">
            <p className="text-text-muted text-sm">
              Tìm thấy <span className="font-semibold text-brand-primary">{products.length}</span> món
              {searchQuery && ` cho "${searchQuery}"`}
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="aspect-square bg-surface-card-alt rounded animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg">Không tìm thấy món nào phù hợp</p>
            </div>
          )}

        </div>
      </section>

      {/* Mobile Cart Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-card-alt p-4 shadow-card-hover z-40">
        <Link href="/checkout">
          <button className="w-full btn-primary py-4">
            Xem giỏ hàng ({totalItems()} món)
          </button>
        </Link>
      </div>
    </div>
  )
}
