import React from 'react';
import { ShieldAlert, Zap, RotateCcw, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DemoBanner({ onOpenSurgeModal }) {
  const { overallRisk, resetDemoData } = useApp();

  return (
    <div className="bg-gradient-to-r from-slate-950 via-[#0c1426] to-slate-950 border-b border-cyan-500/20 px-4 py-2 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300 flex-wrap justify-center md:justify-start">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[11px] font-bold border border-cyan-500/30">
            <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            HACKATHON DEMO MODE
          </span>
          <span className="text-slate-400">
            Operational Telemetry, Risk Models & AI Directives are <span className="text-cyan-300 font-medium">SIMULATED SYNTHETIC DATA</span>.
          </span>
          <span className="hidden xl:inline text-slate-500">•</span>
          <span className="hidden xl:inline text-slate-400">
            REST API contracts ready for Spring Boot backend integration.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSurgeModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono text-[11px] transition-all"
            title="Simulate immediate crowd influx into active venues"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Simulate Crowd Surge</span>
          </button>

          <button
            onClick={resetDemoData}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-[11px] transition-all"
            title="Reset all demo data back to baseline defaults"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
