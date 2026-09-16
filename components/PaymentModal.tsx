'use client'

import { useState } from 'react'
import { X, Copy, Check, Loader } from 'lucide-react'
import Button from './Button'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  total: number
  paymentMethod: 'vietqr' | 'momo' | 'zalopay' | 'card' | 'cod'
  token: string
}

export default function PaymentModal({
  isOpen,
  onClose,
  orderId,
  total,
  paymentMethod,
  token,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [transactionRef, setTransactionRef] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verified, setVerified] = useState(false)

  const handleVietQR = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/payments/vietqr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate VietQR')
      }

      const data = await response.json()
      setQrCode(data.qrCode)
      setTransactionRef(data.transactionRef)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating QR code')
    } finally {
      setLoading(false)
    }
  }

  const handleMoMo = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/payments/momo/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      })

      if (!response.ok) {
        throw new Error('Failed to initialize MoMo payment')
      }

      const data = await response.json()
      // In production, redirect to MoMo endpoint with all parameters
      // For now, just show the info
      console.log('MoMo payment initialized:', data)
      setTransactionRef(data.requestId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error initializing MoMo payment')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyVietQR = async () => {
    if (!transactionRef) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/payments/vietqr/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ transactionRef }),
      })

      if (!response.ok) {
        throw new Error('Failed to verify payment')
      }

      const data = await response.json()
      setVerified(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying payment')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (transactionRef) {
      navigator.clipboard.writeText(transactionRef)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-main">
            {paymentMethod === 'cod'
              ? 'Xác nhận đơn hàng'
              : paymentMethod === 'vietqr'
              ? 'Thanh toán VietQR'
              : paymentMethod === 'momo'
              ? 'Thanh toán MoMo'
              : 'Thanh toán'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-bg rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        {paymentMethod === 'cod' ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-blue-700">
                Đơn hàng của bạn sẽ được giao trong 45 phút. Vui lòng chuẩn bị tiền mặt để thanh toán khi nhân viên giao hàng đến.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Tổng cộng:</span>
                <span className="font-bold text-text-main text-lg">
                  {(total / 1000).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
            <Button onClick={onClose} className="w-full">
              Đã hiểu
            </Button>
          </div>
        ) : paymentMethod === 'vietqr' ? (
          <div className="space-y-4">
            {!qrCode ? (
              <>
                <p className="text-text-muted text-sm">
                  Nhấn nút bên dưới để tạo mã QR. Quét mã bằng ứng dụng ngân hàng của bạn để thanh toán.
                </p>
                <Button
                  onClick={handleVietQR}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    'Tạo mã QR'
                  )}
                </Button>
              </>
            ) : verified ? (
              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                  <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-700 font-semibold">Thanh toán thành công!</p>
                </div>
                <Button onClick={onClose} className="w-full">
                  Đóng
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Display QR Code */}
                <div className="bg-surface-bg p-4 rounded-lg flex justify-center">
                  <img
                    src={qrCode}
                    alt="VietQR Payment"
                    className="w-48 h-48"
                  />
                </div>

                {/* Transaction Reference */}
                <div className="bg-surface-bg rounded-lg p-4">
                  <p className="text-xs text-text-muted mb-2">Mã giao dịch</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono text-text-main bg-white p-2 rounded border border-surface-card-alt">
                      {transactionRef}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-surface-card-alt rounded transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-text-muted" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 text-sm">
                  <p className="text-yellow-700">
                    📱 Quét mã QR bằng ứng dụng ngân hàng (MBBank, Vietcombank, etc.) để thanh toán.
                  </p>
                </div>

                {/* Verify Button */}
                <Button
                  onClick={handleVerifyVietQR}
                  disabled={loading}
                  variant="secondary"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Đang kiểm tra...
                    </>
                  ) : (
                    'Đã thanh toán? Xác nhận'
                  )}
                </Button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        ) : paymentMethod === 'momo' ? (
          <div className="space-y-4">
            {!transactionRef ? (
              <>
                <p className="text-text-muted text-sm">
                  Nhấn nút bên dưới để khởi tạo thanh toán MoMo. Bạn sẽ được chuyển hướng đến ứng dụng MoMo.
                </p>
                <Button
                  onClick={handleMoMo}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Đang khởi tạo...
                    </>
                  ) : (
                    'Thanh toán MoMo'
                  )}
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-700 text-sm">
                    🔗 Bạn sẽ được chuyển hướng đến MoMo. Nếu không, vui lòng mở ứng dụng MoMo để quét mã.
                  </p>
                </div>

                <div className="bg-surface-bg rounded-lg p-4">
                  <p className="text-xs text-text-muted mb-2">Mã yêu cầu</p>
                  <code className="text-sm font-mono text-text-main">
                    {transactionRef}
                  </code>
                </div>

                <Button onClick={onClose} className="w-full">
                  Đóng
                </Button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
