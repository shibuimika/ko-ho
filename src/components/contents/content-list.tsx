'use client'

import { useState, useEffect } from 'react'
import { 
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  ChartBarIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

interface Content {
  id: string
  title: string
  summary: string
  status: string
  createdAt: string
  updatedAt: string
  contentTags: Array<{
    tag: {
      id: string
      name: string
      category: string
    }
    confidence: number
  }>
  matchingScores: Array<{
    reporter: {
      id: string
      name: string
      company: string
    }
    score: number
    reasons: string[]
  }>
  _count: {
    matchingScores: number
    recommendationDrafts: number
  }
}

export function ContentList() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/contents')
      const data = await response.json()
      setContents(data.data.contents)
    } catch (error) {
      console.error('コンテンツ取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const processWithAI = async (contentId: string) => {
    setProcessing(contentId)
    try {
      const response = await fetch('/api/ai/process-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId })
      })
      
      const result = await response.json()
      
      if (result.success) {
        await fetchContents() // リフレッシュ
        alert(`AI処理完了！\n- タグ: ${result.results.tagsGenerated}個\n- マッチング: ${result.results.matchingScores}件\n- 推薦文: ${result.results.recommendations}件`)
      } else {
        alert('AI処理に失敗しました: ' + result.error)
      }
    } catch (error) {
      console.error('AI処理エラー:', error)
      alert('AI処理中にエラーが発生しました')
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      DRAFT: 'bg-yellow-100 text-yellow-800',
      PUBLISHED: 'bg-green-100 text-green-800',
      ARCHIVED: 'bg-gray-100 text-gray-800'
    }
    const labels = {
      DRAFT: '下書き',
      PUBLISHED: '公開済み',
      ARCHIVED: 'アーカイブ'
    }
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  const getTopMatchingReporter = (content: Content) => {
    if (content.matchingScores.length === 0) return null
    return content.matchingScores.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    )
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (contents.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">コンテンツなし</h3>
        <p className="mt-1 text-sm text-gray-500">新しいコンテンツを作成してください</p>
        <div className="mt-6">
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            新規作成
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          コンテンツ一覧 ({contents.length}件)
        </h3>
        
        <div className="space-y-4">
          {contents.map((content) => {
            const topMatch = getTopMatchingReporter(content)
            const hasAIData = content.matchingScores.length > 0 || content.contentTags.length > 0
            
            return (
              <div key={content.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{content.title}</h4>
                      {getStatusBadge(content.status)}
                      {hasAIData && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          <SparklesIcon className="h-3 w-3 mr-1" />
                          AI処理済み
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{content.summary}</p>
                    
                    {/* タグ表示 */}
                    {content.contentTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {content.contentTags.slice(0, 5).map((contentTag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
                            {contentTag.tag.name}
                            <span className="ml-1 text-blue-600">({Math.round(contentTag.confidence * 100)}%)</span>
                          </span>
                        ))}
                        {content.contentTags.length > 5 && (
                          <span className="text-xs text-gray-500">+{content.contentTags.length - 5}個</span>
                        )}
                      </div>
                    )}
                    
                    {/* AI処理結果サマリー */}
                    {hasAIData && (
                      <div className="bg-gray-50 rounded-md p-3 mb-3">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <ChartBarIcon className="h-4 w-4 mr-1" />
                            マッチング: {content._count.matchingScores}件
                          </div>
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-1" />
                            推薦文: {content._count.recommendationDrafts}件
                          </div>
                          {topMatch && (
                            <div className="flex items-center font-medium text-green-600">
                              最高マッチ: {topMatch.reporter.name} ({topMatch.score}点)
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      作成: {new Date(content.createdAt).toLocaleDateString('ja-JP')} | 
                      更新: {new Date(content.updatedAt).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <a 
                      href={`/contents/${content.id}`}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                      title="詳細を見る"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </a>
                    <button 
                      onClick={() => processWithAI(content.id)}
                      disabled={processing === content.id}
                      className="p-2 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-md disabled:opacity-50"
                      title="AI処理を実行"
                    >
                      {processing === content.id ? (
                        <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                      ) : (
                        <SparklesIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 