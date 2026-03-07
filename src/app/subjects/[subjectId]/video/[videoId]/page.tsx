'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { VideoPlayer } from '@/components/Video/VideoPlayer';
import {
  Lock,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Play,
  CheckCircle,
  Info,
  Clock,
  Layout,
  Share2,
  Bookmark,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      apiClient.get(`/videos/${videoId}`)
        .then(res => {
          setVideo(res.data);
          return apiClient.get(`/progress/videos/${videoId}`).catch(() => ({ data: { last_position_seconds: 0 } }));
        })
        .then(progressRes => {
          setStartPos(progressRes.data.last_position_seconds || 0);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [subjectId, videoId]);

  const handleProgress = (time: number) => {
    if (video?.locked) return;
    apiClient.post(`/progress/videos/${videoId}`, {
      last_position_seconds: time,
      is_completed: false
    }).catch(err => console.error(err));
  };

  const handleCompleted = () => {
    apiClient.post(`/progress/videos/${videoId}`, {
      last_position_seconds: 0,
      is_completed: true
    })
      .then(() => {
        if (video?.nextVideoId) {
          router.push(`/subjects/${subjectId}/video/${video.nextVideoId}`);
        }
      })
      .catch(err => console.error(err));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-muted text-xs font-black uppercase tracking-widest animate-pulse">Syncing Progress</p>
    </div>
  );

  if (!video) return <div className="text-center py-20 text-muted">Video not found</div>;

  if (video.locked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto py-16 px-8 text-center space-y-6 glass-card bg-white border border-border"
      >
        <div className="inline-block p-4 rounded-full bg-slate-50 border border-border text-accent mb-2">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Access Restricted</h2>
          <p className="text-muted text-sm leading-relaxed font-medium">
            {video.unlock_reason || "Access to this lesson requires completion of previous modules."}
          </p>
        </div>

        <button
          onClick={() => video.prevVideoId && router.push(`/subjects/${subjectId}/video/${video.prevVideoId}`)}
          className="premium-button-secondary py-3 px-8 w-full text-xs font-bold uppercase tracking-widest"
        >
          Return to Previous Lesson
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation & Back Action */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center"
      >
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent hover:bg-accent/5 transition-all group"
        >
          <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </button>
      </motion.div>

      {/* Video View */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-0.5 h-6 bg-accent rounded-full" />
            <div>
              <div className="text-[9px] font-bold text-accent uppercase tracking-widest leading-none mb-1">
                {video.section_title}
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                {video.title}
              </h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button className="p-2 rounded-lg bg-slate-50 border border-border text-muted hover:text-foreground transition-all"><Share2 className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg bg-slate-50 border border-border text-muted hover:text-foreground transition-all"><Bookmark className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-border bg-slate-50 shadow-sm">
          <VideoPlayer
            videoId={videoId as string}
            youtubeUrl={video.youtube_url}
            startPosition={startPos}
            onProgress={handleProgress}
            onCompleted={handleCompleted}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
              <CheckCircle className="w-3.5 h-3.5" />
              Progress Auto-Sync
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/5 text-accent text-[10px] font-bold border border-accent/10">
              <Layout className="w-3.5 h-3.5" />
              Resources Linked
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-muted text-[10px] font-bold border border-border">
              <Clock className="w-3.5 h-3.5" />
              12:45 Mins
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              disabled={!video.prevVideoId}
              onClick={() => router.push(`/subjects/${subjectId}/video/${video.prevVideoId}`)}
              className="group p-2.5 rounded-xl border border-border bg-white hover:bg-slate-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              disabled={!video.nextVideoId}
              onClick={() => router.push(`/subjects/${subjectId}/video/${video.nextVideoId}`)}
              className="flex-1 md:flex-initial premium-button-primary !py-2.5 !px-6 text-xs flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              Next Lesson
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Details & Discussion Tabs Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <div className="glass-card p-8 space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Info className="w-4 h-4 text-accent" />
              Lesson Overview
            </h3>
            <div className="text-muted leading-relaxed font-medium text-base">
              {video.description || "In this comprehensive module, we dive deep into advanced concepts and industry implementations. Follow along as we build professional-grade solutions step-by-step."}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              Discussion
            </h3>
            <div className="glass-card p-6 text-center space-y-3 bg-slate-50 border-dashed">
              <p className="text-muted font-bold text-[10px] uppercase tracking-wider">Join the conversation</p>
              <button className="text-accent text-xs font-bold hover:underline">Login to post</button>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="glass-card p-6 space-y-4 shadow-sm border border-border">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent">Quick Links</h4>
            <div className="space-y-1">
              {['Exercise Files', 'Cheat Sheet', 'Transcript', 'Forum'].map(link => (
                <button key={link} className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 text-[11px] font-bold transition-all flex justify-between items-center group text-muted hover:text-foreground">
                  {link}
                  <ChevronRight className="w-3.5 h-3.5 text-muted/40 group-hover:text-accent transition-all" />
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

