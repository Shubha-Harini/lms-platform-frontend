'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Settings, Activity } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 border-b border-border pb-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-accent/20">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{user?.name || 'Loading user...'}</h1>
          <div className="flex items-center gap-2 mt-0.5 text-muted font-medium text-xs">
            <Mail className="w-3.5 h-3.5" />
            {user?.email || 'email@example.com'}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white border border-border space-y-5 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold text-foreground">Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1 block">Full Name</label>
              <input type="text" className="w-full bg-slate-50 border border-border rounded-lg py-2 px-3 outline-none text-foreground text-sm focus:border-accent transition-colors font-medium" defaultValue={user?.name || ''} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1 block">Email</label>
              <input type="email" readOnly className="w-full bg-slate-50 border border-border rounded-lg py-2 px-3 outline-none text-muted opacity-80 cursor-not-allowed text-sm font-medium" defaultValue={user?.email || ''} />
            </div>
            <button className="premium-button-primary w-full py-2.5 text-xs">
              Save Changes
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-white border border-border space-y-5 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Logged In", time: "Just now" },
              { label: "Completed 'HTML Basics'", time: "2 hours ago" },
              { label: "Scored 90% on Quiz", time: "Yesterday" }
            ].map((act, i) => (
              <div key={i} className="flex justify-between items-center p-3 border border-border rounded-xl bg-slate-50">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">{act.label}</span>
                <span className="text-[10px] text-muted/60 font-bold uppercase tracking-widest">{act.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
