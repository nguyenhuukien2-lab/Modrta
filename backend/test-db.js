// test-db.js — Chạy sau khi đã migrate + seed
// Usage: node test-db.js

require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔌 Testing database connection...\n')

  const [products, categories, locations, coupons, usps] = await Promise.all([
    prisma.product.findMany(),
    prisma.category.findMany(),
    prisma.location.findMany(),
    prisma.coupon.findMany(),
    prisma.uSP.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  console.log(`✅ Products   : ${products.length}`)
  products.forEach(p => console.log(`   - [${p.category}] ${p.name} — ${p.price.toLocaleString('vi-VN')}đ`))

  console.log(`\n✅ Categories : ${categories.length}`)
  categories.forEach(c => console.log(`   - ${c.name} (${c.slug})`))

  console.log(`\n✅ Locations  : ${locations.length}`)
  locations.forEach(l => console.log(`   - ${l.name}, ${l.city}`))

  console.log(`\n✅ Coupons    : ${coupons.length}`)
  coupons.forEach(c => console.log(`   - ${c.code} — ${c.discountPercent}% off`))

  console.log(`\n✅ USPs       : ${usps.length}`)
  usps.forEach(u => console.log(`   - ${u.title}`))

  console.log('\n🎉 Database connected and seeded correctly!')
}

main()
  .catch(e => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
