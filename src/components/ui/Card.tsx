import React, { useState } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  hoverable?: boolean
  animated?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  selected = false,
  variant = 'default',
  hoverable = true,
  animated = true,
  padding = 'lg'
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const baseClasses = 'rounded-ios-lg transition-all duration-300 relative overflow-hidden'
  
  const variantClasses = {
    default: 'bg-white border border-ios-gray-200 shadow-ios',
    elevated: 'bg-white shadow-ios-lg',
    outlined: 'bg-white border-2 border-ios-gray-300 shadow-ios-sm',
    glass: 'bg-white/90 backdrop-blur-xl border border-white/20 shadow-ios'
  }

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  }

  const interactiveClasses = onClick ? 'cursor-pointer' : ''
  
  const hoverClasses = hoverable ? {
    default: 'hover:shadow-ios-xl hover:scale-[1.02] hover:-translate-y-1',
    elevated: 'hover:shadow-ios-xl hover:scale-[1.02] hover:-translate-y-2',
    outlined: 'hover:border-ios-blue hover:shadow-ios-lg hover:scale-[1.02] hover:-translate-y-1',
    glass: 'hover:bg-white/95 hover:border-white/30 hover:scale-[1.02] hover:-translate-y-1'
  }[variant] : ''
  
  const selectedClasses = selected ? {
    default: 'border-ios-blue shadow-ios-xl scale-[1.02] -translate-y-1',
    elevated: 'shadow-ios-xl scale-[1.02] -translate-y-2 ring-2 ring-ios-blue ring-opacity-30',
    outlined: 'border-ios-blue shadow-ios-lg scale-[1.02] -translate-y-1',
    glass: 'bg-white/95 border-white/40 scale-[1.02] -translate-y-1 ring-2 ring-ios-blue ring-opacity-20'
  }[variant] : ''

  const animatedClasses = animated ? 'ios-fade-in' : ''

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${paddingClasses[padding]}
        ${interactiveClasses} 
        ${hoverClasses}
        ${selectedClasses} 
        ${animatedClasses}
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-ios-blue rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* iOS-style subtle hover indicator */}
      {variant === 'glass' && isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-ios-blue/5 to-transparent rounded-ios-lg" />
      )}
    </div>
  )
}