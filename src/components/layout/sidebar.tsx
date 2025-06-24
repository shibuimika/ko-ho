'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  TagIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'ダッシュボード', href: '/', icon: HomeIcon },
  { name: '記者管理', href: '/reporters', icon: UserGroupIcon },
  { name: 'コンテンツ管理', href: '/contents', icon: DocumentTextIcon },
  { name: 'タグ管理', href: '/tags', icon: TagIcon },
  { name: '分析・レポート', href: '/analytics', icon: ChartBarIcon },
  { name: '設定', href: '/settings', icon: Cog6ToothIcon },
]

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* モバイル用サイドバー */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-50 flex" style={{ display: sidebarOpen ? 'flex' : 'none' }}>
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent pathname={pathname} />
          </div>
          <div className="w-14 flex-shrink-0" aria-hidden="true" />
        </div>
      </div>

      {/* デスクトップ用サイドバー */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-[min(22vw,320px)] md:min-w-[160px] md:max-w-[340px] md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto bg-white border-r border-gray-200">
          <SidebarContent pathname={pathname} />
        </div>
      </div>

      {/* モバイル用メニューボタン */}
      <div className="lg:hidden fixed top-0 left-0 z-40 p-4">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
    </>
  )
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-grow flex-col">
      <div className="flex flex-shrink-0 items-center px-3 md:px-4 py-5">
        <h1 className="text-xl font-bold text-gray-900">Ko-Ho</h1>
      </div>
      <nav className="flex-1 space-y-1 px-1 md:px-2 pb-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md whitespace-normal break-words break-all transition-colors
                ${isActive
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon
                className={`h-6 w-6 flex-shrink-0 ${
                  isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 