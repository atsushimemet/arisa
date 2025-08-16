'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Area, ServiceType, BudgetRange, AREA_LABELS, SERVICE_TYPE_LABELS, BUDGET_RANGE_LABELS } from '@/types'

interface FormData {
  name: string
  snsLink: string
  storeLink: string
  area: Area | ''
  serviceType: ServiceType | ''
  budgetRange: BudgetRange | ''
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
  const [formData, setFormData] = useState<FormData>({
    name: '',
    snsLink: '',
    storeLink: '',
    area: '',
    serviceType: '',
    budgetRange: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

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
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/casts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          snsLink: formData.snsLink.trim(),
          storeLink: formData.storeLink.trim() || null,
          area: formData.area,
          serviceType: formData.serviceType,
          budgetRange: formData.budgetRange,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'キャストの追加に失敗しました')
      }

      // 成功時は管理者ページに戻る
      router.push('/admin')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'エラーが発生しました')
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

  return (
    <div className="min-h-screen bg-dark-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold glow-text mb-2">新しいキャストを追加</h1>
            <p className="text-gray-300">キャスト情報を入力してください</p>
          </div>
          <Button 
            onClick={() => router.push('/admin')}
            variant="outline"
          >
            管理者ページに戻る
          </Button>
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
                  SNSリンク <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={formData.snsLink}
                  onChange={(e) => handleInputChange('snsLink', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-accent border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-glow-primary ${
                    errors.snsLink ? 'border-red-400' : 'border-gray-600'
                  }`}
                  placeholder="https://twitter.com/username"
                />
                {errors.snsLink && (
                  <p className="text-red-400 text-sm mt-1">{errors.snsLink}</p>
                )}
              </div>

              {/* 店舗リンク */}
              <div>
                <label className="block text-white font-medium mb-2">
                  店舗リンク（任意）
                </label>
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
                  {Object.entries(AREA_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
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
                  予算帯 <span className="text-red-400">*</span>
                </label>
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
                  glow={!loading}
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
    </div>
  )
}