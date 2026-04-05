'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export default function BlogPage() {
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

  // 生成随机颜色
  const getRandomColor = (index: number) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundImage: `url('/Rain.jpg')`,
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
        maxWidth: '900px',
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
            <path d="M395.765333 586.570667h-171.733333c-22.421333 0-37.888-22.442667-29.909333-43.381334L364.768 95.274667A32 32 0 0 1 394.666667 74.666667h287.957333c22.72 0 38.208 23.018667 29.632 44.064l-99.36 243.882666h187.050667c27.509333 0 42.186667 32.426667 24.042666 53.098667l-458.602666 522.56c-22.293333 25.408-63.626667 3.392-54.976-29.28l85.354666-322.421333zM416.714667 138.666667L270.453333 522.581333h166.869334a32 32 0 0 1 30.933333 40.181334l-61.130667 230.954666 322.176-367.114666H565.312c-22.72 0-38.208-23.018667-29.632-44.064l99.36-243.882667H416.714667z" />
          </svg>
          <span style={{
            fontFamily: 'cursive',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Blog</span>
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.5rem', fontSize: '1rem' }}>
          记录日常所学所得
        </p>
      </div>

      {/* 博客列表 */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {posts.length === 0 ? (
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            No posts yet. Write one!
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={post.id}
              onClick={() => router.push(`/blog/${post.slug}`)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
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
              <div style={{ flex: 1 }}>
                <h2 style={{
                  margin: '0 0 0.5rem',
                  fontSize: '1.2rem',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {post.title}
                </h2>
                <p style={{
                  margin: 0,
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.85rem'
                }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '10px',
                background: getRandomColor(index),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                marginLeft: '1rem'
              }}>
                <svg viewBox="0 0 1024 1024" style={{ width: '24px', height: '24px', fill: 'white' }}>
                  <path d="M395.765333 586.570667h-171.733333c-22.421333 0-37.888-22.442667-29.909333-43.381334L364.768 95.274667A32 32 0 0 1 394.666667 74.666667h287.957333c22.72 0 38.208 23.018667 29.632 44.064l-99.36 243.882666h187.050667c27.509333 0 42.186667 32.426667 24.042666 53.098667l-458.602666 522.56c-22.293333 25.408-63.626667 3.392-54.976-29.28l85.354666-322.421333zM416.714667 138.666667L270.453333 522.581333h166.869334a32 32 0 0 1 30.933333 40.181334l-61.130667 230.954666 322.176-367.114666H565.312c-22.72 0-38.208-23.018667-29.632-44.064l99.36-243.882667H416.714667z" />
                </svg>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}