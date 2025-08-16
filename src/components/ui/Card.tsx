import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  onClick?: () => void
  selected?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  onClick,
  selected = false
}) => {
  const baseClasses = 'bg-dark-secondary border border-gray-700 rounded-lg p-6 transition-all duration-300'
  const interactiveClasses = onClick ? 'cursor-pointer hover:border-glow-primary hover:shadow-lg' : ''
  const selectedClasses = selected ? 'border-glow-primary glow-border' : ''
  const glowClasses = glow ? 'glow-bg' : ''
  
  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${selectedClasses} ${glowClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}