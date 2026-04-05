'use client';

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

// 音乐文件列表 - 在这里添加你的音乐文件
const musicFiles = [
  '/back.mp3',
  '/back1.mp3',
  '/back2.mp3',
];

interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 随机选择下一首歌曲
  const playRandomSong = () => {
    if (musicFiles.length === 0) return;
    
    let nextIndex;
    if (musicFiles.length === 1) {
      nextIndex = 0;
    } else {
      // 确保不连续播放同一首歌
      do {
        nextIndex = Math.floor(Math.random() * musicFiles.length);
      } while (nextIndex === currentIndex);
    }
    
    setCurrentIndex(nextIndex);
  };

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

  // 当一首歌播放完时，自动播放下一首
  const handleSongEnd = () => {
    playRandomSong();
  };

  return (
    <MusicContext.Provider value={{ isPlaying, togglePlay }}>
      {children}
      <audio
        ref={audioRef}
        src={musicFiles[currentIndex]}
        onEnded={handleSongEnd}
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

