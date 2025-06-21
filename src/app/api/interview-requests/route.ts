import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateInterviewRequestForReporter, calculateReporterContentMatch } from '@/lib/ai-service'
import { CreateInterviewRequestData } from '@/types'

// インタビュー依頼一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')
    const reporterId = searchParams.get('reporterId')
    const status = searchParams.get('status')

    const where: any = {}
    if (contentId) where.contentId = contentId
    if (reporterId) where.reporterId = reporterId
    if (status) where.status = status

    const interviewRequests = await prisma.interviewRequest.findMany({
      where,
      include: {
        reporter: true,
        content: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // matchingReasonsをJSONパース
    const formattedRequests = interviewRequests.map((request: any) => ({
      ...request,
      matchingReasons: JSON.parse(request.matchingReasons)
    }))

    return NextResponse.json({
      data: formattedRequests,
      count: formattedRequests.length
    })

  } catch (error) {
    console.error('インタビュー依頼一覧取得エラー:', error)
    return NextResponse.json(
      { error: 'インタビュー依頼一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// インタビュー依頼作成
export async function POST(request: NextRequest) {
  try {
    const body: CreateInterviewRequestData = await request.json()
    const { reporterId, contentId, tone = 'FORMAL' } = body

    // 記者とコンテンツの存在確認
    const [reporter, content] = await Promise.all([
      prisma.reporter.findUnique({
        where: { id: reporterId }
      }),
      prisma.content.findUnique({
        where: { id: contentId }
      })
    ])

    if (!reporter) {
      return NextResponse.json(
        { error: '記者が見つかりません' },
        { status: 404 }
      )
    }

    if (!content) {
      return NextResponse.json(
        { error: 'コンテンツが見つかりません' },
        { status: 404 }
      )
    }

    // マッチングスコアを取得または計算
    let matchingScore = await prisma.matchingScore.findUnique({
      where: {
        reporterId_contentId: {
          reporterId,
          contentId
        }
      }
    })

    if (!matchingScore) {
      // マッチングスコアが存在しない場合は新規計算
      const matchResult = await calculateReporterContentMatch(
        {
          id: reporter.id,
          name: reporter.name,
          email: reporter.email,
          company: reporter.company,
          socialMedia: reporter.socialMedia || undefined
        },
        {
          id: content.id,
          title: content.title,
          summary: content.summary,
          body: content.body,
          status: content.status
        }
      )

      matchingScore = await prisma.matchingScore.create({
        data: {
          reporterId,
          contentId,
          score: matchResult.score,
          reasons: JSON.stringify(matchResult.reasons)
        }
      })
    }

    // AI でインタビュー依頼文を生成
    console.log('🎤 インタビュー依頼文生成開始:', reporter.name, 'x', content.title)
    
    const interviewDraft = await generateInterviewRequestForReporter(
      {
        id: reporter.id,
        name: reporter.name,
        email: reporter.email,
        company: reporter.company,
        socialMedia: reporter.socialMedia || undefined
      },
      {
        id: content.id,
        title: content.title,
        summary: content.summary,
        body: content.body,
        status: content.status
      },
      matchingScore.score
    )

    // インタビュー依頼をデータベースに保存
    const interviewRequest = await prisma.interviewRequest.create({
      data: {
        reporterId,
        contentId,
        subject: interviewDraft.subject,
        body: interviewDraft.body,
        matchingReasons: JSON.stringify(interviewDraft.matchingReasons),
        tone,
        status: 'DRAFT'
      },
      include: {
        reporter: true,
        content: true
      }
    })

    console.log('✅ インタビュー依頼作成完了:', interviewRequest.id)

    return NextResponse.json({
      data: {
        ...interviewRequest,
        matchingReasons: JSON.parse(interviewRequest.matchingReasons)
      },
      message: 'インタビュー依頼を作成しました'
    })

  } catch (error) {
    console.error('❌ インタビュー依頼作成エラー:', error)
    return NextResponse.json(
      { error: 'インタビュー依頼の作成に失敗しました' },
      { status: 500 }
    )
  }
} 