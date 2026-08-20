import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Player, StaffRole, GamemodeId, TierLevel } from '../../types';
import { TierBadge } from '../common/TierBadge';
import { GlassCard } from '../common/GlassCard';
import { NeonButton } from '../common/NeonButton';
import { 
  Trophy, 
  Swords, 
  ShieldCheck, 
  History, 
  FileText, 
  BarChart2, 
  Clock, 
  ExternalLink, 
  Edit3, 
  Ban, 
  CheckCircle2, 
  Award, 
  Disc as Discord,
  User,
  Plus
} from 'lucide-react';
import { playClickSound, playSuccessFanfare } from '../../utils/audio';

interface PlayerProfileModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  currentRole: StaffRole;
  onUpdatePlayer: (updatedPlayer: Player) => void;
  onApplyRetest?: (playerIgn: string) => void;
}

export function PlayerProfileModal({
  player,
  isOpen,
  onClose,
  currentRole,
  onUpdatePlayer,
  onApplyRetest
}: PlayerProfileModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'tiers' | 'matches' | 'notes' | 'history'>('overview');
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'Aim' | 'Movement' | 'Mechanics' | 'Behavior' | 'General'>('General');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(player?.bio || '');

  if (!player) return null;

  const isStaff = currentRole !== 'Player';

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    playSuccessFanfare();
    const updated: Player = {
      ...player,
      testerNotes: [
        {
          id: `tn_${Date.now()}`,
          authorIgn: 'StaffTester',
          authorRole: currentRole,
          date: new Date().toISOString().split('T')[0],
          text: newNoteText,
          category: newNoteCategory
        },
        ...player.testerNotes
      ]
    };
    onUpdatePlayer(updated);
    setNewNoteText('');
  };

  const handleToggleBan = () => {
    playClickSound();
    const updated: Player = {
      ...player,
      isBanned: !player.isBanned
    };
    onUpdatePlayer(updated);
  };

  const handleSaveBio = () => {
    playClickSound();
    onUpdatePlayer({ ...player, bio: bioInput });
    setIsEditingBio(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="space-y-6">
        
        {/* Banner + Avatar Profile Card */}
        <div className="relative rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 border border-purple-500/40 p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            
            <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
              <div className="relative">
                <img
                  src={player.avatarUrl}
                  alt={player.ign}
                  className="w-24 h-24 rounded-2xl border-2 border-purple-400 bg-purple-900 object-cover shadow-[0_0_25px_rgba(168,85,247,0.5)]"
                />
                <span className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded text-[10px] font-black uppercase shadow ${
                  player.isBanned ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {player.isBanned ? 'BANNED' : player.status}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-center md:justify-start gap-2.5">
                  <h2 className="text-2xl font-black text-white">{player.ign}</h2>
                  <span className="px-2 py-0.5 rounded bg-purple-900/80 border border-purple-500/30 font-mono text-xs font-bold text-cyan-300">
                    {player.region}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-mono text-xs font-black uppercase border ${
                    player.edition === 'JAVA' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {player.edition === 'JAVA' ? 'JAVA EDITION' : 'BEDROCK EDITION'}
                  </span>
                  {player.rankTitle && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold uppercase">
                      {player.rankTitle}
                    </span>
                  )}
                </div>

                <p className="text-xs text-purple-300 font-mono mt-1 flex items-center justify-center md:justify-start gap-2">
                  <Discord className="w-3.5 h-3.5 text-indigo-400" />
                  {player.discordTag}
                  <span className="text-purple-500">•</span>
                  <span>Joined {player.joinedDate}</span>
                </p>

                {/* Bio */}
                <div className="mt-2 text-xs text-purple-200/90 max-w-lg">
                  {isEditingBio ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        className="px-2 py-1 rounded bg-purple-950 border border-purple-500 text-xs text-white"
                      />
                      <button onClick={handleSaveBio} className="px-2 py-1 rounded bg-purple-600 text-xs font-bold text-white">Save</button>
                    </div>
                  ) : (
                    <p className="flex items-center gap-1.5 cursor-pointer hover:text-white" onClick={() => setIsEditingBio(true)}>
                      <span>"{player.bio}"</span>
                      <Edit3 className="w-3 h-3 text-purple-400" />
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Highest Tier */}
            <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
              <div className="text-center md:text-right">
                <span className="text-[10px] text-purple-400 uppercase font-bold block">Overall Tier Rank</span>
                <TierBadge tier={player.overallTier} size="lg" />
              </div>

              {isStaff && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleBan}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      player.isBanned
                        ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500/40'
                        : 'bg-rose-600/30 text-rose-200 border-rose-500/40 hover:bg-rose-600'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>{player.isBanned ? 'Unban Player' : 'Ban Player'}</span>
                  </button>
                </div>
              )}

              {onApplyRetest && (
                <NeonButton variant="secondary" size="sm" onClick={() => onApplyRetest(player.ign)}>
                  Request Retest
                </NeonButton>
              )}
            </div>

          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-purple-500/20 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Stats', icon: Trophy },
            { id: 'tiers', label: 'Gamemode Tiers', icon: Swords },
            { id: 'matches', label: 'Match History', icon: History },
            { id: 'notes', label: `Tester Notes (${player.testerNotes.length})`, icon: FileText },
            { id: 'history', label: 'Tier History', icon: BarChart2 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setActiveSubTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
                  activeSubTab === tab.id
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : 'bg-purple-950/40 text-purple-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SUB TAB CONTENTS */}
        
        {/* OVERVIEW */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/20 text-center">
                <span className="text-[10px] text-purple-400 font-bold uppercase">Total Points</span>
                <p className="text-2xl font-black text-cyan-300 font-mono mt-1">{player.totalPoints} PTS</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/20 text-center">
                <span className="text-[10px] text-purple-400 font-bold uppercase">Win Rate</span>
                <p className="text-2xl font-black text-emerald-400 font-mono mt-1">{player.winRate}%</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/20 text-center">
                <span className="text-[10px] text-purple-400 font-bold uppercase">Matches Won</span>
                <p className="text-2xl font-black text-amber-300 font-mono mt-1">{player.matchesWon} / {player.matchesPlayed}</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/20 text-center">
                <span className="text-[10px] text-purple-400 font-bold uppercase">Overall Tier</span>
                <p className="text-2xl font-black text-purple-300 font-mono mt-1">{player.overallTier}</p>
              </div>
            </div>

            {/* Top 3 Gamemode Tiers */}
            <GlassCard className="p-5">
              <h4 className="text-xs font-bold uppercase text-purple-300 mb-3">Top Specialized Disciplines</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(player.gamemodeTiers).slice(0, 3).map(([gm, tr]) => (
                  <div key={gm} className="p-3 rounded-xl bg-purple-900/30 border border-purple-500/20 flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase">{gm}</span>
                    <TierBadge tier={tr as TierLevel} size="sm" />
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* GAMEMODE TIERS */}
        {activeSubTab === 'tiers' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(player.gamemodeTiers).map(([gm, tr]) => (
              <div key={gm} className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">{gm}</h4>
                  <p className="text-[10px] text-purple-400">Standard Tier evaluation</p>
                </div>
                <TierBadge tier={tr as TierLevel} size="md" />
              </div>
            ))}
          </div>
        )}

        {/* MATCH HISTORY */}
        {activeSubTab === 'matches' && (
          <div className="space-y-3">
            {player.matchHistory.map((m) => (
              <div key={m.id} className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      m.result === 'WIN' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {m.result}
                    </span>
                    <span className="text-xs font-bold text-white uppercase">{m.gamemode}</span>
                    <span className="text-xs text-purple-400 font-mono">vs {m.opponentIgn}</span>
                  </div>
                  <p className="text-[11px] text-purple-300 mt-1">Evaluated by Tester: {m.testerIgn}</p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-cyan-300 font-mono block">{m.score}</span>
                  <span className="text-[10px] font-bold text-amber-300">{m.tierChange}</span>
                </div>
              </div>
            ))}
            {player.matchHistory.length === 0 && (
              <p className="text-xs text-purple-400 text-center py-6">No recorded match history found.</p>
            )}
          </div>
        )}

        {/* TESTER NOTES */}
        {activeSubTab === 'notes' && (
          <div className="space-y-4">
            {/* Add note input for staff */}
            {isStaff && (
              <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/30 space-y-3">
                <h4 className="text-xs font-bold uppercase text-cyan-300 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  Add Confidential Staff Evaluation Note
                </h4>
                <div className="flex gap-2">
                  <select
                    value={newNoteCategory}
                    onChange={(e) => setNewNoteCategory(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg bg-purple-900 border border-purple-500/30 text-xs text-white"
                  >
                    <option value="Aim">Aim</option>
                    <option value="Movement">Movement</option>
                    <option value="Mechanics">Mechanics</option>
                    <option value="Behavior">Behavior</option>
                    <option value="General">General</option>
                  </select>

                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Type tester observation..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-purple-900/60 border border-purple-500/30 text-xs text-white placeholder-purple-400"
                  />

                  <NeonButton variant="primary" size="sm" onClick={handleAddNote}>
                    Submit
                  </NeonButton>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {player.testerNotes.map((note) => (
                <div key={note.id} className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-purple-400">
                    <span className="font-bold text-purple-200">{note.authorIgn} ({note.authorRole})</span>
                    <span className="px-2 py-0.5 rounded bg-purple-900 text-cyan-300 font-mono">{note.category}</span>
                  </div>
                  <p className="text-xs text-white mt-1">{note.text}</p>
                </div>
              ))}
              {player.testerNotes.length === 0 && (
                <p className="text-xs text-purple-400 text-center py-6">No staff tester notes filed yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TIER HISTORY */}
        {activeSubTab === 'history' && (
          <div className="space-y-3">
            {player.tierHistory.map((th) => (
              <div key={th.id} className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white uppercase">{th.gamemode}</p>
                  <p className="text-[11px] text-purple-300 mt-0.5">{th.reason} • Tester: {th.testerIgn}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TierBadge tier={th.oldTier} size="sm" />
                  <span className="text-purple-400 text-xs">→</span>
                  <TierBadge tier={th.newTier} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </Modal>
  );
}
