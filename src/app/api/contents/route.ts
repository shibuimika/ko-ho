import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contentSchema } from '@/lib/validations'
import { handleApiError } from '@/lib/utils'

// コンテンツ一覧を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // 検索条件を作成
    const where = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { summary: { contains: search, mode: 'insensitive' as const } },
            { body: { contains: search, mode: 'insensitive' as const } },
          ]
        } : {},
        status ? { status } : {},
      ].filter(condition => Object.keys(condition).length > 0)
    }

    const [contents, totalCount] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: limit,
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
            orderBy: { score: 'desc' },
            take: 5
          },
          _count: {
            select: { 
              matchingScores: true,
              recommendationDrafts: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.content.count({ where })
    ])

    return NextResponse.json({
      data: {
        contents,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    })
  } catch (error) {
    console.error('コンテンツ一覧取得エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 500 }
    )
  }
}

// 新しいコンテンツを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contentSchema.parse(body)

    const content = await prisma.content.create({
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
      message: 'コンテンツが正常に作成されました'
    }, { status: 201 })

  } catch (error) {
    console.error('コンテンツ作成エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 400 }
    )
  }
} 