import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contentSchema } from '@/lib/validations'
import { handleApiError } from '@/lib/utils'

// コンテンツ詳細を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const content = await prisma.content.findUnique({
      where: { id: params.id },
      include: {
        contentTags: {
          include: {
            tag: true
          }
        },
        matchingScores: {
          include: {
            reporter: true
          },
          orderBy: { score: 'desc' }
        },
        recommendationDrafts: {
          include: {
            reporter: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'コンテンツが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: content })
  } catch (error) {
    console.error('コンテンツ詳細取得エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 500 }
    )
  }
}

// コンテンツを更新 (PATCH)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = contentSchema.parse(body)

    const content = await prisma.content.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        summary: validatedData.summary,
        body: validatedData.body,
        status: validatedData.status,
      },
      include: {
        contentTags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: { 
            matchingScores: true,
            recommendationDrafts: true
          }
        }
      }
    })

    return NextResponse.json({
      data: content,
      message: 'コンテンツが正常に更新されました'
    })
  } catch (error) {
    console.error('コンテンツ更新エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 400 }
    )
  }
}

// コンテンツを更新 (PUT)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const content = await prisma.content.update({
      where: { id: params.id },
      data: {
        title: body.title,
        summary: body.summary,
        body: body.body,
        status: body.status,
      },
      include: {
        contentTags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: { 
            matchingScores: true,
            recommendationDrafts: true
          }
        }
      }
    })

    return NextResponse.json({
      data: content,
      message: 'コンテンツが正常に更新されました'
    })
  } catch (error) {
    console.error('コンテンツ更新エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 400 }
    )
  }
}

// コンテンツを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.content.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'コンテンツが正常に削除されました'
    })
  } catch (error) {
    console.error('コンテンツ削除エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 400 }
    )
  }
} 