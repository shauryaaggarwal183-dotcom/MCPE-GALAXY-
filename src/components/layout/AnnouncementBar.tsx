import React from 'react';
import { Announcement } from '../../types';
import { Flame, Sparkles, ExternalLink, X } from 'lucide-react';

export interface AnnouncementBarProps {
  announcements?: Announcement[];
  title?: string;
  message?: string;
  type?: 'PROMOTION' | 'ANNOUNCEMENT' | 'TEST_ALERT' | 'UPDATE' | 'INFO' | 'WARNING';
  onDismiss?: () => void;
  onOpenAnnouncements?: () => void;
}

export function AnnouncementBar({ 
  announcements, 
  title, 
  message, 
  type = 'PROMOTION', 
  onDismiss, 
  onOpenAnnouncements 
}: AnnouncementBarProps) {
  const displayTitle = title || (announcements && announcements[0]?.title) || 'SEASON ANNOUNCEMENT';
  const displayContent = message || (announcements && announcements[0]?.content) || '';
  const displayType = type || (announcements && announcements[0]?.type) || 'INFO';

  return (
    <div className="relative z-30 bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 border-b border-purple-500/30 text-xs py-2 px-4 shadow-lg overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 font-bold uppercase tracking-wider shrink-0 text-[10px]">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            {displayType}
          </span>
          <p className="text-purple-100 font-medium truncate">
            <span className="font-bold text-white">{displayTitle}</span> {displayContent && `— ${displayContent}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenAnnouncements && (
            <button
              onClick={onOpenAnnouncements}
              className="shrink-0 flex items-center gap-1 text-purple-300 hover:text-white transition-colors underline font-semibold text-[11px]"
            >
              <span>View Alerts</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 rounded text-purple-400 hover:text-white hover:bg-purple-800/40"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
