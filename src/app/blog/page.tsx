'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Notebook {
  id: number;
  name: string;
  is_default: boolean;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  notebook_id: number;
  notebook_name: string;
  created_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedNotebook, setSelectedNotebook] = useState<number | null>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchMessage, setSearchMessage] = useState<{type: 'success' | 'info', text: string} | null>(null);
  const router = useRouter();
  const abortControllerRef = React.useRef<AbortController | null>(null);

  useEffect(() => {
    fetchNotebooks();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [search, selectedNotebook]);

  const fetchNotebooks = async () => {
    try {
      const res = await fetch('/api/notebooks');

      if (!res.ok) {
        console.error('API error:', res.status, res.statusText);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setNotebooks(data.notebooks || []);
      }
    } catch (err) {
      console.error('Failed to fetch notebooks:', err);
    }
  };

  const fetchPosts = async () => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的AbortController
    abortControllerRef.current = new AbortController();

    try {
      let url = '/api/blog';
      const params: string[] = [];
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (selectedNotebook) params.push(`notebook_id=${selectedNotebook}`);
      if (params.length > 0) url += '?' + params.join('&');

      const res = await fetch(url, {
        signal: abortControllerRef.current?.signal
      });

      // 检查响应状态
      if (!res.ok) {
        console.error('API error:', res.status, res.statusText);
        setPosts([]);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      } else {
        console.error('API returned error:', data.error);
        setPosts([]);
      }
    } catch (err) {
      // 忽略取消请求的错误
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.error('Failed to fetch posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearchExpanded(false);

    // 直接获取搜索结果，不用 fetchPosts，避免时序问题
    let url = '/api/blog';
    const params: string[] = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (selectedNotebook) params.push(`notebook_id=${selectedNotebook}`);
    if (params.length > 0) url += '?' + params.join('&');

    const res = await fetch(url);
    const data = await res.json();
    const results = data.posts || [];
    setPosts(results);
    setLoading(false);

    // 显示搜索结果提示
    if (search && results.length === 0) {
      setSearchMessage({ type: 'info', text: '未找到相关博客' });
    } else if (search && results.length > 0) {
      const notebookName = selectedNotebook
        ? notebooks.find(n => n.id === selectedNotebook)?.name || '当前'
        : '所有';
      setSearchMessage({ type: 'success', text: `在「${notebookName}」搜索到 ${results.length} 项内容` });
    } else {
      setSearchMessage(null);
    }

    // 3秒后自动隐藏提示
    setTimeout(() => setSearchMessage(null), 3000);
  };
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

      {/* 搜索按钮和内联搜索栏 */}
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        zIndex: 10
      }}>
        {/* 内联搜索栏 - 展开时显示 */}
        {searchExpanded && (
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索博客..."
              autoFocus
              style={{
                width: '200px',
                padding: '0.5rem 0.75rem',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                fontSize: '0.9rem',
                color: 'white',
                outline: 'none',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.5rem 0.75rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500'
              }}
            >
              🔍
            </button>
          </form>
        )}

        {/* 搜索按钮 - 未展开时显示 */}
        {!searchExpanded && (
          <button
            onClick={() => setSearchExpanded(true)}
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
            🔍 Search
          </button>
        )}
      </div>

      {/* 搜索结果提示 */}
      {searchMessage && (
        <div style={{
          position: 'absolute',
          top: '5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.5rem 1rem',
          background: searchMessage.type === 'success' ? 'rgba(102, 126, 234, 0.9)' : 'rgba(100, 100, 100, 0.9)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '0.9rem',
          zIndex: 20,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          {searchMessage.text}
        </div>
      )}

      {/* 标题和笔记本列表 */}
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
          <img 
            src="/blogs.png" 
            alt="Blog" 
            style={{ marginRight: '12px', width: '36px', height: '36px' }}
          />
          <span style={{
            fontFamily: 'cursive',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Blog</span>
        </h1>

        {/* 笔记本列表 */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button
            onClick={async () => {
              setSelectedNotebook(null);
              setSearch('');
              setSearchMessage(null);
              setLoading(true);
              await fetchPosts();
            }}
            style={{
              padding: '0.5rem 1rem',
              background: selectedNotebook === null ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(0, 0, 0, 0.4)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          >
            All
          </button>
          {notebooks.map((notebook) => (
            <button
              key={notebook.id}
              onClick={async () => {
                setSelectedNotebook(notebook.id);
                setSearch('');
                setSearchMessage(null);
                setLoading(true);
                await fetchPosts();
              }}
              style={{
                padding: '0.5rem 1rem',
                background: selectedNotebook === notebook.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(0, 0, 0, 0.4)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
            >
              {notebook.name}
            </button>
          ))}
        </div>
      </div>

      {/* 博客列表 */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {posts.length === 0 ? (
          <div style={{ color: 'rgba(0, 0, 0, 0.7)', gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            No posts found
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={post.id}
              onClick={() => router.push(`/blog/${post.slug}`)}
              style={{
                background: 'rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
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
              <div style={{ flex: 1 }}>
                <h2 style={{
                  margin: '0 0 0.5rem',
                  fontSize: '1.2rem',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {post.title}
                </h2>
                <p style={{
                  margin: '0 0 0.25rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.85rem'
                }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                {post.notebook_name && (
                  <p style={{
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.8rem'
                  }}>
                    📁 {post.notebook_name}
                  </p>
                )}
              </div>
              <div style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                marginLeft: '1rem',
                fontSize: '0.85rem',
                color: 'white',
                fontWeight: '500'
              }}>
                Read
              </div>
            </div>
          ))
        )}
      </div>


    </div>
  );
}