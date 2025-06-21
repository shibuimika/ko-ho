'use client'

import { useState, useEffect } from 'react'
import { UserGroupIcon, DocumentTextIcon, TagIcon, ChartBarIcon } from '@heroicons/react/24/outline'

interface DashboardStats {
  totalReporters: number
  totalContents: number
  totalTags: number
  recentMatches: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReporters: 0,
    totalContents: 0,
    totalTags: 0,
    recentMatches: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: 実際のAPIからデータを取得
    // 今は仮のデータを使用
    setTimeout(() => {
      setStats({
        totalReporters: 127,
        totalContents: 45,
        totalTags: 28,
        recentMatches: 89
      })
      setLoading(false)
    }, 1000)
  }, [])

  const statCards = [
    {
      name: '登録記者数',
      value: stats.totalReporters,
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'コンテンツ数',
      value: stats.totalContents,
      icon: DocumentTextIcon,
      color: 'bg-green-500'
    },
    {
      name: 'タグ数',
      value: stats.totalTags,
      icon: TagIcon,
      color: 'bg-yellow-500'
    },
    {
      name: '今月のマッチング',
      value: stats.recentMatches,
      icon: ChartBarIcon,
      color: 'bg-purple-500'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-300 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-2 rounded-md ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stat.value.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 