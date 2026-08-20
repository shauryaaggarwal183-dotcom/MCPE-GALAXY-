import { pgTable, text, integer, real, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

// 1. Players Table
export const players = pgTable('players', {
  id: text('id').primaryKey(),
  ign: text('ign').notNull().unique(),
  uuid: text('uuid').notNull(),
  avatarUrl: text('avatar_url'),
  discordTag: text('discord_tag'),
  region: text('region').notNull().default('NA'),
  edition: text('edition').notNull().default('BEDROCK'),
  staffRole: text('staff_role').notNull().default('Player'),
  overallTier: text('overall_tier').notNull().default('UNRANKED'),
  totalPoints: integer('total_points').notNull().default(1000),
  winRate: real('win_rate').notNull().default(0),
  matchesPlayed: integer('matches_played').notNull().default(0),
  matchesWon: integer('matches_won').notNull().default(0),
  gamemodeTiers: jsonb('gamemode_tiers').notNull().$type<Record<string, string>>(),
  bio: text('bio'),
  joinedDate: text('joined_date').notNull(),
  isBanned: boolean('is_banned').notNull().default(false),
  status: text('status').notNull().default('Online'),
  rankTitle: text('rank_title'),
  socials: jsonb('socials').$type<{ youtube?: string; discord?: string; twitter?: string }>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

// 2. Tier History Table
export const tierHistory = pgTable('tier_history', {
  id: text('id').primaryKey(),
  playerId: text('player_id').references(() => players.id, { onDelete: 'cascade' }).notNull(),
  playerIgn: text('player_ign').notNull(),
  date: text('date').notNull(),
  gamemode: text('gamemode').notNull(),
  oldTier: text('old_tier').notNull(),
  newTier: text('new_tier').notNull(),
  reason: text('reason'),
  testerIgn: text('tester_ign'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 3. Match History Table
export const matchHistory = pgTable('match_history', {
  id: text('id').primaryKey(),
  playerId: text('player_id').references(() => players.id, { onDelete: 'cascade' }).notNull(),
  playerIgn: text('player_ign').notNull(),
  date: text('date').notNull(),
  gamemode: text('gamemode').notNull(),
  opponentIgn: text('opponent_ign').notNull(),
  score: text('score').notNull(),
  result: text('result').notNull(),
  tierChange: text('tier_change'),
  proofUrl: text('proof_url'),
  testerIgn: text('tester_ign'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 4. Tester Notes Table
export const testerNotes = pgTable('tester_notes', {
  id: text('id').primaryKey(),
  playerId: text('player_id').references(() => players.id, { onDelete: 'cascade' }).notNull(),
  authorIgn: text('author_ign').notNull(),
  authorRole: text('author_role').notNull(),
  date: text('date').notNull(),
  text: text('text').notNull(),
  category: text('category').notNull().default('General'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 5. Tier Applications Table
export const tierApplications = pgTable('tier_applications', {
  id: text('id').primaryKey(),
  playerId: text('player_id').references(() => players.id, { onDelete: 'set null' }),
  playerIgn: text('player_ign').notNull(),
  region: text('region').notNull(),
  edition: text('edition').notNull().default('BEDROCK'),
  gamemode: text('gamemode').notNull(),
  requestedTier: text('requested_tier').notNull(),
  proofVideoUrl: text('proof_video_url').notNull(),
  discordTag: text('discord_tag').notNull(),
  cpsAverage: integer('cps_average').notNull().default(12),
  deviceType: text('device_type').notNull().default('Windows (KBM)'),
  submittedAt: text('submitted_at').notNull(),
  status: text('status').notNull().default('PENDING'),
  assignedTesterIgn: text('assigned_tester_ign'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 6. Test Matches Table
export const testMatches = pgTable('test_matches', {
  id: text('id').primaryKey(),
  applicationId: text('application_id').references(() => tierApplications.id, { onDelete: 'cascade' }),
  playerIgn: text('player_ign').notNull(),
  testerIgn: text('tester_ign').notNull(),
  edition: text('edition').notNull().default('BEDROCK'),
  gamemode: text('gamemode').notNull(),
  region: text('region').notNull(),
  status: text('status').notNull().default('SCHEDULED'),
  scheduledTime: text('scheduled_time').notNull(),
  scorePlayer: integer('score_player').notNull().default(0),
  scoreTester: integer('score_tester').notNull().default(0),
  assignedTierResult: text('assigned_tier_result'),
  detailedRatings: jsonb('detailed_ratings').$type<{ aim?: number; movement?: number; gamesense?: number; mechanics?: number; cps?: number }>(),
  proofUrl: text('proof_url'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 7. Staff Members Table
export const staffMembers = pgTable('staff_members', {
  id: text('id').primaryKey(),
  ign: text('ign').notNull().unique(),
  role: text('role').notNull().default('Tester'),
  avatarUrl: text('avatar_url'),
  region: text('region').notNull().default('GLOBAL'),
  testsConducted: integer('tests_conducted').notNull().default(0),
  approvalRate: real('approval_rate').notNull().default(100),
  status: text('status').notNull().default('Active'),
  joinedDate: text('joined_date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 8. Announcements Table
export const announcements = pgTable('announcements', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: text('type').notNull().default('ANNOUNCEMENT'),
  timestamp: text('timestamp').notNull(),
  author: text('author').notNull().default('Admin'),
  urgent: boolean('urgent').notNull().default(false),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 9. Audit Logs Table
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  details: text('details').notNull(),
  type: text('type').notNull().default('SYSTEM'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 10b. Discord OAuth Users Table
export const discordUsers = pgTable('discord_users', {
  id: text('id').primaryKey(), // Discord snowflake user id
  username: text('username').notNull(),
  discriminator: text('discriminator'),
  globalName: text('global_name'),
  avatarUrl: text('avatar_url'),
  staffRole: text('staff_role').notNull().default('Player'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

// 10. System Settings Table
export const systemSettings = pgTable('system_settings', {
  id: text('id').primaryKey().default('global'),
  siteTitle: text('site_title').notNull().default('MCPE GALAXY TIER SYSTEM'),
  discordWebhookUrl: text('discord_webhook_url'),
  autoRoleEnabled: boolean('auto_role_enabled').notNull().default(true),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});
