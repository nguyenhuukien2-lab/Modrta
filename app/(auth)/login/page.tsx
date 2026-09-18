'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, error: authError, clearError } = useAuth()

  const redirect = searchParams.get('redirect') || '/'
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
    clearError()
  }

  const validateForm = (): boolean => {
    if (!formData.identifier.trim()) {
      setError('Vui lòng nhập email hoặc số điện thoại')
      return false
    }

    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)
      await login({
        email: formData.identifier,
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

  const handleForgotPassword = () => {
    // TODO: Implement forgot password
    alert('Tính năng quên mật khẩu sẽ được cập nhật sớm')
  }

  const displayError = error || authError

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-brand-primary mb-2">Đăng nhập</h1>
            <p className="text-text-muted">Chào mừng bạn quay lại</p>
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
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Email
              </label>
              <input
                type="email"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Email hoặc số điện thoại"
                className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg focus:border-brand-accent focus:outline-none transition-colors"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-text-main">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-brand-primary hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="w-full px-4 py-3 border-2 border-surface-card-alt rounded-lg focus:border-brand-accent focus:outline-none transition-colors"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-surface-card-alt"
              />
              <label htmlFor="rememberMe" className="text-sm text-text-muted">
                Ghi nhớ tôi
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-surface-card-alt" />
            <span className="text-sm text-text-muted">hoặc</span>
            <div className="flex-1 h-px bg-surface-card-alt" />
          </div>

          {/* Register Link */}
          <p className="text-center text-text-muted">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              className="text-brand-primary hover:underline font-semibold"
            >
              Đăng ký ngay
            </Link>
          </p>

          {/* Demo Account */}
          <div className="mt-6 p-4 bg-brand-accent/10 rounded-lg">
            <p className="text-xs text-text-muted text-center">
              <strong>Demo account:</strong>
              <br />
              test@example.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-brand-primary to-brand-accent" />}>
      <LoginForm />
    </Suspense>
  )
}