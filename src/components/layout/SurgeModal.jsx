import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { Zap, AlertTriangle, Users, ArrowUpRight } from 'lucide-react';

export default function SurgeModal({ isOpen, onClose }) {
  const { venues, simulateCrowdSurge } = useApp();
  const [selectedVenueId, setSelectedVenueId] = useState(venues[0]?.id || '');
  const [intensity, setIntensity] = useState('high'); // 'moderate' | 'high' | 'extreme'

  const targetVenue = venues.find(v => v.id === selectedVenueId) || venues[0];

  const intensityMultipliers = {
    moderate: { factor: 1.15, label: 'Moderate Surge (+15% crowd, +40% queue)', desc: 'Simulates scheduled session break transition' },
    high: { factor: 1.35, label: 'High Surge (+35% crowd, +70% queue)', desc: 'Simulates surprise guest appearance or sudden rainstorm outdoor retreat' },
    extreme: { factor: 1.65, label: 'Extreme Redline Surge (+65% crowd, +120% queue)', desc: 'Simulates critical gate bottleneck and runaway pedestrian wave' }
  };

  const handleSimulate = () => {
    if (!targetVenue) return;
    const multi = intensityMultipliers[intensity].factor;
    simulateCrowdSurge(targetVenue.id, multi);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Simulate Real-Time Crowd Surge"
      subtitle="Synthesize an operational influx event to test risk models and AI directives"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Venue Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Target Venue / Gate Sector
          </label>
          <select
            value={selectedVenueId}
            onChange={(e) => setSelectedVenueId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
          >
            {venues.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.currentOccupancy.toLocaleString()} / {v.capacity.toLocaleString()} • {v.riskLevel})
              </option>
            ))}
          </select>
        </div>

        {/* Current State Preview */}
        {targetVenue && (
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs grid grid-cols-3 gap-2 text-center font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">CURRENT OCCUPANCY</span>
              <span className="text-white font-bold">{targetVenue.currentOccupancy.toLocaleString()}</span>
              <span className="text-slate-400 block text-[10px]">({Math.round((targetVenue.currentOccupancy / targetVenue.capacity) * 100)}%)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">QUEUE SIZE</span>
              <span className="text-amber-400 font-bold">{targetVenue.queueSize} persons</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">CURRENT RISK</span>
              <span className={`font-bold ${
                targetVenue.riskLevel === 'Critical' ? 'text-rose-400' :
                targetVenue.riskLevel === 'Warning' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {targetVenue.riskScore}/100
              </span>
            </div>
          </div>
        )}

        {/* Surge Intensity Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Surge Magnitude Intensity
          </label>
          <div className="space-y-2">
            {Object.entries(intensityMultipliers).map(([key, info]) => (
              <div
                key={key}
                onClick={() => setIntensity(key)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  intensity === key
                    ? 'bg-amber-500/15 border-amber-500/50 text-white'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{info.label}</span>
                  <input
                    type="radio"
                    name="surge-intensity"
                    checked={intensity === key}
                    onChange={() => setIntensity(key)}
                    className="accent-amber-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{info.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory Warning */}
        <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-slate-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Executing this simulation will recalculate spatial density, trigger automatic threat scoring, generate responsive AI recommendations, and log the action in the permanent audit trail.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="warning"
            icon={Zap}
            onClick={handleSimulate}
          >
            Trigger Crowd Surge Simulation
          </Button>
        </div>
      </div>
    </Modal>
  );
}
