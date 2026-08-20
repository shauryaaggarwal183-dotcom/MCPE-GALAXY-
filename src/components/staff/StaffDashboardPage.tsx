import React, { useState } from 'react';
import { StaffRole, Player, TestApplication, AuditLog } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { NeonButton } from '../common/NeonButton';
import { TierBadge } from '../common/TierBadge';
import { 
  ShieldCheck, 
  Users, 
  ClipboardList, 
  Ban, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Settings, 
  Bell, 
  MessageSquare,
  Award,
  Lock,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { playClickSound, playSuccessFanfare } from '../../utils/audio';
import { verifyAdminPassword } from '../../utils/adminAuth';

interface StaffDashboardPageProps {
  currentRole: StaffRole;
  players: Player[];
  applications: TestApplication[];
  logs: AuditLog[];
  onPromotePlayer: (playerIgn: string, newTier: any) => void;
  onBanPlayer: (playerIgn: string) => void;
  onUpdateRole: (playerIgn: string, newRole: StaffRole) => void;
}

export function StaffDashboardPage({
  currentRole,
  players,
  applications,
  logs,
  onPromotePlayer,
  onBanPlayer,
  onUpdateRole
}: StaffDashboardPageProps) {
  const [selectedTab, setSelectedTab] = useState<'queue' | 'players' | 'logs'>('queue');
  const [targetIgn, setTargetIgn] = useState('');
  const [targetTier, setTargetTier] = useState('HT2');

  // Admin Panel Lock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('mcpe_admin_unlocked') === 'true';
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [passkeyError, setPasskeyError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const pendingApps = applications.filter(a => a.status === 'PENDING');

  const handlePasskeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim() || isVerifying) return;

    setIsVerifying(true);
    setPasskeyError(false);

    try {
      const isValid = await verifyAdminPassword(passkeyInput);

      if (isValid) {
        sessionStorage.setItem('mcpe_admin_unlocked', 'true');
        setIsUnlocked(true);
        setPasskeyError(false);
        if (currentRole === 'Player' && onUpdateRole) {
          onUpdateRole('iiiniveddd', 'Admin');
        }
        playSuccessFanfare();
        setPasskeyInput('');
      } else {
        setPasskeyError(true);
        playClickSound();
      }
    } catch {
      setPasskeyError(true);
      playClickSound();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualPromote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetIgn) return;
    playSuccessFanfare();
    onPromotePlayer(targetIgn, targetTier as any);
    setTargetIgn('');
  };

  if (!isUnlocked) {
    return (
      <div className="py-20 max-w-md mx-auto px-4">
        <GlassCard className="p-8 text-center space-y-6 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-amber-400 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
            <div className="w-full h-full bg-[#0d071e] rounded-[14px] flex items-center justify-center">
              <Lock className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-white tracking-wider uppercase font-sans">
              ADMIN PANEL ACCESS REQUIRED
            </h2>
            <p className="text-xs text-purple-300/80 mt-1">
              Staff Dashboard is restricted. Please enter the Admin Panel security passkey to gain access.
            </p>
          </div>

          <form onSubmit={handlePasskeySubmit} className="space-y-4 text-left">
            <div className="relative">
              <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                Admin Security Passkey
              </label>
              <div className="relative">
                <input
                  type={showPasskey ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passkeyInput}
                  onChange={(e) => {
                    setPasskeyInput(e.target.value);
                    if (passkeyError) setPasskeyError(false);
                  }}
                  placeholder="Enter admin passkey..."
                  className={`w-full pl-4 pr-10 py-3 rounded-xl bg-purple-950/80 border text-white text-sm font-mono focus:outline-none transition-all ${
                    passkeyError 
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-950/30' 
                      : 'border-purple-500/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3 top-3.5 text-purple-400 hover:text-white"
                >
                  {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passkeyError && (
                <p className="text-[11px] text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Incorrect password.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_30px_rgba(245,158,11,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all border border-amber-300/40"
            >
              LOG IN TO ADMIN PANEL & DASHBOARD
            </button>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Staff Role Badge Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 border border-purple-500/40 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-cyan-300" />
            <span>STAFF COMMAND CENTER</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            {currentRole.toUpperCase()} DASHBOARD
          </h1>
          <p className="text-xs text-purple-300 mt-1">
            Authorized management tools for official Bedrock Tier evaluations, moderation, and rankings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-black text-emerald-300 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ADMIN LOGGED IN
          </span>
          <button
            onClick={() => {
              sessionStorage.removeItem('mcpe_admin_unlocked');
              setIsUnlocked(false);
              playClickSound();
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold text-rose-300 flex items-center gap-1 transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-500/20 pb-2">
        <button
          onClick={() => {
            playClickSound();
            setSelectedTab('queue');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            selectedTab === 'queue' ? 'bg-purple-600 text-white shadow-lg' : 'bg-purple-950/40 text-purple-300'
          }`}
        >
          Pending Applications ({pendingApps.length})
        </button>

        <button
          onClick={() => {
            playClickSound();
            setSelectedTab('players');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            selectedTab === 'players' ? 'bg-purple-600 text-white shadow-lg' : 'bg-purple-950/40 text-purple-300'
          }`}
        >
          Player & Role Management
        </button>

        <button
          onClick={() => {
            playClickSound();
            setSelectedTab('logs');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            selectedTab === 'logs' ? 'bg-purple-600 text-white shadow-lg' : 'bg-purple-950/40 text-purple-300'
          }`}
        >
          Staff Audit Logs ({logs.length})
        </button>
      </div>

      {/* QUEUE TAB */}
      {selectedTab === 'queue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingApps.map((app) => (
            <GlassCard key={app.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase">{app.playerIgn}</span>
                <span className="text-[10px] text-purple-400 font-mono">{app.region}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-300">Gamemode: <strong className="text-cyan-300 uppercase">{app.gamemode}</strong></span>
                <TierBadge tier={app.requestedTier} size="sm" />
              </div>

              <p className="text-xs text-purple-300/80 bg-purple-950/50 p-2 rounded-lg italic">
                "{app.notes || 'No extra notes provided'}"
              </p>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    playSuccessFanfare();
                    onPromotePlayer(app.playerIgn, app.requestedTier);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
                >
                  Approve Promotion
                </button>
              </div>
            </GlassCard>
          ))}

          {pendingApps.length === 0 && (
            <p className="text-xs text-purple-400 col-span-full py-8 text-center">No applications waiting in queue.</p>
          )}
        </div>
      )}

      {/* PLAYERS & ROLES TAB */}
      {selectedTab === 'players' && (
        <div className="space-y-6">
          
          {/* Quick Manual Override Form */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-bold text-white uppercase mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Manual Tier Promotion Override
            </h3>
            <form onSubmit={handleManualPromote} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Target Player IGN"
                value={targetIgn}
                onChange={(e) => setTargetIgn(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-purple-950/80 border border-purple-500/30 text-white text-xs"
              />

              <select
                value={targetTier}
                onChange={(e) => setTargetTier(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-purple-950/80 border border-purple-500/30 text-white text-xs"
              >
                <option value="HT1">HT1 - High Tier 1</option>
                <option value="LT1">LT1 - Low Tier 1</option>
                <option value="HT2">HT2 - High Tier 2</option>
                <option value="LT2">LT2 - Low Tier 2</option>
                <option value="HT3">HT3 - High Tier 3</option>
                <option value="LT3">LT3 - Low Tier 3</option>
              </select>

              <NeonButton type="submit" variant="primary" size="sm">
                Apply Tier Override
              </NeonButton>
            </form>
          </GlassCard>

          {/* Players Table */}
          <div className="overflow-hidden rounded-2xl bg-[#0d071e]/90 border border-purple-500/30">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-500/30 bg-purple-950/50 text-[11px] font-black uppercase text-purple-300">
                  <th className="py-3 px-4">IGN</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Current Tier</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10 text-xs text-white">
                {players.slice(0, 10).map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-bold">{p.ign}</td>
                    <td className="py-3 px-4 font-mono">{p.region}</td>
                    <td className="py-3 px-4"><TierBadge tier={p.overallTier} size="sm" /></td>
                    <td className="py-3 px-4">
                      <select
                        value={p.staffRole}
                        onChange={(e) => onUpdateRole(p.ign, e.target.value as StaffRole)}
                        className="px-2 py-1 rounded bg-purple-900 border border-purple-500/30 text-[11px] text-cyan-300 font-bold"
                      >
                        <option value="Player">Player</option>
                        <option value="Tester">Tester</option>
                        <option value="Moderator">Moderator</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onBanPlayer(p.ign)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          p.isBanned ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        {p.isBanned ? 'Unban' : 'Ban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* LOGS TAB */}
      {selectedTab === 'logs' && (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white">{log.actorIgn}</span>
                <span className="text-purple-400 mx-2">•</span>
                <span className="text-cyan-300 font-bold">{log.action}</span>
                <p className="text-[11px] text-purple-300/80 mt-0.5">{log.details}</p>
              </div>
              <span className="text-[10px] text-purple-400 font-mono">{log.timestamp}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
