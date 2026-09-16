import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modtra Brand Colors - Zen Botanical Minimalism
        brand: {
          primary: '#2D5A3A',      // Xanh rêu matcha đậm
          accent: '#5B8A62',       // Xanh búp trà non
        },
        surface: {
          bg: '#F1FDEE',           // Trắng ánh trà xanh
          'bg-alt': '#F7FAF6',     // Trắng dịu mắt alternative
          card: '#FFFFFF',         // Nền thẻ card trắng
          'card-alt': '#ECF7E8',   // Nền thẻ card xanh nhạt
        },
        text: {
          main: '#19201A',         // Chữ than chì tối
          muted: '#5A685D',        // Chữ mô tả phụ
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Newsreader', 'Georgia', 'serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h3': ['1.5rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
      },
      borderRadius: {
        'card': '1rem',           // 16px - cho cards
        'xl': '0.75rem',          // 12px
        '2xl': '1rem',            // 16px
        '3xl': '1.5rem',          // 24px
      },
      boxShadow: {
        'card': '0 1px 3px rgba(45, 90, 58, 0.05), 0 8px 24px rgba(45, 90, 58, 0.08)',
        'card-hover': '0 4px 6px rgba(45, 90, 58, 0.07), 0 12px 32px rgba(45, 90, 58, 0.12)',
        'zen': '0 2px 8px rgba(45, 90, 58, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
