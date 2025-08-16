import { useState, useEffect } from 'react'
import { AreaMaster } from '@/types'

export interface AreaOption {
  value: string
  label: string
}

export function useAreas() {
  const [areas, setAreas] = useState<AreaMaster[]>([])
  const [areaOptions, setAreaOptions] = useState<AreaOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAreas()
  }, [])

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/areas')
      if (!response.ok) {
        throw new Error('エリアの取得に失敗しました')
      }
      const data: AreaMaster[] = await response.json()
      
      // アクティブなエリアのみをフィルタリング
      const activeAreas = data.filter(area => area.isActive)
      setAreas(data)
      
      // セレクトボックス用のオプション形式に変換
      const options = activeAreas.map(area => ({
        value: area.key,
        label: area.label
      }))
      setAreaOptions(options)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const getAreaLabel = (key: string): string => {
    const area = areas.find(area => area.key === key)
    return area ? area.label : key
  }

  return {
    areas,
    areaOptions,
    loading,
    error,
    getAreaLabel,
    refetch: fetchAreas
  }
}