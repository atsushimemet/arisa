'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Cast, SERVICE_TYPE_LABELS, BUDGET_RANGE_LABELS } from '@/types'
import { useAreas } from '@/hooks/useAreas'
import { MobileConsole } from '@/components/MobileConsole'

export default function AdminPage() {
  const router = useRouter()
  const { getAreaLabel } = useAreas()
  const [casts, setCasts] = useState<Cast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDebugConsoleOpen, setIsDebugConsoleOpen] = useState(false)

  useEffect(() => {
    fetchCasts()
  }, [])

  const fetchCasts = async () => {
    try {
      const response = await fetch('/api/casts?includeInactive=true')
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

  const handleToggleActive = async (castId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/casts/${castId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (!response.ok) {
        throw new Error('ステータスの更新に失敗しました')
      }

      // キャスト一覧を再取得
      fetchCasts()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'エラーが発生しました')
    }
  }

  const handleDeleteCast = async (castId: string) => {
    if (!confirm('このキャストを削除しますか？')) {
      return
    }

    try {
      const response = await fetch(`/api/casts/${castId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('キャストの削除に失敗しました')
      }

      // キャスト一覧を再取得
      fetchCasts()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'エラーが発生しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-glow-primary mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">読み込み中...</p>
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
          <Button onClick={() => window.location.reload()} variant="primary">
            再読み込み
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold glow-text mb-2">管理者ダッシュボード</h1>
            <p className="text-gray-300">キャスト管理システム</p>
          </div>
          <div className="flex gap-2 sm:gap-4 flex-wrap">
            <Button 
              onClick={() => router.push('/admin/add-cast')}
              variant="primary"
              className="px-3 py-2 sm:px-4 text-lg"
              title="新しいキャストを追加"
            >
              追加
            </Button>
            <Button 
              onClick={() => router.push('/admin/areas')}
              variant="secondary"
              className="px-3 py-2 sm:px-4 text-lg"
              title="エリア管理"
            >
              🗺️
            </Button>
            <Button 
              onClick={() => setIsDebugConsoleOpen(!isDebugConsoleOpen)}
              variant="outline"
              className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black px-3 py-2 sm:px-4 text-lg"
              title="デバッグコンソール"
            >
              🐛
            </Button>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="px-3 py-2 sm:px-4 text-lg"
              title="ホームに戻る"
            >
              🏠
            </Button>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-glow-primary mb-2">
              {casts.length}
            </div>
            <div className="text-gray-300">総キャスト数</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {casts.filter(cast => cast.isActive).length}
            </div>
            <div className="text-gray-300">アクティブ</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {casts.filter(cast => !cast.isActive).length}
            </div>
            <div className="text-gray-300">非アクティブ</div>
          </Card>
        </div>

        {/* キャスト一覧 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">キャスト一覧</h2>
          
          {casts.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-white mb-2">
                キャストが登録されていません
              </h3>
              <p className="text-gray-300 mb-6">
                新しいキャストを追加してください
              </p>
              <Button 
                onClick={() => router.push('/admin/add-cast')}
                variant="primary"
              >
                追加
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {casts.map((cast) => (
                <Card key={cast.id} className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-black">{cast.name}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cast.isActive 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {cast.isActive ? 'アクティブ' : '非アクティブ'}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">
                        📍 {getAreaLabel(cast.area)}
                      </span>
                      <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">
                        🍸 {SERVICE_TYPE_LABELS[cast.serviceType]}
                      </span>
                      <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">
                        💰 {BUDGET_RANGE_LABELS[cast.budgetRange]}
                      </span>
                    </div>
                    <a
                      href={cast.snsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-glow-primary hover:text-glow-secondary text-sm truncate"
                    >
                      顔付きSNS: {cast.snsLink}
                    </a>
                    {cast.storeLink && (
                      <a
                        href={cast.storeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-glow-secondary hover:text-glow-primary text-sm truncate"
                      >
                        所属店舗: {cast.storeLink}
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push(`/admin/edit-cast/${cast.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-glow-primary border-glow-primary hover:bg-glow-primary hover:text-white"
                    >
                      編集
                    </Button>
                    <Button
                      onClick={() => handleToggleActive(cast.id, cast.isActive)}
                      variant={cast.isActive ? "secondary" : "primary"}
                      size="sm"
                      className="flex-1"
                    >
                      {cast.isActive ? '非アクティブ化' : 'アクティブ化'}
                    </Button>
                    <Button
                      onClick={() => handleDeleteCast(cast.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                    >
                      削除
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    作成日: {new Date(cast.createdAt).toLocaleDateString('ja-JP')}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* デバッグコンソール */}
      <MobileConsole 
        isOpen={isDebugConsoleOpen} 
        onToggle={() => setIsDebugConsoleOpen(!isDebugConsoleOpen)} 
      />
    </div>
  )
}