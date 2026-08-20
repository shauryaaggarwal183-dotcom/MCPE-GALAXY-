import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X
} from 'lucide-react';
import { DiscordUser } from '../../types';
import { playClickSound } from '../../utils/audio';
import { auth } from '../../utils/api';
import { GALAXY_LOGO } from '../../constants/assets';

interface DiscordOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: DiscordUser | null;
  onLogout: () => void;
}

// Real "Discord blurple" brand mark, used instead of faking Discord's own UI chrome
function DiscordMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 127.14 96.36" className={className} fill="currentColor">
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
    </svg>
  );
}

export function DiscordOAuthModal({
  isOpen,
  onClose,
  currentUser,
  onLogout
}: DiscordOAuthModalProps) {
  const [loggingOut, setLoggingOut] = React.useState(false);

  if (!isOpen) return null;

  // Real, full-page redirect to Discord's own OAuth2 consent screen at discord.com.
  // MCPE Galaxy never sees the user's password - Discord authenticates them directly.
  const handleContinueWithDiscord = () => {
    playClickSound();
    window.location.href = auth.loginUrl;
  };

  const handleDisconnect = async () => {
    playClickSound();
    setLoggingOut(true);
    try {
      await auth.logout();
    } catch {
      // even if the network call fails, clear local state so the UI reflects logged-out
    } finally {
      setLoggingOut(false);
      onLogout();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">

        {currentUser ? (
          /* Signed-in account panel - shows the REAL Discord profile returned by our server session */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full max-w-md h-full sm:h-auto min-h-[420px] bg-[#111214] text-white sm:rounded-3xl p-6 flex flex-col justify-between shadow-2xl border border-white/5"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="text-xl font-bold tracking-tight text-white">Discord Account</span>
                <button
                  onClick={() => onClose()}
                  className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-[#1e1f22] flex items-center justify-between border border-white/5 shadow-inner">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10 bg-zinc-800 shrink-0">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-base font-bold text-white block">
                      {currentUser.globalName || currentUser.username}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      Discord • Connected{currentUser.discriminator ? ` (#${currentUser.discriminator})` : ''}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleDisconnect}
                  disabled={loggingOut}
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-60"
                >
                  {loggingOut ? 'Logging out…' : 'Log out'}
                </button>
              </div>

              <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
                You're signed in with your real Discord account. MCPE Galaxy only stores your
                Discord ID, username and avatar — it never has access to your password or messages.
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onClose()}
                className="w-full py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-lg text-center"
              >
                Close
              </button>
            </div>
          </motion.div>
        ) : (
          /* Signed-out prompt - sends the browser to the real discord.com consent screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative w-full max-w-md bg-[#1a1440] sm:rounded-3xl overflow-hidden shadow-2xl"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 20%, #302670 0%, #151035 60%, #0d0924 100%)`
            }}
          >
            <button
              onClick={() => onClose()}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-zinc-300 hover:text-white hover:bg-black/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 px-8 py-12 flex flex-col items-center text-center space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#10b981] p-2 flex items-center justify-center shadow-lg border border-emerald-400/30">
                  <img
                    src={GALAXY_LOGO}
                    alt="MCPE Galaxy"
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as any).src = 'https://api.dicebear.com/7.x/bottts/svg?seed=Galaxy'; }}
                  />
                </div>
                <span className="text-2xl text-zinc-500 font-light">+</span>
                <div className="w-16 h-16 rounded-2xl bg-[#5865F2] p-3.5 flex items-center justify-center shadow-lg">
                  <DiscordMark className="w-full h-full text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Connect your Discord
                </h3>
                <p className="text-sm text-zinc-400 mt-2 max-w-xs mx-auto">
                  Sign in with your real Discord account to link your profile, roles and rank on MCPE Galaxy.
                </p>
              </div>

              <ul className="text-xs text-zinc-300 space-y-2 text-left w-full max-w-xs">
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">✓</span>
                  <span>Uses your username, avatar and Discord ID only</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">✓</span>
                  <span>Handled entirely by Discord — MCPE Galaxy never sees your password</span>
                </li>
                <li className="flex items-start gap-2.5 text-zinc-400">
                  <span className="w-4 h-4 rounded-full bg-zinc-700/50 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">✕</span>
                  <span>Cannot read or send your Discord messages</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={handleContinueWithDiscord}
                className="w-full max-w-xs flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] active:scale-[0.98] text-white font-bold text-sm shadow-lg transition-all"
              >
                <DiscordMark className="w-5 h-5 text-white" />
                Continue with Discord
              </button>

              <p className="text-[11px] text-zinc-500">
                You'll be redirected to discord.com to log in and approve access.
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </AnimatePresence>
  );
}
