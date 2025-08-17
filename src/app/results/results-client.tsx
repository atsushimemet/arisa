'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Area, ServiceType, BudgetRange, SERVICE_TYPE_LABELS, BUDGET_RANGE_LABELS, Cast } from '@/types'
import { useAreas } from '@/hooks/useAreas'
import { Search, Filter, RefreshCw, ArrowLeft, Home, Users, Star, MapPin, DollarSign, ExternalLink, Sparkles } from 'lucide-react'

export function ResultsClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getAreaLabel } = useAreas()
  const [casts, setCasts] = useState<Cast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAnimated, setIsAnimated] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const area = searchParams.get('area') as Area
  const serviceType = searchParams.get('serviceType') as ServiceType
  const budgetRange = searchParams.get('budgetRange') as BudgetRange

  useEffect(() => {
    setIsAnimated(true)
  }, [])

  useEffect(() => {
    const fetchCasts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams()
        if (area) params.set('area', area)
        if (serviceType) params.set('serviceType', serviceType)
        if (budgetRange) params.set('budgetRange', budgetRange)

        const response = await fetch(`/api/casts?${params.toString()}`)
        if (!response.ok) {
          throw new Error('キャストの取得に失敗しました')
        }

        const data = await response.json()
        setCasts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    fetchCasts()
  }, [area, serviceType, budgetRange, retryCount])

  const handleBackToOnboarding = () => {
    router.push('/onboarding')
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient relative overflow-hidden">
        {/* Particle background */}
        <div className="absolute inset-0 particle-bg opacity-40" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card variant="glass" className="text-center p-12 max-w-md">
            {/* Animated loading spinner */}
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-neon-cyan/30 rounded-full mx-auto"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-t-neon-cyan border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-t-transparent border-r-glow-primary border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
            
            <h2 className="text-2xl font-bold text-black mb-4">
              キャストを検索中
              <span className="loading-dots"></span>
            </h2>
            <p className="text-gray-700 text-lg">
              あなたにぴったりのキャストを探しています
            </p>
            
            {/* Floating dots */}
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-glow-primary rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce delay-200"></div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-gradient relative overflow-hidden">
        {/* Particle background */}
        <div className="absolute inset-0 particle-bg opacity-30" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card variant="elevated" className="text-center max-w-md p-12">
            <div className="text-8xl mb-8 animate-bounce-glow">😔</div>
            <h2 className="text-3xl font-bold text-black mb-6">エラーが発生しました</h2>
            <p className="text-gray-700 mb-8 leading-relaxed">{error}</p>
            
            <div className="flex flex-col space-y-4">
              <Button 
                onClick={handleRetry} 
                variant="primary" 
                size="lg"
                icon={<RefreshCw className="w-5 h-5" />}
              >
                再試行
              </Button>
              <Button 
                onClick={handleBackToOnboarding} 
                variant="outline"
                icon={<Search className="w-5 h-5" />}
              >
                条件を変更する
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-gradient relative overflow-hidden">
      {/* Particle background */}
      <div className="absolute inset-0 particle-bg opacity-30" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-primary/30 to-dark-primary/70" />
      
      <div className="relative z-10">
        <div className="container mx-auto px-6 lg:px-8 py-12 lg:py-16">
          {/* Header */}
          <div className={`text-center mb-16 lg:mb-20 transition-all duration-1000 ${isAnimated ? 'animate-slide-in-down' : 'opacity-0'}`}>
            <h1 className="text-5xl font-bold mb-10 holographic-text animate-holographic">
              検索結果
            </h1>
            
            {/* Search criteria badges */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {area && (
                <Card variant="glass" className="px-6 py-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-neon-cyan" />
                  <span className="text-black font-semibold">{getAreaLabel(area)}</span>
                </Card>
              )}
              {serviceType && (
                <Card variant="glass" className="px-6 py-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-neon-purple" />
                  <span className="text-black font-semibold">{SERVICE_TYPE_LABELS[serviceType]}</span>
                </Card>
              )}
              {budgetRange && (
                <Card variant="glass" className="px-6 py-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-laser-green" />
                  <span className="text-black font-semibold">{BUDGET_RANGE_LABELS[budgetRange]}</span>
                </Card>
              )}
            </div>

            {/* Results count */}
            <div className="flex items-center justify-center gap-2 text-black">
              <Users className="w-5 h-5" />
              <span className="text-lg">
                <span className="font-bold">{casts.length}</span> 人のキャストが見つかりました
              </span>
              <Sparkles className="w-5 h-5 text-game-gold animate-bounce-glow" />
            </div>
          </div>

          {/* Action buttons */}
          <div className={`flex flex-wrap justify-center gap-6 mb-16 lg:mb-20 transition-all duration-1000 delay-300 ${isAnimated ? 'animate-slide-in-up' : 'opacity-0'}`}>
            <Button
              onClick={handleBackToHome}
              variant="outline"
              icon={<Home className="w-5 h-5" />}
              className="px-6 py-3"
            >
              ホームに戻る
            </Button>
            <Button
              onClick={handleBackToOnboarding}
              variant="outline"
              icon={<Filter className="w-5 h-5" />}
              className="px-6 py-3"
            >
              条件を変更
            </Button>
          </div>

          {/* Results Grid */}
          {casts.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 transition-all duration-1000 delay-500 ${isAnimated ? 'animate-fade-in' : 'opacity-0'}`}>
              {casts.map((cast) => (
                <Card
                  key={cast.id}
                  variant="elevated"
                  className="p-6 hover:scale-105 transform transition-all duration-300 group"
                  animated
                >
                  {/* Cast info */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-black mb-2 group-hover:text-gray-800 transition-all duration-300">
                      {cast.name}
                    </h3>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-dark-accent px-3 py-1 rounded-full text-xs text-neon-cyan border border-neon-cyan/30">
                        {getAreaLabel(cast.area)}
                      </span>
                      <span className="bg-dark-accent px-3 py-1 rounded-full text-xs text-neon-purple border border-neon-purple/30">
                        {SERVICE_TYPE_LABELS[cast.serviceType]}
                      </span>
                      <span className="bg-dark-accent px-3 py-1 rounded-full text-xs text-laser-green border border-laser-green/30">
                        {BUDGET_RANGE_LABELS[cast.budgetRange]}
                      </span>
                    </div>
                    
                  </div>

                  {/* Social links */}
                  <div className="space-y-3">
                    {cast.snsLink && (
                      <Button
                        onClick={() => window.open(cast.snsLink, '_blank')}
                        variant="primary"
                        size="sm"
                        className="w-full"
                        icon={<ExternalLink className="w-4 h-4" />}
                      >
                        SNS で確認
                      </Button>
                    )}
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-laser-green/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Sparkle effect on hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-6 h-6 text-game-gold animate-bounce-glow" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className={`text-center transition-all duration-1000 delay-500 ${isAnimated ? 'animate-fade-in' : 'opacity-0'}`}>
              <Card variant="glass" className="p-12 max-w-2xl mx-auto">
                <div className="text-8xl mb-8 animate-float">🔍</div>
                <h2 className="text-3xl font-bold text-black mb-6">
                  該当するキャストが見つかりませんでした
                </h2>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  検索条件を変更して、再度お試しください。
                  <br />
                  より多くのキャストが見つかるかもしれません。
                </p>
                <Button
                  onClick={handleBackToOnboarding}
                  variant="primary"
                  size="lg"
                  icon={<Search className="w-5 h-5" />}
                  className="px-12 py-4"
                >
                  条件を変更して再検索
                </Button>
              </Card>
            </div>
          )}

          {/* Back to top floating button */}
          <div className="fixed bottom-8 right-8 z-50">
            <Button
              onClick={handleBackToHome}
              variant="primary"
              className="rounded-full p-4"
              icon={<ArrowLeft className="w-6 h-6" />}
            >
              ホームに戻る
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}