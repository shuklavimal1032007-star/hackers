import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend, // { value: "+12%", direction: "up" | "down" | "neutral", label: "vs baseline" }
  badgeText,
  badgeVariant = 'info',
  accentColor = 'cyan', // 'cyan' | 'blue' | 'rose' | 'amber' | 'emerald'
  progress, // number 0-100
  onClick,
  className = ''
}) {
  const accentGradients = {
    cyan: 'from-cyan-500/20 to-transparent border-cyan-500/30 text-cyan-400',
    blue: 'from-blue-500/20 to-transparent border-blue-500/30 text-blue-400',
    rose: 'from-rose-500/20 to-transparent border-rose-500/30 text-rose-400',
    amber: 'from-amber-500/20 to-transparent border-amber-500/30 text-amber-400',
    emerald: 'from-emerald-500/20 to-transparent border-emerald-500/30 text-emerald-400'
  };

  const progressColors = {
    cyan: 'bg-cyan-500',
    blue: 'bg-blue-500',
    rose: 'bg-rose-500',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500'
  };

  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl bg-[#0c1322] border border-slate-800 p-5 shadow-lg transition-all duration-200 hover:border-slate-700/90 ${onClick ? 'cursor-pointer hover:bg-[#0f182b]' : ''} ${className}`}
    >
      {/* Decorative top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentGradients[accentColor] || accentGradients.cyan}`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 tracking-wider uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
              {value}
            </h4>
            {badgeText && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 ${accentGradients[accentColor].split(' ').pop()}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Optional Progress Bar */}
      {typeof progress === 'number' && (
        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Capacity Utilization</span>
            <span className="font-semibold text-slate-200">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${progressColors[accentColor] || progressColors.cyan}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {/* Trend or Subtitle */}
      {(trend || subtitle) && (
        <div className="mt-3.5 flex items-center justify-between text-xs text-slate-400">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <div className={`flex items-center gap-1 font-mono font-medium ${
              trend.direction === 'up' ? 'text-rose-400' :
              trend.direction === 'down' ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              {trend.direction === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {trend.direction === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              <span>{trend.value}</span>
              {trend.label && <span className="text-slate-500 font-sans ml-0.5">{trend.label}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
