'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import {
  LogOut,
  User as UserIcon,
  Code2,
  BrainCircuit,
  LayoutDashboard,
  Sparkles,
  Zap,
  Search,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCourseStore } from '@/store/courseStore';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout, initialize } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { searchQuery, setSearchQuery } = useCourseStore();

  const isAuthPage = pathname?.startsWith('/auth');

  useEffect(() => {
    setMounted(true);
    initialize(); // Restore auth state safely on client mount
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-white antialiased">
      {/* Premium Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2 bg-white/90 backdrop-blur-xl ${(mounted && scrolled) ? 'border-b border-border shadow-sm' : ''
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-accent shadow-sm">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground">
                KOD<span className="text-accent">EMY</span>
              </span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-muted">Learn Anything</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {mounted && [
              { label: 'Explore', href: '/', icon: LayoutDashboard },
              { label: 'Challenges', href: '/practice', icon: Code2, protected: true },
              { label: 'Assess', href: '/quiz', icon: BrainCircuit, protected: true },
              { label: 'AI Assistant', href: '/ai-assistant', icon: Sparkles },
            ]
              .filter(item => !item.protected || isAuthenticated)
              .map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-slate-100 transition-all"
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-border text-muted hover:text-foreground transition-colors cursor-text group w-72">
              <Search className="w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full placeholder:text-muted/60"
              />
              <button
                className="text-[9px] font-bold bg-white px-2 py-0.5 rounded border border-border shadow-sm hover:bg-slate-50 transition-colors"
                title="Execute search"
              >
                FIND
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mounted && (
                isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <Link href="/profile" className="flex items-center gap-2 group">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-foreground group-hover:text-accent transition-colors leading-none">{user?.name}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-border p-1 group-hover:border-accent transition-all overflow-hidden relative">
                        <UserIcon className="w-full h-full text-muted group-hover:text-accent transition-colors" />
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-1.5 rounded-lg bg-slate-50 border border-border text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/auth/login" className="text-xs font-bold text-muted hover:text-foreground transition-colors">
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="premium-button-primary !py-2 !px-4 text-xs"
                    >
                      Join Free
                    </Link>
                  </div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-24 pb-20 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {mounted && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-2xl border-t border-slate-200 px-6 py-3 flex justify-around items-center h-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] pb-[env(safe-area-inset-bottom,20px)]">
          {[
            { label: 'Explore', href: '/', icon: LayoutDashboard },
            { label: 'Challenges', href: '/practice', icon: Code2, protected: true },
            { label: 'Assess', href: '/quiz', icon: BrainCircuit, protected: true },
            { label: 'AI', href: '/ai-assistant', icon: Sparkles },
          ]
            .filter(item => !item.protected || isAuthenticated)
            .map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex flex-col items-center gap-1.5 px-3 py-1 rounded-2xl transition-all ${isActive ? 'text-accent scale-110' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  <item.icon className={`w-6 h-6 ${isActive ? 'fill-accent/10' : ''}`} />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
        </nav>
      )}

      {/* Subtle Immersive Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-dot-pattern opacity-50" />
      </div>

      {/* Footer */}
      <footer className="hidden md:block border-t border-border py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <span className="text-base font-bold text-foreground tracking-tight">KODEMY</span>
          </div>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-muted">
            <Link href="#" className="hover:text-foreground transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Community</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Support</Link>
          </div>
          <p className="text-[10px] font-medium text-muted uppercase tracking-widest">
            © 2026 Kodemy.
          </p>
        </div>
      </footer>
    </div>
  );
};

