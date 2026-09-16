import { Product } from '@/lib/types'

export const products: Product[] = [
  // MATCHA COLLECTION
  {
    id: 'matcha-latte-oat',
    name: 'Matcha Latte Yến Mạch Tươi',
    nameEn: 'Matcha Oat Milk Latte',
    slug: 'matcha-latte-yen-mach',
    category: 'matcha',
    subcategory: 'Matcha Latte & Sáng Tạo',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800',
    description: 'Lớp matcha Uji xanh mướt hòa quyện sữa yến mạch béo mịn, tạo phân tầng nghệ thuật với độ ngọt tự nhiên từ đường hoa dừa',
    descriptionEn: 'Premium Uji matcha blended with creamy oat milk and coconut blossom sugar',
    tags: ['Bestseller', 'Organic', 'Plant-based'],
    isNew: false,
    isBestseller: true,
    inStock: true,
    ingredients: ['Matcha Uji Ceremonial', 'Sữa yến mạch tươi', 'Đường hoa dừa'],
    customizations: {
      ice: true,
      sugar: true,
      milk: ['Yến mạch', 'Hạnh nhân', 'Dừa', 'Sữa tươi'],
      size: ['M', 'L']
    }
  },
  {
    id: 'usucha-pure',
    name: 'Usucha Uji Thuần Khiết',
    nameEn: 'Pure Usucha Uji',
    slug: 'usucha-uji-thuan-khiet',
    category: 'matcha',
    subcategory: 'Matcha Nghi Thức (Ceremonial)',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=800',
    description: '2g bột Matcha Ceremonial đánh chasen theo nghi thức Nhật Bản, tạo lớp micro-foam mịn màng, vị đắng nhẹ thanh mát',
    descriptionEn: 'Traditional ceremonial matcha whisked to perfection',
    tags: ['Ceremonial', 'Traditional', 'JAS Organic'],
    isNew: false,
    isBestseller: true,
    inStock: true,
    ingredients: ['Matcha Uji Ceremonial 100%', 'Nước suối núi lửa 75-80°C'],
    customizations: {
      ice: false,
      sugar: false,
    }
  },
  {
    id: 'koicha-premium',
    name: 'Koicha Đậm Đặc Thượng Phẩm',
    nameEn: 'Premium Koicha',
    slug: 'koicha-dam-dac',
    category: 'matcha',
    subcategory: 'Matcha Nghi Thức (Ceremonial)',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=800',
    description: 'Cấp độ trà đạo cao nhất với 4g bột matcha, kết cấu đặc sệt như siro, hương umami sâu lắng dành cho người sành',
    descriptionEn: 'Thick ceremonial matcha for tea connoisseurs',
    tags: ['Premium', 'Ceremonial', 'For Connoisseurs'],
    isNew: false,
    isBestseller: false,
    inStock: true,
    ingredients: ['Matcha Uji Ceremonial Grade A', 'Nước suối núi lửa'],
    customizations: {
      ice: false,
      sugar: false,
    }
  },
  {
    id: 'matcha-coconut',
    name: 'Matcha Dừa Xiêm Tươi Mát',
    nameEn: 'Matcha Fresh Coconut',
    slug: 'matcha-dua-xiem',
    category: 'matcha',
    subcategory: 'Matcha Latte & Sáng Tạo',
    price: 62000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
    description: 'Matcha xanh mát kết hợp nước dừa xiêm tươi ngọt thanh, topping thạch dừa giòn dai, hoàn hảo cho mùa hè',
    descriptionEn: 'Refreshing matcha with fresh young coconut water',
    tags: ['Refreshing', 'Summer', 'Natural Sweetness'],
    isNew: true,
    isBestseller: false,
    inStock: true,
    ingredients: ['Matcha Uji', 'Nước dừa xiêm tươi', 'Thạch dừa'],
    customizations: {
      ice: true,
      sugar: true,
      size: ['M', 'L']
    }
  },

  // COFFEE COLLECTION
  {
    id: 'cold-brew-apricot',
    name: 'Mơ Rừng Cold Brew',
    nameEn: 'Wild Apricot Cold Brew',
    slug: 'mo-rung-cold-brew',
    category: 'coffee',
    subcategory: 'Cold Brew Ủ Chậm',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800',
    description: 'Cold brew ủ lạnh 16 giờ từ hạt Arabica Cầu Đất, thêm siro mơ rừng Tây Bắc chua ngọt tự nhiên',
    descriptionEn: '16-hour cold brew with wild apricot syrup',
    tags: ['Cold Brew', 'Signature', 'Low Acid'],
    isNew: false,
    isBestseller: true,
    inStock: true,
    ingredients: ['Arabica Cầu Đất', 'Siro mơ rừng', 'Nước mềm ủ lạnh 16h'],
    customizations: {
      ice: true,
      sugar: true,
      size: ['M', 'L']
    }
  },
  {
    id: 'matcha-cold-foam-coffee',
    name: 'Matcha Cold Foam Coffee',
    nameEn: 'Matcha Cold Foam Coffee',
    slug: 'matcha-cold-foam-coffee',
    category: 'coffee',
    subcategory: 'Cà phê Kết Hợp Matcha',
    price: 68000,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800',
    description: 'Espresso đậm đà kết hợp cold brew, phủ lớp foam matcha xanh mượt mà tạo màu sắc và hương vị độc đáo',
    descriptionEn: 'Espresso topped with creamy matcha cold foam',
    tags: ['Fusion', 'Instagram-worthy', 'Bestseller'],
    isNew: false,
    isBestseller: true,
    inStock: true,
    ingredients: ['Espresso Arabica', 'Cold Brew', 'Matcha Foam'],
    customizations: {
      ice: true,
      sugar: true,
      size: ['M', 'L']
    }
  },
  {
    id: 'salt-coffee',
    name: 'Cà phê Muối Bọt Biển',
    nameEn: 'Sea Salt Coffee',
    slug: 'ca-phe-muoi-bot-bien',
    category: 'coffee',
    subcategory: 'Pha Phin & Espresso',
    price: 48000,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
    description: 'Cà phê phin truyền thống đắng đậm, phủ lớp kem muối biển mặn ngọt độc đáo kiểu Huế',
    descriptionEn: 'Traditional Vietnamese coffee with sea salt cream',
    tags: ['Traditional', 'Vietnamese Style', 'Unique'],
    isNew: false,
    isBestseller: false,
    inStock: true,
    ingredients: ['Arabica Cầu Đất phin', 'Kem muối biển', 'Sữa đặc'],
    customizations: {
      ice: true,
      sugar: false,
      size: ['M', 'L']
    }
  },

  // DESSERT
  {
    id: 'tiramisu-matcha',
    name: 'Tiramisu Matcha Nhật Bản',
    nameEn: 'Japanese Matcha Tiramisu',
    slug: 'tiramisu-matcha',
    category: 'dessert',
    price: 52000,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
    description: 'Lớp mascarpone mềm mịn xen kẽ bánh ladyfinger thấm matcha, rắc bột trà xanh Uji trên bề mặt',
    descriptionEn: 'Mascarpone layered with matcha-soaked ladyfingers',
    tags: ['Dessert', 'Italian Fusion', 'Limited'],
    isNew: true,
    isBestseller: false,
    inStock: true,
    ingredients: ['Mascarpone', 'Matcha Uji', 'Ladyfinger', 'Kem tươi'],
  },
  {
    id: 'mochi-matcha',
    name: 'Mochi Kem Matcha Đỏ Đậu',
    nameEn: 'Matcha Red Bean Mochi',
    slug: 'mochi-matcha-do-dau',
    category: 'dessert',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=800',
    description: 'Vỏ mochi dai mềm bọc kem matcha và nhân đậu đỏ Nhật Bản ngọt thanh, lạnh tê',
    descriptionEn: 'Soft mochi with matcha ice cream and red bean',
    tags: ['Japanese', 'Ice Cream', 'Traditional'],
    isNew: false,
    isBestseller: true,
    inStock: true,
    ingredients: ['Mochi', 'Kem matcha', 'Đậu đỏ Hokkaido'],
  },

  // EQUIPMENT
  {
    id: 'matcha-powder-30g',
    name: 'Hộp Bột Matcha Uji 30g',
    nameEn: 'Uji Matcha Powder 30g Tin',
    slug: 'hop-bot-matcha-30g',
    category: 'equipment',
    price: 380000,
    image: 'https://images.unsplash.com/photo-1629892609222-edb50d64d9fc?w=800',
    description: 'Hộp thiếc kín khí 30g matcha ceremonial grade nhập khẩu trực tiếp từ Uji, Kyoto. Đủ pha 15 chén',
    descriptionEn: 'Ceremonial grade matcha powder imported from Uji, Kyoto',
    tags: ['Import', 'JAS Organic', 'Gift Set'],
    isNew: false,
    isBestseller: false,
    inStock: true,
    ingredients: ['100% Matcha Uji Ceremonial'],
  },
  {
    id: 'chasen-whisk-kit',
    name: 'Bộ Dụng Cụ Zen Whisk Kit',
    nameEn: 'Zen Matcha Whisk Kit',
    slug: 'bo-dung-cu-chasen',
    category: 'equipment',
    price: 490000,
    image: 'https://images.unsplash.com/photo-1575638426146-e8b19c2cd8b2?w=800',
    description: 'Bộ trọn gói: Chasen tre 80 lông, Chawan gốm thủ công, Chashaku muỗng tre, hộp gỗ đựng sang trọng',
    descriptionEn: 'Complete matcha ceremony set with bamboo whisk, bowl, and scoop',
    tags: ['Premium Set', 'Gift Worthy', 'Handcrafted'],
    isNew: false,
    isBestseller: false,
    inStock: true,
    ingredients: ['Chasen 80 prongs', 'Chawan ceramic', 'Chashaku bamboo', 'Wooden box'],
  },

  {
    id: 'cold-brew-bottle',
    name: 'Chai Cold Brew 500ml Thủy Tinh',
    nameEn: 'Cold Brew Glass Bottle 500ml',
    slug: 'chai-cold-brew-500ml',
    category: 'coffee',
    subcategory: 'Đóng Chai Thủy Tinh & Hạt Rang',
    price: 110000,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
    description: 'Chai thủy tinh 500ml cold brew nguyên chất, ủ lạnh 16 giờ, uống được 3-4 cốc. Trả chai được tích điểm',
    descriptionEn: '500ml bottled cold brew, 16-hour steep, returnable bottle',
    tags: ['Bottled', 'Eco-Friendly', 'Take Home'],
    isNew: false,
    isBestseller: false,
    inStock: true,
    ingredients: ['100% Arabica Cầu Đất', 'Nước suối mềm'],
  },
]

export const featuredProducts = products.filter(p => p.isBestseller).slice(0, 4)
export const newProducts = products.filter(p => p.isNew)
export const matchaProducts = products.filter(p => p.category === 'matcha')
export const coffeeProducts = products.filter(p => p.category === 'coffee')
export const dessertProducts = products.filter(p => p.category === 'dessert')
export const equipmentProducts = products.filter(p => p.category === 'equipment')
