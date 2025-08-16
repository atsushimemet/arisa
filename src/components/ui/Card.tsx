import React, { useState } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  onClick?: () => void
  selected?: boolean
  variant?: 'default' | 'cyber' | 'neon' | 'gaming' | 'glass'
  hoverable?: boolean
  gradient?: boolean
  animated?: boolean
  borderGlow?: 'pink' | 'cyan' | 'purple' | 'green' | 'orange'
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  onClick,
  selected = false,
  variant = 'default',
  hoverable = true,
  gradient = false,
  animated = true,
  borderGlow = 'pink'
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const baseClasses = 'rounded-xl p-6 transition-all duration-300 relative overflow-hidden group'
  
  const variantClasses = {
    default: 'bg-dark-card border border-dark-border backdrop-blur-md',
    cyber: 'cyber-card',
    neon: 'bg-gradient-to-br from-dark-card/90 to-dark-secondary/90 border border-neon-cyan/30 backdrop-blur-md',
    gaming: 'gaming-glass border border-laser-green/30',
    glass: 'bg-white/5 border border-white/10 backdrop-blur-xl'
  }

  const interactiveClasses = onClick ? 'cursor-pointer' : ''
  
  const hoverClasses = hoverable ? {
    default: 'hover:border-glow-primary hover:shadow-gaming hover:scale-[1.02] hover:-translate-y-1',
    cyber: 'hover:shadow-cyber hover:scale-[1.02] hover:-translate-y-2',
    neon: 'hover:border-neon-cyan hover:shadow-neon hover:scale-[1.02] hover:-translate-y-1',
    gaming: 'hover:border-laser-green hover:shadow-gaming hover:scale-[1.02] hover:-translate-y-1',
    glass: 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:-translate-y-1'
  }[variant] : ''
  
  const selectedClasses = selected ? {
    default: 'border-glow-primary glow-border shadow-gaming scale-[1.02] -translate-y-1',
    cyber: 'border-electric-blue shadow-cyber scale-[1.02] -translate-y-2',
    neon: 'border-neon-cyan shadow-neon scale-[1.02] -translate-y-1',
    gaming: 'border-laser-green shadow-gaming scale-[1.02] -translate-y-1',
    glass: 'bg-white/15 border-white/30 scale-[1.02] -translate-y-1'
  }[variant] : ''

  const glowClasses = glow ? {
    pink: 'shadow-gaming animate-pulse-glow',
    cyan: 'shadow-neon shadow-neon-cyan/30 animate-pulse-glow',
    purple: 'shadow-neon shadow-neon-purple/30 animate-pulse-glow',
    green: 'shadow-neon shadow-neon-green/30 animate-pulse-glow',
    orange: 'shadow-neon shadow-neon-orange/30 animate-pulse-glow'
  }[borderGlow] : ''

  const animatedClasses = animated ? 'animate-fade-in' : ''

  const gradientClasses = gradient ? 'bg-gradient-to-br from-dark-card to-dark-secondary' : ''

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
        ${interactiveClasses} 
        ${hoverClasses}
        ${selectedClasses} 
        ${glowClasses} 
        ${animatedClasses}
        ${gradientClasses}
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Particle effect background for gaming variant */}
      {variant === 'gaming' && (
        <div className="absolute inset-0 particle-bg opacity-30" />
      )}

      {/* Shimmer effect overlay */}
      {(variant === 'cyber' || variant === 'neon') && (
        <div className="absolute inset-0 bg-shimmer-overlay bg-200% opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500" />
      )}

      {/* Gradient overlay for enhanced depth */}
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-t from-glow-primary/10 to-transparent rounded-xl" />
      )}

      {/* Glow border animation */}
      {glow && isHovered && (
        <div className="absolute inset-0 rounded-xl animate-glow opacity-50" style={{
          background: `linear-gradient(45deg, transparent, ${
            borderGlow === 'pink' ? '#ff6b9d' :
            borderGlow === 'cyan' ? '#00ffff' :
            borderGlow === 'purple' ? '#8b5cf6' :
            borderGlow === 'green' ? '#39ff14' : '#ff6600'
          }, transparent)`
        }} />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Corner accent for selected state */}
      {selected && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px] border-b-glow-primary opacity-80" />
      )}

      {/* Floating dots decoration for gaming variant */}
      {variant === 'gaming' && isHovered && (
        <>
          <div className="absolute top-4 right-4 w-2 h-2 bg-laser-green rounded-full animate-bounce opacity-80" />
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-neon-orange rounded-full animate-bounce delay-300 opacity-60" />
          <div className="absolute top-8 left-8 w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce delay-150 opacity-70" />
        </>
      )}
    </div>
  )
}