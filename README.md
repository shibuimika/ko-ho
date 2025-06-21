# Ko-Ho

企業広報チーム向けAI統合プレスリリース管理システム

## 🚀 概要

Ko-Hoは、企業広報チームの業務効率化を目的としたWebアプリケーションです。記者データベースとコンテンツデータベースを連携し、AI技術を活用した自動タグ付け、マッチングスコア算出、レコメンド文章生成により、プレスリリースの開封率・取材率向上を実現します。

## ✨ 主要機能

### 📊 ダッシュボード
- 統計情報の可視化
- 最近のアクティビティ表示
- AI推薦メール一覧

### 👥 記者管理
- 記者情報のCRUD操作
- 詳細プロフィール管理
- SNS情報管理

### 📄 コンテンツ管理
- プレスリリースのCRUD操作
- ステータス管理（下書き・公開済み・アーカイブ）
- AI処理結果表示

### 🤖 AI機能
- **自動タグ付け**: コンテンツを分析して関連タグを自動生成
- **マッチングスコア算出**: 記者とコンテンツの適合度を数値化
- **レコメンド文章生成**: 個別記者向けのパーソナライズされたメール文面を自動作成

### 📧 メール管理
- 推薦メールの送信
- 送信履歴管理
- 開封率追跡

## 🛠 技術スタック

- **フロントエンド**: Next.js 14, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: SQLite (開発環境) + Prisma ORM
- **AI機能**: Qwen-3連携
- **UI**: React Hook Form, Headless UI, Heroicons

## 📦 インストール

```bash
# リポジトリをクローン
git clone https://github.com/jokerjunya/ko-ho.git
cd ko-ho

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# .envファイルを編集してDATABASE_URLを設定

# データベースをセットアップ
npx prisma db push
npx prisma db seed

# 開発サーバーを起動
npm run dev
```

## 🔧 環境変数

```env
DATABASE_URL="file:./prisma/dev.db"
```

## 📚 API エンドポイント

### 記者API
- `GET /api/reporters` - 記者一覧取得
- `POST /api/reporters` - 新規記者作成
- `GET /api/reporters/[id]` - 記者詳細取得
- `PUT /api/reporters/[id]` - 記者情報更新
- `DELETE /api/reporters/[id]` - 記者削除

### コンテンツAPI
- `GET /api/contents` - コンテンツ一覧取得
- `POST /api/contents` - 新規コンテンツ作成
- `GET /api/contents/[id]` - コンテンツ詳細取得
- `PUT /api/contents/[id]` - コンテンツ更新
- `DELETE /api/contents/[id]` - コンテンツ削除

### AI処理API
- `POST /api/ai/process-content` - AI統合処理実行

### その他API
- `GET /api/tags` - タグ一覧取得
- `GET /api/matching-scores` - マッチングスコア取得
- `POST /api/mail/send` - メール送信

## 🎯 使用方法

1. **記者管理**: `/reporters` で記者情報を管理
2. **コンテンツ作成**: `/contents/new` で新規プレスリリースを作成
3. **AI処理**: コンテンツ詳細ページでAI処理を実行
4. **メール送信**: ダッシュボードから推薦メールを送信

## 📁 プロジェクト構造

```
ko-ho/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   ├── reporters/      # 記者管理ページ
│   │   ├── contents/       # コンテンツ管理ページ
│   │   └── analytics/      # 分析ページ
│   ├── components/         # Reactコンポーネント
│   ├── lib/               # ユーティリティ関数
│   └── types/             # TypeScript型定義
├── prisma/                # データベーススキーマ
├── docs/                  # ドキュメント
└── scripts/              # セットアップスクリプト
```

## 🔄 開発フロー

1. コンテンツ作成
2. AI処理実行（自動タグ付け・マッチング）
3. 記者選定
4. メール送信
5. 効果測定

## 📈 AI処理フロー

1. **コンテンツ分析**: タイトル・要約・本文を解析
2. **タグ生成**: 関連キーワードを自動抽出
3. **マッチング**: 記者の専門分野と照合
4. **スコア算出**: 適合度を0-100点で数値化
5. **文章生成**: 個別最適化されたメール文面を作成

## 🎯 開発状況

### ✅ 完了済み機能
- **Phase 1**: 基盤構築（Next.js、データベース、型定義）
- **Phase 2**: 基本機能実装（記者・コンテンツCRUD）
- **Phase 3**: AI機能統合（自動タグ付け、マッチング、レコメンド生成）
- **Phase 4**: 高度機能（編集・削除、メール送信、分析機能）

### 📊 実装済みデータ
- 記者: 4名のサンプルデータ
- コンテンツ: 3件のサンプルプレスリリース
- タグ: 12種類（AI・機械学習、DX・デジタル変革、IT業界等）

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 📞 サポート

質問や問題がある場合は、GitHubのIssueを作成してください。 