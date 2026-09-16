'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Send, Leaf, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    setIsSubmitted(true)
    setTimeout(() => {
      setEmail('')
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <footer className="bg-gradient-to-b from-white to-surface-bg border-t border-surface-card-alt">
      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-primary">Modtra</h3>
                <p className="text-xs text-text-muted">Matcha & Slow Living</p>
              </div>
            </div>
            
            <p className="text-sm text-text-muted leading-relaxed">
              Thưởng thức tinh hoa <span className="text-zen">Matcha Uji</span> nguyên bản 
              và hạt cà phê <span className="text-zen">Cầu Đất</span> sơ chế mật ong. 
              Không gian Zen giữa lòng phố thị.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface-card-alt flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface-card-alt flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-brand-primary mb-4">Liên kết nhanh</h4>
            <ul className="space-y-3">
              {[
                { label: 'Thực đơn', href: '/menu' },
                { label: 'Matcha Uji', href: '/matcha' },
                { label: 'Cà phê thủ công', href: '/coffee' },
                { label: 'Câu chuyện Modtra', href: '/story' },
                { label: 'Hệ thống quán', href: '/locations' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-brand-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-brand-primary mb-4">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-text-muted">
                <MapPin className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-text-main">Flagship Store</p>
                  <p>128 Vườn Xanh, P. Bến Nghé</p>
                  <p>Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </li>
              <li className="flex gap-3 text-sm text-text-muted">
                <Phone className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <div>
                  <p className="font-medium text-text-main">Hotline</p>
                  <a href="tel:+842839909988" className="hover:text-brand-primary transition-colors">
                    +84 (28) 3990 9988
                  </a>
                </div>
              </li>
              <li className="flex gap-3 text-sm text-text-muted">
                <Mail className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <div>
                  <p className="font-medium text-text-main">Email</p>
                  <a href="mailto:hello@modtra.vn" className="hover:text-brand-primary transition-colors">
                    hello@modtra.vn
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-brand-primary mb-4">
              Bản tin trà theo mùa
            </h4>
            <p className="text-sm text-text-muted mb-4">
              Đăng ký nhận thông tin về món mới, workshop trà đạo và ưu đãi đặc biệt
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn"
                  required
                  className="input pr-12 text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center hover:bg-brand-accent transition-colors duration-200"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              {isSubmitted && (
                <p className="text-sm text-brand-accent animate-fade-in">
                  ✓ Cảm ơn bạn đã đăng ký!
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-card-alt">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
            <p>© 2024 Modtra. Mọi quyền được bảo lưu.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-brand-primary transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="hover:text-brand-primary transition-colors">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
