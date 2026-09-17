'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div
      className={`transition-all duration-700 ${
        isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
      }}
    >
      {children}
    </div>
  )
}
