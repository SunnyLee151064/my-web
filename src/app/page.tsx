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
    // 检查是否有用户信息
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // 验证用户数据的有效性
        if (userData && userData.username && userData.role) {
          setUser(userData);
        } else {
          // 如果数据无效，清除它
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (error) {
        // 如果解析失败，清除无效数据
        localStorage.removeItem('user');
        setUser(null);
      }
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

  const [showWechatModal, setShowWechatModal] = useState(false);

  const handleGithubClick = () => {
    window.open('https://github.com/SunnyLee151064', '_blank');
  };

  const handleGmailClick = () => {
    window.location.href = 'mailto:sunnylee980219@gmail.com';
  };

  const handleWechatClick = () => {
    setShowWechatModal(true);
  };

  const closeWechatModal = () => {
    setShowWechatModal(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url('/boatseas.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
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
              background: 'rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.25)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              color: '#1a1a1a',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
            }}
          >
            Admin ({user.username})
          </button>
        ) : (
          <button
            onClick={handleLogin}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.25)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              color: '#1a1a1a',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
            }}
          >
            Admin Login
          </button>
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '3rem',
        width: '100%',
        maxWidth: '1150px',
        position: 'relative'
      }}>
        {/* 左侧个人信息区域 */}
        <div style={{
          flex: '0 0 230px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh',
          position: 'sticky',
          top: 0,
          padding: '2rem 1rem'
        }}>
          {/* 头像区域 */}
          <div style={{
            width: '90%',
            aspectRatio: '1/1',
            borderRadius: '50%',
            marginBottom: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img
              src="/boy.png"
              alt="Avatar"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* 个人信息 */}
          <div style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.25)',
            borderRadius: '13px',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <h1 style={{
              margin: '0 0 0.5rem',
              fontSize: '1.2rem',
              color: 'white',
              fontWeight: '600'
            }}>
              SunnyLee
            </h1>
            <p style={{
              margin: '0 0 0.25rem',
              fontSize: '0.8rem',
              color: 'white'
            }}>
              Shanghai-China
            </p>
            <p style={{
              margin: '0',
              fontSize: '0.8rem',
              color: 'white'
            }}>
              Company: Huawei
            </p>
          </div>

          {/* 联系按钮 */}
          <div style={{
            width: '100%',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <h3 style={{
              margin: '0 0 1rem',
              fontSize: '1rem',
              color: 'white',
              fontWeight: '600'
            }}>
              CONTACT
            </h3>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <div 
                style={{
                  width: '49px',
                  height: '43px',
                  boxSizing: 'border-box',
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.25)',
                  transition: 'width 0.3s ease, opacity 0.3s ease, transform 0.3s ease',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
                onClick={handleGithubClick}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.width = '95px';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
                  const text = e.currentTarget.querySelector('div');
                  if (text) {
                    (text as HTMLElement).style.display = 'block';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.width = '49px';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
                  const text = e.currentTarget.querySelector('div');
                  if (text) {
                    (text as HTMLElement).style.display = 'none';
                  }
                }}
              >
                <img 
                  src="/github.png" 
                  alt="GitHub" 
                  style={{ width: '22px', height: '22px', marginRight: '3px' }}
                />
                <div style={{
                  whiteSpace: 'nowrap',
                  display: 'none',
                  fontSize: '0.8rem',
                  color: 'white'
                }}>
                  GitHub
                </div>
              </div>
              <div 
                style={{
                  width: '49px',
                  height: '43px',
                  boxSizing: 'border-box',
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.25)',
                  transition: 'width 0.3s ease, opacity 0.3s ease, transform 0.3s ease',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
                onClick={handleGmailClick}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.width = '110px';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
                  const text = e.currentTarget.querySelector('div');
                  if (text) {
                    (text as HTMLElement).style.display = 'block';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.width = '49px';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
                  const text = e.currentTarget.querySelector('div');
                  if (text) {
                    (text as HTMLElement).style.display = 'none';
                  }
                }}
              >
                <img 
                  src="/gmail.png" 
                  alt="Gmail" 
                  style={{ width: '22px', height: '22px', marginRight: '3px' }}
                />
                <div style={{
                  whiteSpace: 'nowrap',
                  display: 'none',
                  fontSize: '0.8rem',
                  color: 'white'
                }}>
                  Google Mail
                </div>
              </div>
              <div 
                style={{
                  width: '49px',
                  height: '43px',
                  boxSizing: 'border-box',
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.25)',
                  transition: 'width 0.3s ease, opacity 0.3s ease, transform 0.3s ease',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
                onClick={handleWechatClick}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.width = '90px';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
                  const text = e.currentTarget.querySelector('div');
                  if (text) {
                    (text as HTMLElement).style.display = 'block';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.width = '49px';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
                  const text = e.currentTarget.querySelector('div');
                  if (text) {
                    (text as HTMLElement).style.display = 'none';
                  }
                }}
              >
                <img 
                  src="/wechat.png" 
                  alt="WeChat" 
                  style={{ width: '22px', height: '22px', marginRight: '3px' }}
                />
                <div style={{
                  whiteSpace: 'nowrap',
                  display: 'none',
                  fontSize: '0.8rem',
                  color: 'white'
                }}>
                  WeChat
                </div>
              </div>
            </div>
          </div>

          {user && (
            <div>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.25)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  color: '#1a1a1a',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
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
          flexDirection: 'column',
          padding: '2rem 0',
          minHeight: '100vh'
        }}>
          {/* 招呼语和个人介绍 */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{
            margin: '0 0 1rem',
            fontSize: '3rem',
            color: '#1a1a1a',
            fontWeight: '600'
          }}>
            Hello I'm <span style={{ 
              fontFamily: 'Arial, sans-serif', 
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '3.5rem'
            }}>SunnyLee</span>
          </h2>
          <p style={{
            margin: '0 0 0.5rem',
            fontSize: '1.2rem',
            color: 'rgba(0, 0, 0, 0.8)'
          }}>
            An AI-Infra developer.
          </p>
          <p style={{
            margin: '0',
            fontSize: '1.2rem',
            color: 'rgba(0, 0, 0, 0.8)'
          }}>
            A student of life.
          </p>
          </div>

          {/* 贪吃蛇动画 */}
          <div style={{
            marginBottom: '2rem', 
            width: '85%',
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.25)',
            borderRadius: '13px',
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <img
              src="/snake-Light.svg"
              alt="Snake"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          {/* Site 部分 */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              margin: '0 0 1rem',
              fontSize: '1.5rem',
              color: 'white',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center'
            }}>
              <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', width: '26px', height: '26px', fill: 'white' }}>
                <path d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z m-277.333334-213.333333h-384v320h213.333334v-170.666667h170.666666v-149.333333z m0 213.333333h-106.666666v106.666667h106.666666v-106.666667z"/>
              </svg>
              SITE
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log('Navigating to /blog');
                  router.push('/blog');
                }}
                style={{
                  margin: '7px',
                  display: 'flex',
                  background: 'rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.25)',
                  borderRadius: '8px',
                  padding: '15px',
                  height: '100px',
                  width: 'calc(25% - 15px)',
                  transition: 'opacity 0.5s ease, background-color 0.2s ease, border 0.2s ease, transform 0.3s ease',
                  cursor: 'pointer',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  try {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
                    const title = e.currentTarget.querySelector('div div:first-child');
                    if (title) {
                      (title as HTMLElement).style.fontSize = '18px';
                    }
                  } catch (error) {
                    console.error('Error in mouse enter:', error);
                  }
                }}
                onMouseLeave={(e) => {
                  try {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
                    const title = e.currentTarget.querySelector('div div:first-child');
                    if (title) {
                      (title as HTMLElement).style.fontSize = '16px';
                    }
                  } catch (error) {
                    console.error('Error in mouse leave:', error);
                  }
                }}
              >
                <div style={{
                  transition: 'width 0.4s ease',
                  height: '100%',
                  width: '80%'
                }}>
                  <div style={{
                    fontSize: '16px',
                    color: 'white',
                    fontWeight: '500',
                    marginBottom: '15px',
                    transition: 'font-size 0.4s ease'
                  }}>
                    Blog
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'white'
                  }}>
                    Daily Records
                  </div>
                </div>
                <div style={{
                  overflow: 'hidden',
                  transition: 'width 0.4s ease',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '20%',
                  height: '100%'
                }}>
                  <img 
                    src="/blogs.png" 
                    alt="Blog" 
                    style={{ width: '39px', height: '39px', transition: 'transform 0.4s ease' }}
                  />
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log('Navigating to /photos');
                  router.push('/photos');
                }}
                style={{
                  margin: '7px',
                  display: 'flex',
                  background: 'rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.25)',
                  borderRadius: '8px',
                  padding: '15px',
                  height: '100px',
                  width: 'calc(25% - 15px)',
                  transition: 'opacity 0.5s ease, background-color 0.2s ease, border 0.2s ease, transform 0.3s ease',
                  cursor: 'pointer',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  try {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
                    const title = e.currentTarget.querySelector('div div:first-child');
                    if (title) {
                      (title as HTMLElement).style.fontSize = '18px';
                    }
                  } catch (error) {
                    console.error('Error in mouse enter:', error);
                  }
                }}
                onMouseLeave={(e) => {
                  try {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
                    const title = e.currentTarget.querySelector('div div:first-child');
                    if (title) {
                      (title as HTMLElement).style.fontSize = '16px';
                    }
                  } catch (error) {
                    console.error('Error in mouse leave:', error);
                  }
                }}
              >
                <div style={{
                  transition: 'width 0.4s ease',
                  height: '100%',
                  width: '80%'
                }}>
                  <div style={{
                    fontSize: '16px',
                    color: 'white',
                    fontWeight: '500',
                    marginBottom: '15px',
                    transition: 'font-size 0.4s ease'
                  }}>
                    Photos
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'white'
                  }}>
                    Photo Collection
                  </div>
                </div>
                <div style={{
                  overflow: 'hidden',
                  transition: 'width 0.4s ease',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '20%',
                  height: '100%'
                }}>
                  <img 
                    src="/photos.png" 
                    alt="Photos" 
                    style={{ width: '39px', height: '39px', transition: 'transform 0.4s ease' }}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Admin 部分（仅管理员可见） */}
          {user?.role === 'admin' && (
            <div>
              <h2 style={{
                margin: '0 0 1rem',
                fontSize: '1.5rem',
                color: 'white',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', width: '26px', height: '26px', fill: 'white' }}>
                  <path d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z m-277.333334-213.333333h-384v320h213.333334v-170.666667h170.666666v-149.333333z m0 213.333333h-106.666666v106.666667h106.666666v-106.666667z"/>
                </svg>
                admin
              </h2>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <button
                  onClick={() => router.push('/admin/blog')}
                  style={{
                    margin: '7px',
                    display: 'flex',
                    background: 'rgba(227, 242, 253, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(187, 222, 251, 0.5)',
                    borderRadius: '8px',
                    padding: '15px',
                    height: '100px',
                    width: 'calc(25% - 15px)',
                    transition: 'opacity 0.5s ease, background-color 0.2s ease, border 0.2s ease, transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(227, 242, 253, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(227, 242, 253, 0.3)';
                  }}
                >
                  <div style={{
                    transition: 'width 0.4s ease',
                    height: '100%',
                    width: '100%'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      color: 'white',
                      fontWeight: '500',
                      marginBottom: '15px',
                      transition: 'font-size 0.4s ease'
                    }}>
                      管理博客
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'white'
                    }}>
                      创建/编辑/删除
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/admin/photos')}
                  style={{
                    margin: '7px',
                    display: 'flex',
                    background: 'rgba(232, 245, 233, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(200, 230, 201, 0.5)',
                    borderRadius: '8px',
                    padding: '15px',
                    height: '100px',
                    width: 'calc(25% - 15px)',
                    transition: 'opacity 0.5s ease, background-color 0.2s ease, border 0.2s ease, transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(232, 245, 233, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(232, 245, 233, 0.3)';
                  }}
                >
                  <div style={{
                    transition: 'width 0.4s ease',
                    height: '100%',
                    width: '100%'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      color: 'white',
                      fontWeight: '500',
                      marginBottom: '15px',
                      transition: 'font-size 0.4s ease'
                    }}>
                      管理图片
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'white'
                    }}>
                      上传/删除
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 时间轴功能卡片 */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              margin: '0 0 1.5rem',
              fontSize: '1.5rem',
              color: 'white',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center'
            }}>
              <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', width: '26px', height: '26px', fill: 'white' }}>
                <path d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z m-277.333334-213.333333h-384v320h213.333334v-170.666667h170.666666v-149.333333z m0 213.333333h-106.666666v106.666667h106.666666v-106.666667z"/>
              </svg>
              TIMELINE
            </h2>
            <div style={{
              background: 'rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.25)',
              borderRadius: '13px',
              padding: '2.5rem 1.5rem',
              position: 'relative',
              overflowX: 'auto'
            }}>
              <div style={{
                display: 'flex',
                minWidth: 'fit-content',
                position: 'relative',
                alignItems: 'center',
                height: '80px'
              }}>
                {/* 时间轴中心线 */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0',
                  right: '0',
                  height: '2px',
                  background: 'linear-gradient(to right, #ff6b6b, #4ecdc4)',
                  transform: 'translateY(-50%)'
                }} />
                
                {/* 时间轴节点 */}
                {[
                  { time: '2024-04-06 15:30', action: '添加了新博客', type: 'blog' },
                  { time: '2024-04-06 14:15', action: '删除了旧图片', type: 'photo' },
                  { time: '2024-04-06 11:20', action: '修改了博客内容', type: 'blog' },
                  { time: '2024-04-05 16:45', action: '上传了新图片', type: 'photo' },
                  { time: '2024-04-05 10:30', action: '创建了新笔记本', type: 'notebook' }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginRight: '2rem',
                    position: 'relative',
                    minWidth: '150px'
                  }}>
                    {/* 节点 */}
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: item.type === 'blog' ? '#ff6b6b' : item.type === 'photo' ? '#4ecdc4' : '#45b7d1',
                      zIndex: 1,
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }} />
                    
                    {/* 内容 */}
                    <div style={{
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      marginTop: '20px',
                      padding: '0 0.5rem'
                    }}>
                      <div style={{
                        color: 'white',
                        marginBottom: '0.5rem'
                      }}>
                        {item.time}
                      </div>
                      <div style={{
                        color: 'white',
                        fontWeight: '500'
                      }}>
                        {item.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 微信二维码模态框 */}
      {showWechatModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={closeWechatModal}>
          <div style={{
            width: '300px',
            height: '300px',
            background: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8px',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              color: 'white',
              fontSize: '1.2rem',
              textAlign: 'center'
            }}>
              WeChat QR Code
              <div style={{ marginTop: '20px', fontSize: '0.8rem' }}>
                (This is a placeholder for WeChat QR code)
              </div>
            </div>
            <button style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }} onClick={closeWechatModal}>
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
}