'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface NoteBook {
  id: number;
  name: string;
  is_default: boolean;
  created_at: string;
}

interface Note {
  id: number;
  title: string;
  slug: string;
  note_book_id: number;
  note_book_name: string;
  created_at: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteBooks, setNoteBooks] = useState<NoteBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedNoteBook, setSelectedNoteBook] = useState<number | null>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchMessage, setSearchMessage] = useState<{type: 'success' | 'info', text: string} | null>(null);
  const router = useRouter();
  const abortControllerRef = React.useRef<AbortController | null>(null);

  useEffect(() => {
    fetchNoteBooks();
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [search, selectedNoteBook]);

  const fetchNoteBooks = async () => {
    try {
      const res = await fetch('/api/note-books');
      const data = await res.json();
      if (data.success) {
        setNoteBooks(data.noteBooks || []);
      }
    } catch (err) {
      console.error('Failed to fetch note books:', err);
    }
  };

  const fetchNotes = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    try {
      let url = '/api/notes';
      const params: string[] = [];
      if (search) params.push('search=' + encodeURIComponent(search));
      if (selectedNoteBook) params.push('note_book_id=' + selectedNoteBook);
      if (params.length > 0) url += '?' + params.join('&');

      const res = await fetch(url, {
        signal: abortControllerRef.current?.signal
      });
      const data = await res.json();
      if (data.success) {
        setNotes(data.notes || []);
      } else {
        setNotes([]);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.error('Failed to fetch notes:', err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearchExpanded(false);
    await fetchNotes();

    // 显示搜索结果提示
    if (search && notes.length === 0) {
      setSearchMessage({ type: 'info', text: '未找到相关笔记' });
    } else if (search && notes.length > 0) {
      const noteBookName = selectedNoteBook
        ? noteBooks.find(n => n.id === selectedNoteBook)?.name || '当前'
        : '所有';
      setSearchMessage({ type: 'success', text: `在「${noteBookName}」搜索到 ${notes.length} 项内容` });
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
        backgroundImage: 'url(\'/boatseas.jpg\')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ color: '#1a1a1a', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(\'/boatseas.jpg\')',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '2rem',
      position: 'relative'
    }}>
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
        {searchExpanded && (
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索笔记..."
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
            src="/notes.png" 
            alt="Notes" 
            style={{ marginRight: '12px', width: '36px', height: '36px' }}
          />
          <span style={{
            fontFamily: 'cursive',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Notes</span>
        </h1>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button
            onClick={async () => {
              setSelectedNoteBook(null);
              setSearch('');
              setSearchMessage(null);
              setLoading(true);
              await fetchNotes();
            }}
            style={{
              padding: '0.5rem 1rem',
              background: selectedNoteBook === null ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(0, 0, 0, 0.4)',
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
          {noteBooks.map((noteBook) => (
            <button
              key={noteBook.id}
              onClick={async () => {
                setSelectedNoteBook(noteBook.id);
                setSearch('');
                setSearchMessage(null);
                setLoading(true);
                await fetchNotes();
              }}
              style={{
                padding: '0.5rem 1rem',
                background: selectedNoteBook === noteBook.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(0, 0, 0, 0.4)',
                color: 'white',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
            >
              {noteBook.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {notes.length === 0 ? (
          <div style={{ color: 'rgba(0, 0, 0, 0.7)', gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            No notes found
          </div>
        ) : (
          notes.map((note, index) => (
            <div
              key={note.id}
              onClick={() => router.push('/notes/' + note.slug)}
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
                  {note.title}
                </h2>
                <p style={{
                  margin: '0 0 0.25rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.85rem'
                }}>
                  {new Date(note.created_at).toLocaleDateString()}
                </p>
                {note.note_book_name && (
                  <p style={{
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.8rem'
                  }}>
                    📁 {note.note_book_name}
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
