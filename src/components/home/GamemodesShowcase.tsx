import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { GamemodeInfo } from '../../types';
import { Trophy, Users, Swords, ArrowUpRight } from 'lucide-react';
import { playClickSound } from '../../utils/audio';

interface GamemodesShowcaseProps {
  gamemodes: GamemodeInfo[];
  onSelectGamemode: (gm: GamemodeInfo) => void;
}

export function GamemodesShowcase({ gamemodes, onSelectGamemode }: GamemodesShowcaseProps) {
  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
            COMPETITIVE DISCIPLINES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
            OFFICIAL BEDROCK TIER GAMEMODES
          </h2>
          <p className="text-sm text-purple-300/80 mt-2">
            Each gamemode features dedicated tier rankings from High Tier 1 (HT1) to Low Tier 5 (LT5). Select a discipline to view rules and leaderboards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {gamemodes.map((gm) => (
            <GlassCard
              key={gm.id}
              onClick={() => {
                playClickSound();
                onSelectGamemode(gm);
              }}
              className="p-5 flex flex-col justify-between group cursor-pointer border border-purple-500/20 hover:border-cyan-400 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                    <Swords className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {gm.name}
                </h3>
                <p className="text-xs text-purple-300/80 mt-1 line-clamp-2">
                  {gm.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between text-[11px] font-semibold text-purple-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-cyan-400" />
                  {gm.activePlayers}
                </span>
                <span className="text-amber-300 font-mono">
                  {gm.totalTestsThisWeek} tests/wk
                </span>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </section>
  );
}
