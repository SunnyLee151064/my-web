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

    // 生成 slug
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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>New Post</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Content (Markdown supported)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              fontFamily: 'monospace'
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
              background: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#f0f0f0',
              color: '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button
            onClick={() => router.push('/')}
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
      </form>
    </div>
  );
}