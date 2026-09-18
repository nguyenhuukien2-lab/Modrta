/**
 * Auth API Client
 * Handles register, login, logout, and user profile
 */

const API_BASE = process.env.NODE_ENV === 'production'
  ? ''
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000')
const defaultHeaders = {
  'Content-Type': 'application/json',
} as const

export interface AuthUser {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  district?: string
  city?: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export interface AuthError {
  error: string
}

// ─── REGISTER ───────────────────────────────────────────────────────────────

export async function register(data: {
  email: string
  password: string
  name: string
  phone?: string
  confirmPassword?: string
  agreedTerms?: boolean
  newsletter?: boolean
}): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const json = await res.json()

    if (!res.ok) {
      throw new Error(json.error || 'Registration failed')
    }

    return json
  } catch (error) {
    throw error
  }
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────

export async function login(data: {
  email: string
  password: string
}): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const json = await res.json()

    if (!res.ok) {
      throw new Error(json.error || 'Login failed')
    }

    return json
  } catch (error) {
    throw error
  }
}

// ─── GET CURRENT USER ────────────────────────────────────────────────────────

export async function getCurrentUser(token?: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || 'Failed to fetch user')
  }

  return json
}

// ─── UPDATE PROFILE ─────────────────────────────────────────────────────────

export async function updateProfile(
  token: string,
  data: Partial<AuthUser>
): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || 'Failed to update profile')
  }

  return json
}

// ─── LOGOUT ────────────────────────────────────────────────────────────────

export async function logout(token?: string): Promise<void> {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// ─── TOKEN STORAGE ────────────────────────────────────────────────────────

const TOKEN_KEY = 'modtra_auth_token'

export function saveToken(token: string): void {
  if (typeof window === 'undefined') return
  // Token is now managed via secure HttpOnly cookies in the backend.
  // Keep this as a no-op to avoid localStorage persistence.
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return null
}

export function removeToken(): void {
  // Authentication state is stored in the backend cookie.
}

export function isTokenValid(token: string): boolean {
  if (!token) return false
  if (token.startsWith('demo-token-')) return true

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false

    const payload = JSON.parse(atob(parts[1]))

    if (payload.exp) {
      const expiry = payload.exp * 1000
      return Date.now() < expiry
    }

    return true
  } catch {
    return false
  }
}
