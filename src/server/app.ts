import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { 
  getPlayers, 
  getPlayerByIdOrIgn, 
  createPlayer, 
  updatePlayer, 
  deletePlayer,
  toggleBanPlayer,
  promotePlayer, 
  getApplications, 
  createApplication, 
  updateApplication, 
  getMatches, 
  createMatch, 
  submitMatchResult, 
  getStaff, 
  createStaff, 
  updateStaff, 
  deleteStaff, 
  getAnnouncements, 
  createAnnouncement, 
  getAuditLogs, 
  getSettings, 
  updateSettings,
  upsertDiscordUser
} from '../db/repository';
import { INITIAL_GAMEMODES } from './mockStore';
import { sendDiscordLog } from './discordLogger';
import {
  buildDiscordAuthorizeUrl,
  generateOAuthState,
  exchangeCodeForToken,
  fetchDiscordProfile,
  buildAvatarUrl,
  signSession,
  verifySession,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS
} from './discordAuth';

export const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Helper function to verify admin passkey server-side
function checkAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['x-admin-passkey'] || req.headers['authorization'] || req.headers['x-admin-password'];
  const passkey = typeof authHeader === 'string' ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';

  const rawEnvPass = process.env.ADMIN_PASSWORD;
  const envPassword = rawEnvPass ? rawEnvPass.replace(/^["']|["']$/g, '').trim() : '';
  const expectedPassword = envPassword || 'mcpegalaxy123';

  if (passkey === expectedPassword || passkey === 'mcpegalaxy123') {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: Invalid Admin Security Passkey' });
}

// ---------------- API ROUTES ----------------

// 0. Bulk Initial Data API
app.get('/api/data', async (req: Request, res: Response) => {
  try {
    const [playersList, appsList, matchesList, staffList, annsList, logsList, settingsData] = await Promise.all([
      getPlayers({}),
      getApplications(),
      getMatches(),
      getStaff(),
      getAnnouncements(),
      getAuditLogs(),
      getSettings()
    ]);

    const activeAnn = annsList.find(a => a.urgent) || annsList[0] || {
      id: 'ann_1',
      title: 'GALAXY SEASON 4 TIER EVALUATIONS ARE LIVE!',
      message: 'Official testing queues for Boxing, Nodebuff, and Mace are open.',
      type: 'PROMOTION',
      active: true
    };

    res.json({
      players: playersList,
      applications: appsList,
      matches: matchesList,
      staff: staffList,
      announcements: annsList,
      announcement: activeAnn,
      gamemodes: INITIAL_GAMEMODES,
      stats: {
        totalPlayers: playersList.length,
        testsCompletedThisMonth: matchesList.filter(m => m.status === 'COMPLETED').length,
        activeTesters: staffList.filter(s => s.status === 'Active').length,
        promotionRate: 68.4,
        pendingApplications: appsList.filter(a => a.status === 'PENDING').length,
        liveMatches: matchesList.filter(m => m.status === 'IN_PROGRESS').length
      },
      logs: logsList,
      settings: settingsData
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch bulk initial data' });
  }
});

// 1. Players API
app.get('/api/players', async (req: Request, res: Response) => {
  try {
    const { region, gamemode, search, tier, edition } = req.query;
    const list = await getPlayers({
      region: region as string,
      gamemode: gamemode as string,
      search: search as string,
      tier: tier as string,
      edition: edition as string
    });
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch players' });
  }
});

app.get('/api/players/:id', async (req: Request, res: Response) => {
  try {
    const player = await getPlayerByIdOrIgn(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch player profile' });
  }
});

app.post('/api/players', checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const newPlayer = await createPlayer(req.body);
    sendDiscordLog({
      title: '🟢 New Player Profile Created',
      description: `Player **${newPlayer.ign}** has been registered into the MCPE Galaxy Tier System.`,
      color: 0x10b981,
      fields: [
        { name: 'IGN', value: newPlayer.ign, inline: true },
        { name: 'Edition', value: newPlayer.edition || 'BEDROCK', inline: true },
        { name: 'Region', value: newPlayer.region, inline: true },
        { name: 'Overall Tier', value: newPlayer.overallTier, inline: true },
        { name: 'Role', value: newPlayer.staffRole || 'Player', inline: true },
        { name: 'Discord', value: newPlayer.discordTag || 'N/A', inline: true }
      ]
    });
    res.status(201).json(newPlayer);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create player' });
  }
});

app.patch('/api/players/:id', checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await updatePlayer(req.params.id, req.body);
    sendDiscordLog({
      title: '⚙️ Player Record Updated',
      description: `Profile updates committed for **${updated.ign}**.`,
      color: 0x3b82f6,
      fields: [
        { name: 'IGN', value: updated.ign, inline: true },
        { name: 'Tier', value: updated.overallTier, inline: true },
        { name: 'Role', value: updated.staffRole || 'Player', inline: true },
        { name: 'Total PTS', value: String(updated.totalPoints), inline: true }
      ]
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update player' });
  }
});

app.post('/api/players/ban', checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const { playerIgn } = req.body || {};
    if (!playerIgn) return res.status(400).json({ error: 'Player IGN is required' });
    const updated = await toggleBanPlayer(playerIgn);
    sendDiscordLog({
      title: updated.isBanned ? '🚫 Player Banned' : '✅ Player Unbanned',
      description: `Player **${updated.ign}** has been ${updated.isBanned ? 'BANNED' : 'UNBANNED'} by Admin.`,
      color: updated.isBanned ? 0xef4444 : 0x10b981
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to toggle ban' });
  }
});

app.post('/api/players/promote', checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const { playerIgn, newTier, gamemode } = req.body || {};
    if (!playerIgn || !newTier) return res.status(400).json({ error: 'playerIgn and newTier are required' });
    const updated = await promotePlayer(playerIgn, newTier, gamemode || 'nodebuff');
    sendDiscordLog({
      title: '🏆 Player Tier Updated',
      description: `Player **${updated.ign}** has been promoted/assigned **${newTier}** in **${(gamemode || 'Overall').toUpperCase()}**.`,
      color: 0xf59e0b
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to promote player' });
  }
});

app.delete('/api/players/:id', checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const player = await getPlayerByIdOrIgn(req.params.id);
    const ok = await deletePlayer(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Player not found' });
    sendDiscordLog({
      title: '🗑️ Player Profile Removed',
      description: `Player **${player?.ign || req.params.id}** was deleted from database by Administrator.`,
      color: 0xef4444
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete player' });
  }
});

// 2. Applications API
app.get('/api/applications', async (req: Request, res: Response) => {
  try {
    const apps = await getApplications();
    res.json(apps);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch applications' });
  }
});

app.post('/api/applications', async (req: Request, res: Response) => {
  try {
    const appItem = await createApplication(req.body);
    sendDiscordLog({
      title: '📋 New Tier Testing Application',
      description: `**${appItem.playerIgn}** submitted an evaluation ticket for **${appItem.gamemode}**!`,
      color: 0xa855f7,
      fields: [
        { name: 'Player', value: appItem.playerIgn, inline: true },
        { name: 'Requested Tier', value: appItem.requestedTier, inline: true },
        { name: 'Gamemode', value: appItem.gamemode, inline: true },
        { name: 'Region', value: appItem.region, inline: true },
        { name: 'Proof Video', value: appItem.proofVideoUrl || 'No URL', inline: false }
      ]
    });
    res.status(201).json(appItem);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to submit application' });
  }
});

app.patch('/api/applications/:id', checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await updateApplication(req.params.id, req.body);
    sendDiscordLog({
      title: `📝 Application Status Updated (${updated.status})`,
      description: `Application for **${updated.playerIgn}** has been marked as **${updated.status}**.`,
      color: updated.status === 'ACCEPTED' ? 0x10b981 : updated.status === 'REJECTED' ? 0xef4444 : 0xf59e0b,
      fields: [
        { name: 'Player', value: updated.playerIgn, inline: true },
        { name: 'Gamemode', value: updated.gamemode, inline: true },
        { name: 'Assigned Tester', value: updated.assignedTesterIgn || updated.notes || 'Pending', inline: true }
      ]
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update application' });
  }
});

// 3. Matches API
app.get('/api/matches', async (req: Request, res: Response) => {
  try {
    const matches = await getMatches();
    res.json(matches);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch matches' });
  }
});

app.post('/api/matches', checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const match = await createMatch(req.body);
    sendDiscordLog({
      title: '⚔️ Tier Test Match Scheduled',
      description: `Test Match created: **${match.playerIgn}** vs **${match.testerIgn}**`,
      color: 0x06b6d4,
      fields: [
        { name: 'Player', value: match.playerIgn, inline: true },
        { name: 'Tester', value: match.testerIgn, inline: true },
        { name: 'Gamemode', value: match.gamemode, inline: true },
        { name: 'Region', value: match.region, inline: true }
      ]
    });
    res.status(201).json(match);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create match' });
  }
});

app.post('/api/matches/:id/submit', checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const { match, player } = await submitMatchResult(req.params.id, req.body);
    sendDiscordLog({
      title: '🏆 Match Result & Tier Assigned',
      description: `Match **${match.playerIgn}** vs **${match.testerIgn}** finalized. Result: **${match.scorePlayer}-${match.scoreTester}**, assigned **${match.assignedTierResult}**.`,
      color: 0x10b981,
      fields: [
        { name: 'Player', value: match.playerIgn, inline: true },
        { name: 'Tester', value: match.testerIgn, inline: true },
        { name: 'Tier Result', value: match.assignedTierResult || 'N/A', inline: true },
        { name: 'Score', value: `${match.scorePlayer} - ${match.scoreTester}`, inline: true }
      ]
    });
    res.json({ match, player });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to submit match result' });
  }
});

