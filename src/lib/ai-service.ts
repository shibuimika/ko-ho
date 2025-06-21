import { spawn } from 'child_process'
import { promisify } from 'util'
import path from 'path'

// AI機能のためのインターフェース
export interface TagSuggestion {
  name: string
  category: 'INDUSTRY' | 'TOPIC' | 'COMPANY' | 'TECHNOLOGY' | 'EVENT'
  confidence: number
}

export interface MatchingScoreResult {
  reporterId: string
  contentId: string
  score: number
  reasons: string[]
}

export interface RecommendationDraft {
  subject: string
  body: string
  tone: 'FORMAL' | 'CASUAL' | 'URGENT'
}

export interface InterviewRequestDraft {
  subject: string
  body: string
  matchingReasons: string[]
  tone: 'FORMAL' | 'CASUAL' | 'URGENT'
}

export interface ReporterProfile {
  id: string
  name: string
  email: string
  company: string
  socialMedia?: string
}

export interface ContentProfile {
  id: string
  title: string
  summary: string
  body: string
  status: string
}

class AIService {
  private qwenPath: string
  private isActive: boolean = false

  constructor() {
    this.qwenPath = process.env.QWEN_MODEL_PATH || '/Users/01062544/Documents/ADK_qwen3'
  }

  /**
   * コンテンツ分析による自動タグ付与
   */
  async generateTags(content: ContentProfile): Promise<TagSuggestion[]> {
    console.log('🏷️ AI自動タグ付与を開始:', content.title)
    
    try {
      // 実際の実装では、Qwen-3を使用してタグを生成
      // 現在はデモ用の模擬データを返す
      const mockTags: TagSuggestion[] = [
        { name: 'AI・機械学習', category: 'TECHNOLOGY', confidence: 0.95 },
        { name: 'IT業界', category: 'INDUSTRY', confidence: 0.8 },
        { name: 'DX・デジタル変革', category: 'TECHNOLOGY', confidence: 0.85 },
        { name: 'リクルート', category: 'COMPANY', confidence: 0.9 }
      ]

      // コンテンツ内容によるタグ選択ロジック
      const relevantTags = mockTags.filter(tag => {
        const contentText = `${content.title} ${content.summary} ${content.body}`.toLowerCase()
        
        if (tag.name.includes('AI') && contentText.includes('ai')) return true
        if (tag.name.includes('DX') && contentText.includes('dx')) return true
        if (tag.name.includes('リクルート') && contentText.includes('リクルート')) return true
        if (tag.name.includes('IT') && (contentText.includes('it') || contentText.includes('システム'))) return true
        
        return false
      })

      console.log(`✅ ${relevantTags.length}個のタグを生成しました`)
      return relevantTags

    } catch (error) {
      console.error('❌ AI自動タグ付与エラー:', error)
      return []
    }
  }

  /**
   * 記者とコンテンツのマッチングスコア計算
   */
  async calculateMatchingScore(
    reporter: ReporterProfile,
    content: ContentProfile
  ): Promise<MatchingScoreResult> {
    console.log('🎯 マッチングスコア計算を開始:', reporter.name, 'x', content.title)

    try {
      // 実際の実装では、Qwen-3を使用してマッチングスコアを計算
      // 現在はデモ用の計算ロジック
      const reporterKeywords = this.extractKeywords(reporter.company)
      const contentKeywords = this.extractKeywords(`${content.title} ${content.summary}`)
      
      // 共通キーワードによるスコア計算
      const commonKeywords = reporterKeywords.filter(keyword => 
        contentKeywords.some(contentKeyword => 
          contentKeyword.toLowerCase().includes(keyword.toLowerCase())
        )
      )

      const baseScore = Math.min(90, commonKeywords.length * 15 + 60)
      const score = baseScore + Math.random() * 10

      const reasons = [
        ...commonKeywords.slice(0, 3),
        '記者の専門性',
        '関連性の高さ'
      ]

      console.log(`✅ マッチングスコア: ${score.toFixed(1)}`)
      
      return {
        reporterId: reporter.id,
        contentId: content.id,
        score: Math.round(score * 10) / 10,
        reasons
      }

    } catch (error) {
      console.error('❌ マッチングスコア計算エラー:', error)
      return {
        reporterId: reporter.id,
        contentId: content.id,
        score: 0,
        reasons: ['計算エラー']
      }
    }
  }

