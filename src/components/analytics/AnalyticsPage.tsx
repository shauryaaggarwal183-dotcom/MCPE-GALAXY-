import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { SystemStats } from '../../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { BarChart3, TrendingUp, Users, Swords, Activity, ShieldCheck, Globe } from 'lucide-react';

interface AnalyticsPageProps {
  stats: SystemStats | null;
}

export function AnalyticsPage({ stats }: AnalyticsPageProps) {
  const safeStats = stats || {
    totalPlayers: 1420,
    testsCompletedThisMonth: 850,
    activeTesters: 24,
    promotionRate: 68.4,
    pendingApplications: 12,
    liveMatches: 3
  };
  
  // Mock trend data
  const testTrendData = [
    { day: 'Mon', tests: 42, promotions: 12 },
    { day: 'Tue', tests: 58, promotions: 18 },
    { day: 'Wed', tests: 65, promotions: 22 },
    { day: 'Thu', tests: 80, promotions: 25 },
    { day: 'Fri', tests: 110, promotions: 35 },
    { day: 'Sat', tests: 145, promotions: 48 },
    { day: 'Sun', tests: 130, promotions: 40 }
  ];

  const passFailData = [
    { name: 'Passed / Promoted', value: safeStats.promotionRate, color: '#10b981' },
    { name: 'Failed / Retain', value: 100 - safeStats.promotionRate, color: '#f43f5e' }
  ];

  const regionData = [
    { region: 'NA', players: 450 },
    { region: 'EU', players: 380 },
    { region: 'AS', players: 240 },
    { region: 'SA', players: 120 },
    { region: 'OCE', players: 90 }
  ];

  const gamemodeData = [
    { name: 'Boxing', tests: 320 },
    { name: 'Nodebuff', tests: 290 },
    { name: 'Sumo', tests: 210 },
    { name: 'Gapple', tests: 180 },
    { name: 'Mace', tests: 150 }
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>REAL-TIME METRICS & METRICS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-sans">
            SYSTEM ANALYTICS & INSIGHTS
          </h1>
          <p className="text-xs text-purple-300/80 mt-1">
            Comprehensive statistical analysis of competitive Bedrock tier testing activity, pass rates, and regional traffic.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-300 uppercase">Monthly Tests</span>
            <Swords className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{safeStats.testsCompletedThisMonth}</p>
          <p className="text-[11px] text-emerald-400 font-bold mt-1">+18% vs last month</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-300 uppercase">Promotion Bar Rate</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{safeStats.promotionRate}%</p>
          <p className="text-[11px] text-purple-400 font-medium mt-1">Strict high tier quality bar</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-300 uppercase">Active Testers</span>
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{safeStats.activeTesters}</p>
          <p className="text-[11px] text-purple-400 font-medium mt-1">Certified staff squad</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-300 uppercase">Ranked Competitors</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{safeStats.totalPlayers}</p>
          <p className="text-[11px] text-purple-400 font-medium mt-1">Across 5 global regions</p>
        </GlassCard>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Testing Volume Area Chart */}
        <GlassCard className="lg:col-span-8 p-6 space-y-4">
          <div>
            <h3 className="text-base font-black text-white">Weekly Tier Testing Volume</h3>
            <p className="text-xs text-purple-300/80">Completed evaluations vs successful tier promotions</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={testTrendData}>
                <defs>
                  <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPromos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#a855f7" fontSize={11} />
                <YAxis stroke="#a855f7" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f0923', borderColor: '#a855f7', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="tests" stroke="#06b6d4" fillOpacity={1} fill="url(#colorTests)" />
                <Area type="monotone" dataKey="promotions" stroke="#a855f7" fillOpacity={1} fill="url(#colorPromos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Pass vs Fail Ratio Pie Chart */}
        <GlassCard className="lg:col-span-4 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-white">Tier Test Pass Rate</h3>
            <p className="text-xs text-purple-300/80">Ratio of approved promotions to retentions</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passFailData}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f0923', borderColor: '#a855f7', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-emerald-300">Passed ({safeStats.promotionRate}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-rose-300">Failed ({100 - safeStats.promotionRate}%)</span>
            </div>
          </div>
        </GlassCard>

        {/* Region Distribution Bar Chart */}
        <GlassCard className="lg:col-span-6 p-6 space-y-4">
          <h3 className="text-base font-black text-white">Regional Player Distribution</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData}>
                <XAxis dataKey="region" stroke="#a855f7" fontSize={11} />
                <YAxis stroke="#a855f7" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f0923', borderColor: '#a855f7', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="players" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Gamemode Activity Breakdown Bar Chart */}
        <GlassCard className="lg:col-span-6 p-6 space-y-4">
          <h3 className="text-base font-black text-white">Tests by Gamemode</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gamemodeData}>
                <XAxis dataKey="name" stroke="#a855f7" fontSize={11} />
                <YAxis stroke="#a855f7" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f0923', borderColor: '#a855f7', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="tests" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>

    </div>
  );
}
