'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, PlayCircle, CheckCircle2, Lock, BookOpen, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Video {
  id: number;
  title: string;
  order_index: number;
  is_completed: boolean;
  locked: boolean;
}

interface Section {
  id: number;
  title: string;
  order_index: number;
  videos: Video[];
}

export const SubjectSidebar: React.FC = () => {
  const { subjectId, videoId } = useParams();
  const pathname = usePathname();
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subjectId) {
      apiClient.get(`/subjects/${subjectId}/tree`)
        .then(res => {
          setSections(res.data || []);
          const currentSection = res.data?.find((s: Section) =>
            s.videos.some(v => v.id.toString() === videoId)
          );
          if (currentSection) {
            setExpandedSections([currentSection.id]);
          } else if (res.data?.length > 0) {
            setExpandedSections([res.data[0].id]);
          }
          setLoading(false);
        })
        .catch(() => {
          setSections([]);
          setLoading(false);
        });
    }
  }, [subjectId, videoId]);

  const toggleSection = (id: number) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  if (loading) return (
    <div className="p-12 space-y-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <aside className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-r border-border bg-white h-auto md:h-[calc(100vh-4rem)] md:sticky md:top-16 overflow-y-auto custom-scrollbar">
      <div className="p-6 md:p-8">
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2 text-accent text-[9px] font-bold uppercase tracking-widest">
            <BookOpen className="w-3 h-3" />
            Curriculum
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Course Content</h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 opacity-80">
            <div className="flex items-center gap-1.5 text-[10px] text-muted font-bold">
              <Clock className="w-3 h-3" />
              18h 45m
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted font-bold">
              <PlayCircle className="w-3 h-3" />
              {sections.reduce((acc, s) => acc + s.videos.length, 0)} Lessons
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {sections.map((section, idx) => (
            <div key={section.id} className="space-y-2">
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border group ${expandedSections.includes(section.id)
                  ? 'bg-slate-50 border-border shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all ${expandedSections.includes(section.id)
                    ? 'bg-accent text-white border-accent'
                    : 'bg-slate-100 text-muted border-slate-200'
                    }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-sm font-bold text-left transition-colors ${expandedSections.includes(section.id) ? 'text-foreground' : 'text-muted group-hover:text-foreground'
                    }`}>
                    {section.title}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform duration-300 ${expandedSections.includes(section.id) ? 'rotate-180 text-foreground' : ''
                  }`} />
              </button>

              <AnimatePresence>
                {expandedSections.includes(section.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-1 pl-3"
                  >
                    {section.videos.map((video) => {
                      const isActive = video.id.toString() === videoId;

                      return (
                        <div key={video.id} className="relative group/vid flex items-center">
                          <Link
                            href={video.locked ? '#' : `/subjects/${subjectId}/video/${video.id}`}
                            className={`
                              flex items-center gap-3 w-full p-3 rounded-lg transition-all border
                              ${isActive
                                ? 'bg-accent/5 border-accent/10'
                                : 'bg-transparent border-transparent hover:bg-slate-50'}
                              ${video.locked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                            onClick={(e) => video.locked && e.preventDefault()}
                          >
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all ${isActive
                              ? 'bg-accent text-white'
                              : video.is_completed
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-slate-100 text-muted group-hover/vid:bg-slate-200 group-hover/vid:text-foreground'
                              }`}>
                              {video.is_completed
                                ? <CheckCircle2 className="w-2.5 h-2.5" />
                                : (video.locked ? <Lock className="w-2.5 h-2.5" /> : <PlayCircle className="w-2.5 h-2.5" />)
                              }
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className={`text-[11px] font-bold truncate transition-colors ${isActive ? 'text-accent' : 'text-muted group-hover/vid:text-foreground'
                                }`}>
                                {video.title}
                              </span>
                              <span className="text-[9px] text-muted/60 font-medium">10:45 mins</span>
                            </div>
                          </Link>
                          {isActive && (
                            <motion.div
                              layoutId="active-indicator"
                              className="absolute -left-3 w-0.5 h-6 bg-accent rounded-r-full"
                            />
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

