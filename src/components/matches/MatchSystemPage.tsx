import React, { useState } from 'react';
import { TestMatch, StaffRole, GamemodeId, TierLevel } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { NeonButton } from '../common/NeonButton';
import { TierBadge } from '../common/TierBadge';
import { Modal } from '../common/Modal';
import { 
  Swords, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Play, 
  Award, 
  UserCheck, 
  ShieldCheck, 
  Calendar,
  Zap,
  Activity
} from 'lucide-react';
import { playClickSound, playSuccessFanfare } from '../../utils/audio';

interface MatchSystemPageProps {
  matches: TestMatch[];
  currentRole: StaffRole;
  currentIgn: string;
  onScheduleMatch: (m: Partial<TestMatch>) => void;
  onSubmitResult: (matchId: string, scorePlayer: number, scoreTester: number, tierResult: TierLevel) => void;
}

export function MatchSystemPage({
  matches,
  currentRole,
  currentIgn,
  onScheduleMatch,
  onSubmitResult
}: MatchSystemPageProps) {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedMatchForResult, setSelectedMatchForResult] = useState<TestMatch | null>(null);

  // Schedule match form state
  const [pIgn, setPIgn] = useState('');
  const [tIgn, setTIgn] = useState(currentIgn || 'MasterTester');
  const [gamemode, setGamemode] = useState<GamemodeId>('boxing');
  const [region, setRegion] = useState('NA');
  const [proofUrl, setProofUrl] = useState('');

  // Result submission state
  const [scoreP, setScoreP] = useState(3);
  const [scoreT, setScoreT] = useState(1);
  const [assignedTier, setAssignedTier] = useState<TierLevel>('HT2');

  const isStaff = currentRole !== 'Player';

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pIgn) return;
    playSuccessFanfare();

    onScheduleMatch({
      playerIgn: pIgn,
      testerIgn: tIgn,
      gamemode,
      region: region as any,
      proofUrl
    });

    setIsScheduleModalOpen(false);
    setPIgn('');
  };

  const handleResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchForResult) return;
    playSuccessFanfare();

    onSubmitResult(
      selectedMatchForResult.id,
      scoreP,
      scoreT,
      assignedTier
    );

    setSelectedMatchForResult(null);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">
            <Swords className="w-4 h-4" />
            <span>SPECTATE & EVALUATE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-sans">
            COMPETITIVE DUEL ARENA
          </h1>
          <p className="text-xs text-purple-300/80 mt-1">
            Schedule official 1v1 tier duels, view real-time scorelines, and submit official grade results.
          </p>
        </div>

        {isStaff && (
          <NeonButton
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              playClickSound();
              setIsScheduleModalOpen(true);
            }}
          >
            Schedule Match Duel
          </NeonButton>
        )}
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matches.map((match) => (
          <GlassCard key={match.id} className="p-6 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-bold uppercase">
                  {match.gamemode} ({match.region})
                </span>
                <span className="text-xs text-purple-400 font-mono">{match.date}</span>
              </div>

              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                match.status === 'IN_PROGRESS'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                <Activity className="w-3.5 h-3.5" />
                {match.status.replace('_', ' ')}
              </span>
            </div>

            {/* Duel Scoreboard */}
            <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-500/30 grid grid-cols-3 items-center text-center">
              
              <div>
                <span className="text-[10px] text-purple-400 font-bold uppercase block">Applicant</span>
                <p className="text-lg font-black text-white mt-0.5">{match.playerIgn}</p>
                <p className="text-3xl font-black text-cyan-300 font-mono mt-1">{match.scorePlayer}</p>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-900/60 px-3 py-1 rounded-full border border-purple-500/30">
                  VS
                </span>
              </div>

              <div>
                <span className="text-[10px] text-purple-400 font-bold uppercase block">Official Tester</span>
                <p className="text-lg font-black text-purple-200 mt-0.5">{match.testerIgn}</p>
                <p className="text-3xl font-black text-rose-400 font-mono mt-1">{match.scoreTester}</p>
              </div>

            </div>

            {/* Assigned Result */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-[10px] text-purple-400 uppercase font-semibold block">Official Result Tier</span>
                {match.assignedTierResult ? (
                  <TierBadge tier={match.assignedTierResult} size="sm" />
                ) : (
                  <span className="text-xs font-bold text-amber-300">Pending Staff Score...</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {match.proofUrl && (
                  <a
                    href={match.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-500/30 text-purple-200 text-xs font-bold hover:border-purple-300 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300" />
                    <span>Replay</span>
                  </a>
                )}

                {isStaff && match.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => {
                      playClickSound();
                      setSelectedMatchForResult(match);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    Submit Match Grade
                  </button>
                )}
              </div>
            </div>

          </GlassCard>
        ))}
      </div>

      {/* Schedule Match Modal */}
      <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} maxWidth="md">
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <h2 className="text-xl font-black text-white">Schedule New Tier Match</h2>

          <div>
            <label className="block text-xs font-bold text-purple-300 uppercase mb-1">Player IGN</label>
            <input
              type="text"
              required
              value={pIgn}
              onChange={(e) => setPIgn(e.target.value)}
              placeholder="Player IGN"
              className="w-full px-3 py-2 rounded-xl bg-purple-950 border border-purple-500/30 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-300 uppercase mb-1">Assigned Tester IGN</label>
            <input
              type="text"
              required
              value={tIgn}
              onChange={(e) => setTIgn(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-purple-950 border border-purple-500/30 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-purple-300 uppercase mb-1">Gamemode</label>
              <select
                value={gamemode}
                onChange={(e) => setGamemode(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-purple-950 border border-purple-500/30 text-white text-xs"
              >
                <option value="boxing">Boxing</option>
                <option value="nodebuff">Nodebuff</option>
                <option value="sumo">Sumo</option>
                <option value="gapple">Gapple</option>
                <option value="mace">Mace</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-300 uppercase mb-1">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-purple-950 border border-purple-500/30 text-white text-xs"
              >
                <option value="NA">NA</option>
                <option value="EU">EU</option>
                <option value="AS">AS</option>
                <option value="SA">SA</option>
                <option value="OCE">OCE</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-purple-900/40 text-purple-300 text-xs font-bold"
            >
              Cancel
            </button>
            <NeonButton type="submit" variant="primary" size="sm">
              Confirm Schedule
            </NeonButton>
          </div>
        </form>
      </Modal>

      {/* Submit Result Modal */}
      <Modal isOpen={!!selectedMatchForResult} onClose={() => setSelectedMatchForResult(null)} maxWidth="md">
        <form onSubmit={handleResultSubmit} className="space-y-4">
          <h2 className="text-xl font-black text-white">Submit Official Grade Result</h2>
          <p className="text-xs text-purple-300">
            Filing official result for <strong className="text-white">{selectedMatchForResult?.playerIgn}</strong>
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-purple-300 uppercase mb-1">Player Score</label>
              <input
                type="number"
                value={scoreP}
                onChange={(e) => setScoreP(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-purple-950 border border-purple-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-300 uppercase mb-1">Tester Score</label>
              <input
                type="number"
                value={scoreT}
                onChange={(e) => setScoreT(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-purple-950 border border-purple-500/30 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-300 uppercase mb-1">Assigned Resulting Tier</label>
            <select
              value={assignedTier}
              onChange={(e) => setAssignedTier(e.target.value as TierLevel)}
              className="w-full px-3 py-2 rounded-xl bg-purple-950 border border-purple-500/30 text-white text-xs"
            >
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

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSelectedMatchForResult(null)}
              className="px-4 py-2 rounded-xl bg-purple-900/40 text-purple-300 text-xs font-bold"
            >
              Cancel
            </button>
            <NeonButton type="submit" variant="primary" size="sm">
              Save Match Grade & Auto-Promote
            </NeonButton>
          </div>
        </form>
      </Modal>

    </div>
  );
}
