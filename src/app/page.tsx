'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import Link from 'next/link';
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Grid,
  Star,
  Play,
  Plus,
  Sparkles,
  Trophy,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  Layout,
  Filter,
  Zap,
  Code2,
  Search,
  Shield,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';

interface Subject {
  id: number;
  title: string;
  description: string;
  long_description: string;
  thumbnail_url: string;
  price: string;
  is_enrolled?: boolean;
  completed_videos?: number;
  total_videos?: number;
}

const colorMapStyle: { [key: string]: string } = {
  'bg-emerald-500': '#059669',
  'bg-blue-500': '#2563eb',
  'bg-accent': '#2563eb',
  'bg-amber-500': '#d97706',
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => {
  const baseColor = colorMapStyle[color] || '#0f172a';
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card p-5 flex items-center gap-5 group cursor-default h-full border border-border/60"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border"
        style={{
          backgroundColor: `${baseColor}10`,
          borderColor: `${baseColor}30`,
          color: baseColor
        }}
      >
        <Icon className="w-6 h-6" strokeWidth={2.2} />
      </div>
      <div className="space-y-0.5">
        <div className="text-2xl font-black text-foreground tracking-tighter leading-none">{value}</div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted/60">{label}</div>
      </div>
    </motion.div>
  );
};

const getRealisticPrice = (val: any) => {
  const p = parseFloat(val?.toString() || '2999');
  return Math.floor(p).toString();
};

const getThumbnail = (title: string) => {
  const localMap: { [key: string]: string } = {
    'python': '/python-programming.jpg',
    'web': '/Web-Development.jpg',
    'react': '/React-Js.webp',
    'node': '/Node-js.jpg',
    'mongo': '/Mongo-DB.jpg',
    'git': '/Git-github.webp',
    'ui': '/UI-UX.jpg',
    'ux': '/UI-UX.jpg',
    'algo': '/Data-structures-algorithm.jpg',
    'struct': '/Data-structures-algorithm.jpg',
  };
  const key = Object.keys(localMap).find(k => title.toLowerCase().includes(k));
  return key ? localMap[key] : '/Web-Development.jpg';
};

