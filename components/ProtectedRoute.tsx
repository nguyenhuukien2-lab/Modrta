'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login?redirect=' + window.location.pathname)
    }
  }, [isAuthenticated, loading, router])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex flex-col items-center justify-center gap-4">
        <Loader className="w-8 h-8 text-brand-primary animate-spin" />
        <p className="text-text-muted">Đang xác minh quyền truy cập...</p>
      </div>
    )
  }

  // If not authenticated, show nothing (will redirect via useEffect)
  if (!isAuthenticated || !user) {
    return null
  }

  // User is authenticated, render children
  return <>{children}</>
}

export default ProtectedRoute
