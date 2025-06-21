import { Suspense } from 'react'
import { ReporterList } from '@/components/reporters/reporter-list'
import { ReporterFilters } from '@/components/reporters/reporter-filters'

export default function ReportersPage() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">記者管理</h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              記者の情報を管理し、プレスリリースの送付先を効率的に選択できます
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <a
              href="/reporters/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              新規記者追加
            </a>
          </div>
        </div>

        {/* フィルター機能 */}
        <div className="mt-6">
          <Suspense fallback={<div>フィルターを読み込み中...</div>}>
            <ReporterFilters />
          </Suspense>
        </div>

        {/* 記者一覧 */}
        <div className="mt-6">
          <Suspense fallback={<div>記者一覧を読み込み中...</div>}>
            <ReporterList />
          </Suspense>
        </div>
      </div>
    </main>
  )
} 