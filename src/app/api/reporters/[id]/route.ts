import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { reporterSchema } from '@/lib/validations'
import { handleApiError } from '@/lib/utils'

// 記者詳細を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reporter = await prisma.reporter.findUnique({
      where: { id: params.id },
      include: {
        reporterTags: {
          include: {
            tag: true
          }
        },
        articles: {
          include: {
            articleTags: {
              include: {
                tag: true
              }
            }
          },
          orderBy: { publishedAt: 'desc' }
        },
        matchingScores: {
          include: {
            content: true
          },
          orderBy: { score: 'desc' },
          take: 10
        },
        recommendationDrafts: {
          include: {
            content: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!reporter) {
      return NextResponse.json(
        { error: '記者が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: reporter })
  } catch (error) {
    console.error('記者詳細取得エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 500 }
    )
  }
}

// 記者情報を更新 (PATCH)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = reporterSchema.parse(body)

    const reporter = await prisma.reporter.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company,
        phoneNumber: validatedData.phoneNumber,
        socialMedia: validatedData.socialMedia ? JSON.stringify(validatedData.socialMedia) : null,
      },
      include: {
        reporterTags: {
          include: {
            tag: true
          }
        },
        articles: true,
        _count: {
          select: { articles: true }
        }
      }
    })

    return NextResponse.json({
      data: reporter,
      message: '記者情報が正常に更新されました'
    })
  } catch (error) {
    console.error('記者更新エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 400 }
    )
  }
}

// 記者情報を更新 (PUT)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const reporter = await prisma.reporter.update({
      where: { id: params.id },
      data: {
        name: body.name,
        email: body.email,
        company: body.company,
        phoneNumber: body.phoneNumber || null,
        socialMedia: body.socialMedia || null,
      },
      include: {
        reporterTags: {
          include: {
            tag: true
          }
        },
        articles: true,
        _count: {
          select: { articles: true }
        }
      }
    })

    return NextResponse.json({
      data: reporter,
      message: '記者情報が正常に更新されました'
    })
  } catch (error) {
    console.error('記者更新エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 400 }
    )
  }
}

// 記者を削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.reporter.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: '記者が正常に削除されました'
    })
  } catch (error) {
    console.error('記者削除エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 400 }
    )
  }
} 