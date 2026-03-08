'use client';

import React from 'react';
import { Bot, Zap, MessageSquare, Sparkles, ShieldCheck, Globe, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AiAssistantPage = () => {
  const hfSpaceUrl = "https://shubha22-ai-chat-bot.hf.space?__theme=light";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 h-full">

        {/* Left Side: Info & Features */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 sm:p-8 rounded-[24px] lg:rounded-[32px] shadow-sm border border-slate-200/60"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6">
              <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Kodemy <span className="text-blue-600">AI</span> Assistant
            </h1>
            <p className="text-slate-500 mt-3 sm:mt-4 text-xs sm:text-sm font-medium leading-relaxed">
              Your 24/7 expert guide for mastering growth engineering. Ask anything about courses,
              coding concepts, or your learning path.
            </p>

            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              {[
                { icon: Zap, text: "Instant Expert Answers", color: "text-amber-500", bg: "bg-amber-50" },
                { icon: Globe, text: "Global Knowledge Base", color: "text-blue-500", bg: "bg-blue-50" },
                { icon: ShieldCheck, text: "Verified Course Data", color: "text-emerald-500", bg: "bg-emerald-50" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.color}`} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-widest">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Tips Box - Hidden on very small mobile to save space if needed, but keeping it reduced here */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 p-6 sm:p-8 rounded-[24px] lg:rounded-[32px] text-white overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Pro Tip</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold leading-tight">"Ask for code snippets to see Kodemy AI's power."</h3>
              <p className="text-slate-400 text-[10px] sm:text-xs mt-2 sm:mt-3 font-medium">Try: 'Show me a React component'</p>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-10">
              <Bot className="w-24 h-24 sm:w-32 sm:h-32" />
            </div>
          </motion.div>
        </div>

        {/* Right Side: Large Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-2/3 bg-white rounded-[24px] lg:rounded-[32px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden min-h-[500px] sm:min-h-[700px] flex flex-col"
        >
          {/* Internal Header */}
          <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 sm:gap-2">
                Live Session <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-50 text-blue-600 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest">
                Premium
              </div>
            </div>
          </div>

          {/* Main Chat Frame - Forced 100% width and box-sizing */}
          <div className="flex-1 bg-white relative w-full overflow-hidden">
            <iframe
              src={hfSpaceUrl}
              className="absolute inset-0 w-full h-full border-none"
              allow="microphone; clipboard-write; autoplay"
              title="Kodemy Full Page AI Assistant"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AiAssistantPage;
