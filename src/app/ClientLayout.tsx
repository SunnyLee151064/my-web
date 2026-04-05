'use client';

import { ReactNode } from 'react';
import { MusicProvider } from '@/contexts/MusicContext';
import { useMusic } from '@/contexts/MusicContext';

function MusicControlButton() {
  const { isPlaying, togglePlay } = useMusic();
  
  return (
    <button
      onClick={togglePlay}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.25)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.15)';
      }}
    >
      {isPlaying ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      )}
    </button>
  );
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <MusicProvider>
      {children}
      <MusicControlButton />
    </MusicProvider>
  );
}
