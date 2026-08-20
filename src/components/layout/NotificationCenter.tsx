import React from 'react';
import { Modal } from '../common/Modal';
import { Announcement } from '../../types';
import { Bell, Flame, Sparkles, CheckCircle2, Clock } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
  onMarkAllRead: () => void;
}

export function NotificationCenter({ isOpen, onClose, announcements, onMarkAllRead }: NotificationCenterProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Platform Notifications & Activity" maxWidth="lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
          <p className="text-xs text-purple-300">
            Real-time updates on tier promotions, scheduled matches, and platform news.
          </p>
          <button
            onClick={onMarkAllRead}
            className="text-xs font-bold text-cyan-300 hover:underline flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-4 rounded-xl border transition-all ${
                ann.urgent
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : 'bg-purple-950/30 border-purple-500/20 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  ann.type === 'PROMOTION'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                }`}>
                  {ann.type === 'PROMOTION' ? <Flame className="w-3 h-3 text-amber-400" /> : <Sparkles className="w-3 h-3 text-cyan-400" />}
                  {ann.type}
                </span>

                <span className="text-[11px] text-purple-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {ann.timestamp}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">{ann.title}</h4>
              <p className="text-xs text-purple-300 leading-relaxed">{ann.content}</p>
              
              <div className="mt-2 text-[10px] text-purple-400 font-semibold">
                By Staff Member: {ann.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
