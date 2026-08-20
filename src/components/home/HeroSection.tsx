import React from 'react';
import { motion } from 'motion/react';
import { Player, SystemStats } from '../../types';
import { Trophy, Swords, ArrowRight, Disc as Discord, ShieldCheck, Zap, Users, Sparkles } from 'lucide-react';
import { playClickSound } from '../../utils/audio';

interface HeroSectionProps {
  siteTitle?: string;
  stats?: SystemStats | null;
  discordUser?: { username: string; globalName?: string; avatarUrl?: string; staffRole?: string } | null;
  onOpenDiscordAuth?: () => void;
  onApplyClick?: () => void;
  onLeaderboardsClick?: () => void;
  onApplyTest?: () => void;
  onExploreLeaderboards?: () => void;
}

export function HeroSection({
  siteTitle = 'MCPE GALAXY',
  stats,
  discordUser = null,
  onOpenDiscordAuth,
  onApplyClick,
  onLeaderboardsClick,
  onApplyTest,
  onExploreLeaderboards
}: HeroSectionProps) {
  const handleLeaderboards = onLeaderboardsClick || onExploreLeaderboards;

  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden text-center">
      {/* Subtle background ambient flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-700/20 via-indigo-600/15 to-transparent blur-[120px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* If logged in via Discord, show Personalized Welcome Pill */}
        {discordUser ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => onOpenDiscordAuth && onOpenDiscordAuth()}
            className="cursor-pointer inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-400/40 text-xs font-semibold text-purple-100 backdrop-blur-md mb-8 hover:border-purple-300 transition-all shadow-md group"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden border border-purple-300 shrink-0">
              <img
                src={discordUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${discordUser.username}`}
                alt={discordUser.username}
                className="w-full h-full object-cover"
              />
            </div>
            <span>
              Welcome back, <strong className="text-cyan-300 group-hover:underline">{discordUser.globalName || discordUser.username}</strong>!
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-600/50 text-purple-200 border border-purple-400/30">
              {discordUser.staffRole || 'Player'}
            </span>
          </motion.div>
        ) : (
          /* Season Pill Badge */
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-semibold text-purple-200 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-amber-300 font-bold uppercase tracking-wider text-[11px]">SEASON 4</span>
            <span className="text-purple-400/60">•</span>
            <span className="text-purple-300 text-[11px]">Official Minecraft Bedrock & Java Ranking</span>
          </motion.div>
        )}

        {/* Clean Large Display Headline with Gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] uppercase select-none mb-6"
        >
          <span className="block text-white">MCPE GALAXY</span>
          <span className="block bg-gradient-to-r from-amber-300 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
            RANKINGS
          </span>
        </motion.h1>

        {/* Crisp Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-purple-200/80 max-w-xl mx-auto font-normal leading-relaxed mb-10"
        >
          The ultimate PvP tier testing platform. Discover the top-tier competitive champions and get officially evaluated.
        </motion.p>

        {/* Two Clean Action CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-20"
        >
          <a
            href="https://discord.com/channels/1222612688241295420/1532353506147569714"
            target="_blank"
            rel="noreferrer"
            onClick={() => playClickSound()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_6px_25px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Discord className="w-4 h-4" />
            <span>Join Discord</span>
          </a>

          <button
            onClick={() => {
              playClickSound();
              if (handleLeaderboards) handleLeaderboards();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#140b2e]/90 hover:bg-[#1c103f] border border-purple-500/30 hover:border-purple-400/60 text-purple-100 font-bold text-sm tracking-wide shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Leaderboards</span>
          </button>
        </motion.div>

        {/* Clean Numerical Stats Matrix (Matching clean reference style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 pt-10 border-t border-purple-500/15"
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight mb-2">
              {stats?.activeTesters || 24}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300/70">
              Total Verified Testers
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent font-mono tracking-tight mb-2">
              200+
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300/70">
              Tests Completed
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight mb-2">
              7+
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300/70">
              Months Running
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

