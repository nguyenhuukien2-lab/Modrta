/**
 * Auth API Client
 * Handles register, login, logout, and user profile
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

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
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || 'Registration failed')
  }

  return json
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────

export async function login(data: {
  email: string
  password: string
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || 'Login failed')
  }

  return json
}

// ─── GET CURRENT USER ────────────────────────────────────────────────────────

export async function getCurrentUser(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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

export async function logout(token: string): Promise<void> {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// ─── TOKEN STORAGE ────────────────────────────────────────────────────────

const TOKEN_KEY = 'modtra_auth_token'

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function isTokenValid(token: string): boolean {
  if (!token) return false

  try {
    // Basic check: JWT has 3 parts separated by dots
    const parts = token.split('.')
    if (parts.length !== 3) return false

    // Try to decode payload (part 2)
    const payload = JSON.parse(atob(parts[1]))

    // Check if expired
    if (payload.exp) {
      const expiry = payload.exp * 1000 // Convert to milliseconds
      return Date.now() < expiry
    }

    return true
  } catch {
    return false
  }
}
