import React from 'react';
import { Trophy, Shield, Disc as Discord, ExternalLink, Heart, Globe2 } from 'lucide-react';
import { playClickSound } from '../../utils/audio';
import { GALAXY_LOGO } from '../../constants/assets';

interface FooterProps {
  siteTitle?: string;
  onNavigate?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
}

export function Footer({ siteTitle = 'MCPE GALAXY TIER SYSTEM', onNavigate, onSelectTab }: FooterProps) {
  const handleNav = (tab: string) => {
    playClickSound();
    if (onSelectTab) onSelectTab(tab);
    if (onNavigate) onNavigate(tab);
  };

  return (
    <footer className="relative z-10 bg-[#06030e] border-t border-purple-500/20 pt-16 pb-12 text-purple-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-amber-400 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(168,85,247,0.5)] overflow-hidden">
                <img 
                  src={GALAXY_LOGO} 
                  alt="MCPE GALAXY Logo" 
                  className="w-full h-full object-cover rounded-[10px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-lg font-black tracking-wider text-white">
                {siteTitle}
              </span>
            </div>
            <p className="text-xs text-purple-400 leading-relaxed">
              The premier Minecraft Bedrock competitive tier testing platform and esports ecosystem. Built for champions, verified by official staff.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Regions Online: NA, EU, AS, SA, OCE</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Platform Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { name: 'Home Showcase', key: 'home' },
                { name: 'Global Leaderboards', key: 'leaderboards' },
                { name: 'Tiers & Evaluation', key: 'testing' },
                { name: 'Analytics & Insights', key: 'analytics' },
                { name: 'Staff Team Roster', key: 'staff' },
                { name: 'Admin Security Panel', key: 'admin' }
              ].map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => handleNav(item.key)}
                    className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                  >
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Gamemodes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Active Tier Gamemodes
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              {['NoDebuff Potion', 'Boxing PvP', 'Midfight', 'The Bridge', 'BedFight', 'Build UHC', 'Mace PvP', 'MLG Rush', 'SkyWars', 'Battle Rush'].map((gm) => (
                <li key={gm} className="text-purple-400 hover:text-purple-200 transition-colors cursor-pointer" onClick={() => handleNav('leaderboards')}>
                  • {gm}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Community Discord */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
              Join Our Community
            </h4>
            <p className="text-xs text-purple-400">
              Get official tier updates, match reminders, and connect with over 15,000+ competitive players.
            </p>
            <a
              href="https://discord.com/channels/1222612688241295420/1532353506147569714"
              target="_blank"
              rel="noreferrer"
              className="btn-gold-purple-animated inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all mb-2"
            >
              <Discord className="w-4 h-4 text-amber-200" />
              <span>Get Tested (Ticket Channel)</span>
            </a>
            <a
              href="https://discord.gg/QPFRvPXbX8"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Discord className="w-4 h-4" />
              <span>Join Discord Server</span>
            </a>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-purple-500/10 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-500 gap-4">
          <p>© 2026 MCPE Galaxy Ecosystem. All rights reserved. Not affiliated with Mojang Studios.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-purple-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-purple-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-purple-300 cursor-pointer">Staff Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
