'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon, Code2, BrainCircuit, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 selection:bg-indigo-500/30">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 group-hover:scale-105 transition-transform">
                <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Kod <span className="text-indigo-500">LMS</span>
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              {mounted && (
                isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-4 sm:space-x-8 mr-2 sm:mr-6">
                      <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors">
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                      </Link>
                      <Link href="/practice" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors">
                        <Code2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Practice</span>
                      </Link>
                      <Link href="/quiz" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors">
                        <BrainCircuit className="w-4 h-4" />
                        <span className="hidden sm:inline">Quiz</span>
                      </Link>
                      <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors">
                        <UserIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">{user?.name}</span>
                      </Link>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium text-slate-300"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <Link href="/auth/login" className="text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors">
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
                    >
                      Get Started
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Subtle Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full"></div>
      </div>
    </div>
  );
};
