export type MinecraftEdition = 'BEDROCK' | 'JAVA';

export type TierLevel = 
  | 'HT1' // High Tier 1
  | 'LT1' // Low Tier 1
  | 'HT2' // High Tier 2
  | 'LT2' // Low Tier 2
  | 'HT3' // High Tier 3
  | 'LT3' // Low Tier 3
  | 'HT4' // High Tier 4
  | 'LT4' // Low Tier 4
  | 'HT5' // High Tier 5
  | 'LT5' // Low Tier 5
  | 'UNRANKED';

export type Region = 'NA' | 'EU' | 'AS' | 'SA' | 'OCE' | 'GLOBAL';

export type GamemodeId = 
  | 'nodebuff'
  | 'boxing'
  | 'midfight'
  | 'bridge'
  | 'bedfight'
  | 'builduhc'
  | 'mace'
  | 'mlgrush'
  | 'skywars'
  | 'battlerush'
  | 'sword'
  | 'axe'
  | 'crystal'
  | 'pot'
  | 'smp';

export interface GamemodeInfo {
  id: GamemodeId;
  name: string;
  icon: string;
  description: string;
  activePlayers: number;
  totalTestsThisWeek: number;
  color: string;
  edition: MinecraftEdition;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator?: string;
  globalName?: string;
  avatarUrl?: string;
  roles?: string[];
  staffRole?: StaffRole;
}

export type StaffRole = 'Player' | 'Tester' | 'Moderator' | 'Admin';

export interface TierHistoryEntry {
  id: string;
  date: string;
  gamemode: GamemodeId;
  oldTier: TierLevel;
  newTier: TierLevel;
  reason: string;
  testerIgn: string;
  edition?: MinecraftEdition;
}

export interface MatchHistoryEntry {
  id: string;
  date: string;
  gamemode: GamemodeId;
  opponentIgn: string;
  score: string;
  result: 'WIN' | 'LOSS' | 'DRAW';
  tierChange?: string;
  proofUrl?: string;
  testerIgn: string;
  edition?: MinecraftEdition;
}

export interface TesterNote {
  id: string;
  authorIgn: string;
  authorRole: StaffRole;
  date: string;
  text: string;
  category: 'Aim' | 'Movement' | 'Mechanics' | 'Behavior' | 'General';
}

export interface Player {
  id: string;
  ign: string;
  uuid: string;
  avatarUrl: string;
  discordTag: string;
  region: Region;
  edition: MinecraftEdition;
  overallTier: TierLevel;
  totalPoints: number;
  winRate: number; // e.g. 78.5
  matchesPlayed: number;
  matchesWon: number;
  gamemodeTiers: Record<string, TierLevel>;
  tierHistory: TierHistoryEntry[];
  matchHistory: MatchHistoryEntry[];
  testerNotes: TesterNote[];
  bio: string;
  joinedDate: string;
  isBanned: boolean;
  status: 'Online' | 'In Test' | 'In Match' | 'Offline';
  rankTitle?: string;
  staffRole?: StaffRole;
  socials?: {
    youtube?: string;
    twitter?: string;
    discord?: string;
  };
}

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'RETEST_REQUESTED' | 'TESTING' | 'REJECTED';

export interface TestApplication {
  id: string;
  playerId?: string;
  playerIgn: string;
  region: Region;
  edition: MinecraftEdition;
  gamemode: GamemodeId;
  requestedTier: TierLevel;
  proofUrl?: string;
  proofVideoUrl?: string;
  discordTag?: string;
  cpsAverage?: number;
  deviceType?: 'Mobile (Touch)' | 'Windows (KBM)' | 'Console (Controller)';
  appliedDate?: string;
  submittedAt?: string;
  status: ApplicationStatus;
  assignedTester?: string;
  assignedTesterIgn?: string;
  notes?: string;
  rejectionReason?: string;
}

export type TierApplication = TestApplication;

export type MatchStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'DISPUTED';

export interface TestMatch {
  id: string;
  applicationId?: string;
  playerIgn: string;
  testerIgn: string;
  edition: MinecraftEdition;
  gamemode: GamemodeId;
  region: Region;
  status: MatchStatus;
  scheduledTime?: string;
  date?: string;
  scorePlayer: number;
  scoreTester: number;
  assignedTierResult?: TierLevel;
  detailedRatings?: {
    aim: number; // 1-10
    movement: number;
    gamesense: number;
    mechanics: number;
    cps: number;
  };
  proofUrl?: string;
  notes?: string;
}

export interface StaffMember {
  id: string;
  ign: string;
  role: StaffRole;
  avatarUrl: string;
  region: Region;
  testsConducted: number;
  approvalRate: number; // e.g., 68.2
  status: 'Active' | 'Busy' | 'Offline';
  joinedDate: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'PROMOTION' | 'ANNOUNCEMENT' | 'TEST_ALERT' | 'UPDATE';
  timestamp: string;
  author: string;
  urgent?: boolean;
  region?: Region;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'PROMOTION' | 'MATCH' | 'SYSTEM' | 'TEST';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorIgn?: string;
  action: string;
  details: string;
  type: 'TIER_CHANGE' | 'BAN' | 'APPLICATION' | 'ROLE_CHANGE' | 'SYSTEM';
}

export interface SystemStats {
  totalPlayers: number;
  testsCompletedThisMonth: number;
  activeTesters: number;
  promotionRate: number;
  pendingApplications: number;
  liveMatches: number;
}
