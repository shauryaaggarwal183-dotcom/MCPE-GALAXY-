const MCG_KEY = 'mcpegalaxy_data_v2';
const MCG_LAST_VISIT_KEY = 'mcpegalaxy_last_visit';
const MCG_API = '/api';

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

function cloneDefault() { return JSON.parse(JSON.stringify(DEFAULT_DATA)); }
function loadData() {
  try {
    const raw = localStorage.getItem(MCG_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (d && Array.isArray(d.java) && Array.isArray(d.bedrock) && Array.isArray(d.logs)) return d;
    }
  } catch (e) {}
  const d = cloneDefault(); saveData(d); return d;
}
function saveData(data) { try { localStorage.setItem(MCG_KEY, JSON.stringify(data)); } catch (e) {} }
async function fetchData() {
  try {
    const res = await fetch(`${MCG_API}/data`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json(); saveData(data); return data;
  } catch (e) { console.warn('Using local data cache:', e.message); return loadData(); }
}
async function saveDataToServer(data) {
  const token = sessionStorage.getItem('mcpegalaxy_admin_token');
  const res = await fetch(`${MCG_API}/admin/data`, { method:'POST', headers:{'Content-Type':'application/json','X-Admin-Token':token || ''}, body:JSON.stringify(data) });
  const body = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
  saveData(body.data || data); return body.data || data;
}
function resetData() { const d = cloneDefault(); saveData(d); return d; }
function canLogVisit() {
  try { const last = parseInt(localStorage.getItem(MCG_LAST_VISIT_KEY) || '0'); if (Date.now()-last > 10*60*1000) { localStorage.setItem(MCG_LAST_VISIT_KEY,String(Date.now())); return true; } } catch(e) {} return false;
}
