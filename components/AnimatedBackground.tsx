'use client'

interface AnimatedBackgroundProps {
  variant?: 'orbs' | 'grid' | 'gradient' | 'minimal'
  className?: string
}

export default function AnimatedBackground({ 
  variant = 'orbs',
  className = '' 
}: AnimatedBackgroundProps) {
  
  const renderOrbs = () => (
    <>
      <div className="absolute top-20 right-10 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl animate-float" />
      <div 
        className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-brand-primary/8 rounded-full blur-3xl animate-float" 
        style={{ animationDelay: '3s' }} 
      />
      <div 
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl animate-float" 
        style={{ animationDelay: '1.5s' }} 
      />
    </>
  )

  const renderGrid = () => (
    <div 
      className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: 'radial-gradient(circle, #88c9b5 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }}
    />
  )

  const renderGradient = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-white to-brand-accent/5" />
  )

  const renderPattern = () => (
    <>
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(0deg, #88c9b5 1px, transparent 1px), linear-gradient(90deg, #88c9b5 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}
      />
    </>
  )

  const renderMinimal = () => (
    <>
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl" />
    </>
  )

  const renderVariant = () => {
    switch (variant) {
      case 'orbs':
        return renderOrbs()
      case 'grid':
        return (
          <>
            {renderGradient()}
            {renderGrid()}
          </>
        )
      case 'gradient':
        return renderGradient()
      case 'minimal':
        return renderMinimal()
      default:
        return null
    }
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {renderVariant()}
    </div>
  )
}
