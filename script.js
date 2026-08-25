// ============ SCROLL ANIMATIONS ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-in, .fade-in-group > *').forEach(el => observer.observe(el));

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      closeNav();
    }
  });
});

document.querySelectorAll('.nav-link:not([href^="#"])').forEach(link => {
  link.addEventListener('click', () => closeNav());
});

// ============ NAVBAR ============
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
}

function closeNav() {
  if (navToggle) navToggle.classList.remove('active');
  if (navLinks) navLinks.classList.remove('open');
}

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

function updateActiveNav() {
  if (!navbar) return;
  const sections = document.querySelectorAll('section[id], footer[id]');
  const links = document.querySelectorAll('.nav-link:not(.nav-cta)');
  let current = '';
  sections.forEach(s => {
    const top = s.offsetTop - 160;
    if (window.scrollY >= top) current = s.getAttribute('id');
  });
  links.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

// ============ COUNTER ANIMATION ============
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      if (!el.dataset.animated) {
        el.dataset.animated = 'true';
        const suffix = el.closest('.stat-item').querySelector('.stat-label')?.textContent.includes('Uptime') ? '%' : '+';
        animateCounter(el, target, suffix);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObserver.observe(el));

function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

// ============ HERO PARTICLES ============
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
    particlesContainer.appendChild(p);
  }
}

// ============ TABS (leaderboard + tiers) ============
document.querySelectorAll('.tabs').forEach(group => {
  const buttons = group.querySelectorAll('.tab-btn');
  let sibling = group.nextElementSibling;
  const panels = [];
  while (sibling && sibling.classList.contains('tab-panel')) {
    panels.push(sibling);
    sibling = sibling.nextElementSibling;
  }
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.getAttribute('data-tab');
      panels.forEach(p => p.classList.toggle('active', p.getAttribute('id') === id));
    });
  });
});

// ============ TOAST ============
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

// ============ TAB TITLE ANIMATION ============
const origTitle = document.title;
let titleIndex = 0;
const titleMessages = [
  origTitle,
  'Join MCPE GALAXY!',
  'PvP Testing Server — Java & Bedrock',
];
setInterval(() => {
  titleIndex = (titleIndex + 1) % titleMessages.length;
  document.title = titleMessages[titleIndex];
}, 4000);

// ============ DATA RENDERING ============
const AVATAR_COLORS = [
  'linear-gradient(135deg, #9B59B6, #00D2FF)',
  'linear-gradient(135deg, #e74c3c, #f39c12)',
  'linear-gradient(135deg, #2ecc71, #1abc9c)',
  'linear-gradient(135deg, #3498db, #9b59b6)',
  'linear-gradient(135deg, #f39c12, #e74c3c)',
  'linear-gradient(135deg, #1abc9c, #3498db)',
  'linear-gradient(135deg, #e84393, #6c5ce7)',
  'linear-gradient(135deg, #00b894, #00D2FF)'
];

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

function renderLeaderboard(data) {
  ['java', 'bedrock'].forEach(platform => {
    const body = document.getElementById(`lb-${platform}-body`);
    if (!body) return;
    const rows = data[platform].map((p, i) => {
      const rank = i + 1;
      const rankHtml = rank === 1
        ? '<span class="lb-rank lb-top1"><i class="fas fa-crown"></i></span>'
        : `<span class="lb-rank ${rank === 2 ? 'lb-top2' : rank === 3 ? 'lb-top3' : ''}">${rank}</span>`;
      const trendIcon = p.trend === 'up' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
      return `
        <div class="lb-row ${rank <= 3 ? 'lb-top' + rank : ''}" style="animation-delay:${i * 0.05}s">
          ${rankHtml}
          <span class="lb-player">
            <span class="lb-avatar" style="--av:${AVATAR_COLORS[i % AVATAR_COLORS.length]}">${escapeHtml(p.name.charAt(0).toUpperCase())}</span>
            ${escapeHtml(p.name)}${p.owner ? ' <span class="lb-owner">OWNER</span>' : ''}
          </span>
          <span class="lb-tier"><span class="tier-badge ${tierClass(p.tier)}">${escapeHtml(p.tier)}</span></span>
          <span class="lb-rating">${Number(p.rating).toLocaleString()}</span>
          <span class="lb-wins">${p.wins}</span>
          <span class="lb-kd">${p.kd}</span>
          <span class="lb-trend ${p.trend}"><i class="fas ${trendIcon}"></i></span>
        </div>`;
    }).join('');

    const head = `
      <div class="lb-row lb-head">
        <span class="lb-rank">#</span>
        <span class="lb-player">Player</span>
        <span class="lb-tier">Tier</span>
        <span class="lb-rating">Rating</span>
        <span class="lb-wins">Wins</span>
        <span class="lb-kd">K/D</span>
        <span class="lb-trend">Trend</span>
      </div>`;
    body.innerHTML = head + rows;
  });

  // live top-3 card (Java)
  const live = document.getElementById('liveTop3');
  if (live) {
    live.innerHTML = data.java.slice(0, 3).map((p, i) => `
      <div class="live-top-row">
        <span class="live-rank">${i + 1}</span>
        <span class="live-avatar">${escapeHtml(p.name.charAt(0).toUpperCase())}</span>
        <span class="live-name">${escapeHtml(p.name)}</span>
        <span class="tier-badge ${tierClass(p.tier)}">${escapeHtml(p.tier)}</span>
      </div>`).join('');
  }
}

function renderLogs(data) {
  const timeline = document.getElementById('logTimeline');
  if (!timeline) return;
  timeline.innerHTML = data.logs.map((log, i) => `
    <div class="log-item" style="animation-delay:${i * 0.06}s">
      <div class="log-date">${escapeHtml(log.date)}</div>
      <div class="log-content">
        <span class="log-tag ${escapeHtml(log.tag)}">${escapeHtml(log.tag)}</span>
        <h3>${escapeHtml(log.title)}</h3>
        <p>${escapeHtml(log.text)}</p>
      </div>
    </div>`).join('');
}

function renderUserChip(session) {
  const navUser = document.getElementById('navUser');
  if (!navUser) return;
  const u = session.user;
  const av = userAvatarUrl(u, 32);
  const avatarHtml = av
    ? `<img src="${av}" alt="" class="nav-user-avatar">`
    : `<span class="nav-user-avatar nav-user-avatar-fallback">${escapeHtml(u.username.charAt(0).toUpperCase())}</span>`;
  navUser.innerHTML = `
    <span class="nav-user-chip" title="${escapeHtml(u.username)}">
      ${avatarHtml}
      <span class="nav-user-name">${escapeHtml(u.username)}</span>
    </span>
    <button class="nav-logout" id="logoutBtn" title="Logout"><i class="fas fa-sign-out-alt"></i></button>`;
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logoutDiscord);
}

function initSite() {
  const session = getDiscordSession();
  if (!session) {
    window.location.href = 'index.html';
    return;
  }
  renderUserChip(session);

  const data = loadData();
  renderLeaderboard(data);
  renderLogs(data);
  fetchData().then(fresh => { renderLeaderboard(fresh); renderLogs(fresh); }).catch(() => {});

  const copyBtn = document.getElementById('copyInvite');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const url = 'https://discord.gg/QPFRvPXbX8';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('Invite link copied!');
        }).catch(() => showToast('Could not copy — link: ' + url));
      } else {
        showToast('Invite: ' + url);
      }
    });
  }

  if (typeof logSiteVisit === 'function') {
    logSiteVisit();
  }
}

document.addEventListener('DOMContentLoaded', initSite);
