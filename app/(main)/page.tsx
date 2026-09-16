// 🏠 TRANG CHỦ - Homepage
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Leaf, Recycle, Settings, Award, Clock, Shield, Sparkles } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import Button from '@/components/Button'
import { featuredProducts } from '@/data/products'
import { usps, valuePropDetails } from '@/data/usp'
import { Product } from '@/lib/types'

const iconMap = {
  leaf: Leaf,
  recycle: Recycle,
  settings: Settings,
}

export default function Home() {
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  const handleAddToCart = (product: Product) => {
    // Mock add to cart
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative section bg-gradient-to-b from-surface-bg via-white to-surface-bg overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/10 rounded-full text-brand-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Chậm lại một nhịp, thưởng trà mỗi ngày</span>
              </div>
              
              <h1 className="text-hero font-bold leading-tight">
                Thưởng thức tinh hoa{' '}
                <span className="text-zen">Matcha Uji</span> nguyên bản giữa nhịp sống hiện đại
              </h1>
              
              <p className="text-xl text-text-muted leading-relaxed">
                100% Ceremonial Matcha từ Kyoto, nghiền cối đá Granit 30g/giờ,
                kết hợp không gian Zen tĩnh lặng và triết lý <span className="text-zen">Slow Living</span>
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/menu">
                  <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                    Khám phá thực đơn
                  </Button>
                </Link>
                <Link href="/story">
                  <Button variant="secondary" size="lg">
                    Văn hóa trà Uji
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 pt-4">
                {valuePropDetails.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-3xl font-bold text-brand-primary">{stat.value}</p>
                    <p className="text-sm font-medium text-text-main">{stat.title}</p>
                    <p className="text-xs text-text-muted">{stat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-slide-up">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-card-hover">
                <Image
                  src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800"
                  alt="Matcha Latte Modtra"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-card max-w-xs">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-main mb-1">JAS Organic Certified</p>
                    <p className="text-sm text-text-muted">100% không hóa chất & phẩm màu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold mb-4">
              Hành trình mang nghệ thuật trà Uji
              <br />
              thượng hạng vào từng ly chuẩn thủ công
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Modtra cam kết mỗi ly đều là tác phẩm nghệ thuật, từ nguồn gốc búp trà đến kỹ thuật đánh chasen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {usps.map((usp) => {
              const Icon = iconMap[usp.icon as keyof typeof iconMap]
              return (
                <div key={usp.id} className="text-center space-y-4 group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-main">
                    {usp.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed">
                    {usp.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-gradient-to-b from-surface-bg to-white">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-brand-accent font-medium mb-2 uppercase tracking-wide text-sm">
                Món Uống Tâm Điểm
              </p>
              <h2 className="text-h2 font-bold">
                Những ly <span className="text-zen">matcha & coffee</span> được yêu thích nhất
              </h2>
            </div>
            <Link href="/menu" className="hidden md:block">
              <Button variant="outline">
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Mobile View All Button */}
          <div className="mt-8 text-center md:hidden">
            <Link href="/menu">
              <Button variant="outline" fullWidth>
                Xem tất cả món
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Success Toast */}
          {addedToCart && (
            <div className="fixed bottom-8 right-8 bg-brand-primary text-white px-6 py-4 rounded-xl shadow-card-hover animate-slide-up z-50">
              <p className="font-medium">✓ Đã thêm vào giỏ hàng</p>
            </div>
          )}
        </div>
      </section>

      {/* Zen Space Showcase */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600"
                    alt="Không gian Zen Modtra"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600"
                    alt="Matcha ceremony"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600"
                    alt="Interior Modtra"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600"
                    alt="Matcha whisking"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <p className="text-brand-accent font-medium mb-2 uppercase tracking-wide text-sm">
                  Không Gian Zen Wabi-Sabi
                </p>
                <h2 className="text-h2 font-bold mb-4">
                  Giữa lòng phố thị, một góc <span className="text-zen">tĩnh lặng</span> để trở về
                </h2>
                <p className="text-text-muted leading-relaxed">
                  Ánh sáng tự nhiên xuyên qua khung cửa kính, cây xanh tươi mát, 
                  âm thanh thiền định êm dịu. Mỗi góc của Modtra được thiết kế để 
                  bạn có thể chậm lại, thở sâu, và cảm nhận trọn vẹn từng giọt trà.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Clock, title: 'Phòng Trà Đạo Riêng Tư', desc: 'Trải nghiệm nghi thức đánh chasen chuẩn Nhật' },
                  { icon: Leaf, title: 'Sân Vườn Xanh Thiền', desc: 'Không gian outdoor thư thái với cây cối' },
                  { icon: Shield, title: 'Menu Thuần Chay Toàn Phần', desc: '100% plant-based, không sữa động vật' },
                ].map((feature, index) => (
                  <div key={index} className="flex gap-4">
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

              <Link href="/locations">
                <Button variant="accent">
                  Khám phá các chi nhánh
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-gradient-to-br from-brand-primary to-brand-accent text-white relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 left-10 w-48 h-48 border-2 border-white rounded-full" />
        </div>

        <div className="container-custom text-center relative z-10">
          <h2 className="text-h1 font-bold mb-6">
            Sẵn sàng cho một ngày mới tươi mát cùng <span className="font-serif italic">Modtra</span>?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Đặt đồ uống ngay hôm nay và nhận ưu đãi 15% cho đơn hàng đầu tiên
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button size="lg" variant="secondary">
                Đặt nước ngay
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/story">
              <Button size="lg" className="bg-white/10 hover:bg-white/20 border-2 border-white text-white">
                Tìm hiểu thêm
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
