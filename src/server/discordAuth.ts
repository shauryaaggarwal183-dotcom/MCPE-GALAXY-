import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { DiscordUser } from '../types/index.js';

const DISCORD_API = 'https://discord.com/api/v10';

function getEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return val;
}

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || 'dev_only_insecure_secret_change_me';
}

export const SESSION_COOKIE_NAME = 'mcpe_session';

/**
 * Builds the real, official Discord authorization URL.
 * The user is fully redirected to discord.com to log in and approve access -
 * this app never sees their Discord password.
 */
export function buildDiscordAuthorizeUrl(state: string): string {
  const clientId = getEnv('DISCORD_CLIENT_ID');
  const redirectUri = getEnv('DISCORD_REDIRECT_URI');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify',
    state,
    prompt: 'consent'
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export function generateOAuthState(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Exchanges the authorization code Discord sent back for a real access token.
 */
export async function exchangeCodeForToken(code: string): Promise<{ access_token: string; token_type: string }> {
  const clientId = getEnv('DISCORD_CLIENT_ID');
  const clientSecret = getEnv('DISCORD_CLIENT_SECRET');
  const redirectUri = getEnv('DISCORD_REDIRECT_URI');

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri
  });

  const res = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Discord token exchange failed: ${res.status} ${errText}`);
  }

  return res.json();
}

/**
 * Calls Discord's real /users/@me endpoint with the access token to fetch
 * the actual authenticated user's profile.
 */
export async function fetchDiscordProfile(accessToken: string): Promise<{
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
}> {
  const res = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch Discord profile: ${res.status} ${errText}`);
  }

  return res.json();
}

export function buildAvatarUrl(discordId: string, avatarHash: string | null, discriminator: string): string {
  if (avatarHash) {
    const ext = avatarHash.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.${ext}?size=256`;
  }
  // Discord's default embed avatar for users with no custom avatar
  const fallbackIndex = discriminator && discriminator !== '0'
    ? Number(discriminator) % 5
    : (Number(BigInt(discordId) >> 22n) % 6);
  return `https://cdn.discordapp.com/embed/avatars/${fallbackIndex}.png`;
}

/** Signs a session token for a logged-in Discord user (httpOnly cookie payload). */
export function signSession(user: DiscordUser): string {
  return jwt.sign(user, getSessionSecret(), { expiresIn: '30d' });
}

/** Verifies and decodes a session cookie. Returns null if invalid/expired/tampered. */
export function verifySession(token: string): DiscordUser | null {
  try {
    return jwt.verify(token, getSessionSecret()) as DiscordUser;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
};
