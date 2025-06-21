import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { SidebarWrapper } from '@/components/layout/sidebar-wrapper'
import { Header } from '@/components/layout/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ko-Ho - 記者とコンテンツのマッチングプラットフォーム',
  description: 'AIを活用した効率的な記者・コンテンツマッチングシステム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <SidebarWrapper />
            <div className="flex-1 flex flex-col lg:pl-[min(25%,320px)]">
              <Header />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
} 