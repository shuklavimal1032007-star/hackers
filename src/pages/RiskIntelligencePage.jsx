import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  ShieldAlert,
  Activity,
  TrendingUp,
  Scale,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Info,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function RiskIntelligencePage() {
  const { overallRisk, riskHistory, venues } = useApp();

  // Top critical venues sorted by risk score
  const highRiskVenues = [...venues].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Predictive Safety Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            RISK INTELLIGENCE & FORECASTING
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Transparent mathematical models, multi-factor safety weights, and temporal crowd density forecasts.
          </p>
        </div>

        <Badge variant={overallRisk.level} dot size="lg">
          Complex Threat Level: {overallRisk.level} ({overallRisk.score}/100)
        </Badge>
      </div>

      {/* Top Threat Indices Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card
          className="border-cyan-500/30"
          title="Overall Complex Risk Index"
          subtitle="Weighted spatial safety aggregate"
          icon={Activity}
        >
          <div className="flex items-baseline justify-between pt-2">
            <span className={`text-5xl font-mono font-bold ${
              overallRisk.level === 'Critical' ? 'text-rose-400' :
              overallRisk.level === 'Warning' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {overallRisk.score}
              <span className="text-xl text-slate-500 font-normal">/100</span>
            </span>
            <Badge variant={overallRisk.level} size="md">
              {overallRisk.level}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Composite index calculated across all 8 venues using weighted structural capacity, turnstile throughput, and ingress pressure.
          </p>
        </Card>

        <Card
          title="Highest Risk Sector"
          subtitle="Sector with greatest crush hazard"
          icon={ShieldAlert}
        >
          {highRiskVenues[0] && (
            <div className="pt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-white truncate max-w-[190px]">
                  {highRiskVenues[0].name}
                </span>
                <span className={`text-2xl font-mono font-bold ${
                  highRiskVenues[0].riskLevel === 'Critical' ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {highRiskVenues[0].riskScore}/100
                </span>
              </div>
              <p className="text-xs font-mono text-cyan-400 mt-1">
                Occupancy: {Math.round((highRiskVenues[0].currentOccupancy / highRiskVenues[0].capacity) * 100)}% • Queue: {highRiskVenues[0].queueSize} pax
              </p>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                Flow bottleneck driven by {highRiskVenues[0].inflowRate} p/min ingress vs {highRiskVenues[0].egressGates} active gates.
              </p>
            </div>
          )}
        </Card>

        <Card
          title="Predictive Peak Horizon"
          subtitle="Projected maximum crowd concentration"
          icon={Clock}
        >
          <div className="pt-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-bold text-white">
                16:30 hrs
              </span>
              <span className="text-sm font-mono text-rose-400 font-bold">
                24,800 pax (89%)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Model anticipates simultaneous conclusion of Keynote Alpha & Expo demonstrations, requiring pre-emptive gate balancing.
            </p>
          </div>
        </Card>
      </div>

      {/* Mathematical Breakdown of Scoring Model */}
      <Card
        title="Deterministic Risk Scoring Engine Architecture"
        subtitle="Transparent algorithmic formula adhering to NFPA 101 Life Safety Code and UK Green Guide crowd dynamics"
        icon={Scale}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400">Factor 1</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300">Max 45 Pts</span>
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Occupancy Ratio</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Linear scaling up to 80%, escalating exponentially when density crosses 90% of certified safety limit.
            </p>
            <span className="text-[11px] font-mono text-slate-500">Weight: 45%</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-amber-400">Factor 2</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300">Max 25 Pts</span>
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Queue Bottleneck</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Calculates line clearance time against 35 persons/min per gate discharge aperture capacity.
            </p>
            <span className="text-[11px] font-mono text-slate-500">Weight: 25%</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-blue-400">Factor 3</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300">Max 20 Pts</span>
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Inflow Imbalance</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Penalizes rate differentials when inward surge exceeds physical egress discharge rates.
            </p>
            <span className="text-[11px] font-mono text-slate-500">Weight: 20%</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-indigo-400">Factor 4</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300">Max 10 Pts</span>
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Egress Aperture Density</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Penalizes disproportionate attendee ratios per available physical emergency escape gate.
            </p>
            <span className="text-[11px] font-mono text-slate-500">Weight: 10%</span>
          </div>
        </div>
      </Card>

      {/* Historical vs Forecast Timeline Chart */}
      <Card
        title="Crowd Risk History & Predictive Projection Model"
        subtitle="Comparing actual telemetry intake vs temporal predictive horizons"
        icon={TrendingUp}
      >
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={riskHistory} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0b1220', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line yAxisId="left" type="monotone" dataKey="actualOccupancy" stroke="#06b6d4" strokeWidth={2.5} name="Actual Headcount (Pax)" dot={{ r: 4 }} />
              <Line yAxisId="left" type="monotone" dataKey="forecastOccupancy" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" name="Forecasted Headcount" />
              <Line yAxisId="right" type="monotone" dataKey="riskScore" stroke="#f43f5e" strokeWidth={2.5} name="Safety Risk Index (0-100)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Forecast Assumptions & Environmental Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Predictive Forecast Model Assumptions"
          subtitle="Dynamic parameters governing future interval projections"
          icon={Info}
        >
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Attendee Dwell Time:</strong> Median session duration is estimated at 72 minutes with 25-minute transition intervals between stage keynotes.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Arrival Distribution:</strong> Peak arrival window follows Poisson distribution with secondary surge at 14:00 (afternoon keynote kickoff).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Weather Impact:</strong> Ambient outdoor temperature is mild (20°C); zero precipitation, maintaining continuous exterior promenade transit flow.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Turnstile Discharge:</strong> Nominal throughput verified at 38 passengers per minute per active optical optical turnstile.</span>
            </li>
          </ul>
        </Card>

        <Card
          title="Safety Threshold Enforcement Protocols"
          subtitle="Action triggers tied to automated escalation matrix"
          icon={AlertTriangle}
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              <div className="font-semibold text-emerald-200 mb-0.5">NORMAL (Score 0 - 39)</div>
              Standard optical monitoring. Routine volunteer patrols. Free access across all perimeter gates.
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <div className="font-semibold text-amber-200 mb-0.5">WARNING (Score 40 - 69)</div>
              Autonomous generation of queue rebalancing recommendations. Pre-alert dispatched to roving volunteer reserves.
            </div>
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
              <div className="font-semibold text-rose-200 mb-0.5">CRITICAL (Score 70 - 100)</div>
              Mandatory turnstile throttling. Automatic incident creation. Shutter pre-unlock directives and audible marshal dispatch.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
