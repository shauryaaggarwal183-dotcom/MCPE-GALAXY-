import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Swords, 
  BarChart3, 
  ShieldCheck, 
  Search, 
  Bell, 
  Menu, 
  X, 
  Sparkles, 
  UserCheck,
  Disc as Discord,
  Layers,
  LayoutDashboard,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';
import { verifyAdminPassword } from '../../utils/adminAuth';
import { StaffRole, Player, NotificationItem, DiscordUser } from '../../types';
import { GALAXY_LOGO } from '../../constants/assets';

export interface NavbarProps {
  siteTitle?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  notifications?: NotificationItem[];
  unreadCount?: number;
  currentRole: StaffRole;
  setCurrentRole: (role: StaffRole) => void;
  discordUser?: DiscordUser | null;
  onOpenDiscordAuth?: () => void;
  isDiscordConnected?: boolean;
  setIsDiscordConnected?: (connected: boolean) => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onSelectPlayer?: (p: Player) => void;
}

export function Navbar({
  siteTitle = 'MCPE GALAXY TIER SYSTEM',
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenNotifications,
  notifications = [],
  unreadCount = 0,
  currentRole,
  setCurrentRole,
  discordUser = null,
  onOpenDiscordAuth,
  isDiscordConnected = true,
  setIsDiscordConnected
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [pendingRole, setPendingRole] = useState<StaffRole | null>(null);
  const [roleError, setRoleError] = useState('');

  const isAdminUnlocked = typeof window !== 'undefined' && sessionStorage.getItem('mcpe_admin_unlocked') === 'true';

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
    { id: 'testing', label: 'Tiers & Testing', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'staff', label: 'Staff', icon: ShieldCheck },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard }
  ];

  const handleNavClick = (id: string) => {
    playClickSound();
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#090514]/90 backdrop-blur-2xl border-b border-purple-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo - Clean and Minimal */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 p-0.5 shadow-md group-hover:scale-105 transition-all overflow-hidden flex items-center justify-center">
              <img 
                src={GALAXY_LOGO} 
                alt="MCPE Galaxy" 
                className="w-full h-full object-cover rounded-[10px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-base font-bold tracking-tight text-white group-hover:text-purple-200 transition-colors">
              Galaxy Tiers
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-purple-950/30 p-1 rounded-xl border border-purple-500/20">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 uppercase tracking-wider ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 border border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                      : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300 animate-pulse' : 'text-purple-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Search */}
            <button
              onClick={() => onOpenSearch && onOpenSearch()}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs hover:border-purple-400 hover:text-white transition-all shadow-inner group"
            >
              <Search className="w-4 h-4 text-purple-400 group-hover:text-cyan-300" />
              <span className="hidden sm:inline font-medium">Search...</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => onOpenNotifications && onOpenNotifications()}
              className="relative p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 transition-all"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center animate-bounce shadow-[0_0_10px_rgba(244,63,94,0.8)]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Get Tested Direct Ticket Button */}
            <a
              href="https://discord.com/channels/1222612688241295420/1532353506147569714"
              target="_blank"
              rel="noreferrer"
              onClick={() => playClickSound()}
              className="btn-gold-purple-animated flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white font-black text-xs uppercase tracking-wider transition-all"
            >
              <Discord className="w-4 h-4 text-amber-200" />
              <span>GET TESTED</span>
            </a>

            {/* Discord OAuth Login Profile Chip */}
            {discordUser ? (
              <button
                onClick={() => onOpenDiscordAuth && onOpenDiscordAuth()}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 hover:border-purple-400 text-white text-xs font-semibold transition-all group shadow-sm"
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-purple-400/60 shrink-0">
                  <img
                    src={discordUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${discordUser.username}`}
                    alt={discordUser.username}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#090514]" />
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-xs font-bold leading-none text-purple-100 group-hover:text-cyan-300 transition-colors">
                    {discordUser.globalName || discordUser.username}
                  </span>
                  <span className="block text-[9px] text-purple-400 font-mono leading-tight">
                    {discordUser.discriminator ? `#${discordUser.discriminator}` : 'Discord'}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => onOpenDiscordAuth && onOpenDiscordAuth()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/35 border border-[#5865F2]/50 text-[#c7ccf8] hover:text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(88,101,242,0.2)]"
              >
                <Discord className="w-4 h-4 text-[#5865F2]" />
                <span className="hidden sm:inline">Login with Discord</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}

            {/* Role Switcher Button */}
            <button
              onClick={() => setRoleModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/40 text-purple-200 text-xs font-semibold hover:border-purple-300 transition-all"
            >
              <UserCheck className="w-4 h-4 text-cyan-300" />
              <span>{currentRole}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-16 left-0 right-0 z-30 bg-[#0d0720]/95 backdrop-blur-2xl border-b border-purple-500/20 px-6 py-4 space-y-1 shadow-2xl"
          >
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide uppercase transition-all ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md'
                      : 'text-purple-200/80 hover:bg-purple-900/30 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-purple-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-purple-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-300/70 font-medium">Role:</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setRoleModalOpen(true);
                  }}
                  className="text-xs font-bold text-cyan-300 hover:text-cyan-200 underline"
                >
                  {currentRole}
                </button>
              </div>

              {discordUser ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDiscordAuth && onOpenDiscordAuth();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs text-white"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={discordUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${discordUser.username}`}
                      alt={discordUser.username}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="font-bold">{discordUser.globalName || discordUser.username}</span>
                  </div>
                  <span className="text-[10px] text-purple-400 font-mono">Manage</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDiscordAuth && onOpenDiscordAuth();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#5865F2] text-white text-xs font-bold"
                >
                  <Discord className="w-4 h-4" />
                  <span>Login with Discord</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Picker Modal */}
      <AnimatePresence>
        {roleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f0923] border border-purple-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setRoleModalOpen(false)}
                className="absolute top-4 right-4 text-purple-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                Staff Role Permissions
              </h3>
              <p className="text-xs text-purple-300 mb-4">
                Staff roles can only be assigned by authorized staff members. Enter the Admin Passkey to verify authorization.
              </p>

              <div className="space-y-2 mb-4">
                {(['Player', 'Tester', 'Moderator', 'Admin'] as StaffRole[]).map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      playClickSound();
                      setRoleError('');
                      if (r === 'Player') {
                        setCurrentRole('Player');
                        setPendingRole(null);
                      } else if (isAdminUnlocked) {
                        setCurrentRole(r);
                        setPendingRole(null);
                      } else {
                        setPendingRole(r);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                      currentRole === r
                        ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                        : pendingRole === r
                        ? 'bg-indigo-900/60 text-cyan-300 border-cyan-400'
                        : 'bg-purple-950/30 text-purple-300 border-purple-500/20 hover:border-purple-400'
                    }`}
                  >
                    <span>{r}</span>
                    {currentRole === r && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ACTIVE</span>}
                    {pendingRole === r && <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">REQUIRES PASSKEY</span>}
                  </button>
                ))}
              </div>

              {pendingRole && !isAdminUnlocked && (
                <div className="mb-4 p-3 rounded-xl bg-purple-950 border border-purple-500/40 space-y-2">
                  <label className="block text-[11px] font-bold text-cyan-300 uppercase">
                    Admin Passkey Required to Assign {pendingRole} Role
                  </label>
                  <input
                    type="password"
                    value={passkeyInput}
                    onChange={(e) => {
                      setPasskeyInput(e.target.value);
                      setRoleError('');
                    }}
                    placeholder="Enter Admin Passkey..."
                    className="w-full px-3 py-2 rounded-lg bg-purple-900/60 border border-purple-500/30 text-white text-xs"
                  />
                  {roleError && <p className="text-[11px] text-rose-400 font-bold">{roleError}</p>}
                  <button
                    onClick={async () => {
                      if (!passkeyInput.trim()) return;
                      try {
                        const isValid = await verifyAdminPassword(passkeyInput);
                        if (isValid) {
                          sessionStorage.setItem('mcpe_admin_unlocked', 'true');
                          if (pendingRole) setCurrentRole(pendingRole);
                          setPendingRole(null);
                          setPasskeyInput('');
                          setRoleError('');
                          setRoleModalOpen(false);
                        } else {
                          setRoleError('Incorrect password.');
                        }
                      } catch {
                        setRoleError('Incorrect password.');
                      }
                    }}
                    className="w-full py-2 rounded-lg bg-cyan-600 text-white font-bold text-xs uppercase hover:bg-cyan-500 transition-all"
                  >
                    Authorize & Assign Role
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setRoleModalOpen(false);
                  setPendingRole(null);
                  setRoleError('');
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs uppercase shadow-lg hover:bg-purple-500"
              >
                Close Role Dialog
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
