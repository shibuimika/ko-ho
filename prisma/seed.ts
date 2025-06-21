import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 シードデータを作成しています...')

  // 1. タグデータを作成
  console.log('📝 タグデータを作成中...')
  const tags = await Promise.all([
    // テクノロジー関連
    prisma.tag.create({ data: { name: 'AI・機械学習', category: 'TECHNOLOGY', weight: 1.5 } }),
    prisma.tag.create({ data: { name: 'DX・デジタル変革', category: 'TECHNOLOGY', weight: 1.4 } }),
    prisma.tag.create({ data: { name: 'クラウド', category: 'TECHNOLOGY', weight: 1.2 } }),
    prisma.tag.create({ data: { name: 'セキュリティ', category: 'TECHNOLOGY', weight: 1.3 } }),
    prisma.tag.create({ data: { name: 'IoT', category: 'TECHNOLOGY', weight: 1.1 } }),
    
    // 業界関連
    prisma.tag.create({ data: { name: 'IT業界', category: 'INDUSTRY', weight: 1.3 } }),
    prisma.tag.create({ data: { name: '金融業界', category: 'INDUSTRY', weight: 1.2 } }),
    prisma.tag.create({ data: { name: '製造業', category: 'INDUSTRY', weight: 1.1 } }),
    
    // ビジネストピック
    prisma.tag.create({ data: { name: 'スタートアップ', category: 'TOPIC', weight: 1.4 } }),
    prisma.tag.create({ data: { name: '投資・資金調達', category: 'TOPIC', weight: 1.3 } }),
    prisma.tag.create({ data: { name: '新サービス', category: 'TOPIC', weight: 1.3 } }),
    
    // 企業関連
    prisma.tag.create({ data: { name: 'リクルート', category: 'COMPANY', weight: 2.0 } }),
  ])

  // 2. 記者データを作成
  console.log('👥 記者データを作成中...')
  const reporters = await Promise.all([
    prisma.reporter.create({
      data: {
        name: '田中 拓也',
        email: 'tanaka@nikkei.com',
        company: '日経新聞',
        phoneNumber: '03-1234-5678',
        socialMedia: JSON.stringify({ twitter: '@tanaka_nikkei', linkedin: 'tanaka-takuya' })
      }
    }),
    prisma.reporter.create({
      data: {
        name: '佐藤 美咲',
        email: 'sato@itmedia.co.jp',
        company: 'ITmedia',
        phoneNumber: '03-2345-6789',
        socialMedia: JSON.stringify({ twitter: '@sato_itmedia' })
      }
    }),
    prisma.reporter.create({
      data: {
        name: '鈴木 健一',
        email: 'suzuki@techcrunch.jp',
        company: 'TechCrunch Japan',
        phoneNumber: '03-3456-7890',
        socialMedia: JSON.stringify({ twitter: '@suzuki_tc', linkedin: 'kenichi-suzuki' })
      }
    })
  ])

  // 3. コンテンツデータを作成
  console.log('📄 コンテンツデータを作成中...')
  const contents = await Promise.all([
    prisma.content.create({
      data: {
        title: 'リクルート、次世代AI技術を活用した求人マッチングシステムを発表',
        summary: 'リクルートは最新のAI技術を活用し、求職者と企業のマッチング精度を大幅に向上させる新システムを開発。従来比30%の精度向上を実現。',
        body: `リクルートホールディング
は本日、AI技術を活用した次世代求人マッチングシステム「AI Match Pro」を発表しました。

このシステムは、機械学習とディープラーニングを組み合わせた独自のアルゴリズムにより、求職者のスキル、経験、志向性と企業のニーズを高精度でマッチングします。`,
        status: 'PUBLISHED'
      }
    }),
    prisma.content.create({
      data: {
        title: 'DX推進支援プログラム「Digital Transformation Academy」開始',
        summary: '企業のデジタル変革を支援する包括的なプログラムを新設。経営層から現場まで、段階的なDX推進をサポート。',
        body: `リクルートテクノロジーズは、企業のDX推進を包括的に支援する「Digital Transformation Academy」の提供を開始します。`,
        status: 'PUBLISHED'
      }
    })
  ])

  // 4. マッチングスコアを生成
  console.log('🎯 マッチングスコアを生成中...')
  await Promise.all([
    prisma.matchingScore.create({
      data: {
        reporterId: reporters[0].id,
        contentId: contents[0].id,
        score: 92.5,
        reasons: JSON.stringify(['AI・機械学習', 'リクルート', '新サービス'])
      }
    }),
    prisma.matchingScore.create({
      data: {
        reporterId: reporters[1].id,
        contentId: contents[1].id,
        score: 88.0,
        reasons: JSON.stringify(['DX・デジタル変革', 'IT業界'])
      }
    })
  ])

  console.log('✅ シードデータの作成が完了しました！')
  console.log(`📊 作成されたデータ:`)
  console.log(`  - タグ: ${tags.length}件`)
  console.log(`  - 記者: ${reporters.length}件`)
  console.log(`  - コンテンツ: ${contents.length}件`)
  console.log(`  - マッチングスコア: 2件`)
}

main()
  .catch((e) => {
    console.error('❌ シードデータ作成中にエラーが発生しました:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 