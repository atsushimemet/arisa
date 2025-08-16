'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AreaMaster } from '@/types'
import { mobileLog } from '@/components/MobileConsole'

interface FormData {
  key: string
  label: string
  sortOrder: number
}

interface FormErrors {
  key?: string
  label?: string
  sortOrder?: string
}

export default function AreasManagementPage() {
  const router = useRouter()
  const [areas, setAreas] = useState<AreaMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingArea, setEditingArea] = useState<AreaMaster | null>(null)
  const [formData, setFormData] = useState<FormData>({
    key: '',
    label: '',
    sortOrder: 0
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchAreas()
  }, [])

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/areas')
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'レスポンスの解析に失敗しました' }))
        const errorMessage = errorData.error || `HTTPエラー: ${response.status} ${response.statusText}`
        throw new Error(errorMessage)
      }
      const data = await response.json()
      setAreas(data)
      mobileLog.info(`エリア一覧を取得しました (${data.length}件)`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました'
      setError(errorMessage)
      mobileLog.error(`エリア取得エラー: ${errorMessage}`, {
        url: '/api/areas',
        error: err,
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.key.trim()) {
      newErrors.key = 'キーは必須です'
    } else if (!/^[A-Z_]+$/.test(formData.key)) {
      newErrors.key = 'キーは大文字とアンダースコアのみ使用できます'
    }

    if (!formData.label.trim()) {
      newErrors.label = 'ラベルは必須です'
    }

    if (formData.sortOrder < 0) {
      newErrors.sortOrder = '並び順は0以上の数値で入力してください'
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const url = editingArea ? `/api/areas/${editingArea.id}` : '/api/areas'
      const method = editingArea ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'レスポンスの解析に失敗しました' }))
        const errorMessage = errorData.error || `エリアの${editingArea ? '更新' : '追加'}に失敗しました`
        throw new Error(errorMessage)
      }

      // 成功時はフォームをリセットしてエリア一覧を再取得
      mobileLog.info(`エリア${editingArea ? '更新' : '追加'}が成功しました: ${formData.label}`)
      resetForm()
      fetchAreas()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました'
      mobileLog.error(`エリア${editingArea ? '更新' : '追加'}エラー: ${errorMessage}`, {
        formData,
        editingArea,
        error: err,
        timestamp: new Date().toISOString()
      })
      alert(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (areaId: string) => {
    if (!confirm('このエリアを削除しますか？\n※使用中のキャストがある場合は削除できません')) {
      return
    }

    try {
      const response = await fetch(`/api/areas/${areaId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'レスポンスの解析に失敗しました' }))
        const errorMessage = errorData.error || 'エリアの削除に失敗しました'
        throw new Error(errorMessage)
      }

      mobileLog.info(`エリアを削除しました: ${areaId}`)
      fetchAreas()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました'
      mobileLog.error(`エリア削除エラー: ${errorMessage}`, {
        areaId,
        error: err,
        timestamp: new Date().toISOString()
      })
      alert(errorMessage)
    }
  }

  const handleEdit = (area: AreaMaster) => {
    setEditingArea(area)
    setFormData({
      key: area.key,
      label: area.label,
      sortOrder: area.sortOrder
    })
    setShowAddForm(true)
    setFormErrors({})
  }

  const resetForm = () => {
    setFormData({
      key: '',
      label: '',
      sortOrder: areas.length
    })
    setFormErrors({})
    setShowAddForm(false)
    setEditingArea(null)
  }

  const handleToggleActive = async (areaId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/areas/${areaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'レスポンスの解析に失敗しました' }))
        const errorMessage = errorData.error || 'ステータスの更新に失敗しました'
        throw new Error(errorMessage)
      }

      mobileLog.info(`エリアステータスを更新しました: ${areaId} -> ${!isActive ? 'アクティブ' : '非アクティブ'}`)
      fetchAreas()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました'
      mobileLog.error(`エリアステータス更新エラー: ${errorMessage}`, {
        areaId,
        isActive,
        error: err,
        timestamp: new Date().toISOString()
      })
      alert(errorMessage)
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold glow-text mb-2">エリア管理</h1>
            <p className="text-gray-300">キャストのエリア情報を管理</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => {
                setFormData({
                  key: '',
                  label: '',
                  sortOrder: areas.length
                })
                setShowAddForm(true)
                setEditingArea(null)
                setFormErrors({})
              }}
              variant="primary"
              glow
            >
              新しいエリアを追加
            </Button>
            <Button 
              onClick={() => router.push('/admin')}
              variant="outline"
            >
              管理者ページに戻る
            </Button>
          </div>
        </div>

        {/* 追加・編集フォーム */}
        {showAddForm && (
          <div className="mb-8">
            <Card>
              <h3 className="text-xl font-bold text-white mb-4">
                {editingArea ? 'エリアを編集' : '新しいエリアを追加'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      キー <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.key}
                      onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value.toUpperCase() }))}
                      className={`w-full px-4 py-3 bg-dark-accent border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-glow-primary ${
                        formErrors.key ? 'border-red-400' : 'border-gray-600'
                      }`}
                      placeholder="AREA_KEY"
                      disabled={editingArea !== null}
                    />
                    {formErrors.key && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.key}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      ラベル <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                      className={`w-full px-4 py-3 bg-dark-accent border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-glow-primary ${
                        formErrors.label ? 'border-red-400' : 'border-gray-600'
                      }`}
                      placeholder="エリア名"
                    />
                    {formErrors.label && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.label}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      並び順
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-4 py-3 bg-dark-accent border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-glow-primary ${
                        formErrors.sortOrder ? 'border-red-400' : 'border-gray-600'
                      }`}
                      min="0"
                    />
                    {formErrors.sortOrder && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.sortOrder}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                    glow={!submitting}
                  >
                    {submitting ? `${editingArea ? '更新' : '追加'}中...` : `${editingArea ? '更新' : '追加'}`}
                  </Button>
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    disabled={submitting}
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* エリア一覧 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">登録済みエリア一覧</h2>
          
          {areas.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-white mb-2">
                エリアが登録されていません
              </h3>
              <p className="text-gray-300 mb-6">
                新しいエリアを追加してください
              </p>
              <Button 
                onClick={() => setShowAddForm(true)}
                variant="primary"
              >
                エリアを追加
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {areas.map((area) => (
                <Card key={area.id} className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{area.label}</h3>
                      <p className="text-gray-400 text-sm">{area.key}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      area.isActive 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {area.isActive ? 'アクティブ' : '非アクティブ'}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">並び順:</span>
                      <span className="text-white text-sm">{area.sortOrder}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(area)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-glow-primary border-glow-primary hover:bg-glow-primary hover:text-white"
                    >
                      編集
                    </Button>
                    <Button
                      onClick={() => handleToggleActive(area.id, area.isActive)}
                      variant={area.isActive ? "secondary" : "primary"}
                      size="sm"
                      className="flex-1"
                    >
                      {area.isActive ? '無効化' : '有効化'}
                    </Button>
                    <Button
                      onClick={() => handleDelete(area.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                    >
                      削除
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    作成日: {new Date(area.createdAt).toLocaleDateString('ja-JP')}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}