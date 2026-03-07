'use client';

import React, { useRef, useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Settings,
  Info,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  videoId: string;
  youtubeUrl: string;
  startPosition?: number;
  onProgress?: (time: number) => void;
  onCompleted?: () => void;
}

const formatTime = (time: number) => {
  if (isNaN(time)) return '00:00';
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  youtubeUrl,
  startPosition = 0,
  onProgress,
  onCompleted
}) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<any>(null);
  const uiInterval = useRef<any>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimeout = useRef<any>(null);

  // Improved robust YouTube ID extraction
  const getYTId = (url: string) => {
    if (!url) return '';
    try {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[7].length === 11) ? match[7] : url;
    } catch (e) {
      return url;
    }
  };

  const ytId = getYTId(youtubeUrl);

  useEffect(() => {
    setIsReady(false); // Reset when source changes
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (uiInterval.current) clearInterval(uiInterval.current);
      if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    };
  }, [youtubeUrl]);

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
    setIsReady(true);
    setDuration(event.target.getDuration());
    if (startPosition > 0) {
      event.target.seekTo(startPosition, true);
    }

    if (uiInterval.current) clearInterval(uiInterval.current);
    uiInterval.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
        const state = playerRef.current.getPlayerState();
        if (state === 1) { // PLAYING
          setCurrentTime(playerRef.current.getCurrentTime());
        }
      }
    }, 500);
  };

  const onStateChange = (event: any) => {
    // PLAYING = 1, PAUSED = 2, ENDED = 0
    if (event.data === 1) {
      setIsPlaying(true);
      if (progressInterval.current) clearInterval(progressInterval.current);
      progressInterval.current = setInterval(() => {
        const time = playerRef.current.getCurrentTime();
        if (onProgress) onProgress(Math.floor(time));
      }, 5000);
    } else {
      setIsPlaying(false);
      if (progressInterval.current) clearInterval(progressInterval.current);
    }

    if (event.data === 0) {
      if (onCompleted) onCompleted();
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current) return;
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    playerRef.current.seekTo(time, true);
  };

  const skipForward = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(currentTime + 10, true);
  };

  const skipBackward = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(Math.max(0, currentTime - 10), true);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative aspect-video w-full glass-card overflow-hidden bg-black group"
    >
      <AnimatePresence>
        {!isReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white gap-4"
          >
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <p className="text-muted text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Initializing Stream</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none z-0">
        <YouTube
          videoId={ytId}
          opts={{
            height: '100%',
            width: '100%',
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
            },
          }}
          onReady={onPlayerReady}
          onStateChange={onStateChange}
          className="w-full h-full transform scale-[1.01]"
        />
      </div>

      <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />

      <div className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-500 transform ${showControls || !isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="px-6 py-6 bg-gradient-to-t from-black via-black/40 to-transparent space-y-4">
          {/* Custom Sleek Progress Bar */}
          <div className="relative group/progress h-1.5 w-full bg-white/10 rounded-full cursor-pointer transition-all hover:h-2">
            <div
              className="absolute top-0 left-0 h-full bg-accent rounded-full z-10 pointer-events-none"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl opacity-0 scale-50 group-hover/progress:opacity-100 group-hover/progress:scale-100 transition-all" />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <button onClick={skipBackward} className="text-white/70 hover:text-white transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button onClick={togglePlay} className="text-white hover:scale-110 transition-all h-10 w-10 flex items-center justify-center bg-accent/20 rounded-full backdrop-blur-md border border-accent/30">
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
                </button>
                <button onClick={skipForward} className="text-white/70 hover:text-white transition-colors rotate-180">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="text-white/90 text-sm font-black font-mono tracking-tighter tabular-nums flex items-center gap-2">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-white/30">/</span>
                  <span className="text-white/50">{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="text-white/50 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button onClick={toggleFullScreen} className="text-white/70 hover:text-white transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

