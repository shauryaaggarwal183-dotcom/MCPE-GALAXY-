export function getAdminPasskey(): string {
  return sessionStorage.getItem('admin_passkey') || 'mcpegalaxy123';
}

export async function apiFetch<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const passkey = getAdminPasskey();
  if (passkey) {
    headers.set('x-admin-passkey', passkey);
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMsg = `Request failed with status ${response.status}`;
    if (data && typeof data === 'object' && data.error) {
      errorMsg = data.error;
    } else if (typeof data === 'string' && data.trim()) {
      errorMsg = data.length > 200 ? `${data.substring(0, 200)}...` : data;
    }
    throw new Error(errorMsg);
  }

  return data as T;
}

// Granular API calls
export const api = {
  getInitialData: () => apiFetch('/api/data'),
  
  // Players
  getPlayers: (params?: { region?: string; gamemode?: string; search?: string; tier?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch(`/api/players${query ? `?${query}` : ''}`);
  },
  getPlayer: (id: string) => apiFetch(`/api/players/${encodeURIComponent(id)}`),
  createPlayer: (playerData: any) => apiFetch('/api/players', { method: 'POST', body: JSON.stringify(playerData) }),
  updatePlayer: (id: string, playerData: any) => apiFetch(`/api/players/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(playerData) }),
  deletePlayer: (id: string) => apiFetch(`/api/players/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  promotePlayer: (playerIgn: string, newTier: string, gamemode?: string) => apiFetch('/api/players/promote', { method: 'POST', body: JSON.stringify({ playerIgn, newTier, gamemode }) }),
  toggleBanPlayer: (playerIgn: string) => apiFetch('/api/players/ban', { method: 'POST', body: JSON.stringify({ playerIgn }) }),

  // Applications
  getApplications: () => apiFetch('/api/applications'),
  submitApplication: (appData: any) => apiFetch('/api/applications', { method: 'POST', body: JSON.stringify(appData) }),
  updateApplicationStatus: (id: string, status: string, assignedTesterIgn?: string, notes?: string) => 
    apiFetch(`/api/applications/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status, assignedTesterIgn, notes }) }),

  // Matches
  getMatches: () => apiFetch('/api/matches'),
  createMatch: (matchData: any) => apiFetch('/api/matches', { method: 'POST', body: JSON.stringify(matchData) }),
  submitMatchResult: (matchId: string, resultData: any) => 
    apiFetch(`/api/matches/${encodeURIComponent(matchId)}/submit`, { method: 'POST', body: JSON.stringify(resultData) }),

  // Staff
  getStaff: () => apiFetch('/api/staff'),
  createStaff: (staffData: any) => apiFetch('/api/staff', { method: 'POST', body: JSON.stringify(staffData) }),
  updateStaff: (id: string, staffData: any) => apiFetch(`/api/staff/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(staffData) }),
  deleteStaff: (id: string) => apiFetch(`/api/staff/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Announcements
  getAnnouncements: () => apiFetch('/api/announcements'),
  createAnnouncement: (annData: any) => apiFetch('/api/announcements', { method: 'POST', body: JSON.stringify(annData) }),

  // Settings & Discord
  getSettings: () => apiFetch('/api/settings'),
  updateSettings: (settingsData: any) => apiFetch('/api/settings', { method: 'POST', body: JSON.stringify(settingsData) }),
  testDiscordWebhook: (webhookUrl?: string) => apiFetch('/api/discord/webhook-test', { method: 'POST', body: JSON.stringify({ webhookUrl }) }),

  // Analytics & Logs
  getAnalytics: () => apiFetch('/api/analytics'),
  getLogs: () => apiFetch('/api/logs')
};

// ---------------- Real Discord OAuth2 Auth ----------------
export const auth = {
  // Full-page redirect to Discord's real consent screen
  loginUrl: '/api/auth/discord/login',

  // Ask the server who (if anyone) is currently logged in via the session cookie
  getMe: async (): Promise<{ user: import('../types').DiscordUser | null }> => {
    try {
      return await apiFetch('/api/auth/me');
    } catch {
      return { user: null };
    }
  },

  logout: () => apiFetch('/api/auth/logout', { method: 'POST' })
};
