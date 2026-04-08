'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  role: string;
}

interface GuestbookMessage {
  id: number;
  name: string;
  message: string;
  is_approved: boolean;
  created_at: string;
}

export default function AdminGuestbookPage() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.username && parsedUser.role) {
          setUser(parsedUser);
          if (parsedUser.role !== 'admin') {
            router.push('/');
          } else {
            fetchMessages();
          }
        } else {
          localStorage.removeItem('user');
          router.push('/login');
        }
      } catch (error) {
        localStorage.removeItem('user');
        router.push('/login');
      }
    }
  }, [router]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/guestbook?includeAll=true');
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch guestbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch('/api/guestbook', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_approved: true })
      });
      const data = await res.json();
      if (data.success) {
        await fetchMessages();
      }
    } catch (error) {
      console.error('Failed to approve message:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await fetch('/api/guestbook', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_approved: false })
      });
      const data = await res.json();
      if (data.success) {
        await fetchMessages();
      }
    } catch (error) {
      console.error('Failed to reject message:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/guestbook?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        await fetchMessages();
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'pending') return !msg.is_approved;
    if (filter === 'approved') return msg.is_approved;
    return true;
  });

  if (loading) {
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
        alignItems: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url('/boatseas.jpg')`,
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
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        display: 'flex',
        gap: '0.75rem',
        zIndex: 10
      }}>
        <button
          onClick={() => router.push('/admin')}
          style={{
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.25)',
            borderRadius: '7px',
            cursor: 'pointer',
            fontWeight: '500',
            color: 'white',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          ← Admin
        </button>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '0.5rem 1rem',
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.25)',
            borderRadius: '7px',
            cursor: 'pointer',
            fontWeight: '500',
            color: 'white',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          Home
        </button>
      </div>

      {/* 标题和筛选 */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto 2rem',
        paddingTop: '4rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: 'white',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          margin: '0 0 1.5rem'
        }}>
          <svg viewBox="0 0 1024 1024" style={{ width: '36px', height: '36px', fill: 'white', marginRight: '12px' }}>
            <path d="M736 128c70.692 0 128 57.308 128 128v384c0 70.692-57.308 128-128 128H425.387L256 896l1.707-126.293C166.271 750.078 128 690.809 128 640V256c0-70.692 57.308-128 128-128h480m0-64H256C172.16 64 104 132.16 104 216v384c0 45.112 19.704 85.568 51.2 114.592V864l187.072-62.357C381.88 807.688 417.848 816 456 816h280c83.84 0 152-68.16 152-152V216c0-83.84-68.16-152-152-152z" />
            <path d="M384 384h256v64H384zM384 512h160v64H384z" />
          </svg>
          <span style={{
            fontFamily: 'cursive',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Manage Guestbook</span>
        </h1>

        {/* 筛选按钮 */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === 'all' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === 'pending' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          >
            Pending ({messages.filter(m => !m.is_approved).length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === 'approved' ? 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)' : 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          >
            Approved ({messages.filter(m => m.is_approved).length})
          </button>
        </div>
      </div>

      {/* 留言列表 */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {filteredMessages.length === 0 ? (
          <div style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            textAlign: 'center', 
            padding: '3rem',
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.25)',
            borderRadius: '12px'
          }}>
            No messages found
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              style={{
                background: 'rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                padding: '1.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
              }}
            >
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '1.1rem'
                  }}>
                    {msg.name}
                  </span>
                  <span style={{
                    fontSize: '0.8rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    background: msg.is_approved 
                      ? 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)' 
                      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    fontWeight: '500'
                  }}>
                    {msg.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  {new Date(msg.created_at).toLocaleString('zh-CN')}
                </span>
              </div>
              <p style={{
                margin: '0 0 1rem',
                fontSize: '0.95rem',
                color: 'white',
                lineHeight: '1.6'
              }}>
                {msg.message}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {!msg.is_approved && (
                  <button
                    onClick={() => handleApprove(msg.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(78, 205, 196, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ✅ Approve
                  </button>
                )}
                {msg.is_approved && (
                  <button
                    onClick={() => handleReject(msg.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(240, 147, 251, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ❌ Reject
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 68, 68, 0.9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
