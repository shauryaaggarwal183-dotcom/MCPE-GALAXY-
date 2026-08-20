import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Layers, LayoutDashboard, Home, ArrowUpRight } from 'lucide-react';
import { playClickSound } from '../../utils/audio';

interface QuickNavDotsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function QuickNavDots({ activeTab, setActiveTab }: QuickNavDotsProps) {
  const dots = [
    { id: 'home', label: 'Home', icon: Home, color: 'from-amber-400 to-purple-500' },
    { id: 'leaderboards', label: 'Leaderboards', icon: Trophy, color: 'from-purple-500 to-indigo-500' },
    { id: 'testing', label: 'Tiers & Testing', icon: Layers, color: 'from-cyan-400 to-blue-500' },
    { id: 'admin', label: 'Admin Panel', icon: LayoutDashboard, color: 'from-rose-500 to-purple-600' }
  ];

  return (
    <aside aria-label="Quick page navigation" className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3 p-2 rounded-2xl bg-[#0d0722]/80 border border-purple-500/20 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {dots.map((dot) => {
        const Icon = dot.icon;
        const isActive = activeTab === dot.id;

        return (
          <button
            key={dot.id}
            onClick={() => {
              playClickSound();
              setActiveTab(dot.id);
            }}
            className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 outline-none"
            aria-label={`Go to ${dot.label}`}
          >
            {/* Tooltip on hover */}
            <div className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#140b2e] border border-purple-500/30 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-200 shadow-xl flex items-center gap-1.5">
              <span>{dot.label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
            </div>

            {/* Glowing active indicator background */}
            {isActive && (
              <motion.div
                layoutId="activeNavDotGlow"
                className={`absolute inset-0 rounded-xl bg-gradient-to-tr ${dot.color} opacity-30 blur-sm`}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}

            {/* The Dot / Icon */}
            <div
              className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-300 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] scale-110'
                  : 'bg-purple-950/40 border border-purple-500/20 text-purple-400 hover:text-white hover:border-purple-400 hover:bg-purple-900/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'group-hover:scale-110 transition-transform'}`} />
            </div>

            {/* Micro dot indicator */}
            <span
              className={`absolute -bottom-0.5 w-1 h-1 rounded-full transition-all duration-300 ${
                isActive ? 'bg-cyan-400 w-3' : 'bg-transparent'
              }`}
            />
          </button>
        );
      })}
    </aside>
  );
}
