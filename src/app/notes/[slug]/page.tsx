'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function NotePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug);
      fetchNote(p.slug);
    });
  }, [params]);

  const fetchNote = async (noteSlug: string) => {
    try {
      const res = await fetch(`/api/notes/${noteSlug}`);
      const data = await res.json();
      if (data.success && data.note) {
        setNote(data.note);
      }
    } catch (err) {
      console.error('Failed to fetch note:', err);
    } finally {
      setLoading(false);
    }
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

  if (!note) {
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
        <div style={{ color: 'white', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Note Not Found</h1>
          <button
            onClick={() => router.push('/notes')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Back to Notes
          </button>
        </div>
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
        onClick={() => router.push('/notes')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '500',
          color: 'white',
          fontSize: '0.9rem',
          transition: 'all 0.3s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.7)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.5)';
        }}
      >
        ← Back to Notes
      </button>

      {/* 文章内容 */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        paddingTop: '4rem'
      }}>
        <div style={{
          background: 'rgba(20, 20, 20, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '2.5rem'
        }}>
          {/* 标题 */}
          <h1 style={{
            fontSize: '2rem',
            color: 'white',
            fontWeight: '600',
            marginBottom: '0.5rem',
            lineHeight: '1.3'
          }}>
            {note.title}
          </h1>

          {/* 日期 */}
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.9rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {new Date(note.created_at).toLocaleDateString()}
          </p>

          {/* Markdown 内容 */}
          <article style={{
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.8',
            fontSize: '1rem'
          }}>
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 style={{ color: 'white', fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.8rem', fontWeight: '600' }}>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{ color: 'white', fontSize: '1.25rem', marginTop: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>{children}</h3>
                ),
                p: ({ children }) => (
                  <p style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.85)' }}>{children}</p>
                ),
                ul: ({ children }) => (
                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.85)' }}>{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.85)' }}>{children}</ol>
                ),
                li: ({ children }) => (
                  <li style={{ marginBottom: '0.5rem' }}>{children}</li>
                ),
                a: ({ children, href }) => (
                  <a href={href} style={{ color: '#4ecdc4', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{children}</a>
                ),
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
                    <code className={className} style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.9rem' }} {...props}>
                      {children}
                    </code>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote style={{ borderLeft: '4px solid #4ecdc4', paddingLeft: '1rem', marginLeft: 0, color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic' }}>{children}</blockquote>
                ),
                img: ({ src, alt }) => (
                  <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: '8px', margin: '1rem 0' }} />
                ),
              }}
            >
              {note.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
