import { Location } from '@/lib/types'

export const locations: Location[] = [
  {
    id: 'hcm-flagship',
    name: 'TP.HCM Flagship Store',
    address: '128 Vườn Xanh, P. Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    phone: '+84 (28) 3990 9988',
    hours: '07:00 - 22:00 (Thứ 2 - Chủ nhật)',
    features: ['Chỗ đỗ ô tô', 'Sân vườn Zen', 'Phòng trà đạo', 'Workshop cuối tuần'],
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    coordinates: {
      lat: 10.7769,
      lng: 106.7009
    }
  },
  {
    id: 'hanoi-west-lake',
    name: 'Hà Nội Tây Hồ',
    address: '45 Đường Trúc Bạch',
    district: 'Quận Ba Đình',
    city: 'Hà Nội',
    phone: '+84 (24) 3715 8899',
    hours: '07:30 - 22:00 (Thứ 2 - Chủ nhật)',
    features: ['View Hồ Tây', 'Không gian yên tĩnh', 'Phòng trà đạo', 'Outdoor seating'],
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    coordinates: {
      lat: 21.0453,
      lng: 105.8251
    }
  },
  {
    id: 'danang-city',
    name: 'Đà Nẵng Trung Tâm',
    address: '15 Đường Lê Lợi',
    district: 'Quận Hải Châu',
    city: 'Đà Nẵng',
    phone: '+84 (236) 3888 777',
    hours: '07:00 - 22:00 (Thứ 2 - Chủ nhật)',
    features: ['Không gian mở', 'View sông Hàn', 'Gần biển', 'Matcha bar counter'],
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    coordinates: {
      lat: 16.0544,
      lng: 108.2022
    }
  }
]
