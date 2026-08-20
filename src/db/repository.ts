import { db, initializeDatabase } from './index.js';
import { 
  players, 
  tierHistory, 
  matchHistory, 
  testerNotes, 
  tierApplications, 
  testMatches, 
  staffMembers, 
  announcements, 
  auditLogs, 
  systemSettings,
  discordUsers
} from './schema.js';
import { eq, desc, and, like, or } from 'drizzle-orm';
import { 
  Player, 
  TierApplication, 
  TestMatch, 
  StaffMember, 
  Announcement, 
  AuditLog,
  GamemodeInfo,
  Region,
  GamemodeId,
  TierLevel,
  StaffRole,
  MinecraftEdition,
  DiscordUser
} from '../types/index.js';
import { 
  INITIAL_PLAYERS, 
  INITIAL_APPLICATIONS, 
  INITIAL_MATCHES, 
  INITIAL_STAFF, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_LOGS,
  INITIAL_GAMEMODES 
} from '../server/mockStore.js';

// In-memory fallback stores if PostgreSQL database is not connected
let memoryPlayers: Player[] = [...INITIAL_PLAYERS];
let memoryApplications: TierApplication[] = [...INITIAL_APPLICATIONS];
let memoryMatches: TestMatch[] = [...INITIAL_MATCHES];
let memoryStaff: StaffMember[] = [...INITIAL_STAFF];
let memoryAnnouncements: Announcement[] = [...INITIAL_ANNOUNCEMENTS];
let memoryLogs: AuditLog[] = [...INITIAL_LOGS];
let memorySettings = {
  siteTitle: 'MCPE GALAXY TIER SYSTEM',
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
  autoRoleEnabled: true
};

async function ensureDb() {
  if (db) {
    await initializeDatabase();
  }
}

// ---------------- PLAYERS REPOSITORY ----------------

export async function getPlayers(filters: { region?: string; gamemode?: string; search?: string; tier?: string; edition?: string }): Promise<Player[]> {
  await ensureDb();
  if (db) {
    try {
      let query = db.select().from(players);
      const raw = await query;
      
      const allHistories = await db.select().from(tierHistory);
      const allMatches = await db.select().from(matchHistory);
      const allNotes = await db.select().from(testerNotes);

      let result: Player[] = raw.map(p => ({
        id: p.id,
        ign: p.ign,
        uuid: p.uuid,
        avatarUrl: p.avatarUrl || `https://mc-heads.net/avatar/${p.ign}/128`,
        discordTag: p.discordTag || `${p.ign}#0000`,
        region: p.region as Region,
        edition: ((p as any).edition || 'BEDROCK') as MinecraftEdition,
        staffRole: ((p as any).staffRole || 'Player') as StaffRole,
        overallTier: p.overallTier as TierLevel,
        totalPoints: p.totalPoints,
        winRate: p.winRate,
        matchesPlayed: p.matchesPlayed,
        matchesWon: p.matchesWon,
        gamemodeTiers: (p.gamemodeTiers || {}) as Record<string, TierLevel>,
        tierHistory: allHistories.filter(h => h.playerId === p.id).map(h => ({
          id: h.id,
          date: h.date,
          gamemode: h.gamemode as GamemodeId,
          oldTier: h.oldTier as TierLevel,
          newTier: h.newTier as TierLevel,
          reason: h.reason || '',
          testerIgn: h.testerIgn || ''
        })),
        matchHistory: allMatches.filter(m => m.playerId === p.id).map(m => ({
          id: m.id,
          date: m.date,
          gamemode: m.gamemode as GamemodeId,
          opponentIgn: m.opponentIgn,
          score: m.score,
          result: m.result as 'WIN' | 'LOSS' | 'DRAW',
          tierChange: m.tierChange || '',
          proofUrl: m.proofUrl || '',
          testerIgn: m.testerIgn || ''
        })),
        testerNotes: allNotes.filter(n => n.playerId === p.id).map(n => ({
          id: n.id,
          authorIgn: n.authorIgn,
          authorRole: n.authorRole as StaffRole,
          date: n.date,
          text: n.text,
          category: n.category as any
        })),
        bio: p.bio || '',
        joinedDate: p.joinedDate,
        isBanned: p.isBanned,
        status: p.status as any,
        rankTitle: p.rankTitle || undefined,
        socials: p.socials || undefined
      }));

      if (filters.edition && filters.edition !== 'ALL') {
        result = result.filter(p => p.edition === filters.edition);
      }
      if (filters.region && filters.region !== 'GLOBAL') {
        result = result.filter(p => p.region === filters.region);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(p => p.ign.toLowerCase().includes(q) || (p.discordTag && p.discordTag.toLowerCase().includes(q)));
      }
      if (filters.tier && filters.tier !== 'ALL') {
        result = result.filter(p => p.overallTier === filters.tier);
      }
      if (filters.gamemode && filters.gamemode !== 'overall') {
        const gmKey = filters.gamemode;
        const tierRank: Record<string, number> = { HT1: 1, LT1: 2, HT2: 3, LT2: 4, HT3: 5, LT3: 6, HT4: 7, LT4: 8, HT5: 9, LT5: 10, UNRANKED: 99 };
        result.sort((a, b) => {
          const rankA = tierRank[a.gamemodeTiers[gmKey] || 'UNRANKED'];
          const rankB = tierRank[b.gamemodeTiers[gmKey] || 'UNRANKED'];
          return rankA - rankB;
        });
      } else {
        result.sort((a, b) => b.totalPoints - a.totalPoints);
      }

      // Strictly limit to Top 20 ranked players
      return result.slice(0, 20);
    } catch (err) {
      console.error('Database query failed for getPlayers, falling back:', err);
    }
  }

  // Fallback in-memory query
  let res = [...memoryPlayers];
  if (filters.edition && filters.edition !== 'ALL') {
    res = res.filter(p => p.edition === filters.edition);
  }
  if (filters.region && filters.region !== 'GLOBAL') {
    res = res.filter(p => p.region === filters.region);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    res = res.filter(p => p.ign.toLowerCase().includes(q) || (p.discordTag && p.discordTag.toLowerCase().includes(q)));
  }
  if (filters.tier && filters.tier !== 'ALL') {
    res = res.filter(p => p.overallTier === filters.tier);
  }
  if (filters.gamemode && filters.gamemode !== 'overall') {
    const gmKey = filters.gamemode;
    const tierRank: Record<string, number> = { HT1: 1, LT1: 2, HT2: 3, LT2: 4, HT3: 5, LT3: 6, HT4: 7, LT4: 8, HT5: 9, LT5: 10, UNRANKED: 99 };
    res.sort((a, b) => {
      const rankA = tierRank[a.gamemodeTiers[gmKey] || 'UNRANKED'];
      const rankB = tierRank[b.gamemodeTiers[gmKey] || 'UNRANKED'];
      return rankA - rankB;
    });
  } else {
    res.sort((a, b) => b.totalPoints - a.totalPoints);
  }
  // Strictly limit to Top 20 ranked players
  return res.slice(0, 20);
}

