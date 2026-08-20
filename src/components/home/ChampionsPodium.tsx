import React from 'react';
import { motion } from 'motion/react';
import { Player } from '../../types';
import { TierBadge } from '../common/TierBadge';
import { Crown, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { playClickSound } from '../../utils/audio';

interface ChampionsPodiumProps {
  players: Player[];
  onSelectPlayer: (p: Player) => void;
  onViewLeaderboards: () => void;
}

export function ChampionsPodium({ players, onSelectPlayer, onViewLeaderboards }: ChampionsPodiumProps) {
  if (players.length < 3) return null;

  const top1 = players[0];
  const top2 = players[1];
  const top3 = players[2];

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-1">
              <Trophy className="w-4 h-4" />
              <span>THE HALL OF CHAMPIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-sans">
              TOP 3 GLOBAL COMPETITORS
            </h2>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onViewLeaderboards();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-bold hover:border-purple-300 hover:text-white transition-all group"
          >
            <span>View Full Leaderboards</span>
            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Podium Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8">
          
          {/* 2ND PLACE PODIUM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            onClick={() => {
              playClickSound();
              onSelectPlayer(top2);
            }}
            className="group cursor-pointer flex flex-col items-center order-2 md:order-1"
          >
            <div className="relative mb-4 flex flex-col items-center">
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-500 text-slate-200 text-xs font-black mb-2 shadow-lg">
                #2 RUNNER UP
              </span>
              <div className="relative">
                <img
                  src={top2.avatarUrl}
                  alt={top2.ign}
                  className="w-24 h-24 rounded-2xl border-2 border-slate-400 object-cover bg-purple-900/60 shadow-[0_0_20px_rgba(148,163,184,0.4)] group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-slate-700 text-slate-200 font-extrabold text-[10px]">
                  {top2.region}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {top2.ign}
              </h3>
              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${
                top2.edition === 'JAVA' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {top2.edition === 'JAVA' ? 'JAVA' : 'BEDROCK'}
              </span>
            </div>
            <p className="text-xs text-purple-400 font-mono mb-3">{top2.totalPoints} PTS • {top2.winRate}% WR</p>
            <TierBadge tier={top2.overallTier} size="sm" />

            {/* Pedestal Box */}
            <div className="w-full h-36 mt-4 rounded-t-2xl bg-gradient-to-t from-slate-900/90 to-slate-800/40 border-t-2 border-slate-500/50 flex items-center justify-center shadow-xl">
              <span className="text-5xl font-black text-slate-600/40 font-mono">#2</span>
            </div>
          </motion.div>

          {/* 1ST PLACE PODIUM (HIGHEST) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => {
              playClickSound();
              onSelectPlayer(top1);
            }}
            className="group cursor-pointer flex flex-col items-center order-1 md:order-2"
          >
            <div className="relative mb-4 flex flex-col items-center">
              <Crown className="w-8 h-8 text-amber-400 mb-1 animate-bounce" />
              <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs uppercase tracking-wider mb-2 shadow-[0_0_20px_rgba(234,179,8,0.6)]">
                #1 GALAXY CHAMPION
              </span>
              <div className="relative">
                <div className="absolute -inset-2 bg-amber-400/30 rounded-2xl blur-md" />
                <img
                  src={top1.avatarUrl}
                  alt={top1.ign}
                  className="relative w-32 h-32 rounded-2xl border-4 border-amber-400 object-cover bg-purple-900/80 shadow-[0_0_30px_rgba(234,179,8,0.6)] group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded bg-amber-500 text-black font-black text-xs">
                  {top1.region}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                {top1.ign}
              </h3>
              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${
                top1.edition === 'JAVA' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {top1.edition === 'JAVA' ? 'JAVA' : 'BEDROCK'}
              </span>
            </div>
            <p className="text-xs text-amber-300/90 font-mono font-bold mb-3">{top1.totalPoints} PTS • {top1.winRate}% WR</p>
            <TierBadge tier={top1.overallTier} size="md" />

            {/* Pedestal Box */}
            <div className="w-full h-48 mt-4 rounded-t-2xl bg-gradient-to-t from-amber-950/80 via-purple-950/60 to-amber-900/30 border-t-2 border-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.2)]">
              <span className="text-6xl font-black text-amber-500/30 font-mono">#1</span>
            </div>
          </motion.div>

          {/* 3RD PLACE PODIUM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => {
              playClickSound();
              onSelectPlayer(top3);
            }}
            className="group cursor-pointer flex flex-col items-center order-3"
          >
            <div className="relative mb-4 flex flex-col items-center">
              <span className="px-3 py-1 rounded-full bg-amber-900/40 border border-amber-700 text-amber-200 text-xs font-black mb-2 shadow-lg">
                #3 BRONZE PODIUM
              </span>
              <div className="relative">
                <img
                  src={top3.avatarUrl}
                  alt={top3.ign}
                  className="w-24 h-24 rounded-2xl border-2 border-amber-700 object-cover bg-purple-900/60 shadow-[0_0_20px_rgba(180,83,9,0.3)] group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-amber-800 text-amber-200 font-extrabold text-[10px]">
                  {top3.region}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                {top3.ign}
              </h3>
              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${
                top3.edition === 'JAVA' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {top3.edition === 'JAVA' ? 'JAVA' : 'BEDROCK'}
              </span>
            </div>
            <p className="text-xs text-purple-400 font-mono mb-3">{top3.totalPoints} PTS • {top3.winRate}% WR</p>
            <TierBadge tier={top3.overallTier} size="sm" />

            {/* Pedestal Box */}
            <div className="w-full h-28 mt-4 rounded-t-2xl bg-gradient-to-t from-amber-950/90 to-purple-950/40 border-t-2 border-amber-700/60 flex items-center justify-center shadow-xl">
              <span className="text-5xl font-black text-amber-800/30 font-mono">#3</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
