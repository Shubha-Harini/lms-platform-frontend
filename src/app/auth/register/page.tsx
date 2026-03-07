'use client';

import React, { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ChevronRight, User, GraduationCap } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center py-12 px-4 min-h-[60vh]">
      <div className="max-w-sm w-full space-y-6 p-8 bg-white border border-border rounded-2xl shadow-sm relative">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 p-3 rounded-xl bg-accent shadow-lg shadow-accent/20 ring-4 ring-white">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>

        <div className="text-center pt-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Create Account</h2>
          <p className="mt-1 text-[10px] text-muted font-bold uppercase tracking-widest">
            Join the journey
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleRegister}>
          <div className="space-y-3">
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-accent transition-all text-sm text-foreground placeholder:text-muted/50 font-medium"
                placeholder="Full Name"
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-accent transition-all text-sm text-foreground placeholder:text-muted/50 font-medium"
                placeholder="Email Address"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-accent transition-all text-sm text-foreground placeholder:text-muted/50 font-medium"
                placeholder="Password (6+ characters)"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="premium-button-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 group shadow-sm"
          >
            <span>{loading ? 'Creating Account...' : 'Sign Up Free'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        <div className="text-center pt-6 border-t border-border mt-6">
          <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Already a member? </span>
          <Link href="/auth/login" className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
