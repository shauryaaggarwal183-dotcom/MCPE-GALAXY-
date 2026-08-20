import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema.js';
import { 
  INITIAL_PLAYERS, 
  INITIAL_APPLICATIONS, 
  INITIAL_MATCHES, 
  INITIAL_STAFF, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_LOGS 
} from '../server/mockStore.js';
import { eq } from 'drizzle-orm';

if (typeof window === 'undefined') {
  try {
    neonConfig.webSocketConstructor = ws;
  } catch {}
}

declare global {
  var _pgPool: Pool | undefined;
  var _isDbInitialized: boolean | undefined;
}

export function getConnectionString(): string | null {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  if (process.env.POSTGRES_URL) {
    return process.env.POSTGRES_URL;
  }
  return null;
}

export function createPool(): Pool | null {
  const connString = getConnectionString();
  
  if (connString) {
    if (!global._pgPool) {
      global._pgPool = new Pool({
        connectionString: connString,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000
      });
      global._pgPool.on('error', (err) => {
        console.error('Unexpected database pool client error:', err);
      });
    }
    return global._pgPool;
  }

  return null;
}

const pool = createPool();
export const db = pool ? drizzle(pool, { schema }) : null;

// Initialize Database Schemas & Seed Data automatically if connected
export async function initializeDatabase() {
  if (!pool || global._isDbInitialized) return;

  try {
    const client = await pool.connect();
    try {
      // 1. Create Tables if not exist & auto-migrate schema additions
      await client.query(`
        CREATE TABLE IF NOT EXISTS players (
          id TEXT PRIMARY KEY,
          ign TEXT NOT NULL UNIQUE,
          uuid TEXT NOT NULL,
          avatar_url TEXT,
          discord_tag TEXT,
          region TEXT NOT NULL DEFAULT 'NA',
          edition TEXT NOT NULL DEFAULT 'BEDROCK',
          staff_role TEXT NOT NULL DEFAULT 'Player',
          overall_tier TEXT NOT NULL DEFAULT 'UNRANKED',
          total_points INTEGER NOT NULL DEFAULT 1000,
          win_rate REAL NOT NULL DEFAULT 0,
          matches_played INTEGER NOT NULL DEFAULT 0,
          matches_won INTEGER NOT NULL DEFAULT 0,
          gamemode_tiers JSONB NOT NULL,
          bio TEXT,
          joined_date TEXT NOT NULL,
          is_banned BOOLEAN NOT NULL DEFAULT FALSE,
          status TEXT NOT NULL DEFAULT 'Online',
          rank_title TEXT,
          socials JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS tier_history (
          id TEXT PRIMARY KEY,
          player_id TEXT REFERENCES players(id) ON DELETE CASCADE,
          player_ign TEXT NOT NULL,
          date TEXT NOT NULL,
          gamemode TEXT NOT NULL,
          old_tier TEXT NOT NULL,
          new_tier TEXT NOT NULL,
          reason TEXT,
          tester_ign TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS match_history (
          id TEXT PRIMARY KEY,
          player_id TEXT REFERENCES players(id) ON DELETE CASCADE,
          player_ign TEXT NOT NULL,
          date TEXT NOT NULL,
          gamemode TEXT NOT NULL,
          opponent_ign TEXT NOT NULL,
          score TEXT NOT NULL,
          result TEXT NOT NULL,
          tier_change TEXT,
          proof_url TEXT,
          tester_ign TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS tester_notes (
          id TEXT PRIMARY KEY,
          player_id TEXT REFERENCES players(id) ON DELETE CASCADE,
          author_ign TEXT NOT NULL,
          author_role TEXT NOT NULL,
          date TEXT NOT NULL,
          text TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'General',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS tier_applications (
          id TEXT PRIMARY KEY,
          player_id TEXT REFERENCES players(id) ON DELETE SET NULL,
          player_ign TEXT NOT NULL,
          region TEXT NOT NULL,
          edition TEXT NOT NULL DEFAULT 'BEDROCK',
          gamemode TEXT NOT NULL,
          requested_tier TEXT NOT NULL,
          proof_video_url TEXT NOT NULL,
          discord_tag TEXT NOT NULL,
          cps_average INTEGER NOT NULL DEFAULT 12,
          device_type TEXT NOT NULL DEFAULT 'Windows (KBM)',
          submitted_at TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'PENDING',
          assigned_tester_ign TEXT,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS test_matches (
          id TEXT PRIMARY KEY,
          application_id TEXT REFERENCES tier_applications(id) ON DELETE CASCADE,
          player_ign TEXT NOT NULL,
          tester_ign TEXT NOT NULL,
          edition TEXT NOT NULL DEFAULT 'BEDROCK',
          gamemode TEXT NOT NULL,
          region TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'SCHEDULED',
          scheduled_time TEXT NOT NULL,
          score_player INTEGER NOT NULL DEFAULT 0,
          score_tester INTEGER NOT NULL DEFAULT 0,
          assigned_tier_result TEXT,
          detailed_ratings JSONB,
          proof_url TEXT,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Safe Column Additions for existing databases
        ALTER TABLE players ADD COLUMN IF NOT EXISTS edition TEXT NOT NULL DEFAULT 'BEDROCK';
        ALTER TABLE players ADD COLUMN IF NOT EXISTS staff_role TEXT NOT NULL DEFAULT 'Player';
        ALTER TABLE tier_applications ADD COLUMN IF NOT EXISTS edition TEXT NOT NULL DEFAULT 'BEDROCK';
        ALTER TABLE test_matches ADD COLUMN IF NOT EXISTS edition TEXT NOT NULL DEFAULT 'BEDROCK';

        CREATE TABLE IF NOT EXISTS staff_members (
          id TEXT PRIMARY KEY,
          ign TEXT NOT NULL UNIQUE,
          role TEXT NOT NULL DEFAULT 'Tester',
          avatar_url TEXT,
          region TEXT NOT NULL DEFAULT 'GLOBAL',
          tests_conducted INTEGER NOT NULL DEFAULT 0,
          approval_rate REAL NOT NULL DEFAULT 100,
          status TEXT NOT NULL DEFAULT 'Active',
          joined_date TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS announcements (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'ANNOUNCEMENT',
          timestamp TEXT NOT NULL,
          author TEXT NOT NULL DEFAULT 'Admin',
          urgent BOOLEAN NOT NULL DEFAULT FALSE,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
          id TEXT PRIMARY KEY,
          timestamp TEXT NOT NULL,
          actor TEXT NOT NULL,
          action TEXT NOT NULL,
          details TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'SYSTEM',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS discord_users (
          id TEXT PRIMARY KEY,
          username TEXT NOT NULL,
          discriminator TEXT,
          global_name TEXT,
          avatar_url TEXT,
          staff_role TEXT NOT NULL DEFAULT 'Player',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS system_settings (
          id TEXT PRIMARY KEY DEFAULT 'global',
          site_title TEXT NOT NULL DEFAULT 'MCPE GALAXY TIER SYSTEM',
          discord_webhook_url TEXT,
          auto_role_enabled BOOLEAN NOT NULL DEFAULT TRUE,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // 2. Synchronize initial 20 competitive players dataset
      console.log('Synchronizing official 20 competitive players dataset...');
      for (const p of INITIAL_PLAYERS) {
        await client.query(`
          INSERT INTO players (id, ign, uuid, avatar_url, discord_tag, region, edition, staff_role, overall_tier, total_points, win_rate, matches_played, matches_won, gamemode_tiers, bio, joined_date, is_banned, status, rank_title, socials)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
          ON CONFLICT (id) DO UPDATE SET
            ign = EXCLUDED.ign,
            uuid = EXCLUDED.uuid,
            avatar_url = EXCLUDED.avatar_url,
            discord_tag = EXCLUDED.discord_tag,
            region = EXCLUDED.region,
            edition = EXCLUDED.edition,
            staff_role = EXCLUDED.staff_role,
            overall_tier = EXCLUDED.overall_tier,
            total_points = EXCLUDED.total_points,
            win_rate = EXCLUDED.win_rate,
            matches_played = EXCLUDED.matches_played,
            matches_won = EXCLUDED.matches_won,
            gamemode_tiers = EXCLUDED.gamemode_tiers,
            bio = EXCLUDED.bio,
            rank_title = EXCLUDED.rank_title;
        `, [
          p.id, p.ign, p.uuid, p.avatarUrl, p.discordTag, p.region, p.edition || 'BEDROCK', p.staffRole || 'Player', p.overallTier,
          p.totalPoints, p.winRate, p.matchesPlayed, p.matchesWon,
          JSON.stringify(p.gamemodeTiers), p.bio, p.joinedDate, p.isBanned,
          p.status, p.rankTitle, JSON.stringify(p.socials || {})
        ]);

        for (const th of p.tierHistory) {
          await client.query(`
            INSERT INTO tier_history (id, player_id, player_ign, date, gamemode, old_tier, new_tier, reason, tester_ign)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT DO NOTHING;
          `, [th.id, p.id, p.ign, th.date, th.gamemode, th.oldTier, th.newTier, th.reason, th.testerIgn]);
        }

        for (const mh of p.matchHistory) {
          await client.query(`
            INSERT INTO match_history (id, player_id, player_ign, date, gamemode, opponent_ign, score, result, tier_change, tester_ign)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT DO NOTHING;
          `, [mh.id, p.id, p.ign, mh.date, mh.gamemode, mh.opponentIgn, mh.score, mh.result, mh.tierChange, mh.testerIgn]);
        }

        for (const tn of p.testerNotes) {
          await client.query(`
            INSERT INTO tester_notes (id, player_id, author_ign, author_role, date, text, category)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT DO NOTHING;
          `, [tn.id, p.id, tn.authorIgn, tn.authorRole, tn.date, tn.text, tn.category]);
        }
      }

      // Keep only official 20 players in the database
      const validIds = INITIAL_PLAYERS.map(p => `'${p.id}'`).join(',');
      await client.query(`DELETE FROM players WHERE id NOT IN (${validIds});`);

      for (const app of INITIAL_APPLICATIONS) {
        await client.query(`
          INSERT INTO tier_applications (id, player_id, player_ign, region, gamemode, requested_tier, proof_video_url, discord_tag, cps_average, device_type, submitted_at, status, assigned_tester_ign, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT DO NOTHING;
        `, [
          app.id, app.playerId, app.playerIgn, app.region, app.gamemode, app.requestedTier,
          app.proofVideoUrl, app.discordTag, app.cpsAverage, app.deviceType, app.submittedAt,
          app.status, app.assignedTesterIgn || null, app.notes
        ]);
      }

      for (const m of INITIAL_MATCHES) {
        await client.query(`
          INSERT INTO test_matches (id, application_id, player_ign, tester_ign, gamemode, region, status, scheduled_time, score_player, score_tester, assigned_tier_result, detailed_ratings, proof_url, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT DO NOTHING;
        `, [
          m.id, m.applicationId, m.playerIgn, m.testerIgn, m.gamemode, m.region,
          m.status, m.scheduledTime, m.scorePlayer, m.scoreTester, m.assignedTierResult || null,
          JSON.stringify(m.detailedRatings || {}), m.proofUrl, m.notes
        ]);
      }

      for (const s of INITIAL_STAFF) {
        await client.query(`
          INSERT INTO staff_members (id, ign, role, avatar_url, region, tests_conducted, approval_rate, status, joined_date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT DO NOTHING;
        `, [s.id, s.ign, s.role, s.avatarUrl, s.region, s.testsConducted, s.approvalRate, s.status, s.joinedDate]);
      }

      for (const a of INITIAL_ANNOUNCEMENTS) {
        await client.query(`
          INSERT INTO announcements (id, title, content, type, timestamp, author, urgent, active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING;
        `, [a.id, a.title, a.content, a.type, a.timestamp, a.author, a.urgent || false, true]);
      }

      for (const l of INITIAL_LOGS) {
        await client.query(`
          INSERT INTO audit_logs (id, timestamp, actor, action, details, type)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING;
        `, [l.id, l.timestamp, l.actor, l.action, l.details, l.type]);
      }

      await client.query(`
        INSERT INTO system_settings (id, site_title, discord_webhook_url, auto_role_enabled)
        VALUES ('global', 'MCPE GALAXY TIER SYSTEM', $1, true)
        ON CONFLICT (id) DO NOTHING;
      `, [process.env.DISCORD_WEBHOOK_URL || null]);

      global._isDbInitialized = true;
      console.log('Database initialized successfully.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error initializing database schema/seed:', err);
  }
}
