'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, ArrowLeft, Loader, Check } from 'lucide-react'
import Button from '@/components/Button'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/lib/context/AuthContext'
import { createOrder, validateCoupon } from '@/lib/api'
import { formatPrice } from '@/lib/utils'

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cart, updateQuantity, removeItem, clearCart } = useCartStore()
  const { user, token, loading } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user && cart.length > 0) {
      router.push('/login?redirect=checkout')
    }
  }, [user, loading, router, cart.length])

  // Form state
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery')
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'momo' | 'zalopay' | 'card' | 'cod'>('cod')
  const [customerName, setCustomerName] = useState(user?.name || '')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState(user?.email || '')
  const [address, setAddress] = useState('')
  const [district, setDistrict] = useState('')
  const [city, setCity] = useState('TP. Hồ Chí Minh')
  const [note, setNote] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [ecoPackaging, setEcoPackaging] = useState(false)

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponError, setCouponError] = useState('')
  const [validatingCoupon, setValidatingCoupon] = useState(false)

  // Order state
  const [placing, setPlacing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)
  const [orderError, setOrderError] = useState('')

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const shipping = deliveryMethod === 'delivery' ? 25000 : 0
  const ecoPackagingFee = ecoPackaging ? 5000 : 0
  const discount = appliedCoupon?.discount || 0
  const total = subtotal - discount + shipping + ecoPackagingFee

  // Handle coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Vui lòng nhập mã coupon')
      return
    }

    try {
      setValidatingCoupon(true)
      setCouponError('')
      const result = await validateCoupon(couponCode, subtotal)
      setAppliedCoupon(result.data)
      setCouponCode('')
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : 'Mã coupon không hợp lệ')
      setAppliedCoupon(null)
    } finally {
      setValidatingCoupon(false)
    }
  }

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!token) {
      router.push('/login')
      return
    }

    if (!customerName || !customerPhone) {
      setOrderError('Vui lòng nhập tên và số điện thoại')
      return
    }

    if (deliveryMethod === 'delivery' && (!address || !district)) {
      setOrderError('Vui lòng nhập địa chỉ giao hàng')
      return
    }

    try {
      setPlacing(true)
      setOrderError('')

      const orderPayload = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          ice: item.customizations?.ice,
          sugar: item.customizations?.sugar,
          milk: item.customizations?.milk,
          size: item.customizations?.size,
        })),
        deliveryMethod,
        paymentMethod,
        customerName,
        customerPhone,
        customerEmail,
        address: deliveryMethod === 'delivery' ? address : undefined,
        district: deliveryMethod === 'delivery' ? district : undefined,
        city,
        note,
        couponCode: appliedCoupon?.code,
        ecoPackaging,
      }

      const response = await createOrder(orderPayload, token)

      if (response.error) {
        setOrderError(response.error)
      } else {
        setOrderData(response.data)
        setOrderSuccess(true)
        clearCart()
        // Chỉ auto-redirect nếu COD
        if (paymentMethod === 'cod') {
          setTimeout(() => router.push(`/order-history/${response.data.id}`), 3000)
        }
      }
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Đặt hàng thất bại')
    } finally {
      setPlacing(false)
    }
  }

  if (orderSuccess && orderData) {
    const isQR = paymentMethod === 'vietqr'
    const isMomo = paymentMethod === 'momo'
    const needsPayment = isQR || isMomo || paymentMethod === 'zalopay'

    // Generate VietQR URL dùng vietqr.io public API
    const vietqrUrl = isQR
      ? `https://img.vietqr.io/image/970422-1234567890-compact2.png?amount=${total}&addInfo=${encodeURIComponent('Thanh toan don hang ' + (orderData.orderNumber || orderData.id?.slice(-8)))}&accountName=MODTRA`
      : null

    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-card-hover p-8 max-w-md w-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-text-main mb-1">Đặt hàng thành công!</h1>
          <p className="text-text-muted text-sm mb-1">
            Mã đơn: <span className="font-semibold text-brand-primary">{orderData.orderNumber}</span>
          </p>
          <p className="text-text-muted text-sm mb-6">
            Tổng tiền: <span className="font-bold text-brand-primary">{formatPrice(total)}</span>
          </p>

          {/* QR VietQR */}
          {isQR && vietqrUrl && (
            <div className="mb-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-3">
                <p className="text-sm font-semibold text-blue-800 mb-3">
                  🏦 Quét mã VietQR để thanh toán
                </p>
                <div className="bg-white rounded-xl p-3 inline-block shadow">
                  <img
                    src={vietqrUrl}
                    alt="VietQR Payment QR Code"
                    className="w-48 h-48 mx-auto"
                    onError={(e) => {
                      // Fallback nếu QR lỗi
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.removeAttribute('hidden')
                    }}
                  />
                  <div hidden className="w-48 h-48 flex items-center justify-center bg-surface-bg rounded text-text-muted text-sm">
                    QR không khả dụng
                  </div>
                </div>
                <div className="mt-3 text-xs text-blue-700 space-y-1">
                  <p>Ngân hàng: <strong>MB Bank</strong></p>
                  <p>STK: <strong>1234567890</strong></p>
                  <p>Nội dung: <strong>Thanh toan {orderData.orderNumber}</strong></p>
                  <p>Số tiền: <strong>{formatPrice(total)}</strong></p>
                </div>
              </div>
              <p className="text-xs text-text-muted">
                Sau khi chuyển khoản, đơn hàng sẽ được xác nhận trong vòng 5 phút
              </p>
            </div>
          )}

          {/* MoMo */}
          {isMomo && (
            <div className="mb-6 bg-pink-50 border-2 border-pink-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-pink-800 mb-2">📱 Thanh toán qua MoMo</p>
              <div className="text-3xl mb-2">💜</div>
              <p className="text-xs text-pink-700 mb-3">
                Số điện thoại MoMo: <strong>0901234567</strong>
              </p>
              <p className="text-xs text-pink-700">
                Nội dung: <strong>{orderData.orderNumber}</strong>
              </p>
              <p className="text-xs text-pink-700">
                Số tiền: <strong>{formatPrice(total)}</strong>
              </p>
            </div>
          )}

          {/* ZaloPay */}
          {paymentMethod === 'zalopay' && (
            <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">🟡 Thanh toán qua ZaloPay</p>
              <p className="text-xs text-blue-700">
                Nội dung: <strong>{orderData.orderNumber}</strong> — {formatPrice(total)}
              </p>
            </div>
          )}

          {/* COD */}
          {paymentMethod === 'cod' && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-green-800">
                💵 Thanh toán khi nhận hàng
              </p>
              <p className="text-xs text-green-700 mt-1">
                Chuẩn bị <strong>{formatPrice(total)}</strong> khi nhận hàng
              </p>
              <p className="text-xs text-text-muted mt-2">Đang chuyển hướng đến đơn hàng...</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link href={`/order-history/${orderData.id}`}>
              <button className="w-full btn-primary py-3">
                Xem chi tiết đơn hàng
              </button>
            </Link>
            <Link href="/menu">
              <button className="w-full py-3 border-2 border-surface-card-alt rounded-xl text-text-main font-semibold hover:border-brand-accent transition-colors">
                Tiếp tục mua sắm
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-text-muted">Đang kiểm tra...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-surface-bg">
        <div className="container-custom py-12">
          <Link href="/menu" className="inline-flex items-center gap-2 text-brand-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Quay lại thực đơn
          </Link>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-text-main mb-4">Cần đăng nhập để đặt hàng</h1>
            <p className="text-text-muted mb-8">Vui lòng đăng nhập hoặc đăng ký để tiếp tục</p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button variant="secondary" size="lg">Đăng nhập</Button>
              </Link>
              <Link href="/register">
                <Button size="lg">Đăng ký</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-surface-bg">
        <div className="container-custom py-12">
          <Link href="/menu" className="inline-flex items-center gap-2 text-brand-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Quay lại thực đơn
          </Link>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-text-main mb-2">Giỏ hàng trống</h1>
            <p className="text-text-muted mb-8">Thêm sản phẩm vào giỏ hàng để tiếp tục</p>
            <Link href="/menu">
              <Button size="lg">Tiếp tục mua sắm</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="container-custom py-8">
        <Link href="/menu" className="inline-flex items-center gap-2 text-brand-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-3xl font-bold text-text-main">Thanh toán</h1>

            {orderError && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {orderError}
              </div>
            )}

            {/* Customer Info */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <h2 className="text-xl font-bold text-text-main mb-6">Thông tin khách hàng</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Họ tên *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg"
                    placeholder="Tên đầy đủ"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Số điện thoại *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg"
                      placeholder="0903456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <h2 className="text-xl font-bold text-text-main mb-6">Phương thức giao hàng</h2>
              <div className="space-y-3">
                {(
                  [
                    { value: 'delivery' as const, label: 'Giao hàng tại nhà (25.000đ)', desc: 'Giao trong 45 phút' },
                    { value: 'pickup' as const, label: 'Lấy hàng tại cửa hàng', desc: 'Miễn phí, sẵn sàng trong 30 phút' },
                  ] as const
                ).map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-4 border-2 border-surface-card-alt rounded-lg cursor-pointer hover:border-brand-accent transition-all"
                    style={{ borderColor: deliveryMethod === option.value ? 'var(--brand-primary)' : undefined }}>
                    <input
                      type="radio"
                      value={option.value}
                      checked={deliveryMethod === option.value}
                      onChange={e => setDeliveryMethod(e.target.value as any)}
                    />
                    <div>
                      <p className="font-semibold text-text-main">{option.label}</p>
                      <p className="text-xs text-text-muted">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Delivery Address */}
              {deliveryMethod === 'delivery' && (
                <div className="mt-6 space-y-4 pt-6 border-t-2 border-surface-card-alt">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Địa chỉ *</label>
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg"
                      placeholder="Số nhà, tên đường"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Quận/Huyện *</label>
                      <input
                        type="text"
                        value={district}
                        onChange={e => setDistrict(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg"
                        placeholder="Quận 1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Thành phố</label>
                      <select value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg">
                        <option>TP. Hồ Chí Minh</option>
                        <option>Hà Nội</option>
                        <option>Đà Nẵng</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <h2 className="text-xl font-bold text-text-main mb-6">Phương thức thanh toán</h2>
              <div className="space-y-3">
                {(
                  [
                    { value: 'cod' as const, label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
                    { value: 'vietqr' as const, label: 'VietQR', icon: '🏦' },
                    { value: 'momo' as const, label: 'MoMo', icon: '📱' },
                    { value: 'zalopay' as const, label: 'ZaloPay', icon: '🟡' },
                  ] as const
                ).map(option => (
                  <label key={option.value} className="flex items-center gap-3 p-4 border-2 border-surface-card-alt rounded-lg cursor-pointer hover:border-brand-accent transition-all"
                    style={{ borderColor: paymentMethod === option.value ? 'var(--brand-primary)' : undefined }}>
                    <input
                      type="radio"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={e => setPaymentMethod(e.target.value as any)}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{option.icon}</span>
                      <span className="font-semibold text-text-main">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ecoPackaging}
                    onChange={e => setEcoPackaging(e.target.checked)}
                  />
                  <span className="font-semibold text-text-main">Gói hàng thân thiện môi trường (+5.000đ)</span>
                </label>
                <div>
                  <label className="block text-sm font-semibold mb-2">Ghi chú thêm</label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg"
                    rows={3}
                    placeholder="Có gì muốn nói thêm không?"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-card sticky top-4">
              <h2 className="text-xl font-bold text-text-main mb-6">Đơn hàng của bạn</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.product.id} className="flex gap-3 pb-4 border-b border-surface-card-alt last:border-0">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-text-main">{item.product.name}</p>
                      <p className="text-xs text-text-muted">
                        {item.customizations?.size && `${item.customizations.size} • `}
                        {item.customizations?.milk && `${item.customizations.milk}`}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-surface-bg rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-surface-bg rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text-main">{formatPrice(item.product.price * item.quantity)}</p>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-500 hover:text-red-700 mt-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-6 pb-6 border-b border-surface-card-alt">
                <label className="block text-sm font-semibold mb-2">Mã khuyến mãi</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Nhập mã coupon"
                    className="flex-1 px-3 py-2 border-2 border-surface-card-alt rounded-lg text-sm"
                    disabled={validatingCoupon || !!appliedCoupon}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon || !!appliedCoupon}
                    className="px-3 py-2 bg-brand-accent text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {validatingCoupon ? <Loader className="w-4 h-4 animate-spin" /> : 'Áp dụng'}
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
                {appliedCoupon && (
                  <div className="mt-2 text-xs text-green-600 font-semibold">
                    ✓ Đã áp dụng: Giảm {appliedCoupon.discountPercent}%
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Tạm tính:</span>
                  <span className="font-semibold text-text-main">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá:</span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}
                {ecoPackaging && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Gói thân thiện:</span>
                    <span className="font-semibold text-text-main">+{formatPrice(ecoPackagingFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Giao hàng:</span>
                  <span className="font-semibold text-text-main">{shipping > 0 ? formatPrice(shipping) : 'Miễn phí'}</span>
                </div>
                <div className="border-t border-surface-card-alt pt-2 flex justify-between">
                  <span className="font-bold text-text-main">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-brand-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={placing || cart.length === 0}
                size="lg"
                className="w-full"
              >
                {placing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  `Đặt hàng (${formatPrice(total)})`
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
