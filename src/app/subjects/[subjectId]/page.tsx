'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import {
  BookMarked,
  PlayCircle,
  Star,
  Users,
  Info,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Trophy,
  ChevronRight,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubjectPage() {
  const { subjectId } = useParams();
  const router = useRouter();
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [nextVideoId, setNextVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (subjectId) {
      apiClient.get(`/subjects/${subjectId}`)
        .then(res => {
          setSubject(res.data);
          return apiClient.get(`/subjects/${subjectId}/enroll-status`).catch(() => ({ data: { isEnrolled: false } }));
        })
        .then(res => {
          if (res && res.data.isEnrolled) {
            setIsEnrolled(true);
            return apiClient.get(`/subjects/${subjectId}/tree`).catch(() => ({ data: [] }));
          }
          setLoading(false);
          return null;
        })
        .then(res => {
          if (res && res.data) {
            const sections = res.data;
            let total = 0;
            let completed = 0;
            let firstUncompletedId: string | null = null;
            let firstOverallId: string | null = null;

            sections.forEach((s: any) => {
              s.videos.forEach((v: any) => {
                total++;
                if (!firstOverallId) firstOverallId = v.id;
                if (v.is_completed) {
                  completed++;
                } else if (!firstUncompletedId) {
                  firstUncompletedId = v.id;
                }
              });
            });

            setProgress(total > 0 ? Math.round((completed / total) * 100) : 0);
            setNextVideoId(firstUncompletedId || firstOverallId);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [subjectId]);

  const handleEnroll = () => {
    router.push(`/checkout/${subjectId}`);
  };

  const startLearning = () => {
    if (nextVideoId) {
      router.push(`/subjects/${subjectId}/video/${nextVideoId}`);
    } else {
      apiClient.get(`/subjects/${subjectId}/tree`)
        .then(res => {
          const sections = res.data;
          if (sections.length > 0 && sections[0].videos.length > 0) {
            router.push(`/subjects/${subjectId}/video/${sections[0].videos[0].id}`);
          }
        })
        .catch(err => console.error(err));
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted text-sm font-medium">Preparing your course experience...</p>
    </div>
  );

  if (!subject) return <div className="text-foreground text-center py-20">Subject not found</div>;

  return (
    <div className="pb-20 space-y-6">
      {/* Navigation & Back Action */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center"
      >
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-muted hover:text-accent hover:bg-accent/5 transition-all group"
        >
          <ArrowLeft className="w-2.5 h-2.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </button>
      </motion.div>

      {/* Premium Hero Section */}
      <section className="relative overflow-hidden rounded-[24px] border border-border bg-slate-50/40">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-[60px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 md:p-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-accent/5 border border-accent/10 text-accent text-[9px] font-bold uppercase tracking-wider w-fit">
              <Star className="w-3 h-3 fill-accent" />
              Premium Selection
            </div>

            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight tracking-tight">
                {subject.title}
              </h1>
              <p className="text-[11px] md:text-xs text-muted leading-relaxed max-w-lg font-medium opacity-80">
                {subject.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-5 items-center border-y border-border/80 py-4">
              {[
                { icon: Users, label: 'Students', value: '4.2k+' },
                { icon: Clock, label: 'Duration', value: '18h 45m' },
                { icon: Trophy, label: 'Lessons', value: `${subject.total_lessons || 12}+` }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white border border-border flex items-center justify-center text-accent">
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground leading-none">{item.value}</div>
                    <div className="text-[9px] text-muted uppercase tracking-widest font-bold mt-1">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              {!isEnrolled ? (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-muted font-bold uppercase tracking-[0.1em] leading-none mb-1 opacity-60">Lifetime Access</span>
                    <span className="text-2xl font-black text-foreground">₹{Math.floor(parseFloat(subject.price || '2999'))}</span>
                  </div>
                  <button
                    onClick={handleEnroll}
                    className="premium-button-primary !py-2.5 !px-8 text-xs w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm"
                  >
                    Enroll Now <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                      You are Enrolled
                    </div>
                  </div>
                  <button
                    onClick={startLearning}
                    className="premium-button-primary !py-4 !px-10 text-sm w-full sm:w-auto flex items-center justify-center gap-2 shadow-xl shadow-accent/20"
                  >
                    {progress > 0 ? 'Resume Learning' : 'Start Learning'} <PlayCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden lg:block relative"
          >
            <div className="relative group/card-img">
              <div className="glass-card overflow-hidden !rounded-xl p-1 bg-white border-border/40">
                <img
                  src={subject.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
                  alt={subject.title}
                  className="w-full h-64 object-cover rounded-lg group-hover/card-img:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-x-3 bottom-3 p-2.5 glass-card shadow-sm flex items-center gap-3 backdrop-blur-md bg-white/60">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-foreground text-xs font-bold leading-none mb-0.5">Safe Learning</div>
                  <div className="text-muted text-[8px] font-bold uppercase tracking-wider opacity-70">Industry Recognized</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Detailed Description & Syllabus */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              Course Details
            </h2>
            <div className="text-muted text-base leading-relaxed font-medium space-y-4">
              {subject.long_description ? (
                subject.long_description.split('\n').map((p: string, i: number) => <p key={i}>{p}</p>)
              ) : (
                <p>Learn the most essential and industry-standard concepts. This program is designed to take you from a curious beginner to a confident professional through structured learning and practical application.</p>
              )}
            </div>
          </div>

          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-bold text-foreground">What You'll Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Comprehensive video curriculum developed by experts",
                "Real-world projects to build a strong portfolio",
                "Advanced techniques and industry shortcuts",
                "Lifetime access to content and future updates",
                "Personalized learning dashboard and progress tracking",
                "Community discussion and peer support"
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start group">
                  <div className="mt-1 w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-all">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span className="text-muted text-xs font-medium group-hover:text-foreground transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="glass-card p-6 sticky top-24">
            <h3 className="text-base font-bold text-foreground mb-4">Milestones</h3>
            <div className="space-y-4">
              {isEnrolled ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Progress</span>
                    <span className="text-xl font-bold text-foreground leading-none">{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-accent"
                    />
                  </div>
                  <p className="text-[10px] text-muted font-medium text-center italic">Continuous growth is key.</p>
                </div>
              ) : (
                <div className="space-y-4 text-center py-4 border border-border bg-slate-50 rounded-xl">
                  <Lock className="w-8 h-8 text-muted mx-auto opacity-20" />
                  <p className="text-muted text-[10px] font-bold uppercase tracking-widest px-4">Enroll to unlock</p>
                  <button onClick={handleEnroll} className="text-accent text-[10px] font-bold uppercase tracking-[0.2em] hover:underline">Unlock Now</button>
                </div>
              )}

              <div className="pt-4 border-t border-border space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Highlights</div>
                {[
                  { icon: BookMarked, label: 'Curated Modules', color: 'text-blue-500' },
                  { icon: PlayCircle, label: 'High-Res Video', color: 'text-emerald-500' },
                  { icon: ShieldCheck, label: 'Secured Content', color: 'text-accent' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className={`p-1.5 rounded-md bg-white border border-border shadow-sm ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-muted/80">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
