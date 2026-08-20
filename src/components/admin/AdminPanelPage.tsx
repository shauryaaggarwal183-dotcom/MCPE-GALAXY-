import React, { useState, useEffect } from 'react';
import { StaffRole, Player, TestApplication, AuditLog, GamemodeInfo, TestMatch } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { NeonButton } from '../common/NeonButton';
import { TierBadge } from '../common/TierBadge';
import { 
  ShieldCheck, 
  Users, 
  ClipboardList, 
  Ban, 
  Settings, 
  Bell, 
  Disc as Discord, 
  Swords, 
  Award, 
  FileText,
  Activity,
  Megaphone,
  Save,
  CheckCircle2,
  Trash2,
  Edit,
  Plus,
  KeyRound,
  Lock,
  Unlock,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { playClickSound, playSuccessFanfare } from '../../utils/audio';
import { verifyAdminPassword } from '../../utils/adminAuth';
import { api } from '../../utils/api';

interface AdminPanelPageProps {
  siteTitle?: string;
  onUpdateSiteTitle?: (newTitle: string) => void;
  currentRole: StaffRole;
  players: Player[];
  applications: TestApplication[];
  matches: TestMatch[];
  gamemodes: GamemodeInfo[];
  logs: AuditLog[];
  announcement: { id: string; title: string; message: string; type: string; active: boolean };
  onUpdateAnnouncement: (ann: any) => void;
  onUpdatePlayer: (p: Player) => void;
  onUpdateRole: (playerIgn: string, newRole: StaffRole) => void;
  onBanPlayer: (playerIgn: string) => void;
}

export function AdminPanelPage({
  siteTitle = 'MCPE GALAXY TIER SYSTEM',
  onUpdateSiteTitle,
  currentRole,
  players,
  applications,
  matches,
  gamemodes,
  logs,
  announcement,
  onUpdateAnnouncement,
  onUpdatePlayer,
  onUpdateRole,
  onBanPlayer
}: AdminPanelPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'staff' | 'discord' | 'announcements' | 'settings'>('overview');

  // Website Title state
  const [titleInput, setTitleInput] = useState(siteTitle);

  // Passkey Authentication State
  const [passkeyInput, setPasskeyInput] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [passkeyError, setPasskeyError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('mcpe_admin_unlocked') === 'true';
  });

  // Announcement state
  const [annTitle, setAnnTitle] = useState(announcement.title);
  const [annMessage, setAnnMessage] = useState(announcement.message);
  const [annType, setAnnType] = useState(announcement.type);
  const [annActive, setAnnActive] = useState(announcement.active);

  // Discord webhook state
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('');
  const [autoRoleEnabled, setAutoRoleEnabled] = useState(true);

  useEffect(() => {
    api.getSettings().then(s => {
      if (s) {
        if (s.discordWebhookUrl) setDiscordWebhookUrl(s.discordWebhookUrl);
        if (s.autoRoleEnabled !== undefined) setAutoRoleEnabled(s.autoRoleEnabled);
        if (s.siteTitle && !titleInput) setTitleInput(s.siteTitle);
      }
    }).catch(console.warn);
  }, []);

  // Save changes toast message
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleGlobalSave = async () => {
    playSuccessFanfare();
    try {
      await api.updateSettings({
        siteTitle: titleInput.trim(),
        discordWebhookUrl: discordWebhookUrl.trim(),
        autoRoleEnabled
      });

      if (onUpdateSiteTitle && titleInput.trim()) {
        onUpdateSiteTitle(titleInput.trim());
      }
      if (onUpdateAnnouncement) {
        onUpdateAnnouncement({
          ...announcement,
          title: annTitle,
          message: annMessage,
          type: annType,
          active: annActive
        });
      }
      setSaveToast('All Admin Panel settings & configurations persisted successfully to database!');
    } catch (err: any) {
      setSaveToast(`Save Notice: ${err.message || 'Saved locally'}`);
    }
    setTimeout(() => {
      setSaveToast(null);
    }, 4000);
  };

  const handlePasskeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim() || isVerifying) return;

    setIsVerifying(true);
    setPasskeyError(false);

    try {
      const isValid = await verifyAdminPassword(passkeyInput);

      if (isValid) {
        sessionStorage.setItem('mcpe_admin_unlocked', 'true');
        sessionStorage.setItem('admin_passkey', passkeyInput.trim());
        setIsUnlocked(true);
        setPasskeyError(false);
        if (currentRole !== 'Admin' && onUpdateRole) {
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

  const handleLockAdmin = () => {
    sessionStorage.removeItem('mcpe_admin_unlocked');
    sessionStorage.removeItem('admin_passkey');
    setIsUnlocked(false);
    setPasskeyInput('');
    playClickSound();
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessFanfare();
    onUpdateAnnouncement({
      id: announcement.id || 'ann_1',
      title: annTitle,
      message: annMessage,
      type: annType,
      active: annActive
    });
  };

  // Passkey Gate: Admin Panel MUST be unlocked with security passkey
  if (!isUnlocked) {
    return (
      <div className="py-20 max-w-md mx-auto px-4">
        <GlassCard className="p-8 text-center space-y-6 border-amber-500/40">
          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-amber-400 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
            <div className="w-full h-full bg-[#0d071e] rounded-[14px] flex items-center justify-center">
              <Lock className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-white tracking-wider uppercase font-sans">
              ADMIN PANEL LOGIN REQUIRED
            </h2>
            <p className="text-xs text-purple-300/80 mt-1">
              Enter the administrative security passkey to log in and unlock the Galaxy Master Admin Panel.
            </p>
          </div>

          <form onSubmit={handlePasskeySubmit} className="space-y-4 text-left">
            <div className="relative">
              <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                Security Passkey
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
                  placeholder="Enter passkey..."
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
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Incorrect password.
                </p>
              )}
            </div>

            <NeonButton type="submit" variant="primary" size="md" className="w-full flex items-center justify-center gap-2">
              <Unlock className="w-4 h-4 text-amber-300" />
              <span>Authenticate Passkey</span>
            </NeonButton>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 border border-purple-500/50 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>FULL SYSTEM CONTROL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-sans">
            GALAXY ADMIN PANEL
          </h1>
          <p className="text-xs text-purple-300/80 mt-1">
            Manage global players, staff authorizations, Discord synchronization webhooks, and live site announcements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleGlobalSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          <span className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-black uppercase">
            LOGGED IN AS {currentRole}
          </span>
          <button
            onClick={handleLockAdmin}
            title="Lock Admin Panel"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-bold transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock Panel</span>
          </button>
        </div>
      </div>

      {/* Save Success Toast */}
      {saveToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveToast}</span>
          </div>
          <button onClick={() => setSaveToast(null)} className="text-emerald-400 hover:text-white font-black text-xs">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-purple-500/20">
        {[
          { id: 'overview', label: 'System Overview', icon: Activity },
          { id: 'players', label: 'Player Management', icon: Users },
          { id: 'staff', label: 'Staff & Roles', icon: ShieldCheck },
          { id: 'discord', label: 'Discord Webhooks', icon: Discord },
          { id: 'announcements', label: 'Global Banners', icon: Megaphone },
          { id: 'settings', label: 'App Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400'
                  : 'bg-purple-950/40 text-purple-300 border border-purple-500/20 hover:border-purple-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="p-5">
              <span className="text-[10px] text-purple-400 font-bold uppercase">Total Competitors</span>
              <p className="text-3xl font-black text-white font-mono mt-1">{players.length}</p>
            </GlassCard>

            <GlassCard className="p-5">
              <span className="text-[10px] text-purple-400 font-bold uppercase">Active Applications</span>
              <p className="text-3xl font-black text-cyan-300 font-mono mt-1">{applications.length}</p>
            </GlassCard>

            <GlassCard className="p-5">
              <span className="text-[10px] text-purple-400 font-bold uppercase">Total Matches</span>
              <p className="text-3xl font-black text-amber-300 font-mono mt-1">{matches.length}</p>
            </GlassCard>

            <GlassCard className="p-5">
              <span className="text-[10px] text-purple-400 font-bold uppercase">Banned Accounts</span>
              <p className="text-3xl font-black text-rose-400 font-mono mt-1">{players.filter(p=>p.isBanned).length}</p>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <h3 className="text-sm font-bold uppercase text-white mb-4">Recent System Logs</h3>
            <div className="space-y-2">
              {logs.slice(0, 5).map(log => (
                <div key={log.id} className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/20 text-xs flex justify-between items-center">
                  <span><strong className="text-cyan-300">{log.actor || log.actorIgn || 'Admin'}</strong>: {log.action} ({log.details})</span>
                  <span className="text-[10px] text-purple-400 font-mono">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* PLAYER MANAGEMENT */}
      {activeTab === 'players' && (
        <div className="overflow-hidden rounded-2xl bg-[#0d071e]/90 border border-purple-500/30 shadow-xl">
          <div className="p-4 bg-purple-950/60 border-b border-purple-500/20 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase">Assign Player Roles & Access Controls</span>
            <span className="text-xs text-purple-300">Only Admins can assign staff roles</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-500/30 bg-purple-950/50 text-[11px] font-black uppercase text-purple-300">
                  <th className="py-3.5 px-4">IGN</th>
                  <th className="py-3.5 px-4">Region</th>
                  <th className="py-3.5 px-4">Tier</th>
                  <th className="py-3.5 px-4">Points</th>
                  <th className="py-3.5 px-4">Current Role</th>
                  <th className="py-3.5 px-4">Assign Staff Role</th>
                  <th className="py-3.5 px-4 text-right">Ban Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10 text-xs text-white">
                {players.map((p) => (
                  <tr key={p.id} className="hover:bg-purple-900/20">
                    <td className="py-3 px-4 font-bold">{p.ign}</td>
                    <td className="py-3 px-4 font-mono">{p.region}</td>
                    <td className="py-3 px-4"><TierBadge tier={p.overallTier} size="sm" /></td>
                    <td className="py-3 px-4 font-mono text-cyan-300 font-bold">{p.totalPoints} PTS</td>
                    <td className="py-3 px-4 font-bold text-amber-300">{p.staffRole || 'Player'}</td>
                    <td className="py-3 px-4">
                      <select
                        value={p.staffRole || 'Player'}
                        onChange={(e) => {
                          playSuccessFanfare();
                          onUpdateRole(p.ign, e.target.value as StaffRole);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-500/30 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
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
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          p.isBanned ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
                        }`}
                      >
                        {p.isBanned ? 'Unban Player' : 'Ban Player'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STAFF & ROLES MANAGEMENT */}
      {activeTab === 'staff' && (
        <div className="space-y-8">
          
          {/* Header & Quick Action Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-5 flex items-center gap-4 border-amber-500/30">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-purple-300 font-bold uppercase block">Active Admins</span>
                <span className="text-2xl font-black text-white font-mono">
                  {players.filter(p => p.staffRole === 'Admin').length}
                </span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 flex items-center gap-4 border-cyan-500/30">
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-purple-300 font-bold uppercase block">Active Moderators</span>
                <span className="text-2xl font-black text-white font-mono">
                  {players.filter(p => p.staffRole === 'Moderator').length}
                </span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 flex items-center gap-4 border-purple-500/30">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-purple-300 font-bold uppercase block">Certified Testers</span>
                <span className="text-2xl font-black text-white font-mono">
                  {players.filter(p => p.staffRole === 'Tester').length}
                </span>
              </div>
            </GlassCard>
          </div>

          {/* Role Hierarchy & Permission Breakdown */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-400">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>OFFICIAL STAFF ROLE HIERARCHY & PERMISSIONS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-purple-950/60 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-[10px] uppercase">
                    Admin Role
                  </span>
                  <span className="text-[10px] text-purple-400 font-mono">Highest Authority</span>
                </div>
                <p className="text-purple-200 text-[11px] leading-relaxed">
                  Full control over Galaxy Admin Panel, website title branding, global announcements, Discord webhooks, staff role assignments, player ban controls, and manual tier overrides.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/60 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-black text-[10px] uppercase">
                    Moderator Role
                  </span>
                  <span className="text-[10px] text-purple-400 font-mono">Enforcement</span>
                </div>
                <p className="text-purple-200 text-[11px] leading-relaxed">
                  Moderates queue integrity, reviews flagged players, issues ban/unban sanctions, audits player logs, and enforces competitive Bedrock rules.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 font-black text-[10px] uppercase">
                    Tester Role
                  </span>
                  <span className="text-[10px] text-purple-400 font-mono">Evaluation</span>
                </div>
                <p className="text-purple-200 text-[11px] leading-relaxed">
                  Conducts live 1v1 tier testing duels, submits mechanical score notes, approves or rejects tier test applications, and logs official match results.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Staff Members List & Assign Role Table */}
          <div className="overflow-hidden rounded-2xl bg-[#0d071e]/90 border border-purple-500/30 shadow-xl space-y-0">
            <div className="p-4 bg-purple-950/80 border-b border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Staff Members & Role Assignments
                </h3>
                <p className="text-xs text-purple-300 mt-0.5">
                  Promote players to Tester, Moderator, or Admin, or demote them back to Player.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-purple-500/30 bg-purple-950/50 text-[11px] font-black uppercase text-purple-300">
                    <th className="py-3.5 px-4">IGN / User</th>
                    <th className="py-3.5 px-4">Region</th>
                    <th className="py-3.5 px-4">Overall Tier</th>
                    <th className="py-3.5 px-4">Current Role</th>
                    <th className="py-3.5 px-4">Update Staff Role</th>
                    <th className="py-3.5 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10 text-white">
                  {players.map((p) => {
                    const isStaff = p.staffRole && p.staffRole !== 'Player';

                    return (
                      <tr key={p.id} className={`hover:bg-purple-900/20 ${isStaff ? 'bg-purple-950/30' : ''}`}>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.avatarUrl || `https://mc-heads.net/avatar/${p.ign}/32`}
                              alt={p.ign}
                              className="w-7 h-7 rounded-lg border border-purple-500/30"
                            />
                            <div>
                              <span className="font-black text-white block">{p.ign}</span>
                              {p.discordTag && <span className="text-[10px] text-purple-400 block">{p.discordTag}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-purple-300">{p.region}</td>
                        <td className="py-3.5 px-4">
                          <TierBadge tier={p.overallTier} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          {p.staffRole === 'Admin' ? (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] uppercase font-black">Admin</span>
                          ) : p.staffRole === 'Moderator' ? (
                            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] uppercase font-black">Moderator</span>
                          ) : p.staffRole === 'Tester' ? (
                            <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] uppercase font-black">Tester</span>
                          ) : (
                            <span className="text-purple-400 font-semibold">Player</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={p.staffRole || 'Player'}
                            onChange={(e) => {
                              playSuccessFanfare();
                              onUpdateRole(p.ign, e.target.value as StaffRole);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-500/40 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                          >
                            <option value="Player">Player (Regular Member)</option>
                            <option value="Tester">Tester (Evaluator)</option>
                            <option value="Moderator">Moderator (Enforcer)</option>
                            <option value="Admin">Admin (Full Control)</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isStaff ? (
                            <button
                              onClick={() => {
                                playClickSound();
                                onUpdateRole(p.ign, 'Player');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-[11px] font-bold transition-all"
                            >
                              Revoke Staff
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                playSuccessFanfare();
                                onUpdateRole(p.ign, 'Tester');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/30 text-[11px] font-bold transition-all"
                            >
                              Make Tester
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* DISCORD WEBHOOKS */}
      {activeTab === 'discord' && (
        <GlassCard className="p-6 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-400">
            <Discord className="w-5 h-5" />
            <span>DISCORD BOT & WEBHOOK CONFIGURATION</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-300 uppercase mb-1">Audit Log Webhook URL</label>
            <input
              type="url"
              value={discordWebhookUrl}
              onChange={(e) => setDiscordWebhookUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-purple-950 border border-purple-500/30 text-white text-xs"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/50 border border-purple-500/20">
            <div>
              <p className="text-xs font-bold text-white">Auto-Sync Discord Tier Roles</p>
              <p className="text-[11px] text-purple-300">Sync HT1-LT5 role IDs to Discord guild automatically upon promotion.</p>
            </div>
            <input
              type="checkbox"
              checked={autoRoleEnabled}
              onChange={(e) => setAutoRoleEnabled(e.target.checked)}
              className="w-4 h-4 accent-purple-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <NeonButton variant="primary" size="sm" onClick={() => {
              playSuccessFanfare();
              api.updateSettings({ discordWebhookUrl, autoRoleEnabled }).catch(console.warn);
              setSaveToast('Discord integration configuration saved!');
              setTimeout(() => setSaveToast(null), 3000);
            }}>
              Save Discord Integration Config
            </NeonButton>

            <button
              type="button"
              onClick={async () => {
                try {
                  playClickSound();
                  await api.testDiscordWebhook(discordWebhookUrl);
                  setSaveToast('Test message successfully sent to Discord Webhook channel!');
                } catch (err: any) {
                  setSaveToast(`Webhook test result: ${err.message || 'Sent'}`);
                }
                setTimeout(() => setSaveToast(null), 4000);
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-indigo-200 text-xs font-bold transition-all"
            >
              Test Webhook Ping
            </button>
          </div>
        </GlassCard>
      )}

      {/* ANNOUNCEMENT BANNER BROADCASTER */}
      {activeTab === 'announcements' && (
        <GlassCard className="p-6 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-400">
            <Megaphone className="w-5 h-5" />
            <span>GLOBAL SITE ANNOUNCEMENT BANNER</span>
          </div>

          <form onSubmit={handleSaveAnnouncement} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-purple-300 uppercase mb-1">Banner Headline Title</label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-purple-950 border border-purple-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-300 uppercase mb-1">Announcement Body Message</label>
              <textarea
                rows={3}
                required
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-purple-950 border border-purple-500/30 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-purple-300 uppercase mb-1">Banner Alert Style</label>
                <select
                  value={annType}
                  onChange={(e) => setAnnType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-purple-950 border border-purple-500/30 text-white text-xs"
                >
                  <option value="INFO">INFO (Cyan/Purple)</option>
                  <option value="WARNING">WARNING (Amber)</option>
                  <option value="PROMOTION">PROMOTION (Emerald)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="annActive"
                  checked={annActive}
                  onChange={(e) => setAnnActive(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
                <label htmlFor="annActive" className="text-xs font-bold text-white cursor-pointer">
                  Enable Global Announcement
                </label>
              </div>
            </div>

            <NeonButton type="submit" variant="primary" size="md" icon={<Save className="w-4 h-4" />}>
              Broadcast Announcement
            </NeonButton>
          </form>
        </GlassCard>
      )}

      {/* APP SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-2xl">
          {/* Website Branding / Title Setting */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <Edit className="w-4 h-4 text-cyan-300" />
              Website Branding & Title
            </h3>
            <p className="text-xs text-purple-300">
              Customize the website title displayed across the header, brand logo, and document title bar.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!titleInput.trim()) return;
                playSuccessFanfare();
                if (onUpdateSiteTitle) {
                  onUpdateSiteTitle(titleInput.trim());
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-purple-300 uppercase mb-1">Website Title</label>
                <input
                  type="text"
                  required
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. MCPE GALAXY TIER SYSTEM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950 border border-purple-500/30 text-white font-bold text-xs"
                />
              </div>

              <NeonButton type="submit" variant="primary" size="sm" icon={<Save className="w-4 h-4" />}>
                Save Website Title
              </NeonButton>
            </form>
          </GlassCard>

          {/* Maintenance rules */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white uppercase">Bedrock Tier System Maintenance</h3>
            <p className="text-xs text-purple-300">
              System configuration for tier demotion decay rules, evaluation cooldowns, and queue rate limits.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-500/20 flex items-center justify-between text-xs">
                <span>Allow Self Application Retests Every 14 Days</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-600" />
              </div>

              <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-500/20 flex items-center justify-between text-xs">
                <span>Require Video Proof Clip for HT1 / HT2 Applications</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-600" />
              </div>
            </div>
          </GlassCard>
        </div>
      )}

    </div>
  );
}
