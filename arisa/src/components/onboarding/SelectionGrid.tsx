import React from 'react'
import { Card } from '../ui/Card'

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
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-4`}>
      {options.map((option) => (
        <Card
          key={option.value}
          selected={selectedValue === option.value}
          onClick={() => onSelect(option.value)}
          className="text-center hover:scale-105 transform transition-transform duration-200"
        >
          {option.icon && (
            <div className="text-4xl mb-4">
              {option.icon}
            </div>
          )}
          <h3 className="text-lg font-semibold mb-2 text-white">
            {option.label}
          </h3>
          {option.description && (
            <p className="text-sm text-gray-400">
              {option.description}
            </p>
          )}
        </Card>
      ))}
    </div>
  )
}