export async function getPlayerByIdOrIgn(identifier: string): Promise<Player | null> {
  const all = await getPlayers({});
  return all.find(p => p.id === identifier || p.ign.toLowerCase() === identifier.toLowerCase()) || null;
}

export async function createPlayer(data: Partial<Player>): Promise<Player> {
  await ensureDb();
  const ign = (data.ign || '').trim();
  if (!ign) throw new Error('Player IGN is required.');

  const newId = `p_${Date.now()}`;
  const newPlayer: Player = {
    id: newId,
    ign,
    uuid: data.uuid || `${Date.now()}-uuid`,
    avatarUrl: data.avatarUrl || (data.edition === 'JAVA' ? `https://crafatar.com/avatars/${ign}?overlay=true` : `https://mc-heads.net/avatar/${ign}/128`),
    discordTag: data.discordTag || `${ign}#0000`,
    region: data.region || 'NA',
    edition: data.edition || 'BEDROCK',
    staffRole: data.staffRole || 'Player',
    overallTier: data.overallTier || 'UNRANKED',
    totalPoints: data.totalPoints || 1000,
    winRate: data.winRate || 0,
    matchesPlayed: data.matchesPlayed || 0,
    matchesWon: data.matchesWon || 0,
    gamemodeTiers: data.gamemodeTiers || {},
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: data.bio || 'New MCPE Galaxy competitor',
    joinedDate: new Date().toISOString().split('T')[0],
    isBanned: false,
    status: 'Online',
    rankTitle: data.rankTitle,
    socials: data.socials
  };

  if (db) {
    try {
      await db.insert(players).values({
        id: newPlayer.id,
        ign: newPlayer.ign,
        uuid: newPlayer.uuid,
        avatarUrl: newPlayer.avatarUrl,
        discordTag: newPlayer.discordTag,
        region: newPlayer.region,
        edition: newPlayer.edition,
        staffRole: newPlayer.staffRole,
        overallTier: newPlayer.overallTier,
        totalPoints: newPlayer.totalPoints,
        winRate: newPlayer.winRate,
        matchesPlayed: newPlayer.matchesPlayed,
        matchesWon: newPlayer.matchesWon,
        gamemodeTiers: newPlayer.gamemodeTiers,
        bio: newPlayer.bio,
        joinedDate: newPlayer.joinedDate,
        isBanned: newPlayer.isBanned,
        status: newPlayer.status,
        rankTitle: newPlayer.rankTitle,
        socials: newPlayer.socials
      });

      await createAuditLog({
        actor: 'Admin',
        action: 'CREATE_PLAYER',
        details: `Created new player profile for ${ign}`,
        type: 'SYSTEM'
      });

      return newPlayer;
    } catch (err) {
      console.error('Error inserting player into DB:', err);
      throw err;
    }
  }

  memoryPlayers.unshift(newPlayer);
  await createAuditLog({
    actor: 'Admin',
    action: 'CREATE_PLAYER',
    details: `Created new player profile for ${ign}`,
    type: 'SYSTEM'
  });
  return newPlayer;
}

