// ☕ TRANG CÀ PHÊ THỦ CÔNG - Coffee Page
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Coffee, Mountain, Droplets, Thermometer, Clock, Award, ArrowRight, Leaf, Recycle } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import Button from '@/components/Button'
import { useCartStore } from '@/lib/store/cartStore'
import { useProducts, Product } from '@/lib/hooks/useProducts'

export default function CoffeePage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'newest' | 'rating'>('popularity')
  
  const { addItem } = useCartStore()

  // Fetch coffee products from API
  const { products: allProducts, loading } = useProducts({
    category: 'coffee',
    limit: 100,
    sort: sortBy,
  })

  const filters = [
    { id: 'all', label: 'Tất cả', count: allProducts.length },
    { id: 'cold-brew', label: 'Cold Brew Ủ Chậm', count: allProducts.filter(p => p.tags?.includes('Cold Brew')).length },
    { id: 'fusion', label: 'Cà phê Kết Hợp Matcha', count: allProducts.filter(p => p.tags?.includes('Fusion')).length },
    { id: 'traditional', label: 'Pha Phin & Espresso', count: allProducts.filter(p => p.tags?.includes('Traditional')).length },
  ]

  const filteredProducts = selectedFilter === 'all' 
    ? allProducts
    : selectedFilter === 'cold-brew'
    ? allProducts.filter(p => p.tags?.includes('Cold Brew'))
    : selectedFilter === 'fusion'
    ? allProducts.filter(p => p.tags?.includes('Fusion'))
    : allProducts.filter(p => p.tags?.includes('Traditional'))

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
      <section className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
                <Coffee className="w-4 h-4" />
                <span>100% Arabica Cầu Đất 1.600m</span>
              </div>
              
              <h1 className="text-h1 font-bold leading-tight">
                Cà phê thủ công & Cold Brew — <span className="font-serif italic">Tinh tông trong từng giọt chiết xuất</span>
              </h1>
              
              <p className="text-lg leading-relaxed opacity-90">
                Hạt Arabica Cầu Đất (1.600m) sơ chế mật ong (Honey Process), 
                rang mộc Medium Roast giữ hương hoa và vị ngọt thanh. 
                Cold Brew ủ lạnh 16 giờ giảm 65% acid, thân thiện dạ dày.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="space-y-1">
                  <p className="text-3xl font-bold">1.600m</p>
                  <p className="text-sm opacity-90">Cao độ Cầu Đất</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">16h</p>
                  <p className="text-sm opacity-90">Ủ lạnh Cold Brew</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">-65%</p>
                  <p className="text-sm opacity-90">Giảm độ acid</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/menu">
                  <Button variant="secondary" size="lg">
                    Khám phá Cold Brew
                  </Button>
                </Link>
                <a href="#process">
                  <Button size="lg" className="bg-white/10 hover:bg-white/20 border-2 border-white text-white">
                    Quy trình ủ 16 giờ
                  </Button>
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800"
                  alt="Cold Brew Coffee"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white text-amber-900 p-6 rounded-2xl shadow-card-hover max-w-xs">
                <div className="flex items-start gap-4">
                  <Mountain className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <p className="font-bold mb-1">Honey Process</p>
                    <p className="text-sm text-text-muted">Sơ chế mật ong ngọt thanh</p>
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
              Từ Cao Nguyên Cầu Đất
            </p>
            <h2 className="text-h2 font-bold mb-4">
              Hạt cà phê Arabica <span className="text-zen">đặc sản</span> vùng núi 1.600m
            </h2>
            <p className="text-text-muted leading-relaxed">
              Cầu Đất (Lâm Đồng) nổi tiếng với cà phê Arabica hảo hạng. 
              Khí hậu mát mẻ, độ cao lý tưởng và đất đỏ bazan tạo nên hạt cà phê 
              có hương thơm phức tạp, vị chua nhẹ của trái cây và ngọt thanh tự nhiên.
            </p>
          </div>

          {/* Coffee Farm Images */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600"
                alt="Coffee farm"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600"
                alt="Coffee beans"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600"
                alt="Coffee processing"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Mountain, title: 'Cao độ 1.600m', desc: 'Nhiệt độ mát mẻ, hạt chín chậm' },
              { icon: Leaf, title: 'Honey Process', desc: 'Sơ chế mật ong giữ vị ngọt' },
              { icon: Coffee, title: 'Medium Roast', desc: 'Rang mộc giữ hương hoa' },
              { icon: Award, title: 'Specialty Coffee', desc: 'Điểm SCA 85+' },
            ].map((feature, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto">
                  <feature.icon className="w-7 h-7 text-amber-800" />
                </div>
                <div>
                  <p className="font-semibold text-text-main mb-1">{feature.title}</p>
                  <p className="text-sm text-text-muted">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter & Products */}
      <section className="section bg-surface-bg">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-h2 font-bold mb-3">Thực Đơn Cà Phê Mộc</h2>
            <p className="text-text-muted">Từ truyền thống phin đến sáng tạo Cold Brew</p>
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
                      ? 'bg-amber-800 text-white shadow-card'
                      : 'bg-white text-text-main hover:bg-amber-50 hover:text-amber-800 border border-surface-card-alt'
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

      {/* Cold Brew Process */}
      <section id="process" className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-brand-accent font-medium mb-3 uppercase tracking-wide text-sm">
              Nghệ Thuật Ủ Lạnh 16 Tiếng
            </p>
            <h2 className="text-h2 font-bold mb-4">
              Quy trình Cold Brew — Khi thời gian <span className="text-zen">chiết xuất tinh tuý</span>
            </h2>
            <p className="text-text-muted leading-relaxed">
              Cold Brew không chỉ là đổ nước lạnh vào cà phê. Đây là nghệ thuật ủ chậm, 
              chiết xuất từng hương vị ngọt ngào mà bỏ qua những nốt đắng và acid khó chịu.
            </p>
          </div>

          {/* Infographic Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: Coffee,
                title: 'Xay Mộc Thô',
                desc: 'Độ xay coarse giúp nước thấm đều, không bị trích xuất quá mức',
                temp: 'Coarse Grind'
              },
              {
                step: '02',
                icon: Thermometer,
                title: 'Nước Mềm 4°C',
                desc: 'Nước lạnh tinh khiết, độ cứng thấp để chiết xuất ngọt thanh',
                temp: '4°C'
              },
              {
                step: '03',
                icon: Clock,
                title: '16 Giờ Ngủ Đông',
                desc: 'Ủ trong tủ lạnh 16h, từ từ hòa tan caffeine và hương thơm',
                temp: '16 Hours'
              },
              {
                step: '04',
                icon: Droplets,
                title: 'Lọc Kép Lụa Trắng',
                desc: 'Lọc 2 lần loại bỏ bã mịn, giữ lại hương vị nguyên bản',
                temp: 'Double Filter'
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="card text-center hover:shadow-card-hover transition-all">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-800 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8 text-amber-800" />
                  </div>
                  <p className="text-xs text-brand-accent font-semibold mb-2 uppercase tracking-wide">
                    {item.temp}
                  </p>
                  <h3 className="font-semibold text-lg text-text-main mb-2">{item.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-amber-800 to-transparent" />
                )}
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="mt-12 bg-gradient-to-r from-amber-50 to-surface-bg rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold text-amber-800 mb-2">-65%</p>
                <p className="text-sm font-medium text-text-main mb-1">Giảm Độ Acid</p>
                <p className="text-xs text-text-muted">Thân thiện với dạ dày nhạy cảm</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-amber-800 mb-2">100%</p>
                <p className="text-sm font-medium text-text-main mb-1">Hương Vị Nguyên Bản</p>
                <p className="text-xs text-text-muted">Không đắng, không gắt, chỉ ngọt thanh</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-amber-800 mb-2">3-4x</p>
                <p className="text-sm font-medium text-text-main mb-1">Caffeine Cao Hơn</p>
                <p className="text-xs text-text-muted">Tỉnh táo lâu hơn, êm ái hơn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="section bg-surface-bg">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800"
                alt="Coffee plantation"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-brand-accent font-medium mb-3 uppercase tracking-wide text-sm">
                  Trách Nhiệm Xanh
                </p>
                <h2 className="text-h2 font-bold mb-4">
                  Chính sách <span className="text-zen">thu hồi chai</span> & tích điểm xanh
                </h2>
                <p className="text-text-muted leading-relaxed mb-6">
                  Mỗi chai thủy tinh Cold Brew 500ml khi trả lại sẽ được tích 5.000đ vào tài khoản. 
                  Modtra cam kết giảm thiểu rác thải nhựa và xây dựng cộng đồng yêu môi trường.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Recycle, title: 'Thu Hồi Chai Thủy Tinh', desc: 'Trả chai được tích 5.000đ mỗi chai 500ml' },
                  { icon: Leaf, title: 'Túi Giữ Nhiệt Tái Chế', desc: 'Giao hàng bằng túi vải cách nhiệt tái sử dụng' },
                  { icon: Award, title: 'Giao Nhanh 45 Phút', desc: 'Trung tâm TP.HCM, đảm bảo Cold Brew vẫn lạnh' },
                ].map((feature, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-main mb-1">{feature.title}</p>
                      <p className="text-sm text-text-muted">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-amber-900 to-amber-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-h2 font-bold mb-4">
            Thử ngay Cold Brew <span className="font-serif italic">ủ chậm 16 giờ</span> hôm nay!
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Đặt hàng ngay và nhận ưu đãi 15% cho đơn đầu tiên với mã MODTRAFIRST
          </p>
          <Link href="/menu">
            <Button size="lg" variant="secondary">
              Đặt Cold Brew ngay
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

