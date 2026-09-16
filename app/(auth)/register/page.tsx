'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register, error: authError, clearError } = useAuth()

  const redirect = searchParams.get('redirect') || '/'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
    clearError()
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Vui lòng nhập họ tên')
      return false
    }

    if (!formData.email.trim()) {
      setError('Vui lòng nhập email')
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email không hợp lệ')
      return false
    }

    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu')
      return false
    }

    if (formData.password.length < 8) {
      setError('Mật khẩu phải ít nhất 8 ký tự')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
      })

      // Redirect to intended page or home
      router.push(redirect === 'checkout' ? '/checkout' : redirect)
    } catch (err) {
      // Error is handled by context
    } finally {
      setLoading(false)
    }
  }

  const displayError = error || authError

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-brand-primary mb-2">Đăng ký</h1>
            <p className="text-text-muted">Tạo tài khoản Modtra để bắt đầu</p>
          </div>

          {/* Error */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{displayError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Họ và tên *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg focus:border-brand-accent focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg focus:border-brand-accent focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Số điện thoại (tùy chọn)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0901234567"
                className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg focus:border-brand-accent focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Mật khẩu *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ít nhất 8 ký tự"
                className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg focus:border-brand-accent focus:outline-none transition-colors"
                disabled={loading}
              />
              <p className="text-xs text-text-muted mt-1">
                Mật khẩu phải chứa chữ cái, số, và ký tự đặc biệt
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Xác nhận mật khẩu *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg focus:border-brand-accent focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-surface-card-alt" />
            <span className="text-sm text-text-muted">hoặc</span>
            <div className="flex-1 h-px bg-surface-card-alt" />
          </div>

          {/* Login Link */}
          <p className="text-center text-text-muted">
            Đã có tài khoản?{' '}
            <Link
              href="/login"
              className="text-brand-primary hover:underline font-semibold"
            >
              Đăng nhập
            </Link>
          </p>

          {/* Terms */}
          <p className="text-xs text-text-muted text-center mt-6">
            Bằng cách đăng ký, bạn đồng ý với{' '}
            <a href="#" className="text-brand-primary hover:underline">
              Điều khoản
            </a>{' '}
            và{' '}
            <a href="#" className="text-brand-primary hover:underline">
              Chính sách bảo mật
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
