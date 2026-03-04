'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

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

  // Extract ID from URL
  const getYTId = (url: string) => {
    try {
      if (url.includes('v=')) return url.split('v=')[1].split('&')[0];
      if (url.includes('be/')) return url.split('be/')[1].split('?')[0];
      return url;
    } catch (e) {
      return '';
    }
  };

  const ytId = getYTId(youtubeUrl);

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (uiInterval.current) clearInterval(uiInterval.current);
      if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    };
  }, []);

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
    setIsReady(true);
    setDuration(event.target.getDuration());
    if (startPosition > 0) {
      event.target.seekTo(startPosition, true);
    }

    // UI Update interval for progress bar
    uiInterval.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getPlayerState() === 1) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);
  };

  const onStateChange = (event: any) => {
    // PLAYING = 1, PAUSED = 2, ENDED = 0
    if (event.data === 1) {
      setIsPlaying(true);
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
      className="relative aspect-video w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-black transition-all group"
    >
      {/* The YouTube iframe is wrapped in a container that prevents clicking on it to ensure custom controls are used */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <YouTube
          videoId={ytId}
          opts={{
            height: '100%',
            width: '100%',
            playerVars: {
              autoplay: 1,
              controls: 0, // Disable YouTube UI
              disablekb: 1, // Disable keyboard controls (handled by us)
              fs: 0, // Disable fullscreen button
              modestbranding: 1,
              rel: 0,
            },
          }}
          onReady={onPlayerReady}
          onStateChange={onStateChange}
          className="w-full h-full transform scale-[1.05]" // Slight scale to hide edges/borders of iframe sometimes visible
        />
      </div>

      {/* Transparent overlay to capture clicks instead of youtube iframe */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={togglePlay}
      />

      {/* Custom Controls UI */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 px-4 py-4 md:px-6 md:py-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Progress Bar */}
        <div className="relative w-full h-1.5 md:h-2 bg-white/20 rounded-full mb-4 group/progress cursor-pointer">
          <div
            className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full peer pointer-events-none"
            style={{ width: `${progressPercentage}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={togglePlay}
              className="text-white hover:text-indigo-400 transition-colors outline-none"
            >
              {isPlaying ? <Pause className="w-6 h-6 md:w-8 md:h-8 fill-current" /> : <Play className="w-6 h-6 md:w-8 md:h-8 fill-current" />}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-indigo-400 transition-colors outline-none"
              >
                {isMuted ? <VolumeX className="w-5 h-5 md:w-6 md:h-6" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
            </div>
            <div className="text-white text-xs md:text-sm font-medium font-mono tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleFullScreen}
              className="text-white hover:text-indigo-400 transition-colors outline-none"
            >
              <Maximize className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
