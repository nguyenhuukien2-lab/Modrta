// 🏠 TRANG CHỦ - Homepage
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Leaf, Recycle, Settings, Award, Clock, Shield, Sparkles } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import Button from '@/components/Button'
import ScrollReveal from '@/components/ScrollReveal'
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
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAddToCart = (product: Product) => {
    // Mock add to cart
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Cinematic Parallax */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        {/* Background Layer - Slowest parallax */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0001})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-white to-brand-accent/5" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-brand-primary/8 rounded-full blur-3xl" 
            style={{ animationDelay: '3s' }} 
          />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle, #88c9b5 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        
        <div className="container-custom relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content - Medium parallax */}
            <div 
              className="space-y-8"
              style={{
                transform: `translateY(${scrollY * 0.15}px)`,
                opacity: Math.max(0, 1 - scrollY * 0.002),
              }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-brand-primary text-sm font-medium shadow-zen border border-brand-accent/20 animate-fade-in">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Chậm lại một nhịp, thưởng trà mỗi ngày</span>
              </div>
              
              <div className="text-reveal">
                <h1 className="text-hero font-bold leading-tight">
                  Thưởng thức tinh hoa{' '}
                  <span className="text-zen glow">Matcha Uji</span> nguyên bản giữa nhịp sống hiện đại
                </h1>
              </div>
              
              <p className="text-xl text-text-muted leading-relaxed animate-fade-in-slow backdrop-blur-sm bg-white/50 p-6 rounded-2xl border border-white/60">
                100% Ceremonial Matcha từ Kyoto, nghiền cối đá Granit 30g/giờ,
                kết hợp không gian Zen tĩnh lặng và triết lý <span className="text-zen font-semibold">Slow Living</span>
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 stagger-children">
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
              <div className="flex flex-wrap gap-6 pt-4 stagger-children">
                {valuePropDetails.map((stat, index) => (
                  <div key={index} className="space-y-1 group cursor-default">
                    <p className="text-3xl font-bold text-brand-primary group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                    <p className="text-sm font-medium text-text-main">{stat.title}</p>
                    <p className="text-xs text-text-muted">{stat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image - Fastest parallax with 3D depth */}
            <div 
              className="relative"
              style={{
                transform: `translateY(${scrollY * 0.08}px) scale(${Math.max(0.9, 1 - scrollY * 0.0003)})`,
                opacity: Math.max(0, 1 - scrollY * 0.0015),
              }}
            >
              {/* Background accent circle */}
              <div className="absolute -inset-8 bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 rounded-full blur-2xl animate-pulse" 
                style={{ animationDuration: '4s' }}
              />
              
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl img-hover-zoom border-4 border-white/50">
                <Image
                  src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800"
                  alt="Matcha Latte Modtra"
                  fill
                  className="object-cover camera-zoom"
                  priority
                />
              </div>
              
              {/* Floating Card - Layered on top */}
              <div 
                className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-medium p-6 rounded-2xl shadow-2xl max-w-xs border border-white/60 animate-slide-up"
                style={{
                  transform: `translateY(${scrollY * 0.05}px)`,
                  animationDelay: '0.3s'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-accent/30 to-brand-primary/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
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

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce"
          style={{
            opacity: Math.max(0, 1 - scrollY * 0.01),
          }}
        >
          <div className="w-6 h-10 border-2 border-brand-primary/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-brand-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="section bg-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(0deg, #88c9b5 1px, transparent 1px), linear-gradient(90deg, #88c9b5 1px, transparent 1px)',
            backgroundSize: '100px 100px',
          }}
        />
        
        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-h2 font-bold mb-4">
                Hành trình mang nghệ thuật trà Uji
                <br />
                <span className="text-gradient">thượng hạng vào từng ly chuẩn thủ công</span>
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto text-lg">
                Modtra cam kết mỗi ly đều là tác phẩm nghệ thuật, từ nguồn gốc búp trà đến kỹ thuật đánh chasen
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {usps.map((usp, index) => {
              const Icon = iconMap[usp.icon as keyof typeof iconMap]
              return (
                <ScrollReveal key={usp.id} delay={index * 100}>
                  <div className="text-center space-y-4 group h-full bg-gradient-to-b from-white to-surface-bg/50 p-8 rounded-2xl hover:shadow-card-hover transition-all duration-500 border border-transparent hover:border-brand-accent/20">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-zen">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-main group-hover:text-brand-primary transition-colors">
                      {usp.title}
                    </h3>
                    <p className="text-text-muted leading-relaxed">
                      {usp.description}
                    </p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-gradient-to-b from-surface-bg via-white to-surface-bg relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-brand-accent font-medium mb-2 uppercase tracking-wide text-sm flex items-center gap-2">
                  <span className="w-12 h-0.5 bg-brand-accent rounded-full" />
                  Món Uống Tâm Điểm
                </p>
                <h2 className="text-h2 font-bold">
                  Những ly <span className="text-zen">matcha & coffee</span> được yêu thích nhất
                </h2>
              </div>
              <Link href="/menu" className="hidden md:block">
                <Button variant="outline" className="group">
                  Xem tất cả
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 100}>
                <div className="h-full transform hover:-translate-y-2 transition-transform duration-500">
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              </ScrollReveal>
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
            <div className="fixed bottom-8 right-8 bg-brand-primary text-white px-6 py-4 rounded-xl shadow-2xl animate-slide-up z-50 backdrop-blur-strong border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <p className="font-medium">Đã thêm vào giỏ hàng</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Zen Space Showcase */}
      <section className="section bg-white relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-primary/5 to-transparent" />
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Grid with Layered Depth */}
            <ScrollReveal>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden img-hover-zoom shadow-card group">
                    <Image
                      src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600"
                      alt="Không gian Zen Modtra"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden img-hover-zoom shadow-card group">
                    <Image
                      src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600"
                      alt="Matcha ceremony"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden img-hover-zoom shadow-card group">
                    <Image
                      src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600"
                      alt="Interior Modtra"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden img-hover-zoom shadow-card group">
                    <Image
                      src="https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600"
                      alt="Matcha whisking"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Content */}
            <ScrollReveal delay={200}>
              <div className="space-y-6">
                <div>
                  <p className="text-brand-accent font-medium mb-2 uppercase tracking-wide text-sm flex items-center gap-2">
                    <Leaf className="w-4 h-4" />
                    Không Gian Zen Wabi-Sabi
                  </p>
                  <h2 className="text-h2 font-bold mb-4">
                    Giữa lòng phố thị, một góc <span className="text-zen">tĩnh lặng</span> để trở về
                  </h2>
                  <p className="text-text-muted leading-relaxed text-lg">
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
                    <div key={index} className="flex gap-4 group hover:translate-x-2 transition-transform duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-accent/20 to-brand-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-zen">
                        <feature.icon className="w-6 h-6 text-brand-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-main mb-1 group-hover:text-brand-primary transition-colors">{feature.title}</p>
                        <p className="text-sm text-text-muted">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/locations">
                  <Button variant="accent" className="group">
                    Khám phá các chi nhánh
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-gradient-to-br from-brand-primary via-brand-primary to-brand-accent text-white relative overflow-hidden">
        {/* Animated decorative patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 border-2 border-white rounded-full animate-float" />
          <div className="absolute bottom-10 left-10 w-48 h-48 border-2 border-white rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/30 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

        <ScrollReveal>
          <div className="container-custom text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-medium rounded-full text-white text-sm font-medium border border-white/30 mb-4">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Ưu đãi đặc biệt cho thành viên mới
              </div>
              
              <h2 className="text-h1 font-bold leading-tight">
                Sẵn sàng cho một ngày mới tươi mát cùng{' '}
                <span className="font-serif italic inline-block animate-pulse">Modtra</span>?
              </h2>
              
              <p className="text-xl leading-relaxed max-w-2xl mx-auto opacity-95">
                Đặt đồ uống ngay hôm nay và nhận ưu đãi <span className="font-bold text-2xl">15%</span> cho đơn hàng đầu tiên
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/menu">
                  <Button size="lg" variant="secondary" className="group shadow-2xl">
                    Đặt nước ngay
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/story">
                  <Button size="lg" className="bg-white/10 hover:bg-white/20 border-2 border-white text-white backdrop-blur-medium group">
                    Tìm hiểu thêm
                    <Leaf className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center gap-8 pt-8 opacity-80">
                {[
                  { value: '50K+', label: 'Khách hàng hài lòng' },
                  { value: '4.9/5', label: 'Đánh giá trung bình' },
                  { value: '10+', label: 'Chi nhánh toàn quốc' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm opacity-80">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
