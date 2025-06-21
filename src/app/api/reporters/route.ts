import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { reporterSchema } from '@/lib/validations'
import { handleApiError } from '@/lib/utils'

// 記者一覧を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const company = searchParams.get('company') || ''

    const skip = (page - 1) * limit

    // 検索条件を作成
    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ]
        } : {},
        company ? { company: { contains: company, mode: 'insensitive' as const } } : {},
      ].filter(condition => Object.keys(condition).length > 0)
    }

    const [reporters, totalCount] = await Promise.all([
      prisma.reporter.findMany({
        where,
        skip,
        take: limit,
        include: {
          reporterTags: {
            include: {
              tag: true
            }
          },
          articles: {
            orderBy: { publishedAt: 'desc' },
            take: 3,
            include: {
              articleTags: {
                include: {
                  tag: true
                }
              }
            }
          },
          _count: {
            select: { articles: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.reporter.count({ where })
    ])

    return NextResponse.json({
      data: {
        reporters,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    })
  } catch (error) {
    console.error('記者一覧取得エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 500 }
    )
  }
}

// 新しい記者を作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = reporterSchema.parse(body)

    const reporter = await prisma.reporter.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company,
        phoneNumber: validatedData.phoneNumber,
        socialMedia: validatedData.socialMedia,
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
      message: '記者が正常に作成されました'
    }, { status: 201 })

  } catch (error) {
    console.error('記者作成エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 400 }
    )
  }
} 