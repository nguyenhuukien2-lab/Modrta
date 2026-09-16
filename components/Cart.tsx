'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { Minus, Plus, X, ShoppingBag, Tag, ArrowRight, Percent } from 'lucide-react'
import Button from './Button'

export default function Cart() {
  const { items, updateQuantity, removeItem, updateCustomization, subtotal } = useCartStore()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [couponError, setCouponError] = useState('')
  
  const subtotalAmount = subtotal()
  const discountAmount = calculateDiscount(subtotalAmount, appliedCoupon)
  const shippingFee = 0 // Free shipping
  const totalAmount = subtotalAmount - discountAmount + shippingFee

  const handleApplyCoupon = () => {
    const discount = calculateDiscount(subtotalAmount, couponCode)
    if (discount > 0) {
      setAppliedCoupon(couponCode)
      setCouponError('')
    } else {
      setCouponError('Mã giảm giá không hợp lệ')
      setAppliedCoupon('')
    }
  }

  if (items.length === 0) {
    return (
      <div className="sticky top-24 bg-surface-card rounded-2xl p-6 shadow-card">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-surface-card-alt rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-text-muted" />
          </div>
          <h3 className="font-semibold text-text-main mb-2">Giỏ hàng trống</h3>
          <p className="text-sm text-text-muted">
            Thêm món vào giỏ để bắt đầu đặt hàng
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-24">
      <div className="bg-surface-card rounded-2xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="bg-brand-primary text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <h3 className="font-semibold">Đơn nước của bạn</h3>
            </div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {items.length} món
            </span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="p-6 max-h-[400px] overflow-y-auto space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="bg-surface-bg rounded-xl p-4 relative">
              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.product.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors group"
                aria-label="Xóa món"
              >
                <X className="w-4 h-4 text-text-muted group-hover:text-red-500" />
              </button>

              <div className="flex gap-3">
                {/* Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-text-main mb-1 line-clamp-2">
                    {item.product.name}
                  </h4>
                  <p className="text-brand-primary font-bold text-base mb-2">
                    {formatPrice(item.product.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-surface-card-alt flex items-center justify-center hover:border-brand-accent transition-colors"
                      aria-label="Giảm số lượng"
                    >
                      <Minus className="w-4 h-4 text-brand-primary" />
                    </button>
                    <span className="w-8 text-center font-semibold text-text-main">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-surface-card-alt flex items-center justify-center hover:border-brand-accent transition-colors"
                      aria-label="Tăng số lượng"
                    >
                      <Plus className="w-4 h-4 text-brand-primary" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Customizations */}
              {item.customizations && (
                <div className="mt-3 pt-3 border-t border-surface-card-alt/50">
                  <div className="space-y-1 text-xs text-text-muted">
                    {item.customizations.ice && (
                      <div className="flex justify-between">
                        <span>Đá:</span>
                        <span className="font-medium text-text-main">{item.customizations.ice}</span>
                      </div>
                    )}
                    {item.customizations.sugar && (
                      <div className="flex justify-between">
                        <span>Đường:</span>
                        <span className="font-medium text-text-main">{item.customizations.sugar}</span>
                      </div>
                    )}
                    {item.customizations.milk && (
                      <div className="flex justify-between">
                        <span>Loại sữa:</span>
                        <span className="font-medium text-text-main">{item.customizations.milk}</span>
                      </div>
                    )}
                    {item.customizations.size && (
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-medium text-text-main">{item.customizations.size}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Coupon Section */}
        <div className="px-6 pb-4">
          <div className="bg-surface-bg rounded-xl p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-text-main mb-3">
              <Tag className="w-4 h-4 text-brand-accent" />
              Mã giảm giá
            </label>
            
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-brand-accent/10 border border-brand-accent rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-brand-accent" />
                  <span className="font-semibold text-brand-primary">{appliedCoupon}</span>
                </div>
                <button
                  onClick={() => {
                    setAppliedCoupon('')
                    setCouponCode('')
                  }}
                  className="text-xs text-text-muted hover:text-red-500"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase())
                      setCouponError('')
                    }}
                    placeholder="MODTRAFIRST"
                    className="flex-1 px-4 py-2 rounded-lg border border-surface-card-alt focus:border-brand-accent focus:outline-none text-sm"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-brand-accent text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-500 mt-2">{couponError}</p>
                )}
                <p className="text-xs text-text-muted mt-2">
                  Mã gợi ý: MODTRAFIRST (-15%), MATCHA10 (-10%)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="px-6 pb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Tạm tính</span>
            <span className="font-medium text-text-main">{formatPrice(subtotalAmount)}</span>
          </div>
          
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-brand-accent">Giảm giá</span>
              <span className="font-medium text-brand-accent">-{formatPrice(discountAmount)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Phí giao hàng</span>
            <span className="font-medium text-brand-accent">Miễn phí</span>
          </div>
          
          <div className="pt-3 border-t border-surface-card-alt">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-text-main">Tổng cộng</span>
              <span className="text-2xl font-bold text-brand-primary">
                {formatPrice(totalAmount)}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Đã bao gồm VAT (nếu có)
            </p>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="px-6 pb-6">
          <Link href="/checkout">
            <Button size="lg" fullWidth icon={<ArrowRight className="w-5 h-5" />}>
              Tiến hành đặt hàng
            </Button>
          </Link>
          <p className="text-xs text-center text-text-muted mt-3">
            🌿 Đổi mới hoặc hoàn 100% nếu không đạt chuẩn tươi mới
          </p>
        </div>
      </div>
    </div>
  )
}
