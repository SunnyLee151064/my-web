'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  role: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const menuItems = [
    { icon: '📝', label: 'Blog', path: '/blog', color: '#667eea' },
    { icon: '📷', label: 'Photos', path: '/photos', color: '#f093fb' },
  ];

  const adminItems = [
    { icon: '✏️', label: 'Manage Blog', path: '/admin/blog', color: '#4facfe' },
    { icon: '🖼️', label: 'Manage Photos', path: '/admin/photos', color: '#43e97b' },
  ];

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      {/* Admin 按钮 - 右上角 */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        {user ? (
          <button
            onClick={() => router.push('/welcome')}
            style={{
              padding: '0.5rem 1rem',
              background: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              color: '#667eea',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            Admin ({user.username})
          </button>
        ) : (
          <button
            onClick={handleLogin}
            style={{
              padding: '0.5rem 1rem',
              background: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              color: '#667eea',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            🔐 Admin Login
          </button>
        )}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 4rem)'
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
              HI
            </div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#333', fontWeight: '600' }}>
              Welcome
            </h1>
            {user && (
              <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '1.1rem' }}>
                {user.username}
                <span style={{
                  marginLeft: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '0.8rem'
                }}>
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </span>
              </p>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            marginBottom: user?.role === 'admin' ? '2rem' : '0'
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
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
              >
                <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                <span style={{ color: '#333', fontWeight: '600', fontSize: '1rem' }}>{item.label}</span>
              </button>
            ))}
          </div>

          {user?.role === 'admin' && (
            <>
              <div style={{
                textAlign: 'center',
                color: '#999',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                --- Admin ---
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
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                    <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {user && (
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.75rem 2rem',
                  background: 'transparent',
                  color: '#999',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}