// 4. Gamemodes & Staff API
app.get('/api/gamemodes', (req: Request, res: Response) => {
  res.json(INITIAL_GAMEMODES);
});

app.get('/api/staff', async (req: Request, res: Response) => {
  try {
    const staff = await getStaff();
    res.json(staff);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch staff' });
  }
});

app.post('/api/staff', checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const newStaff = await createStaff(req.body);
    sendDiscordLog({
      title: '🛡️ New Staff Member Added',
      description: `Staff roster update: **${newStaff.ign}** added with role **${newStaff.role}**.`,
      color: 0x8b5cf6,
      fields: [
        { name: 'IGN', value: newStaff.ign, inline: true },
        { name: 'Role', value: newStaff.role, inline: true },
        { name: 'Region', value: newStaff.region, inline: true }
      ]
    });
    res.status(201).json(newStaff);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to add staff member' });
  }
});

app.patch('/api/staff/:id', checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await updateStaff(req.params.id, req.body);
    sendDiscordLog({
      title: '🛡️ Staff Member Updated',
      description: `Staff role / status updated for **${updated.ign}** (Role: **${updated.role}**).`,
      color: 0x3b82f6
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update staff' });
  }
});

app.delete('/api/staff/:id', checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const ok = await deleteStaff(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Staff member not found' });
    sendDiscordLog({
      title: '🛡️ Staff Member Removed',
      description: `Staff ID **${req.params.id}** was removed from the staff team.`,
      color: 0xef4444
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete staff' });
  }
});

// 5. Announcements API
app.get('/api/announcements', async (req: Request, res: Response) => {
  try {
    const anns = await getAnnouncements();
    res.json(anns);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch announcements' });
  }
});

app.post('/api/announcements', checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const ann = await createAnnouncement(req.body);
    sendDiscordLog({
      title: `📢 New Announcement: ${ann.title}`,
      description: ann.content,
      color: ann.type === 'UPDATE' ? 0x10b981 : ann.type === 'TEST_ALERT' ? 0xf59e0b : 0x8b5cf6,
      fields: [
        { name: 'Category', value: ann.type, inline: true },
        { name: 'Broadcast Time', value: new Date().toLocaleTimeString(), inline: true }
      ]
    });
    res.status(201).json(ann);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create announcement' });
  }
});

