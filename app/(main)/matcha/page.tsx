// 🍵 TRANG MATCHA UJI - Matcha Collection Page
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Award, Leaf, Shield, CheckCircle, ArrowRight, Droplets, Thermometer, Clock } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import Button from '@/components/Button'
import { useCartStore } from '@/lib/store/cartStore'
import { useProducts } from '@/lib/hooks/useProducts'
import { Product } from '@/lib/types'

export default function MatchaPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'newest' | 'rating'>('popularity')
  
  const { addItem } = useCartStore()

  // Fetch matcha products from API
  const { products: allProducts, loading } = useProducts({
    category: 'matcha',
    limit: 100,
    sort: sortBy,
  })

  const filters = [
    { id: 'all', label: 'Tất cả', count: allProducts.length },
    { id: 'ceremonial', label: 'Matcha Nghi Thức (Ceremonial)', count: allProducts.filter(p => p.tags?.includes('Ceremonial')).length },
    { id: 'creative', label: 'Matcha Latte & Sáng Tạo', count: allProducts.filter(p => p.tags?.includes('Latte')).length },
  ]

  const filteredProducts = selectedFilter === 'all' 
    ? allProducts 
    : selectedFilter === 'ceremonial'
    ? allProducts.filter(p => p.tags?.includes('Ceremonial'))
    : allProducts.filter(p => p.tags?.includes('Latte'))

  const handleAddToCart = (product: Product) => {
    const defaultCustomizations = {
      ice: '100%',
      sugar: '100%',
      milk: '',
      size: 'M',
    }
    
    addItem(product, defaultCustomizations)
  }

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary via-brand-accent to-brand-primary text-white py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
                <Leaf className="w-4 h-4" />
                <span>100% Ceremonial Grade từ Uji, Kyoto</span>
              </div>
              
              <h1 className="text-h1 font-bold leading-tight">
                Hành trình từ đồi trà Uji đến <span className="font-serif italic">ly matcha an yên</span> trên tay bạn
              </h1>
              
              <p className="text-lg leading-relaxed opacity-90">
                Giống trà Tencha vụ xuân đầu tiên được che bóng giàn Tana 30 ngày, 
                thu hái búp non bằng tay và nghiền cối đá Granit siêu chậm 18g/giờ 
                để giữ trọn hương vị <span className="font-serif italic">umami</span> sâu lắng.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="space-y-1">
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-sm opacity-90">JAS Organic</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">18g/h</p>
                  <p className="text-sm opacity-90">Nghiền cối đá</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">30 ngày</p>
                  <p className="text-sm opacity-90">Che bóng Tana</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/menu">
                  <Button variant="secondary" size="lg">
                    Khám phá thực đơn Matcha
                  </Button>
                </Link>
                <a href="#technique">
                  <Button size="lg" className="bg-white/10 hover:bg-white/20 border-2 border-white text-white">
                    Kỹ thuật đánh Chasen
                  </Button>
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=800"
                  alt="Matcha Uji Ceremonial"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white text-brand-primary p-6 rounded-2xl shadow-card-hover max-w-xs">
                <div className="flex items-start gap-4">
                  <Award className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <p className="font-bold mb-1">Chuẩn JAS Organic</p>
                    <p className="text-sm text-text-muted">0% hóa chất & thuốc trừ sâu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-brand-accent font-medium mb-3 uppercase tracking-wide text-sm">
              Nơi thức hoa trà ngàn năm
            </p>
            <h2 className="text-h2 font-bold mb-4">
              Nội thức hoa trà ngay từ hơn <span className="text-zen">800 năm</span>
            </h2>
            <p className="text-text-muted leading-relaxed">
              Từ thế kỷ 12, vùng Uji (Kyoto) đã trở thành thánh địa trà xanh Nhật Bản. 
              Khí hậu ẩm mát, sương mù dày đặc và đất đai màu mỡ tạo nên búp trà Tencha 
              có hương thơm đặc trưng không thể nhầm lẫn.
            </p>
          </div>

          {/* Process Timeline */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Che Bóng Giàn Tana 30 Ngày',
                desc: 'Giàn rơm che kín toàn bộ ruộng trà 4 tuần trước thu hoạch, tăng hàm lượng L-Theanine và Chlorophyll tự nhiên',
                image: 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=600',
                icon: Shield
              },
              {
                step: '02',
                title: 'Thu Hái Búp Non First Flush',
                desc: 'Chỉ lấy 2 lá non đầu tiên của cây trà vào đầu tháng 5, khi búp trà đạt độ mềm mại và hương thơm tối đa',
                image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600',
                icon: Leaf
              },
              {
                step: '03',
                title: 'Nghiền Cối Đá Granit 18g/Giờ',
                desc: 'Quy trình siêu chậm bằng cối đá truyền thống, mất 1 giờ để nghiền 18g bột matcha mịn như phấn tơ',
                image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600',
                icon: Clock
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-brand-primary">
                    {item.step}
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-text-main pt-1">{item.title}</h3>
                </div>
                <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter & Products */}
      <section className="section bg-surface-bg">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-h2 font-bold mb-3">Thực Đơn Matcha Uji</h2>
            <p className="text-text-muted">Từ nghi thức trà đạo đến những tạo hóa sáng tạo</p>
          </div>

          {/* Filter & Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedFilter === filter.id
                      ? 'bg-brand-primary text-white shadow-card'
                      : 'bg-white text-text-main hover:bg-brand-accent/10 hover:text-brand-primary border border-surface-card-alt'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="ml-auto px-4 py-3 border-2 border-surface-card-alt rounded-lg text-sm font-medium"
            >
              <option value="popularity">Phổ biến nhất</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
              <option value="newest">Mới nhất</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="py-12 text-center text-text-muted">
              Đang tải sản phẩm...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-text-muted">
              Không tìm thấy sản phẩm phù hợp
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/menu">
              <Button size="lg" variant="outline">
                Xem toàn bộ thực đơn
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Technique Guide */}
      <section id="technique" className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-card">
                <Image
                  src="https://images.unsplash.com/photo-1629892609222-edb50d64d9fc?w=800"
                  alt="Matcha powder"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=400"
                    alt="Chasen whisk"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"
                    alt="Matcha ceremony"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <p className="text-brand-accent font-medium mb-3 uppercase tracking-wide text-sm">
                  Quy Chuẩn Tỷ Lệ Vàng
                </p>
                <h2 className="text-h2 font-bold mb-4">
                  3 Bước Đánh Chasen Tạo Lớp <span className="text-zen">Micro-Foam</span> Hoàn Hảo
                </h2>
                <p className="text-text-muted leading-relaxed mb-6">
                  Nghệ thuật đánh matcha bằng chasen (chổi tre) không chỉ là kỹ thuật mà còn là 
                  thiền định. Mỗi động tác chữ M hay chữ W đều mang ý nghĩa riêng trong trà đạo Nhật Bản.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {[
                  {
                    icon: Droplets,
                    step: 'Bước 1',
                    title: 'Rây 2g Bột Matcha',
                    desc: 'Dùng rây lụa mịn để loại bỏ cục bột, đảm bảo matcha mịn màng như phấn'
                  },
                  {
                    icon: Thermometer,
                    step: 'Bước 2',
                    title: 'Nước 75-80°C (60-70ml)',
                    desc: 'Nhiệt độ vàng giữ hương thơm và tránh đắng. Không dùng nước sôi 100°C'
                  },
                  {
                    icon: Clock,
                    step: 'Bước 3',
                    title: 'Đánh Chữ W/M Trong 20 Giây',
                    desc: 'Chổi chasen vẽ chữ M nhanh tạo lớp foam mịn, giữ cổ tay linh hoạt'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-surface-bg rounded-xl">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-brand-accent font-medium mb-1">{item.step}</p>
                      <p className="font-semibold text-text-main mb-1">{item.title}</p>
                      <p className="text-sm text-text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/menu?product=chasen-whisk-kit">
                <Button variant="accent" icon={<ArrowRight className="w-5 h-5" />}>
                  Mua bộ dụng cụ Chasen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section bg-surface-bg">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-h2 font-bold mb-4">
              Cam kết <span className="text-zen">100% Nguyên gốc</span> & An toàn tuyệt đối
            </h2>
            <p className="text-text-muted">
              Mỗi lô matcha đều có giấy chứng nhận nguồn gốc và kiểm định chất lượng
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'JAS Organic Japan', desc: 'Hữu cơ chuẩn Nhật Bản', icon: Award },
              { title: 'Eurofins Certified', desc: '0% dư lượng hóa chất', icon: Shield },
              { title: 'Direct Import', desc: 'Nhập khẩu trực tiếp Uji', icon: CheckCircle },
              { title: 'Cold Chain', desc: 'Bảo quản lạnh -18°C', icon: Thermometer },
            ].map((cert, index) => (
              <div key={index} className="card text-center group hover:border-2 hover:border-brand-accent transition-all">
                <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <cert.icon className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-lg text-text-main mb-2">{cert.title}</h3>
                <p className="text-sm text-text-muted">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-brand-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-h2 font-bold mb-4">
            Sẵn sàng trải nghiệm <span className="font-serif italic">matcha đích thực</span> từ Uji?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Đặt ngay hôm nay và nhận ưu đãi 15% cho đơn đầu tiên với mã MODTRAFIRST
          </p>
          <Link href="/menu">
            <Button size="lg" variant="secondary">
              Đặt nước Matcha ngay
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
