import React, { useState, useEffect, useMemo } from 'react'
import { Card } from '../ui/Card'
import { Check, Search, MapPin } from 'lucide-react'

interface AreaOption {
  value: string
  label: string
  icon?: string
}

interface AreaSelectionGridProps {
  options: AreaOption[]
  selectedValue?: string
  onSelect: (value: string) => void
}

// 地域別グループ定義
const REGION_GROUPS = {
  '東京': ['SHIBUYA', 'SHINJUKU', 'GINZA', 'ROPPONGI', 'IKEBUKURO', 'AKASAKA', 'KABUKICHO'],
  '関東': ['YOKOHAMA', 'OMIYA', 'CHIBA'],
  '北海道・東北': ['SUSUKINO', 'SENDAI'],
  '中部': ['NISHIKI', 'SAKAE', 'SHIZUOKA', 'NIIGATA'],
  '関西': ['KITASHINCHI', 'NAMBA', 'UMEDA', 'TOBITA', 'KYOTO_GION', 'KYOTO_PONTOCHO', 'KOBE_SANNOMIYA', 'KOBE_KITANO'],
  '中国・四国': ['HIROSHIMA', 'OKAYAMA', 'MATSUYAMA', 'TAKAMATSU'],
  '九州・沖縄': ['NAKASU', 'TENJIN', 'KUMAMOTO', 'KAGOSHIMA', 'NAHA', 'KOKUSAIDORI'],
  'その他': ['OTHER']
}

export const AreaSelectionGrid: React.FC<AreaSelectionGridProps> = ({
  options,
  selectedValue,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [animatedGroups, setAnimatedGroups] = useState<string[]>([])

  // 地域別にオプションをグループ化
  const groupedOptions = useMemo(() => {
    const groups: { [key: string]: AreaOption[] } = {}
    
    Object.entries(REGION_GROUPS).forEach(([region, areaKeys]) => {
      const regionOptions = options.filter(option => areaKeys.includes(option.value))
      if (regionOptions.length > 0) {
        groups[region] = regionOptions
      }
    })
    
    return groups
  }, [options])

  // 検索フィルタリング
  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groupedOptions
    
    const filtered: { [key: string]: AreaOption[] } = {}
    
    Object.entries(groupedOptions).forEach(([region, regionOptions]) => {
      const matchingOptions = regionOptions.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      if (matchingOptions.length > 0) {
        filtered[region] = matchingOptions
      }
    })
    
    return filtered
  }, [groupedOptions, searchTerm])

  useEffect(() => {
    // Stagger the animation of groups
    Object.keys(filteredGroups).forEach((region, index) => {
      setTimeout(() => {
        setAnimatedGroups(prev => [...prev, region])
      }, index * 150)
    })
  }, [filteredGroups])

  const handleSelect = (value: string) => {
    onSelect(value)
    
    // Add a small celebration effect for selection
    const selectedElement = document.querySelector(`[data-area-value="${value}"]`)
    if (selectedElement) {
      selectedElement.classList.add('animate-bounce-glow')
      setTimeout(() => {
        selectedElement.classList.remove('animate-bounce-glow')
      }, 600)
    }
  }

  return (
    <div className="space-y-8">
      {/* 検索バー */}
      <div className="relative max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="エリアを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-accent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-glow-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* エリアグループ */}
      <div className="space-y-8">
        {Object.entries(filteredGroups).length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">該当するエリアが見つかりません</p>
          </div>
        ) : (
          Object.entries(filteredGroups).map(([region, regionOptions]) => {
            const isAnimated = animatedGroups.includes(region)
            
            return (
              <div
                key={region}
                className={`transition-all duration-500 ${
                  isAnimated ? 'animate-slide-in-up' : 'opacity-0'
                }`}
              >
                {/* 地域ヘッダー */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-glow-primary" />
                    {region}
                  </h3>
                  <div className="h-px bg-gradient-to-r from-glow-primary to-transparent"></div>
                </div>

                {/* エリアグリッド */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {regionOptions.map((option, index) => {
                    const isSelected = selectedValue === option.value
                    
                    return (
                      <div
                        key={option.value}
                        data-area-value={option.value}
                        className={`transition-all duration-300 delay-${index * 50}`}
                      >
                        <Card
                          variant={isSelected ? "elevated" : "default"}
                          selected={isSelected}
                          onClick={() => handleSelect(option.value)}
                          className={`text-center p-4 cursor-pointer group relative min-h-[120px] flex flex-col justify-center ${
                            isSelected 
                              ? 'border-2 border-glow-primary shadow-lg shadow-glow-primary/20' 
                              : 'border border-gray-600 hover:border-glow-primary/50 hover:shadow-md'
                          }`}
                          hoverable
                          animated
                        >
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-glow-primary rounded-full p-1">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          
                          {/* Icon */}
                          {option.icon && (
                            <div className={`text-3xl mb-2 transition-all duration-300 ${
                              isSelected 
                                ? 'animate-bounce-glow scale-110' 
                                : 'group-hover:scale-110'
                            }`}>
                              {option.icon}
                            </div>
                          )}
                          
                          {/* Title */}
                          <h4 className={`text-sm font-bold transition-all duration-300 ${
                            isSelected 
                              ? 'text-white' 
                              : 'text-white group-hover:text-glow-primary'
                          }`}>
                            {option.label}
                          </h4>
                          
                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-glow-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Selection pulse effect */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-glow-primary/10 rounded-xl animate-pulse" />
                          )}
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}