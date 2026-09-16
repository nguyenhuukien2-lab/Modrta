'use client'

import { useState, useEffect } from 'react'
import { Zap, Award, TrendingUp, Gift, ArrowRight, Loader } from 'lucide-react'
import Button from '@/components/Button'
import { useAuth } from '@/lib/context/AuthContext'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface LoyaltyStatus {
  user: {
    id: string
    name: string
    email: string
    tier: 'member' | 'silver' | 'gold'
    loyaltyPoints: number
  }
  recentLogs: Array<{
    id: string
    amount: number
    reason: string
    createdAt: string
  }>
  tierThresholds: {
    member: number
    silver: number
    gold: number
  }
  nextTierPoints: number | null
  nextTierPointsRemaining: number
}

interface RedeemInfo {
  discountVND: number
  remainingPoints: number
  message: string
}

export default function LoyaltyPage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [redeeming, setRedeeming] = useState(false)
  const [redeemAmount, setRedeemAmount] = useState(1000)
  const [redeemInfo, setRedeemInfo] = useState<RedeemInfo | null>(null)

  useEffect(() => {
    if (!user || !token) {
      router.push('/login')
      return
    }
    fetchLoyaltyStatus()
  }, [user, token])

  const fetchLoyaltyStatus = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/loyalty/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch loyalty status')
      }

      const data = await response.json()
      setLoyaltyData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading loyalty status')
    } finally {
      setLoading(false)
    }
  }

  const handleRedeem = async () => {
    if (!redeemAmount || redeemAmount <= 0) {
      setError('Vui lòng nhập số điểm hợp lệ')
      return
    }

    if (loyaltyData && redeemAmount > loyaltyData.user.loyaltyPoints) {
      setError('Không đủ điểm để quy đổi')
      return
    }

    try {
      setRedeeming(true)
      setError(null)
      setRedeemInfo(null)

      const response = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: redeemAmount }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to redeem points')
      }

      const data = await response.json()
      setRedeemInfo(data)
      setRedeemAmount(1000)
      // Refresh loyalty status
      await fetchLoyaltyStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error redeeming points')
    } finally {
      setRedeeming(false)
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-text-muted">Đang tải thông tin thành viên...</p>
        </div>
      </div>
    )
  }

  if (!loyaltyData) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">Không thể tải thông tin</p>
          <Button onClick={() => router.refresh()}>Thử lại</Button>
        </div>
      </div>
    )
  }

  const tierIcons = {
    member: '👤',
    silver: '⭐',
    gold: '🏆',
  }

  const tierLabels = {
    member: 'Thành viên',
    silver: 'Thành viên bạc',
    gold: 'Thành viên vàng',
  }

  const tierColors = {
    member: 'bg-gray-50 border-gray-200',
    silver: 'bg-blue-50 border-blue-200',
    gold: 'bg-yellow-50 border-yellow-200',
  }

  const progressPercentage =
    loyaltyData.user.tier === 'gold'
      ? 100
      : loyaltyData.user.tier === 'silver'
      ? ((loyaltyData.user.loyaltyPoints - loyaltyData.tierThresholds.silver) /
          (loyaltyData.tierThresholds.gold - loyaltyData.tierThresholds.silver)) *
        100
      : (loyaltyData.user.loyaltyPoints / loyaltyData.tierThresholds.silver) * 100

  return (
    <div className="min-h-screen bg-surface-bg py-8">
      <div className="container-custom space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-text-main mb-2">Chương trình Thành viên</h1>
          <p className="text-text-muted">Tích lũy điểm mỗi khi mua hàng và nhận ưu đãi độc quyền</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Current Tier Card */}
        <div className={`rounded-2xl p-8 border-2 shadow-card ${tierColors[loyaltyData.user.tier]}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-text-muted mb-2">Cấp bậc hiện tại</p>
              <div className="flex items-center gap-3">
                <span className="text-5xl">{tierIcons[loyaltyData.user.tier]}</span>
                <div>
                  <h2 className="text-3xl font-bold text-text-main">
                    {tierLabels[loyaltyData.user.tier]}
                  </h2>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-text-muted mb-2">Tổng điểm</p>
              <p className="text-4xl font-bold text-text-main">
                {loyaltyData.user.loyaltyPoints.toLocaleString('vi-VN')}
              </p>
            </div>
          </div>

          {/* Progress to Next Tier */}
          {loyaltyData.user.tier !== 'gold' && loyaltyData.nextTierPoints !== null && (
            <div className="mt-6 pt-6 border-t-2 border-opacity-30 border-current">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-text-main">
                  Tiến độ lên {loyaltyData.user.tier === 'member' ? 'Bạc' : 'Vàng'}
                </p>
                <p className="text-sm font-semibold text-text-main">
                  {loyaltyData.nextTierPointsRemaining.toLocaleString('vi-VN')} điểm nữa
                </p>
              </div>
              <div className="w-full bg-white bg-opacity-40 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>
          )}

          {loyaltyData.user.tier === 'gold' && (
            <div className="mt-6 pt-6 border-t-2 border-opacity-30 border-current">
              <p className="text-sm font-semibold text-text-main">
                ✓ Bạn đã đạt cấp bậc cao nhất!
              </p>
            </div>
          )}
        </div>

        {/* Benefits Grid */}
        <div>
          <h3 className="text-2xl font-bold text-text-main mb-4">Quyền lợi theo cấp bậc</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                tier: 'member',
                label: 'Thành viên',
                perks: ['1 điểm/1000đ', 'Hỗ trợ ưu tiên', 'Ưu đãi hàng tuần'],
              },
              {
                tier: 'silver',
                label: 'Thành viên Bạc',
                perks: ['1.2 điểm/1000đ', 'Giao hàng miễn phí', 'Ưu đãi hàng ngày'],
              },
              {
                tier: 'gold',
                label: 'Thành viên Vàng',
                perks: ['1.5 điểm/1000đ', 'Giao hàng VIP', 'Ưu đãi độc quyền'],
              },
            ].map(tier => (
              <div
                key={tier.tier}
                className={`rounded-xl p-6 border-2 transition-all ${
                  loyaltyData.user.tier === tier.tier
                    ? 'border-brand-primary bg-brand-primary bg-opacity-5'
                    : 'border-surface-card-alt bg-white'
                }`}
              >
                <div className="text-3xl mb-3">{tierIcons[tier.tier as keyof typeof tierIcons]}</div>
                <h4 className="font-bold text-text-main mb-3">{tier.label}</h4>
                <ul className="space-y-2">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="text-sm text-text-muted flex items-center gap-2">
                      <Award className="w-4 h-4 text-brand-accent" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Redeem Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Redeem Form */}
          <div className="bg-white rounded-2xl p-8 shadow-card">
            <div className="flex items-center gap-2 mb-6">
              <Gift className="w-6 h-6 text-brand-primary" />
              <h3 className="text-2xl font-bold text-text-main">Quy đổi điểm</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Số điểm muốn quy đổi</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={redeemAmount}
                    onChange={e => setRedeemAmount(parseInt(e.target.value) || 0)}
                    min="100"
                    step="100"
                    max={loyaltyData.user.loyaltyPoints}
                    className="flex-1 px-4 py-3 border-2 border-surface-card-alt rounded-lg"
                  />
                  <span className="text-sm text-text-muted font-semibold">
                    điểm
                  </span>
                </div>
              </div>

              <div className="bg-surface-bg rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-text-muted">Giảm giá nhận được:</span>
                  <span className="text-lg font-bold text-brand-primary">
                    {formatPrice(redeemAmount * 100)}
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  (1 điểm = 100đ)
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-sm">
                <p className="text-blue-700">
                  Điểm hiện có: <strong>{loyaltyData.user.loyaltyPoints.toLocaleString('vi-VN')}</strong>
                </p>
              </div>

              <Button
                onClick={handleRedeem}
                disabled={redeeming || redeemAmount <= 0 || redeemAmount > loyaltyData.user.loyaltyPoints}
                className="w-full"
              >
                {redeeming ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Quy đổi ngay'
                )}
              </Button>

              {redeemInfo && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-sm">
                  <p className="text-green-700 font-semibold mb-2">✓ Quy đổi thành công!</p>
                  <p className="text-green-700 text-sm">{redeemInfo.message}</p>
                  <p className="text-green-700 text-xs mt-2">
                    Điểm còn lại: {redeemInfo.remainingPoints.toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl p-8 shadow-card">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-brand-accent" />
              <h3 className="text-2xl font-bold text-text-main">Cách hoạt động</h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Mua hàng',
                  description: 'Mỗi lần bạn mua hàng, bạn sẽ nhận được điểm',
                },
                {
                  step: 2,
                  title: 'Tích lũy điểm',
                  description: 'Điểm được cộng vào tài khoản của bạn ngay lập tức',
                },
                {
                  step: 3,
                  title: 'Nâng cấp bậc',
                  description: 'Đạt đủ điểm để lên Bạc (1000) hoặc Vàng (5000)',
                },
                {
                  step: 4,
                  title: 'Quy đổi ưu đãi',
                  description: 'Quy đổi điểm thành giảm giá cho đơn hàng tiếp theo',
                },
              ].map(item => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-main mb-1">{item.title}</h4>
                    <p className="text-sm text-text-muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/menu">
              <Button variant="secondary" className="w-full mt-6">
                Tiếp tục mua sắm
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <h3 className="text-2xl font-bold text-text-main mb-6">Lịch sử gần đây</h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loyaltyData.recentLogs.length > 0 ? (
              loyaltyData.recentLogs.map(log => (
                <div
                  key={log.id}
                  className="flex justify-between items-center p-4 border border-surface-card-alt rounded-lg hover:bg-surface-bg transition-colors"
                >
                  <div>
                    <p className="font-semibold text-text-main capitalize">
                      {log.reason === 'order_purchase'
                        ? 'Mua hàng'
                        : log.reason === 'redeemed'
                        ? 'Quy đổi điểm'
                        : log.reason}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(log.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className={`font-bold text-lg ${log.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {log.amount > 0 ? '+' : ''}{log.amount.toLocaleString('vi-VN')}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-text-muted py-8">Chưa có lịch sử</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
