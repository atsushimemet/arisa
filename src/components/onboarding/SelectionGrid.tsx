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
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-8 lg:gap-10`}>
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
              variant={isSelected ? "elevated" : "default"}
              selected={isSelected}
              onClick={() => handleSelect(option.value)}
              className={`text-center p-8 cursor-pointer group relative min-h-[180px] flex flex-col justify-center ${
                isSelected 
                  ? 'border-2 border-blue-500 shadow-lg' 
                  : 'border border-gray-300 hover:border-gray-400 hover:shadow-md'
              }`}
              hoverable
              animated
            >
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
              
              {/* Title - Always visible */}
              <h3 className={`text-2xl font-extrabold mb-3 transition-all duration-300 ${
                isSelected 
                  ? 'text-black' 
                  : 'text-black group-hover:text-gray-800'
              }`}>
                {option.label}
              </h3>
              
              {/* Description - Always visible */}
              {option.description && (
                <p className={`text-sm leading-relaxed transition-all duration-300 ${
                  isSelected 
                    ? 'text-gray-700' 
                    : 'text-gray-600 group-hover:text-gray-700'
                }`}>
                  {option.description}
                </p>
              )}
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Selection pulse effect */}
              {isSelected && (
                <div className="absolute inset-0 bg-blue-50 rounded-xl animate-pulse" />
              )}
            </Card>
          </div>
        )
      })}
    </div>
  )
}