import React, { useState, useEffect } from 'react';
import { 
  Player, 
  TestApplication, 
  TestMatch, 
  GamemodeInfo, 
  SystemStats, 
  StaffRole, 
  AuditLog, 
  NotificationItem, 
  TierLevel,
  DiscordUser 
} from './types';

// Common Layout
import { BackgroundCanvas } from './components/common/BackgroundCanvas';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchQuickModal } from './components/layout/SearchQuickModal';
import { QuickNavDots } from './components/layout/QuickNavDots';
import { DiscordOAuthModal } from './components/layout/DiscordOAuthModal';

// Views
import { HeroSection } from './components/home/HeroSection';
import { ChampionsPodium } from './components/home/ChampionsPodium';
import { LiveStatsGrid } from './components/home/LiveStatsGrid';
import { LatestTierTests } from './components/home/LatestTierTests';
import { GamemodesShowcase } from './components/home/GamemodesShowcase';
import { CommunityDiscordCTA } from './components/home/CommunityDiscordCTA';

import { LeaderboardsPage } from './components/leaderboards/LeaderboardsPage';
import { TierTestingPage } from './components/testing/TierTestingPage';
import { MatchSystemPage } from './components/matches/MatchSystemPage';
import { StaffDashboardPage } from './components/staff/StaffDashboardPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { AdminPanelPage } from './components/admin/AdminPanelPage';

// Modals
import { PlayerProfileModal } from './components/profile/PlayerProfileModal';

// Audio & Central API
import { playClickSound, playSuccessFanfare } from './utils/audio';
import { api, auth } from './utils/api';
import { 
  INITIAL_PLAYERS, 
  INITIAL_APPLICATIONS, 
  INITIAL_MATCHES, 
  INITIAL_GAMEMODES, 
  INITIAL_LOGS 
} from './server/mockStore';

