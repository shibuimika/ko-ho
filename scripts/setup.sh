#!/bin/bash

echo "🚀 Ko-Ho プロジェクトセットアップを開始します..."

# 1. 依存関係のインストール
echo "📦 依存関係をインストールしています..."
npm install

# 2. 環境変数ファイルの作成
if [ ! -f .env ]; then
    echo "🔧 環境変数ファイルを作成しています..."
    cp .env.example .env
    echo "✅ .envファイルを作成しました。適切な値を設定してください。"
else
    echo "✅ .envファイルは既に存在します。"
fi

# 3. Prismaクライアントの生成
echo "🗄️ Prismaクライアントを生成しています..."
npx prisma generate

# 4. データベースの初期化（PostgreSQLが動作している場合）
echo "🗄️ データベースを初期化しています..."
if npx prisma migrate deploy 2>/dev/null; then
    echo "✅ データベースマイグレーションが完了しました。"
else
    echo "⚠️  データベースマイグレーションをスキップしました。"
    echo "   PostgreSQLが起動していることを確認して、後で 'npx prisma migrate dev' を実行してください。"
fi

# 5. 型チェック
echo "🔍 型チェックを実行しています..."
npm run type-check

echo "🎉 セットアップが完了しました！"
echo ""
echo "次のステップ:"
echo "1. .envファイルを編集して環境変数を設定"
echo "2. PostgreSQLデータベースを起動"
echo "3. 'npm run dev' で開発サーバーを起動"
echo ""
echo "詳細な手順は README.md を確認してください。" 