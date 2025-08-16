import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const areas = await prisma.areaMaster.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json(areas)
  } catch (error) {
    console.error('Error fetching areas:', error)
    return NextResponse.json(
      { error: 'エリアの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, label, sortOrder } = body

    // バリデーション
    if (!key || !label) {
      return NextResponse.json(
        { error: 'キーとラベルは必須です' },
        { status: 400 }
      )
    }

    // キーの重複チェック
    const existingArea = await prisma.areaMaster.findUnique({
      where: { key }
    })

    if (existingArea) {
      return NextResponse.json(
        { error: 'このキーは既に使用されています' },
        { status: 400 }
      )
    }

    // エリアを作成
    const area = await prisma.areaMaster.create({
      data: {
        key,
        label,
        sortOrder: sortOrder || 0,
        isActive: true
      }
    })

    return NextResponse.json(area, { status: 201 })
  } catch (error) {
    console.error('Error creating area:', error)
    return NextResponse.json(
      { error: 'エリアの作成に失敗しました' },
      { status: 500 }
    )
  }
}