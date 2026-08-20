import React from 'react';
import { motion } from 'motion/react';
import { playClickSound, playHoverSound } from '../../utils/audio';

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  disabled = false,
  className = '',
  type = 'button'
}: NeonButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    playClickSound();
    onClick?.(e);
  };

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:border-purple-300',
    secondary: 'bg-cyan-600/30 text-cyan-200 border-cyan-500/40 hover:bg-cyan-500/40 hover:border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    outline: 'bg-purple-950/40 text-purple-200 border-purple-500/40 hover:bg-purple-900/50 hover:border-purple-400',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.7)]',
    ghost: 'bg-transparent text-purple-300 hover:bg-purple-900/30 border-transparent hover:text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm font-bold rounded-xl gap-2',
    lg: 'px-7 py-3.5 text-base font-extrabold rounded-2xl gap-2.5 tracking-wide'
  };

  return (
    <motion.button
      type={type}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      onMouseEnter={() => !disabled && playHoverSound()}
      onClick={handleClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center border font-sans backdrop-blur-md transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
