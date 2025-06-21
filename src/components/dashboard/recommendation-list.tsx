'use client'

import { useState, useEffect } from 'react'
import { 
  EnvelopeIcon, 
  SparklesIcon,
  UserIcon,
  ClockIcon,
  EyeIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface RecommendationDraft {
  id: string
  subject: string
  body: string
  tone: string
  createdAt: string
  reporter: {
    id: string
    name: string
    company: string
    email: string
  }
  content: {
    id: string
    title: string
  }
  matchingScore?: {
    score: number
  }
}

export function RecommendationList() {
  const [activeTab, setActiveTab] = useState<'email' | 'interview'>('email')
  const [recommendations, setRecommendations] = useState<RecommendationDraft[]>([])
  const [interviewRequests, setInterviewRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationDraft | null>(null)
  const [selectedInterview, setSelectedInterview] = useState<any | null>(null)

  useEffect(() => {
    fetchRecommendations()
    fetchInterviewRequests()
  }, [])

  const fetchRecommendations = async () => {
    try {
      // 推薦文データを取得する実際のAPIコールを実装
      // 現在はモックデータを使用
      setTimeout(() => {
        const mockData: RecommendationDraft[] = [
          {
            id: '1',
            subject: '【取材ご提案】メディア様向け - DX推進支援プログラム「Digital Transformation Academy」開始について',
            body: '佐藤 美咲さん\n\nいつもお世話になっております。\n\nこの度、弊社では企業のDX推進を包括的に支援する「Digital Transformation Academy」の提供を開始いたします...',
            tone: 'FORMAL',
            createdAt: new Date().toISOString(),
            reporter: {
              id: 'rep1',
              name: '佐藤 美咲',
              company: 'ITmedia',
              email: 'misaki.sato@itmedia.co.jp'
            },
            content: {
              id: 'cont1',
              title: 'DX推進支援プログラム「Digital Transformation Academy」開始'
            },
            matchingScore: {
              score: 84.9
            }
          },
          {
            id: '2',
            subject: '【緊急】新聞様向け - リクルート、次世代AI技術を活用した求人マッチングシステムを発表について',
            body: '田中 拓也さん\n\nお疲れ様です。\n\n弊社では最新のAI技術を活用した次世代求人マッチングシステム「AI Match Pro」を発表いたします...',
            tone: 'FORMAL',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            reporter: {
              id: 'rep2',
              name: '田中 拓也',
              company: '日経新聞',
              email: 'takuya.tanaka@nikkei.com'
            },
            content: {
              id: 'cont2',
              title: 'リクルート、次世代AI技術を活用した求人マッチングシステムを発表'
            },
            matchingScore: {
              score: 92.5
            }
          }
        ]
        setRecommendations(mockData)
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error('推薦文取得エラー:', error)
      setLoading(false)
    }
  }

  const fetchInterviewRequests = async () => {
    try {
      const response = await fetch('/api/interview-requests')
      const data = await response.json()
      setInterviewRequests(data.data || [])
    } catch (error) {
      console.error('インタビュー依頼取得エラー:', error)
    }
  }

  const getToneLabel = (tone: string) => {
    const labels = {
      FORMAL: '丁寧',
      CASUAL: 'カジュアル',
      URGENT: '緊急'
    }
    return labels[tone as keyof typeof labels] || tone
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 75) return 'text-blue-600 bg-blue-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">AI推薦メール</h3>
          <SparklesIcon className="h-5 w-5 text-purple-500" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900">AI推薦・依頼</h3>
            <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
              <SparklesIcon className="h-3 w-3 mr-1" />
              AI生成済み
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {activeTab === 'email' ? `${recommendations.length}件` : `${interviewRequests.length}件`}
          </span>
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('email')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'email'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <EnvelopeIcon className="h-4 w-4 inline mr-1" />
            推薦メール
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'interview'
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-1" />
            インタビュー依頼
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'email' ? (
          recommendations.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">推薦メールなし</h3>
              <p className="mt-1 text-sm text-gray-500">
                コンテンツでAI処理を実行すると推薦メールが生成されます
              </p>
            </div>
          ) : (
          <div className="divide-y divide-gray-200">
            {recommendations.map((recommendation) => (
              <div key={recommendation.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center text-sm text-gray-900">
                        <UserIcon className="h-4 w-4 mr-1" />
                        <span className="font-medium">{recommendation.reporter.name}</span>
                        <span className="text-gray-500 ml-1">({recommendation.reporter.company})</span>
                      </div>
                      {recommendation.matchingScore && (
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getScoreColor(recommendation.matchingScore.score)}`}>
                          マッチ度: {recommendation.matchingScore.score}点
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {getToneLabel(recommendation.tone)}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                      {recommendation.subject}
                    </h4>
                    
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      コンテンツ: {recommendation.content.title}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {new Date(recommendation.createdAt).toLocaleString('ja-JP')}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 ml-4">
                    <button 
                      onClick={() => setSelectedRecommendation(recommendation)}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <PaperAirplaneIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )) : (
          interviewRequests.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">インタビュー依頼なし</h3>
              <p className="mt-1 text-sm text-gray-500">
                コンテンツ詳細ページからインタビュー依頼を作成できます
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {interviewRequests.map((request) => (
                <div key={request.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center text-sm text-gray-900">
                          <UserIcon className="h-4 w-4 mr-1" />
                          <span className="font-medium">{request.reporter?.name}</span>
                          <span className="text-gray-500 ml-1">({request.reporter?.company})</span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'SENT' ? 'bg-green-100 text-green-800' :
                          request.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status === 'SENT' ? '送信済み' : 
                           request.status === 'DRAFT' ? '下書き' : request.status}
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {request.subject}
                      </h4>
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        コンテンツ: {request.content?.title}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {request.sentAt ? 
                          `送信: ${new Date(request.sentAt).toLocaleString('ja-JP')}` :
                          `作成: ${new Date(request.createdAt).toLocaleString('ja-JP')}`
                        }
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 ml-4">
                      <button 
                        onClick={() => setSelectedInterview(request)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {request.status === 'DRAFT' && (
                        <button className="p-1 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded">
                          <PaperAirplaneIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* 推薦文プレビューモーダル */}
      {selectedRecommendation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setSelectedRecommendation(null)}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">推薦メールプレビュー</h3>
                <button 
                  onClick={() => setSelectedRecommendation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">宛先</label>
                  <div className="text-sm text-gray-900">
                    {selectedRecommendation.reporter.name} ({selectedRecommendation.reporter.email})
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
                  <div className="text-sm text-gray-900 border border-gray-300 rounded p-2 bg-gray-50">
                    {selectedRecommendation.subject}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
                  <div className="text-sm text-gray-900 border border-gray-300 rounded p-3 bg-gray-50 whitespace-pre-wrap min-h-48">
                    {selectedRecommendation.body}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setSelectedRecommendation(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  閉じる
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  編集
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700">
                  送信
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* インタビュー依頼プレビューモーダル */}
      {selectedInterview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setSelectedInterview(null)}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">インタビュー依頼プレビュー</h3>
                <button 
                  onClick={() => setSelectedInterview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">宛先</label>
                  <div className="text-sm text-gray-900">
                    {selectedInterview.reporter?.name} ({selectedInterview.reporter?.email})
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    selectedInterview.status === 'SENT' ? 'bg-green-100 text-green-800' :
                    selectedInterview.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedInterview.status === 'SENT' ? '送信済み' : 
                     selectedInterview.status === 'DRAFT' ? '下書き' : selectedInterview.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
                  <div className="text-sm text-gray-900 border border-gray-300 rounded p-2 bg-gray-50">
                    {selectedInterview.subject}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
                  <div className="text-sm text-gray-900 border border-gray-300 rounded p-3 bg-gray-50 whitespace-pre-wrap min-h-48">
                    {selectedInterview.body}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">マッチング理由</label>
                  <div className="text-sm text-gray-900">
                    {selectedInterview.matchingReasons?.map((reason: string, index: number) => (
                      <div key={index} className="flex items-center mb-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setSelectedInterview(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  閉じる
                </button>
                {selectedInterview.status === 'DRAFT' && (
                  <>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                      編集
                    </button>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700">
                      送信
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 