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

    console.log('Casts API - Search parameters:', { area, serviceType, budgetRange, includeInactive })

    // フィルター条件を構築
    const where: Prisma.CastWhereInput = {}

    // adminのリクエストの場合、非アクティブも含める
    if (!includeInactive) {
      where.isActive = true
    }

    if (area) {
      where.area = area
      console.log(`Filtering by area: ${area}`)
    }

    if (serviceType) {
      where.serviceType = serviceType
      console.log(`Filtering by serviceType: ${serviceType}`)
    }

    if (budgetRange) {
      where.budgetRange = budgetRange
      console.log(`Filtering by budgetRange: ${budgetRange}`)
    }

    console.log('Prisma where clause:', JSON.stringify(where, null, 2))

    // キャストを検索
    const casts = await prisma.cast.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Found ${casts.length} casts matching criteria`)
    if (casts.length > 0) {
      console.log('Sample cast:', JSON.stringify(casts[0], null, 2))
    }

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
    console.log('キャスト作成リクエスト受信:', body)
    
    const { name, snsLink, storeLink, area, serviceType, budgetRange } = body

    // 詳細なバリデーション
    const missingFields = []
    if (!name) missingFields.push('name')
    if (!snsLink) missingFields.push('snsLink')
    if (!area) missingFields.push('area')
    if (!serviceType) missingFields.push('serviceType')
    if (!budgetRange) missingFields.push('budgetRange')

    if (missingFields.length > 0) {
      const errorMessage = `必須フィールドが不足しています: ${missingFields.join(', ')}`
      console.error('バリデーションエラー:', errorMessage)
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    // 型の確認
    console.log('フィールドの型チェック:', {
      name: typeof name,
      snsLink: typeof snsLink,
      storeLink: typeof storeLink,
      area: typeof area,
      serviceType: typeof serviceType,
      budgetRange: typeof budgetRange
    })

    // 既存のSNSリンクをチェック
    const existingCast = await prisma.cast.findUnique({
      where: { snsLink }
    })

    if (existingCast) {
      console.error('重複エラー: SNSリンクが既に使用されています:', snsLink)
      return NextResponse.json(
        { error: 'このSNSリンクは既に使用されています' },
        { status: 400 }
      )
    }

    // キャストを作成
    console.log('キャスト作成データ:', {
      name,
      snsLink,
      storeLink: storeLink || null,
      area,
      serviceType,
      budgetRange,
      isActive: true
    })

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

    console.log('キャスト作成成功:', cast)
    return NextResponse.json(cast, { status: 201 })
  } catch (error) {
    console.error('キャスト作成エラー:', error)
    
    // エラー情報を詳細にログ出力（コピー可能な形式で）
    const errorInfo: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }
    
    // Prismaエラーの場合は追加情報を含める
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: unknown }
      errorInfo.prismaCode = prismaError.code
      if ('meta' in error) {
        errorInfo.prismaMeta = prismaError.meta
      }
    }
    
    console.error('=== キャスト作成エラー詳細（コピー用） ===')
    console.error(JSON.stringify(errorInfo, null, 2))
    console.error('=== エラー詳細終了 ===')
    
    // Prismaエラーの詳細を確認
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Prisma エラーコード:', error.code)
      if ('meta' in error) {
        console.error('Prisma エラーメタ:', error.meta)
      }
    }
    
    return NextResponse.json(
      { 
        error: 'キャストの作成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: errorInfo.timestamp,
        // 開発環境でのみ詳細情報を含める
        ...(process.env.NODE_ENV === 'development' && {
          debugInfo: errorInfo
        })
      },
      { status: 500 }
    )
  }
}