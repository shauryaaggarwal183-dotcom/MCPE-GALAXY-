import { Player, TierApplication, TestMatch, StaffMember, Announcement, AuditLog, SystemStats, GamemodeInfo } from '../types';

export const INITIAL_GAMEMODES: GamemodeInfo[] = [
  // Bedrock Edition Gamemodes
  { id: 'nodebuff', name: 'Bedrock NoDebuff', icon: 'FlaskConical', description: 'Pot PvP with speed II and health pots (Bedrock Meta)', activePlayers: 1420, totalTestsThisWeek: 184, color: '#a855f7', edition: 'BEDROCK' },
  { id: 'boxing', name: 'Bedrock Boxing', icon: 'Swords', description: '100-hit combo counter with Bedrock reach physics', activePlayers: 1890, totalTestsThisWeek: 230, color: '#ec4899', edition: 'BEDROCK' },
  { id: 'mace', name: 'Bedrock Mace', icon: 'Zap', description: 'Smash attacks & Wind Charges (Bedrock 1.21)', activePlayers: 1650, totalTestsThisWeek: 260, color: '#06b6d4', edition: 'BEDROCK' },
  { id: 'midfight', name: 'Bedrock Midfight', icon: 'Flame', description: 'Aggressive rod KB & terrain combat', activePlayers: 940, totalTestsThisWeek: 112, color: '#f59e0b', edition: 'BEDROCK' },
  { id: 'bridge', name: 'The Bridge (Bedrock)', icon: 'Footprints', description: 'Fast bypass bridging & goal scoring', activePlayers: 1150, totalTestsThisWeek: 145, color: '#3b82f6', edition: 'BEDROCK' },
  { id: 'bedfight', name: 'BedFight (Bedrock)', icon: 'ShieldAlert', description: 'Bed defense, rush tactics & PvP', activePlayers: 2100, totalTestsThisWeek: 310, color: '#ef4444', edition: 'BEDROCK' },

  // Java Edition Gamemodes
  { id: 'sword', name: 'Java Sword (1.9+)', icon: 'Swords', description: '1.9+ Cooldown Combat, Shield tactics & Sweep attacks', activePlayers: 2450, totalTestsThisWeek: 340, color: '#8b5cf6', edition: 'JAVA' },
  { id: 'axe', name: 'Java Axe & Shield', icon: 'Shield', description: 'Shield disables, heavy axe crits & movement resets', activePlayers: 1980, totalTestsThisWeek: 285, color: '#f59e0b', edition: 'JAVA' },
  { id: 'crystal', name: 'Java Crystal PvP', icon: 'Sparkles', description: 'End Crystals, Obsidian, Respawn Anchors & Totems', activePlayers: 3100, totalTestsThisWeek: 420, color: '#ec4899', edition: 'JAVA' },
  { id: 'pot', name: 'Java Netherite Pot', icon: 'FlaskConical', description: '1.20 Netherite armor, Speed II & Splash Health II', activePlayers: 1720, totalTestsThisWeek: 210, color: '#10b981', edition: 'JAVA' },
  { id: 'smp', name: 'Java SMP / Vanilla', icon: 'Crosshair', description: 'Hardcore survival combat with Golden Apples & Crossbows', activePlayers: 1350, totalTestsThisWeek: 160, color: '#3b82f6', edition: 'JAVA' },
  { id: 'builduhc', name: 'Java BuildUHC', icon: 'Hammer', description: '1.8 / 1.9 Build UHC with Lava buckets, Rod & Bow', activePlayers: 1100, totalTestsThisWeek: 130, color: '#06b6d4', edition: 'JAVA' }
];

