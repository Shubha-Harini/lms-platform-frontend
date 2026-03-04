'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import Link from 'next/link';
import { BookOpen, ChevronRight, GraduationCap, Grid } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

interface Subject {
  id: number;
  title: string;
  description: string;
  slug: string;
}

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [enrolledSubjects, setEnrolledSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const { accessToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const [allRes, enrolledRes] = await Promise.all([
          apiClient.get('/subjects'),
          isAuthenticated ? apiClient.get('/subjects/enrolled').catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
        ]);

        setSubjects(allRes.data);
        setEnrolledSubjects(enrolledRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [isAuthenticated, accessToken]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const availableSubjects = subjects.filter(s => !enrolledSubjects.some(e => e.id === s.id));

  const SubjectCard = ({ subject, isEnrolled }: { subject: Subject, isEnrolled: boolean }) => (
    <motion.div
      key={subject.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col h-full"
    >
      <div className={`absolute -inset-0.5 rounded-2xl md:rounded-3xl opacity-20 group-hover:opacity-40 blur transition duration-300 ${isEnrolled ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}></div>
      <div className="relative h-full p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl bg-[#121216] border border-white/5 flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300 shadow-2xl">
        <div className="space-y-3 sm:space-y-5">
          <div className={`p-2 sm:p-3 w-fit rounded-xl sm:rounded-2xl text-white ring-1 ring-white/5 ${isEnrolled ? 'bg-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400'}`}>
            <BookOpen className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h3 className={`text-sm sm:text-xl md:text-2xl font-bold transition-colors line-clamp-2 ${isEnrolled ? 'text-white group-hover:text-emerald-400' : 'text-white group-hover:text-indigo-400'}`}>
              {subject.title}
            </h3>
            <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm leading-relaxed line-clamp-2">
              {subject.description}
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-white/5">
          <Link
            href={`/subjects/${subject.id}`}
            className="flex items-center justify-between group/link text-[10px] sm:text-xs md:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <span>{isEnrolled ? 'Continue' : 'View Course'}</span>
            <div className={`p-1.5 sm:p-2 rounded-full transition-all bg-white/5 text-white ${isEnrolled ? 'group-hover/link:bg-emerald-500' : 'group-hover/link:bg-indigo-500'}`}>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 text-center space-y-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            Master New Skills with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">
              Premium Courses
            </span>
          </h1>
          <p className="mt-6 text-sm sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
            Elevate your career with our curated learning paths and interactive video lessons.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-8 sm:mt-12 px-4"
        >
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center space-y-1 hover:bg-white/10 transition-colors cursor-default">
            <span className="text-2xl sm:text-3xl font-bold text-white">{subjects.length}</span>
            <span className="text-xs sm:text-sm tracking-wide text-slate-400">Total Courses</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center space-y-1 hover:bg-white/10 transition-colors cursor-default">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400">{enrolledSubjects.length}</span>
            <span className="text-xs sm:text-sm tracking-wide text-slate-400">Enrolled</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center space-y-1 hover:bg-white/10 transition-colors cursor-default">
            <span className="text-2xl sm:text-3xl font-bold text-indigo-400">{Math.ceil(enrolledSubjects.reduce((sum, s) => sum + ((s as any).completed_videos || 0), 0) * 0.25)}</span>
            <span className="text-xs sm:text-sm tracking-wide text-slate-400">Hours Learned</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center space-y-1 hover:bg-white/10 transition-colors cursor-default">
            <span className="text-2xl sm:text-3xl font-bold text-amber-400">24/7</span>
            <span className="text-xs sm:text-sm tracking-wide text-slate-400">Support</span>
          </div>
        </motion.div>
      </section>

      {/* Enrolled Courses */}
      {enrolledSubjects.length > 0 && (
        <section className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 decoration-emerald-500/50">
              <GraduationCap className="w-6 h-6 text-emerald-500" />
              Enrolled Courses
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {enrolledSubjects.map((subject) => (
              <SubjectCard key={`enrolled-${subject.id}`} subject={subject} isEnrolled={true} />
            ))}
          </div>
        </section>
      )}

      {/* Available Courses */}
      {availableSubjects.length > 0 && (
        <section className="px-4 md:px-0 mt-16 md:mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 decoration-indigo-500/50">
              <Grid className="w-6 h-6 text-indigo-500" />
              Available Subjects
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {availableSubjects.map((subject) => (
              <SubjectCard key={`available-${subject.id}`} subject={subject} isEnrolled={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

