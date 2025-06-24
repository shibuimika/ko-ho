import { Suspense } from 'react'
import { ContentList } from '@/components/contents/content-list'
import { ContentFilters } from '@/components/contents/content-filters'

export default function ContentsPage() {
  return (
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-2xl font-semibold text-gray-900">コンテンツ管理</h1>
                <p className="mt-2 text-sm text-gray-700">
                  プレスリリースやニュースコンテンツを管理し、AI機能で記者マッチングを実行できます
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <a
                  href="/contents/new"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  新規コンテンツ作成
                </a>
              </div>
            </div>

            {/* フィルター機能 */}
            <div className="mt-6">
              <Suspense fallback={<div>フィルターを読み込み中...</div>}>
                <ContentFilters />
              </Suspense>
            </div>

            {/* コンテンツ一覧 */}
            <div className="mt-6">
              <Suspense fallback={<div>コンテンツ一覧を読み込み中...</div>}>
                <ContentList />
              </Suspense>
      </div>
    </div>
  )
} 