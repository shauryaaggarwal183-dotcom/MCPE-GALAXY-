// ================================================================
// MCPE GALAXY — site configuration
// ----------------------------------------------------------------
// DISCORD LOGIN SETUP (required for the login gate to work):
//   1. Go to https://discord.com/developers/applications and create
//      (or open) an application for this site.
//   2. Copy the application's CLIENT ID into MCG_CLIENT_ID below.
//   3. OAuth2 -> Redirects -> Add Redirect:
//        the EXACT url the site is served from, e.g.
//        https://YOURUSERNAME.github.io/YOURREPO/index.html
//   4. No client secret needed (implicit grant / public client).
// ----------------------------------------------------------------
// While MCG_CLIENT_ID is still the placeholder below, the site runs
// in "preview mode" (a preview button appears on the login screen so
// you can look around). Set a real Client ID to enforce Discord login.
// ================================================================
const MCG_CLIENT_ID = 'YOUR_DISCORD_CLIENT_ID';
const MCG_SCOPE = 'identify';

function mcgRedirectUri() {
  return window.location.origin + window.location.pathname;
}

const MCG_USE_PREVIEW = MCG_CLIENT_ID === 'YOUR_DISCORD_CLIENT_ID';
