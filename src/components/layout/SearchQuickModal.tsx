import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Player, GamemodeInfo, TestMatch, TierApplication } from '../../types';
import { Search, User, Swords, Trophy, ExternalLink, ArrowRight } from 'lucide-react';
import { TierBadge } from '../common/TierBadge';
import { playClickSound } from '../../utils/audio';

export interface SearchQuickModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  gamemodes: GamemodeInfo[];
  matches?: TestMatch[];
  applications?: TierApplication[];
  onSelectPlayer: (player: Player) => void;
  onNavigateTab?: (tab: string) => void;
}

export function SearchQuickModal({
  isOpen,
  onClose,
  players,
  gamemodes,
  matches = [],
  applications = [],
  onSelectPlayer,
  onNavigateTab
}: SearchQuickModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredPlayers = players.filter(p =>
    p.ign.toLowerCase().includes(query.toLowerCase()) ||
    p.discordTag.toLowerCase().includes(query.toLowerCase())
  );

  const filteredGamemodes = gamemodes.filter(g =>
    g.name.toLowerCase().includes(query.toLowerCase()) ||
    g.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players, gamemodes, Discord tags..."
            autoFocus
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white placeholder-purple-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
          {/* Players section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-cyan-400" />
              Players ({filteredPlayers.length})
            </h4>
            <div className="space-y-2">
              {filteredPlayers.slice(0, 5).map(player => (
                <div
                  key={player.id}
                  onClick={() => {
                    playClickSound();
                    onSelectPlayer(player);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 hover:border-purple-400 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={player.avatarUrl}
                      alt={player.ign}
                      className="w-9 h-9 rounded-lg border border-purple-500/30 bg-purple-900/50"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{player.ign}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 font-mono">
                          {player.region}
                        </span>
                      </div>
                      <p className="text-xs text-purple-400 font-mono">{player.discordTag}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <TierBadge tier={player.overallTier} size="sm" />
                    <ArrowRight className="w-4 h-4 text-purple-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gamemodes section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              Gamemodes ({filteredGamemodes.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredGamemodes.map(gm => (
                <div
                  key={gm.id}
                  onClick={() => {
                    playClickSound();
                    if (onNavigateTab) onNavigateTab('leaderboards');
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 hover:border-cyan-400 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <span className="text-xs font-bold text-white">{gm.name}</span>
                    <p className="text-[10px] text-purple-400">{gm.activePlayers} Active Players</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Modal>
  );
}
