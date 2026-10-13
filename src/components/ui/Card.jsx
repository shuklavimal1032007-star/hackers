import React from 'react';

export default function Card({ 
  children, 
  title, 
  subtitle, 
  icon: Icon,
  action, 
  glow = false,
  glowColor = 'cyan', // 'cyan' | 'rose' | 'amber' | 'emerald'
  className = '',
  bodyClassName = 'p-5',
  headerClassName = 'px-5 py-4 border-b border-slate-800/80'
}) {
  const glowClasses = {
    cyan: 'glow-cyan border-cyan-500/30',
    rose: 'glow-rose border-rose-500/30',
    amber: 'glow-amber border-amber-500/30',
    emerald: 'glow-emerald border-emerald-500/30'
  };

  return (
    <div className={`bg-[#0d1424] border border-slate-800/80 rounded-xl shadow-lg relative overflow-hidden transition-all duration-200 ${glow ? glowClasses[glowColor] : 'hover:border-slate-700/80'} ${className}`}>
      {(title || subtitle || action) && (
        <div className={`flex items-center justify-between ${headerClassName}`}>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-sm font-semibold text-slate-100 tracking-wide flex items-center gap-2">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
}
