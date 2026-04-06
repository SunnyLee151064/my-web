'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMusic } from '@/contexts/MusicContext';

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

interface GuestbookMessage {
  id: number;
  name: string;
  message: string;
  created_at: string;
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
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [guestbookMessages, setGuestbookMessages] = useState<GuestbookMessage[]>([]);
  const [guestbookLoading, setGuestbookLoading] = useState(true);
  const [newMessageName, setNewMessageName] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [submittingMessage, setSubmittingMessage] = useState(false);
  const [showGuestbookModal, setShowGuestbookModal] = useState(false);
  const router = useRouter();
  const { isPlaying, currentIndex, togglePlay, playNext, totalSongs } = useMusic();

  const loadActivities = async () => {
    try {
      const res = await fetch('/api/activities', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'same-origin'
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const loadVisitorCount = async () => {
    try {
      const res = await fetch('/api/visitor-count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'same-origin'
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setVisitorCount(data.count || 0);
      }
    } catch (error) {
      console.error('Failed to load visitor count:', error);
      setVisitorCount(0);
    }
  };

  const incrementVisitorCount = async () => {
    try {
      const res = await fetch('/api/visitor-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'same-origin'
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setVisitorCount(data.count || 0);
      }
    } catch (error) {
      console.error('Failed to increment visitor count:', error);
    }
  };

  const loadGuestbook = async () => {
    try {
      const res = await fetch('/api/guestbook', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'same-origin'
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setGuestbookMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load guestbook:', error);
      setGuestbookMessages([]);
    } finally {
      setGuestbookLoading(false);
    }
  };

  const submitGuestbookMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageName.trim() || !newMessageContent.trim()) return;
    
    setSubmittingMessage(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          name: newMessageName.trim(),
          message: newMessageContent.trim()
        })
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success && data.message) {
        setGuestbookMessages(prev => [data.message, ...prev]);
        setNewMessageName('');
        setNewMessageContent('');
      }
    } catch (error) {
      console.error('Failed to submit message:', error);
    } finally {
      setSubmittingMessage(false);
    }
  };

  useEffect(() => {
    loadActivities();
    loadVisitorCount();
    loadGuestbook();
    
    // 只在用户首次访问时增加计数（使用 sessionStorage 防止同一会话重复计数）
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      incrementVisitorCount();
      sessionStorage.setItem('hasVisited', 'true');
    }
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
      
      {/* 右上角音乐播放器 */}
      <div style={{
        position: 'fixed',
        top: '1.5rem',
        right: '2rem',
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.25)',
          borderRadius: '10px',
          padding: '0.5rem 0.8rem'
        }}>
          {/* 播放/暂停按钮 */}
          <button
            onClick={togglePlay}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isPlaying 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          {/* 音乐信息 */}
          <div>
            <div style={{
              fontSize: '0.7rem',
              color: 'white',
              fontWeight: '500',
              whiteSpace: 'nowrap'
            }}>
              {isPlaying ? 'Now Playing' : 'Paused'}
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: 'rgba(255, 255, 255, 0.7)',
              whiteSpace: 'nowrap'
            }}>
              Track {currentIndex + 1}/{totalSongs}
            </div>
          </div>
          {/* 下一首按钮 */}
          <button
            onClick={playNext}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.3)';
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            ⏭
          </button>
        </div>
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
          padding: '1.5rem 1rem 2rem'
        }}>
          {/* 头像区域 - 双击登录/登出 */}
          <div style={{
            width: '90%',
            aspectRatio: '1/1',
            borderRadius: '50%',
            marginBottom: '1rem',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            flexShrink: 0
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
            textAlign: 'left',
            marginBottom: '1.5rem'
          }}>
            <h1 style={{
              margin: '0 0 1rem',
              fontSize: '1.2rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              <span className="gradientText">SunnyLee</span>
            </h1>
            
            <h3 style={{
              margin: '0 0 1rem',
              fontSize: '1rem',
              color: 'white',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center'
            }}>
              <svg viewBox="0 0 1024 1024" style={{ width: '18px', height: '18px', fill: 'white', marginRight: '0.5rem' }}>
                <path d="M512 128c-212.096 0-384 171.904-384 384s171.904 384 384 384 384-171.904 384-384-171.904-384-384-384z m162.944 368.96l-182.72 182.72c-6.528 6.528-17.12 6.528-23.648 0l-182.72-182.72c-6.528-6.528-6.528-17.12 0-23.648s17.12-6.528 23.648 0l170.88 170.88 170.88-170.88c6.528-6.528 17.12-6.528 23.648 0s6.528 17.12 0 23.648z" />
              </svg>
              Information
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
              <svg viewBox="0 0 1024 1024" style={{ width: '16px', height: '16px', fill: 'white', marginRight: '0.5rem', flexShrink: 0 }}>
                <path d="M512 249.976471c-99.388235 0-180.705882 81.317647-180.705882 180.705882s81.317647 180.705882 180.705882 180.705882 180.705882-81.317647 180.705882-180.705882-81.317647-180.705882-180.705882-180.705882z m0 301.17647c-66.258824 0-120.470588-54.211765-120.470588-120.470588s54.211765-120.470588 120.470588-120.470588 120.470588 54.211765 120.470588 120.470588-54.211765 120.470588-120.470588 120.470588z" />
                <path d="M512 39.152941c-216.847059 0-391.529412 174.682353-391.529412 391.529412 0 349.364706 391.529412 572.235294 391.529412 572.235294s391.529412-222.870588 391.529412-572.235294c0-216.847059-174.682353-391.529412-391.529412-391.529412z m0 891.482353C424.658824 873.411765 180.705882 686.682353 180.705882 430.682353c0-183.717647 147.576471-331.294118 331.294118-331.294118s331.294118 147.576471 331.294118 331.294118c0 256-243.952941 442.729412-331.294118 499.952941z" />
              </svg>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'white' }}>
                Shanghai, China
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
              <svg viewBox="0 0 1024 1024" style={{ width: '16px', height: '16px', fill: 'white', marginRight: '0.5rem', flexShrink: 0 }}>
                <path d="M729.6 234.666667H294.4V157.866667a51.2 51.2 0 0 1 51.2-51.2h332.8a51.2 51.2 0 0 1 51.2 51.2v76.8z m179.2 51.2a51.2 51.2 0 0 1 51.2 51.2v512a51.2 51.2 0 0 1-51.2 51.2H115.2a51.2 51.2 0 0 1-51.2-51.2v-512a51.2 51.2 0 0 1 51.2-51.2h793.557333z m-768 172.032c0 16.384 13.312 29.696 29.696 29.696h683.008a29.696 29.696 0 1 0 0-59.392H170.410667a29.696 29.696 0 0 0-29.696 29.696z m252.416 118.784c0 16.384 13.312 29.696 29.696 29.696h178.176a29.696 29.696 0 1 0 0-59.392H422.912a29.738667 29.738667 0 0 0-29.696 29.696z" />
              </svg>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'white' }}>
                Zhejiang University
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
              <svg viewBox="0 0 1024 1024" style={{ width: '16px', height: '16px', fill: 'white', marginRight: '0.5rem', flexShrink: 0 }}>
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm-64-300c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v144c0 17.7-14.3 32-32 32h-64c-17.7 0-32-14.3-32-32V584zm96-312c-44.2 0-80 35.8-80 80s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80z" />
              </svg>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'white' }}>
                AI Infra Developer
              </p>
            </div>

            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              paddingTop: '1rem',
              textAlign: 'left'
            }}>
              <h3 style={{
                margin: '0 0 1rem',
                fontSize: '1rem',
                color: 'white',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg viewBox="0 0 1024 1024" style={{ width: '18px', height: '18px', fill: 'white', marginRight: '0.5rem' }}>
                  <path d="M512 236.288c-135.168 0-244.736 96.768-277.504 227.072-3.072 12.288-12.288 21.504-24.576 21.504h-61.44c-15.36 0-27.648-12.288-27.648-27.648 0-251.904 204.8-455.68 455.68-455.68s455.68 203.776 455.68 455.68c0 15.36-12.288 27.648-27.648 27.648h-61.44c-12.288 0-21.504-9.216-24.576-21.504C756.736 333.056 647.168 236.288 512 236.288z" />
                  <path d="M512 471.04c-33.792 0-61.44 27.648-61.44 61.44v184.32c0 33.792 27.648 61.44 61.44 61.44s61.44-27.648 61.44-61.44V532.48c0-33.792-27.648-61.44-61.44-61.44z" />
                </svg>
                Contact
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
            marginBottom: '1rem'
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

          {/* 留言板入口按钮 */}
          <div 
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.25)',
              borderRadius: '13px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '1.5rem'
            }}
            onClick={() => setShowGuestbookModal(true)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <img 
              src="/board.png" 
              alt="Guestbook" 
              style={{ 
                width: '40px', 
                height: '40px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '1rem',
                color: 'white',
                fontWeight: '600',
                marginBottom: '0.25rem'
              }}>
                留言板
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                留下你的足迹和想法
              </div>
            </div>
            <svg viewBox="0 0 1024 1024" style={{ 
              width: '20px', 
              height: '20px', 
              fill: 'rgba(255, 255, 255, 0.6)' 
            }}>
              <path d="M761.9 528.9L498.5 265.2c-3.2-3.2-8.4-3.2-11.6 0l-45.3 45.3c-3.2 3.2-3.2 8.4 0 11.6l201.2 201.2-201.2 201.2c-3.2 3.2-3.2 8.4 0 11.6l45.3 45.3c3.2 3.2 8.4 3.2 11.6 0l263.4-263.6c3.2-3.3 3.2-8.5 0-11.7z" />
            </svg>
          </div>
        </div>

        {/* 右侧内容区域 */}
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem 0 2rem',
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
            Hello I'm <span className="gradientText" style={{ fontSize: '3.5rem' }}>SunnyLee</span>
          </h2>
            <p style={{
              margin: '0',
              fontSize: '1.2rem',
              color: 'rgba(0, 0, 0, 0.7)',
              fontStyle: 'italic',
              fontFamily: 'Georgia, serif',
              letterSpacing: '0.5px'
            }}>
              "Nothing seek, nothing find"
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
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <button
                  onClick={() => router.push('/admin')}
                  style={{
                    margin: '0',
                    display: 'flex',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(102, 126, 234, 0.5)',
                    borderRadius: '8px',
                    padding: '15px',
                    height: '100px',
                    width: '100%',
                    transition: 'opacity 0.5s ease, background-color 0.2s ease, border 0.2s ease, transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.4) 100%)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)';
                  }}
                >
                  <div style={{
                    transition: 'width 0.4s ease',
                    height: '100%',
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      color: 'white',
                      fontWeight: '600',
                      marginBottom: '10px',
                      transition: 'font-size 0.4s ease'
                    }}>
                      管理后台
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}>
                      博客 / 图片 / 笔记 / 留言板
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 时间轴功能卡片 */}
          <div style={{ marginBottom: '1.5rem', width: '85%' }}>
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

      {/* 留言板模态框 */}
      {showGuestbookModal && (
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
          zIndex: 1000,
          padding: '2rem'
        }} onClick={() => setShowGuestbookModal(false)}>
          <div style={{
            width: '100%',
            maxWidth: '600px',
            maxHeight: '85vh',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            {/* 模态框头部 */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '1.3rem',
                color: 'white',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg viewBox="0 0 1024 1024" style={{ width: '24px', height: '24px', fill: 'white' }}>
                  <path d="M736 128c70.692 0 128 57.308 128 128v384c0 70.692-57.308 128-128 128H425.387L256 896l1.707-126.293C166.271 750.078 128 690.809 128 640V256c0-70.692 57.308-128 128-128h480m0-64H256C172.16 64 104 132.16 104 216v384c0 45.112 19.704 85.568 51.2 114.592V864l187.072-62.357C381.88 807.688 417.848 816 456 816h280c83.84 0 152-68.16 152-152V216c0-83.84-68.16-152-152-152z" />
                  <path d="M384 384h256v64H384zM384 512h160v64H384z" />
                </svg>
                访客留言板
              </h2>
              <button style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease'
              }} 
                onClick={() => setShowGuestbookModal(false)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                ×
              </button>
            </div>

            {/* 模态框内容 */}
            <div style={{
              padding: '1.5rem',
              overflowY: 'auto',
              flex: 1
            }}>
              {/* 访客计数器 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1.25rem',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  margin: '0 0 0.75rem',
                  fontSize: '1rem',
                  color: 'white',
                  fontWeight: '500'
                }}>
                  👋 访客计数
                </h3>
                <div style={{
                  fontSize: '2.5rem',
                  color: 'white',
                  fontWeight: '700',
                  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {visitorCount.toLocaleString()}
                </div>
                <p style={{
                  margin: '0.5rem 0 0',
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  感谢您的访问！
                </p>
              </div>

              {/* 发表留言表单 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <form onSubmit={submitGuestbookMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="你的名字"
                    value={newMessageName}
                    onChange={(e) => setNewMessageName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                    maxLength={255}
                  />
                  <textarea
                    placeholder="写下你的留言..."
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                    maxLength={1000}
                  />
                  <button
                    type="submit"
                    disabled={submittingMessage || !newMessageName.trim() || !newMessageContent.trim()}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      opacity: (submittingMessage || !newMessageName.trim() || !newMessageContent.trim()) ? 0.5 : 1
                    }}
                  >
                    {submittingMessage ? '发送中...' : '发表留言'}
                  </button>
                </form>
              </div>

              {/* 留言列表 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {guestbookLoading ? (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    加载留言中...
                  </div>
                ) : guestbookMessages.length === 0 ? (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    还没有留言，来成为第一个留言的人吧！
                  </div>
                ) : (
                  guestbookMessages.map((msg) => (
                    <div key={msg.id} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '1rem 1.25rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          color: 'white',
                          fontSize: '0.95rem'
                        }}>
                          {msg.name}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}>
                          {new Date(msg.created_at).toLocaleString('zh-CN')}
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        color: 'white',
                        lineHeight: '1.6'
                      }}>
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
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