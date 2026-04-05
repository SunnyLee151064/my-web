'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  role: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
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

  const adminItems = [
    {
      title: 'Blog Posts',
      description: 'Manage your blog articles',
      href: '/admin/blog',
      icon: '📝',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Notes',
      description: 'Manage your notes and notebooks',
      href: '/admin/notes',
      icon: '📓',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Photos',
      description: 'Manage your photo albums',
      href: '/admin/photos',
      icon: '📷',
      color: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)'
    },
    {
      title: 'Guestbook',
      description: 'Manage guestbook messages',
      href: '/admin/guestbook',
      icon: '💬',
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    }
  ];

  if (!user) {
    return null;
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
      <button
        onClick={() => router.push('/')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
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
          transition: 'all 0.3s ease',
          zIndex: 10
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
        ← Back
      </button>

      {/* 标题 */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto 3rem',
        paddingTop: '4rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: 'white',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          margin: '0 0 1rem'
        }}>
          <span style={{
            fontFamily: 'cursive',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Admin Dashboard</span>
        </h1>
        <p style={{
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: 0
        }}>
          Manage your website content
        </p>
      </div>

      {/* 管理项网格 */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {adminItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            style={{
              textDecoration: 'none',
              display: 'block'
            }}
          >
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.25)',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '3.5rem',
                marginBottom: '1rem'
              }}>
                {item.icon}
              </div>
              <h3 style={{
                margin: '0 0 0.5rem',
                fontSize: '1.3rem',
                color: 'white',
                fontWeight: '600'
              }}>
                {item.title}
              </h3>
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
