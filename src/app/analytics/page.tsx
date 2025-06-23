import { Suspense } from 'react'

export default function AnalyticsPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">分析・レポート</h1>
          <p className="mt-2 text-sm text-gray-700">
            AI活用の効果測定とマッチング精度の分析データをご確認いただけます
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            レポート出力
          </button>
        </div>
      </div>

      {/* 分析機能は開発中メッセージ */}
      <div className="mt-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">分析機能開発中</h3>
            <p className="mt-1 text-sm text-gray-500">
              詳細な分析機能は現在開発中です。<br/>
              基本的なAI処理とマッチング機能は正常に動作しています。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 