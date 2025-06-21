'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils'

interface Activity {
  id: string
  type: 'match' | 'content' | 'reporter'
  title: string
  description: string
  createdAt: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: 実際のAPIからデータを取得
    // 今は仮のデータを使用
    setTimeout(() => {
      setActivities([
        {
          id: '1',
          type: 'match',
          title: '新しいマッチングが見つかりました',
          description: '田中太郎記者とAI技術のコンテンツで92%のマッチング',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30分前
        },
        {
          id: '2',
          type: 'content',
          title: '新しいコンテンツが追加されました',
          description: 'DX推進の取り組みについてのプレスリリース',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2時間前
        },
        {
          id: '3',
          type: 'reporter',
          title: '記者情報が更新されました',
          description: '佐藤花子記者のプロフィールが更新されました',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() // 6時間前
        },
        {
          id: '4',
          type: 'match',
          title: 'ドラフトメールが生成されました',
          description: '鈴木一郎記者向けのドラフトメールを自動生成',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1日前
        }
      ])
      setLoading(false)
    }, 2000)
  }, [])

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'match':
        return '🎯'
      case 'content':
        return '📄'
      case 'reporter':
        return '👤'
      default:
        return '📝'
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'match':
        return 'bg-green-100 text-green-800'
      case 'content':
        return 'bg-blue-100 text-blue-800'
      case 'reporter':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">最近のアクティビティ</h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">最近のアクティビティ</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">
                          {activity.title}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {formatDate(new Date(activity.createdAt))}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>{activity.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 