'use client'

import Image from 'next/image'
import { useState } from 'react'

interface CinematicImageProps {
  src: string
  alt: string
  aspectRatio?: 'square' | '4/3' | '16/9' | '3/4'
  overlay?: boolean
  zoom?: boolean
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  shadow?: boolean
  className?: string
}

export default function CinematicImage({
  src,
  alt,
  aspectRatio = 'square',
  overlay = true,
  zoom = true,
  rounded = '2xl',
  shadow = true,
  className = '',
}: CinematicImageProps) {
  const [isHovered, setIsHovered] = useState(false)

  const aspectRatioClasses = {
    square: 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    '3/4': 'aspect-[3/4]',
  }

  const roundedClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    '2xl': 'rounded-[2rem]',
    '3xl': 'rounded-[3rem]',
  }

  return (
    <div
      className={`relative ${aspectRatioClasses[aspectRatio]} ${roundedClasses[rounded]} overflow-hidden ${
        shadow ? 'shadow-card hover:shadow-card-hover' : ''
      } transition-all duration-500 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-transform duration-700 ${
          zoom && isHovered ? 'scale-110' : 'scale-100'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
        }}
      />
      
      {overlay && (
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Shimmer effect on hover */}
      {isHovered && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"
          style={{
            animation: 'shimmer 1.5s ease-in-out',
          }}
        />
      )}
    </div>
  )
}
