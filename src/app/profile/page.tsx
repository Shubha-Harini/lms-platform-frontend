'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Settings, Activity } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 border-b border-white/5 pb-8"
      >
        <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-indigo-500/30">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">{user?.name || 'Loading user...'}</h1>
          <div className="flex items-center gap-2 mt-1 text-slate-400 font-mono text-sm">
            <Mail className="w-4 h-4" />
            {user?.email || 'email@example.com'}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl bg-[#121216] border border-white/5 space-y-6"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Account Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">Full Name</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none text-white focus:border-indigo-500 transition-colors" defaultValue={user?.name || ''} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">Email</label>
              <input type="email" readOnly className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none text-slate-400 opacity-70 cursor-not-allowed" defaultValue={user?.email || ''} />
            </div>
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-600/20">
              Save Changes
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-3xl bg-[#121216] border border-white/5 space-y-6"
        >
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "Logged In", time: "Just now" },
              { label: "Completed 'HTML Basics'", time: "2 hours ago" },
              { label: "Scored 90% on Quiz", time: "Yesterday" }
            ].map((act, i) => (
              <div key={i} className="flex justify-between items-center p-4 border border-white/5 rounded-2xl bg-white/[0.02]">
                <span className="text-sm font-medium text-slate-300">{act.label}</span>
                <span className="text-xs text-slate-500">{act.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
