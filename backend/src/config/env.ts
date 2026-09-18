const requiredEnv = ['DATABASE_URL', 'DIRECT_URL', 'JWT_SECRET'] as const

export function validateEnvironment() {
  const missing = requiredEnv.filter((key) => !process.env[key] || !String(process.env[key]).trim())

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
