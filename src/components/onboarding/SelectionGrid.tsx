import React, { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Check } from 'lucide-react'

interface SelectionOption {
  value: string
  label: string
  description?: string
  icon?: string
}

interface SelectionGridProps {
  options: SelectionOption[]
  selectedValue?: string
  onSelect: (value: string) => void
  columns?: number
}

export const SelectionGrid: React.FC<SelectionGridProps> = ({
  options,
  selectedValue,
  onSelect,
  columns = 2
}) => {
  const [animatedOptions, setAnimatedOptions] = useState<string[]>([])

  useEffect(() => {
    // Stagger the animation of options
    options.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedOptions(prev => [...prev, `option-${index}`])
      }, index * 100)
    })
  }, [options])

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  const handleSelect = (value: string) => {
    onSelect(value)
    
    // Add a small celebration effect for selection
    const selectedElement = document.querySelector(`[data-value="${value}"]`)
    if (selectedElement) {
      selectedElement.classList.add('animate-bounce-glow')
      setTimeout(() => {
        selectedElement.classList.remove('animate-bounce-glow')
      }, 600)
    }
  }

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6`}>
      {options.map((option, index) => {
        const isSelected = selectedValue === option.value
        const isAnimated = animatedOptions.includes(`option-${index}`)
        
        return (
          <div
            key={option.value}
            data-value={option.value}
            className={`transition-all duration-500 delay-${index * 100} ${
              isAnimated ? 'animate-slide-in-up' : 'opacity-0'
            }`}
          >
            <Card
              variant={isSelected ? "gaming" : "cyber"}
              selected={isSelected}
              onClick={() => handleSelect(option.value)}
              className="text-center p-8 cursor-pointer group relative min-h-[180px] flex flex-col justify-center"
              glow={isSelected}
              borderGlow={isSelected ? "green" : "cyan"}
              hoverable
              animated
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-laser-green to-neon-cyan rounded-full p-2 animate-bounce-glow">
                  <Check className="w-4 h-4 text-black" />
                </div>
              )}
              
              {/* Icon */}
              {option.icon && (
                <div className={`text-6xl mb-6 transition-all duration-300 ${
                  isSelected 
                    ? 'animate-bounce-glow scale-110' 
                    : 'group-hover:scale-110 group-hover:animate-float'
                }`}>
                  {option.icon}
                </div>
              )}
              
              {/* Title */}
              <h3 className={`text-xl font-bold mb-3 transition-all duration-300 ${
                isSelected 
                  ? 'text-white glow-text-green' 
                  : 'text-white group-hover:glow-text-cyan'
              }`}>
                {option.label}
              </h3>
              
              {/* Description */}
              {option.description && (
                <p className={`text-sm leading-relaxed transition-all duration-300 ${
                  isSelected 
                    ? 'text-gray-200' 
                    : 'text-gray-400 group-hover:text-gray-300'
                }`}>
                  {option.description}
                </p>
              )}
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-glow-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Selection pulse effect */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-laser-green/20 to-neon-cyan/20 rounded-xl animate-pulse" />
              )}
            </Card>
          </div>
        )
      })}
    </div>
  )
}