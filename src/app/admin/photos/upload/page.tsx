'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  role: string;
}

interface Album {
  id: number;
  name: string;
  is_default: boolean;
}

export default function UploadPhotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<number>(1);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/photo-albums');
      const data = await res.json();
      if (data.success) {
        setAlbums(data.albums || []);
        // 如果有默认图集，选择默认图集
        const defaultAlbum = data.albums.find((album: Album) => album.is_default);
        if (defaultAlbum) {
          setSelectedAlbum(defaultAlbum.id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch albums:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);
      formData.append('album_id', selectedAlbum.toString());

      const res = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        router.push('/admin/photos');
      } else {
        alert('Upload failed');
      }
    } catch {
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url('/boat.jpg')`,
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
        onClick={() => router.push('/admin/photos')}
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

      {/* 表单内容 */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        paddingTop: '4rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '2.5rem'
        }}>
          <h1 style={{
            fontSize: '1.8rem',
            color: 'white',
            fontWeight: '600',
            margin: '0 0 2rem'
          }}>
            Upload Photo
          </h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500'
              }}>
                Select Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '1rem'
                }}
              />

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    marginTop: '1rem'
                  }}
                />
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500'
              }}>
                Album
              </label>
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  color: 'white',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.name} {album.is_default && '(Default)'}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500'
              }}>
                Description (optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  color: 'white',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button
                type="submit"
                disabled={loading || !file}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: file ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin/photos')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}