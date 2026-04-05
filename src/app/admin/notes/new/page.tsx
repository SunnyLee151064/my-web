'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface User {
  id: number;
  username: string;
  role: string;
}

interface NoteBook {
  id: number;
  name: string;
  is_default: boolean;
}

export default function NewNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [note_bookId, setNoteBookId] = useState<number>(1);
  const [note_books, setNoteBooks] = useState<NoteBook[]>([]);
  const [loading, setLoading] = useState(false);
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
          } else {
            fetchNoteBooks();
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

  const fetchNoteBooks = async () => {
    try {
      const res = await fetch('/api/note_books');
      const data = await res.json();
      if (data.success) {
        setNoteBooks(data.note_books || []);
        // 设置默认笔记本
        const defaultNoteBook = data.note_books.find((n: NoteBook) => n.is_default);
        if (defaultNoteBook) {
          setNoteBookId(defaultNoteBook.id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch note_books:', err);
    }
  };

  // 防止重复提交的状态
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || submitted) return;

    setLoading(true);
    setSubmitted(true);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now();

    try {
      const res = await fetch('/api/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, slug, note_book_id: note_bookId }),
      });

      const data = await res.json();

      if (data.success) {
        // 延迟跳转，确保状态更新
        setTimeout(() => {
          router.push('/admin/note');
        }, 100);
      } else {
        alert(data.error || 'Failed to create note');
        setSubmitted(false);
      }
    } catch (err) {
      alert('Failed to create note');
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

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
        onClick={() => router.push('/admin/note')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.25)',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '500',
          color: '#1a1a1a',
          fontSize: '0.9rem',
          transition: 'all 0.3s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
        }}
      >
        ← Back
      </button>

      {/* 表单内容 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '4rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.15)',
          borderRadius: '16px',
          padding: '2rem'
        }}>
          <h1 style={{
            fontSize: '1.8rem',
            color: '#1a1a1a',
            fontWeight: '600',
            margin: '0 0 1.5rem'
          }}>
            New Note
          </h1>

          <form onSubmit={handleSubmit}>
            {/* 标题和笔记本选择 */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 2 }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'rgba(0, 0, 0, 0.8)',
                  fontWeight: '500'
                }}>
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    background: 'rgba(255, 255, 255, 0.3)',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    color: '#1a1a1a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'rgba(0, 0, 0, 0.8)',
                  fontWeight: '500'
                }}>
                  NoteBook
                </label>
                <select
                  value={note_bookId}
                  onChange={(e) => setNoteBookId(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    background: 'rgba(255, 255, 255, 0.3)',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    color: '#1a1a1a',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  {note_books.map((note_book) => (
                    <option key={note_book.id} value={note_book.id}>
                      {note_book.name} {note_book.is_default ? '(Default)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 编辑器和预览 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(0, 0, 0, 0.8)',
                fontWeight: '500'
              }}>
                Content (Markdown supported)
              </label>
              
              {/* 快捷按钮 */}
              <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    const codeBlock = '\n```javascript\n// 在这里写JavaScript代码\n```\n';
                    setContent(content + codeBlock);
                  }}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: 'rgba(102, 126, 234, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  + JS Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const codeBlock = '\n```python\n# 在这里写Python代码\n```\n';
                    setContent(content + codeBlock);
                  }}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: 'rgba(102, 126, 234, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  + Python Code
                </button>
                <label style={{
                  padding: '0.25rem 0.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}>
                  📷 + Image
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      const formData = new FormData();
                      formData.append('file', file);
                      
                      try {
                        const res = await fetch('/api/note-images', {
                          method: 'POST',
                          body: formData
                        });
                        const data = await res.json();
                        if (data.success) {
                          setContent(content + `\n![${data.filename}](${data.url})\n`);
                        }
                      } catch (err) {
                        alert('Failed to upload image');
                      }
                    }}
                  />
                </label>
                <span style={{ fontSize: '0.8rem', color: 'rgba(0, 0, 0, 0.6)', alignSelf: 'center' }}>
                  使用 ```language 来添加代码块
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', height: '400px' }}>
                {/* 编辑器 */}
                <div style={{ flex: 1 }}>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your content in Markdown...&#10;&#10;代码块示例:&#10;```javascript&#10;function hello() {&#10;  console.log('Hello World!');&#10;}&#10;```"
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.3)',
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      borderRadius: '8px 0 0 8px',
                      fontSize: '1rem',
                      color: '#1a1a1a',
                      fontFamily: 'monospace',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'none',
                      lineHeight: '1.5'
                    }}
                    required
                  />
                </div>
                {/* 预览 */}
                <div style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(0, 0, 0, 0.2)',
                  borderRadius: '0 8px 8px 0',
                  padding: '1rem',
                  overflow: 'auto'
                }}>
                  <h3 style={{ margin: '0 0 1rem', color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.9rem' }}>Preview</h3>
                  <div style={{ color: '#1a1a1a', lineHeight: '1.6' }}>
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          
                          // 如果是块级代码
                          if (!inline) {
                            const language = match ? match[1] : 'text';
                            return (
                              <div style={{ margin: '1rem 0', borderRadius: '8px', overflow: 'hidden' }}>
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={language}
                                  PreTag="div"
                                  customStyle={{ margin: 0 }}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              </div>
                            );
                          }
                          
                          // 如果是行内代码
                          return (
                            <code className={className} style={{ background: 'rgba(0, 0, 0, 0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.9rem' }} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {content || '*No content yet*'}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                {loading ? 'Publishing...' : 'Publish'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin/note')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(0, 0, 0, 0.1)',
                  color: '#1a1a1a',
                  border: '1px solid rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}