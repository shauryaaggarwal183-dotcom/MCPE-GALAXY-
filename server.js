const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data.json');
const ADMIN_STORE_FILE = path.join(ROOT, 'admin-store.json');
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mcpe_galaxy123';
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';
const sessions = new Map();

// ---------- ADMIN PASSWORD (hashed, persisted to disk, changeable live from the admin panel) ----------
function hashPassword(password, salt) {
  return crypto.scryptSync(String(password), salt, 64).toString('hex');
}
function loadAdminStore() {
  if (fs.existsSync(ADMIN_STORE_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(ADMIN_STORE_FILE, 'utf8'));
      if (parsed && parsed.salt && parsed.hash) return parsed;
    } catch (e) { /* fall through and re-seed */ }
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const store = { salt, hash: hashPassword(DEFAULT_ADMIN_PASSWORD, salt) };
  fs.writeFileSync(ADMIN_STORE_FILE, JSON.stringify(store, null, 2));
  return store;
}
let adminStore = loadAdminStore();
function verifyPassword(password) {
  if (typeof password !== 'string' || !password) return false;
  const candidate = Buffer.from(hashPassword(password, adminStore.salt));
  const current = Buffer.from(adminStore.hash);
  if (candidate.length !== current.length) return false;
  return crypto.timingSafeEqual(candidate, current);
}
function setPassword(newPassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  adminStore = { salt, hash: hashPassword(newPassword, salt) };
  fs.writeFileSync(ADMIN_STORE_FILE, JSON.stringify(adminStore, null, 2));
}

const DEFAULT_DATA = {
  java: [
    { name: 'Maxxaaaaaaa', owner: true, tier: 'HT1', rating: 2340, wins: 152, kd: '3.84', trend: 'up' },
    { name: 'Zephyr', owner: false, tier: 'HT2', rating: 2180, wins: 137, kd: '3.41', trend: 'up' },
    { name: 'KriZz', owner: false, tier: 'HT3', rating: 2095, wins: 128, kd: '3.22', trend: 'down' },
    { name: 'RiftGod', owner: false, tier: 'MT1', rating: 1940, wins: 119, kd: '2.97', trend: 'up' },
    { name: 'VoidKnight', owner: false, tier: 'MT2', rating: 1875, wins: 104, kd: '2.71', trend: 'down' },
    { name: 'NovaPvP', owner: false, tier: 'MT3', rating: 1802, wins: 97, kd: '2.55', trend: 'up' },
    { name: 'ShadowByte', owner: false, tier: 'LT1', rating: 1720, wins: 88, kd: '2.33', trend: 'up' },
    { name: 'Eclipse', owner: false, tier: 'LT2', rating: 1648, wins: 79, kd: '2.11', trend: 'down' }
  ],
  bedrock: [
    { name: 'Maxxaaaaaaa', owner: true, tier: 'HT1', rating: 2310, wins: 148, kd: '3.76', trend: 'up' },
    { name: 'TitanFury', owner: false, tier: 'HT2', rating: 2145, wins: 133, kd: '3.38', trend: 'up' },
    { name: 'Akuma', owner: false, tier: 'HT3', rating: 2060, wins: 125, kd: '3.15', trend: 'down' },
    { name: 'Pulse', owner: false, tier: 'MT1', rating: 1912, wins: 117, kd: '2.89', trend: 'up' },
    { name: 'GamerZone', owner: false, tier: 'MT2', rating: 1843, wins: 110, kd: '2.66', trend: 'down' },
    { name: 'BlazeIt', owner: false, tier: 'MT3', rating: 1776, wins: 101, kd: '2.49', trend: 'up' },
    { name: 'DarkSoul', owner: false, tier: 'LT1', rating: 1689, wins: 92, kd: '2.27', trend: 'up' },
    { name: 'CyberPvP', owner: false, tier: 'LT2', rating: 1620, wins: 85, kd: '2.14', trend: 'down' }
  ],
  logs: [
    { date: 'Aug 14, 2026', tag: 'new', title: 'v1.0 — Website Launch', text: 'MCPE GALAXY website goes live with leaderboards, the full tier system, about section and a changelog that syncs to Discord.' },
    { date: 'Aug 10, 2026', tag: 'feat', title: 'Tier System Rollout', text: 'HT / MT / LT tier ladder introduced for both Java & Bedrock with 1v1 PvP testing placements.' },
    { date: 'Aug 02, 2026', tag: 'fix', title: 'Leaderboard Accuracy', text: 'Match result handling reworked — ratings and K/D now update instantly after every ranked fight.' },
    { date: 'Jul 21, 2026', tag: 'feat', title: 'Bedrock Support', text: 'Full Bedrock platform added with its own leaderboard and tier ladder alongside Java.' },
    { date: 'Jul 01, 2026', tag: 'launch', title: 'Server Founded', text: 'MCPE GALAXY founded by Maxxaaaaaaa as a dedicated PvP testing community.' }
  ]
};

