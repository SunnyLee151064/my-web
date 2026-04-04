import Link from 'next/link';
import { sql } from '@/lib/db';

async function getPhotos() {
  try {
    const photos = await sql`
      SELECT id, url, description, created_at FROM photos
      ORDER BY created_at DESC
    `;
    return photos;
  } catch {
    return [];
  }
}

async function deletePhoto(id: number) {
  'use server';
  try {
    await sql`DELETE FROM photos WHERE id = ${id}`;
  } catch (error) {
    console.error('Delete error:', error);
  }
}

export default function AdminPhotosPage() {
  const photos = getPhotos();

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>🖼️ 管理照片</h1>

      <Link
        href="/admin/photos/upload"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          background: '#0066cc',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none',
          marginBottom: '2rem'
        }}
      >
        + 上传照片
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {(await photos).map((photo) => (
          <div key={photo.id} style={{
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <img
              src={photo.url}
              alt={photo.description || '照片'}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover'
              }}
            />
            <div style={{
              padding: '0.5rem',
              background: 'white'
            }}>
              {photo.description && (
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: '#666' }}>
                  {photo.description}
                </p>
              )}
              <form action={async () => {
                'use server';
                await deletePhoto(photo.id);
              }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.25rem',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  删除
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link
          href="/welcome"
          style={{ color: '#0066cc', textDecoration: 'underline' }}
        >
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}