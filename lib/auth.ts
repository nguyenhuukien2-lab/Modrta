/**
 * Auth API Client
 * Handles register, login, logout, and user profile
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
const DEMO_USERS_KEY = 'modtra_demo_users'
const DEMO_USER_KEY = 'modtra_demo_user'

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

function getDemoUsers(): Array<{ id: string; email: string; name: string; phone?: string; password: string }> {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(DEMO_USERS_KEY)
    const users = raw ? JSON.parse(raw) : []
    if (Array.isArray(users) && users.length > 0) return users
  } catch {
    // ignore parse errors and fall back to default demo account
  }

  const defaultUser = {
    id: 'demo-user-1',
    email: 'test@example.com',
    name: 'Demo Customer',
    phone: '0900000000',
    password: 'password123',
  }

  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify([defaultUser]))
  return [defaultUser]
}

function setDemoUsers(users: Array<{ id: string; email: string; name: string; phone?: string; password: string }>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

function getStoredDemoUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(DEMO_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveStoredDemoUser(user: AuthUser) {
  if (typeof window === 'undefined') return
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user))
}

// ─── REGISTER ───────────────────────────────────────────────────────────────

export async function register(data: {
  email: string
  password: string
  name: string
  phone?: string
}): Promise<AuthResponse> {
  try {
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
  } catch (error) {
    if (typeof window === 'undefined') {
      throw error
    }

    const users = getDemoUsers()
    const email = data.email.trim().toLowerCase()
    const existingUser = users.find(user => user.email.toLowerCase() === email)

    if (existingUser) {
      throw new Error('Email already registered')
    }

    const user: AuthUser = {
      id: `demo-${Date.now()}`,
      email,
      name: data.name.trim(),
      phone: data.phone,
    }

    const nextUsers = [...users, { ...user, password: data.password }]
    setDemoUsers(nextUsers)
    saveStoredDemoUser(user)

    return {
      user,
      token: `demo-token-${user.id}`,
    }
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const json = await res.json()

    if (!res.ok) {
      throw new Error(json.error || 'Login failed')
    }

    return json
  } catch (error) {
    if (typeof window === 'undefined') {
      throw error
    }

    const users = getDemoUsers()
    const normalizedEmail = data.email.trim().toLowerCase()
    const matchedUser = users.find(user => user.email.toLowerCase() === normalizedEmail && user.password === data.password)

    if (!matchedUser) {
      throw new Error('Invalid credentials')
    }

    const user: AuthUser = {
      id: matchedUser.id,
      email: matchedUser.email,
      name: matchedUser.name,
      phone: matchedUser.phone,
    }

    saveStoredDemoUser(user)

    return {
      user,
      token: `demo-token-${user.id}`,
    }
  }
}

// ─── GET CURRENT USER ────────────────────────────────────────────────────────

export async function getCurrentUser(token: string): Promise<AuthUser> {
  if (token.startsWith('demo-token-')) {
    const user = getStoredDemoUser()
    if (!user) {
      throw new Error('No demo user found')
    }
    return user
  }

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
  if (token.startsWith('demo-token-')) {
    const current = getStoredDemoUser()
    if (!current) throw new Error('No demo user found')
    const nextUser = { ...current, ...data }
    saveStoredDemoUser(nextUser)
    return nextUser
  }

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
  if (token.startsWith('demo-token-')) {
    localStorage.removeItem(DEMO_USER_KEY)
    return
  }

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
  localStorage.removeItem(DEMO_USER_KEY)
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
