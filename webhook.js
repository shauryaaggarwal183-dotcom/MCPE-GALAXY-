const MCG_COLORS = { purple: 0x9B59B6, cyan: 0x00D2FF, green: 0x2ECC71, gold: 0xF1C40F, red: 0xE74C3C };

async function postToDiscord(payload, publicVisit = false) {
  try {
    const endpoint = publicVisit ? '/api/visit' : '/api/admin/discord';
    const headers = { 'Content-Type': 'application/json' };
    if (!publicVisit) headers['X-Admin-Token'] = sessionStorage.getItem('mcpegalaxy_admin_token') || '';
    const res = await fetch(endpoint, { method:'POST', headers, body:JSON.stringify({ payload }) });
    const body = await res.json().catch(()=>({}));
    if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
    return true;
  } catch (e) { console.warn('Discord logging failed:', e); return false; }
}
function sendEmbed(title, description, color, fields, footerText, publicVisit=false) {
  const embed = { title, color, timestamp:new Date().toISOString() };
  if (description) embed.description = description;
  if (fields?.length) embed.fields = fields;
  if (footerText) embed.footer = { text:footerText };
  return postToDiscord({ embeds:[embed] }, publicVisit);
}
function logSiteVisit() {
  if (!canLogVisit()) return Promise.resolve(false);
  return sendEmbed('🌐 Website Visit','Someone visited the **MCPE GALAXY** website.',MCG_COLORS.cyan,[{name:'Page',value:location.href,inline:true},{name:'Time',value:new Date().toLocaleString(),inline:true}],'MCPE GALAXY',true);
}
function logPlayerChange(action, platform, player, color) {
  return sendEmbed(`🏆 Player ${action}`,`**${player.name}** was ${action.toLowerCase()} on the **${platform}** leaderboard.`,color,[{name:'Platform',value:platform,inline:true},{name:'Tier',value:String(player.tier),inline:true},{name:'Rating',value:String(player.rating),inline:true},{name:'Wins',value:String(player.wins),inline:true},{name:'K/D',value:String(player.kd),inline:true}],'MCPE GALAXY Admin');
}
function logLogEntry(action, entry) {
  return sendEmbed(`📋 ${action} Log Entry`,`**${entry.title}**`,action==='Added'?MCG_COLORS.green:MCG_COLORS.red,[{name:'Date',value:entry.date,inline:true},{name:'Tag',value:entry.tag.toUpperCase(),inline:true},{name:'Details',value:entry.text}],'MCPE GALAXY Admin');
}
