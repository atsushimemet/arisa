import { NextRequest, NextResponse } from 'next/server'
import { Area, ServiceType, BudgetRange } from '@/types'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const area = searchParams.get('area') as Area | null
    const serviceType = searchParams.get('serviceType') as ServiceType | null
    const budgetRange = searchParams.get('budgetRange') as BudgetRange | null
    const includeInactive = searchParams.get('includeInactive') === 'true'

    // フィルター条件を構築
    const where: Prisma.CastWhereInput = {}

    // adminのリクエストの場合、非アクティブも含める
    if (!includeInactive) {
      where.isActive = true
    }

    if (area) {
      where.area = area
    }

    if (serviceType) {
      where.serviceType = serviceType
    }

    if (budgetRange) {
      where.budgetRange = budgetRange
    }

    // キャストを検索
    const casts = await prisma.cast.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(casts)
  } catch (error) {
    console.error('Error fetching casts:', error)
    return NextResponse.json(
      { error: 'キャストの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, snsLink, storeLink, area, serviceType, budgetRange } = body

    // バリデーション
    if (!name || !snsLink || !area || !serviceType || !budgetRange) {
      return NextResponse.json(
        { error: '必須フィールドが不足しています' },
        { status: 400 }
      )
    }

    // キャストを作成
    const cast = await prisma.cast.create({
      data: {
        name,
        snsLink,
        storeLink: storeLink || null,
        area,
        serviceType,
        budgetRange,
        isActive: true
      }
    })

    return NextResponse.json(cast, { status: 201 })
  } catch (error) {
    console.error('Error creating cast:', error)
    return NextResponse.json(
      { error: 'キャストの作成に失敗しました' },
      { status: 500 }
    )
  }
}