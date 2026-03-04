'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, PlayCircle, CheckCircle2, Lock } from 'lucide-react';
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
          setSections(res.data);
          // Auto expand sections that have the current video
          const currentSection = res.data.find((s: Section) =>
            s.videos.some(v => v.id.toString() === videoId)
          );
          if (currentSection) {
            setExpandedSections([currentSection.id]);
          } else if (res.data.length > 0) {
            setExpandedSections([res.data[0].id]);
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
  }, [subjectId, videoId]);

  const toggleSection = (id: number) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading curriculum...</div>;

  return (
    <aside className="w-full md:w-80 border-t md:border-t-0 md:border-r border-white/5 bg-[#0a0a0c] h-auto md:h-[calc(100vh-4rem)] md:sticky md:top-16 overflow-y-auto custom-scrollbar">
      <div className="p-6">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          Curriculum
          <span className="text-[10px] uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md text-slate-400 font-normal">
            Course Content
          </span>
        </h2>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold text-indigo-400/70">SEC {section.order_index}</div>
                  <span className="text-sm font-bold text-slate-200 group-hover:text-white truncate max-w-[140px]">
                    {section.title}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedSections.includes(section.id) ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {expandedSections.includes(section.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-1 pl-2"
                  >
                    {section.videos.map((video) => {
                      const isActive = video.id.toString() === videoId;

                      return (
                        <div key={video.id} className="relative group/vid">
                          <Link
                            href={video.locked ? '#' : `/subjects/${subjectId}/video/${video.id}`}
                            className={`
                              flex items-center gap-3 p-3 rounded-xl transition-all
                              ${isActive
                                ? 'bg-indigo-600/10 border border-indigo-500/20 shadow-lg shadow-indigo-600/5'
                                : 'hover:bg-white/5 border border-transparent'}
                              ${video.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                            onClick={(e) => video.locked && e.preventDefault()}
                          >
                            <div className={`p-1.5 rounded-lg ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover/vid:text-white transition-colors'}`}>
                              {video.is_completed
                                ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                : (video.locked ? <Lock className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />)
                              }
                            </div>
                            <span className={`text-xs font-medium truncate ${isActive ? 'text-indigo-300' : 'text-slate-400 group-hover/vid:text-slate-200 transition-colors'}`}>
                              {video.title}
                            </span>
                          </Link>
                          {isActive && <motion.div layoutId="active-pill" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-full" />}
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
