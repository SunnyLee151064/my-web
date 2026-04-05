'use client';

import { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, togglePlay }}>
      {children}
      <audio
        ref={audioRef}
        src="/back.mp3"
        loop
        onLoadedMetadata={(e) => {
          e.currentTarget.volume = 0.5;
        }}
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
