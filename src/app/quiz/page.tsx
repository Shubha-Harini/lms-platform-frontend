'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Star, Clock, Trophy } from 'lucide-react';

export default function QuizPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-6 h-6 text-accent" />
          <h1 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
            Assessments
          </h1>
        </div>
        <p className="text-muted max-w-2xl text-sm font-medium leading-relaxed">
          Test your knowledge with real-time automated quizzes generated from your enrolled courses. Track your progress and master your subjects.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: "HTML/CSS Fundamentals", qs: 15, time: "20 mins", score: "90%", status: "Completed", icon: <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> },
          { title: "JavaScript Basics II", qs: 10, time: "15 mins", score: "--", status: "Pending", icon: <Clock className="w-4 h-4 text-accent" /> },
          { title: "React Hooks Masterclass", qs: 20, time: "30 mins", score: "--", status: "New", icon: <Trophy className="w-4 h-4 text-emerald-500" /> },
        ].map((quiz, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-lg hover:shadow-slate-100 transition-all cursor-pointer shadow-sm relative overflow-hidden"
          >
            <div className="flex items-start gap-4 z-10">
              <div className="p-2.5 bg-slate-50 border border-border rounded-xl shrink-0">
                {quiz.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-accent transition-colors">{quiz.title}</h3>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted">
                  <span>{quiz.qs} Qs</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{quiz.time}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 border-t border-border pt-4 sm:pt-0 sm:border-t-0 z-10">
              <div className="text-left sm:text-right space-y-0.5">
                <div className="text-[10px] text-muted font-bold tracking-widest uppercase">Score</div>
                <div className={`text-lg font-bold ${quiz.score !== '--' ? 'text-foreground' : 'text-muted/40'}`}>{quiz.score}</div>
              </div>
              <button className={`px-5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${quiz.status === 'Completed'
                ? 'bg-slate-100 text-muted hover:bg-slate-200'
                : 'premium-button-primary shadow-sm hover:scale-[1.02]'
                }`}>
                {quiz.status === 'Completed' ? 'Review' : 'Start'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
