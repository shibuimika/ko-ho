import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 個別インタビュー依頼取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const interviewRequest = await prisma.interviewRequest.findUnique({
      where: { id },
      include: {
        reporter: true,
        content: true,
      }
    })

    if (!interviewRequest) {
      return NextResponse.json(
        { error: 'インタビュー依頼が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: {
        ...interviewRequest,
        matchingReasons: JSON.parse(interviewRequest.matchingReasons)
      }
    })

  } catch (error) {
    console.error('インタビュー依頼取得エラー:', error)
    return NextResponse.json(
      { error: 'インタビュー依頼の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// インタビュー依頼更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const { subject, body: requestBody, status, tone } = body

    const updateData: any = {}
    if (subject !== undefined) updateData.subject = subject
    if (requestBody !== undefined) updateData.body = requestBody
    if (status !== undefined) updateData.status = status
    if (tone !== undefined) updateData.tone = tone

    // 送信時刻の更新
    if (status === 'SENT') {
      updateData.sentAt = new Date()
    }

    const interviewRequest = await prisma.interviewRequest.update({
      where: { id },
      data: updateData,
      include: {
        reporter: true,
        content: true,
      }
    })

    return NextResponse.json({
      data: {
        ...interviewRequest,
        matchingReasons: JSON.parse(interviewRequest.matchingReasons)
      },
      message: 'インタビュー依頼を更新しました'
    })

  } catch (error) {
    console.error('インタビュー依頼更新エラー:', error)
    return NextResponse.json(
      { error: 'インタビュー依頼の更新に失敗しました' },
      { status: 500 }
    )
  }
}

// インタビュー依頼削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.interviewRequest.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'インタビュー依頼を削除しました'
    })

  } catch (error) {
    console.error('インタビュー依頼削除エラー:', error)
    return NextResponse.json(
      { error: 'インタビュー依頼の削除に失敗しました' },
      { status: 500 }
    )
  }
} 