export async function updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
  await ensureDb();
  const existing = await getPlayerByIdOrIgn(id);
  if (!existing) throw new Error('Player not found.');

  const updatedPlayer: Player = {
    ...existing,
    ...updates,
    gamemodeTiers: updates.gamemodeTiers ? { ...existing.gamemodeTiers, ...updates.gamemodeTiers } : existing.gamemodeTiers
  };

  if (db) {
    try {
      await db.update(players)
        .set({
          ign: updatedPlayer.ign,
          uuid: updatedPlayer.uuid,
          avatarUrl: updatedPlayer.avatarUrl,
          discordTag: updatedPlayer.discordTag,
          region: updatedPlayer.region,
          edition: updatedPlayer.edition,
          staffRole: updatedPlayer.staffRole,
          overallTier: updatedPlayer.overallTier,
          totalPoints: updatedPlayer.totalPoints,
          winRate: updatedPlayer.winRate,
          matchesPlayed: updatedPlayer.matchesPlayed,
          matchesWon: updatedPlayer.matchesWon,
          gamemodeTiers: updatedPlayer.gamemodeTiers,
          bio: updatedPlayer.bio,
          isBanned: updatedPlayer.isBanned,
          status: updatedPlayer.status,
          rankTitle: updatedPlayer.rankTitle,
          socials: updatedPlayer.socials,
          updatedAt: new Date()
        })
        .where(eq(players.id, existing.id));

      await createAuditLog({
        actor: updates.rankTitle || 'Admin',
        action: 'UPDATE_PLAYER',
        details: `Updated player data & tiers for ${updatedPlayer.ign}`,
        type: 'ROLE_CHANGE'
      });

      return updatedPlayer;
    } catch (err) {
      console.error('Error updating player in DB:', err);
      throw err;
    }
  }

  const idx = memoryPlayers.findIndex(p => p.id === existing.id);
  if (idx !== -1) memoryPlayers[idx] = updatedPlayer;

  await createAuditLog({
    actor: 'Admin',
    action: 'UPDATE_PLAYER',
    details: `Updated player data & tiers for ${updatedPlayer.ign}`,
    type: 'ROLE_CHANGE'
  });

  return updatedPlayer;
}

export async function deletePlayer(id: string): Promise<boolean> {
  await ensureDb();
  const existing = await getPlayerByIdOrIgn(id);
  if (!existing) return false;

  if (db) {
    try {
      await db.delete(players).where(eq(players.id, existing.id));
      await createAuditLog({
        actor: 'Admin',
        action: 'DELETE_PLAYER',
        details: `Deleted player profile for ${existing.ign}`,
        type: 'SYSTEM'
      });
      return true;
    } catch (err) {
      console.error('Error deleting player from DB:', err);
    }
  }

  memoryPlayers = memoryPlayers.filter(p => p.id !== existing.id);
  await createAuditLog({
    actor: 'Admin',
    action: 'DELETE_PLAYER',
    details: `Deleted player profile for ${existing.ign}`,
    type: 'SYSTEM'
  });
  return true;
}

export async function toggleBanPlayer(playerIgn: string): Promise<Player> {
  await ensureDb();
  const existing = await getPlayerByIdOrIgn(playerIgn);
  if (!existing) throw new Error(`Player ${playerIgn} not found.`);

  const newBanStatus = !existing.isBanned;
  const updated = await updatePlayer(existing.id, { isBanned: newBanStatus });

  await createAuditLog({
    actor: 'Admin',
    action: newBanStatus ? 'BAN_PLAYER' : 'UNBAN_PLAYER',
    details: `${newBanStatus ? 'Banned' : 'Unbanned'} player ${existing.ign}`,
    type: 'ROLE_CHANGE'
  });

  return updated;
}

export async function promotePlayer(playerIgn: string, newTier: TierLevel, gamemode: string = 'nodebuff'): Promise<Player> {
  await ensureDb();
  const existing = await getPlayerByIdOrIgn(playerIgn);
  if (!existing) throw new Error(`Player ${playerIgn} not found.`);

  const oldTier = existing.overallTier;
  const newGamemodeTiers = { ...existing.gamemodeTiers, [gamemode]: newTier };
  
  const updated = await updatePlayer(existing.id, {
    overallTier: newTier,
    gamemodeTiers: newGamemodeTiers as any
  });

  await createAuditLog({
    actor: 'Admin',
    action: 'PROMOTE_PLAYER',
    details: `Manually promoted ${existing.ign} from ${oldTier} to ${newTier} in ${gamemode.toUpperCase()}`,
    type: 'TIER_CHANGE'
  });

  return updated;
}

// ---------------- APPLICATIONS REPOSITORY ----------------

