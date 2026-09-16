// 👤 TRANG TÀI KHOẢN - Account & Order Tracking Page
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Leaf, Star, MapPin, Phone, Gift, Shield, History,
  RotateCcw, ChevronRight, CheckCircle, Clock, Package,
  Truck, Home, Recycle, MessageSquare, Edit, LogOut,
  Navigation, Loader
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useAuth } from '@/lib/context/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// ---- Mock Data ----
const member = {
  name: 'Nguyễn An Yên',
  email: 'an.yen.nguyen@modtra.vn',
  phone: '0913 548 678',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
  tier: 'Búp Trà Vàng (Gold Member)',
  tierColor: 'text-yellow-600',
  tierBg: 'bg-yellow-50 border-yellow-200',
  verified: true,
  points: 1250,
  pointsValue: 125000,
  nextTier: 'Búp Trà Cổ Thụ (Diamond)',
  nextTierPoints: 1500,
  progress: 83,
}

const liveOrder = {
  id: '#MOD-8924',
  status: 'Đang trên đường giao tới bạn',
  statusBg: 'bg-brand-accent/10 text-brand-primary',
  eta: '14:45 – 14:55',
  etaNote: 'Khoảng 15 phút nữa',
  lastPoints: 60,
  steps: [
    { label: 'Đã nhận đơn', time: '14:15', done: true, active: false },
    { label: 'Pha chế & Đóng gói', time: '14:22', done: true, active: false },
    { label: 'Đang giao hàng', time: '14:35 · Green Express', done: false, active: true },
    { label: 'Đã giao tới bạn', time: 'Dự kiến 14:50', done: false, active: false },
  ],
  stepIcons: [CheckCircle, Package, Truck, Home],
  driver: { name: 'Trần Văn Minh', vehicle: 'VinFast Xanh', phone: '0938 123 456' },
  address: '45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. HCM',
  note: 'Bấm chuông số 4, giao lên tầng 3 nếu có thể.',
  items: [
    { name: 'Usucha Cold Whisk & Sữa Hạt Yến Mạch', price: 65000, qty: 1, detail: 'Tùy chọn: Ngọt 50% · Cà Lạnh L', image: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=200' },
    { name: 'Mơ Rừng Cold Brew Tần Ủ Chậm', price: 55000, qty: 1, detail: 'Tùy chọn: Không đường · 100% đá nhiều · 1 chai nhỏ', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=200' },
  ],
  subtotal: 120000,
  shipping: 0,
  total: 120000,
}

const orderHistory = [
  {
    id: '#MOD-8810',
    date: '02 ngày trước (28/04/2026)',
    status: 'Đã giao thành công',
    points: 435,
    total: 870000,
    items: '01 Hộp Bột Matcha Uji Ceremonial 30g + 01 Chasen tre 100 lợp',
    image: 'https://images.unsplash.com/photo-1629892609222-edb50d64d9fc?w=200',
    note: 'Tham trà: Rang thơm nhẹ, cần tỉ lệ nước cao hơn lần nhập tới.'
  },
  {
    id: '#MOD-8650',
    date: 'Tuần trước (19/04/2026)',
    status: 'Đã giao thành công',
    points: 58,
    total: 116000,
    items: '02 x Matcha Dừa Xiêm Bên Trà Mát Lạnh',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200',
    note: 'Size: Ngon ty! Đặt lại ngay, giảm đá 50%'
  },
]

const tabs = [
  { id: 'order', label: 'Đơn hàng của tôi', icon: Package },
  { id: 'points', label: 'Hạng hội viên & Điểm thưởng Zen', icon: Star },
  { id: 'address', label: 'Sổ địa chỉ nhận trà', count: 2, icon: MapPin },
  { id: 'favorites', label: 'Món yêu thích & Tùy chỉnh ưa quen', icon: Leaf },
  { id: 'settings', label: 'Cài đặt', icon: Shield },
]

export default function AccountPage() {
  const router = useRouter()
  const { user, logout, loading: authLoading, token } = useAuth()
  const [activeTab, setActiveTab] = useState('order')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  // Format member data from real user
  const member = user ? {
    name: user.name || 'User',
    email: user.email || '',
    phone: user.phone || 'Not provided',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
    tier: 'Thành viên',
    tierColor: 'text-brand-primary',
    tierBg: 'bg-brand-primary/10 border-brand-primary',
    verified: false,
    points: 0,
    pointsValue: 0,
    nextTier: 'Gold Member',
    nextTierPoints: 1000,
    progress: 0,
  } : null

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.push('/')
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Fetch real orders from API
  useEffect(() => {
    if (!token) return
    
    async function fetchOrders() {
      try {
        setOrdersLoading(true)
        const res = await fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        if (res.ok) {
          const { data } = await res.json()
          setOrders(data || [])
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchOrders()
  }, [token])

  // Show loading if auth is still loading or user is null
  if (authLoading || !user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <Loader className="w-8 h-8 text-brand-primary animate-spin" />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
        {/* Breadcrumb */}
        <div className="bg-white border-b border-surface-card-alt">
          <div className="container-custom py-3 flex items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="hover:text-brand-primary">Trang chủ</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/account" className="hover:text-brand-primary">Hội viên Modtra Club</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-main font-medium">Quản lý tài khoản</span>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* ===== HERO MEMBER CARD ===== */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left: Avatar + Info */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-surface-card-alt bg-surface-bg">
                  <Image src={member.avatar} alt={member.name} width={80} height={80} className="object-cover w-full h-full" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-accent rounded-full flex items-center justify-center border-2 border-white">
                  <Leaf className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-2xl font-bold text-text-main">{member.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${member.tierBg} ${member.tierColor}`}>
                    ⭐ {member.tier}
                  </span>
                </div>
                <p className="text-sm text-text-muted mb-2">{member.email}</p>
                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4 text-brand-accent" />
                    {member.phone}
                  </span>
                  {member.verified && (
                    <span className="flex items-center gap-1 text-brand-accent font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Đã xác thực
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Points Wallet */}
            <div className="bg-surface-bg rounded-2xl p-5 min-w-[320px]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-text-muted mb-1 uppercase tracking-wide">Ví Búp Trà Tích Lũy</p>
                  <p className="text-3xl font-bold text-brand-primary">
                    {member.points.toLocaleString()} <span className="text-lg font-semibold">Búp Trà</span>
                  </p>
                  <p className="text-sm text-text-muted">
                    ≈ {formatPrice(member.pointsValue)} quy đổi thưởng thức
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-brand-accent font-bold">+{liveOrder.lastPoints} Búp Trà</p>
                  <p className="text-xs text-text-muted">từ đơn gần nhất</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Tiến trình thăng hạng {member.nextTier}</span>
                  <span className="font-bold text-brand-primary">{member.progress}%</span>
                </div>
                <div className="h-2.5 bg-surface-card-alt rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-700"
                    style={{ width: `${member.progress}%` }}
                  />
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Còn {member.nextTierPoints - member.points} búp trà để chạm mốc {member.nextTier}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-brand-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-1.5">
                  <Gift className="w-4 h-4" />
                  Đổi quà & Ưu đãi
                </button>
                <button className="flex-1 border-2 border-brand-primary text-brand-primary py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-1.5">
                  <Star className="w-4 h-4" />
                  Quy chế tích điểm
                </button>
              </div>
            </div>

            {/* Edit / Logout */}
            <div className="flex flex-row lg:flex-col gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-surface-card-alt rounded-xl text-sm font-medium hover:border-brand-accent transition-colors">
                <Edit className="w-4 h-4 text-brand-accent" />
                Chỉnh sửa hồ sơ
              </button>
              <button 
                onClick={handleLogout} 
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-red-100 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <LogOut className="w-4 h-4" />
                {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
              </button>
            </div>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-zen mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-primary text-white shadow-zen'
                  : 'text-text-muted hover:text-brand-primary hover:bg-surface-bg'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-surface-card-alt text-text-muted'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Live Order Tracking */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-bold text-text-main">
                      {orders.length > 0 ? `Đơn hàng mới nhất ${orders[0].orderNumber}` : 'Chưa có đơn hàng'}
                    </h2>
                    {orders.length > 0 && (
                      <>
                        <span className="text-xs text-text-muted">Thanh toán: {orders[0].paymentMethod || 'COD'}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          orders[0].status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          orders[0].status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          orders[0].status === 'preparing' ? 'bg-purple-100 text-purple-800' :
                          orders[0].status === 'delivering' ? 'bg-sky-100 text-sky-800' :
                          orders[0].status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {orders[0].status}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-text-muted">
                    {orders.length > 0 ? `Ngày đặt: ${new Date(orders[0].createdAt).toLocaleDateString('vi-VN')}` : ''}
                  </p>
                </div>
              </div>

              {orders.length > 0 ? (
                <>
                  <div className="bg-surface-bg rounded-xl p-4 mb-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-text-muted mb-1 uppercase tracking-wide">Trạng thái</p>
                        <p className="text-2xl font-bold text-brand-primary capitalize">{orders[0].status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    <p className="text-sm font-semibold text-text-main">Sản phẩm ({orders[0].items?.length || 0})</p>
                    {orders[0].items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-surface-bg rounded-xl">
                        <div className="w-14 h-14 bg-surface-card rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-text-muted">
                          {item.product?.image ? (
                            <Image src={item.product.image} alt="" width={56} height={56} className="rounded-lg object-cover" />
                          ) : '📦'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-text-main line-clamp-1">{item.product?.name || 'Product'}</p>
                          <p className="text-xs text-text-muted">{item.itemNote || ''}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-sm text-brand-primary">{formatPrice(item.unitPrice)}</p>
                          <p className="text-xs text-text-muted">x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="border-t border-surface-card-alt pt-4 space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Tạm tính</span>
                      <span className="font-medium">{formatPrice(orders[0].subtotal)}</span>
                    </div>
                    {orders[0].discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Giảm giá</span>
                        <span className="font-semibold">-{formatPrice(orders[0].discount)}</span>
                      </div>
                    )}
                    {orders[0].shipping > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Giao hàng</span>
                        <span className="font-semibold">{formatPrice(orders[0].shipping)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-base">
                      <span>Tổng:</span>
                      <span className="text-brand-primary">{formatPrice(orders[0].total)}</span>
                    </div>
                  </div>

                  <Link href={`/order-history/${orders[0].id}`} className="inline-block w-full text-center">
                    <button className="w-full py-2 border-2 border-brand-primary text-brand-primary rounded-xl text-sm font-semibold hover:bg-brand-primary hover:text-white transition-all">
                      Xem chi tiết →
                    </button>
                  </Link>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-text-muted">Chưa có đơn hàng nào</p>
                </div>
              )}
            </div>

            {/* Order History */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <History className="w-5 h-5 text-brand-accent" />
                  Lịch sử đơn hàng
                </h2>
                {orders.length > 1 && (
                  <Link href="/order-history" className="text-sm text-brand-accent hover:underline font-medium">
                    Xem toàn bộ ({orders.length}) ›
                  </Link>
                )}
              </div>

              {ordersLoading ? (
                <div className="text-center py-8">
                  <Loader className="w-6 h-6 text-brand-primary animate-spin mx-auto mb-2" />
                  <p className="text-text-muted text-sm">Đang tải...</p>
                </div>
              ) : orders.length <= 1 ? (
                <div className="text-center py-8">
                  <p className="text-text-muted">Chỉ có 1 đơn hoặc chưa có đơn</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(1, 6).map((order) => (
                    <Link key={order.id} href={`/order-history/${order.id}`}>
                      <div className="border-2 border-surface-card-alt rounded-xl p-4 hover:border-brand-accent transition-colors cursor-pointer">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-card flex items-center justify-center text-xs text-text-muted">
                            {order.items?.[0]?.product?.image ? (
                              <Image src={order.items[0].product.image} alt="" width={64} height={64} className="object-cover" />
                            ) : '📦'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-brand-primary text-sm">{order.orderNumber}</span>
                              <span className="text-xs text-text-muted">· {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                              <span className={`ml-auto flex items-center gap-1 text-xs text-brand-accent font-semibold`}>
                                <CheckCircle className="w-3.5 h-3.5" />
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-text-main font-medium mb-0.5 line-clamp-1">
                              {order.items?.map((i: any) => i.product?.name).join(', ') || 'Không xác định'}
                            </p>
                            <p className="text-xs text-text-muted">{order.items?.length || 0} sản phẩm</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-lg text-text-main">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ===== RIGHT SIDEBAR ===== */}
          <div className="space-y-5">
            {/* Gold Member Privileges */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold text-text-main">Đặc quyền Búp Trà Vàng</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Truck, text: 'Miễn phí vận chuyển đơn hàng trên 99.000đ cho mọi chi nhánh.' },
                  { icon: Gift, text: 'Tặng 01 ly nước nguyên bản nhân tháng chọn lời sinh nhật của bạn.' },
                  { icon: MapPin, text: 'Ưu tiên giữ góc bàn đọc sách tĩnh lặng tại Flagship Quận 1.' },
                  { icon: Star, text: 'Tham khảo tất cả các ưu đãi mua trà workshop Chasen.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <item.icon className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                    <p className="text-text-muted leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-surface-card-alt">
                <p className="text-xs text-text-muted mb-2 font-semibold uppercase tracking-wide">Cấp bậc tiếp theo</p>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-bold text-brand-primary">{member.nextTier}</span>
                </div>
              </div>
            </div>

            {/* Eco Recycling */}
            <div className="bg-brand-accent/10 border-2 border-brand-accent/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Recycle className="w-5 h-5 text-brand-accent" />
                <h3 className="font-bold text-brand-primary">Tái chế vỏ bình xanh</h3>
              </div>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                Gương Modtra Slow Life. Hoàn trả 03 chai thủy tinh 500ml về bất kỳ chi nhánh để nhận điểm thưởng bổ sung ngay.
              </p>
              <div className="bg-white rounded-xl p-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-text-main">Tặng ngay vì của bạn:</p>
                <span className="text-brand-primary font-bold flex items-center gap-1">
                  <Leaf className="w-4 h-4" />
                  +30 Búp Trà
                </span>
              </div>
              <p className="text-xs text-text-muted mt-2 italic">
                *Số điểm tích lũy thưởng vào tài khoản sau khi xác nhận chai tại cửa hàng.
              </p>
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl shadow-card p-5 space-y-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide mb-2">Chăm sóc khách hàng</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <a href="tel:+842839208924" className="font-bold text-brand-primary text-lg hover:underline">
                      1900 8924
                    </a>
                    <p className="text-xs text-text-muted">8:00 – 21:30</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-surface-card-alt">
                <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-text-main">Trà chuyên cộng Trà Sư Modtra</p>
                  <button className="text-xs text-brand-accent hover:underline font-medium flex items-center gap-1">
                    Kết nối với Trà Sư <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-surface-card-alt">
                <div className="w-10 h-10 bg-surface-bg rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=100"
                    alt="Modtra Slow Living"
                    width={40} height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm text-text-main">Modtra Slow Living</p>
                  <p className="text-xs text-text-muted">Tinh tuyển từ Kyoto · blog chứa câu chuyện phía sau trà.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
