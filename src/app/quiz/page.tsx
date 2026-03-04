'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Star, Clock, Trophy } from 'lucide-react';

export default function QuizPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <BrainCircuit className="w-8 h-8 text-violet-400" />
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Assessments & Quizzes
          </h1>
        </div>
        <p className="text-slate-400 max-w-2xl text-lg">
          Test your knowledge with real-time automated quizzes generated from your enrolled courses.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: "HTML/CSS Fundamentals", qs: 15, time: "20 mins", score: "90%", status: "Completed", icon: <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> },
          { title: "JavaScript Basics II", qs: 10, time: "15 mins", score: "--", status: "Pending", icon: <Clock className="w-5 h-5 text-indigo-400" /> },
          { title: "React Hooks Masterclass", qs: 20, time: "30 mins", score: "--", status: "New", icon: <Trophy className="w-5 h-5 text-emerald-400" /> },
        ].map((quiz, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#121216] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:translate-x-1 hover:border-white/10 transition-all cursor-pointer shadow-xl relative overflow-hidden"
          >
            <div className="flex items-start gap-4 z-10">
              <div className="p-3 bg-white/5 rounded-2xl shrink-0 mt-1">
                {quiz.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{quiz.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                  <span className="font-medium">{quiz.qs} Questions</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                  <span className="font-medium">{quiz.time}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 border-t border-white/5 pt-4 sm:pt-0 sm:border-t-0 z-10 box-border">
              <div className="text-left sm:text-right">
                <div className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-1">Score</div>
                <div className={`text-xl font-black ${quiz.score !== '--' ? 'text-white' : 'text-slate-500'}`}>{quiz.score}</div>
              </div>
              <button className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${quiz.status === 'Completed'
                ? 'bg-white/5 text-slate-400 hover:bg-white/10'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20'
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
