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
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showManageAlbumsModal, setShowManageAlbumsModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumName, setAlbumName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
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
        if (selectedAlbum === id) {
          setSelectedAlbum(null);
        }
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
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        display: 'flex',
        gap: '0.75rem',
        zIndex: 10
      }}>
        <button
          onClick={() => router.push('/admin')}
          style={{
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.25)',
            borderRadius: '7px',
            cursor: 'pointer',
            fontWeight: '500',
            color: 'white',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          ← Admin
        </button>
        <button
          onClick={() => router.push('/')}
          style={{
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
            transition: 'all 0.3s ease'
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
          Home
        </button>
      </div>

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
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                maxWidth: '80%',
                textAlign: 'center'
              }}>
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
          }}>Manage Photos</span>
        </h1>

        
        {/* 图集选择器 */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            onClick={() => setSelectedAlbum(null)}
            style={{
              padding: '0.5rem 1rem',
              background: selectedAlbum === null ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.25)',
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
                background: selectedAlbum === album.id ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.25)',
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
          photos.map((photo) => (
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
              <div style={{
                padding: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {photo.description && (
                  <p style={{
                    margin: '0 0 0.75rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem'
                  }}>
                    {photo.description}
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.8rem'
                  }}>
                    {new Date(photo.created_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.id);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      background: 'rgba(255, 68, 68, 0.8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 右下角按钮 */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        display: 'flex',
        gap: '1rem',
        zIndex: 10
      }}>
        <Link
          href="/admin/photos/upload"
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          + Upload Photo
        </Link>
        <button
          onClick={() => setShowManageAlbumsModal(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          ⚙️ Manage Albums
        </button>
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
            background: 'rgba(255, 255, 255, 0.25)',
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
              {editingAlbum && (
                <button
                  onClick={() => {
                    if (editingAlbum.is_default) {
                      alert('Cannot delete the default album');
                      return;
                    }
                    handleDeleteAlbum(editingAlbum.id);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'rgba(255, 68, 68, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Delete Album
                </button>
              )}
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

      {/* Manage Albums Modal */}
      {showManageAlbumsModal && (
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
        }} onClick={() => setShowManageAlbumsModal(false)}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '2rem',
            width: '500px',
            maxWidth: '90%',
            position: 'relative',
            maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              margin: '0 0 1.5rem',
              fontSize: '1.5rem',
              color: 'white',
              fontWeight: '600'
            }}>
              Manage Albums
            </h2>

            {/* Album List */}
            <div style={{ marginBottom: '1.5rem' }}>
              {albums.map((album) => (
                <div
                  key={album.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    marginBottom: '0.5rem'
                  }}
                >
                  <span style={{ color: 'white', fontSize: '1rem' }}>
                    {album.name} {album.is_default && (
                      <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>(默认)</span>
                    )}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        handleEditAlbum(album);
                      }}
                      style={{
                        padding: '0.4rem 0.75rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Edit
                    </button>
                    {!album.is_default && (
                      <button
                        onClick={() => handleDeleteAlbum(album.id)}
                        style={{
                          padding: '0.4rem 0.75rem',
                          background: 'rgba(255, 68, 68, 0.8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
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

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  setShowManageAlbumsModal(false);
                }}
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
                Close
              </button>
              <button
                onClick={() => {
                  handleCreateAlbum();
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                + New Album
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}