import React from 'react';
import { motion } from 'motion/react';
import { Disc as Discord, Shield, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { playClickSound } from '../../utils/audio';
import { GALAXY_LOGO } from '../../constants/assets';

export function CommunityDiscordCTA() {
  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 border border-purple-500/40 p-8 sm:p-12 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)]">
          
          {/* Glowing Orb */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src={GALAXY_LOGO} 
                  alt="MCPE GALAXY Logo" 
                  className="w-9 h-9 rounded-xl object-cover border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                  referrerPolicy="no-referrer"
                />
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-extrabold text-xs uppercase tracking-wider">
                  <Discord className="w-4 h-4" />
                  AUTOMATED DISCORD SYNC
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white font-sans">
                JOIN THE LARGEST MINECRAFT BEDROCK COMPETITIVE DISCORD
              </h2>

              <p className="text-sm text-purple-200 leading-relaxed max-w-2xl">
                Connect your Discord account to automatically receive your verified tier roles, get instant match notifications, ping official testers, and participate in weekly tournament brackets.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-purple-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Auto Role Synchronization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Match Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>15,000+ Active Bedrock Duelists</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <a
                href="https://discord.gg/QPFRvPXbX8"
                target="_blank"
                rel="noreferrer"
                onClick={() => playClickSound()}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white font-extrabold text-sm uppercase tracking-wider text-center shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_45px_rgba(99,102,241,0.8)] transition-all flex items-center justify-center gap-2"
              >
                <Discord className="w-5 h-5" />
                <span>Join Official Server</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