export async function getApplications(): Promise<TierApplication[]> {
  await ensureDb();
  if (db) {
    try {
      const rows = await db.select().from(tierApplications).orderBy(desc(tierApplications.createdAt));
      return rows.map(r => ({
        id: r.id,
        playerId: r.playerId || undefined,
        playerIgn: r.playerIgn,
        region: r.region as Region,
        edition: ((r as any).edition || 'BEDROCK') as MinecraftEdition,
        gamemode: r.gamemode as GamemodeId,
        requestedTier: r.requestedTier as TierLevel,
        proofVideoUrl: r.proofVideoUrl,
        discordTag: r.discordTag,
        cpsAverage: r.cpsAverage,
        deviceType: r.deviceType as any,
        submittedAt: r.submittedAt,
        status: r.status as any,
        assignedTesterIgn: r.assignedTesterIgn || undefined,
        notes: r.notes || undefined
      }));
    } catch (err) {
      console.error('Error getting applications from DB:', err);
    }
  }
  return memoryApplications;
}

export async function createApplication(data: Partial<TierApplication>): Promise<TierApplication> {
  await ensureDb();
  const playerIgn = (data.playerIgn || '').trim();
  if (!playerIgn) throw new Error('Player IGN is required for application.');

  let player = await getPlayerByIdOrIgn(playerIgn);
  if (!player) {
    player = await createPlayer({ ign: playerIgn, discordTag: data.discordTag, region: data.region, edition: data.edition || 'BEDROCK' });
  }

  const appItem: TierApplication = {
    id: `app_${Date.now()}`,
    playerId: player.id,
    playerIgn: player.ign,
    region: data.region || 'NA',
    edition: data.edition || player.edition || 'BEDROCK',
    gamemode: data.gamemode || 'nodebuff',
    requestedTier: data.requestedTier || 'HT3',
    proofVideoUrl: data.proofVideoUrl || 'https://youtube.com',
    discordTag: data.discordTag || `${player.ign}#0000`,
    cpsAverage: Number(data.cpsAverage) || 12,
    deviceType: data.deviceType || 'Windows (KBM)',
    submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'PENDING',
    notes: 'Awaiting tester assignment.'
  };

  if (db) {
    try {
      await db.insert(tierApplications).values({
        id: appItem.id,
        playerId: appItem.playerId,
        playerIgn: appItem.playerIgn,
        region: appItem.region,
        edition: appItem.edition,
        gamemode: appItem.gamemode,
        requestedTier: appItem.requestedTier,
        proofVideoUrl: appItem.proofVideoUrl,
        discordTag: appItem.discordTag,
        cpsAverage: appItem.cpsAverage,
        deviceType: appItem.deviceType,
        submittedAt: appItem.submittedAt,
        status: appItem.status,
        notes: appItem.notes
      });

      await createAuditLog({
        actor: appItem.playerIgn,
        action: 'SUBMIT_APPLICATION',
        details: `Submitted tier application for ${appItem.gamemode} (${appItem.requestedTier})`,
        type: 'APPLICATION'
      });

      return appItem;
    } catch (err) {
      console.error('Error creating application in DB:', err);
    }
  }

  memoryApplications.unshift(appItem);
  await createAuditLog({
    actor: appItem.playerIgn,
    action: 'SUBMIT_APPLICATION',
    details: `Submitted tier application for ${appItem.gamemode} (${appItem.requestedTier})`,
    type: 'APPLICATION'
  });

  return appItem;
}

export async function updateApplication(id: string, updates: Partial<TierApplication>): Promise<TierApplication> {
  await ensureDb();
  const allApps = await getApplications();
  const existing = allApps.find(a => a.id === id);
  if (!existing) throw new Error('Application not found.');

  const updated: TierApplication = { ...existing, ...updates };

  if (db) {
    try {
      await db.update(tierApplications)
        .set({
          status: updated.status,
          assignedTesterIgn: updated.assignedTesterIgn || null,
          notes: updated.notes || null
        })
        .where(eq(tierApplications.id, id));

      if (updates.status === 'ACCEPTED' || updates.status === 'TESTING') {
        const allMatches = await getMatches();
        const existingMatch = allMatches.find(m => m.applicationId === id);
        if (!existingMatch) {
          await createMatch({
            applicationId: id,
            playerIgn: updated.playerIgn,
            testerIgn: updated.assignedTesterIgn || 'Unassigned',
            edition: updated.edition || 'BEDROCK',
            gamemode: updated.gamemode,
            region: updated.region,
            status: 'SCHEDULED',
            scheduledTime: new Date(Date.now() + 3600000).toISOString().replace('T', ' ').substring(0, 16),
            scorePlayer: 0,
            scoreTester: 0,
            proofUrl: updated.proofVideoUrl
          });
        }
      }

      return updated;
    } catch (err) {
      console.error('Error updating application in DB:', err);
    }
  }

  const idx = memoryApplications.findIndex(a => a.id === id);
  if (idx !== -1) memoryApplications[idx] = updated;

  if (updates.status === 'ACCEPTED' || updates.status === 'TESTING') {
    const existingMatch = memoryMatches.find(m => m.applicationId === id);
    if (!existingMatch) {
      memoryMatches.unshift({
        id: `m_${Date.now()}`,
        applicationId: id,
        playerIgn: updated.playerIgn,
        testerIgn: updated.assignedTesterIgn || 'Unassigned',
        edition: updated.edition || 'BEDROCK',
        gamemode: updated.gamemode,
        region: updated.region,
        status: 'SCHEDULED',
        scheduledTime: new Date(Date.now() + 3600000).toISOString().replace('T', ' ').substring(0, 16),
        scorePlayer: 0,
        scoreTester: 0,
        proofUrl: updated.proofVideoUrl
      });
    }
  }

  return updated;
}

