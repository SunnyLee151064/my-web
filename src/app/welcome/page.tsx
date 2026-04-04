'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  role: string;
}

export default function WelcomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  if (!user) return null;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      padding: '2rem'
    }}>
      <h1 style={{ marginBottom: '0.5rem' }}>欢迎，{user.username}！</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        {user.role === 'admin' ? '管理员' : '用户'}
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => router.push('/blog')}
          style={{
            padding: '1.5rem 2rem',
            fontSize: '1.1rem',
            background: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          📝 博客
        </button>

        <button
          onClick={() => router.push('/photos')}
          style={{
            padding: '1.5rem 2rem',
            fontSize: '1.1rem',
            background: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          📷 照片
        </button>

        {user.role === 'admin' && (
          <>
            <button
              onClick={() => router.push('/admin/blog')}
              style={{
                padding: '1.5rem 2rem',
                fontSize: '1.1rem',
                background: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ✏️ 管理博客
            </button>

            <button
              onClick={() => router.push('/admin/photos')}
              style={{
                padding: '1.5rem 2rem',
                fontSize: '1.1rem',
                background: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🖼️ 管理照片
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => {
          localStorage.removeItem('user');
          router.push('/login');
        }}
        style={{
          marginTop: '2rem',
          padding: '0.5rem 1rem',
          background: 'transparent',
          color: '#666',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        退出登录
      </button>
    </div>
  );
}