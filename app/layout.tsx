// 🏗️ ROOT LAYOUT - chỉ setup HTML, fonts, CSS (KHÔNG có Header/Footer)
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'
import '@/app/globals.css'
import { AuthProvider } from '@/lib/context/AuthContext'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Modtra - Matcha & Slow Living',
  description: 'Thưởng thức tinh hoa Matcha Uji nguyên bản giữa nhịp sống hiện đại.',
  keywords: ['matcha', 'matcha uji', 'trà xanh', 'cà phê', 'slow living', 'zen', 'modtra'],
  openGraph: {
    title: 'Modtra - Matcha & Slow Living',
    description: 'Thưởng thức tinh hoa Matcha Uji nguyên bản',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${jakarta.variable} ${playfair.variable}`}>
      <body className="flex flex-col min-h-screen bg-surface-bg">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
