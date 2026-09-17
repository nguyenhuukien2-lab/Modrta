'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface CinematicSectionProps {
  children: ReactNode
  className?: string
  background?: 'white' | 'gradient' | 'pattern' | 'none'
  parallaxSpeed?: number
  fadeIn?: boolean
  delay?: number
}

export default function CinematicSection({
  children,
  className = '',
  background = 'none',
  parallaxSpeed = 0,
  fadeIn = true,
  delay = 0,
}: CinematicSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && fadeIn) {
            setTimeout(() => {
              setIsVisible(true)
            }, delay)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [fadeIn, delay])

  useEffect(() => {
    if (parallaxSpeed === 0) return

    const handleScroll = () => {
      if (!sectionRef.current) return

      const scrolled = window.pageYOffset
      const element = sectionRef.current
      const elementTop = element.offsetTop
      const elementHeight = element.offsetHeight
      const windowHeight = window.innerHeight

      if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
        const yPos = (scrolled - elementTop) * parallaxSpeed
        setOffset(yPos)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [parallaxSpeed])

  const getBackgroundClasses = () => {
    switch (background) {
      case 'white':
        return 'bg-white'
      case 'gradient':
        return 'bg-gradient-to-b from-surface-bg via-white to-surface-bg'
      case 'pattern':
        return 'bg-white relative overflow-hidden'
      default:
        return ''
    }
  }

  const renderBackgroundPattern = () => {
    if (background !== 'pattern') return null

    return (
      <>
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(0deg, #88c9b5 1px, transparent 1px), linear-gradient(90deg, #88c9b5 1px, transparent 1px)',
            backgroundSize: '100px 100px',
          }}
        />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl animate-float pointer-events-none" />
        <div
          className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl animate-float pointer-events-none"
          style={{ animationDelay: '2s' }}
        />
      </>
    )
  }

  return (
    <section
      ref={sectionRef}
      className={`section relative ${getBackgroundClasses()} transition-all duration-1000 ${
        fadeIn ? (isVisible ? 'opacity-100' : 'opacity-0') : 'opacity-100'
      } ${className}`}
      style={{
        transform: parallaxSpeed !== 0 ? `translateY(${offset}px)` : undefined,
      }}
    >
      {renderBackgroundPattern()}
      <div className="container-custom relative z-10">{children}</div>
    </section>
  )
}
