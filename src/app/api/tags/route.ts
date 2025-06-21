import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { tagSchema } from '@/lib/validations'
import { handleApiError } from '@/lib/utils'

// タグ一覧を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''

    const where = {
      AND: [
        category ? { category } : {},
        search ? { name: { contains: search, mode: 'insensitive' as const } } : {},
      ].filter(condition => Object.keys(condition).length > 0)
    }

    const tags = await prisma.tag.findMany({
      where,
      include: {
        _count: {
          select: {
            reporterTags: true,
            contentTags: true,
            articleTags: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    // カテゴリ別統計も一緒に取得
    const categoryStats = await prisma.tag.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    })

    return NextResponse.json({
      data: {
        tags,
        categoryStats
      }
    })
  } catch (error) {
    console.error('タグ一覧取得エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 500 }
    )
  }
}

// 新しいタグを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = tagSchema.parse(body)

    // 同名のタグが既に存在するかチェック
    const existingTag = await prisma.tag.findUnique({
      where: { name: validatedData.name }
    })

    if (existingTag) {
      return NextResponse.json(
        { error: '同名のタグが既に存在します' },
        { status: 400 }
      )
    }

    const tag = await prisma.tag.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        weight: validatedData.weight,
      },
      include: {
        _count: {
          select: {
            reporterTags: true,
            contentTags: true,
            articleTags: true
          }
        }
      }
    })

    return NextResponse.json({
      data: tag,
      message: 'タグが正常に作成されました'
    }, { status: 201 })

  } catch (error) {
    console.error('タグ作成エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 400 }
    )
  }
} 