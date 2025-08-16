import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Area } from '@/types'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const area = await prisma.areaMaster.findUnique({
      where: { id }
    })

    if (!area) {
      return NextResponse.json(
        { error: 'エリアが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(area)
  } catch (error) {
    console.error('Error fetching area:', error)
    return NextResponse.json(
      { error: 'エリアの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // エリアが存在するかチェック
    const existingArea = await prisma.areaMaster.findUnique({
      where: { id }
    })

    if (!existingArea) {
      return NextResponse.json(
        { error: 'エリアが見つかりません' },
        { status: 404 }
      )
    }

    // キーが変更されている場合、重複チェック
    if (body.key && body.key !== existingArea.key) {
      const duplicateArea = await prisma.areaMaster.findUnique({
        where: { key: body.key }
      })

      if (duplicateArea) {
        return NextResponse.json(
          { error: 'このキーは既に使用されています' },
          { status: 400 }
        )
      }
    }

    // エリアを更新
    const updatedArea = await prisma.areaMaster.update({
      where: { id },
      data: body
    })

    return NextResponse.json(updatedArea)
  } catch (error) {
    console.error('Error updating area:', error)
    return NextResponse.json(
      { error: 'エリアの更新に失敗しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    // エリアが存在するかチェック
    const existingArea = await prisma.areaMaster.findUnique({
      where: { id }
    })

    if (!existingArea) {
      return NextResponse.json(
        { error: 'エリアが見つかりません' },
        { status: 404 }
      )
    }

    // このエリアを使用しているキャストがあるかチェック
    const castsUsingArea = await prisma.cast.findMany({
      where: { area: existingArea.key as Area }
    })

    if (castsUsingArea.length > 0) {
      return NextResponse.json(
        { error: 'このエリアを使用しているキャストが存在するため削除できません' },
        { status: 400 }
      )
    }

    // エリアを削除
    await prisma.areaMaster.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'エリアが削除されました' })
  } catch (error) {
    console.error('Error deleting area:', error)
    return NextResponse.json(
      { error: 'エリアの削除に失敗しました' },
      { status: 500 }
    )
  }
}