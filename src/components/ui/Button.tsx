import React, { useState } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'cyber' | 'neon' | 'gaming'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: boolean
  ripple?: boolean
  loading?: boolean
  children: React.ReactNode
  glowColor?: 'pink' | 'cyan' | 'purple' | 'green' | 'orange'
  icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  glow = false,
  ripple = true,
  loading = false,
  className = '',
  children,
  glowColor = 'pink',
  icon,
  onClick,
  disabled,
  ...props
}) => {
  const [isRippling, setIsRippling] = useState(false)
  const [rippleCoords, setRippleCoords] = useState({ x: 0, y: 0 })

  const baseClasses = 'relative font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-glow-primary focus:ring-opacity-50 overflow-hidden transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-glow-primary to-glow-secondary text-white hover:from-glow-secondary hover:to-glow-primary shadow-gaming hover:shadow-neon',
    secondary: 'bg-dark-card text-white hover:bg-dark-accent border border-dark-border hover:border-glow-primary backdrop-blur-md',
    outline: 'border-2 border-glow-primary text-glow-primary hover:bg-glow-primary hover:text-white hover:shadow-neon bg-transparent backdrop-blur-md',
    cyber: 'bg-gradient-to-r from-electric-blue to-cyber-purple text-white hover:from-cyber-purple hover:to-electric-blue shadow-cyber hover:shadow-neon-lg',
    neon: 'bg-gradient-to-r from-neon-cyan to-neon-purple text-black hover:from-neon-purple hover:to-neon-cyan shadow-neon hover:shadow-neon-lg font-bold',
    gaming: 'bg-gradient-to-r from-laser-green to-neon-orange text-black hover:from-neon-orange hover:to-laser-green shadow-gaming hover:shadow-neon-lg font-bold'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[32px]',
    md: 'px-6 py-3 text-base min-h-[40px]',
    lg: 'px-8 py-4 text-lg min-h-[48px]',
    xl: 'px-12 py-6 text-xl min-h-[56px]'
  }

  const glowColorClasses = {
    pink: 'hover:shadow-neon-lg hover:shadow-glow-primary/50',
    cyan: 'hover:shadow-neon-lg hover:shadow-neon-cyan/50',
    purple: 'hover:shadow-neon-lg hover:shadow-neon-purple/50',
    green: 'hover:shadow-neon-lg hover:shadow-neon-green/50',
    orange: 'hover:shadow-neon-lg hover:shadow-neon-orange/50'
  }
  
  const glowClasses = glow ? `animate-pulse-glow hover-glow ${glowColorClasses[glowColor]}` : ''
  const loadingClasses = loading ? 'cursor-wait' : ''

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return

    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect()
      setRippleCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsRippling(true)
      setTimeout(() => setIsRippling(false), 600)
    }

    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${glowClasses} ${loadingClasses} ${className} group`}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 bg-shimmer-overlay bg-200% opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300" />
      
      {/* Ripple effect */}
      {ripple && isRippling && (
        <span
          className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
          style={{
            left: rippleCoords.x - 10,
            top: rippleCoords.y - 10,
            width: 20,
            height: 20,
          }}
        />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && <span className="group-hover:animate-bounce-glow">{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </span>
      
      {/* Glow effect background */}
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      )}
      
      {/* Border glow for certain variants */}
      {(variant === 'cyber' || variant === 'neon') && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  )
}