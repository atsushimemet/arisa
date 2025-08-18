'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SERVICE_TYPE_LABELS, BUDGET_RANGE_LABELS } from '@/types'
import { useAreas } from '@/hooks/useAreas'
import { MobileConsole, mobileLog } from '@/components/MobileConsole'

interface FormData {
  name: string
  snsLink: string
  storeLink: string
  area: string
  serviceType: string
  budgetRange: string
}

interface FormErrors {
  name?: string
  snsLink?: string
  storeLink?: string
  area?: string
  serviceType?: string
  budgetRange?: string
}

export default function AddCastPage() {
  const router = useRouter()
  const { areaOptions, loading: areasLoading, error: areasError } = useAreas()
  
  console.log('AddCastPage - areaOptions:', areaOptions)
  console.log('AddCastPage - areasLoading:', areasLoading)
  console.log('AddCastPage - areasError:', areasError)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    snsLink: '',
    storeLink: '',
    area: '',
    serviceType: '',
    budgetRange: ''
  })
  const [loading, setLoading] = useState(false)
  const [isDebugConsoleOpen, setIsDebugConsoleOpen] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (!areasLoading) {
      console.log('エリア読み込み完了:', areaOptions)
      mobileLog.info('エリア読み込み完了', { areaOptions, error: areasError })
    }
  }, [areasLoading, areaOptions, areasError])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    console.log('バリデーション開始:', formData)

    if (!formData.name.trim()) {
      newErrors.name = 'キャスト名は必須です'
    }

    if (!formData.snsLink.trim()) {
      newErrors.snsLink = 'SNSリンクは必須です'
    } else if (!isValidUrl(formData.snsLink)) {
      newErrors.snsLink = '有効なURLを入力してください'
    }

    if (formData.storeLink && !isValidUrl(formData.storeLink)) {
      newErrors.storeLink = '有効なURLを入力してください'
    }

    if (!formData.area) {
      newErrors.area = 'エリアを選択してください'
    }

    if (!formData.serviceType) {
      newErrors.serviceType = '接客スタイルを選択してください'
    }

    if (!formData.budgetRange) {
      newErrors.budgetRange = '予算帯を選択してください'
    }

    console.log('バリデーション結果:', { newErrors, hasErrors: Object.keys(newErrors).length > 0 })
    mobileLog.debug('フォームバリデーション', { formData, errors: newErrors })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      console.error('フォームバリデーションに失敗しました')
      mobileLog.error('フォームバリデーションに失敗しました', { errors })
      return
    }

    setLoading(true)

    const requestData = {
      name: formData.name.trim(),
      snsLink: formData.snsLink.trim(),
      storeLink: formData.storeLink.trim() || null,
      area: formData.area,
      serviceType: formData.serviceType,
      budgetRange: formData.budgetRange,
    }

    console.log('キャスト追加リクエスト:', requestData)
    mobileLog.info('キャスト追加リクエスト開始', requestData)

    try {
      const response = await fetch('/api/casts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      console.log('API レスポンス status:', response.status)
      mobileLog.debug(`API レスポンス status: ${response.status}`)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API エラーレスポンス:', errorData)
        mobileLog.error('API エラーレスポンス', errorData)
        throw new Error(errorData.error || 'キャストの追加に失敗しました')
      }

      const result = await response.json()
      console.log('キャスト追加成功:', result)
      mobileLog.info('キャスト追加成功', result)

      // 成功時は管理者ページに戻る
      router.push('/admin')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました'
      console.error('キャスト追加エラー:', err)
      mobileLog.error('キャスト追加エラー', { error: errorMessage, details: err })
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (areasLoading) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-glow-primary mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">エリア情報を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (areasError) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">😔</div>
          <h2 className="text-2xl font-bold text-white mb-4">エラーが発生しました</h2>
          <p className="text-gray-300 mb-6">{areasError}</p>
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
            <h1 className="text-3xl sm:text-4xl font-bold glow-text mb-2">新しいキャストを追加</h1>
            <p className="text-gray-300">キャスト情報を入力してください</p>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Button 
              onClick={() => setIsDebugConsoleOpen(!isDebugConsoleOpen)}
              variant="outline"
              className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black px-3 py-2 sm:px-4 text-lg"
              title="デバッグコンソール"
            >
              🐛
            </Button>
            <Button 
              onClick={() => router.push('/admin')}
              variant="outline"
              className="px-3 py-2 sm:px-4 text-lg"
              title="管理者ページに戻る"
            >
              ⬅️
            </Button>
          </div>
        </div>

        {/* フォーム */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* キャスト名 */}
              <div>
                <label className="block text-white font-medium mb-2">
                  キャスト名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-accent border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-glow-primary ${
                    errors.name ? 'border-red-400' : 'border-gray-600'
                  }`}
                  placeholder="例: 山田花子"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* SNSリンク */}
              <div>
                <label className="block text-white font-medium mb-2">
                  顔付きSNS URL <span className="text-red-400">*</span>
                </label>
                <p className="text-gray-400 text-sm mb-2">
                  キャストの顔がわかるSNSリンクを入力してください
                </p>
                <input
                  type="url"
                  value={formData.snsLink}
                  onChange={(e) => handleInputChange('snsLink', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-accent border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-glow-primary ${
                    errors.snsLink ? 'border-red-400' : 'border-gray-600'
                  }`}
                  placeholder="https://twitter.com/username または https://instagram.com/username"
                />
                {errors.snsLink && (
                  <p className="text-red-400 text-sm mt-1">{errors.snsLink}</p>
                )}
              </div>

              {/* 店舗リンク */}
              <div>
                <label className="block text-white font-medium mb-2">
                  所属店舗URL（任意）
                </label>
                <p className="text-gray-400 text-sm mb-2">
                  店舗のホームページURLを入力してください
                </p>
                <input
                  type="url"
                  value={formData.storeLink}
                  onChange={(e) => handleInputChange('storeLink', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-accent border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-glow-primary ${
                    errors.storeLink ? 'border-red-400' : 'border-gray-600'
                  }`}
                  placeholder="https://example-store.com"
                />
                {errors.storeLink && (
                  <p className="text-red-400 text-sm mt-1">{errors.storeLink}</p>
                )}
              </div>

              {/* エリア */}
              <div>
                <label className="block text-white font-medium mb-2">
                  エリア <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-accent border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-glow-primary ${
                    errors.area ? 'border-red-400' : 'border-gray-600'
                  }`}
                >
                  <option value="">エリアを選択してください</option>
                  {areaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.area && (
                  <p className="text-red-400 text-sm mt-1">{errors.area}</p>
                )}
              </div>

              {/* 接客スタイル */}
              <div>
                <label className="block text-white font-medium mb-2">
                  接客スタイル <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-accent border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-glow-primary ${
                    errors.serviceType ? 'border-red-400' : 'border-gray-600'
                  }`}
                >
                  <option value="">接客スタイルを選択してください</option>
                  {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.serviceType && (
                  <p className="text-red-400 text-sm mt-1">{errors.serviceType}</p>
                )}
              </div>

              {/* 予算帯 */}
              <div>
                <label className="block text-white font-medium mb-2">
                  予算 <span className="text-red-400">*</span>
                </label>
                <p className="text-gray-400 text-sm mb-2">
                  オンボーディングで表示される予算帯から選択してください
                </p>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-accent border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-glow-primary ${
                    errors.budgetRange ? 'border-red-400' : 'border-gray-600'
                  }`}
                >
                  <option value="">予算帯を選択してください</option>
                  {Object.entries(BUDGET_RANGE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.budgetRange && (
                  <p className="text-red-400 text-sm mt-1">{errors.budgetRange}</p>
                )}
              </div>

              {/* 送信ボタン */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? '追加中...' : 'キャストを追加'}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push('/admin')}
                  variant="outline"
                  size="lg"
                  disabled={loading}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </Card>
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