function ensureData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
}
function readData() {
  ensureData();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeData(data) {
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}
function json(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS' });
  res.end(text);
}
function getBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; if (raw.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}
function auth(req) {
  const token = req.headers['x-admin-token'];
  return typeof token === 'string' && sessions.has(token);
}
async function discord(payload) {
  if (!DISCORD_WEBHOOK_URL) return { ok: false, error: 'DISCORD_WEBHOOK_URL is not configured.' };
  const response = await fetch(DISCORD_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  return { ok: response.ok, status: response.status, error: response.ok ? null : await response.text() };
}

ensureData();

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return json(res, 204, {});
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (url.pathname === '/api/health') return json(res, 200, { ok: true, discord: Boolean(DISCORD_WEBHOOK_URL), time: new Date().toISOString() });
    if (url.pathname === '/api/data' && req.method === 'GET') return json(res, 200, readData());

    if (url.pathname === '/api/admin/login' && req.method === 'POST') {
      const body = await getBody(req);
      if (!verifyPassword(body.password)) return json(res, 401, { ok: false, error: 'Invalid password.' });
      const token = crypto.randomBytes(32).toString('hex');
      sessions.set(token, Date.now());
      setTimeout(() => sessions.delete(token), 8 * 60 * 60 * 1000);
      return json(res, 200, { ok: true, token });
    }

    if (url.pathname === '/api/admin/password' && req.method === 'POST') {
      if (!auth(req)) return json(res, 401, { ok: false, error: 'Unauthorized.' });
      const body = await getBody(req);
      if (!verifyPassword(body.oldPassword)) return json(res, 401, { ok: false, error: 'Current password is incorrect.' });
      if (typeof body.newPassword !== 'string' || body.newPassword.length < 4) return json(res, 400, { ok: false, error: 'New password must be at least 4 characters.' });
      setPassword(body.newPassword);
      sessions.clear();
      const token = crypto.randomBytes(32).toString('hex');
      sessions.set(token, Date.now());
      setTimeout(() => sessions.delete(token), 8 * 60 * 60 * 1000);
      return json(res, 200, { ok: true, token });
    }

    if (url.pathname === '/api/admin/data' && req.method === 'POST') {
      if (!auth(req)) return json(res, 401, { ok: false, error: 'Unauthorized.' });
      const body = await getBody(req);
      if (!body || !Array.isArray(body.java) || !Array.isArray(body.bedrock) || !Array.isArray(body.logs)) return json(res, 400, { ok: false, error: 'Invalid data.' });
      writeData(body);
      return json(res, 200, { ok: true, data: body });
    }

    if (url.pathname === '/api/visit' && req.method === 'POST') {
      const body = await getBody(req);
      const result = await discord(body.payload || {});
      return json(res, result.ok ? 200 : 502, result);
    }

    if (url.pathname === '/api/admin/discord' && req.method === 'POST') {
      if (!auth(req)) return json(res, 401, { ok: false, error: 'Unauthorized.' });
      const body = await getBody(req);
      const result = await discord(body.payload || {});
      return json(res, result.ok ? 200 : 502, result);
    }

    const safePath = path.normalize(url.pathname === '/' ? '/index.html' : url.pathname).replace(/^([.][.][/\\])+/, '');
    const file = path.join(ROOT, safePath);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return json(res, 404, { error: 'Not found' });
    const ext = path.extname(file).toLowerCase();
    const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600' });
    fs.createReadStream(file).pipe(res);
  } catch (e) {
    console.error(e);
    json(res, 500, { ok: false, error: 'Internal server error.' });
  }
});

server.listen(PORT, HOST, () => console.log(`MCPE GALAXY running at http://localhost:${PORT}`));