// ---------------- MATCHES REPOSITORY ----------------

export async function getMatches(): Promise<TestMatch[]> {
  await ensureDb();
  if (db) {
    try {
      const rows = await db.select().from(testMatches).orderBy(desc(testMatches.createdAt));
      return rows.map(r => ({
        id: r.id,
        applicationId: r.applicationId || undefined,
        playerIgn: r.playerIgn,
        testerIgn: r.testerIgn,
        edition: ((r as any).edition || 'BEDROCK') as MinecraftEdition,
        gamemode: r.gamemode as GamemodeId,
        region: r.region as Region,
        status: r.status as any,
        scheduledTime: r.scheduledTime,
        scorePlayer: r.scorePlayer,
        scoreTester: r.scoreTester,
        assignedTierResult: (r.assignedTierResult || undefined) as TierLevel | undefined,
        detailedRatings: r.detailedRatings ? {
          aim: (r.detailedRatings as any).aim || 0,
          movement: (r.detailedRatings as any).movement || 0,
          gamesense: (r.detailedRatings as any).gamesense || 0,
          mechanics: (r.detailedRatings as any).mechanics || 0,
          cps: (r.detailedRatings as any).cps || 0
        } : undefined,
        proofUrl: r.proofUrl || undefined,
        notes: r.notes || undefined
      }));
    } catch (err) {
      console.error('Error fetching matches from DB:', err);
    }
  }
  return memoryMatches;
}

export async function createMatch(data: Partial<TestMatch>): Promise<TestMatch> {
  await ensureDb();
  const matchItem: TestMatch = {
    id: `m_${Date.now()}`,
    applicationId: data.applicationId,
    playerIgn: data.playerIgn || 'Unknown',
    testerIgn: data.testerIgn || 'Unassigned',
    edition: data.edition || 'BEDROCK',
    gamemode: data.gamemode || 'nodebuff',
    region: data.region || 'NA',
    status: data.status || 'SCHEDULED',
    scheduledTime: data.scheduledTime || new Date().toISOString().replace('T', ' ').substring(0, 16),
    scorePlayer: data.scorePlayer || 0,
    scoreTester: data.scoreTester || 0,
    proofUrl: data.proofUrl,
    notes: data.notes
  };

  if (db) {
    try {
      await db.insert(testMatches).values({
        id: matchItem.id,
        applicationId: matchItem.applicationId,
        playerIgn: matchItem.playerIgn,
        testerIgn: matchItem.testerIgn,
        gamemode: matchItem.gamemode,
        region: matchItem.region,
        status: matchItem.status,
        scheduledTime: matchItem.scheduledTime,
        scorePlayer: matchItem.scorePlayer,
        scoreTester: matchItem.scoreTester,
        proofUrl: matchItem.proofUrl,
        notes: matchItem.notes
      });
      return matchItem;
    } catch (err) {
      console.error('Error creating match in DB:', err);
    }
  }

  memoryMatches.unshift(matchItem);
  return matchItem;
}

