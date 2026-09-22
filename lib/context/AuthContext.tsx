'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  AuthUser,
  register as registerAPI,
  login as loginAPI,
  logout as logoutAPI,
  getCurrentUser,
  getToken,
  saveToken,
  removeToken,
  isTokenValid,
} from '@/lib/auth'

export interface AuthContextType {
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean

  // Methods
  register: (data: { email: string; password: string; name: string; phone: string; confirmPassword: string; agreedTerms: boolean; newsletter: boolean }) => Promise<void>
  login: (data: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth from secure cookie session on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        setToken(currentUser ? 'cookie-session' : null)
      } catch (err) {
        if (!(err instanceof Error && err.message === 'Missing authorization token')) {
          console.error('Auth init failed:', err)
        }
        setUser(null)
        setToken(null)
        removeToken()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const register = async (data: {
    email: string
    password: string
    name: string
    phone: string
    confirmPassword: string
    agreedTerms: boolean
    newsletter: boolean
  }) => {
    try {
      setError(null)
      const response = await registerAPI(data)
      setToken(response.token)
      setUser(response.user)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      throw err
    }
  }

  const login = async (data: { email: string; password: string }) => {
    try {
      setError(null)
      const response = await loginAPI(data)
      setToken(response.token)
      setUser(response.user)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      if (token) {
        await logoutAPI(token)
      }
      removeToken()
      setToken(null)
      setUser(null)
    } catch (err) {
      console.error('Logout error:', err)
      // Still clear local state even if API fails
      removeToken()
      setToken(null)
      setUser(null)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    register,
    login,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
