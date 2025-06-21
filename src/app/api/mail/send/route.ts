import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/utils'

// メール送信API
export async function POST(req: NextRequest) {
  try {
    const { 
      recommendationId, 
      reporterEmail, 
      subject, 
      body, 
      contentId 
    } = await req.json()

    if (!reporterEmail || !subject || !body) {
      return NextResponse.json(
        { error: '必要なフィールドが不足しています' },
        { status: 400 }
      )
    }

    console.log('📧 メール送信開始:', {
      to: reporterEmail,
      subject: subject.substring(0, 50) + '...',
      contentId
    })

    // 実際のメール送信処理を実装
    // 現在はログ出力のみ（実装時にはSendGrid、AWS SES等を使用）
    const mailResult = await sendMailMock({
      to: reporterEmail,
      subject,
      body
    })

    if (mailResult.success) {
      // 送信履歴をデータベースに記録
      const mailLog = await prisma.mailLog.create({
        data: {
          reporterEmail,
          subject,
          body,
          contentId: contentId || null,
          recommendationId: recommendationId || null,
          status: 'SENT',
          sentAt: new Date(),
        }
      })

      console.log('✅ メール送信完了:', mailLog.id)

      return NextResponse.json({
        success: true,
        message: 'メールが正常に送信されました',
        mailLogId: mailLog.id
      })
    } else {
      // 送信失敗を記録
      await prisma.mailLog.create({
        data: {
          reporterEmail,
          subject,
          body,
          contentId: contentId || null,
          recommendationId: recommendationId || null,
          status: 'FAILED',
          error: mailResult.error,
        }
      })

      return NextResponse.json(
        { 
          success: false,
          error: 'メール送信に失敗しました: ' + mailResult.error 
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ メール送信API エラー:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'メール送信中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// メール送信のモック関数（実装時は実際のメール送信サービスに置き換え）
async function sendMailMock({ to, subject, body }: {
  to: string
  subject: string
  body: string
}): Promise<{ success: boolean; error?: string }> {
  
  // 実際の実装例:
  // - SendGrid を使用する場合
  // - AWS SES を使用する場合  
  // - Nodemailer を使用する場合
  
  try {
    console.log(`📬 [MOCK] メール送信シミュレーション:`)
    console.log(`  宛先: ${to}`)
    console.log(`  件名: ${subject}`)
    console.log(`  本文長: ${body.length}文字`)
    
    // 模擬的な送信遅延
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 10%の確率で失敗をシミュレート（テスト用）
    if (Math.random() < 0.1) {
      return { 
        success: false, 
        error: 'Network timeout - メール送信サービスへの接続がタイムアウトしました' 
      }
    }
    
    return { success: true }
    
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown mail service error' 
    }
  }
}

// 送信履歴取得API
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    const where = {
      ...(status && { status })
    }

    const [mailLogs, totalCount] = await Promise.all([
      prisma.mailLog.findMany({
        where,
        skip,
        take: limit,
        include: {
          content: {
            select: {
              id: true,
              title: true
            }
          },
          recommendationDraft: {
            select: {
              id: true,
              reporter: {
                select: {
                  name: true,
                  company: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.mailLog.count({ where })
    ])

    return NextResponse.json({
      data: {
        mailLogs,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    })
  } catch (error) {
    console.error('送信履歴取得エラー:', error)
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 500 }
    )
  }
} 