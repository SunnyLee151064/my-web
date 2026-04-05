'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Photo {
  id: number;
  url: string;
  description: string | null;
  created_at: string;
}

interface Album {
  id: number;
  name: string;
  is_default: boolean;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPhotos();
  }, [selectedAlbum]);

  const fetchPhotos = async () => {
    try {
      const url = selectedAlbum ? `/api/photos?album_id=${selectedAlbum}` : '/api/photos';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPhotos(data.photos || []);
        setAlbums(data.albums || []);
      }
    } catch (err) {
      console.error('Failed to fetch photos:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundImage: `url('/Rain.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url('/Rain.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* 背景模糊层 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: -1
      }} />

      {/* 返回按钮 */}
      <button
        onClick={() => router.push('/')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '500',
          color: 'white',
          fontSize: '0.9rem',
          transition: 'all 0.3s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        ← Back
      </button>

      {/* 标题 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 3rem',
        paddingTop: '2rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: 'white',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          margin: 0
        }}>
          <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px', width: '36px', height: '36px', fill: 'white' }}>
            <path d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z m-277.333334-213.333333h-384v320h213.333334v-170.666667h170.666666v-149.333333z m0 213.333333h-106.666666v106.666667h106.666666v-106.666667z" />
          </svg>
          <span style={{
            fontFamily: 'cursive',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Photos</span>
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.5rem', fontSize: '1rem' }}>
          记录美好瞬间
        </p>
        
        {/* 图集选择器 */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            onClick={() => setSelectedAlbum(null)}
            style={{
              padding: '0.5rem 1rem',
              background: selectedAlbum === null ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          >
            所有照片
          </button>
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => setSelectedAlbum(album.id)}
              style={{
                padding: '0.5rem 1rem',
                background: selectedAlbum === album.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
            >
              {album.name} {album.is_default && '(默认)'}
            </button>
          ))}
        </div>
      </div>

      {/* 照片网格 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {photos.length === 0 ? (
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            No photos yet
          </div>
        ) : (
          photos.map((photo, index) => (
            <div
              key={photo.id}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.25)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <div style={{
                width: '100%',
                height: '200px',
                overflow: 'hidden'
              }}>
                <img
                  src={photo.url}
                  alt={photo.description || 'Photo'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </div>
              {photo.description && (
                <div style={{
                  padding: '1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <p style={{
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem'
                  }}>
                    {photo.description}
                  </p>
                  <p style={{
                    margin: '0.5rem 0 0',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.8rem'
                  }}>
                    {new Date(photo.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}