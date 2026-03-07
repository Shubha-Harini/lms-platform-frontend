'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Terminal, ChevronRight } from 'lucide-react';

export default function PracticePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 text-accent" />
          <h1 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
            Code Practice
          </h1>
        </div>
        <p className="text-muted max-w-2xl text-sm font-medium leading-relaxed">
          Solve real-time coding challenges to sharpen your skills. Complete exercises daily to maintain your streak and accelerate your learning.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { tag: "Arrays", title: "Two Sum", desc: "Find two numbers in an array that add up to a target value.", level: "Easy", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { tag: "Linked Lists", title: "Reverse Linked List", desc: "Reverse a singly linked list completely in O(n) time.", level: "Medium", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          { tag: "Dynamic Programming", title: "Climbing Stairs", desc: "Calculate the number of distinct ways to climb n stairs.", level: "Easy", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
        ].map((chal, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white border border-border hover:shadow-lg hover:shadow-slate-200 transition-all cursor-pointer group flex flex-col justify-between h-full shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-slate-50 border border-border">
                  <Terminal className="w-4 h-4 text-accent" />
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border tracking-wide uppercase ${chal.color} ${chal.bg} ${chal.border}`}>
                  {chal.level}
                </span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">{chal.title}</h3>
                <p className="text-xs text-muted font-medium line-clamp-2 leading-relaxed">{chal.desc}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between text-muted group-hover:text-foreground transition-colors">
              <span className="text-[10px] font-bold tracking-widest uppercase">{chal.tag}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
