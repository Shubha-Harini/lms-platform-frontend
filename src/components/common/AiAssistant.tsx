'use client';

import React, { useState } from 'react';
import { Sparkles, X, MessageSquare, Zap, ChevronRight, Minimize2, Maximize2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Appending ?__theme=light to force Hugging Face into light mode
  const hfSpaceUrl = "https://shubha22-ai-chat-bot.hf.space?__theme=light";

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-sans">
      {/* Sleek Prompt Bubble - Discreet & Professional */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="bg-white px-4 py-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 flex items-center gap-3 cursor-pointer group hover:border-blue-200 transition-all"
            onClick={() => setIsOpen(true)}
          >
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 tracking-tight leading-none">
              Chat with Kodemy AI Assistant
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? '60px' : '580px', // Standard height to prevent overflow
              width: isMinimized ? '300px' : '380px'  // Professional width
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mb-2 bg-white rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden flex flex-col"
          >
            {/* COMPACT & VISIBLE HEADER */}
            <div className="px-5 py-3.5 flex items-center justify-between bg-white border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Zap className="w-5 h-5 text-white fill-current" />
                </div>
                <div>
                  <h3 className="text-[13px] font-black text-slate-900 tracking-tight leading-none">
                    Kodemy AI Assistant
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Always Online</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-all"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* LIGHTWEIGHT CHAT AREA - Balanced Size */}
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 bg-white"
              >
                <iframe
                  src={hfSpaceUrl}
                  className="w-full h-full border-none"
                  allow="microphone; clipboard-write; autoplay"
                  title="Kodemy AI Assistant"
                />
              </motion.div>
            )}

            {/* Expand Hint */}
            {isMinimized && (
              <div className="flex-1 flex items-center px-5">
                <button
                  onClick={() => setIsMinimized(false)}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest"
                >
                  Resume Guidance
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIXED SIZE TOGGLE BUTTON - 56px standard */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (isMinimized) setIsMinimized(false);
        }}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${isOpen && !isMinimized ? 'bg-slate-900' : 'bg-blue-600'
          }`}
      >
        {isOpen && !isMinimized ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-7 h-7 text-white fill-white" />
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-blue-600" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default AiAssistant;
