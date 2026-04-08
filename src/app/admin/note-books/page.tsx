'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function NoteBooksPage() {
  const [noteBooks, setNoteBooks] = useState<NoteBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
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
      const res = await fetch('/api/note-books');
      const data = await res.json();
      if (data.success) {
        setNoteBooks(data.noteBooks || []);
      }
    } catch (err) {
      console.error('Failed to fetch note books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/note-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setNewName('');
        fetchNoteBooks();
      } else {
        alert(data.error || 'Failed to create note book');
      }
    } catch (err) {
      alert('Failed to create note book');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note book? Notes will be moved to default note book.')) return;

    try {
      const res = await fetch(`/api/note-books/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        fetchNoteBooks();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;

    try {
      const res = await fetch(`/api/note-books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() })
      });
      const data = await res.json();

      if (data.success) {
        setEditingId(null);
        setEditName('');
        fetchNoteBooks();
      } else {
        alert(data.error || 'Failed to update');
      }
    } catch (err) {
      alert('Failed to update');
    }
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

      <button
        onClick={() => router.push('/admin/notes')}
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
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
        }}
      >
        ← Back
      </button>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto 2rem',
        paddingTop: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          color: 'white',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          margin: '0 0 1.5rem'
        }}>
          <span style={{
            fontFamily: 'cursive',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>📚 Note Books</span>
        </h1>

        <form onSubmit={handleCreate} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New note book name..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.25)',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                fontSize: '1rem',
                color: 'white',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={creating || !newName.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: creating ? 'not-allowed' : 'pointer',
                fontWeight: '600'
              }}
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {noteBooks.length === 0 ? (
          <div style={{
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.25)',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            No note books
          </div>
        ) : (
          noteBooks.map((noteBook) => (
            <div
              key={noteBook.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                background: 'rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: '600', color: 'white' }}>
                  {noteBook.name}
                  {noteBook.is_default && (
                    <span style={{
                      marginLeft: '0.5rem',
                      padding: '0.2rem 0.5rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: 'white'
                    }}>
                      Default
                    </span>
                  )}
                </h3>
                <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>
                  Created: {new Date(noteBook.created_at).toLocaleDateString()}
                </p>
              </div>

              {!noteBook.is_default && (
                <button
                  onClick={() => handleDelete(noteBook.id)}
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
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
