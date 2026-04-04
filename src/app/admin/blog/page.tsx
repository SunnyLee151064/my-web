'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  created_at: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        // 重新获取列表
        await fetchPosts();
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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Manage Blog</h1>

      <Link
        href="/admin/blog/new"
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
        + New Post
      </Link>

      {posts.length === 0 ? (
        <p style={{ color: '#666' }}>No posts</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div>
                <Link href={`/blog/${post.slug}`} style={{ color: '#333', textDecoration: 'none' }}>
                  <h3 style={{ margin: '0 0 0.5rem' }}>{post.title}</h3>
                </Link>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  href={`/admin/blog/edit/${post.id}`}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#f0f0f0',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: '#333'
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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