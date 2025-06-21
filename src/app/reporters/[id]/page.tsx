'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Reporter } from '@/types';

const reporterSchema = z.object({
  name: z.string().min(1, '記者名は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  company: z.string().min(1, '会社名は必須です'),
  phoneNumber: z.string().optional(),
  socialMedia: z.string().optional(),
});

type ReporterFormData = z.infer<typeof reporterSchema>;

interface ReporterDetailPageProps {
  params: { id: string };
}

export default function ReporterDetailPage({ params }: ReporterDetailPageProps) {
  const router = useRouter();
  const [reporter, setReporter] = useState<Reporter | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReporterFormData>({
    resolver: zodResolver(reporterSchema),
  });

  useEffect(() => {
    fetchReporter();
  }, [params.id]);

  const fetchReporter = async () => {
    try {
      const response = await fetch(`/api/reporters/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setReporter(data.data);
        reset({
          name: data.data.name,
          email: data.data.email,
          company: data.data.company,
          phoneNumber: data.data.phoneNumber || '',
          socialMedia: data.data.socialMedia || '',
        });
      }
    } catch (error) {
      console.error('記者データの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ReporterFormData) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/reporters/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setReporter(updatedData.data);
        setIsEditing(false);
        alert('記者情報を更新しました');
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
    if (!confirm('この記者を削除しますか？')) return;

    try {
      const response = await fetch(`/api/reporters/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('記者を削除しました');
        router.push('/reporters');
      } else {
        alert('削除に失敗しました');
      }
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!reporter) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">記者が見つかりません</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">記者詳細</h1>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/reporters')}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              戻る
            </button>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                編集
              </button>
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
                記者名 *
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス *
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                会社名 *
              </label>
              <input
                {...register('company')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.company && (
                <p className="text-red-600 text-sm mt-1">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                電話番号
              </label>
              <input
                {...register('phoneNumber')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SNS情報 (JSON形式)
              </label>
              <textarea
                {...register('socialMedia')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='{"twitter": "@username", "linkedin": "profile"}'
              />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">基本情報</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">記者名:</span>
                    <p className="text-gray-900">{reporter.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">メールアドレス:</span>
                    <p className="text-gray-900">{reporter.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">会社名:</span>
                    <p className="text-gray-900">{reporter.company}</p>
                  </div>
                  {reporter.phoneNumber && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">電話番号:</span>
                      <p className="text-gray-900">{reporter.phoneNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">SNS情報</h3>
                {reporter.socialMedia ? (
                  <pre className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {JSON.stringify(JSON.parse(reporter.socialMedia), null, 2)}
                  </pre>
                ) : (
                  <p className="text-gray-500">SNS情報なし</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">作成・更新日時</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">作成日:</span>
                  <p className="text-gray-900">{new Date(reporter.createdAt).toLocaleString('ja-JP')}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">更新日:</span>
                  <p className="text-gray-900">{new Date(reporter.updatedAt).toLocaleString('ja-JP')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 