export async function submitMatchResult(matchId: string, resultData: {
  scorePlayer: number;
  scoreTester: number;
  assignedTierResult: string;
  notes?: string;
  proofUrl?: string;
  detailedRatings?: any;
  actorIgn?: string;
}): Promise<{ match: TestMatch; player: Player | null }> {
  await ensureDb();
  const matchesList = await getMatches();
  const match = matchesList.find(m => m.id === matchId);
  if (!match) throw new Error('Match not found.');

  const updatedMatch: TestMatch = {
    ...match,
    status: 'COMPLETED',
    scorePlayer: resultData.scorePlayer,
    scoreTester: resultData.scoreTester,
    assignedTierResult: resultData.assignedTierResult as TierLevel,
    notes: resultData.notes,
    proofUrl: resultData.proofUrl || match.proofUrl,
    detailedRatings: resultData.detailedRatings
  };

  // 1. Update Match in DB
  if (db) {
    try {
      await db.update(testMatches)
        .set({
          status: 'COMPLETED',
          scorePlayer: resultData.scorePlayer,
          scoreTester: resultData.scoreTester,
          assignedTierResult: resultData.assignedTierResult,
          notes: resultData.notes || null,
          proofUrl: updatedMatch.proofUrl || null,
          detailedRatings: resultData.detailedRatings || null
        })
        .where(eq(testMatches.id, matchId));

      if (match.applicationId) {
        await db.update(tierApplications)
          .set({ status: 'COMPLETED' })
          .where(eq(tierApplications.id, match.applicationId));
      }
    } catch (err) {
      console.error('Error updating match in DB:', err);
    }
  } else {
    const idx = memoryMatches.findIndex(m => m.id === matchId);
    if (idx !== -1) memoryMatches[idx] = updatedMatch;

    if (match.applicationId) {
      const appIdx = memoryApplications.findIndex(a => a.id === match.applicationId);
      if (appIdx !== -1) memoryApplications[appIdx].status = 'COMPLETED';
    }
  }

  // 2. Update Player Profile & Tier History
  let player = await getPlayerByIdOrIgn(match.playerIgn);
  if (player) {
    const oldTier = player.gamemodeTiers[match.gamemode] || 'UNRANKED';
    const newGamemodeTiers = { ...player.gamemodeTiers, [match.gamemode]: resultData.assignedTierResult };
    
    const isWin = resultData.scorePlayer > resultData.scoreTester;
    const newMatchesPlayed = player.matchesPlayed + 1;
    const newMatchesWon = player.matchesWon + (isWin ? 1 : 0);
    const newPoints = player.totalPoints + (isWin ? 150 : 30);
    const newWinRate = Math.round((newMatchesWon / newMatchesPlayed) * 100);

    const updatedPlayer = await updatePlayer(player.id, {
      gamemodeTiers: newGamemodeTiers as any,
      overallTier: resultData.assignedTierResult as TierLevel,
      matchesPlayed: newMatchesPlayed,
      matchesWon: newMatchesWon,
      totalPoints: newPoints,
      winRate: newWinRate
    });

    player = updatedPlayer;

    // Add History Records to DB
    const thId = `th_${Date.now()}`;
    const mhId = `mh_${Date.now()}`;
    const tnId = `tn_${Date.now()}`;

    if (db) {
      try {
        await db.insert(tierHistory).values({
          id: thId,
          playerId: player.id,
          playerIgn: player.ign,
          date: new Date().toISOString().split('T')[0],
          gamemode: match.gamemode,
          oldTier,
          newTier: resultData.assignedTierResult,
          reason: `Official Evaluation (${resultData.scorePlayer}-${resultData.scoreTester})`,
          testerIgn: resultData.actorIgn || match.testerIgn
        });

        await db.insert(matchHistory).values({
          id: mhId,
          playerId: player.id,
          playerIgn: player.ign,
          date: new Date().toISOString().split('T')[0],
          gamemode: match.gamemode,
          opponentIgn: `Tester ${match.testerIgn}`,
          score: `${resultData.scorePlayer} - ${resultData.scoreTester}`,
          result: isWin ? 'WIN' : 'LOSS',
          tierChange: `Assigned ${resultData.assignedTierResult}`,
          proofUrl: updatedMatch.proofUrl || '',
          testerIgn: match.testerIgn
        });

        if (resultData.notes) {
          await db.insert(testerNotes).values({
            id: tnId,
            playerId: player.id,
            authorIgn: resultData.actorIgn || match.testerIgn,
            authorRole: 'Tester',
            date: new Date().toISOString().split('T')[0],
            text: resultData.notes,
            category: 'Mechanics'
          });
        }
      } catch (err) {
        console.error('Error inserting match histories into DB:', err);
      }
    }
  }

  // 3. Create Audit Log & Promotion Announcement
  await createAuditLog({
    actor: resultData.actorIgn || match.testerIgn,
    action: 'SUBMIT_MATCH_RESULT',
    details: `Evaluated ${match.playerIgn} in ${match.gamemode} -> ${resultData.assignedTierResult} (${resultData.scorePlayer}-${resultData.scoreTester})`,
    type: 'TIER_CHANGE'
  });

  await createAnnouncement({
    title: `✨ Tier Evaluation Completed: ${match.playerIgn} -> ${resultData.assignedTierResult}`,
    content: `${match.playerIgn} completed official tier test in ${match.gamemode.toUpperCase()} conducted by ${match.testerIgn}.`,
    type: 'PROMOTION',
    author: resultData.actorIgn || match.testerIgn
  });

  return { match: updatedMatch, player };
}

// ---------------- STAFF REPOSITORY ----------------

export async function getStaff(): Promise<StaffMember[]> {
  await ensureDb();
  if (db) {
    try {
      const rows = await db.select().from(staffMembers).orderBy(desc(staffMembers.createdAt));
      return rows.map(r => ({
        id: r.id,
        ign: r.ign,
        role: r.role as any,
        avatarUrl: r.avatarUrl || `https://mc-heads.net/avatar/${r.ign}/128`,
        region: r.region as Region,
        testsConducted: r.testsConducted,
        approvalRate: r.approvalRate,
        status: r.status as any,
        joinedDate: r.joinedDate
      }));
    } catch (err) {
      console.error('Error fetching staff from DB:', err);
    }
  }
  return memoryStaff;
}

