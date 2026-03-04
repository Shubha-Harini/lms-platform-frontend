'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { VideoPlayer } from '@/components/Video/VideoPlayer';
import { Lock, ChevronLeft, ChevronRight, Play, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoData {
  id: number;
  title: string;
  description: string;
  youtube_url: string;
  section_title: string;
  subject_title: string;
  locked: boolean;
  unlock_reason?: string;
  prevVideoId?: number;
  nextVideoId?: number;
}

export default function VideoPage() {
  const { subjectId, videoId } = useParams();
  const router = useRouter();

  const [video, setVideo] = useState<VideoData | null>(null);
  const [startPos, setStartPos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoId) {
      setLoading(true);
      // Fetch video details
      apiClient.get(`/videos/${videoId}`)
        .then(res => {
          setVideo(res.data);
          // Fetch progress
          return apiClient.get(`/progress/videos/${videoId}`);
        })
        .then(progressRes => {
          setStartPos(progressRes.data.last_position_seconds || 0);
          setLoading(false);
        })
        .catch(err => {
          if (err.response?.status !== 401) {
            console.error(err);
            setLoading(false);
          }
        });
    }
  }, [subjectId, videoId]);

  const handleProgress = (time: number) => {
    if (video?.locked) return;
    apiClient.post(`/progress/videos/${videoId}`, {
      last_position_seconds: time,
      is_completed: false
    }).catch(err => {
      if (err.response?.status !== 401) console.error(err);
    });
  };

  const handleCompleted = () => {
    apiClient.post(`/progress/videos/${videoId}`, {
      last_position_seconds: 0,
      is_completed: true
    })
      .then(() => {
        // Automatically go to next video if exists
        if (video?.nextVideoId) {
          router.push(`/subjects/${subjectId}/video/${video.nextVideoId}`);
        }
      })
      .catch(err => {
        if (err.response?.status !== 401) console.error(err);
      });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!video) return <div>Video not found</div>;

  if (video.locked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto py-20 px-10 text-center space-y-8 bg-black/40 border border-white/5 rounded-[40px] backdrop-blur-2xl"
      >
        <div className="inline-block p-6 rounded-full bg-slate-800/20 text-indigo-400 ring-2 ring-indigo-500/20 shadow-xl shadow-indigo-600/10 mb-4 animate-pulse">
          <Lock className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">Lesson Locked</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            {video.unlock_reason || "You haven't completed the prerequisites for this lesson yet."}
          </p>
        </div>

        <button
          onClick={() => video.prevVideoId && router.push(`/subjects/${subjectId}/video/${video.prevVideoId}`)}
          className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold text-slate-200"
        >
          Back to Previous Lesson
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Video View */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-indigo-400 tracking-widest uppercase mb-2">
          <span className="flex items-center gap-2">
            <Play className="w-3 h-3 fill-indigo-400" />
            {video.section_title}
          </span>
          <span className="text-slate-500 font-mono tracking-tighter">HD 1080P</span>
        </div>

        <VideoPlayer
          videoId={videoId as string}
          youtubeUrl={video.youtube_url}
          startPosition={startPos}
          onProgress={handleProgress}
          onCompleted={handleCompleted}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {video.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <div className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] md:text-xs font-bold border border-emerald-500/20">
                <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />
                Auto Progress
              </div>
              <div className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] md:text-xs font-bold border border-indigo-500/20">
                <Info className="w-3 h-3 md:w-3.5 md:h-3.5" />
                Resource Available
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            <button
              disabled={!video.prevVideoId}
              onClick={() => router.push(`/subjects/${subjectId}/video/${video.prevVideoId}`)}
              className="flex-shrink-0 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Previous Lesson"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              disabled={!video.nextVideoId}
              onClick={() => router.push(`/subjects/${subjectId}/video/${video.nextVideoId}`)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm md:text-base"
            >
              Next Lesson
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-5 sm:p-8 rounded-2xl md:rounded-[32px] bg-white/[0.03] border border-white/10 space-y-2 md:space-y-4 backdrop-blur-md">
        <h3 className="text-sm md:text-lg font-bold text-white flex items-center gap-2">
          Description
        </h3>
        <p className="text-slate-400 leading-relaxed text-xs md:text-md font-medium">
          {video.description || "No description provided for this lesson."}
        </p>
      </div>
    </div>
  );
}
