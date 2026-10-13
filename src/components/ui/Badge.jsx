import React from 'react';

export default function Badge({ 
  children, 
  variant = 'default', // 'normal' | 'warning' | 'critical' | 'info' | 'demo' | 'default'
  size = 'md', // 'sm' | 'md' | 'lg'
  dot = false,
  className = '' 
}) {
  const variantStyles = {
    normal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    demo: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    default: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  const dotStyles = {
    normal: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
    success: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
    warning: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
    critical: 'bg-rose-400 shadow-[0_0_8px_#f43f5e] animate-pulse',
    danger: 'bg-rose-400 shadow-[0_0_8px_#f43f5e] animate-pulse',
    info: 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]',
    blue: 'bg-blue-400 shadow-[0_0_8px_#3b82f6]',
    demo: 'bg-purple-400 shadow-[0_0_8px_#a855f7]',
    default: 'bg-slate-400'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wide',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  const currentVariant = variant.toLowerCase();
  const selectedStyle = variantStyles[currentVariant] || variantStyles.default;
  const selectedDot = dotStyles[currentVariant] || dotStyles.default;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border font-mono uppercase transition-colors ${selectedStyle} ${sizeStyles[size]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${selectedDot}`} />
      )}
      {children}
    </span>
  );
}
