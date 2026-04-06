'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  role: string;
}

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

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteBooks, setNoteBooks] = useState<NoteBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedNoteBook, setSelectedNoteBook] = useState<number | null>(null);
  const router = useRouter();
  const abortControllerRef = React.useRef<AbortController | null>(null);

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

  useEffect(() => {
    fetchNotes();
  }, [selectedNoteBook]);

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
      if (selectedNoteBook) url += '?note_book_id=' + selectedNoteBook;
      
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const res = await fetch('/api/notes/' + id, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        await fetchNotes();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const getRandomColor = (index: number) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'];
    return colors[index % colors.length];
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
        <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading...</div>
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
          }}>Manage Notes</span>
        </h1>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button
            onClick={async () => {
              setSelectedNoteBook(null);
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
                setLoading(true);
                await fetchNotes();
              }}
              style={{
                padding: '0.5rem 1rem',
                background: selectedNoteBook === noteBook.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(0, 0, 0, 0.4)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
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
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            No notes found
          </div>
        ) : (
          notes.map((note, index) => (
            <div
              key={note.id}
              style={{
                background: 'rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                padding: '1.5rem',
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
                <Link href={'/notes/' + note.slug} style={{ color: 'white', textDecoration: 'none' }}>
                  <h2 style={{
                    margin: '0 0 0.5rem',
                    fontSize: '1.2rem',
                    color: 'white',
                    fontWeight: '600'
                  }}>
                    {note.title}
                  </h2>
                </Link>
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
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
                <Link
                  href={'/admin/notes/edit/' + note.id}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(102, 126, 234, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    textAlign: 'center'
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(note.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 68, 68, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        display: 'flex',
        gap: '1rem',
        zIndex: 10
      }}>
        <Link
          href="/admin/notes/new"
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          + New Note
        </Link>
        <Link
          href="/admin/note-books"
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          ⚙️ Manage Note Books
        </Link>
      </div>
    </div>
  );
}
