const MCG_SESSION_KEY = 'mcpegalaxy_discord_session';

function getDiscordSession() {
  try {
    const raw = sessionStorage.getItem(MCG_SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s && s.user && s.user.id) return s;
  } catch (e) {}
  return null;
}

function saveDiscordSession(session) {
  try { sessionStorage.setItem(MCG_SESSION_KEY, JSON.stringify(session)); } catch (e) {}
}

function clearDiscordSession() {
  try { sessionStorage.removeItem(MCG_SESSION_KEY); } catch (e) {}
}

function loginWithDiscord() {
  const params = new URLSearchParams({
    client_id: MCG_CLIENT_ID,
    response_type: 'token',
    redirect_uri: mcgRedirectUri(),
    scope: MCG_SCOPE,
    prompt: 'consent'
  });
  window.location.href = 'https://discord.com/api/oauth2/authorize?' + params.toString();
}

async function handleDiscordRedirect() {
  const hash = window.location.hash.substring(1);
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const token = params.get('access_token');
  if (!token) return null;
  history.replaceState(null, '', window.location.pathname + window.location.search);
  try {
    const res = await fetch('https://discord.com/api/users/@me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) return null;
    const user = await res.json();
    const session = { token, user };
    saveDiscordSession(session);
    return session;
  } catch (e) {
    return null;
  }
}

function createPreviewSession() {
  const session = { token: 'preview', user: { id: 'preview', username: 'PreviewUser' } };
  saveDiscordSession(session);
  return session;
}

function logoutDiscord() {
  clearDiscordSession();
  window.location.href = 'index.html';
}

function userAvatarUrl(user, size) {
  if (!user || !user.avatar) return '';
  const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=${size || 64}`;
}
