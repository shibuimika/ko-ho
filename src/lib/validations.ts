import { z } from 'zod'

// 記者作成・更新用のスキーマ
export const reporterSchema = z.object({
  name: z.string().min(1, '名前は必須です').max(100, '名前は100文字以内で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  company: z.string().min(1, '媒体名は必須です').max(100, '媒体名は100文字以内で入力してください'),
  phoneNumber: z.string().optional(),
  socialMedia: z.object({
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
})

// コンテンツ作成・更新用のスキーマ
export const contentSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  summary: z.string().min(1, '概要は必須です').max(500, '概要は500文字以内で入力してください'),
  body: z.string().min(1, '本文は必須です'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
})

// タグ作成用のスキーマ
export const tagSchema = z.object({
  name: z.string().min(1, 'タグ名は必須です').max(50, 'タグ名は50文字以内で入力してください'),
  category: z.enum(['INDUSTRY', 'TOPIC', 'COMPANY', 'TECHNOLOGY', 'EVENT']),
  weight: z.number().min(0).max(10).default(1),
})

// 記事追加用のスキーマ
export const articleSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  url: z.string().url('有効なURLを入力してください'),
  publishedAt: z.date(),
  summary: z.string().optional(),
  reporterId: z.string().min(1, '記者IDは必須です'),
})

// 検索・フィルター用のスキーマ
export const searchFiltersSchema = z.object({
  keywords: z.string().optional(),
  tags: z.array(z.string()).optional(),
  company: z.string().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  minScore: z.number().min(0).max(100).optional(),
})

// API共通レスポンス用のスキーマ
export const apiResponseSchema = <T>(dataSchema: z.ZodType<T>) => z.object({
  data: dataSchema,
  message: z.string().optional(),
  error: z.string().optional(),
})

export type ReporterInput = z.infer<typeof reporterSchema>
export type ContentInput = z.infer<typeof contentSchema>
export type TagInput = z.infer<typeof tagSchema>
export type ArticleInput = z.infer<typeof articleSchema>
export type SearchFiltersInput = z.infer<typeof searchFiltersSchema> 