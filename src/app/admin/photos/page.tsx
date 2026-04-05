'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  role: string;
}

interface Photo {
  id: number;
  url: string;
  description: string;
  created_at: string;
}

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.role !== 'admin') {
        router.push('/');
      } else {
        fetchPhotos();
      }
    }
  }, [router]);

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/photos');
      const data = await res.json();
      if (data.success) {
        setPhotos(data.photos || []);
      }
    } catch (err) {
      console.error('Failed to fetch photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const res = await fetch(`/api/photos/delete?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        // 重新获取列表
        await fetchPhotos();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Manage Photos</h1>

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
        + Upload Photo
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <img
              src={photo.url}
              alt={photo.description || 'Photo'}
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
              <button
                onClick={() => handleDelete(photo.id)}
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
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link
          href="/"
          style={{ color: '#0066cc', textDecoration: 'underline' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}