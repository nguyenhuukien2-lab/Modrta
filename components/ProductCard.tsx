import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Sparkles } from 'lucide-react'
import Button from './Button'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  compact?: boolean
}

export default function ProductCard({ product, onAddToCart, compact = false }: ProductCardProps) {
  return (
    <div className="card group p-1">
      {/* Image Container - Cực nhỏ */}
      <div className="relative aspect-square overflow-hidden rounded-sm mb-0.5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges - Siêu nhỏ */}
        <div className="absolute top-0.5 left-0.5 flex flex-col gap-0.5">
          {product.isNew && (
            <span className="badge-new text-xs px-1 py-0 text-xs leading-none">
              Mới
            </span>
          )}
          {product.isBestseller && (
            <span className="badge-primary text-xs px-1 py-0 text-xs leading-none">
              ⭐
            </span>
          )}
        </div>

        {/* Out of Stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-xs">Hết</span>
          </div>
        )}
      </div>

      {/* Content - Cực gọn */}
      <div className="space-y-0">
        {/* Name - Siêu gọn */}
        <Link href={`/menu?product=${product.slug}`}>
          <h3 className="font-semibold text-xs text-text-main hover:text-brand-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Price & Action */}
        <div className="flex items-center justify-between gap-0.5">
          <p className="text-xs font-bold text-brand-primary line-clamp-1">
            {formatPrice(product.price)}
          </p>

          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
              className="p-0.5 bg-brand-primary text-white rounded hover:bg-brand-primary/90 disabled:opacity-50 transition-colors flex-shrink-0"
              title="Thêm vào giỏ"
            >
              <ShoppingCart className="w-2 h-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
