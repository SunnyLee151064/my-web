'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Activity {
  id: number;
  type: string;
  action: string;
  item_id: number | null;
  item_title: string | null;
  item_slug: string | null;
  item_url: string | null;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  role: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ visible: boolean; text: string; x: number; y: number }>({
    visible: false,
    text: '',
    x: 0,
    y: 0
  });
  const router = useRouter();

  const loadActivities = async () => {
    try {
      const res = await fetch('/api/activities');
      const data = await res.json();
      if (data.success) {
        setActivities(data.activities);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

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
          {/* 头像区域 - 双击登录/登出 */}
          <div style={{
            width: '90%',
            aspectRatio: '1/1',
            borderRadius: '50%',
            marginBottom: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onDoubleClick={() => {
            if (user) {
              // 已登录用户双击登出
              handleLogout();
            } else {
              // 未登录用户双击登录
              router.push('/login');
            }
          }}>
            <img
              src="/boy.png"
              alt="Avatar"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
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
              fontWeight: '600'
            }}>
              <span style={{ 
                fontFamily: 'Arial, sans-serif', 
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>SunnyLee</span>
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
                  transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
                onClick={handleGithubClick}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
                }}
              >
                <img 
                  src="/github.png" 
                  alt="GitHub" 
                  style={{ width: '22px', height: '22px' }}
                />
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
                  transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
                onClick={handleGmailClick}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
                }}
              >
                <img 
                  src="/gmail.png" 
                  alt="Gmail" 
                  style={{ width: '22px', height: '22px' }}
                />
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
                  transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
                onClick={handleWechatClick}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
                }}
              >
                <img 
                  src="/wechat.png" 
                  alt="WeChat" 
                  style={{ width: '22px', height: '22px' }}
                />
              </div>
            </div>
          </div>



          {/* 公告栏目 */}
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
            <h2 style={{
              margin: '0 0 0.5rem',
              fontSize: '1rem',
              color: 'white',
              fontWeight: '600'
            }}>
              📢 公告
            </h2>
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.5'
            }}>
              欢迎来到我的网站，请查看timeline以获取最新内容更新
            </p>
          </div>
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
          <div style={{ marginBottom: '2rem', width: '85%' }}>
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
              justifyContent: 'space-between',
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
                  margin: '0',
                  display: 'flex',
                  background: 'rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.25)',
                  borderRadius: '8px',
                  padding: '15px',
                  height: '100px',
                  width: 'calc(33.333% - 0.67rem)',
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
                  margin: '0',
                  display: 'flex',
                  background: 'rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.25)',
                  borderRadius: '8px',
                  padding: '15px',
                  height: '100px',
                  width: 'calc(33.333% - 0.67rem)',
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

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log('Navigating to /notes');
                  router.push('/notes');
                }}
                style={{
                  margin: '0',
                  display: 'flex',
                  background: 'rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.25)',
                  borderRadius: '8px',
                  padding: '15px',
                  height: '100px',
                  width: 'calc(33.333% - 0.67rem)',
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
                    Notes
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'white'
                  }}>
                    Quick Notes
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
                    src="/notes.png" 
                    alt="Notes" 
                    style={{ width: '39px', height: '39px', transition: 'transform 0.4s ease' }}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Admin 部分（仅管理员可见） */}
          {user?.role === 'admin' && (
            <div style={{ marginBottom: '2rem', width: '85%' }}>
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
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <button
                  onClick={() => router.push('/admin/blog')}
                  style={{
                    margin: '0',
                    display: 'flex',
                    background: 'rgba(227, 242, 253, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(187, 222, 251, 0.5)',
                    borderRadius: '8px',
                    padding: '15px',
                    height: '100px',
                    width: 'calc(33.333% - 0.67rem)',
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
                    margin: '0',
                    display: 'flex',
                    background: 'rgba(232, 245, 233, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(200, 230, 201, 0.5)',
                    borderRadius: '8px',
                    padding: '15px',
                    height: '100px',
                    width: 'calc(33.333% - 0.67rem)',
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

                <button
                  onClick={() => router.push('/admin/notes')}
                  style={{
                    margin: '0',
                    display: 'flex',
                    background: 'rgba(255, 243, 224, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 224, 178, 0.5)',
                    borderRadius: '8px',
                    padding: '15px',
                    height: '100px',
                    width: 'calc(33.333% - 0.67rem)',
                    transition: 'opacity 0.5s ease, background-color 0.2s ease, border 0.2s ease, transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255, 243, 224, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255, 243, 224, 0.3)';
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
                      管理笔记
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'white'
                    }}>
                      创建/编辑/删除
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 时间轴功能卡片 */}
          <div style={{ marginBottom: '2rem', width: '85%' }}>
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
              padding: '1.5rem',
              position: 'relative',
              overflowX: 'auto'
            }}>
              {activitiesLoading ? (
                <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>Loading...</div>
              ) : activities.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>暂无活动记录</div>
              ) : (
                <div style={{
                  display: 'flex',
                  minWidth: 'fit-content',
                  position: 'relative',
                  height: '100px'
                }}>
                  {/* 时间轴中心线 */}
                  <div style={{
                    position: 'absolute',
                    top: '35%',
                    left: '0',
                    right: '0',
                    height: '2px',
                    background: 'linear-gradient(to right, #ff6b6b, #4ecdc4)'
                  }} />
                  
                  {/* 时间轴节点 */}
                  {activities.map((item, index) => {
                    const formatTime = (dateStr: string) => {
                      const date = new Date(dateStr);
                      return date.toLocaleString('zh-CN', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    };

                    const getActionText = (action: string, type: string) => {
                      const actionMap: Record<string, Record<string, string>> = {
                        blog: { create: '新增blog', update: '修改blog', delete: '删除blog' },
                        note: { create: '新增note', update: '修改note', delete: '删除note' },
                        photo: { upload: '新增照片', delete: '删除照片' },
                        notebook: { create: '新增笔记本', delete: '删除笔记本' },
                        album: { create: '新增相册', delete: '删除相册' }
                      };
                      return actionMap[type]?.[action] || action;
                    };

                    const getNodeColor = (action: string, type: string) => {
                      const colorMap: Record<string, Record<string, string>> = {
                        blog: { create: '#4ECDC4', update: '#FFD166', delete: '#EF476F' },
                        note: { create: '#FF9F1C', update: '#FFE066', delete: '#EF476F' },
                        photo: { upload: '#06D6A0', delete: '#EF476F' },
                        notebook: { create: '#118AB2', delete: '#EF476F' },
                        album: { create: '#073B4C', delete: '#EF476F' }
                      };
                      return colorMap[type]?.[action] || '#45B7D1';
                    };

                    const getTooltipText = (activity: Activity) => {
                      if (activity.type === 'blog') {
                        if (activity.action === 'delete') {
                          return `删除文章《${activity.item_title || '未命名'}》`;
                        } else if (activity.action === 'create') {
                          return `新增文章《${activity.item_title || '未命名'}》`;
                        } else if (activity.action === 'update') {
                          return `修改文章《${activity.item_title || '未命名'}》`;
                        }
                      } else if (activity.type === 'note') {
                        if (activity.action === 'delete') {
                          return `删除笔记《${activity.item_title || '未命名'}》`;
                        } else if (activity.action === 'create') {
                          return `新增笔记《${activity.item_title || '未命名'}》`;
                        } else if (activity.action === 'update') {
                          return `修改笔记《${activity.item_title || '未命名'}》`;
                        }
                      } else if (activity.type === 'photo') {
                        if (activity.action === 'upload') {
                          return `上传图片：${activity.item_title || '新图片'}`;
                        } else if (activity.action === 'delete') {
                          return `删除图片：${activity.item_title || '图片'}`;
                        }
                      } else if (activity.type === 'notebook') {
                        if (activity.action === 'create') {
                          return `新增笔记本：${activity.item_title || '新笔记本'}`;
                        } else if (activity.action === 'delete') {
                          return `删除笔记本：${activity.item_title || '笔记本'}`;
                        }
                      } else if (activity.type === 'album') {
                        if (activity.action === 'create') {
                          return `新增相册：${activity.item_title || '新相册'}`;
                        } else if (activity.action === 'delete') {
                          return `删除相册：${activity.item_title || '相册'}`;
                        }
                      }
                      return `${getActionText(activity.action, activity.type)}`;
                    };

                    const handleClick = () => {
                      if (item.type === 'blog' && item.item_slug && item.action !== 'delete') {
                        router.push(`/blog/${item.item_slug}`);
                      } else if (item.type === 'note' && item.item_slug && item.action !== 'delete') {
                        router.push(`/notes/${item.item_slug}`);
                      } else if (item.type === 'photo' && item.action !== 'delete') {
                        router.push('/photos');
                      }
                    };

                    const isClickable = (item.type === 'blog' && item.item_slug && item.action !== 'delete') || 
                                       (item.type === 'note' && item.item_slug && item.action !== 'delete') ||
                                       (item.type === 'photo' && item.action !== 'delete');

                    return (
                      <div key={item.id} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginRight: '1rem',
                        position: 'relative',
                        minWidth: '120px'
                      }}>
                        {/* 节点 */}
                        <div 
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: getNodeColor(item.action, item.type),
                            zIndex: 1,
                            position: 'absolute',
                            top: '35%',
                            transform: 'translateY(-50%)',
                            cursor: isClickable ? 'pointer' : 'default',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                          }}
                          onClick={handleClick}
                          onMouseEnter={(e) => {
                            setTooltip({
                              visible: true,
                              text: getTooltipText(item),
                              x: e.clientX + 10,
                              y: e.clientY - 40
                            });
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1.3)';
                            e.currentTarget.style.boxShadow = `0 0 10px ${getNodeColor(item.action, item.type)}`;
                          }}
                          onMouseMove={(e) => {
                            setTooltip(prev => ({
                              ...prev,
                              x: e.clientX + 10,
                              y: e.clientY - 40
                            }));
                          }}
                          onMouseLeave={(e) => {
                            setTooltip({
                              visible: false,
                              text: '',
                              x: 0,
                              y: 0
                            });
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        />
                        
                        {/* 内容 */}
                        <div 
                          style={{
                            textAlign: 'center',
                            fontSize: '0.8rem',
                            marginTop: '45px',
                            padding: '0 0.5rem',
                            cursor: isClickable ? 'pointer' : 'default'
                          }}
                          onClick={handleClick}
                        >
                          <div style={{
                            color: 'white',
                            marginBottom: '0.5rem'
                          }}>
                            {formatTime(item.created_at)}
                          </div>
                          <div style={{
                            color: 'white',
                            fontWeight: '500'
                          }}>
                            {getActionText(item.action, item.type)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
      
      {/* 全局悬浮提示 */}
      {tooltip.visible && (
        <div style={{
          position: 'fixed',
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          background: 'rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.25)',
          color: 'white',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '0.8rem',
          whiteSpace: 'nowrap',
          zIndex: 9999,
          pointerEvents: 'none'
        }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}