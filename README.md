# MCPE GALAXY — upgraded site

## What was fixed (this pass)
- **Login crash bug**: an incorrect admin password used to throw an internal server error instead of returning "Invalid password." Fixed.
- **Password change now actually works**: the Settings tab in the admin panel is wired up to `POST /api/admin/password`. It checks your current password, then saves the new one — hashed — to `admin-store.json` on the server. No `.env` editing or restart needed. Old login sessions are invalidated when the password changes.
- **Default admin passkey is `mcpe_galaxy123`** (only used the very first time the server starts, to seed `admin-store.json`). Change it from the admin panel any time after that.
- Removed the old, unused, insecure client-side password fallback in `data.js`.
- Discord webhook secret stays out of frontend JavaScript.
- Admin login is server-side (`server.js`), password is hashed with `scrypt`, never stored in plaintext.
- Leaderboard/log data lives in `data.json` on the server, so every visitor sees the same live data — the leaderboard page (`main.html`) fetches it fresh from `/api/data` on every load.
- Admin edits (players, tiers, logs) save to the server via `/api/admin/data` and immediately show up for every visitor next time they load the page.
- Discord test/log requests go through `/api/admin/discord` (admin actions) and `/api/visit` (public visit pings).
- `/api/health` for quick diagnostics (tells you if `DISCORD_WEBHOOK_URL` is configured).
- Existing visual design and pages are untouched.

## Run
1. Install Node.js 18+.
2. Copy `.env.example` to `.env` and set `DISCORD_WEBHOOK_URL` (get this from your Discord channel → Integrations → Webhooks). `ADMIN_PASSWORD` is optional — it only seeds the first-run password (`mcpe_galaxy123` by default); after that, change it from the admin panel.
3. Start with `npm start`.
4. Open `http://localhost:3000/`.
5. Admin panel: `http://localhost:3000/admin.html` — passkey `mcpe_galaxy123` (until you change it).

## Notes
- Do not put the Discord webhook URL in any `.js` file served to visitors.
- If the webhook still doesn't post to Discord, double-check `DISCORD_WEBHOOK_URL` in `.env` is a real, unrevoked webhook URL, then check `/api/health` — `"discord": true` means the server sees it configured.
- This site needs to run as a Node server (`npm start`) — it will not work if deployed to a static-only host (like GitHub Pages) since `/api/*` routes need a real server behind them.
- `admin-store.json` is created automatically on first run and holds the hashed admin password. Don't commit it (already in `.gitignore`).
