import { Category } from '@/lib/types'

export const categories: Category[] = [
  {
    id: 'all',
    name: 'Tất cả',
    slug: 'all',
    description: 'Toàn bộ thực đơn'
  },
  {
    id: 'matcha-ceremonial',
    name: 'Matcha Nghi Thức Uji',
    slug: 'matcha-nghi-thuc',
    description: 'Usucha, Koicha truyền thống'
  },
  {
    id: 'matcha-creative',
    name: 'Matcha Latte & Sáng Tạo',
    slug: 'matcha-sang-tao',
    description: 'Matcha kết hợp sữa hạt, dừa tươi'
  },
  {
    id: 'coffee',
    name: 'Cà Phê & Đồ Uống Đặc Sắc',
    slug: 'ca-phe',
    description: 'Cold Brew, Espresso, fusion'
  },
  {
    id: 'dessert',
    name: 'Bánh & Tráng Miệng Zen',
    slug: 'trang-mieng',
    description: 'Tiramisu, Mochi, Japanese desserts'
  },
  {
    id: 'equipment',
    name: 'Bột Trà & Dụng Cụ',
    slug: 'dung-cu',
    description: 'Matcha powder, Chasen, gift sets'
  }
]
