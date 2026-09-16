import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Ảnh thực tế matcha/coffee từ Unsplash - map theo slug
const imageMap: Record<string, string> = {
  // MATCHA
  'matcha-latte-yen-mach':      'https://images.unsplash.com/photo-1634913756415-f6a6a95f31e9?w=600',
  'usucha-uji-thuan-khiet':     'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=600',
  'koicha-dam-dac':             'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600',
  'matcha-dua-xiem':            'https://images.unsplash.com/photo-1627843563285-f3a1bfa25d3b?w=600',
  'matcha-latte-hanh-nhan':     'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600',
  'matcha-strawberry-latte':    'https://images.unsplash.com/photo-1586195831800-7461011d08dd?w=600',
  'matcha-chocolate-latte':     'https://images.unsplash.com/photo-1606312619070-d48b695a6ab8?w=600',
  'matcha-latte-yam':           'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600',
  'matcha-panna-cotta':         'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600',
  'usucha-matcha-latte-mix':    'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=600',
  'matcha-tonic-soda':          'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600',
  'matcha-yuzu-juice':          'https://images.unsplash.com/photo-1627843563285-f3a1bfa25d3b?w=600',
  'matcha-latte-hot-warm':      'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=600',

  // COFFEE
  'mo-rung-cold-brew':          'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600',
  'matcha-cold-foam-coffee':    'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600',
  'ca-phe-muoi-bot-bien':       'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600',
  'chai-cold-brew-500ml':       'https://images.unsplash.com/photo-1565600444102-1b2c8b4dbca5?w=600',
  'matcha-iced-espresso-blend': 'https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?w=600',
  'ca-phe-ban-soi-light':       'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
  'ca-phe-rang-xam-dark-roast': 'https://images.unsplash.com/photo-1447933601403-0c6688bcccf2?w=600',
  'affogato-matcha':            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
  'ca-phe-sua-da-cot-dua':      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600',
  'latte-cao-su-tao-bac':       'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=600',
  'chai-cold-brew-concentrate': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600',
  'tui-hat-ca-phe-ban-soi':     'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600',
  'tui-hat-blend-premium':      'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600',

  // DESSERT
  'tiramisu-matcha':            'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600',
  'mochi-matcha-do-dau':        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600',
  'tiramisu-coffee-latte':      'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600',
  'mochi-chocolate-ice-cream':  'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=600',
  'mochi-strawberry-vanilla':   'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600',
  'dorayaki-matcha-do-dau':     'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=600',
  'croissant-matcha-butter':    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600',
  'brownie-matcha-swirl':       'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600',

  // EQUIPMENT
  'hop-bot-matcha-30g':         'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600',
  'bo-dung-cu-chasen':          'https://images.unsplash.com/photo-1575638426146-e8b19c2cd8b2?w=600',
  'bot-matcha-premium-100g':    'https://images.unsplash.com/photo-1629892609222-edb50d64d9fc?w=600',
  'bo-tra-matcha-luxury':       'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600',
  'french-press-bodum':         'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600',
  'may-xay-ca-phe':             'https://images.unsplash.com/photo-1516743619420-154b70a65fea?w=600',
}

// Fallback theo category
const categoryFallback: Record<string, string> = {
  matcha:    'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=600',
  coffee:    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
  dessert:   'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600',
  equipment: 'https://images.unsplash.com/photo-1575638426146-e8b19c2cd8b2?w=600',
}

async function main() {
  console.log('🖼️  Updating product images with real matcha/coffee photos...')
  const products = await prisma.product.findMany()

  for (const p of products) {
    const newImg = imageMap[p.slug]
      || categoryFallback[p.category]
      || 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=600'

    await prisma.product.update({ where: { id: p.id }, data: { image: newImg } })
    console.log(`✅ ${p.name}`)
  }

  console.log(`\n🎉 Done! ${products.length} images updated.`)
}

main()
  .catch(e => { console.error('❌', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
