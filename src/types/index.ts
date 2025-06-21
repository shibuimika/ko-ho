// 記者の型定義
export interface Reporter {
  id: string;
  name: string;
  email: string;
  company: string;
  phoneNumber?: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
  };
  tags: Tag[];
  articles: Article[];
  createdAt: Date;
  updatedAt: Date;
}

// コンテンツの型定義
export interface Content {
  id: string;
  title: string;
  summary: string;
  body: string;
  tags: Tag[];
  status: ContentStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// タグの型定義
export interface Tag {
  id: string;
  name: string;
  category: TagCategory;
  weight: number;
  createdAt: Date;
}

// 記事の型定義
export interface Article {
  id: string;
  title: string;
  url: string;
  publishedAt: Date;
  summary?: string;
  tags: Tag[];
  reporterId: string;
}

// マッチングスコアの型定義
export interface MatchingScore {
  reporterId: string;
  contentId: string;
  score: number;
  reasons: string[];
  createdAt: Date;
}

// レコメンド文章の型定義
export interface RecommendationDraft {
  id: string;
  reporterId: string;
  contentId: string;
  subject: string;
  body: string;
  tone: DraftTone;
  createdAt: Date;
}

// 文字列リテラル型として定義
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type TagCategory = 'INDUSTRY' | 'TOPIC' | 'COMPANY' | 'TECHNOLOGY' | 'EVENT'
export type DraftTone = 'FORMAL' | 'CASUAL' | 'URGENT'

// APIレスポンスの型定義
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// 検索・フィルター用の型定義
export interface SearchFilters {
  keywords?: string;
  tags?: string[];
  company?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  minScore?: number;
}

// ダッシュボード用の型定義
export interface DashboardData {
  totalReporters: number;
  totalContents: number;
  recentMatches: MatchingScore[];
  topRecommendations: {
    reporter: Reporter;
    content: Content;
    score: number;
  }[];
} 