import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // キャストが存在するかチェック
    const existingCast = await prisma.cast.findUnique({
      where: { id }
    })

    if (!existingCast) {
      return NextResponse.json(
        { error: 'キャストが見つかりません' },
        { status: 404 }
      )
    }

    // キャストを更新
    const updatedCast = await prisma.cast.update({
      where: { id },
      data: body
    })

    return NextResponse.json(updatedCast)
  } catch (error) {
    console.error('Error updating cast:', error)
    return NextResponse.json(
      { error: 'キャストの更新に失敗しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // キャストが存在するかチェック
    const existingCast = await prisma.cast.findUnique({
      where: { id }
    })

    if (!existingCast) {
      return NextResponse.json(
        { error: 'キャストが見つかりません' },
        { status: 404 }
      )
    }

    // キャストを削除
    await prisma.cast.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'キャストが削除されました' })
  } catch (error) {
    console.error('Error deleting cast:', error)
    return NextResponse.json(
      { error: 'キャストの削除に失敗しました' },
      { status: 500 }
    )
  }
}