export async function createStaff(data: Partial<StaffMember>): Promise<StaffMember> {
  await ensureDb();
  const ign = (data.ign || '').trim();
  if (!ign) throw new Error('Staff IGN is required.');

  const newStaff: StaffMember = {
    id: `s_${Date.now()}`,
    ign,
    role: data.role || 'Tester',
    avatarUrl: data.avatarUrl || `https://mc-heads.net/avatar/${ign}/128`,
    region: data.region || 'GLOBAL',
    testsConducted: data.testsConducted || 0,
    approvalRate: data.approvalRate || 100,
    status: data.status || 'Active',
    joinedDate: new Date().toISOString().split('T')[0]
  };

  if (db) {
    try {
      await db.insert(staffMembers).values({
        id: newStaff.id,
        ign: newStaff.ign,
        role: newStaff.role,
        avatarUrl: newStaff.avatarUrl,
        region: newStaff.region,
        testsConducted: newStaff.testsConducted,
        approvalRate: newStaff.approvalRate,
        status: newStaff.status,
        joinedDate: newStaff.joinedDate
      });

      await createAuditLog({
        actor: 'Admin',
        action: 'ADD_STAFF',
        details: `Assigned staff role ${newStaff.role} to ${ign}`,
        type: 'ROLE_CHANGE'
      });

      return newStaff;
    } catch (err) {
      console.error('Error adding staff to DB:', err);
    }
  }

  memoryStaff.unshift(newStaff);
  await createAuditLog({
    actor: 'Admin',
    action: 'ADD_STAFF',
    details: `Assigned staff role ${newStaff.role} to ${ign}`,
    type: 'ROLE_CHANGE'
  });
  return newStaff;
}

export async function updateStaff(id: string, updates: Partial<StaffMember>): Promise<StaffMember> {
  await ensureDb();
  const all = await getStaff();
  const existing = all.find(s => s.id === id);
  if (!existing) throw new Error('Staff member not found.');

  const updated: StaffMember = { ...existing, ...updates };

  if (db) {
    try {
      await db.update(staffMembers)
        .set({
          role: updated.role,
          region: updated.region,
          status: updated.status
        })
        .where(eq(staffMembers.id, id));
      return updated;
    } catch (err) {
      console.error('Error updating staff in DB:', err);
    }
  }

  const idx = memoryStaff.findIndex(s => s.id === id);
  if (idx !== -1) memoryStaff[idx] = updated;
  return updated;
}

export async function deleteStaff(id: string): Promise<boolean> {
  await ensureDb();
  if (db) {
    try {
      await db.delete(staffMembers).where(eq(staffMembers.id, id));
      return true;
    } catch (err) {
      console.error('Error deleting staff from DB:', err);
    }
  }
  memoryStaff = memoryStaff.filter(s => s.id !== id);
  return true;
}

// ---------------- ANNOUNCEMENTS REPOSITORY ----------------

export async function getAnnouncements(): Promise<Announcement[]> {
  await ensureDb();
  if (db) {
    try {
      const rows = await db.select().from(announcements).orderBy(desc(announcements.createdAt));
      return rows.map(r => ({
        id: r.id,
        title: r.title,
        content: r.content,
        type: r.type as any,
        timestamp: r.timestamp,
        author: r.author,
        urgent: r.urgent
      }));
    } catch (err) {
      console.error('Error fetching announcements from DB:', err);
    }
  }
  return memoryAnnouncements;
}

export async function createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
  await ensureDb();
  const newAnn: Announcement = {
    id: `ann_${Date.now()}`,
    title: data.title || 'Official Announcement',
    content: data.content || '',
    type: data.type || 'ANNOUNCEMENT',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    author: data.author || 'Admin',
    urgent: !!data.urgent
  };

  if (db) {
    try {
      await db.insert(announcements).values({
        id: newAnn.id,
        title: newAnn.title,
        content: newAnn.content,
        type: newAnn.type,
        timestamp: newAnn.timestamp,
        author: newAnn.author,
        urgent: newAnn.urgent,
        active: true
      });
      return newAnn;
    } catch (err) {
      console.error('Error creating announcement in DB:', err);
    }
  }

  memoryAnnouncements.unshift(newAnn);
  return newAnn;
}

// ---------------- AUDIT LOGS REPOSITORY ----------------

export async function getAuditLogs(): Promise<AuditLog[]> {
  await ensureDb();
  if (db) {
    try {
      const rows = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt));
      return rows.map(r => ({
        id: r.id,
        timestamp: r.timestamp,
        actor: r.actor,
        action: r.action,
        details: r.details,
        type: r.type as any
      }));
    } catch (err) {
      console.error('Error fetching audit logs from DB:', err);
    }
  }
  return memoryLogs;
}

