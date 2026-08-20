import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { TierBadge } from '../common/TierBadge';
import { TestMatch } from '../../types';
import { Swords, ExternalLink, Play, Clock, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../../utils/audio';

interface LatestTierTestsProps {
  matches: TestMatch[];
  onViewMatches: () => void;
}

export function LatestTierTests({ matches, onViewMatches }: LatestTierTestsProps) {
  return (
    <section className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">
              <Swords className="w-4 h-4" />
              <span>LIVE EVALUATION FEED</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              LATEST TIER TESTS & MATCHES
            </h2>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onViewMatches();
            }}
            className="text-xs font-bold text-cyan-300 hover:text-white underline"
          >
            View Match Queue →
          </button>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.slice(0, 4).map((m) => (
            <GlassCard key={m.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider ${
                    m.edition === 'JAVA'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {m.edition === 'JAVA' ? 'JAVA' : 'BEDROCK'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-bold uppercase tracking-wider">
                    {m.gamemode} ({m.region})
                  </span>
                </div>

                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                  m.status === 'IN_PROGRESS'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {m.status === 'IN_PROGRESS' ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {m.status.replace('_', ' ')}
                </span>
              </div>

              {/* Versus combat card */}
              <div className="flex items-center justify-between bg-purple-950/40 p-4 rounded-xl border border-purple-500/20 mb-4">
                
                {/* Player */}
                <div className="text-center">
                  <p className="text-xs text-purple-400 uppercase font-bold">Applicant</p>
                  <p className="text-base font-black text-white mt-0.5">{m.playerIgn}</p>
                  <p className="text-xl font-mono font-black text-cyan-300 mt-1">{m.scorePlayer}</p>
                </div>

                <div className="text-center px-4">
                  <span className="text-xs font-mono text-purple-400 font-bold">VS</span>
                </div>

                {/* Tester */}
                <div className="text-center">
                  <p className="text-xs text-purple-400 uppercase font-bold">Official Tester</p>
                  <p className="text-base font-black text-purple-200 mt-0.5">{m.testerIgn}</p>
                  <p className="text-xl font-mono font-black text-rose-400 mt-1">{m.scoreTester}</p>
                </div>

              </div>

              <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
                <div>
                  <span className="text-[10px] text-purple-400 uppercase block font-semibold">Assigned Tier Result</span>
                  {m.assignedTierResult ? (
                    <TierBadge tier={m.assignedTierResult} size="sm" />
                  ) : (
                    <span className="text-xs font-bold text-purple-300">Evaluating...</span>
                  )}
                </div>

                {m.proofUrl && (
                  <a
                    href={m.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-500/30 text-purple-200 text-xs font-semibold hover:border-purple-300 transition-colors"
                  >
                    <Play className="w-3 h-3 text-cyan-300 fill-cyan-300" />
                    <span>Match Replay</span>
                  </a>
                )}
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </section>
  );
}
