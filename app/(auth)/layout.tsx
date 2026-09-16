// 🔐 AUTH LAYOUT - Shopee style (không Header, không Footer)
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-primary">
      {children}
    </div>
  )
}
