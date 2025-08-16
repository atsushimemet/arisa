import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  glow = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-glow-primary focus:ring-opacity-50'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-glow-primary to-glow-secondary text-white hover:from-glow-secondary hover:to-glow-primary',
    secondary: 'bg-dark-accent text-white hover:bg-dark-secondary border border-gray-600',
    outline: 'border-2 border-glow-primary text-glow-primary hover:bg-glow-primary hover:text-white'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const glowClasses = glow ? 'animate-pulse-glow hover-glow' : ''
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${glowClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}