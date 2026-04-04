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

  const menuItems = [
    { icon: '📝', label: '博客', path: '/blog', color: '#667eea' },
    { icon: '📷', label: '照片', path: '/photos', color: '#f093fb' },
  ];

  const adminItems = [
    { icon: '✏️', label: '管理博客', path: '/admin/blog', color: '#4facfe' },
    { icon: '🖼️', label: '管理照片', path: '/admin/photos', color: '#43e97b' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem'
          }}>
            👋
          </div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#333', fontWeight: '600' }}>
            欢迎回来
          </h1>
          <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '1.1rem' }}>
            {user.username}
            <span style={{
              marginLeft: '0.5rem',
              padding: '0.25rem 0.75rem',
              background: user.role === 'admin' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e0e0e0',
              borderRadius: '20px',
              color: 'white',
              fontSize: '0.8rem'
            }}>
              {user.role === 'admin' ? '管理员' : '用户'}
            </span>
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                padding: '1.5rem',
                background: 'white',
                border: `2px solid ${item.color}`,
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 25px ${item.color}40`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <span style={{ fontSize: '2rem' }}>{item.icon}</span>
              <span style={{ color: '#333', fontWeight: '600', fontSize: '1rem' }}>{item.label}</span>
            </button>
          ))}
        </div>

        {user.role === 'admin' && (
          <>
            <div style={{
              textAlign: 'center',
              color: '#999',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              ─── 管理员功能 ───
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {adminItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  style={{
                    padding: '1.5rem',
                    background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${item.color}60`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>{item.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              router.push('/login');
            }}
            style={{
              padding: '0.75rem 2rem',
              background: 'transparent',
              color: '#999',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'border-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#667eea'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}