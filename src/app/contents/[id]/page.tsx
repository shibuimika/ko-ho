'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Content } from '@/types';

const contentSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  summary: z.string().min(1, '要約は必須です'),
  body: z.string().min(1, '本文は必須です'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface ContentDetailPageProps {
  params: { id: string };
}

export default function ContentDetailPage({ params }: ContentDetailPageProps) {
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
  });

  useEffect(() => {
    fetchContent();
  }, [params.id]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/contents/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data.data);
        reset({
          title: data.data.title,
          summary: data.data.summary,
          body: data.data.body,
          status: data.data.status,
        });
      }
    } catch (error) {
      console.error('コンテンツデータの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ContentFormData) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/contents/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setContent(updatedData.data);
        setIsEditing(false);
        alert('コンテンツを更新しました');
      } else {
        alert('更新に失敗しました');
      }
    } catch (error) {
      console.error('更新エラー:', error);
      alert('更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('このコンテンツを削除しますか？')) return;

    try {
      const response = await fetch(`/api/contents/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('コンテンツを削除しました');
        router.push('/contents');
      } else {
        alert('削除に失敗しました');
      }
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました');
    }
  };

  const handleAIProcess = async () => {
    if (!confirm('このコンテンツをAI処理しますか？')) return;

    try {
      const response = await fetch('/api/ai/process-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId: params.id }),
      });

      if (response.ok) {
        alert('AI処理が完了しました');
        fetchContent(); // データを再取得
      } else {
        alert('AI処理に失敗しました');
      }
    } catch (error) {
      console.error('AI処理エラー:', error);
      alert('AI処理に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">コンテンツが見つかりません</div>
      </div>
    );
  }

  const statusOptions = [
    { value: 'DRAFT', label: '下書き' },
    { value: 'PUBLISHED', label: '公開済み' },
    { value: 'ARCHIVED', label: 'アーカイブ' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">コンテンツ詳細</h1>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/contents')}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              戻る
            </button>
            {!isEditing && (
              <>
                <button
                  onClick={handleAIProcess}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  AI処理
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  編集
                </button>
              </>
            )}
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              削除
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイトル *
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                キャンセル
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">基本情報</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">タイトル:</span>
                      <p className="text-gray-900 font-medium">{content.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">ステータス:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        content.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                        content.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {statusOptions.find(opt => opt.value === content.status)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">要約:</span>
                      <p className="text-gray-900">{content.summary}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">作成・更新日時</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">作成日:</span>
                      <p className="text-gray-900">{new Date(content.createdAt).toLocaleString('ja-JP')}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">更新日:</span>
                      <p className="text-gray-900">{new Date(content.updatedAt).toLocaleString('ja-JP')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">本文</h3>
                <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-900">
                    {content.body}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 