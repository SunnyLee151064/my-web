'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  // 检查是否已有管理员
  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const res = await fetch('/api/auth/check-admin');
      const data = await res.json();
      if (data.exists) {
        setAdminExists(true);
        setIsRegister(false);
      }
    } catch (err) {
      console.error('Failed to check admin:', err);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem',
            color: 'white'
          }}>
            USER
          </div>
          <h1 style={{
            margin: 0,
            fontSize: '1.5rem',
            color: '#333',
            fontWeight: '600'
          }}>
            {isRegister ? "Register" : "Login"}
          </h1>
          <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.9rem' }}>
            {isRegister ? "Create your admin account" : "Login to your site"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          {error && (
            <div style={{
              color: '#e74c3c',
              marginBottom: '1rem',
              padding: '0.75rem',
              background: '#fde8e7',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            {loading ? "Loading..." : (isRegister ? "Register" : "Login")}
          </button>
        </form>

        {!adminExists && (
          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666' }}>
            {isRegister ? "Already have account?" : "No account?"}
            <button
              onClick={() => setIsRegister(!isRegister)}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontWeight: '600',
                marginLeft: '0.25rem'
              }}
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        )}

        {adminExists && (
          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
            Admin already exists. Please login.
          </p>
        )}

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'transparent',
              border: '1px solid #667eea',
              color: '#667eea',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#667eea';
              (e.currentTarget as HTMLElement).style.color = 'white';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#667eea';
            }}
          >
            Back to Home
          </button>
        </p>
      </div>
    </div>
  );
}