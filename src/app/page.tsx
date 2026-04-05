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

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleAdminClick = () => {
    router.push('/admin/blog');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Admin 按钮 - 右上角 */}
      <div style={{ 
        position: 'absolute', 
        top: '1.5rem', 
        right: '1.5rem',
        zIndex: 10
      }}>
        {user ? (
          <button
            onClick={handleAdminClick}
            style={{
              padding: '0.5rem 1rem',
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              color: '#333',
              fontSize: '0.9rem'
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
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              color: '#333',
              fontSize: '0.9rem'
            }}
          >
            Admin Login
          </button>
        )}
      </div>

      <div style={{
        display: 'flex',
        background: 'white',
        borderRadius: '12px',
        padding: '3rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '900px',
        width: '100%',
        gap: '3rem'
      }}>
        {/* 左侧个人信息区域 */}
        <div style={{
          flex: '0 0 200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* 头像区域 - 暂时用纯黑背景 */}
          <div style={{
            width: '120px',
            height: '120px',
            background: '#000',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }} />

          {/* 个人信息 */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              margin: '0 0 0.5rem',
              fontSize: '1.5rem',
              color: '#333',
              fontWeight: '600'
            }}>
              sunnyLee
            </h1>
            {user && (
              <p style={{
                margin: '0',
                color: '#666',
                fontSize: '0.9rem'
              }}>
                {user.role === 'admin' ? 'Admin' : 'User'}
              </p>
            )}
          </div>

          {user && (
            <div style={{ marginTop: '2rem' }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: 'transparent',
                  color: '#666',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* 右侧内容区域 */}
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Site 部分 */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              margin: '0 0 1rem',
              fontSize: '1.1rem',
              color: '#333',
              fontWeight: '600'
            }}>
              site
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <button
                onClick={() => router.push('/blog')}
                style={{
                  padding: '1rem',
                  background: '#f8f9fa',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  fontSize: '0.9rem',
                  color: '#333',
                  fontWeight: '500',
                  marginBottom: '0.25rem'
                }}>
                  博客
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#666'
                }}>
                  记录日常
                </div>
              </button>

              <button
                onClick={() => router.push('/photos')}
                style={{
                  padding: '1rem',
                  background: '#f8f9fa',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  fontSize: '0.9rem',
                  color: '#333',
                  fontWeight: '500',
                  marginBottom: '0.25rem'
                }}>
                  图片
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#666'
                }}>
                  图片集合
                </div>
              </button>
            </div>
          </div>

          {/* Admin 部分（仅管理员可见） */}
          {user?.role === 'admin' && (
            <div>
              <h2 style={{
                margin: '0 0 1rem',
                fontSize: '1.1rem',
                color: '#333',
                fontWeight: '600'
              }}>
                admin
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1rem'
              }}>
                <button
                  onClick={() => router.push('/admin/blog')}
                  style={{
                    padding: '1rem',
                    background: '#e3f2fd',
                    border: '1px solid #bbdefb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#1976d2',
                    fontWeight: '500',
                    marginBottom: '0.25rem'
                  }}>
                    管理博客
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#64b5f6'
                  }}>
                    创建/编辑/删除
                  </div>
                </button>

                <button
                  onClick={() => router.push('/admin/photos')}
                  style={{
                    padding: '1rem',
                    background: '#e8f5e9',
                    border: '1px solid #c8e6c9',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#388e3c',
                    fontWeight: '500',
                    marginBottom: '0.25rem'
                  }}>
                    管理图片
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#81c784'
                  }}>
                    上传/删除
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}