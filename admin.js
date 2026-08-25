const AUTH_SESSION_KEY = 'mcpegalaxy_admin_session';

let state = {
  platform: 'java',
  editIndex: -1,
  editing: false
};

function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" style="color: ${type === 'success' ? 'var(--cyan)' : 'var(--purple)'}"></i>
    ${message}
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function isLoggedIn() {
  try { return Boolean(sessionStorage.getItem('mcpegalaxy_admin_token')); } catch (e) { return false; }
}

async function serverLogin(password) {
  const res = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password}) });
  const body = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(body.error || 'Login failed.');
  sessionStorage.setItem('mcpegalaxy_admin_token', body.token);
  return body;
}

async function syncServerData() {
  try {
    const data = await fetchData();
    renderAll(data);
  } catch (e) { console.warn(e); }
}

function login() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('adminView').style.display = 'block';
  renderAll();
}

function logout() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem('mcpegalaxy_admin_token');
  document.getElementById('loginView').style.display = 'flex';
  document.getElementById('adminView').style.display = 'none';
  document.getElementById('loginPass').value = '';
}

// ---------- RENDERING ----------
function tierClass(tier) {
  if (tier.startsWith('HT')) return 'tier-ht';
  if (tier.startsWith('MT')) return 'tier-mt';
  return 'tier-lt';
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function renderStats(data) {
  document.getElementById('statJava').textContent = data.java.length;
  document.getElementById('statBedrock').textContent = data.bedrock.length;
  document.getElementById('statLogs').textContent = data.logs.length;
}

function renderPlayerList(data) {
  const list = document.getElementById('playerList');
  const players = data[state.platform];
  if (!players.length) {
    list.innerHTML = '<div class="admin-empty">No players on this leaderboard yet. Drag rows to reorder.</div>';
    return;
  }
  list.innerHTML = players.map((p, i) => `
    <div class="admin-list-item" draggable="true" data-index="${i}">
      <i class="fas fa-grip-vertical drag-handle" title="Drag to reorder"></i>
      <div class="info">
        <b>${i + 1}. ${escapeHtml(p.name)}${p.owner ? ' <span style="color:var(--cyan); font-size:10px;">OWNER</span>' : ''}</b>
        <span>${escapeHtml(p.tier)} &bull; ${Number(p.rating).toLocaleString()} rating &bull; ${p.wins} wins &bull; ${p.kd} K/D</span>
      </div>
      <div class="actions">
        <button class="admin-btn ghost sm" data-edit="${i}"><i class="fas fa-pen"></i></button>
        <button class="admin-btn danger sm" data-del="${i}"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');

  list.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => startEdit(parseInt(btn.dataset.edit)));
  });
  list.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => deletePlayer(parseInt(btn.dataset.del)));
  });

  initDragReorder(list);
}

// ---------- DRAG & DROP REORDER ----------
let dragIndex = null;

function initDragReorder(list) {
  list.addEventListener('dragstart', e => {
    const item = e.target.closest('.admin-list-item');
    if (!item) return;
    dragIndex = parseInt(item.dataset.index);
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });

  list.addEventListener('dragover', e => {
    e.preventDefault();
    const item = e.target.closest('.admin-list-item');
    if (!item) return;
    const after = e.clientY > item.getBoundingClientRect().top + item.getBoundingClientRect().height / 2;
    list.querySelectorAll('.drop-before, .drop-after').forEach(el => el.classList.remove('drop-before', 'drop-after'));
    item.classList.add(after ? 'drop-after' : 'drop-before');
  });

  list.addEventListener('dragleave', e => {
    const item = e.target.closest('.admin-list-item');
    if (item) item.classList.remove('drop-before', 'drop-after');
  });

  list.addEventListener('drop', e => {
    e.preventDefault();
    const item = e.target.closest('.admin-list-item');
    if (!item) return;
    const targetIndex = parseInt(item.dataset.index);
    list.querySelectorAll('.drop-before, .drop-after').forEach(el => el.classList.remove('drop-before', 'drop-after'));
    if (dragIndex === null || dragIndex === targetIndex) return;

    const data = loadData();
    const arr = data[state.platform];
    const [moved] = arr.splice(dragIndex, 1);
    arr.splice(targetIndex, 0, moved);
    saveData(data);
    renderAll();
    showToast('Leaderboard order updated.');
  });

  list.addEventListener('dragend', () => {
    dragIndex = null;
    list.querySelectorAll('.dragging, .drop-before, .drop-after').forEach(el => el.classList.remove('dragging', 'drop-before', 'drop-after'));
  });
}

function renderLogList(data) {
  const list = document.getElementById('logList');
  if (!data.logs.length) {
    list.innerHTML = '<div class="admin-empty">No log entries yet.</div>';
    return;
  }
  list.innerHTML = data.logs.map((log, i) => `
    <div class="admin-list-item">
      <div class="info">
        <b>${escapeHtml(log.title)}</b>
        <span>${escapeHtml(log.date)} &bull; ${escapeHtml(log.tag.toUpperCase())} &bull; ${escapeHtml(log.text)}</span>
      </div>
      <div class="actions">
        <button class="admin-btn danger sm" data-logdel="${i}"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');

  list.querySelectorAll('[data-logdel]').forEach(btn => {
    btn.addEventListener('click', () => deleteLog(parseInt(btn.dataset.logdel)));
  });
}

function renderAll(data = loadData()) {
  renderStats(data);
  renderPlayerList(data);
  renderLogList(data);
  document.getElementById('lDate').value = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ---------- PLAYER CRUD ----------
function startEdit(index) {
  const data = loadData();
  const p = data[state.platform][index];
  if (!p) return;
  state.editing = true;
  state.editIndex = index;
  document.getElementById('formTitle').innerHTML = '<i class="fas fa-pen" style="color:var(--cyan);"></i> Edit Player';
  document.getElementById('playerSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Update Player';
  document.getElementById('playerCancelBtn').style.display = 'inline-flex';
  document.getElementById('pPlatform').value = state.platform;
  document.getElementById('pName').value = p.name;
  document.getElementById('pTier').value = p.tier;
  document.getElementById('pRating').value = p.rating;
  document.getElementById('pWins').value = p.wins;
  document.getElementById('pKd').value = p.kd;
  document.getElementById('pTrend').value = p.trend;
}

function cancelEdit() {
  state.editing = false;
  state.editIndex = -1;
  document.getElementById('playerForm').reset();
  document.getElementById('formTitle').innerHTML = '<i class="fas fa-plus" style="color:var(--cyan);"></i> Add Player';
  document.getElementById('playerSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Save Player';
  document.getElementById('playerCancelBtn').style.display = 'none';
}

function savePlayer(e) {
  e.preventDefault();
  const data = loadData();
  const platform = document.getElementById('pPlatform').value;
  const name = document.getElementById('pName').value.trim();
  const tier = document.getElementById('pTier').value;
  const rating = parseInt(document.getElementById('pRating').value) || 0;
  const wins = parseInt(document.getElementById('pWins').value) || 0;
  const kd = document.getElementById('pKd').value.trim();
  const trend = document.getElementById('pTrend').value;

  if (!name || !kd) {
    showToast('Name and K/D are required.', 'error');
    return;
  }

  const player = { name, owner: name.toLowerCase() === 'maxxaaaaaaa', tier, rating, wins, kd, trend };
  const action = state.editing ? 'Updated' : 'Added';

  if (state.editing && state.editIndex >= 0) {
    data[state.platform][state.editIndex] = player;
  } else {
    data[platform].unshift(player);
    data[platform] = data[platform].slice(0, 10);
  }

  saveData(data);
  saveDataToServer(data).then(() => {
    logPlayerChange(action, platform === 'bedrock' ? 'Bedrock' : 'Java', player, MCG_COLORS.purple);
    showToast(`${action} ${name} on ${platform === 'bedrock' ? 'Bedrock' : 'Java'}!`);
  }).catch(err => showToast(`Saved locally, server sync failed: ${err.message}`, 'error'));
  cancelEdit();
  renderAll(data);
}

function deletePlayer(index) {
  const data = loadData();
  const p = data[state.platform][index];
  if (!p) return;
  if (!confirm(`Delete ${p.name} from ${state.platform} leaderboard?`)) return;
  data[state.platform].splice(index, 1);
  saveData(data);
  saveDataToServer(data).then(() => {
    logPlayerChange('Removed', state.platform === 'bedrock' ? 'Bedrock' : 'Java', p, MCG_COLORS.red);
    showToast(`Removed ${p.name}.`);
  }).catch(err => showToast(`Saved locally, server sync failed: ${err.message}`, 'error'));
  renderAll(data);
}

// ---------- LOG CRUD ----------
function saveLog(e) {
  e.preventDefault();
  const data = loadData();
  const date = document.getElementById('lDate').value.trim();
  const tag = document.getElementById('lTag').value;
  const title = document.getElementById('lTitle').value.trim();
  const text = document.getElementById('lText').value.trim();

  if (!title || !text) {
    showToast('Title and details are required.', 'error');
    return;
  }

  const entry = { date, tag, title, text };
  data.logs.unshift(entry);
  data.logs = data.logs.slice(0, 30);
  saveData(data);
  saveDataToServer(data).then(() => {
    logLogEntry('Added', entry);
    showToast('Log posted to the site + Discord!');
  }).catch(err => showToast(`Saved locally, server sync failed: ${err.message}`, 'error'));
  document.getElementById('logForm').reset();
  document.getElementById('lDate').value = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  renderAll();
}

function deleteLog(index) {
  const data = loadData();
  const log = data.logs[index];
  if (!log) return;
  if (!confirm(`Delete log "${log.title}"?`)) return;
  data.logs.splice(index, 1);
  saveData(data);
  saveDataToServer(data).then(() => {
    logLogEntry('Deleted', log);
    showToast('Log deleted.');
  }).catch(err => showToast(`Saved locally, server sync failed: ${err.message}`, 'error'));
  renderAll(data);
}

// ---------- SETTINGS ----------
async function changePassword(e) {
  e.preventDefault();
  const oldPass = document.getElementById('oldPass').value;
  const newPass = document.getElementById('newPass').value;
  const btn = e.target.querySelector('button[type="submit"]');
  const token = sessionStorage.getItem('mcpegalaxy_admin_token');
  if (btn) btn.disabled = true;
  try {
    const res = await fetch('/api/admin/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token || '' },
      body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || 'Failed to update password.');
    sessionStorage.setItem('mcpegalaxy_admin_token', body.token);
    document.getElementById('passForm').reset();
    showToast('Admin password updated!');
  } catch (err) {
    showToast(err.message || 'Failed to update password.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}


function testWebhook() {
  sendEmbed(
    '\u2705 Webhook Connected',
    '**MCPE GALAXY** admin panel is now live — player changes and log entries will appear here.',
    MCG_COLORS.green,
    [{ name: 'From', value: 'Admin Panel', inline: true }],
    'MCPE GALAXY Admin'
  ).then(ok => {
    if (ok) showToast('Test message sent to Discord!');
    else showToast('Webhook failed to send.', 'error');
  });
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) { login(); syncServerData(); }

  document.getElementById('loginBtn').addEventListener('click', async () => {
    const pass = document.getElementById('loginPass').value;
    const err = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    err.textContent = 'Checking…';
    try {
      await serverLogin(pass);
      err.textContent = '';
      login();
      await syncServerData();
    } catch (e) {
      err.textContent = e.message || 'Wrong password.';
    } finally { btn.disabled = false; }
  });
  document.getElementById('loginPass').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('loginBtn').click();
  });

  document.getElementById('logoutBtn').addEventListener('click', logout);

  document.querySelectorAll('.admin-tab[data-panel]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab[data-panel]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(btn.dataset.panel).classList.add('active');
    });
  });

  document.querySelectorAll('.admin-tab[data-lb-list]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab[data-lb-list]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.platform = btn.dataset.lbList;
      renderAll();
    });
  });

  document.getElementById('playerForm').addEventListener('submit', savePlayer);
  document.getElementById('playerCancelBtn').addEventListener('click', cancelEdit);
  document.getElementById('logForm').addEventListener('submit', saveLog);
  document.getElementById('passForm').addEventListener('submit', changePassword);
  document.getElementById('testWebhookBtn').addEventListener('click', testWebhook);

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Reset leaderboards and logs back to the default sample data? This cannot be undone.')) return;
    const data = resetData();
    saveDataToServer(data).then(() => showToast('Data reset to defaults.')).catch(err => showToast(`Reset saved locally, server sync failed: ${err.message}`, 'error'));
    renderAll(data);
  });
});