  /**
   * 個別記者向けレコメンド文章生成
   */
  async generateRecommendation(
    reporter: ReporterProfile,
    content: ContentProfile,
    matchingScore: number
  ): Promise<RecommendationDraft> {
    console.log('✉️ レコメンド文章生成を開始:', reporter.name)

    try {
      // 実際の実装では、Qwen-3を使用してパーソナライズされた文章を生成
      // 現在はテンプレートベースの生成
      const tone = matchingScore > 85 ? 'URGENT' : 'FORMAL'
      
      const subject = this.generateSubject(content, reporter, matchingScore)
      const body = this.generateBody(content, reporter, matchingScore)

      console.log('✅ レコメンド文章を生成しました')
      
      return {
        subject,
        body,
        tone
      }

    } catch (error) {
      console.error('❌ レコメンド文章生成エラー:', error)
      return {
        subject: '【取材ご提案】' + content.title,
        body: 'レコメンド文章の生成に失敗しました。',
        tone: 'FORMAL'
      }
    }
  }

  /**
   * インタビュー依頼文生成
   */
  async generateInterviewRequest(
    reporter: ReporterProfile,
    content: ContentProfile,
    matchingScore: number
  ): Promise<InterviewRequestDraft> {
    console.log('🎤 インタビュー依頼文生成を開始:', reporter.name)

    try {
      // 実際の実装では、Qwen-3を使用してパーソナライズされた依頼文を生成
      const tone = matchingScore > 85 ? 'URGENT' : 'FORMAL'
      
      const subject = this.generateInterviewSubject(content, reporter)
      const body = this.generateInterviewBody(content, reporter, matchingScore)
      const matchingReasons = this.generateMatchingReasons(reporter, content, matchingScore)

      console.log('✅ インタビュー依頼文を生成しました')
      
      return {
        subject,
        body,
        matchingReasons,
        tone
      }

    } catch (error) {
      console.error('❌ インタビュー依頼文生成エラー:', error)
      return {
        subject: '【インタビューご依頼】' + content.title,
        body: 'インタビュー依頼文の生成に失敗しました。',
        matchingReasons: ['生成エラー'],
        tone: 'FORMAL'
      }
    }
  }

  /**
   * プロセス全体の実行（コンテンツ公開時に自動実行）
   */
  async processContent(
    content: ContentProfile,
    reporters: ReporterProfile[]
  ): Promise<{
    tags: TagSuggestion[]
    matchingResults: MatchingScoreResult[]
    recommendations: Array<{
      reporterId: string
      draft: RecommendationDraft
    }>
  }> {
    console.log('🚀 AI処理を開始:', content.title)
    console.log(`📊 対象記者数: ${reporters.length}人`)

    try {
      // 1. 自動タグ付与
      const tags = await this.generateTags(content)

      // 2. 各記者とのマッチングスコア計算
      const matchingResults = await Promise.all(
        reporters.map(reporter => this.calculateMatchingScore(reporter, content))
      )

      // 3. 高スコア記者向けレコメンド文章生成（スコア75以上）
      const highScoreReporters = matchingResults.filter(result => result.score >= 75)
      const recommendations = await Promise.all(
        highScoreReporters.map(async (result) => {
          const reporter = reporters.find(r => r.id === result.reporterId)!
          const draft = await this.generateRecommendation(reporter, content, result.score)
          return {
            reporterId: result.reporterId,
            draft
          }
        })
      )

      console.log('✅ AI処理完了')
      console.log(`📝 生成タグ数: ${tags.length}`)
      console.log(`🎯 マッチング結果: ${matchingResults.length}件`)
      console.log(`✉️ レコメンド文章: ${recommendations.length}件`)

      return {
        tags,
        matchingResults,
        recommendations
      }

    } catch (error) {
      console.error('❌ AI処理エラー:', error)
      throw error
    }
  }

