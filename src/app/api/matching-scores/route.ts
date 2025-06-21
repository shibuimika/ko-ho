import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const contentId = searchParams.get('contentId')
    const reporterId = searchParams.get('reporterId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    console.log('📊 マッチングスコア取得開始')

    // フィルター条件を構築
    const where: any = {}
    if (contentId) where.contentId = contentId
    if (reporterId) where.reporterId = reporterId

    // マッチングスコアを取得（関連データも含める）
    const [matchingScores, total] = await Promise.all([
      prisma.matchingScore.findMany({
        where,
        include: {
          reporter: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
              socialMedia: true,
            }
          },
          content: {
            select: {
              id: true,
              title: true,
              summary: true,
              status: true,
              publishedAt: true,
            }
          }
        },
        orderBy: {
          score: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.matchingScore.count({ where })
    ])

    // レスポンス用にデータを整形
    const formattedScores = matchingScores.map((score: any) => ({
      id: `${score.reporterId}-${score.contentId}`,
      score: score.score,
      reasons: JSON.parse(score.reasons || '[]'),
      createdAt: score.createdAt,
      reporter: {
        id: score.reporter.id,
        name: score.reporter.name,
        email: score.reporter.email,
        company: score.reporter.company,
        socialMedia: score.reporter.socialMedia ? JSON.parse(score.reporter.socialMedia) : null,
      },
      content: {
        id: score.content.id,
        title: score.content.title,
        summary: score.content.summary,
        status: score.content.status,
        publishedAt: score.content.publishedAt,
      }
    }))

    console.log(`✅ マッチングスコア ${formattedScores.length}件を取得`)

    return NextResponse.json({
      success: true,
      data: formattedScores,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })

  } catch (error) {
    console.error('❌ マッチングスコア取得エラー:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'マッチングスコア取得中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// 特定のコンテンツの上位マッチング記者を取得
export async function POST(req: NextRequest) {
  try {
    const { contentId, topN = 5 } = await req.json()

    if (!contentId) {
      return NextResponse.json(
        { error: 'コンテンツIDが必要です' },
        { status: 400 }
      )
    }

    console.log(`🎯 コンテンツ ${contentId} の上位${topN}記者を取得`)

    const topMatches = await prisma.matchingScore.findMany({
      where: { contentId },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            socialMedia: true,
          }
        }
      },
      orderBy: {
        score: 'desc'
      },
      take: topN,
    })

    const formattedMatches = topMatches.map((match: any) => ({
      reporterId: match.reporterId,
      reporter: {
        id: match.reporter.id,
        name: match.reporter.name,
        email: match.reporter.email,
        company: match.reporter.company,
        socialMedia: match.reporter.socialMedia ? JSON.parse(match.reporter.socialMedia) : null,
      },
      score: match.score,
      reasons: JSON.parse(match.reasons || '[]'),
      createdAt: match.createdAt,
    }))

    console.log(`✅ 上位${formattedMatches.length}記者を取得`)

    return NextResponse.json({
      success: true,
      contentId,
      topMatches: formattedMatches,
      message: `上位${formattedMatches.length}記者のマッチング情報を取得しました`
    })

  } catch (error) {
    console.error('❌ 上位マッチング取得エラー:', error)
    return NextResponse.json(
      { 
        success: false,
        error: '上位マッチング取得中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 