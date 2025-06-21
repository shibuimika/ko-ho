import { Suspense } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecommendationList } from '@/components/dashboard/recommendation-list'
import { RecentActivity } from '@/components/dashboard/recent-activity'

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ダッシュボード
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                記者とコンテンツのマッチング状況を確認できます
              </p>
            </div>

            <Suspense fallback={<div>読み込み中...</div>}>
              <DashboardStats />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Suspense fallback={<div>読み込み中...</div>}>
                <RecommendationList />
              </Suspense>
              <Suspense fallback={<div>読み込み中...</div>}>
                <RecentActivity />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 