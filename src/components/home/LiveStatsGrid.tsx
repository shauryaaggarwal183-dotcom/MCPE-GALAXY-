import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { SystemStats } from '../../types';
import { Users, Swords, ShieldCheck, TrendingUp, Zap, Activity } from 'lucide-react';

interface LiveStatsGridProps {
  stats: SystemStats;
}

export function LiveStatsGrid({ stats }: LiveStatsGridProps) {
  const statItems = [
    {
      label: 'Ranked Competitors',
      value: stats.totalPlayers.toLocaleString(),
      icon: Users,
      color: 'purple',
      change: '+14% this month'
    },
    {
      label: 'Completed Tier Tests',
      value: stats.testsCompletedThisMonth.toLocaleString(),
      icon: Swords,
      color: 'cyan',
      change: 'Official Evaluations'
    },
    {
      label: 'Active Staff Testers',
      value: stats.activeTesters.toString(),
      icon: ShieldCheck,
      color: 'amber',
      change: '24/7 Queue Monitoring'
    },
    {
      label: 'Promotion Rate',
      value: `${stats.promotionRate}%`,
      icon: TrendingUp,
      color: 'rose',
      change: 'Strict Quality Bar'
    }
  ];

  return (
    <section className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((st, i) => {
            const Icon = st.icon;
            return (
              <GlassCard key={i} className="p-6" glowColor={st.color as any}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300">
                    <Icon className="w-6 h-6 text-cyan-300" />
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Activity className="w-3 h-3 animate-pulse" />
                    LIVE
                  </span>
                </div>

                <p className="text-3xl font-black text-white font-mono tracking-tight mb-1">
                  {st.value}
                </p>
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                  {st.label}
                </h4>
                <p className="text-[11px] text-purple-400 font-medium">{st.change}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
