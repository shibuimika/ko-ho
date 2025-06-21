'use client'

import { useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { 
  XMarkIcon,
  UserIcon,
  SparklesIcon,
  CheckIcon,
  ClockIcon,
  EyeIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'
import { ReporterCandidate, Content, InterviewRequest, DraftTone } from '@/types'

interface ReporterSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  content: Content
  onInterviewRequestCreated: (request: InterviewRequest) => void
}

export function ReporterSelectionModal({ 
  isOpen, 
  onClose, 
  content, 
  onInterviewRequestCreated 
}: ReporterSelectionModalProps) {
  const [step, setStep] = useState<'selection' | 'preview' | 'success'>('selection')
  const [candidates, setCandidates] = useState<ReporterCandidate[]>([])
  const [selectedReporter, setSelectedReporter] = useState<ReporterCandidate | null>(null)
  const [interviewRequest, setInterviewRequest] = useState<InterviewRequest | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [selectedTone, setSelectedTone] = useState<DraftTone>('FORMAL')

  useEffect(() => {
    if (isOpen) {
      fetchReporterCandidates()
    }
  }, [isOpen, content.id])

  const fetchReporterCandidates = async () => {
    setLoading(true)
    try {
      // 記者一覧を取得
      const reportersResponse = await fetch('/api/reporters')
      const reportersData = await reportersResponse.json()
      
      // マッチングスコアを取得
      const scoresResponse = await fetch(`/api/matching-scores?contentId=${content.id}`)
      const scoresData = await scoresResponse.json()
      
      // 記者とマッチングスコアを組み合わせて候補を作成
      const candidatesData: ReporterCandidate[] = reportersData.data.reporters.map((reporter: any) => {
        const matchingScore = scoresData.data.find((score: any) => score.reporterId === reporter.id)
        return {
          reporter,
          matchingScore: matchingScore || { score: 0, reasons: [] },
          reasons: matchingScore ? JSON.parse(matchingScore.reasons) : []
        }
      })

      // スコア順でソート
      candidatesData.sort((a, b) => b.matchingScore.score - a.matchingScore.score)
      setCandidates(candidatesData)
      
    } catch (error) {
      console.error('記者候補取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReporterSelect = (candidate: ReporterCandidate) => {
    setSelectedReporter(candidate)
  }

  const handleGenerateRequest = async () => {
    if (!selectedReporter) return

    setGenerating(true)
    try {
      const response = await fetch('/api/interview-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reporterId: selectedReporter.reporter.id,
          contentId: content.id,
          tone: selectedTone
        })
      })

      if (response.ok) {
        const data = await response.json()
        setInterviewRequest(data.data)
        setStep('preview')
      } else {
        alert('インタビュー依頼の生成に失敗しました')
      }
    } catch (error) {
      console.error('インタビュー依頼生成エラー:', error)
      alert('インタビュー依頼の生成に失敗しました')
    } finally {
      setGenerating(false)
    }
  }

  const handleSendRequest = async () => {
    if (!interviewRequest) return

    try {
      const response = await fetch(`/api/interview-requests/${interviewRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'SENT'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setInterviewRequest(data.data)
        setStep('success')
        onInterviewRequestCreated(data.data)
      } else {
        alert('インタビュー依頼の送信に失敗しました')
      }
    } catch (error) {
      console.error('インタビュー依頼送信エラー:', error)
      alert('インタビュー依頼の送信に失敗しました')
    }
  }

  const handleClose = () => {
    setStep('selection')
    setSelectedReporter(null)
    setInterviewRequest(null)
    onClose()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const toneOptions = [
    { value: 'FORMAL' as DraftTone, label: '丁寧' },
    { value: 'CASUAL' as DraftTone, label: 'カジュアル' },
    { value: 'URGENT' as DraftTone, label: '緊急' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={handleClose}>
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="mr-2">✨</span>
              {step === 'selection' && 'インタビュー記者選定'}
              {step === 'preview' && 'インタビュー依頼プレビュー'}
              {step === 'success' && 'インタビュー依頼完了'}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">対象コンテンツ</h4>
            <p className="text-sm text-gray-600">{content.title}</p>
          </div>

          {step === 'selection' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">記者候補一覧</h4>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">文章のトーン:</label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value as DraftTone)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    {toneOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">記者候補を読み込み中...</div>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.reporter.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedReporter?.reporter.id === candidate.reporter.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleReporterSelect(candidate)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm">👤</span>
                            <span className="font-medium text-gray-900">{candidate.reporter.name}</span>
                            <span className="text-sm text-gray-500">({candidate.reporter.company})</span>
                            {selectedReporter?.reporter.id === candidate.reporter.id && (
                              <span className="text-blue-500">✓</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getScoreColor(candidate.matchingScore.score)}`}>
                              マッチ度: {candidate.matchingScore.score}点
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>マッチング理由:</strong> {candidate.reasons.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleGenerateRequest}
                  disabled={!selectedReporter || generating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      AI生成中...
                    </div>
                  ) : (
                    '依頼文を生成'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && interviewRequest && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm">👤</span>
                  <span className="font-medium text-blue-900">
                    {interviewRequest.reporter?.name} ({interviewRequest.reporter?.company})
                  </span>
                </div>
                <div className="text-sm text-blue-700">
                  マッチング理由: {interviewRequest.matchingReasons.join(', ')}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
                  <div className="p-3 bg-gray-50 border rounded-md">
                    <p className="text-sm text-gray-900">{interviewRequest.subject}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
                  <div className="p-3 bg-gray-50 border rounded-md max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap">{interviewRequest.body}</pre>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setStep('selection')}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  戻る
                </button>
                <button
                  onClick={handleSendRequest}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  📧 依頼を送信
                </button>
              </div>
            </div>
          )}

          {step === 'success' && interviewRequest && (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                インタビュー依頼を送信しました
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {interviewRequest.reporter?.name}さんに依頼が送信されました。
              </p>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <span className="mr-1">🕐</span>
                送信日時: {interviewRequest.sentAt ? new Date(interviewRequest.sentAt).toLocaleString('ja-JP') : ''}
              </div>
              <div className="mt-6">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  完了
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 