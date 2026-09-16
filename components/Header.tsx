'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Globe, Menu, X, Leaf, LogIn, UserPlus, LayoutDashboard, LogOut, ChevronDown, Zap } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/lib/context/AuthContext'

export default function Header() {
  const router = useRouter()
  const { user, logout, loading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState<'VN' | 'EN'>('VN')
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
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
    { label: 'Matcha',        href: '/matcha',     labelEn: 'Matcha' },
    { label: 'Cà phê',        href: '/coffee',     labelEn: 'Coffee' },
    { label: 'Về Modtra',     href: '/story',      labelEn: 'Story' },
    { label: 'Liên hệ & Quán',href: '/locations',  labelEn: 'Locations' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-card-alt shadow-zen">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center shadow-zen group-hover:scale-105 transition-transform">
              <Leaf className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <p className="text-base font-bold text-brand-primary leading-tight">Modtra</p>
              <p className="text-[10px] text-text-muted leading-none">Matcha & Slow Living</p>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-text-main hover:text-brand-primary transition-colors relative group whitespace-nowrap"
              >
                {language === 'VN' ? item.label : item.labelEn}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-brand-accent group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1.5 xl:gap-2 flex-shrink-0">

            {/* Language */}
            <button
              onClick={() => setLanguage(language === 'VN' ? 'EN' : 'VN')}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-surface-card-alt hover:border-brand-accent transition-colors text-sm font-medium text-text-main"
            >
              <Globe className="w-3.5 h-3.5 text-brand-primary" />
              {language}
            </button>

            {/* Cart */}
            <Link
              href="/menu"
              className="relative p-2 hover:bg-surface-card-alt rounded-full transition-colors"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5 text-brand-primary" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] bg-brand-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* ── Auth: chưa đăng nhập ── */}
            {!user ? (
              <div className="hidden md:flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 border-brand-primary text-brand-primary text-xs font-bold hover:bg-brand-primary hover:text-white transition-all duration-200 whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-brand-accent text-white text-xs font-bold hover:bg-opacity-90 transition-all shadow-zen whitespace-nowrap"
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
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-surface-card-alt hover:border-brand-accent transition-colors"
                >
                  <div className="w-6 h-6 bg-brand-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">{getInitials()}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-surface-card-alt overflow-hidden z-50 animate-fade-in">
                    <div className="px-4 py-3 bg-surface-bg border-b border-surface-card-alt">
                      <p className="font-semibold text-sm text-text-main">{user.name}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </div>
                    <div className="py-1.5">
                      {[
                        { href: '/account', icon: LayoutDashboard, label: 'Quản lý tài khoản' },
                        { href: '/order-history', icon: ShoppingCart, label: 'Đơn hàng của tôi' },
                        { href: '/loyalty', icon: Zap, label: 'Chương trình Thành viên' },
                      ].map(item => (
                        <Link key={item.label} href={item.href}
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-bg transition-colors text-sm text-text-main">
                          <item.icon className="w-4 h-4 text-brand-accent" />
                          {item.label}
                        </Link>
                      ))}
                      <hr className="my-1 border-surface-card-alt" />
                      <button 
                        onClick={handleLogout}
                        disabled={loading}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-sm text-red-500 disabled:opacity-50">
                        <LogOut className="w-4 h-4" />
                        {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CTA chính — chỉ hiện ở xl+ */}
            <Link
              href="/menu"
              className="hidden xl:flex items-center gap-1.5 btn-primary text-sm py-2 px-4 whitespace-nowrap"
            >
              Đặt nước ngay
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-surface-card-alt rounded-lg transition-colors"
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
          <div className="lg:hidden py-5 border-t border-surface-card-alt animate-fade-in">
            <nav className="flex flex-col gap-1 mb-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-text-main hover:text-brand-primary hover:bg-surface-bg px-3 py-2.5 rounded-xl transition-colors"
                >
                  {language === 'VN' ? item.label : item.labelEn}
                </Link>
              ))}
            </nav>

            <div className="flex gap-2 px-1">
              {!user ? (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-brand-primary text-brand-primary rounded-xl font-bold text-sm hover:bg-brand-primary hover:text-white transition-all">
                    <LogIn className="w-4 h-4" /> Đăng nhập
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-accent text-white rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all">
                    <UserPlus className="w-4 h-4" /> Đăng ký
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/account" onClick={() => setIsMenuOpen(false)}
                    className="flex-1 btn-primary text-center text-sm">
                    Quản lý tài khoản
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-50">
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </>
              )}
              <Link href="/menu" onClick={() => setIsMenuOpen(false)}
                className="flex-1 btn-primary text-center text-sm">
                Đặt nước ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
