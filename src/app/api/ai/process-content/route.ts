import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { processContentWithAI } from '@/lib/ai-service'

export async function POST(req: NextRequest) {
  try {
    const { contentId } = await req.json()

    if (!contentId) {
      return NextResponse.json(
        { error: 'コンテンツIDが必要です' },
        { status: 400 }
      )
    }

    console.log('🚀 AI処理開始 - コンテンツID:', contentId)

    // 1. コンテンツデータを取得
    const content = await prisma.content.findUnique({
      where: { id: contentId },
    })

    if (!content) {
      return NextResponse.json(
        { error: 'コンテンツが見つかりません' },
        { status: 404 }
      )
    }

    // 2. 全記者データを取得
    const reporters = await prisma.reporter.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        socialMedia: true,
      }
    })

    // 3. AI処理を実行
    const aiResults = await processContentWithAI(
      {
        id: content.id,
        title: content.title,
        summary: content.summary,
        body: content.body,
        status: content.status,
      },
      reporters.map((reporter: {
        id: string;
        name: string;
        email: string;
        company: string;
        socialMedia: string | null;
      }) => ({
        id: reporter.id,
        name: reporter.name,
        email: reporter.email,
        company: reporter.company,
        socialMedia: reporter.socialMedia || undefined,
      }))
    )

    // 4. データベースに結果を保存
    
    // a) 自動タグをデータベースに保存
    for (const tagSuggestion of aiResults.tags) {
      // 既存タグをチェック
      let tag = await prisma.tag.findUnique({
        where: { name: tagSuggestion.name }
      })

      // タグが存在しない場合は作成
      if (!tag) {
        tag = await prisma.tag.create({
          data: {
            name: tagSuggestion.name,
            category: tagSuggestion.category,
            weight: tagSuggestion.confidence,
          }
        })
      }

      // コンテンツとタグの関連付け
      await prisma.contentTag.upsert({
        where: {
          contentId_tagId: {
            contentId: content.id,
            tagId: tag.id,
          }
        },
        update: {
          confidence: tagSuggestion.confidence,
        },
        create: {
          contentId: content.id,
          tagId: tag.id,
          confidence: tagSuggestion.confidence,
        }
      })
    }

    // b) マッチングスコアをデータベースに保存
    for (const matchingResult of aiResults.matchingResults) {
      await prisma.matchingScore.upsert({
        where: {
          reporterId_contentId: {
            reporterId: matchingResult.reporterId,
            contentId: matchingResult.contentId,
          }
        },
        update: {
          score: matchingResult.score,
          reasons: JSON.stringify(matchingResult.reasons),
        },
        create: {
          reporterId: matchingResult.reporterId,
          contentId: matchingResult.contentId,
          score: matchingResult.score,
          reasons: JSON.stringify(matchingResult.reasons),
        }
      })
    }

    // c) レコメンド文章をデータベースに保存
    for (const recommendation of aiResults.recommendations) {
      await prisma.recommendationDraft.create({
        data: {
          reporterId: recommendation.reporterId,
          contentId: content.id,
          subject: recommendation.draft.subject,
          body: recommendation.draft.body,
          tone: recommendation.draft.tone,
        }
      })
    }

    console.log('✅ AI処理完了 - データベース保存完了')

    return NextResponse.json({
      success: true,
      message: 'AI処理が完了しました',
      results: {
        contentId: content.id,
        contentTitle: content.title,
        tagsGenerated: aiResults.tags.length,
        matchingScores: aiResults.matchingResults.length,
        recommendations: aiResults.recommendations.length,
        highScoreReporters: aiResults.matchingResults.filter(r => r.score >= 75).length,
      },
      data: aiResults
    })

  } catch (error) {
    console.error('❌ AI処理エラー:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'AI処理中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 