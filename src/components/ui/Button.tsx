import React, { useState } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  children: React.ReactNode
  icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  icon,
  onClick,
  disabled,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false)

  const baseClasses = 'font-ios font-semibold rounded-ios transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ios-blue focus:ring-opacity-30 overflow-hidden transform disabled:opacity-50 disabled:cursor-not-allowed select-none'
  
  const variantClasses = {
    primary: 'bg-ios-blue text-white shadow-ios-button hover:shadow-ios-button-hover hover:bg-blue-600 active:scale-95',
    secondary: 'bg-ios-gray-100 text-ios-gray-800 shadow-ios hover:shadow-ios-md hover:bg-ios-gray-200 active:scale-95',
    outline: 'border-2 border-ios-blue text-ios-blue hover:bg-ios-blue hover:text-white shadow-ios hover:shadow-ios-md active:scale-95',
    success: 'bg-ios-green text-white shadow-ios hover:shadow-ios-md hover:bg-green-600 active:scale-95',
    warning: 'bg-ios-orange text-white shadow-ios hover:shadow-ios-md hover:bg-orange-600 active:scale-95',
    danger: 'bg-ios-red text-white shadow-ios hover:shadow-ios-md hover:bg-red-600 active:scale-95'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px] letter-spacing-ios',
    md: 'px-6 py-3 text-base min-h-[44px] letter-spacing-ios',
    lg: 'px-8 py-4 text-lg min-h-[52px] letter-spacing-ios',
    xl: 'px-12 py-6 text-xl min-h-[60px] letter-spacing-ios-tight'
  }

  const loadingClasses = loading ? 'cursor-wait opacity-80' : ''
  const pressedClasses = isPressed ? 'scale-95' : ''

  const handleMouseDown = () => {
    setIsPressed(true)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const handleMouseLeave = () => {
    setIsPressed(false)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return

    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${loadingClasses} ${pressedClasses} ${className}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      {...props}
    >
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>読み込み中...</span>
          </>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </span>
    </button>
  )
}