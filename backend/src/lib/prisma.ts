import { PrismaClient } from '@prisma/client'

if (process.env.DATABASE_URL?.includes('pooler')) {
  const databaseUrl = new URL(process.env.DATABASE_URL)
  databaseUrl.searchParams.set('pgbouncer', 'true')
  databaseUrl.searchParams.set('connection_limit', '1')
  process.env.DATABASE_URL = databaseUrl.toString()
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
