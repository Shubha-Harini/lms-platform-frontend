'use client';

import React from 'react';
import { Bot, Zap, MessageSquare, Sparkles, ShieldCheck, Globe, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AiAssistantPage = () => {
  const hfSpaceUrl = "https://shubha22-ai-chat-bot.hf.space?__theme=light";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 h-full">

        {/* Left Side: Info & Features */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200/60"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Kodemy <span className="text-blue-600">AI</span> Assistant
            </h1>
            <p className="text-slate-500 mt-4 text-sm font-medium leading-relaxed">
              Your 24/7 expert guide for mastering growth engineering. Ask anything about courses,
              coding concepts, or your learning path.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { icon: Zap, text: "Instant Expert Answers", color: "text-amber-500", bg: "bg-amber-50" },
                { icon: Globe, text: "Global Knowledge Base", color: "text-blue-500", bg: "bg-blue-50" },
                { icon: ShieldCheck, text: "Verified Course Data", color: "text-emerald-500", bg: "bg-emerald-50" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Tips Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 p-8 rounded-[32px] text-white overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Pro Tip</span>
              </div>
              <h3 className="text-lg font-bold leading-tight">"Ask for code snippets to see Kodemy AI's power."</h3>
              <p className="text-slate-400 text-xs mt-3 font-medium">Try: 'Show me a React component for a Navbar'</p>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-10">
              <Bot className="w-32 h-32" />
            </div>
          </motion.div>
        </div>

        {/* Right Side: Large Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:w-2/3 bg-white rounded-[32px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden min-h-[700px] flex flex-col"
        >
          {/* Internal Header */}
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Live Assistant Session <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                Premium
              </div>
            </div>
          </div>

          {/* Main Chat Frame */}
          <div className="flex-1 bg-white relative">
            <iframe
              src={hfSpaceUrl}
              className="w-full h-full border-none"
              allow="microphone; clipboard-write; autoplay"
              title="Kodemy Full Page AI Assistant"
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AiAssistantPage;
