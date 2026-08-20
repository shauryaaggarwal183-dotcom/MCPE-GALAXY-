import React, { useState } from 'react';
import { TestApplication, GamemodeInfo, StaffRole, Region, GamemodeId, TierLevel } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { NeonButton } from '../common/NeonButton';
import { TierBadge } from '../common/TierBadge';
import { 
  Crown, 
  Trophy, 
  Shield, 
  Layers, 
  Search, 
  Sparkles, 
  Zap, 
  Target, 
  Award, 
  BarChart2, 
  CheckCircle2, 
  Info, 
  ArrowUpRight,
  Flame,
  Swords,
  Crosshair,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Disc as Discord
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';

export interface TierInfoDetail {
  tier: TierLevel;
  fullName: string;
  category: 'HIGH' | 'LOW' | 'UNRANKED';
  pointsRange: string;
  percentile: string;
  badgeColor: string;
  cps: string;
  aimTracking: string;
  movement: string;
  gameSense: string;
  description: string;
  gamemodeBenchmarks: {
    boxing: string;
    nodebuff: string;
    mace: string;
    bridge: string;
  };
  promotionRequirements: string;
}

export const TIER_DETAILS_DATA: TierInfoDetail[] = [
  {
    tier: 'HT1',
    fullName: 'High Tier 1 - God Tier / Pinnacle Champion',
    category: 'HIGH',
    pointsRange: '2,500+ PTS',
    percentile: 'Top 0.5% (Elite Masters)',
    badgeColor: 'from-red-600 via-amber-500 to-yellow-400',
    cps: '18 - 24+ CPS (Flawless Jitter / Butterfly / Drag)',
    aimTracking: '98%+ Crosshairlock with zero tracking drift under max speed',
    movement: 'Perfect S-Keying, 360 Rod Resets, Micro-strafes, Frame-perfect combos',
    gameSense: 'Absolute mastery of spacing, hit delays, momentum control, and pot conservation',
    description: 'The absolute highest competitive pinnacle in Minecraft Bedrock PvP. Reserved for tournament champions and supreme duelists with unbeatable mechanics.',
    gamemodeBenchmarks: {
      boxing: 'Flawless 100-hit pacing, 10+ hit combo streaks, perfect spacing and zero wasted click lag',
      nodebuff: 'Frame-perfect pot drops, 0 wasted health, instant rod resets & double-debuff lock',
      mace: 'Perfect wind charge elevation timing, 100% smash criticals, shield break counters',
      bridge: 'Sub-3 second bypass bridging, 100% void block clutching, instant HiB block traps'
    },
    promotionRequirements: 'Achieve 2,500+ PTS and win an official HT1 evaluation series against certified HT1 testers.'
  },
  {
    tier: 'LT1',
    fullName: 'Low Tier 1 - High Tier Candidate / Grandmaster',
    category: 'LOW',
    pointsRange: '2,200 - 2,499 PTS',
    percentile: 'Top 2.5%',
    badgeColor: 'from-yellow-600 via-amber-500 to-amber-300',
    cps: '16 - 20 CPS (Advanced Jitter / Butterfly)',
    aimTracking: '92%+ Smooth tracking & headlock during intense combo trading',
    movement: 'Advanced W-Tap combos, consistent rod stuns, fluid A/D strafes',
    gameSense: 'Superior map awareness, optimal damage trading, disciplined pot rationing',
    description: 'Near-god tier duelists capable of pushing HT1. Demonstrates near-flawless mechanics in high-pressure matches.',
    gamemodeBenchmarks: {
      boxing: 'Strong combo retention, minimal hit trades lost, dominant 6+ hit streaks',
      nodebuff: 'Fast splash potting, high rod hit accuracy, clean potion rotation',
      mace: 'Excellent wind charge recovery & critical hit accuracy',
      bridge: 'Fast diagonal speed bridging, high clutch success rate'
    },
    promotionRequirements: 'Reach 2,200+ PTS and maintain an 80%+ win rate across 40+ competitive matches.'
  },
  {
    tier: 'HT2',
    fullName: 'High Tier 2 - Master / Elite Competitor',
    category: 'HIGH',
    pointsRange: '1,900 - 2,199 PTS',
    percentile: 'Top 5.0%',
    badgeColor: 'from-cyan-600 to-blue-500',
    cps: '15 - 18 CPS',
    aimTracking: '88%+ Tracking accuracy under high movement pressure',
    movement: 'Solid S-Keying, rod combo resets, double block placements',
    gameSense: 'Strong positioning, quick reaction speed, disciplined play style',
    description: 'Exceptionally strong competitive players dominating regional queues and high-tier competitive rosters.',
    gamemodeBenchmarks: {
      boxing: 'Reliable combo locking, 7+ hit streaks, clean S-key resets',
      nodebuff: 'Clean 3-pot stacks, accurate rod combos, efficient health management',
      mace: 'High accuracy wind charge smashes & shield timing',
      bridge: 'Fast speed bridging, 3-block void clutches'
    },
    promotionRequirements: 'Defeat HT2 tester in official best-of-5 evaluation match.'
  },
  {
    tier: 'LT2',
    fullName: 'Low Tier 2 - Intermediate High / Skilled Duelist',
    category: 'LOW',
    pointsRange: '1,700 - 1,899 PTS',
    percentile: 'Top 10.0%',
    badgeColor: 'from-sky-600 to-indigo-500',
    cps: '14 - 17 CPS',
    aimTracking: '82%+ Aim stability in 1v1 fights',
    movement: 'Consistent W-Tap, basic S-Keying, clean rod timing',
    gameSense: 'Good combat pacing, effective kit management',
    description: 'Versatile competitors with refined fundamentals across multiple competitive gamemodes.',
    gamemodeBenchmarks: {
      boxing: 'Maintains positive hit trade ratios, good spacing',
      nodebuff: 'Fast hotbar potting, effective rod disruption',
      mace: 'Consistent critical timing & smash execution',
      bridge: 'Reliable speed bridging without falling'
    },
    promotionRequirements: 'Win 15 ranked matches in LT2 division with 65%+ win rate.'
  },
  {
    tier: 'HT3',
    fullName: 'High Tier 3 - Professional / Advanced Fighter',
    category: 'HIGH',
    pointsRange: '1,500 - 1,699 PTS',
    percentile: 'Top 18.0%',
    badgeColor: 'from-purple-600 to-pink-500',
    cps: '13 - 16 CPS',
    aimTracking: '78%+ Crosshair accuracy',
    movement: 'Effective A/D strafes, rod combo attempts',
    gameSense: 'Smart engagement decisions, good stamina management',
    description: 'Solid competitive fighters who have mastered core mechanics and are rising through ranked queues.',
    gamemodeBenchmarks: {
      boxing: 'Clean tracking, reliable 4-hit combos',
      nodebuff: 'Proper splash potting under pressure',
      mace: 'Good smash hit conversion rate',
      bridge: 'Standard speed bridging & basic clutches'
    },
    promotionRequirements: 'Complete 20 official tier matches with HT3+ rating.'
  },
  {
    tier: 'LT3',
    fullName: 'Low Tier 3 - Novice High / Competitor',
    category: 'LOW',
    pointsRange: '1,300 - 1,499 PTS',
    percentile: 'Top 28.0%',
    badgeColor: 'from-purple-800 to-fuchsia-600',
    cps: '12 - 15 CPS',
    aimTracking: '72%+ Aim retention',
    movement: 'Basic W-Tap, standard strafing',
    gameSense: 'Knowledge of pot timing and kit mechanics',
    description: 'Upper-intermediate players developing specialized mechanical skills in specific gamemodes.',
    gamemodeBenchmarks: {
      boxing: 'Decent combo holding capability',
      nodebuff: 'Standard pot healing, occasional rod hits',
      mace: 'Basic wind charge mechanics',
      bridge: 'Stable bridging speed'
    },
    promotionRequirements: 'Accumulate 1,300 points on the global leaderboard.'
  },
  {
    tier: 'HT4',
    fullName: 'High Tier 4 - Skilled Novice / Intermediate',
    category: 'HIGH',
    pointsRange: '1,100 - 1,299 PTS',
    percentile: 'Top 42.0%',
    badgeColor: 'from-emerald-600 to-teal-500',
    cps: '10 - 14 CPS',
    aimTracking: '65%+ Tracking consistency',
    movement: 'Basic strafe movement, minimal S-Keying',
    gameSense: 'Standard combat awareness',
    description: 'Developing duelists moving past beginner stages into structured competitive play.',
    gamemodeBenchmarks: {
      boxing: 'Understands distance management',
      nodebuff: 'Basic pot drops without self-damage',
      mace: 'Standard jump-crit timing',
      bridge: 'Basic stair bridging'
    },
    promotionRequirements: 'Pass HT4 evaluation test.'
  },
  {
    tier: 'LT4',
    fullName: 'Low Tier 4 - Novice Duelist / Developing Player',
    category: 'LOW',
    pointsRange: '900 - 1,099 PTS',
    percentile: 'Top 60.0%',
    badgeColor: 'from-emerald-800 to-teal-700',
    cps: '9 - 12 CPS',
    aimTracking: '58%+ Crosshair placement',
    movement: 'Straight-line fighting with basic strafes',
    gameSense: 'Fundamental game mechanics comprehension',
    description: 'Learning core mechanics, aiming consistency, and hotbar management.',
    gamemodeBenchmarks: {
      boxing: '2 to 3-hit combo capacity',
      nodebuff: 'Regular pot usage',
      mace: 'Basic mace attacks',
      bridge: 'Normal block placing'
    },
    promotionRequirements: 'Reach 900 points in ranked duels.'
  },
  {
    tier: 'HT5',
    fullName: 'High Tier 5 - Apprentice High / Amateur',
    category: 'HIGH',
    pointsRange: '700 - 899 PTS',
    percentile: 'Top 80.0%',
    badgeColor: 'from-slate-700 to-zinc-600',
    cps: '8 - 11 CPS',
    aimTracking: '50%+ Aim consistency',
    movement: 'Basic forward movement',
    gameSense: 'Basic understanding of health & gear',
    description: 'Entry-level competitive players gaining initial match experience.',
    gamemodeBenchmarks: {
      boxing: 'Learning spacing',
      nodebuff: 'Learning pot timing',
      mace: 'Basic weapon swings',
      bridge: 'Slow block placing'
    },
    promotionRequirements: 'Accumulate 700 points.'
  },
  {
    tier: 'LT5',
    fullName: 'Low Tier 5 - Beginner / Starter Tier',
    category: 'LOW',
    pointsRange: '400 - 699 PTS',
    percentile: 'Top 95.0%',
    badgeColor: 'from-slate-700 to-zinc-600',
    cps: '6 - 9 CPS',
    aimTracking: 'Initial aim development',
    movement: 'Standard walking & jumping',
    gameSense: 'Introductory level',
    description: 'New players entering the competitive Bedrock PvP tier ecosystem.',
    gamemodeBenchmarks: {
      boxing: 'Basic hits',
      nodebuff: 'Basic healing',
      mace: 'Basic swings',
      bridge: 'Basic walking on blocks'
    },
    promotionRequirements: 'Complete 5 matches to rank up from UNRANKED.'
  },
  {
    tier: 'UNRANKED',
    fullName: 'Unranked - Placement Pending',
    category: 'UNRANKED',
    pointsRange: '0 - 399 PTS',
    percentile: 'Unranked',
    badgeColor: 'from-slate-800 to-slate-900',
    cps: 'Variable',
    aimTracking: 'Unrated',
    movement: 'Unrated',
    gameSense: 'Unrated',
    description: 'Fresh combatants awaiting placement tests and initial ranked evaluations.',
    gamemodeBenchmarks: {
      boxing: 'Placement Pending',
      nodebuff: 'Placement Pending',
      mace: 'Placement Pending',
      bridge: 'Placement Pending'
    },
    promotionRequirements: 'Play initial placement matches.'
  }
];

export interface TierTestingPageProps {
  applications?: TestApplication[];
  gamemodes?: GamemodeInfo[];
  currentRole?: StaffRole;
  currentIgn?: string;
  onApplyTest?: (app: Partial<TestApplication>) => void;
  onUpdateApplicationStatus?: (appId: string, status: TestApplication['status'], testerIgn?: string) => void;
}

export function TierTestingPage({}: TierTestingPageProps) {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'HIGH' | 'LOW' | 'MATRIX' | 'ROADMAP'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTier, setExpandedTier] = useState<string | null>('HT1');

  const filteredTiers = TIER_DETAILS_DATA.filter((item) => {
    if (filterCategory === 'HIGH' && item.category !== 'HIGH') return false;
    if (filterCategory === 'LOW' && item.category !== 'LOW') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.tier.toLowerCase().includes(q) ||
        item.fullName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.cps.toLowerCase().includes(q) ||
        item.aimTracking.toLowerCase().includes(q) ||
        item.movement.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-purple-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>OFFICIAL BEDROCK COMPETITIVE STANDARDS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-sans tracking-tight">
            COMPETITIVE TIER SYSTEM & INFO
          </h1>
          <p className="text-sm text-purple-300/80 mt-2 max-w-3xl leading-relaxed">
            Complete official documentation, skill criteria, point ranges, and mechanical performance benchmarks for all Bedrock competitive PvP tiers (HT1 down to LT5 & Unranked).
          </p>
        </div>

        {/* Quick Stats Pill & Get Tested Action */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="https://discord.com/channels/1222612688241295420/1532353506147569714"
            target="_blank"
            rel="noreferrer"
            onClick={() => playClickSound()}
            className="btn-gold-purple-animated flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-wider transition-all"
          >
            <Discord className="w-5 h-5 text-amber-200 animate-bounce" />
            <span>GET TESTED (OPEN TICKET)</span>
          </a>

          <div className="px-4 py-3 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-center">
            <span className="text-[10px] text-purple-400 font-bold uppercase block">Ranked Tiers</span>
            <span className="text-xl font-black text-amber-300 font-mono">10 TIERS</span>
          </div>
        </div>
      </div>

      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Tiers (11)', icon: Layers },
            { id: 'HIGH', label: 'High Tiers (HT1-HT5)', icon: Crown },
            { id: 'LOW', label: 'Low Tiers (LT1-LT5)', icon: Shield },
            { id: 'MATRIX', label: 'Gamemode Matrix', icon: Swords },
            { id: 'ROADMAP', label: 'Tier Progression Roadmap', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = filterCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setFilterCategory(tab.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400'
                    : 'bg-purple-950/40 text-purple-300 border border-purple-500/20 hover:border-purple-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        {(filterCategory === 'ALL' || filterCategory === 'HIGH' || filterCategory === 'LOW') && (
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tier, CPS, rod, HT1..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        )}
      </div>

      {/* VIEW MODE 1 & 2: TIERS LIST GRID */}
      {(filterCategory === 'ALL' || filterCategory === 'HIGH' || filterCategory === 'LOW') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTiers.map((item) => {
              const isExpanded = expandedTier === item.tier;

              return (
                <GlassCard key={item.tier} className="p-6 space-y-5 flex flex-col justify-between hover:border-purple-400/50 transition-all">
                  
                  {/* Card Header */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TierBadge tier={item.tier} size="xl" />
                        <div>
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                            {item.category === 'HIGH' ? 'High Tier Division' : item.category === 'LOW' ? 'Low Tier Division' : 'Placement Tier'}
                          </span>
                          <h3 className="text-lg font-black text-white leading-tight">
                            {item.fullName}
                          </h3>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-amber-300 block">{item.pointsRange}</span>
                        <span className="text-[10px] text-cyan-400 font-semibold uppercase">{item.percentile}</span>
                      </div>
                    </div>

                    <p className="text-xs text-purple-200/90 leading-relaxed bg-purple-950/40 p-3 rounded-xl border border-purple-500/20">
                      {item.description}
                    </p>

                    {/* Mechanical Requirements Highlights */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-500/20">
                        <span className="text-[10px] text-purple-400 font-bold uppercase block flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-300" /> CPS Target
                        </span>
                        <span className="font-semibold text-white text-[11px] mt-0.5 block">{item.cps}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-500/20">
                        <span className="text-[10px] text-purple-400 font-bold uppercase block flex items-center gap-1">
                          <Crosshair className="w-3 h-3 text-cyan-300" /> Aim & Tracking
                        </span>
                        <span className="font-semibold text-white text-[11px] mt-0.5 block">{item.aimTracking}</span>
                      </div>
                    </div>

                    {/* Expandable Gamemode Details */}
                    {isExpanded && (
                      <div className="space-y-3 pt-3 border-t border-purple-500/20 animate-fadeIn">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                          <Swords className="w-3.5 h-3.5 text-cyan-400" /> Gamemode Specific Benchmarks
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/20">
                            <span className="text-[10px] font-bold text-amber-300 uppercase block">🥊 Boxing</span>
                            <span className="text-[11px] text-purple-200 leading-snug block mt-0.5">{item.gamemodeBenchmarks.boxing}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/20">
                            <span className="text-[10px] font-bold text-rose-300 uppercase block">🧪 Nodebuff</span>
                            <span className="text-[11px] text-purple-200 leading-snug block mt-0.5">{item.gamemodeBenchmarks.nodebuff}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/20">
                            <span className="text-[10px] font-bold text-cyan-300 uppercase block">🛡️ Mace</span>
                            <span className="text-[11px] text-purple-200 leading-snug block mt-0.5">{item.gamemodeBenchmarks.mace}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/20">
                            <span className="text-[10px] font-bold text-emerald-300 uppercase block">🌉 Bridge</span>
                            <span className="text-[11px] text-purple-200 leading-snug block mt-0.5">{item.gamemodeBenchmarks.bridge}</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs">
                          <span className="text-[10px] font-bold text-indigo-300 uppercase block flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Promotion Criteria
                          </span>
                          <span className="text-[11px] text-indigo-100 block mt-0.5">{item.promotionRequirements}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle Expand Details Button */}
                  <button
                    onClick={() => {
                      playClickSound();
                      setExpandedTier(isExpanded ? null : item.tier);
                    }}
                    className="w-full py-2.5 rounded-xl bg-purple-950/80 border border-purple-500/30 hover:border-cyan-400 text-purple-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>{isExpanded ? 'Hide Gamemode Criteria' : 'View Full Gamemode Criteria'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-cyan-400" />}
                  </button>

                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: GAMEMODE MATRIX */}
      {filterCategory === 'MATRIX' && (
        <GlassCard className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Swords className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-xl font-black text-white">GAMEMODE SPECIFIC TIER BENCHMARK MATRIX</h2>
              <p className="text-xs text-purple-300">Compare expectation standards across Boxing, Nodebuff, Mace, and Bridge.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-purple-500/30 bg-purple-950/60 text-purple-300 font-bold uppercase">
                  <th className="p-3.5">Tier</th>
                  <th className="p-3.5">Points</th>
                  <th className="p-3.5">🥊 Boxing Benchmark</th>
                  <th className="p-3.5">🧪 Nodebuff Benchmark</th>
                  <th className="p-3.5">🛡️ Mace Benchmark</th>
                  <th className="p-3.5">🌉 Bridge Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/20">
                {TIER_DETAILS_DATA.map((t) => (
                  <tr key={t.tier} className="hover:bg-purple-900/20 transition-all">
                    <td className="p-3.5">
                      <TierBadge tier={t.tier} size="sm" />
                    </td>
                    <td className="p-3.5 font-mono font-bold text-amber-300">{t.pointsRange}</td>
                    <td className="p-3.5 text-purple-200">{t.gamemodeBenchmarks.boxing}</td>
                    <td className="p-3.5 text-purple-200">{t.gamemodeBenchmarks.nodebuff}</td>
                    <td className="p-3.5 text-purple-200">{t.gamemodeBenchmarks.mace}</td>
                    <td className="p-3.5 text-purple-200">{t.gamemodeBenchmarks.bridge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* VIEW MODE 4: TIER PROGRESSION ROADMAP */}
      {filterCategory === 'ROADMAP' && (
        <GlassCard className="p-8 space-y-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-amber-300" />
            <div>
              <h2 className="text-xl font-black text-white">TIER PROGRESSION & RANKING ROADMAP</h2>
              <p className="text-xs text-purple-300">How players climb from UNRANKED up to HT1 through competitive matches & official tests.</p>
            </div>
          </div>

          <div className="relative border-l-2 border-purple-500/40 ml-4 pl-6 space-y-8">
            
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-amber-500 border-2 border-purple-950 flex items-center justify-center text-[10px] font-black text-black">1</span>
              <h3 className="text-sm font-bold text-amber-300 uppercase">Step 1: Unranked Placement Matches</h3>
              <p className="text-xs text-purple-200 mt-1 max-w-2xl leading-relaxed">
                Play 5 initial duels across Boxing, Nodebuff, or Mace. The system analyzes hit-ratios and assigns your base placement tier (typically LT5 to LT3).
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-cyan-400 border-2 border-purple-950 flex items-center justify-center text-[10px] font-black text-black">2</span>
              <h3 className="text-sm font-bold text-cyan-300 uppercase">Step 2: Low Tier Progression (LT5 ➔ LT1)</h3>
              <p className="text-xs text-purple-200 mt-1 max-w-2xl leading-relaxed">
                Gain points (+15 to +35 PTS per victory) in ranked matchmaking. Hitting points thresholds automatically promotes you through Low Tier levels.
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-purple-400 border-2 border-purple-950 flex items-center justify-center text-[10px] font-black text-black">3</span>
              <h3 className="text-sm font-bold text-purple-300 uppercase">Step 3: High Tier Gateway (HT5 ➔ HT2)</h3>
              <p className="text-xs text-purple-200 mt-1 max-w-2xl leading-relaxed">
                Entering High Tier requires consistent mechanical performance, 15+ CPS jitter/butterfly click speeds, and clean rod combo control.
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-amber-400 border-2 border-purple-950 flex items-center justify-center text-[10px] font-black text-black">4</span>
              <h3 className="text-sm font-bold text-amber-300 uppercase">Step 4: Official HT1 Evaluation (Pinnacle)</h3>
              <p className="text-xs text-purple-200 mt-1 max-w-2xl leading-relaxed">
                Reaching 2,500+ PTS unlocks the official HT1 Evaluation match. You must defeat a certified HT1 tester in a best-of-5 series to earn the legendary HT1 title.
              </p>
            </div>

          </div>
        </GlassCard>
      )}

    </div>
  );
}
