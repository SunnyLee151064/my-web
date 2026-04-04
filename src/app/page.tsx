'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState('');

  const handleVisitor = () => {
    setLoading('visitor');
    router.push('/blog');
  };

  const handleAdmin = () => {
    setLoading('admin');
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/welcome');
    } else {
      router.push('/login');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2rem'
        }}>
          Hi
        </div>

        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem', color: '#333', fontWeight: '600' }}>
          Welcome
        </h1>
        <p style={{ margin: '0 0 2rem', color: '#666', fontSize: '1rem' }}>
          Who are you?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={handleVisitor}
            disabled={loading === 'visitor'}
            style={{
              padding: '1.25rem',
              background: 'white',
              border: '2px solid #667eea',
              borderRadius: '12px',
              cursor: loading === 'visitor' ? 'not-allowed' : 'pointer',
              opacity: loading === 'visitor' ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>👋</span>
            <span style={{ color: '#333', fontWeight: '600', fontSize: '1.1rem' }}>
              I am a Visitor
            </span>
          </button>

          <button
            onClick={handleAdmin}
            disabled={loading === 'admin'}
            style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: loading === 'admin' ? 'not-allowed' : 'pointer',
              opacity: loading === 'admin' ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🔐</span>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>
              I am Admin
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}