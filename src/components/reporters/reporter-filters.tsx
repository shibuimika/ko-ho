'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export function ReporterFilters() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const handleSearch = () => {
    // TODO: 検索機能を実装
    console.log('検索:', { searchTerm, selectedCompany, selectedTag })
  }

  const handleReset = () => {
    setSearchTerm('')
    setSelectedCompany('')
    setSelectedTag('')
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 検索欄 */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            記者・媒体名で検索
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="記者名、媒体名を入力..."
            />
          </div>
        </div>

        {/* 媒体フィルター */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            媒体
          </label>
          <select
            id="company"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">すべて</option>
            <option value="朝日新聞">朝日新聞</option>
            <option value="読売新聞">読売新聞</option>
            <option value="日経新聞">日経新聞</option>
            <option value="TechCrunch">TechCrunch</option>
            <option value="IT media">IT media</option>
          </select>
        </div>

        {/* タグフィルター */}
        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
            専門分野
          </label>
          <select
            id="tag"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">すべて</option>
            <option value="テクノロジー">テクノロジー</option>
            <option value="ビジネス">ビジネス</option>
            <option value="教育">教育</option>
            <option value="ヘルスケア">ヘルスケア</option>
            <option value="エンタメ">エンタメ</option>
          </select>
        </div>
      </div>

      {/* ボタン */}
      <div className="mt-4 flex justify-end space-x-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          リセット
        </button>
        <button
          type="button"
          onClick={handleSearch}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          検索
        </button>
      </div>
    </div>
  )
} 