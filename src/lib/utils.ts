import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// 日付フォーマット用ユーティリティ
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// スコア計算用ユーティリティ
export function calculateMatchingScore(
  reporterTags: { name: string; weight: number }[],
  contentTags: { name: string; weight: number }[]
): number {
  let score = 0
  let maxScore = 0

  for (const contentTag of contentTags) {
    maxScore += contentTag.weight
    const matchingReporterTag = reporterTags.find(rt => rt.name === contentTag.name)
    if (matchingReporterTag) {
      score += Math.min(contentTag.weight, matchingReporterTag.weight)
    }
  }

  return maxScore > 0 ? (score / maxScore) * 100 : 0
}

// エラーハンドリング用ユーティリティ
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return '予期しないエラーが発生しました'
}

// デバウンス用ユーティリティ
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
} 