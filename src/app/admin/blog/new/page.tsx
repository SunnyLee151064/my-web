'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  role: string;
}

export default function NewBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now();

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, slug }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/blog');
      } else {
        alert(data.error || 'Failed to create post');
      }
    } catch (err) {
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url('/Rain.jpg')`,
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
        onClick={() => router.push('/admin/blog')}
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
        maxWidth: '800px',
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
            New Post
          </h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500'
              }}>
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500'
              }}>
                Content (Markdown supported)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  color: 'white',
                  fontFamily: 'monospace',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                {loading ? 'Publishing...' : 'Publish'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin/blog')}
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