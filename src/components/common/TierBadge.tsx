import React from 'react';
import { TierLevel } from '../../types';
import { Crown, Flame, Shield, Star, Award, Zap } from 'lucide-react';

interface TierBadgeProps {
  tier: TierLevel;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

export function TierBadge({ tier, size = 'md', showLabel = true, className = '' }: TierBadgeProps) {
  const getTierConfig = (t: TierLevel) => {
    switch (t) {
      case 'HT1':
        return {
          label: 'High Tier 1',
          bg: 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400',
          border: 'border-amber-400/80',
          text: 'text-amber-200',
          shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.6)]',
          icon: Crown,
          iconColor: 'text-amber-300 animate-pulse'
        };
      case 'LT1':
        return {
          label: 'Low Tier 1',
          bg: 'bg-gradient-to-r from-yellow-600 via-amber-500 to-amber-300',
          border: 'border-yellow-400/70',
          text: 'text-amber-100',
          shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
          icon: Star,
          iconColor: 'text-amber-200'
        };
      case 'HT2':
        return {
          label: 'High Tier 2',
          bg: 'bg-gradient-to-r from-cyan-600 to-blue-500',
          border: 'border-cyan-400/80',
          text: 'text-cyan-200',
          shadow: 'shadow-[0_0_18px_rgba(6,182,212,0.6)]',
          icon: Flame,
          iconColor: 'text-cyan-300'
        };
      case 'LT2':
        return {
          label: 'Low Tier 2',
          bg: 'bg-gradient-to-r from-sky-600 to-indigo-500',
          border: 'border-sky-400/70',
          text: 'text-sky-200',
          shadow: 'shadow-[0_0_14px_rgba(56,189,248,0.5)]',
          icon: Shield,
          iconColor: 'text-sky-300'
        };
      case 'HT3':
        return {
          label: 'High Tier 3',
          bg: 'bg-gradient-to-r from-purple-600 to-pink-500',
          border: 'border-purple-400/80',
          text: 'text-purple-200',
          shadow: 'shadow-[0_0_18px_rgba(168,85,247,0.6)]',
          icon: Zap,
          iconColor: 'text-purple-300'
        };
      case 'LT3':
        return {
          label: 'Low Tier 3',
          bg: 'bg-gradient-to-r from-purple-800 to-fuchsia-600',
          border: 'border-purple-500/60',
          text: 'text-purple-300',
          shadow: 'shadow-[0_0_12px_rgba(192,132,252,0.4)]',
          icon: Award,
          iconColor: 'text-purple-300'
        };
      case 'HT4':
        return {
          label: 'High Tier 4',
          bg: 'bg-gradient-to-r from-emerald-600 to-teal-500',
          border: 'border-emerald-400/70',
          text: 'text-emerald-200',
          shadow: 'shadow-[0_0_14px_rgba(16,185,129,0.5)]',
          icon: Shield,
          iconColor: 'text-emerald-300'
        };
      case 'LT4':
        return {
          label: 'Low Tier 4',
          bg: 'bg-gradient-to-r from-emerald-800 to-teal-700',
          border: 'border-emerald-500/50',
          text: 'text-emerald-300',
          shadow: 'shadow-[0_0_10px_rgba(52,211,153,0.3)]',
          icon: Shield,
          iconColor: 'text-emerald-400'
        };
      case 'HT5':
      case 'LT5':
        return {
          label: t === 'HT5' ? 'High Tier 5' : 'Low Tier 5',
          bg: 'bg-gradient-to-r from-slate-700 to-zinc-600',
          border: 'border-slate-500/50',
          text: 'text-slate-200',
          shadow: 'shadow-[0_0_8px_rgba(148,163,184,0.3)]',
          icon: Shield,
          iconColor: 'text-slate-300'
        };
      default:
        return {
          label: 'Unranked',
          bg: 'bg-slate-800/80',
          border: 'border-slate-700',
          text: 'text-slate-400',
          shadow: 'none',
          icon: Shield,
          iconColor: 'text-slate-500'
        };
    }
  };

  const config = getTierConfig(tier);
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-bold gap-2',
    xl: 'px-4 py-2 text-base font-extrabold gap-2.5'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5'
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border ${config.bg} ${config.border} ${config.shadow} ${config.text} ${sizeClasses[size]} ${className} tracking-wide transition-all duration-300 transform hover:scale-105`}
    >
      <IconComponent className={`${iconSizes[size]} ${config.iconColor} shrink-0`} />
      <span>{tier}</span>
      {showLabel && size !== 'sm' && (
        <span className="opacity-75 text-[0.8em] font-medium uppercase tracking-wider">
          ({config.label})
        </span>
      )}
    </span>
  );
}
