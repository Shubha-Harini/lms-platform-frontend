'use client';

import React, { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ChevronRight, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/auth/register', { email, password, name });
      login(res.data.user, res.data.accessToken);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-[50vh]">
      <div className="max-w-[20rem] sm:max-w-md w-full space-y-4 sm:space-y-6 p-5 sm:p-10 bg-[#121216] border border-white/5 rounded-2xl sm:rounded-3xl shadow-3xl relative mt-6 sm:mt-8">
        <div className="absolute -top-6 sm:-top-12 left-1/2 -translate-x-1/2 p-2.5 sm:p-4 rounded-xl sm:rounded-3xl bg-violet-600 shadow-2xl shadow-violet-500/50 ring-4 ring-[#0a0a0c]">
          <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
        </div>

        <div className="text-center pt-5 sm:pt-4">
          <h2 className="text-xl sm:text-3xl font-extrabold text-white">Create Account</h2>
          <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm text-slate-400">
            Join thousands of learners today
          </p>
        </div>

        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleRegister}>
          <div className="space-y-3 sm:space-y-4">
            <div className="relative group">
              <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-xs sm:text-base text-white placeholder:text-slate-600"
                placeholder="Full Name"
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-xs sm:text-base text-white placeholder:text-slate-600"
                placeholder="Email Address"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-xs sm:text-base text-white placeholder:text-slate-600"
                placeholder="Password (6+ characters)"
              />
            </div>
          </div>

          {error && <p className="text-rose-400 text-xs sm:text-sm bg-rose-400/10 p-3 sm:p-4 rounded-xl border border-rose-400/20">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-4 px-6 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>{loading ? 'Creating Account...' : 'Sign Up Free'}</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="text-center pt-6 sm:pt-8 border-t border-white/5 mt-6 sm:mt-8">
          <span className="text-slate-500 text-xs sm:text-sm">Already have an account? </span>
          <Link href="/auth/login" className="text-xs sm:text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

import { GraduationCap } from 'lucide-react';
