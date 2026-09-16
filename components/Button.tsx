import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: ReactNode
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-full transition-all duration-300 inline-flex items-center justify-center gap-2'
  
  const variantStyles = {
    primary: 'bg-brand-primary text-white hover:bg-opacity-90 shadow-zen hover:shadow-card-hover',
    secondary: 'bg-white text-brand-primary border-2 border-brand-primary hover:bg-brand-primary hover:text-white',
    accent: 'bg-brand-accent text-white hover:bg-opacity-90 shadow-zen',
    outline: 'bg-transparent text-brand-primary border-2 border-surface-card-alt hover:border-brand-accent hover:bg-surface-card-alt',
  }
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  const widthStyles = fullWidth ? 'w-full' : ''
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${widthStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}
