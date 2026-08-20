import React, { useState } from 'react';
import { Player, Region, GamemodeId, TierLevel, GamemodeInfo, MinecraftEdition } from '../../types';
import { TierBadge } from '../common/TierBadge';
import { GlassCard } from '../common/GlassCard';
import { Search, Trophy, Globe, Filter, ArrowUpDown, ExternalLink, ChevronLeft, ChevronRight, Crown, Monitor, Smartphone, Sparkles } from 'lucide-react';
import { playClickSound } from '../../utils/audio';

interface LeaderboardsPageProps {
  players: Player[];
  gamemodes: GamemodeInfo[];
  onSelectPlayer: (p: Player) => void;
}

export function LeaderboardsPage({ players, gamemodes, onSelectPlayer }: LeaderboardsPageProps) {
  const [selectedEdition, setSelectedEdition] = useState<'ALL' | MinecraftEdition>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<Region>('GLOBAL');
  const [selectedGamemode, setSelectedGamemode] = useState<string>('overall');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter gamemodes by edition
  const visibleGamemodes = gamemodes.filter(gm => {
    if (selectedEdition === 'ALL') return true;
    return (gm.edition || 'BEDROCK') === selectedEdition;
  });

  // Filter players
  let filtered = players.filter(p => {
    if (selectedEdition !== 'ALL' && (p.edition || 'BEDROCK') !== selectedEdition) return false;
    if (selectedRegion !== 'GLOBAL' && p.region !== selectedRegion) return false;
    if (selectedTier !== 'ALL' && p.overallTier !== selectedTier) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.ign.toLowerCase().includes(q) && !p.discordTag.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Sort based on gamemode
  if (selectedGamemode !== 'overall') {
    const gmKey = selectedGamemode as GamemodeId;
    const tierOrder: Record<TierLevel, number> = {
      HT1: 1, LT1: 2, HT2: 3, LT2: 4, HT3: 5, LT3: 6, HT4: 7, LT4: 8, HT5: 9, LT5: 10, UNRANKED: 99
    };
    filtered.sort((a, b) => {
      const rankA = tierOrder[a.gamemodeTiers[gmKey] || 'UNRANKED'];
      const rankB = tierOrder[b.gamemodeTiers[gmKey] || 'UNRANKED'];
      if (rankA !== rankB) return rankA - rankB;
      return b.totalPoints - a.totalPoints;
    });
  } else {
    filtered.sort((a, b) => b.totalPoints - a.totalPoints);
  }

  // Strictly cap the ranked leaderboard display to the Top 20 ranked players
  filtered = filtered.slice(0, 20);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedPlayers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span>GLOBAL RANKINGS & STANDINGS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-sans">
            GALAXY LEADERBOARDS
          </h1>
          <p className="text-xs text-purple-300/80 mt-1">
            Real-time verified standings across Minecraft Bedrock & Java Edition competitive disciplines.
          </p>
        </div>

        {/* Total stats pill */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-200">
          <span>Total Competitors: <strong className="text-cyan-300 font-sans">{players.length}</strong></span>
          <span>•</span>
          <span>Verified HT1: <strong className="text-amber-300 font-sans">{players.filter(p=>p.overallTier==='HT1').length}</strong></span>
        </div>
      </div>

      {/* MINECRAFT EDITION SELECTOR TABS */}
      <div className="flex flex-wrap items-center gap-3 p-2 rounded-2xl bg-[#0a051d] border border-purple-500/30 shadow-inner">
        <span className="text-xs font-black tracking-wider text-purple-300 px-3 uppercase flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Select Edition:
        </span>
        <button
          onClick={() => {
            playClickSound();
            setSelectedEdition('ALL');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            selectedEdition === 'ALL'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-purple-300'
              : 'bg-purple-950/40 text-purple-300 border border-purple-500/20 hover:text-white'
          }`}
        >
          🌐 All Editions
        </button>

        <button
          onClick={() => {
            playClickSound();
            setSelectedEdition('BEDROCK');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            selectedEdition === 'BEDROCK'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-300'
              : 'bg-purple-950/40 text-emerald-400/80 border border-emerald-500/20 hover:text-emerald-300'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Bedrock Edition (MCPE)
        </button>

        <button
          onClick={() => {
            playClickSound();
            setSelectedEdition('JAVA');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            selectedEdition === 'JAVA'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-300'
              : 'bg-purple-950/40 text-amber-400/80 border border-amber-500/20 hover:text-amber-300'
          }`}
        >
          <Monitor className="w-4 h-4" />
          Java Edition (PC)
        </button>
      </div>

      {/* Gamemodes Quick Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            playClickSound();
            setSelectedGamemode('overall');
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
            selectedGamemode === 'overall'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-purple-400'
              : 'bg-purple-950/40 text-purple-300 border border-purple-500/20 hover:border-purple-400'
          }`}
        >
          🏆 OVERALL STANDINGS
        </button>

        {visibleGamemodes.map(gm => (
          <button
            key={gm.id}
            onClick={() => {
              playClickSound();
              setSelectedGamemode(gm.id);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
              selectedGamemode === gm.id
                ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-400'
                : 'bg-purple-950/40 text-purple-300 border border-purple-500/20 hover:border-purple-400'
            }`}
          >
            {gm.name}
          </button>
        ))}
      </div>

      {/* Filter Matrix Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#0f0923] border border-purple-500/30">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search IGN or Discord..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-white placeholder-purple-400 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Region */}
        <div className="relative">
          <select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value as Region);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="GLOBAL">🌐 Region: Global All</option>
            <option value="NA">🇺🇸 NA - North America</option>
            <option value="EU">🇪🇺 EU - Europe</option>
            <option value="AS">🌏 AS - Asia</option>
            <option value="SA">🇧🇷 SA - South America</option>
            <option value="OCE">🇦🇺 OCE - Oceania</option>
          </select>
        </div>

        {/* Tier Level */}
        <div className="relative">
          <select
            value={selectedTier}
            onChange={(e) => {
              setSelectedTier(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">⭐ Tier: All Levels</option>
            <option value="HT1">HT1 - High Tier 1</option>
            <option value="LT1">LT1 - Low Tier 1</option>
            <option value="HT2">HT2 - High Tier 2</option>
            <option value="LT2">LT2 - Low Tier 2</option>
            <option value="HT3">HT3 - High Tier 3</option>
            <option value="LT3">LT3 - Low Tier 3</option>
            <option value="HT4">HT4 - High Tier 4</option>
            <option value="LT4">LT4 - Low Tier 4</option>
            <option value="HT5">HT5 - High Tier 5</option>
            <option value="LT5">LT5 - Low Tier 5</option>
          </select>
        </div>

        {/* Clear filters */}
        <button
          onClick={() => {
            setSelectedRegion('GLOBAL');
            setSelectedGamemode('overall');
            setSelectedTier('ALL');
            setSearchQuery('');
            setCurrentPage(1);
          }}
          className="w-full py-2 px-3 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 text-xs font-bold uppercase transition-colors"
        >
          Reset All Filters
        </button>

      </div>

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-2xl bg-[#0d071e]/90 border border-purple-500/30 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-purple-500/30 bg-purple-950/50 text-[11px] font-black uppercase tracking-wider text-purple-300">
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Competitor</th>
                <th className="py-4 px-6">Region</th>
                <th className="py-4 px-6">
                  {selectedGamemode === 'overall' ? 'Overall Tier' : `${selectedGamemode.toUpperCase()} Tier`}
                </th>
                <th className="py-4 px-6">Tier Points</th>
                <th className="py-4 px-6">Win Rate</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10 text-xs">
              {paginatedPlayers.map((player, idx) => {
                const rankNum = (currentPage - 1) * itemsPerPage + idx + 1;
                const gmTier = selectedGamemode === 'overall'
                  ? player.overallTier
                  : (player.gamemodeTiers[selectedGamemode as GamemodeId] || 'UNRANKED');

                return (
                  <tr
                    key={player.id}
                    onClick={() => {
                      playClickSound();
                      onSelectPlayer(player);
                    }}
                    className="hover:bg-purple-900/30 transition-colors cursor-pointer group"
                  >
                    {/* Rank Number */}
                    <td className="py-4 px-6 font-mono font-bold">
                      {rankNum === 1 ? (
                        <span className="inline-flex items-center gap-1 font-black text-amber-300 text-sm">
                          <Crown className="w-4 h-4 text-amber-400" /> #1
                        </span>
                      ) : rankNum === 2 ? (
                        <span className="font-bold text-slate-300 text-sm">#2</span>
                      ) : rankNum === 3 ? (
                        <span className="font-bold text-amber-600 text-sm">#3</span>
                      ) : (
                        <span className="text-purple-400">#{rankNum}</span>
                      )}
                    </td>

                    {/* Competitor Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={player.avatarUrl}
                          alt={player.ign}
                          className="w-10 h-10 rounded-xl border border-purple-500/40 bg-purple-900/60 object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-black text-white text-sm group-hover:text-cyan-300 transition-colors">
                              {player.ign}
                            </p>
                            <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${
                              player.edition === 'JAVA'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}>
                              {player.edition === 'JAVA' ? 'JAVA' : 'BEDROCK'}
                            </span>
                          </div>
                          <p className="text-[11px] text-purple-400 font-mono">{player.discordTag}</p>
                        </div>
                      </div>
                    </td>

                    {/* Region */}
                    <td className="py-4 px-6 font-mono font-semibold text-purple-200">
                      <span className="px-2 py-0.5 rounded bg-purple-900/60 border border-purple-500/30">
                        {player.region}
                      </span>
                    </td>

                    {/* Tier Badge */}
                    <td className="py-4 px-6">
                      <TierBadge tier={gmTier} size="sm" />
                    </td>

                    {/* Points */}
                    <td className="py-4 px-6 font-mono font-extrabold text-cyan-300 text-sm">
                      {player.totalPoints} PTS
                    </td>

                    {/* Win Rate */}
                    <td className="py-4 px-6 font-mono">
                      <span className="font-bold text-emerald-400">{player.winRate}%</span>
                      <span className="text-[10px] text-purple-400 block">{player.matchesWon}W / {player.matchesPlayed - player.matchesWon}L</span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button className="px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-500/30 text-purple-200 text-xs font-bold group-hover:bg-purple-600 group-hover:text-white transition-all">
                        View Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}

              {paginatedPlayers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-purple-400 text-xs">
                    No competitors match the active filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-purple-500/20 bg-purple-950/40 flex items-center justify-between text-xs text-purple-300">
          <span>
            Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filtered.length)}</strong> of <strong>{filtered.length}</strong> players
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 rounded-lg bg-purple-900/40 border border-purple-500/30 text-purple-300 hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-mono font-bold">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg bg-purple-900/40 border border-purple-500/30 text-purple-300 hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
