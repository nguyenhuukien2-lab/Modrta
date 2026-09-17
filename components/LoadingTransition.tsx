'use client'

import { useEffect, useState } from 'react'
import { Leaf } from 'lucide-react'

interface LoadingTransitionProps {
  isLoading: boolean
  message?: string
}

export default function LoadingTransition({ 
  isLoading, 
  message = 'Đang tải...' 
}: LoadingTransitionProps) {
  const [show, setShow] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      setShow(true)
    } else {
      const timer = setTimeout(() => setShow(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center space-y-4">
        {/* Animated logo */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center animate-pulse mx-auto">
            <Leaf className="w-8 h-8 text-white animate-float" strokeWidth={2.5} />
          </div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 w-16 h-16 mx-auto">
            <div className="absolute inset-0 bg-brand-accent/20 rounded-full animate-ping" />
            <div 
              className="absolute inset-0 bg-brand-primary/20 rounded-full animate-ping" 
              style={{ animationDelay: '0.5s' }}
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <p className="text-brand-primary font-bold text-lg">{message}</p>
          
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce" />
            <div 
              className="w-2 h-2 bg-brand-accent rounded-full animate-bounce" 
              style={{ animationDelay: '0.2s' }}
            />
            <div 
              className="w-2 h-2 bg-brand-accent rounded-full animate-bounce" 
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