export const INITIAL_PLAYERS: Player[] = [
  // ================= 1. GLOBAL #1 CHAMPION =================
  {
    id: 'p1',
    ign: 'Maxxaaaaaaa',
    uuid: '00000001-1111-2222-3333-444444444444',
    avatarUrl: 'https://mc-heads.net/avatar/Maxxaaaaaaa/128',
    discordTag: 'maxx#0001',
    region: 'GLOBAL',
    edition: 'BEDROCK',
    staffRole: 'Admin',
    overallTier: 'HT1',
    totalPoints: 3450,
    winRate: 94.5,
    matchesPlayed: 420,
    matchesWon: 397,
    gamemodeTiers: {
      nodebuff: 'HT1',
      boxing: 'HT1',
      mace: 'HT1',
      midfight: 'HT1',
      bridge: 'HT1',
      bedfight: 'HT1'
    },
    tierHistory: [
      { id: 'mth1', date: '2026-08-05', gamemode: 'nodebuff', oldTier: 'HT1', newTier: 'HT1', reason: 'Defended Global #1 Title (5-0)', testerIgn: 'Krono', edition: 'BEDROCK' },
      { id: 'mth2', date: '2026-07-20', gamemode: 'boxing', oldTier: 'LT1', newTier: 'HT1', reason: 'Grandmaster Showcase Victory', testerIgn: 'Vortex', edition: 'BEDROCK' }
    ],
    matchHistory: [
      { id: 'mmh1', date: '2026-08-06', gamemode: 'boxing', opponentIgn: 'iiiniveddd', score: '5 - 1', result: 'WIN', tierChange: '+50 PTS', testerIgn: 'Krono', edition: 'BEDROCK' },
      { id: 'mmh2', date: '2026-08-04', gamemode: 'nodebuff', opponentIgn: 'MarlowPvP', score: '5 - 2', result: 'WIN', tierChange: 'Maintained #1', testerIgn: 'Krono', edition: 'BEDROCK' }
    ],
    testerNotes: [
      { id: 'mtn1', authorIgn: 'Krono', authorRole: 'Admin', date: '2026-08-05', text: 'Supreme tracking, instant resets, and flawless game sense across all gamemodes. Undisputed Global #1 Champion.', category: 'Mechanics' }
    ],
    bio: '🌟 Global #1 Undisputed Champion | MCPE Galaxy Sovereign',
    joinedDate: '2025-01-01',
    isBanned: false,
    status: 'Online',
    rankTitle: 'Global Champion',
    socials: { youtube: 'https://youtube.com', discord: 'maxx#0001' }
  },

  // ================= 2. RANK #2 =================
  {
    id: 'p2',
    ign: 'iiiniveddd',
    uuid: 'a8b92f10-1234-4567-89ab-cdef01234567',
    avatarUrl: 'https://mc-heads.net/avatar/iiiniveddd/128',
    discordTag: 'nived#0001',
    region: 'AS',
    edition: 'BEDROCK',
    staffRole: 'Admin',
    overallTier: 'HT1',
    totalPoints: 2850,
    winRate: 88.4,
    matchesPlayed: 320,
    matchesWon: 283,
    gamemodeTiers: {
      nodebuff: 'HT1',
      boxing: 'HT1',
      midfight: 'LT1',
      bridge: 'HT1',
      bedfight: 'LT1',
      mace: 'HT1'
    },
    tierHistory: [
      { id: 'th1', date: '2026-08-01', gamemode: 'nodebuff', oldTier: 'LT1', newTier: 'HT1', reason: 'Official Tier Test Victory (3-0)', testerIgn: 'Krono', edition: 'BEDROCK' },
      { id: 'th2', date: '2026-07-15', gamemode: 'boxing', oldTier: 'HT2', newTier: 'HT1', reason: 'Promotion Request Granted', testerIgn: 'Vortex', edition: 'BEDROCK' }
    ],
    matchHistory: [
      { id: 'mh1', date: '2026-08-05', gamemode: 'boxing', opponentIgn: 'BakrSahab', score: '3 - 1', result: 'WIN', tierChange: '+25 PTS', testerIgn: 'Krono', edition: 'BEDROCK' },
      { id: 'mh2', date: '2026-08-02', gamemode: 'nodebuff', opponentIgn: 'DrainFrr', score: '3 - 0', result: 'WIN', tierChange: 'Promoted to HT1', testerIgn: 'Krono', edition: 'BEDROCK' }
    ],
    testerNotes: [
      { id: 'tn1', authorIgn: 'Krono', authorRole: 'Admin', date: '2026-08-02', text: 'Exceptional tracking and 18 CPS jitter. Clear HT1 Bedrock candidate.', category: 'Aim' }
    ],
    bio: 'Bedrock Competitive Legend | #1 Overall Asia | Galaxy Head Admin',
    joinedDate: '2025-11-12',
    isBanned: false,
    status: 'Online',
    rankTitle: 'Bedrock God',
    socials: { youtube: 'https://youtube.com', discord: 'nived#0001' }
  },

  // ================= 3. RANK #3 =================
  {
    id: 'p3',
    ign: 'MarlowPvP',
    uuid: 'f4e32109-8765-4321-98ba-fedcba098765',
    avatarUrl: 'https://crafatar.com/avatars/f4e32109-8765-4321-98ba-fedcba098765?overlay=true',
    discordTag: 'marlow#1000',
    region: 'NA',
    edition: 'JAVA',
    staffRole: 'Admin',
    overallTier: 'HT1',
    totalPoints: 2780,
    winRate: 91.2,
    matchesPlayed: 410,
    matchesWon: 374,
    gamemodeTiers: {
      sword: 'HT1',
      axe: 'HT1',
      crystal: 'HT1',
      pot: 'HT1',
      smp: 'LT1',
      builduhc: 'HT1'
    },
    tierHistory: [
      { id: 'jth1', date: '2026-08-03', gamemode: 'crystal', oldTier: 'LT1', newTier: 'HT1', reason: 'Crystal Masters Finals 5-0', testerIgn: 'Krono', edition: 'JAVA' }
    ],
    matchHistory: [
      { id: 'jmh1', date: '2026-08-04', gamemode: 'crystal', opponentIgn: 'StimpyPvP', score: '5 - 2', result: 'WIN', tierChange: 'Maintained HT1', testerIgn: 'Krono', edition: 'JAVA' }
    ],
    testerNotes: [
      { id: 'jtn1', authorIgn: 'Krono', authorRole: 'Admin', date: '2026-08-03', text: 'Flawless anchor placements and sub-20ms crystal pop timing. Undisputed HT1 Java God.', category: 'Mechanics' }
    ],
    bio: 'Java #1 Sword & Crystal Specialist | NA Grandmaster',
    joinedDate: '2025-09-01',
    isBanned: false,
    status: 'Online',
    rankTitle: 'Java Sovereign',
    socials: { youtube: 'https://youtube.com', discord: 'marlow#1000' }
  },

  // ================= 4. RANK #4 =================
  {
    id: 'p4',
    ign: 'Minemanner',
    uuid: 'e5d43210-9876-5432-10ab-cdefba109876',
    avatarUrl: 'https://mc-heads.net/avatar/Minemanner/128',
    discordTag: 'minemanner#1111',
    region: 'EU',
    edition: 'JAVA',
    staffRole: 'Tester',
    overallTier: 'HT1',
    totalPoints: 2620,
    winRate: 89.5,
    matchesPlayed: 380,
    matchesWon: 340,
    gamemodeTiers: {
      sword: 'HT1',
      axe: 'HT1',
      pot: 'HT1',
      builduhc: 'HT1'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'EU Combat Legend | 1.8 / 1.9 Sword God',
    joinedDate: '2025-08-15',
    isBanned: false,
    status: 'Online',
    rankTitle: 'Combat Legend'
  },

  // ================= 5. RANK #5 =================
  {
    id: 'p5',
    ign: 'StimpyPvP',
    uuid: 'd6c54321-0987-6543-21bc-defacb210987',
    avatarUrl: 'https://mc-heads.net/avatar/StimpyPvP/128',
    discordTag: 'stimpy#0007',
    region: 'EU',
    edition: 'JAVA',
    staffRole: 'Player',
    overallTier: 'LT1',
    totalPoints: 2380,
    winRate: 85.0,
    matchesPlayed: 350,
    matchesWon: 298,
    gamemodeTiers: {
      sword: 'LT1',
      axe: 'HT1',
      crystal: 'LT1',
      pot: 'HT1',
      smp: 'LT1',
      builduhc: 'HT1'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'EU Java Pot & Axe Titan | 1.20 Netherite King',
    joinedDate: '2025-10-15',
    isBanned: false,
    status: 'In Match',
    rankTitle: 'Netherite Warlord'
  },

  // ================= 6. RANK #6 =================
  {
    id: 'p6',
    ign: 'BakrSahab',
    uuid: 'b9c03f21-2345-5678-90bc-defa12345678',
    avatarUrl: 'https://mc-heads.net/avatar/BakrSahab/128',
    discordTag: 'bakr#9999',
    region: 'AS',
    edition: 'BEDROCK',
    staffRole: 'Tester',
    overallTier: 'LT1',
    totalPoints: 2240,
    winRate: 82.1,
    matchesPlayed: 280,
    matchesWon: 230,
    gamemodeTiers: {
      nodebuff: 'LT1',
      boxing: 'HT2',
      midfight: 'LT2',
      bridge: 'LT1',
      bedfight: 'HT2',
      mace: 'HT2'
    },
    tierHistory: [
      { id: 'th3', date: '2026-07-28', gamemode: 'boxing', oldTier: 'LT2', newTier: 'HT2', reason: 'Retest Passed', testerIgn: 'Aura', edition: 'BEDROCK' }
    ],
    matchHistory: [],
    testerNotes: [],
    bio: 'Top 5 AS Bedrock Competitor | Bedfight & Bridge Specialist',
    joinedDate: '2025-12-01',
    isBanned: false,
    status: 'Online',
    rankTitle: 'Apex Predator'
  },

  // ================= 7. RANK #7 =================
  {
    id: 'p7',
    ign: 'NebulaBedrock',
    uuid: 'e2f36a54-5678-8901-23ef-abcd45678901',
    avatarUrl: 'https://mc-heads.net/avatar/Nebula/128',
    discordTag: 'nebula#4040',
    region: 'NA',
    edition: 'BEDROCK',
    staffRole: 'Tester',
    overallTier: 'LT1',
    totalPoints: 2150,
    winRate: 83.2,
    matchesPlayed: 240,
    matchesWon: 200,
    gamemodeTiers: {
      nodebuff: 'LT1',
      boxing: 'LT1',
      midfight: 'HT2',
      mace: 'HT1'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'NA Official Galaxy Tester & Mace Expert',
    joinedDate: '2025-10-05',
    isBanned: false,
    status: 'Online',
    rankTitle: 'Galaxy Tester'
  },

  // ================= 8. RANK #8 =================
  {
    id: 'p8',
    ign: 'ColdestJava',
    uuid: 'c7b65432-1098-7654-32cd-efbadc321098',
    avatarUrl: 'https://mc-heads.net/avatar/Coldest/128',
    discordTag: 'coldest#4040',
    region: 'AS',
    edition: 'JAVA',
    staffRole: 'Player',
    overallTier: 'HT2',
    totalPoints: 2050,
    winRate: 80.4,
    matchesPlayed: 240,
    matchesWon: 193,
    gamemodeTiers: {
      sword: 'HT2',
      axe: 'LT2',
      crystal: 'HT2',
      pot: 'HT2',
      smp: 'HT2',
      builduhc: 'LT2'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'AS Java SMP & Sword Elite Player',
    joinedDate: '2026-01-20',
    isBanned: false,
    status: 'Online',
    rankTitle: 'AS Vanguard'
  },

  // ================= 9. RANK #9 =================
  {
    id: 'p9',
    ign: 'ChronoCrystal',
    uuid: 'b8a76543-2109-8765-43de-fabced432109',
    avatarUrl: 'https://mc-heads.net/avatar/Chrono/128',
    discordTag: 'chrono#7070',
    region: 'NA',
    edition: 'JAVA',
    staffRole: 'Tester',
    overallTier: 'HT2',
    totalPoints: 2010,
    winRate: 79.2,
    matchesPlayed: 225,
    matchesWon: 178,
    gamemodeTiers: {
      crystal: 'HT2',
      smp: 'HT2',
      axe: 'LT2'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'NA Tier Evaluator & Crystal/Anchor Specialist',
    joinedDate: '2025-12-05',
    isBanned: false,
    status: 'Online',
    rankTitle: 'Tier Evaluator'
  },

  // ================= 10. RANK #10 =================
  {
    id: 'p10',
    ign: 'DrainFrr',
    uuid: 'c0d14f32-3456-6789-01cd-efab23456789',
    avatarUrl: 'https://mc-heads.net/avatar/DrainFrr/128',
    discordTag: 'drain#1337',
    region: 'EU',
    edition: 'BEDROCK',
    staffRole: 'Player',
    overallTier: 'HT2',
    totalPoints: 1980,
    winRate: 79.5,
    matchesPlayed: 210,
    matchesWon: 167,
    gamemodeTiers: {
      nodebuff: 'HT2',
      boxing: 'LT2',
      midfight: 'HT2',
      bridge: 'LT2',
      bedfight: 'HT2'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'EU Bedrock Champion | NoDebuff Main',
    joinedDate: '2026-01-10',
    isBanned: false,
    status: 'Online',
    rankTitle: 'EU Monarch'
  },

  // ================= 11. RANK #11 =================
  {
    id: 'p11',
    ign: 'VortexKBM',
    uuid: 'd7e81f09-0123-3456-78de-fabc90123456',
    avatarUrl: 'https://mc-heads.net/avatar/Vortex/128',
    discordTag: 'vortexkbm#8888',
    region: 'AS',
    edition: 'BEDROCK',
    staffRole: 'Admin',
    overallTier: 'HT2',
    totalPoints: 1940,
    winRate: 80.0,
    matchesPlayed: 210,
    matchesWon: 168,
    gamemodeTiers: {
      nodebuff: 'HT2',
      boxing: 'HT2',
      mace: 'HT2'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'Galaxy Head Admin | Bedrock Competitive Council',
    joinedDate: '2025-08-10',
    isBanned: false,
    status: 'Online',
    rankTitle: 'Head Admin'
  },

  // ================= 12. RANK #12 =================
  {
    id: 'p12',
    ign: 'CREEPYJODD',
    uuid: 'd1e25f43-4567-7890-12de-fabc34567890',
    avatarUrl: 'https://mc-heads.net/avatar/CREEPYJODD/128',
    discordTag: 'creepy#7777',
    region: 'NA',
    edition: 'BEDROCK',
    staffRole: 'Player',
    overallTier: 'HT2',
    totalPoints: 1920,
    winRate: 78.0,
    matchesPlayed: 195,
    matchesWon: 152,
    gamemodeTiers: {
      nodebuff: 'LT2',
      boxing: 'HT2',
      mace: 'HT2',
      bridge: 'HT3'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'NA Bedrock Combos & Mace Maestro',
    joinedDate: '2026-02-14',
    isBanned: false,
    status: 'Online',
    rankTitle: 'NA Warlord'
  },

  // ================= 13. RANK #13 =================
  {
    id: 'p13',
    ign: 'BayanPvP',
    uuid: 'a9f87654-3210-9876-54ef-abcdfe543210',
    avatarUrl: 'https://mc-heads.net/avatar/Bayan/128',
    discordTag: 'bayan#8080',
    region: 'NA',
    edition: 'JAVA',
    staffRole: 'Player',
    overallTier: 'LT2',
    totalPoints: 1840,
    winRate: 76.0,
    matchesPlayed: 180,
    matchesWon: 137,
    gamemodeTiers: {
      sword: 'LT2',
      pot: 'LT2',
      builduhc: 'HT2'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'NA 1.9+ Shield & UHC Duelist',
    joinedDate: '2026-02-10',
    isBanned: false,
    status: 'Offline',
    rankTitle: 'UHC Master'
  },

  // ================= 14. RANK #14 =================
  {
    id: 'p14',
    ign: 'XenonPvP',
    uuid: 'f3a47b65-6789-9012-34fa-bcde56789012',
    avatarUrl: 'https://mc-heads.net/avatar/Xenon/128',
    discordTag: 'xenon#1010',
    region: 'NA',
    edition: 'BEDROCK',
    staffRole: 'Player',
    overallTier: 'LT2',
    totalPoints: 1780,
    winRate: 74.5,
    matchesPlayed: 160,
    matchesWon: 119,
    gamemodeTiers: {
      nodebuff: 'LT2',
      boxing: 'HT3',
      bridge: 'LT2'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'Competitive Bedrock NoDebuff grinder',
    joinedDate: '2026-03-01',
    isBanned: false,
    status: 'Offline',
    rankTitle: 'Elite Duelist'
  },

  // ================= 15. RANK #15 =================
  {
    id: 'p15',
    ign: 'RasmusCPvP',
    uuid: '98e98765-4321-0987-65fa-bcdefa654321',
    avatarUrl: 'https://mc-heads.net/avatar/Rasmus/128',
    discordTag: 'rasmus#9191',
    region: 'EU',
    edition: 'JAVA',
    staffRole: 'Player',
    overallTier: 'HT3',
    totalPoints: 1670,
    winRate: 72.3,
    matchesPlayed: 150,
    matchesWon: 108,
    gamemodeTiers: {
      crystal: 'HT3',
      sword: 'HT3',
      pot: 'LT2'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'EU Crystal PvP competitive contender',
    joinedDate: '2026-03-05',
    isBanned: false,
    status: 'Online',
    rankTitle: 'Crystal Knight'
  },

  // ================= 16. RANK #16 =================
  {
    id: 'p16',
    ign: 'NovaTouch',
    uuid: 'a4b58c76-7890-0123-45ab-cdef67890123',
    avatarUrl: 'https://mc-heads.net/avatar/Nova/128',
    discordTag: 'novatouch#2222',
    region: 'AS',
    edition: 'BEDROCK',
    staffRole: 'Player',
    overallTier: 'HT3',
    totalPoints: 1650,
    winRate: 71.0,
    matchesPlayed: 140,
    matchesWon: 99,
    gamemodeTiers: {
      nodebuff: 'HT3',
      boxing: 'HT3',
      bedfight: 'LT2'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: '#1 Touch Screen (Mobile) Player in Asia',
    joinedDate: '2026-02-20',
    isBanned: false,
    status: 'Online',
    rankTitle: 'Touch Prodigy'
  },

  // ================= 17. RANK #17 =================
  {
    id: 'p17',
    ign: 'AuraBedrock',
    uuid: 'b5c69d87-8901-1234-56bc-defa78901234',
    avatarUrl: 'https://mc-heads.net/avatar/Aura/128',
    discordTag: 'auramc#3333',
    region: 'SA',
    edition: 'BEDROCK',
    staffRole: 'Moderator',
    overallTier: 'HT3',
    totalPoints: 1610,
    winRate: 69.8,
    matchesPlayed: 155,
    matchesWon: 108,
    gamemodeTiers: {
      nodebuff: 'HT3',
      midfight: 'HT3',
      bridge: 'LT3'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'South America Tier Committee & Rod Specialist',
    joinedDate: '2025-11-25',
    isBanned: false,
    status: 'Online',
    rankTitle: 'SA Guardian'
  },

  // ================= 18. RANK #18 =================
  {
    id: 'p18',
    ign: 'DantehAxe',
    uuid: '87d09876-5432-1098-76ab-cdefab765432',
    avatarUrl: 'https://mc-heads.net/avatar/Danteh/128',
    discordTag: 'danteh#4444',
    region: 'NA',
    edition: 'JAVA',
    staffRole: 'Player',
    overallTier: 'LT3',
    totalPoints: 1560,
    winRate: 68.0,
    matchesPlayed: 135,
    matchesWon: 92,
    gamemodeTiers: {
      axe: 'LT3',
      smp: 'LT3'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'Shield disable and axe crit enthusiast',
    joinedDate: '2026-03-18',
    isBanned: false,
    status: 'Offline',
    rankTitle: 'Axe Specialist'
  },

  // ================= 19. RANK #19 =================
  {
    id: 'p19',
    ign: 'VeloceMC',
    uuid: 'c6d70e98-9012-2345-67cd-efab89012345',
    avatarUrl: 'https://mc-heads.net/avatar/Veloce/128',
    discordTag: 'veloce#5555',
    region: 'EU',
    edition: 'BEDROCK',
    staffRole: 'Player',
    overallTier: 'LT3',
    totalPoints: 1520,
    winRate: 66.5,
    matchesPlayed: 130,
    matchesWon: 86,
    gamemodeTiers: {
      boxing: 'LT3',
      mace: 'LT3',
      bedfight: 'HT3'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'Fast paced EU rusher & Bridge speedrunner',
    joinedDate: '2026-03-12',
    isBanned: false,
    status: 'Offline',
    rankTitle: 'Speedster'
  },

  // ================= 20. RANK #20 =================
  {
    id: 'p20',
    ign: 'KryonPot',
    uuid: '76c10987-6543-2109-87bc-defabc876543',
    avatarUrl: 'https://mc-heads.net/avatar/Kryon/128',
    discordTag: 'kryon#5050',
    region: 'SA',
    edition: 'JAVA',
    staffRole: 'Player',
    overallTier: 'HT4',
    totalPoints: 1410,
    winRate: 62.5,
    matchesPlayed: 115,
    matchesWon: 72,
    gamemodeTiers: {
      pot: 'HT4',
      sword: 'HT4'
    },
    tierHistory: [],
    matchHistory: [],
    testerNotes: [],
    bio: 'South American Netherite Pot testing graduate',
    joinedDate: '2026-04-10',
    isBanned: false,
    status: 'Online',
    rankTitle: 'Potion Alchemist'
  }
];

export const INITIAL_APPLICATIONS: TierApplication[] = [
  {
    id: 'app1',
    playerId: 'p14',
    playerIgn: 'XenonPvP',
    region: 'NA',
    edition: 'BEDROCK',
    gamemode: 'nodebuff',
    requestedTier: 'HT2',
    proofVideoUrl: 'https://youtube.com/watch?v=sample123',
    discordTag: 'xenon#1010',
    cpsAverage: 16,
    deviceType: 'Windows (KBM)',
    submittedAt: '2026-08-06 14:30',
    status: 'PENDING',
    notes: 'Submitted unedited 5-minute Bedrock gameplay clip.'
  },
  {
    id: 'app2',
    playerId: 'p12',
    playerIgn: 'CREEPYJODD',
    region: 'NA',
    edition: 'BEDROCK',
    gamemode: 'boxing',
    requestedTier: 'HT1',
    proofVideoUrl: 'https://youtube.com/watch?v=sample456',
    discordTag: 'creepy#7777',
    cpsAverage: 18,
    deviceType: 'Windows (KBM)',
    submittedAt: '2026-08-07 01:15',
    status: 'TESTING',
    assignedTesterIgn: 'NebulaBedrock',
    notes: 'Tester assigned, match scheduled for 18:00 UTC.'
  },
  {
    id: 'app3',
    playerId: 'p8',
    playerIgn: 'ColdestJava',
    region: 'AS',
    edition: 'JAVA',
    gamemode: 'sword',
    requestedTier: 'HT1',
    proofVideoUrl: 'https://youtube.com/watch?v=sample_java_sword',
    discordTag: 'coldest#4040',
    cpsAverage: 14,
    deviceType: 'Windows (KBM)',
    submittedAt: '2026-08-07 03:00',
    status: 'PENDING',
    notes: 'Java 1.20 Sword 1v1 testing submission against HT1 player.'
  },
  {
    id: 'app4',
    playerId: 'p16',
    playerIgn: 'NovaTouch',
    region: 'AS',
    edition: 'BEDROCK',
    gamemode: 'nodebuff',
    requestedTier: 'HT2',
    proofVideoUrl: 'https://youtube.com/watch?v=touch_god_clips',
    discordTag: 'novatouch#2222',
    cpsAverage: 12,
    deviceType: 'Mobile (Touch)',
    submittedAt: '2026-08-07 04:20',
    status: 'PENDING',
    notes: 'Official mobile testing request with live touch counter overlay.'
  }
];

export const INITIAL_MATCHES: TestMatch[] = [
  {
    id: 'm1',
    applicationId: 'app2',
    playerIgn: 'CREEPYJODD',
    testerIgn: 'NebulaBedrock',
    edition: 'BEDROCK',
    gamemode: 'boxing',
    region: 'NA',
    status: 'IN_PROGRESS',
    scheduledTime: '2026-08-07 18:00',
    scorePlayer: 2,
    scoreTester: 1,
    proofUrl: 'https://youtube.com/watch?v=live_stream',
    notes: 'Best of 5 Bedrock Boxing match currently active.'
  },
  {
    id: 'jm1',
    applicationId: 'app_java_past',
    playerIgn: 'MarlowPvP',
    testerIgn: 'Minemanner',
    edition: 'JAVA',
    gamemode: 'crystal',
    region: 'NA',
    status: 'COMPLETED',
    scheduledTime: '2026-08-03 15:00',
    scorePlayer: 5,
    scoreTester: 0,
    assignedTierResult: 'HT1',
    detailedRatings: { aim: 10, movement: 10, gamesense: 10, mechanics: 10, cps: 15 },
    proofUrl: 'https://youtube.com/watch?v=proof_marlow',
    notes: 'Dominant Java Crystal PvP performance. Awarded HT1.'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 's1', ign: 'Maxxaaaaaaa', role: 'Admin', avatarUrl: 'https://mc-heads.net/avatar/Maxxaaaaaaa/128', region: 'GLOBAL', testsConducted: 520, approvalRate: 72.0, status: 'Active', joinedDate: '2025-01-01' },
  { id: 's2', ign: 'iiiniveddd', role: 'Admin', avatarUrl: 'https://mc-heads.net/avatar/iiiniveddd/128', region: 'AS', testsConducted: 412, approvalRate: 64.5, status: 'Active', joinedDate: '2025-01-01' },
  { id: 's3', ign: 'VortexKBM', role: 'Admin', avatarUrl: 'https://mc-heads.net/avatar/Vortex/128', region: 'AS', testsConducted: 290, approvalRate: 71.0, status: 'Active', joinedDate: '2025-03-10' },
  { id: 's4', ign: 'NebulaBedrock', role: 'Tester', avatarUrl: 'https://mc-heads.net/avatar/Nebula/128', region: 'NA', testsConducted: 185, approvalRate: 58.0, status: 'Active', joinedDate: '2025-06-20' },
  { id: 's5', ign: 'ChronoCrystal', role: 'Tester', avatarUrl: 'https://mc-heads.net/avatar/Chrono/128', region: 'NA', testsConducted: 160, approvalRate: 60.0, status: 'Active', joinedDate: '2025-07-14' },
  { id: 's6', ign: 'Minemanner', role: 'Tester', avatarUrl: 'https://mc-heads.net/avatar/Minemanner/128', region: 'EU', testsConducted: 210, approvalRate: 68.2, status: 'Active', joinedDate: '2025-08-15' },
  { id: 's7', ign: 'AuraBedrock', role: 'Moderator', avatarUrl: 'https://mc-heads.net/avatar/Aura/128', region: 'SA', testsConducted: 95, approvalRate: 62.1, status: 'Busy', joinedDate: '2025-08-11' }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    title: '👑 Maxxaaaaaaa Crowned Global #1 Champion!',
    content: 'Maxxaaaaaaa holds the undisputed #1 Global Champion title on MCPE Galaxy with 3,450 PTS and High Tier 1 across all competitive categories!',
    type: 'ANNOUNCEMENT',
    timestamp: '2026-08-07 00:00',
    author: 'iiiniveddd',
    urgent: true
  },
  {
    id: 'ann2',
    title: '✨ Official Season 4 Top 20 Ranked Roster Finalized',
    content: 'The official 20 ranked competitors across Bedrock and Java editions have been calibrated with official HT1-LT5 tier certifications.',
    type: 'UPDATE',
    timestamp: '2026-08-06 16:20',
    author: 'System'
  }
];

export const INITIAL_LOGS: AuditLog[] = [
  { id: 'l1', timestamp: '2026-08-07 05:10', actor: 'Maxxaaaaaaa', action: 'ASSIGN_TESTER', details: 'Assigned CREEPYJODD boxing test to NebulaBedrock', type: 'APPLICATION' },
  { id: 'l2', timestamp: '2026-08-05 16:20', actor: 'iiiniveddd', action: 'PROMOTE_PLAYER', details: 'Confirmed Maxxaaaaaaa as Global #1 Champion with 3,450 PTS', type: 'TIER_CHANGE' },
  { id: 'l3', timestamp: '2026-08-04 12:00', actor: 'VortexKBM', action: 'APPROVE_APP', details: 'Approved Bedrock testing application for NovaTouch', type: 'APPLICATION' }
];
