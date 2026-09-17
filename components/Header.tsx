'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Globe, Menu, X, Leaf, LogIn, UserPlus, LayoutDashboard, LogOut, ChevronDown, Zap } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/lib/context/AuthContext'
import Cart from '@/components/Cart'

export default function Header() {
  const router = useRouter()
  const { user, logout, loading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState<'VN' | 'EN'>('VN')
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const totalItems = useCartStore(state => state.totalItems())

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll effect for header transformation
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.pageYOffset
      const maxScroll = 300
      
      setScrolled(offset > 20)
      setScrollProgress(Math.min(offset / maxScroll, 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsUserDropdownOpen(false)
    router.push('/')
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return 'U'
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const navItems = [
    { label: 'Trang chủ',     href: '/',          labelEn: 'Home' },
    { label: 'Thực đơn',      href: '/menu',       labelEn: 'Menu' },
    { label: 'Về Modtra',     href: '/story',      labelEn: 'Story' },
    { label: 'Liên hệ & Quán',href: '/locations',  labelEn: 'Locations' },
  ]

  return (
    <>
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-strong shadow-2xl' 
          : 'bg-white/95 backdrop-blur-md shadow-zen'
      }`}
      style={{
        borderBottom: scrolled ? '1px solid rgba(136, 201, 181, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Scroll progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300"
        style={{ 
          width: `${scrollProgress * 100}%`,
          opacity: scrolled ? 1 : 0,
        }}
      />

      <div className="container-custom">
        <div 
          className={`flex items-center justify-between gap-4 transition-all duration-500 ${
            scrolled ? 'h-14' : 'h-16'
          }`}
        >

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div 
              className={`bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center shadow-zen group-hover:scale-105 transition-all duration-500 ${
                scrolled ? 'w-8 h-8' : 'w-9 h-9'
              }`}
            >
              <Leaf className={`text-white transition-all duration-500 ${
                scrolled ? 'w-4 h-4' : 'w-[18px] h-[18px]'
              }`} strokeWidth={2.5} />
            </div>
            <div className={`hidden sm:block transition-all duration-500 ${
              scrolled ? 'scale-95' : 'scale-100'
            }`}>
              <p className="text-base font-bold text-brand-primary leading-tight">Modtra</p>
              <p className={`text-[10px] text-text-muted leading-none transition-opacity duration-500 ${
                scrolled ? 'opacity-0 h-0' : 'opacity-100'
              }`}>Matcha & Slow Living</p>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium text-text-main hover:text-brand-primary transition-all duration-300 relative group whitespace-nowrap ${
                  scrolled ? 'py-1' : 'py-2'
                }`}
              >
                {language === 'VN' ? item.label : item.labelEn}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent group-hover:w-full transition-all duration-500 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1.5 xl:gap-2 flex-shrink-0">

            {/* Language */}
            <button
              onClick={() => setLanguage(language === 'VN' ? 'EN' : 'VN')}
              className={`hidden md:flex items-center gap-1 px-2.5 rounded-full border transition-all duration-300 text-sm font-medium text-text-main ${
                scrolled 
                  ? 'py-1 border-brand-accent/30 hover:border-brand-accent hover:bg-brand-accent/5' 
                  : 'py-1.5 border-surface-card-alt hover:border-brand-accent'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-brand-primary" />
              {language}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-surface-card-alt rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5 text-brand-primary" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] min-h-[18px] bg-gradient-to-br from-brand-accent to-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1 shadow-zen animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* ── Auth: chưa đăng nhập ── */}
            {!user ? (
              <div className="hidden md:flex items-center gap-1.5">
                <Link
                  href="/login"
                  className={`flex items-center gap-1.5 px-3.5 rounded-full border-2 border-brand-primary text-brand-primary text-xs font-bold hover:bg-brand-primary hover:text-white transition-all duration-300 whitespace-nowrap hover:scale-105 hover:shadow-zen ${
                    scrolled ? 'py-1.5' : 'py-2'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className={`flex items-center gap-1.5 px-3.5 rounded-full bg-gradient-to-r from-brand-accent to-brand-primary text-white text-xs font-bold hover:opacity-90 transition-all duration-300 shadow-zen whitespace-nowrap hover:scale-105 hover:shadow-card-hover ${
                    scrolled ? 'py-1.5' : 'py-2'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Đăng ký
                </Link>
              </div>
            ) : (
              /* ── Auth: đã đăng nhập — avatar dropdown ── */
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center gap-2 px-2.5 rounded-full border transition-all duration-300 hover:border-brand-accent hover:shadow-zen ${
                    scrolled 
                      ? 'py-1 border-brand-accent/30' 
                      : 'py-1.5 border-surface-card-alt'
                  }`}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-brand-accent to-brand-primary rounded-full flex items-center justify-center shadow-zen">
                    <span className="text-white text-[10px] font-bold">{getInitials()}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-strong rounded-2xl shadow-2xl border border-brand-accent/20 overflow-hidden z-50 animate-scale-in">
                    <div className="px-4 py-3 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 border-b border-brand-accent/20">
                      <p className="font-semibold text-sm text-text-main">{user.name}</p>
                      <p className="text-xs text-text-muted truncate">{user.email}</p>
                    </div>
                    <div className="py-1.5">
                      {[
                        { href: '/account', icon: LayoutDashboard, label: 'Quản lý tài khoản' },
                        { href: '/order-history', icon: ShoppingCart, label: 'Đơn hàng của tôi' },
                        { href: '/loyalty', icon: Zap, label: 'Chương trình Thành viên' },
                      ].map(item => (
                        <Link key={item.label} href={item.href}
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-primary/5 transition-all duration-200 text-sm text-text-main group">
                          <item.icon className="w-4 h-4 text-brand-accent group-hover:scale-110 transition-transform" />
                          <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                        </Link>
                      ))}
                      <hr className="my-1 border-brand-accent/10" />
                      <button 
                        onClick={handleLogout}
                        disabled={loading}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-all duration-200 text-sm text-red-500 disabled:opacity-50 group">
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:translate-x-1 transition-transform">{loading ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CTA chính — chỉ hiện ở xl+ */}
            <Link
              href="/menu"
              className={`hidden xl:flex items-center gap-1.5 btn-primary text-sm px-4 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-card-hover ${
                scrolled ? 'py-1.5' : 'py-2'
              }`}
            >
              Đặt nước ngay
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-surface-card-alt rounded-lg transition-all duration-300 hover:scale-110"
              aria-label="Toggle menu"
            >
              {isMenuOpen
                ? <X className="w-5 h-5 text-brand-primary" />
                : <Menu className="w-5 h-5 text-brand-primary" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {isMenuOpen && (
          <div className="lg:hidden py-5 border-t border-brand-accent/20 animate-slide-down backdrop-blur-strong bg-white/50">
            <nav className="flex flex-col gap-1 mb-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-text-main hover:text-brand-primary hover:bg-brand-primary/5 px-3 py-2.5 rounded-xl transition-all duration-300 hover:translate-x-1"
                >
                  {language === 'VN' ? item.label : item.labelEn}
                </Link>
              ))}
            </nav>

            <div className="flex gap-2 px-1">
              {!user ? (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-brand-primary text-brand-primary rounded-xl font-bold text-sm hover:bg-brand-primary hover:text-white transition-all duration-300">
                    <LogIn className="w-4 h-4" /> Đăng nhập
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-brand-accent to-brand-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all duration-300 shadow-zen">
                    <UserPlus className="w-4 h-4" /> Đăng ký
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/account" onClick={() => setIsMenuOpen(false)}
                    className="flex-1 btn-primary text-center text-sm hover:scale-105 transition-transform">
                    Quản lý tài khoản
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all duration-300 disabled:opacity-50 hover:scale-105">
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </>
              )}
              <Link href="/menu" onClick={() => setIsMenuOpen(false)}
                className="flex-1 btn-primary text-center text-sm hover:scale-105 transition-transform">
                Đặt nước ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>

    {/* ── Cart Drawer ── */}
    {/* Overlay */}
    {isCartOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />
    )}

    {/* Drawer panel */}
    <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white/95 backdrop-blur-strong z-50 shadow-2xl transition-all duration-500 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Drawer header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 border-b border-brand-accent/20 flex-shrink-0 backdrop-blur-medium">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-text-main text-lg">Giỏ hàng</span>
            {totalItems > 0 && (
              <span className="ml-2 bg-gradient-to-r from-brand-accent to-brand-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalItems} món</span>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsCartOpen(false)}
          className="p-2 hover:bg-white/50 rounded-full transition-all duration-300 hover:rotate-90"
        >
          <X className="w-5 h-5 text-text-muted" />
        </button>
      </div>

      {/* Cart content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Cart onClose={() => setIsCartOpen(false)} />
      </div>
    </div>
    </>
  )
}
