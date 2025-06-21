'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contentSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  summary: z.string().min(1, '要約は必須です'),
  body: z.string().min(1, '本文は必須です'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

type ContentFormData = z.infer<typeof contentSchema>;

export default function NewContentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      status: 'DRAFT',
    },
  });

  const onSubmit = async (data: ContentFormData) => {
    setSaving(true);
    try {
      const response = await fetch('/api/contents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('コンテンツを作成しました');
        router.push('/contents');
      } else {
        alert('作成に失敗しました');
      }
    } catch (error) {
      console.error('作成エラー:', error);
      alert('作成に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = [
    { value: 'DRAFT', label: '下書き' },
    { value: 'PUBLISHED', label: '公開済み' },
    { value: 'ARCHIVED', label: 'アーカイブ' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">新規コンテンツ作成</h1>
          <button
            onClick={() => router.push('/contents')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            戻る
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル *
            </label>
            <input
              {...register('title')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="プレスリリースのタイトルを入力"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              要約 *
            </label>
            <textarea
              {...register('summary')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="コンテンツの要約を入力"
            />
            {errors.summary && (
              <p className="text-red-600 text-sm mt-1">{errors.summary.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              本文 *
            </label>
            <textarea
              {...register('body')}
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="プレスリリースの詳細内容を入力"
            />
            {errors.body && (
              <p className="text-red-600 text-sm mt-1">{errors.body.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ステータス *
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 ヒント</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 作成後にAI処理を実行すると、自動でタグ付けとマッチングが行われます</li>
              <li>• 下書きで保存して後から編集することも可能です</li>
              <li>• 公開済みにすると記者へのレコメンド対象になります</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? '作成中...' : '作成'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/contents')}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 