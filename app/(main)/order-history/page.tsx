'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, ArrowRight, Calendar, MapPin, Truck, Clock } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { useOrders } from '@/lib/hooks/useOrders'
import { formatPrice } from '@/lib/utils'
import ProtectedRoute from '@/components/ProtectedRoute'

const statusConfig = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: '✓' },
  preparing: { label: 'Đang chuẩn bị', color: 'bg-purple-100 text-purple-800', icon: '🔄' },
  delivering: { label: 'Đang giao', color: 'bg-sky-100 text-sky-800', icon: '🚚' },
  completed: { label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: '✓' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: '✗' },
}

function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}

export default function OrderHistoryPage() {
  const { token } = useAuth()
  const { orders, loading, error, pagination } = useOrders(token)
  const [offset, setOffset] = useState(0)

  if (!token) {
    return (
      <ProtectedRoute>
        <div />
      </ProtectedRoute>
    )
  }

  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-main mb-2">Lịch sử đơn hàng</h1>
          <p className="text-text-muted">Theo dõi tất cả đơn hàng của bạn</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {loading && !orders.length ? (
          <div className="text-center py-12">
            <p className="text-text-muted">Đang tải đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-surface-card rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-text-muted" />
            </div>
            <h2 className="text-2xl font-bold text-text-main mb-2">Chưa có đơn hàng</h2>
            <p className="text-text-muted mb-8">Bạn chưa đặt hàng lần nào. Hãy bắt đầu mua sắm ngay!</p>
            <Link href="/menu" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-opacity-90">
              Tiếp tục mua sắm
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order.id} href={`/order-history/${order.id}`}>
                <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="grid md:grid-cols-4 gap-6 items-start">
                    {/* Order Number & Status */}
                    <div>
                      <p className="text-sm text-text-muted mb-1">Mã đơn hàng</p>
                      <p className="font-bold text-text-main mb-3">{order.orderNumber}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>

                    {/* Customer Info */}
                    <div>
                      <p className="text-sm text-text-muted mb-1">Tên khách hàng</p>
                      <p className="font-semibold text-text-main mb-3">{order.customerName}</p>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-sm text-text-muted mb-2">Sản phẩm</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="w-10 h-10 rounded-lg overflow-hidden bg-surface-card">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-10 h-10 rounded-lg bg-surface-card flex items-center justify-center text-xs font-bold text-text-muted">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total & Action */}
                    <div className="text-right">
                      <p className="text-sm text-text-muted mb-1">Tổng cộng</p>
                      <p className="text-2xl font-bold text-brand-primary mb-3">{formatPrice(order.total)}</p>
                      <div className="flex items-center justify-end gap-1 text-brand-accent group-hover:gap-2 transition-all">
                        <span className="text-sm font-semibold">Xem chi tiết</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > orders.length && (
          <div className="mt-12 text-center">
            <button className="px-6 py-3 border-2 border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-all">
              Xem thêm
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