  // ヘルパーメソッド
  private extractKeywords(text: string): string[] {
    const keywords = [
      'AI', 'DX', 'IT', 'クラウド', 'セキュリティ', 'IoT', 
      'スタートアップ', '投資', '金融', '製造', '教育',
      'リクルート', 'テクノロジー', 'デジタル', 'システム'
    ]
    
    return keywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  private generateSubject(content: ContentProfile, reporter: ReporterProfile, score: number): string {
    const urgency = score > 85 ? '【緊急】' : '【取材ご提案】'
    const company = reporter.company.includes('新聞') ? '新聞' : 'メディア'
    
    return `${urgency}${company}様向け - ${content.title}について`
  }

  private generateBody(content: ContentProfile, reporter: ReporterProfile, score: number): string {
    const honorific = reporter.company.includes('新聞') ? '様' : 'さん'
    const urgency = score > 85 ? 'ぜひ優先的に' : ''
    
    return `${reporter.name}${honorific}

いつもお世話になっております。
リクルート広報担当です。

${content.summary}

${reporter.company}でご活躍の${reporter.name}${honorific}の専門性に非常に適した内容と判断し、${urgency}取材をご提案させていただきます。

マッチングスコア: ${score}点

詳細についてご説明の機会をいただければ幸いです。
お忙しい中恐縮ですが、ご検討のほどよろしくお願いいたします。

リクルート広報チーム`
  }

  private generateInterviewSubject(content: ContentProfile, reporter: ReporterProfile): string {
    return `【インタビューご依頼】${content.title} - ${reporter.company}様向けご提案`
  }

  private generateInterviewBody(content: ContentProfile, reporter: ReporterProfile, score: number): string {
    const honorific = reporter.company.includes('新聞') ? '様' : 'さん'
    
    return `${reporter.name}${honorific}

いつもお世話になっております。
企業広報担当です。

この度、弊社では「${content.title}」に関する取り組みについて、ぜひ${reporter.name}${honorific}にインタビューをお願いしたく、ご連絡いたします。

【なぜ${reporter.name}${honorific}にお願いしたいか】
${reporter.name}${honorific}が${reporter.company}で執筆されている記事の専門性と今回の内容が非常に高い親和性を持っているため、読者の皆様にとって価値のある記事になると確信しております。

【内容概要】
${content.summary}

【インタビュー形式】
- 所要時間: 30-45分程度
- 形式: オンライン・対面どちらでも対応可能
- 日程: ${reporter.name}${honorific}のご都合に合わせて調整いたします

マッチング度: ${score}点

詳細な資料や追加情報をご用意しておりますので、ご興味をお持ちいただけましたら、お気軽にお声がけください。

何卒よろしくお願いいたします。

企業広報部`
  }

  private generateMatchingReasons(reporter: ReporterProfile, content: ContentProfile, score: number): string[] {
    const reasons = []
    
    // 会社に基づく理由
    if (reporter.company.includes('IT') || reporter.company.includes('テック')) {
      reasons.push('IT・テクノロジー分野の専門性')
    }
    
    // コンテンツに基づく理由
    if (content.title.includes('AI') || content.body.includes('AI')) {
      reasons.push('AI技術への深い理解と取材実績')
    }
    
    if (content.title.includes('DX') || content.body.includes('DX')) {
      reasons.push('DX・デジタル変革分野での豊富な執筆経験')
    }
    
    // スコアに基づく理由
    if (score >= 80) {
      reasons.push('記事内容と専門分野の高い一致度')
    }
    
    // 一般的な理由
    reasons.push(`${reporter.company}の読者層との親和性`)
    reasons.push('過去の取材実績と記事品質')
    
    return reasons.slice(0, 4) // 最大4つの理由を返す
  }
}

// シングルトンインスタンス
export const aiService = new AIService()

// 使いやすいヘルパー関数
export async function processContentWithAI(
  content: ContentProfile,
  reporters: ReporterProfile[]
) {
  return await aiService.processContent(content, reporters)
}

export async function generateTagsForContent(content: ContentProfile) {
  return await aiService.generateTags(content)
}

export async function calculateReporterContentMatch(
  reporter: ReporterProfile,
  content: ContentProfile
) {
  return await aiService.calculateMatchingScore(reporter, content)
}

export async function generateInterviewRequestForReporter(
  reporter: ReporterProfile,
  content: ContentProfile,
  matchingScore: number
) {
  return await aiService.generateInterviewRequest(reporter, content, matchingScore)
} 