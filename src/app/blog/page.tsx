'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  created_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Blog</h1>

      {posts.length === 0 ? (
        <p style={{ color: '#666' }}>No posts yet. Write one!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              style={{
                display: 'block',
                padding: '1rem',
                background: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#333',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h2 style={{ margin: '0 0 0.5rem' }}>{post.title}</h2>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </Link>
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