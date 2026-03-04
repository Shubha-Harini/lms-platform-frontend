'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Terminal, ChevronRight } from 'lucide-react';

export default function PracticePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <Code2 className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Code Practice
          </h1>
        </div>
        <p className="text-slate-400 max-w-2xl text-lg">
          Solve real-time coding challenges to sharpen your skills. Complete exercises daily to maintain your streak.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { tag: "Arrays", title: "Two Sum", desc: "Find two numbers in an array that add up to a target value.", level: "Easy", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { tag: "Linked Lists", title: "Reverse Linked List", desc: "Reverse a singly linked list completely in O(n) time.", level: "Medium", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          { tag: "Dynamic Programming", title: "Climbing Stairs", desc: "Calculate the number of distinct ways to climb n stairs.", level: "Easy", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        ].map((chal, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-[#121216] border border-white/5 hover:border-white/10 transition-colors cursor-pointer group flex flex-col justify-between h-full shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-xl bg-white/5">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${chal.color} ${chal.bg} ${chal.border}`}>
                  {chal.level}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{chal.title}</h3>
                <p className="text-sm text-slate-400 mt-2 line-clamp-2">{chal.desc}</p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between text-slate-500 group-hover:text-white transition-colors">
              <span className="text-xs font-bold tracking-wider uppercase">{chal.tag}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
