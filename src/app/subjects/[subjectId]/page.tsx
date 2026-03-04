'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { BookMarked, PlayCircle, Star, Users, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubjectPage() {
  const { subjectId } = useParams();
  const router = useRouter();
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [nextVideoId, setNextVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (subjectId) {
      apiClient.get(`/subjects/${subjectId}`)
        .then(res => {
          setSubject(res.data);
          // Check enrollment status
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
          if (err.response?.status !== 401 && err.response?.status !== 403) {
            console.error(err);
          }
          setLoading(false);
        });
    }
  }, [subjectId]);

  const handleEnroll = () => {
    setEnrolling(true);
    apiClient.post(`/subjects/${subjectId}/enroll`)
      .then(() => {
        setIsEnrolled(true);
        setEnrolling(false);
        startLearning();
      })
      .catch((err) => {
        console.error(err);
        setEnrolling(false);
      });
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
        .catch(err => {
          if (err.response?.status !== 401 && err.response?.status !== 403) console.error(err);
        });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!subject) return <div className="text-white text-center py-20">Subject not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20 px-4 md:px-0"
    >
      <div className="relative p-6 md:p-12 lg:p-20 rounded-3xl md:rounded-[48px] overflow-hidden bg-gradient-to-br from-[#121216] to-[#0a0a0c] border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 blur-2xl hidden md:block">
          <BookMarked className="w-64 h-64 text-indigo-500 rotate-12" />
        </div>

        <div className="relative space-y-8 max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold w-fit ring-1 ring-indigo-500/20">
            <Star className="w-3.5 h-3.5 fill-indigo-400" />
            Featured Course
          </div>

          <div className="space-y-2 md:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              {subject.title}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
              {subject.description || "Master the core concepts of this subject with high-quality video tutorials and hands-on exercises."}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">4.2k+</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Students Enrolled</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Beginner</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Difficulty Level</div>
              </div>
            </div>
          </div>

          <div className="pt-4 sm:pt-6">
            {!isEnrolled ? (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="group relative px-5 sm:px-6 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl sm:rounded-[24px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-xl shadow-emerald-600/30 flex items-center gap-2 sm:gap-4 overflow-hidden w-full md:w-auto justify-center"
              >
                <div className="relative z-10 flex items-center gap-2 sm:gap-4">
                  <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-lg">{enrolling ? 'Enrolling...' : 'Enroll in this subject'}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" />
                </div>
              </button>
            ) : (
              <button
                onClick={startLearning}
                className="group relative px-5 sm:px-6 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl sm:rounded-[24px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2 sm:gap-4 overflow-hidden w-full md:w-auto justify-center"
              >
                <div className="relative z-10 flex items-center gap-2 sm:gap-4">
                  <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-lg">{progress > 0 ? 'Continue Learning Journey' : 'Start Learning Journey'}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-700 transition-transform"></div>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[40px] bg-white/[0.02] border border-white/5 space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-white">Learning Objectives</h3>
          <ul className="space-y-3 sm:space-y-4">
            {[
              "Master the fundamental building blocks of the language",
              "Build realistic projects to add to your portfolio",
              "Understand industry-standard best practices",
              "Gain confidence to solve complex problems"
            ].map((item, idx) => (
              <li key={idx} className="flex gap-3 sm:gap-4 items-start text-slate-400 group">
                <div className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all flex-shrink-0">
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </div>
                <span className="text-xs sm:text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[40px] bg-white/[0.02] border border-white/5 space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-white">Course Syllabus</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Our structured syllabus ensures you learn step-by-step without feeling overwhelmed.
            Use the sidebar to navigate through the modules and track your progress in real-time.
          </p>
          <div className="space-y-2 pt-2">
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${isEnrolled ? progress : 0}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-slate-500">
              <span>Course Progress</span>
              <span>{isEnrolled ? `${progress}% COMPLETED` : 'NOT ENROLLED'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { CheckCircle } from 'lucide-react';
