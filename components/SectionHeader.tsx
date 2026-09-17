'use client'

import { ReactNode } from 'react'
import ScrollReveal from './ScrollReveal'

interface SectionHeaderProps {
  label?: string
  title: string | ReactNode
  description?: string
  align?: 'left' | 'center' | 'right'
  className?: string
  icon?: ReactNode
}

export default function SectionHeader({
  label,
  title,
  description,
  align = 'center',
  className = '',
  icon,
}: SectionHeaderProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const containerClasses = {
    left: '',
    center: 'mx-auto',
    right: 'ml-auto',
  }

  return (
    <ScrollReveal>
      <div className={`max-w-3xl mb-12 md:mb-16 ${alignmentClasses[align]} ${containerClasses[align]} ${className}`}>
        {label && (
          <div className={`inline-flex items-center gap-2 mb-4 ${align === 'center' ? 'justify-center' : ''}`}>
            <span className="w-12 h-0.5 bg-brand-accent rounded-full" />
            <p className="text-brand-accent font-medium uppercase tracking-wide text-sm flex items-center gap-2">
              {icon}
              {label}
            </p>
            <span className="w-12 h-0.5 bg-brand-accent rounded-full" />
          </div>
        )}
        
        <h2 className="text-h2 font-bold mb-4 leading-tight">
          {title}
        </h2>
        
        {description && (
          <p className="text-text-muted text-lg leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </ScrollReveal>
  )
}
