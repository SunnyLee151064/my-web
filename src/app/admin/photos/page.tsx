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

interface Album {
  id: number;
  name: string;
  is_default: boolean;
}

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumName, setAlbumName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.username && parsedUser.role) {
          setUser(parsedUser);
          if (parsedUser.role !== 'admin') {
            router.push('/');
          } else {
            fetchPhotos();
            fetchAlbums();
          }
        } else {
          localStorage.removeItem('user');
          router.push('/login');
        }
      } catch (error) {
        localStorage.removeItem('user');
        router.push('/login');
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

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/photo-albums');
      const data = await res.json();
      if (data.success) {
        setAlbums(data.albums || []);
      }
    } catch (err) {
      console.error('Failed to fetch albums:', err);
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
        await fetchPhotos();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleCreateAlbum = () => {
    setEditingAlbum(null);
    setAlbumName('');
    setIsDefault(false);
    setShowAlbumModal(true);
  };

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setAlbumName(album.name);
    setIsDefault(album.is_default);
    setShowAlbumModal(true);
  };

  const handleSaveAlbum = async () => {
    if (!albumName.trim()) {
      alert('Album name is required');
      return;
    }

    try {
      const url = editingAlbum ? '/api/photo-albums' : '/api/photo-albums';
      const method = editingAlbum ? 'PUT' : 'POST';
      const body = editingAlbum ? {
        id: editingAlbum.id,
        name: albumName,
        isDefault
      } : {
        name: albumName,
        isDefault
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        await fetchAlbums();
        setShowAlbumModal(false);
      } else {
        alert(data.error || 'Failed to save album');
      }
    } catch (err) {
      alert('Failed to save album');
    }
  };

  const handleDeleteAlbum = async (id: number) => {
    if (!confirm('Are you sure you want to delete this album? Photos in this album will be moved to the default album.')) return;

    try {
      const res = await fetch(`/api/photo-albums?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        await fetchAlbums();
      } else {
        alert(data.error || 'Failed to delete album');
      }
    } catch (err) {
      alert('Failed to delete album');
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
        margin: '0 auto 2rem',
        paddingTop: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          color: 'white',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          margin: '0 0 1.5rem'
        }}>
          <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px', width: '32px', height: '32px', fill: 'white' }}>
            <path d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z m-277.333334-213.333333h-384v320h213.333334v-170.666667h170.666666v-149.333333z m0 213.333333h-106.666666v106.666667h106.666666v-106.666667z" />
          </svg>
          <span style={{
            fontFamily: 'cursive',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Manage Photos</span>
        </h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Link
            href="/admin/photos/upload"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            + Upload Photo
          </Link>
          <button
            onClick={handleCreateAlbum}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            + Create Album
          </button>
        </div>

        {/* 图集管理 */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            color: 'white',
            fontWeight: '600',
            margin: '0 0 1rem'
          }}>
            Manage Albums
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {albums.map((album) => (
              <div
                key={album.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div>
                  <h3 style={{
                    margin: '0 0 0.5rem',
                    fontSize: '1.1rem',
                    color: 'white',
                    fontWeight: '600'
                  }}>
                    {album.name}
                    {album.is_default && (
                      <span style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        Default
                      </span>
                    )}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button
                    onClick={() => handleEditAlbum(album)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: 'rgba(102, 126, 234, 0.8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Edit
                  </button>
                  {!album.is_default && (
                    <button
                      onClick={() => handleDeleteAlbum(album.id)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'rgba(255, 68, 68, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 照片网格 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.5rem'
      }}>
        {photos.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            gridColumn: '1 / -1'
          }}>
            No photos yet
          </div>
        ) : (
          photos.map((photo) => (
            <div
              key={photo.id}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '100%',
                height: '150px',
                overflow: 'hidden'
              }}>
                <img
                  src={photo.url}
                  alt={photo.description || 'Photo'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div style={{
                padding: '1rem'
              }}>
                {photo.description && (
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {photo.description}
                  </p>
                )}
                <button
                  onClick={() => handleDelete(photo.id)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'rgba(255, 68, 68, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 图集编辑模态框 */}
      {showAlbumModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowAlbumModal(false)}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '2rem',
            width: '400px',
            maxWidth: '90%',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              margin: '0 0 1.5rem',
              fontSize: '1.5rem',
              color: 'white',
              fontWeight: '600'
            }}>
              {editingAlbum ? 'Edit Album' : 'Create Album'}
            </h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem'
              }}>
                Album Name
              </label>
              <input
                type="text"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem'
                }}
                placeholder="Enter album name"
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer'
                  }}
                />
                Set as default album
              </label>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowAlbumModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAlbum}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {editingAlbum ? 'Save Changes' : 'Create Album'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}