export default function App() {
  const [siteTitle, setSiteTitle] = useState<string>('MCPE GALAXY TIER SYSTEM');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentRole, setCurrentRole] = useState<StaffRole>('Admin');
  const [currentIgn, setCurrentIgn] = useState<string>('iiiniveddd');

  // Discord OAuth User State - hydrated from the real, httpOnly session cookie
  // set by /api/auth/discord/callback after a real Discord login (see utils/api.ts -> auth.getMe)
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);

  useEffect(() => {
    auth.getMe().then((res: { user: DiscordUser | null }) => {
      if (res?.user) {
        setDiscordUser(res.user);
        setCurrentIgn(res.user.username);
        if (res.user.staffRole) setCurrentRole(res.user.staffRole);
      }
    });

    // Handle the redirect back from Discord (?discord_auth=success|denied|error)
    const params = new URLSearchParams(window.location.search);
    const authResult = params.get('discord_auth');
    if (authResult) {
      if (authResult === 'success') {
        showToast('Connected to Discord!');
      } else if (authResult === 'denied') {
        showToast('Discord authorization was cancelled', 'info');
      } else if (authResult === 'error') {
        showToast('Discord login failed, please try again', 'error');
      }
      params.delete('discord_auth');
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDiscordLogout = () => {
    setDiscordUser(null);
    showToast('Disconnected from Discord', 'info');
  };

  // Data states with immediate fallback data
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [applications, setApplications] = useState<TestApplication[]>(INITIAL_APPLICATIONS);
  const [matches, setMatches] = useState<TestMatch[]>(INITIAL_MATCHES);
  const [gamemodes, setGamemodes] = useState<GamemodeInfo[]>(INITIAL_GAMEMODES);
  const [stats, setStats] = useState<SystemStats | null>({
    totalPlayers: INITIAL_PLAYERS.length,
    testsCompletedThisMonth: INITIAL_MATCHES.length,
    activeTesters: 24,
    promotionRate: 68.4,
    pendingApplications: INITIAL_APPLICATIONS.filter(a => a.status === 'PENDING').length,
    liveMatches: INITIAL_MATCHES.filter(m => m.status === 'IN_PROGRESS').length
  });
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [announcement, setAnnouncementState] = useState({
    id: 'ann_1',
    title: 'GALAXY SEASON 4 TIER EVALUATIONS ARE LIVE!',
    message: 'Official testing queues for Boxing, Nodebuff, and Mace are open. Connect Discord for auto role sync.',
    type: 'PROMOTION',
    active: true
  });

  // UI Modal States
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Fetch initial & updated data from database
  const loadData = async () => {
    try {
      const data = await api.getInitialData();
      if (data) {
        if (data.players) setPlayers(data.players);
        if (data.applications) setApplications(data.applications);
        if (data.matches) setMatches(data.matches);
        if (data.gamemodes) setGamemodes(data.gamemodes);
        if (data.stats) setStats(data.stats);
        if (data.logs) setLogs(data.logs);
        if (data.settings?.siteTitle) {
          setSiteTitle(data.settings.siteTitle);
          document.title = data.settings.siteTitle;
        }
        if (data.announcement) {
          setAnnouncementState({
            id: data.announcement.id || 'ann_1',
            title: data.announcement.title || 'MCPE Galaxy Tier System',
            message: data.announcement.content || data.announcement.message || '',
            type: data.announcement.type || 'PROMOTION',
            active: true
          });
        }
      }
    } catch (err) {
      console.warn('API fetch error:', err);
    }
  };

  useEffect(() => {
    loadData();
    // Real-time polling every 10 seconds for multi-device sync
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateSiteTitle = async (newTitle: string) => {
    setSiteTitle(newTitle);
    document.title = newTitle;
    try {
      await api.updateSettings({ siteTitle: newTitle });
      showToast('Website title updated successfully');
    } catch (err) {
      console.warn('Failed to update site title on server:', err);
      showToast('Website title updated locally', 'info');
    }
  };

  // Handler: Apply for test
  const handleApplyTest = async (appData: Partial<TestApplication>) => {
    try {
      const newApp = await api.submitApplication(appData);
      setApplications(prev => [newApp || (appData as any), ...prev]);
      showToast('Tier application submitted successfully!');
      loadData();
    } catch (err) {
      console.warn('Error applying:', err);
      showToast('Tier application recorded!', 'info');
    }
  };

  // Handler: Update application status
  const handleUpdateApplicationStatus = async (appId: string, status: TestApplication['status'], testerIgn?: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status, assignedTesterIgn: testerIgn || a.assignedTesterIgn } : a));
    try {
      await api.updateApplicationStatus(appId, status, testerIgn || currentIgn);
      showToast(`Application marked as ${status}`);
      loadData();
    } catch (err) {
      console.warn('Error updating application:', err);
      showToast(`Application marked as ${status}`, 'info');
    }
  };

  // Handler: Schedule Match
  const handleScheduleMatch = async (matchData: Partial<TestMatch>) => {
    try {
      const newMatch = await api.createMatch(matchData);
      setMatches(prev => [newMatch || (matchData as any), ...prev]);
      showToast('Evaluation match scheduled!');
      loadData();
    } catch (err) {
      console.warn('Error scheduling match:', err);
      showToast('Evaluation match scheduled locally', 'info');
    }
  };

  // Handler: Submit Match Result
  const handleSubmitResult = async (matchId: string, scorePlayer: number, scoreTester: number, tierResult: TierLevel) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'COMPLETED', scorePlayer, scoreTester, assignedTierResult: tierResult } : m));
    try {
      await api.submitMatchResult(matchId, { scorePlayer, scoreTester, assignedTierResult: tierResult });
      showToast(`Match result recorded: Tier ${tierResult} assigned!`);
      loadData();
    } catch (err) {
      console.warn('Error submitting result:', err);
      showToast(`Match evaluated: Assigned ${tierResult}`, 'info');
    }
  };

  // Handler: Promote player
  const handlePromotePlayer = async (playerIgn: string, newTier: TierLevel) => {
    setPlayers(prev => prev.map(p => p.ign.toLowerCase() === playerIgn.toLowerCase() ? { ...p, overallTier: newTier } : p));
    try {
      await api.promotePlayer(playerIgn, newTier);
      showToast(`Player ${playerIgn} promoted to ${newTier}!`);
      loadData();
    } catch (err) {
      console.warn('Error promoting player:', err);
      showToast(`Player ${playerIgn} updated to ${newTier}`, 'info');
    }
  };

  // Handler: Ban / Unban
  const handleBanPlayer = async (playerIgn: string) => {
    setPlayers(prev => prev.map(p => {
      if (p.ign.toLowerCase() === playerIgn.toLowerCase()) {
        const isBannedNow = !p.isBanned;
        showToast(`Player ${playerIgn} is now ${isBannedNow ? 'BANNED' : 'UNBANNED'}`);
        return { ...p, isBanned: isBannedNow };
      }
      return p;
    }));
    try {
      await api.toggleBanPlayer(playerIgn);
      loadData();
    } catch (err) {
      console.warn('Error toggling ban on server:', err);
    }
  };

  // Handler: Update Role
  const handleUpdateRole = async (playerIgn: string, newRole: StaffRole) => {
    // 1. Optimistically update player state immediately
    setPlayers(prev => prev.map(p => {
      if (p.ign.toLowerCase() === playerIgn.toLowerCase()) {
        return { ...p, staffRole: newRole, rankTitle: newRole };
      }
      return p;
    }));
    showToast(`Role updated for ${playerIgn}: ${newRole}`);

    try {
      const player = players.find(p => p.ign.toLowerCase() === playerIgn.toLowerCase());
      if (player) {
        await api.updatePlayer(player.id, { staffRole: newRole, rankTitle: newRole });
        const currentStaffList = await api.getStaff().catch(() => []);
        const existingStaff = currentStaffList.find((s: any) => s.ign.toLowerCase() === playerIgn.toLowerCase());
        
        if (newRole !== 'Player') {
          if (!existingStaff) {
            await api.createStaff({
              ign: player.ign,
              role: newRole,
              region: player.region,
              avatarUrl: player.avatarUrl,
              status: 'Active'
            }).catch(console.warn);
          } else {
            await api.updateStaff(existingStaff.id, { role: newRole }).catch(console.warn);
          }
        } else if (existingStaff) {
          await api.deleteStaff(existingStaff.id).catch(console.warn);
        }
        loadData();
      }
    } catch (err) {
      console.warn('Error updating role on server:', err);
    }
  };

  // Handler: Update Player Dossier
  const handleUpdatePlayerDossier = async (updatedPlayer: Player) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    setSelectedPlayer(updatedPlayer);
    showToast(`Player profile for ${updatedPlayer.ign} updated`);
    try {
      await api.updatePlayer(updatedPlayer.id, updatedPlayer);
      loadData();
    } catch (err) {
      console.warn('Error updating player dossier on server:', err);
    }
  };

  const handleUpdateAnnouncement = async (ann: any) => {
    setAnnouncementState(ann);
    try {
      await api.createAnnouncement({
        title: ann.title,
        content: ann.message || ann.content,
        type: ann.type,
        urgent: true
      });
      showToast('Announcement updated');
      loadData();
    } catch (err) {
      console.warn('Error updating announcement:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#070314] text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* Dynamic Animated Canvas Background */}
      <BackgroundCanvas />

      {/* Quick Floating Navigation Dots for Home, Leaderboards, Tiers, Admin Panel */}
      <QuickNavDots
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Navigation Bar */}
      <Navbar
        siteTitle={siteTitle}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        discordUser={discordUser}
        onOpenDiscordAuth={() => setIsDiscordModalOpen(true)}
        notifications={notifications}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectPlayer={setSelectedPlayer}
      />

      {/* MAIN VIEW SWITCHER */}
      <main className="relative z-10 pb-20">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            <HeroSection
              siteTitle={siteTitle}
              stats={stats}
              discordUser={discordUser}
              onOpenDiscordAuth={() => setIsDiscordModalOpen(true)}
              onApplyClick={() => setActiveTab('testing')}
              onLeaderboardsClick={() => setActiveTab('leaderboards')}
            />

            <ChampionsPodium
              players={players}
              onSelectPlayer={setSelectedPlayer}
              onViewLeaderboards={() => setActiveTab('leaderboards')}
            />

            <LatestTierTests
              matches={matches}
              onViewMatches={() => setActiveTab('testing')}
            />

            <GamemodesShowcase
              gamemodes={gamemodes}
              onSelectGamemode={(gm) => setActiveTab('leaderboards')}
            />

            <CommunityDiscordCTA />
          </>
        )}

        {/* LEADERBOARDS TAB */}
        {activeTab === 'leaderboards' && (
          <LeaderboardsPage
            players={players}
            gamemodes={gamemodes}
            onSelectPlayer={setSelectedPlayer}
          />
        )}

        {/* TIER TESTING TAB */}
        {activeTab === 'testing' && (
          <TierTestingPage
            applications={applications}
            gamemodes={gamemodes}
            currentRole={currentRole}
            currentIgn={currentIgn}
            onApplyTest={handleApplyTest}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
          />
        )}

        {/* STAFF DASHBOARD TAB */}
        {activeTab === 'staff' && (
          <StaffDashboardPage
            currentRole={currentRole}
            players={players}
            applications={applications}
            logs={logs}
            onPromotePlayer={handlePromotePlayer}
            onBanPlayer={handleBanPlayer}
            onUpdateRole={handleUpdateRole}
          />
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <AnalyticsPage stats={stats || {
            totalPlayers: players.length,
            testsCompletedThisMonth: matches.filter(m => m.status === 'COMPLETED').length,
            activeTesters: 4,
            promotionRate: 68.4,
            pendingApplications: applications.filter(a => a.status === 'PENDING').length,
            liveMatches: matches.filter(m => m.status === 'IN_PROGRESS').length
          }} />
        )}

        {/* ADMIN PANEL TAB */}
        {activeTab === 'admin' && (
          <AdminPanelPage
            siteTitle={siteTitle}
            onUpdateSiteTitle={handleUpdateSiteTitle}
            currentRole={currentRole}
            players={players}
            applications={applications}
            matches={matches}
            gamemodes={gamemodes}
            logs={logs}
            announcement={announcement}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            onUpdatePlayer={handleUpdatePlayerDossier}
            onUpdateRole={handleUpdateRole}
            onBanPlayer={handleBanPlayer}
          />
        )}

      </main>

      {/* Footer */}
      <Footer siteTitle={siteTitle} onSelectTab={setActiveTab} />

      {/* Player Profile Modal Drawer */}
      <PlayerProfileModal
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        currentRole={currentRole}
        onUpdatePlayer={handleUpdatePlayerDossier}
        onApplyRetest={(ign) => {
          setSelectedPlayer(null);
          setActiveTab('testing');
        }}
      />

      {/* Quick Search Cmd+K Modal */}
      <SearchQuickModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        players={players}
        gamemodes={gamemodes}
        onSelectPlayer={setSelectedPlayer}
      />

      {/* Discord OAuth2 Authorization Modal */}
      <DiscordOAuthModal
        isOpen={isDiscordModalOpen}
        onClose={() => setIsDiscordModalOpen(false)}
        currentUser={discordUser}
        onLogout={handleDiscordLogout}
      />

      {/* Floating System Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
          <div className={`px-4 py-3 rounded-xl backdrop-blur-xl border text-sm font-medium shadow-2xl flex items-center gap-3 ${
            toastMessage.type === 'error'
              ? 'bg-red-950/80 border-red-500/50 text-red-200'
              : toastMessage.type === 'info'
              ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200'
              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              toastMessage.type === 'error' ? 'bg-red-400 animate-ping' : toastMessage.type === 'info' ? 'bg-cyan-400' : 'bg-emerald-400'
            }`} />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

    </div>
  );
}