const SubjectCard = ({ subject, index }: { subject: Subject; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group relative flex flex-col h-full"
    >
      <Link href={`/subjects/${subject.id}`} className="relative h-full flex flex-col p-2.5 rounded-2xl glass-card hover:border-accent/40 transition-all duration-300 overflow-hidden">
        {/* Course Thumbnail */}
        <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
          <img
            src={getThumbnail(subject.title)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            alt={subject.title}
          />
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white border border-border shadow-sm text-[10px] font-bold text-foreground flex items-center gap-1.5 z-10">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            4.9
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-2 pb-1.5 space-y-1.5">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-foreground group-hover:text-accent transition-colors tracking-tight">
              {subject.title}
            </h3>
            <p className="text-muted text-[10px] font-medium line-clamp-2 leading-relaxed opacity-70">
              {subject.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 mt-auto border-t border-border/40">
            <span className="text-xs font-black text-foreground">₹{getRealisticPrice(subject.price)}</span>
            <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-[8px] font-bold text-muted uppercase group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
              Explore
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { searchQuery, setSearchQuery, activeFilter, setActiveFilter } = useCourseStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [enrolledSubjects, setEnrolledSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, enrolledRes] = await Promise.all([
          apiClient.get('/subjects').catch(() => ({ data: [] })),
          isAuthenticated ? apiClient.get('/subjects/enrolled').catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
        ]);
        setSubjects(allRes.data || []);
        setEnrolledSubjects(enrolledRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-12">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="aspect-[16/20] bg-slate-100 rounded-[20px] animate-pulse" />
      ))}
    </div>
  );

  const filteredCourses = subjects
    .filter(s => !enrolledSubjects.some(e => e.id === s.id))
    .filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || s.title.includes(activeFilter);
      return matchesSearch && matchesFilter;
    });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-accent/5 border border-accent/10 text-accent text-[9px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Modern Learning Platform
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
              Unlock Your <span className="text-accent">Coding</span> Potential.
            </h1>
            <p className="text-sm text-muted font-medium leading-relaxed max-w-lg">
              Explore professional-grade courses and guided trajectories. Build real projects, gain deep mastery, and accelerate your career with Kodemy.
            </p>
            <div className="flex items-center gap-4 pt-3">
              <button
                onClick={() => document.getElementById('courses-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="premium-button-primary text-xs px-6 py-2.5 shadow-md shadow-accent/20"
              >
                Get Started
              </button>
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  {[
                    '1534528741775-53994a69daeb',
                    '1539571696357-5a69c17a67c6',
                    '1494790108377-be9c29b29330',
                    '1438761681033-6461ffad8d80'
                  ].map((id) => (
                    <div key={id} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                      <img src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=100&h=100&q=80`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-bold text-foreground leading-none">140k learners</div>
                  <div className="text-[8px] font-bold text-muted uppercase tracking-wider">Trusted global community</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden lg:block relative"
          >
            <div className="h-full rounded-2xl bg-white border border-border p-6 flex flex-col justify-between overflow-hidden relative shadow-md">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 blur-3xl rounded-full" />
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shadow-sm border border-amber-500/10">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h3 className="text-3xl font-black text-foreground tracking-tighter">4.9/5</h3>
                  <p className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-70">Happy Users</p>
                </div>
                <div className="space-y-2 text-right">
                  <div className="w-10 h-10 ml-auto rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-500/10">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-3xl font-black text-foreground tracking-tighter">2.4M</h3>
                  <p className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-70">Hours Watched</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2 group/card hover:bg-white hover:border-accent/10 transition-all shadow-sm">
                  <Zap className="w-4 h-4 text-accent transition-transform group-hover/card:scale-110" />
                  <div className="text-xs font-bold text-foreground">Fast Track</div>
                  <p className="text-[8px] text-muted font-medium leading-relaxed">Accelerated learning paths are ready for you.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2 group/card hover:bg-white hover:border-accent/10 transition-all shadow-sm">
                  <Code2 className="w-4 h-4 text-accent transition-transform group-hover/card:scale-110" />
                  <div className="text-xs font-bold text-foreground">Real World</div>
                  <p className="text-[8px] text-muted font-medium leading-relaxed">Build industry standard projects for portfolio.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Platform Growth" value="+14%" color="bg-emerald-500" />
        <StatCard icon={Users} label="Active Learners" value="84k" color="bg-blue-500" />
        <StatCard icon={Clock} label="Average Pace" value="1.4h" color="bg-accent" />
        <StatCard icon={Star} label="Top Instructors" value="482" color="bg-amber-500" />
      </section>

      {/* Enrolled Courses Section */}
      {isAuthenticated && enrolledSubjects.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-accent rounded-full" />
              <div className="space-y-0.5">
                <h2 className="text-xl font-bold text-foreground tracking-tight">Your Learning Journey</h2>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Resume where you left off</p>
              </div>
            </div>
            <Link href="/profile" className="text-accent text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1.5">
              My Dashboard <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enrolledSubjects.map((subject, idx) => (
              <SubjectCard key={`enrolled-${subject.id}`} subject={subject} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* Exploration Grid */}
      <section className="space-y-8 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-slate-200 rounded-full" />
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold text-foreground tracking-tight">Explore All Courses</h2>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Browse our complete catalog</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-border shadow-inner">
            {['All', 'Python', 'Web', 'React', 'Data'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${activeFilter === filter ? 'bg-white text-accent shadow-sm' : 'text-muted hover:text-foreground'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div id="courses-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((subject, idx) => (
            <SubjectCard key={`available-${subject.id}`} subject={subject} index={idx} />
          ))}
          {filteredCourses.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4 bg-slate-50 rounded-3xl border border-dashed border-border">
              <div className="text-muted text-sm font-medium">No courses match your active search or filters.</div>
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                className="premium-button-secondary !py-2 !px-6 text-[10px] uppercase tracking-widest"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Kodemy - Features Section (Moved below courses) */}
      <section className="py-12 space-y-8 bg-slate-50/50 rounded-[32px] border border-border/40 p-8 mt-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="flex flex-col items-center text-center space-y-2 mb-2 relative z-10">
          <div className="px-3 py-1 rounded-full bg-white border border-border text-[8px] font-bold text-accent uppercase tracking-[0.3em] shadow-sm">
            Unrivaled Experience
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter leading-none">Master Skills. Build Portfolios.</h2>
          <p className="text-xs text-muted font-medium max-w-xl leading-relaxed opacity-80">
            Kodemy is designed for results. We don't just provide content; we provide a destination for your career. Our framework ensures you learn, build, and succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {[
            {
              title: "Job-Ready Skillsets",
              desc: "Every course is mapped to real-world industry requirements. We teach you what recruiters are actually looking for.",
              icon: GraduationCap,
              color: "text-blue-600",
              bgColor: "bg-blue-50"
            },
            {
              title: "Portfolio Development",
              desc: "Build significant, production-grade projects that demonstrate your expertise to potential employers.",
              icon: Code2,
              color: "text-emerald-600",
              bgColor: "bg-emerald-50"
            },
            {
              title: "Lifetime Community",
              desc: "Access doesn't end with the course. Join a global network of ambitious developers and mentors.",
              icon: Users,
              color: "text-amber-600",
              bgColor: "bg-amber-50"
            }
          ].map((feature, i) => (
            <div key={feature.title} className="bg-white p-6 rounded-[24px] border border-border/60 hover:shadow-xl hover:shadow-accent/5 transition-all group flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-border/40 ${feature.color}`}>
                <feature.icon className="w-6 h-6" strokeWidth={2.2} />
              </div>
              <h3 className="mt-4 text-sm font-bold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-[11px] text-muted leading-relaxed font-medium opacity-80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Professional Track Section */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto rounded-[32px] bg-foreground text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full -translate-x-1/4 translate-y-1/4" />

          <div className="space-y-4 relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">Start Your Career <span className="text-accent">Success Path</span> Today.</h2>
            <p className="text-white/60 text-xs md:text-sm font-medium leading-relaxed">
              Don't just learn. Graduate into a professional role with our industry-vetted curriculum and career coaching.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
              <button className="premium-button-primary bg-white !text-foreground font-bold px-8 py-3 w-full sm:w-auto hover:bg-slate-50 border-none transition-all shadow-lg text-xs">
                Claim Your Future
              </button>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/80">Trust Verified</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-4 w-full max-w-xs">
            {[
              { id: 'precision', icon: Target, label: "Precision Learning", val: "100%" },
              { id: 'execution', icon: Zap, label: "Execution Speed", val: "3.5x" },
              { id: 'placement', icon: Sparkles, label: "Job Placement", val: "94%" }
            ].map((metric) => (
              <div key={metric.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <metric.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white/90">{metric.label}</span>
                </div>
                <span className="text-2xl font-black text-accent">{metric.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Success Section */}
      <section className="py-16 space-y-12">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Testimonials</div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">Real Stories. Real Success.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Harsh Vardhan",
              role: "Full Stack Developer",
              text: "Kodemy's structure is unlike anything else. I built 4 production-grade projects that got me hired.",
              img: "1599566637279-205252f7f12d",
              rating: 5
            },
            {
              name: "Ananya Sharma",
              role: "UI/UX Designer",
              text: "The mentor support is incredible. I went from zero design knowledge to a professional portfolio in months.",
              img: "1494790108377-be9c29b29330",
              rating: 5
            },
            {
              name: "Rahul Krishna",
              role: "Python Engineer",
              text: "The Data Structures course is the most comprehensive I've ever taken. Every concept finally clicks.",
              img: "1507003211169-7a1a0a552b51",
              rating: 5
            }
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="glass-card p-8 space-y-5 bg-white border border-border/60 shadow-sm hover:shadow-xl hover:shadow-accent/5 transition-all"
            >
              <div className="flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-4 pt-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-border flex items-center justify-center">
                  <img
                    src={`https://images.unsplash.com/photo-${testimonial.img}?auto=format&fit=crop&w=150&h=150&q=80`}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=2563eb&color=fff&size=150`;
                    }}
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-[9px] font-bold text-muted uppercase tracking-widest">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
