import Link from 'next/link';
import { sql } from '@/lib/db';

// 强制动态渲染
export const dynamic = 'force-dynamic';

async function getPhotos() {
  try {
    const db = sql();
    const photos = await db`
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
      <h1 style={{ marginBottom: '2rem' }}>Photos</h1>

      {photos.length === 0 ? (
        <p style={{ color: '#666' }}>No photos</p>
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
                alt={photo.description || 'Photo'}
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
        <button
          onClick={() => {
            window.location.href = '/';
          }}
          style={{
            background: 'transparent',
            border: '1px solid #0066cc',
            color: '#0066cc',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#0066cc';
            (e.currentTarget as HTMLElement).style.color = 'white';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#0066cc';
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}