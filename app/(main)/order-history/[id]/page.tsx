'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ArrowLeft, Package, Truck, MapPin, Phone, Mail, Calendar, Clock, DollarSign, Tag } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { getOrder } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import ProtectedRoute from '@/components/ProtectedRoute'

const statusConfig = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: '⏳', step: 1 },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: '✓', step: 2 },
  preparing: { label: 'Đang chuẩn bị', color: 'bg-purple-100 text-purple-800', icon: '🔄', step: 3 },
  delivering: { label: 'Đang giao', color: 'bg-sky-100 text-sky-800', icon: '🚚', step: 4 },
  completed: { label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: '✓', step: 5 },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: '✗', step: 0 },
}

const paymentStatusConfig = {
  pending: { label: 'Chờ thanh toán', color: 'text-yellow-600' },
  paid: { label: 'Đã thanh toán', color: 'text-green-600' },
  failed: { label: 'Thất bại', color: 'text-red-600' },
  refunded: { label: 'Hoàn tiền', color: 'text-blue-600' },
}

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string
  const { token } = useAuth()

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchOrder() {
      if (!token) return

      try {
        setLoading(true)
        const response = await getOrder(orderId, token)
        if (response.error) {
          setError(response.error)
        } else {
          setOrder(response.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải chi tiết đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, token])

  if (!token) {
    return (
      <ProtectedRoute>
        <div />
      </ProtectedRoute>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <p className="text-text-muted">Đang tải thông tin đơn hàng...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-surface-bg">
        <div className="container-custom py-12">
          <Link href="/order-history" className="inline-flex items-center gap-2 text-brand-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Quay lại lịch sử
          </Link>
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error || 'Không tìm thấy đơn hàng'}
          </div>
        </div>
      </div>
    )
  }

  const statusConfig_ = statusConfig[order.status as keyof typeof statusConfig]

  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="container-custom py-12">
        <Link href="/order-history" className="inline-flex items-center gap-2 text-brand-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Quay lại lịch sử đơn hàng
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-card mb-8">
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-sm text-text-muted mb-1">Mã đơn hàng</p>
              <h1 className="text-3xl font-bold text-text-main">{order.orderNumber}</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-muted mb-1">Trạng thái</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg" style={{ backgroundColor: statusConfig_.color.split(' ')[0], color: statusConfig_.color.split(' ')[1] }}>
                <span>{statusConfig_.icon}</span>
                {statusConfig_.label}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between">
            {[
              { status: 'pending', label: 'Chờ xác nhận', icon: '⏳' },
              { status: 'confirmed', label: 'Đã xác nhận', icon: '✓' },
              { status: 'preparing', label: 'Chuẩn bị', icon: '📦' },
              { status: 'delivering', label: 'Giao hàng', icon: '🚚' },
              { status: 'completed', label: 'Đã nhận', icon: '✓' },
              { status: 'cancelled', label: 'Đã hủy', icon: '✗' },
            ].map((item, i, arr) => {
              const statuses = ['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled']
              const currentIndex = statuses.indexOf(order.status)
              const itemIndex = statuses.indexOf(item.status)
              const isActive = itemIndex <= currentIndex
              const isCurrent = itemIndex === currentIndex

              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-2 transition-all ${
                      isActive
                        ? isCurrent ? 'bg-brand-accent text-white ring-4 ring-brand-accent/20' : 'bg-brand-primary text-white'
                        : 'bg-surface-card text-text-muted'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <p className={`text-xs text-center font-medium ${isActive ? 'text-text-main' : 'text-text-muted'}`}>
                    {item.label}
                  </p>
                  {i < arr.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-0.5 mt-4 ${
                        itemIndex < currentIndex ? 'bg-brand-primary' : 'bg-surface-card'
                      }`}
                      style={{ width: '100%', minWidth: '20px' }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Items */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <h2 className="text-2xl font-bold text-text-main mb-6">Sản phẩm đã đặt</h2>
              <div className="space-y-4">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 pb-4 border-b border-surface-card-alt last:border-0">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-surface-card flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/products/${item.product.slug}`} className="hover:text-brand-primary">
                        <h3 className="font-semibold text-lg text-text-main mb-1">{item.product.name}</h3>
                      </Link>
                      <p className="text-sm text-text-muted mb-2">
                        Số lượng: <span className="font-semibold text-text-main">{item.quantity}</span>
                      </p>
                      {(item.ice || item.sugar || item.milk || item.size) && (
                        <div className="text-xs text-text-muted space-y-1">
                          {item.ice && <div>Đá: {item.ice}</div>}
                          {item.sugar && <div>Đường: {item.sugar}</div>}
                          {item.milk && <div>Sữa: {item.milk}</div>}
                          {item.size && <div>Size: {item.size}</div>}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-text-muted mb-1">Giá</p>
                      <p className="font-bold text-lg text-text-main">{formatPrice(item.unitPrice)}</p>
                      <p className="text-sm text-brand-primary font-semibold">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            {order.deliveryMethod === 'delivery' && (
              <div className="bg-white rounded-2xl p-8 shadow-card">
                <h2 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-brand-primary" />
                  Địa chỉ giao hàng
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-text-muted">Tên người nhận</p>
                    <p className="font-semibold text-lg text-text-main">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Địa chỉ</p>
                    <p className="text-text-main">
                      {order.address}, {order.district}, {order.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Số điện thoại</p>
                    <p className="font-semibold text-text-main">{order.customerPhone}</p>
                  </div>
                  {order.note && (
                    <div>
                      <p className="text-sm text-text-muted">Ghi chú</p>
                      <p className="text-text-main italic">{order.note}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Payment Info */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <h2 className="text-xl font-bold text-text-main mb-6">Thông tin thanh toán</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Phương thức</span>
                  <span className="font-semibold text-text-main">
                    {order.paymentMethod === 'cod'
                      ? 'Thanh toán khi nhận'
                      : order.paymentMethod.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Trạng thái</span>
                  <span className={`font-semibold ${paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig]?.color || 'text-text-muted'}`}>
                    {paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig]?.label || order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <h2 className="text-xl font-bold text-text-main mb-6">Chi tiết thanh toán</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-text-muted">Tạm tính</span>
                  <span className="font-semibold text-text-main">{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span className="font-semibold">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                {order.shipping > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Giao hàng</span>
                    <span className="font-semibold text-text-main">+{formatPrice(order.shipping)}</span>
                  </div>
                )}
                {order.ecoPackaging && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Gói thân thiện</span>
                    <span className="font-semibold text-text-main">+5.000đ</span>
                  </div>
                )}
                <div className="border-t border-surface-card-alt pt-3 flex justify-between">
                  <span className="font-bold text-text-main">Tổng cộng</span>
                  <span className="text-2xl font-bold text-brand-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <h2 className="text-xl font-bold text-text-main mb-6">Thông tin đơn hàng</h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-primary" />
                  <span className="text-text-muted">Ngày đặt:</span>
                  <span className="font-semibold text-text-main">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-primary" />
                  <span className="text-text-muted">Lúc:</span>
                  <span className="font-semibold text-text-main">
                    {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-brand-primary" />
                  <span className="text-text-muted">Giao hàng:</span>
                  <span className="font-semibold text-text-main">
                    {order.deliveryMethod === 'delivery' ? '🏠 Tại nhà' : '🏪 Tại cửa hàng'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-brand-accent/10 border-2 border-brand-accent rounded-2xl p-8 mt-12">
          <h3 className="font-bold text-text-main mb-4">Cần hỗ trợ?</h3>
          <p className="text-text-muted mb-4">
            Nếu bạn có bất kỳ câu hỏi về đơn hàng của mình, vui lòng liên hệ với chúng tôi:
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:0903456789" className="flex items-center gap-2 text-brand-primary hover:underline font-semibold">
              <Phone className="w-5 h-5" />
              0903 456 789
            </a>
            <a href="mailto:support@modtra.com" className="flex items-center gap-2 text-brand-primary hover:underline font-semibold">
              <Mail className="w-5 h-5" />
              support@modtra.com
            </a>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-opacity-90"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  )
}