export async function createAuditLog(data: { actor: string; action: string; details: string; type?: string }): Promise<AuditLog> {
  const log: AuditLog = {
    id: `l_${Date.now()}`,
    timestamp: new Date().toLocaleString(),
    actor: data.actor || 'System',
    action: data.action,
    details: data.details,
    type: (data.type as any) || 'SYSTEM'
  };

  if (db) {
    try {
      await db.insert(auditLogs).values({
        id: log.id,
        timestamp: log.timestamp,
        actor: log.actor,
        action: log.action,
        details: log.details,
        type: log.type
      });
      return log;
    } catch (err) {
      console.error('Error creating audit log in DB:', err);
    }
  }

  memoryLogs.unshift(log);
  return log;
}

// ---------------- SETTINGS REPOSITORY ----------------

export async function getSettings() {
  await ensureDb();
  if (db) {
    try {
      const rows = await db.select().from(systemSettings).where(eq(systemSettings.id, 'global'));
      if (rows.length > 0) {
        return {
          siteTitle: rows[0].siteTitle,
          discordWebhookUrl: rows[0].discordWebhookUrl || memorySettings.discordWebhookUrl,
          autoRoleEnabled: rows[0].autoRoleEnabled
        };
      }
    } catch (err) {
      console.error('Error fetching settings from DB:', err);
    }
  }
  return memorySettings;
}

export async function updateSettings(updates: { siteTitle?: string; discordWebhookUrl?: string; autoRoleEnabled?: boolean }) {
  await ensureDb();
  const current = await getSettings();
  const newSettings = { ...current, ...updates };

  if (db) {
    try {
      await db.insert(systemSettings).values({
        id: 'global',
        siteTitle: newSettings.siteTitle,
        discordWebhookUrl: newSettings.discordWebhookUrl,
        autoRoleEnabled: newSettings.autoRoleEnabled,
        updatedAt: new Date()
      }).onConflictDoUpdate({
        target: systemSettings.id,
        set: {
          siteTitle: newSettings.siteTitle,
          discordWebhookUrl: newSettings.discordWebhookUrl,
          autoRoleEnabled: newSettings.autoRoleEnabled,
          updatedAt: new Date()
        }
      });
      return newSettings;
    } catch (err) {
      console.error('Error updating settings in DB:', err);
    }
  }

  memorySettings = newSettings;
  return newSettings;
}

// ---------------- DISCORD OAUTH USERS REPOSITORY ----------------

// In-memory fallback store for Discord accounts when no DB is connected
const memoryDiscordUsers: Map<string, DiscordUser> = new Map();

/**
 * Creates or updates the local record for a real, verified Discord account
 * (called only after a successful Discord OAuth2 token exchange).
 */
export async function upsertDiscordUser(profile: {
  id: string;
  username: string;
  discriminator?: string;
  globalName?: string;
  avatarUrl?: string;
}): Promise<DiscordUser> {
  await ensureDb();

  if (db) {
    try {
      const existing = await db.select().from(discordUsers).where(eq(discordUsers.id, profile.id)).limit(1);
      const staffRole = (existing[0]?.staffRole as StaffRole) || 'Player';

      const [row] = await db.insert(discordUsers).values({
        id: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        globalName: profile.globalName,
        avatarUrl: profile.avatarUrl,
        staffRole,
        updatedAt: new Date()
      }).onConflictDoUpdate({
        target: discordUsers.id,
        set: {
          username: profile.username,
          discriminator: profile.discriminator,
          globalName: profile.globalName,
          avatarUrl: profile.avatarUrl,
          updatedAt: new Date()
        }
      }).returning();

      return {
        id: row.id,
        username: row.username,
        discriminator: row.discriminator || undefined,
        globalName: row.globalName || undefined,
        avatarUrl: row.avatarUrl || undefined,
        staffRole: row.staffRole as StaffRole
      };
    } catch (err) {
      console.error('Error upserting Discord user in DB:', err);
    }
  }

  const prevRole = memoryDiscordUsers.get(profile.id)?.staffRole || 'Player';
  const user: DiscordUser = { ...profile, staffRole: prevRole };
  memoryDiscordUsers.set(profile.id, user);
  return user;
}

export async function getDiscordUserById(id: string): Promise<DiscordUser | null> {
  await ensureDb();

  if (db) {
    try {
      const rows = await db.select().from(discordUsers).where(eq(discordUsers.id, id)).limit(1);
      if (!rows[0]) return null;
      return {
        id: rows[0].id,
        username: rows[0].username,
        discriminator: rows[0].discriminator || undefined,
        globalName: rows[0].globalName || undefined,
        avatarUrl: rows[0].avatarUrl || undefined,
        staffRole: rows[0].staffRole as StaffRole
      };
    } catch (err) {
      console.error('Error fetching Discord user from DB:', err);
    }
  }

  return memoryDiscordUsers.get(id) || null;
}
