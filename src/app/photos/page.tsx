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
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
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
        backgroundImage: `url('/boatseas.jpg')`,
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
      backgroundImage: `url('/boatseas.jpg')`,
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
          background: 'rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.25)',
          borderRadius: '7px',
          cursor: 'pointer',
          fontWeight: '500',
          color: 'white',
          fontSize: '0.9rem',
          transition: 'all 0.3s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        ← Back
      </button>

      {/* 图片查看弹窗 */}
      {showPhotoModal && selectedPhoto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }} onClick={() => setShowPhotoModal(false)}>
          <div style={{
            maxWidth: '90%',
            maxHeight: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 101
          }} onClick={(e) => e.stopPropagation()}>
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowPhotoModal(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                width: '30px',
                height: '30px',
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                cursor: 'pointer',
                color: 'white',
                fontSize: '1.2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                zIndex: 102
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.7)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.5)';
              }}
            >
              ×
            </button>
            
            {/* 图片 */}
            <div style={{
              maxHeight: '80vh',
              overflow: 'hidden',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.description || 'Photo'}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '80vh',
                  objectFit: 'contain'
                }}
              />
            </div>
            
            {/* 图片描述 */}
            {selectedPhoto.description && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                maxWidth: '80%',
                textAlign: 'center'
              }}>
                <h3 style={{
                  margin: '0 0 0.5rem',
                  fontSize: '1.1rem',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  图片描述
                </h3>
                <p style={{
                  margin: '0 0 0.5rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem'
                }}>
                  {selectedPhoto.description}
                </p>
                <p style={{
                  margin: 0,
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.9rem'
                }}>
                  {new Date(selectedPhoto.created_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

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
          <img 
            src="/photos.png" 
            alt="Photos" 
            style={{ marginRight: '12px', width: '36px', height: '36px' }}
          />
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
                background: 'rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => {
                setSelectedPhoto(photo);
                setShowPhotoModal(true);
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 0, 0, 0.25)';
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