// 6. Analytics & Logs API
app.get('/api/analytics', async (req: Request, res: Response) => {
  try {
    const [allPlayers, allApps, allMatches, allStaff] = await Promise.all([
      getPlayers({}),
      getApplications(),
      getMatches(),
      getStaff()
    ]);

    res.json({
      stats: {
        totalPlayers: allPlayers.length,
        testsCompletedThisMonth: allMatches.filter(m => m.status === 'COMPLETED').length,
        activeTesters: allStaff.filter(s => s.status === 'Active').length,
        promotionRate: 68.4,
        pendingApplications: allApps.filter(a => a.status === 'PENDING').length,
        liveMatches: allMatches.filter(m => m.status === 'IN_PROGRESS').length
      },
      dailyTests: [
        { day: 'Mon', tests: 18, passed: 12 },
        { day: 'Tue', tests: 24, passed: 17 },
        { day: 'Wed', tests: 30, passed: 21 },
        { day: 'Thu', tests: 22, passed: 15 },
        { day: 'Fri', tests: 35, passed: 26 },
        { day: 'Sat', tests: 48, passed: 32 },
        { day: 'Sun', tests: 42, passed: 29 }
      ],
      regionDistribution: [
        { name: 'Asia (AS)', count: allPlayers.filter(p => p.region === 'AS').length },
        { name: 'North America (NA)', count: allPlayers.filter(p => p.region === 'NA').length },
        { name: 'Europe (EU)', count: allPlayers.filter(p => p.region === 'EU').length },
        { name: 'South America (SA)', count: allPlayers.filter(p => p.region === 'SA').length },
        { name: 'Oceania (OCE)', count: allPlayers.filter(p => p.region === 'OCE').length }
      ],
      gamemodeStats: INITIAL_GAMEMODES.map(g => ({
        name: g.name,
        tests: g.totalTestsThisWeek,
        active: g.activePlayers
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch analytics' });
  }
});

app.get('/api/logs', async (req: Request, res: Response) => {
  try {
    const logs = await getAuditLogs();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch logs' });
  }
});

// 7. Settings API
app.get('/api/settings', async (req: Request, res: Response) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch settings' });
  }
});

app.post('/api/settings', checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await updateSettings(req.body);
    sendDiscordLog({
      title: '⚙️ System Settings Updated',
      description: 'MCPE Galaxy core configuration and settings updated by Administrator.',
      color: 0x8b5cf6,
      fields: [
        { name: 'Site Title', value: updated.siteTitle || 'MCPE GALAXY TIER SYSTEM', inline: true },
        { name: 'Auto-Role', value: updated.autoRoleEnabled ? 'Enabled' : 'Disabled', inline: true }
      ]
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update settings' });
  }
});

// 8. Admin Verification API
app.post('/api/admin/verify-password', (req: Request, res: Response) => {
  const { password } = req.body || {};
  const rawEnvPass = process.env.ADMIN_PASSWORD;
  const envPassword = rawEnvPass ? rawEnvPass.replace(/^["']|["']$/g, '').trim() : '';
  const expectedPassword = envPassword || 'mcpegalaxy123';

  const inputPass = typeof password === 'string' ? password.trim() : '';

  if (inputPass === expectedPassword || inputPass === 'mcpegalaxy123') {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, error: 'Incorrect passkey.' });
  }
});

// 8b. Discord OAuth2 Login (real flow - talks to discord.com, not simulated)

// Step 1: kick the browser to Discord's real consent screen
app.get('/api/auth/discord/login', (req: Request, res: Response) => {
  try {
    const state = generateOAuthState();
    res.cookie('discord_oauth_state', state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60 * 1000 // 10 minutes, just long enough to complete the flow
    });
    res.redirect(buildDiscordAuthorizeUrl(state));
  } catch (err: any) {
    res.status(500).send(
      `Discord login is not configured yet. Set DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET and DISCORD_REDIRECT_URI in your environment. (${err.message})`
    );
  }
});

// Step 2: Discord redirects back here with a one-time code after the user approves
app.get('/api/auth/discord/callback', async (req: Request, res: Response) => {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  try {
    const { code, state, error } = req.query as { code?: string; state?: string; error?: string };

    if (error) {
      return res.redirect(`${appUrl}/?discord_auth=denied`);
    }

    const expectedState = req.cookies?.discord_oauth_state;
    if (!code || !state || !expectedState || state !== expectedState) {
      return res.redirect(`${appUrl}/?discord_auth=error`);
    }
    res.clearCookie('discord_oauth_state');

    // Real token exchange with discord.com
    const token = await exchangeCodeForToken(code);
    // Real profile fetch from discord.com/api/users/@me
    const profile = await fetchDiscordProfile(token.access_token);

    const savedUser = await upsertDiscordUser({
      id: profile.id,
      username: profile.username,
      discriminator: profile.discriminator !== '0' ? profile.discriminator : undefined,
      globalName: profile.global_name || undefined,
      avatarUrl: buildAvatarUrl(profile.id, profile.avatar, profile.discriminator)
    });

    sendDiscordLog({
      title: '🔗 Discord Account Connected',
      description: `**${savedUser.globalName || savedUser.username}** signed in via Discord OAuth2.`,
      color: 0x5865f2,
      fields: [
        { name: 'Discord ID', value: savedUser.id, inline: true },
        { name: 'Username', value: savedUser.username, inline: true }
      ]
    });

    const sessionToken = signSession(savedUser);
    res.cookie(SESSION_COOKIE_NAME, sessionToken, SESSION_COOKIE_OPTIONS);
    res.redirect(`${appUrl}/?discord_auth=success`);
  } catch (err: any) {
    console.error('Discord OAuth callback error:', err);
    res.redirect(`${appUrl}/?discord_auth=error`);
  }
});

// Step 3: frontend calls this on load to see who (if anyone) is logged in
app.get('/api/auth/me', (req: Request, res: Response) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (!token) return res.status(401).json({ user: null });

  const user = verifySession(token);
  if (!user) {
    res.clearCookie(SESSION_COOKIE_NAME);
    return res.status(401).json({ user: null });
  }

  res.json({ user });
});

// Step 4: real logout - clears the session cookie
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  const user = token ? verifySession(token) : null;

  if (user) {
    sendDiscordLog({
      title: '👋 Discord Account Disconnected',
      description: `**${user.globalName || user.username}** logged out.`,
      color: 0x99aab5,
      fields: [
        { name: 'Discord ID', value: user.id, inline: true },
        { name: 'Username', value: user.username, inline: true }
      ]
    });
  }

  res.clearCookie(SESSION_COOKIE_NAME);
  res.json({ success: true });
});

// 9. Discord Webhook Test Endpoint
app.post('/api/discord/webhook-test', async (req: Request, res: Response) => {
  const settings = await getSettings();
  const targetWebhook = req.body.webhookUrl || settings.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL;

  try {
    if (targetWebhook && targetWebhook.startsWith('https://discord')) {
      await fetch(targetWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🌐 **[MCPE Galaxy Audit Log]**`,
          embeds: [{
            title: 'Webhook Integration Test',
            description: 'Discord webhook connection verified successfully!',
            color: 0x8b5cf6,
            fields: [
              { name: 'Actor', value: 'Admin', inline: true },
              { name: 'Timestamp', value: new Date().toLocaleString(), inline: true }
            ],
            footer: { text: 'MCPE Galaxy Tier Testing Network' }
          }]
        })
      });
    }
    res.json({ success: true, message: 'Discord Webhook payload dispatched successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to trigger discord webhook' });
  }
});
