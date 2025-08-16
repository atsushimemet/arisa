'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Area, ServiceType, BudgetRange, SERVICE_TYPE_LABELS, BUDGET_RANGE_LABELS, Cast } from '@/types'
import { useAreas } from '@/hooks/useAreas'

export function ResultsClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getAreaLabel } = useAreas()
  const [casts, setCasts] = useState<Cast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const area = searchParams.get('area') as Area
  const serviceType = searchParams.get('serviceType') as ServiceType
  const budgetRange = searchParams.get('budgetRange') as BudgetRange

  useEffect(() => {
    const fetchCasts = async () => {
      try {
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
  }, [area, serviceType, budgetRange])

  const handleBackToOnboarding = () => {
    router.push('/onboarding')
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-glow-primary mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">キャストを検索中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">😔</div>
          <h2 className="text-2xl font-bold text-white mb-4">エラーが発生しました</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button onClick={handleBackToOnboarding} variant="primary">
            条件を変更する
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 glow-text">検索結果</h1>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {area && (
              <span className="bg-dark-accent px-4 py-2 rounded-full text-glow-primary border border-glow-primary">
                📍 {getAreaLabel(area)}
              </span>
            )}
            {serviceType && (
              <span className="bg-dark-accent px-4 py-2 rounded-full text-glow-secondary border border-glow-secondary">
                🍸 {SERVICE_TYPE_LABELS[serviceType]}
              </span>
            )}
            {budgetRange && (
              <span className="bg-dark-accent px-4 py-2 rounded-full text-yellow-400 border border-yellow-400">
                💰 {BUDGET_RANGE_LABELS[budgetRange]}
              </span>
            )}
          </div>
        </div>

        {/* 結果 */}
        {casts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              条件に合うキャストが見つかりませんでした
            </h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              条件を変更して再度お試しください。新しいキャストが随時追加されています。
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleBackToOnboarding} variant="primary">
                条件を変更する
              </Button>
              <Button onClick={handleBackToHome} variant="outline">
                ホームに戻る
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-300 text-lg">
                {casts.length}人のキャストが見つかりました
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {casts.map((cast) => (
                <Card key={cast.id} className="hover:scale-105 transform transition-all duration-300">
                  <div className="text-center">
                    <div className="text-4xl mb-4">✨</div>
                    <h3 className="text-xl font-bold text-white mb-2">{cast.name}</h3>
                    
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        📍 {getAreaLabel(cast.area)}
                      </span>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        🍸 {SERVICE_TYPE_LABELS[cast.serviceType]}
                      </span>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        💰 {BUDGET_RANGE_LABELS[cast.budgetRange]}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <a
                        href={cast.snsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button variant="primary" className="w-full" glow>
                          SNSを見る
                        </Button>
                      </a>
                      
                      {cast.storeLink && (
                        <a
                          href={cast.storeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full"
                        >
                          <Button variant="outline" className="w-full">
                            店舗情報
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <div className="flex gap-4 justify-center">
                <Button onClick={handleBackToOnboarding} variant="outline">
                  条件を変更する
                </Button>
                <Button onClick={handleBackToHome} variant="secondary">
                  ホームに戻る
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}