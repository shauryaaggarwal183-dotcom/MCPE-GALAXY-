import React from 'react';
import { motion } from 'motion/react';
import { playHoverSound } from '../../utils/audio';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'cyan' | 'amber' | 'rose';
  hoverEffect?: boolean;
  onClick?: () => void;
  key?: React.Key;
}

export function GlassCard({
  children,
  className = '',
  glowColor = 'purple',
  hoverEffect = true,
  onClick
}: GlassCardProps) {
  const glowMap = {
    purple: 'hover:border-purple-500/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]',
    cyan: 'hover:border-cyan-500/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]',
    amber: 'hover:border-amber-500/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]',
    rose: 'hover:border-rose-500/60 hover:shadow-[0_0_30px_rgba(244,63,94,0.25)]'
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, scale: 1.008 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onMouseEnter={() => hoverEffect && playHoverSound()}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-purple-950/20 backdrop-blur-xl border border-purple-500/20 shadow-xl transition-all duration-300 ${
        hoverEffect ? glowMap[glowColor] : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Light sheen line */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
