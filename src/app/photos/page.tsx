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

export default async function PhotosPage() {
  const photos = await getPhotos();

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>📷 照片</h1>

      {photos.length === 0 ? (
        <p style={{ color: '#666' }}>暂无照片</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {photos.map((photo) => (
            <div key={photo.id} style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <img
                src={photo.url}
                alt={photo.description || '照片'}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              {photo.description && (
                <p style={{
                  padding: '0.5rem',
                  margin: 0,
                  background: 'white',
                  fontSize: '0.9rem',
                  color: '#666'
                }}>
                  {photo.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

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