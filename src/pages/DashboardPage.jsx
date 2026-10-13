import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Building2,
  Users,
  AlertOctagon,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Activity,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bus,
  Send,
  MapPin,
  MessageSquare,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function DashboardPage() {
  const {
    venues,
    events,
    incidents,
    recommendations,
    volunteers,
    riskHistory,
    auditLogs,
    overallRisk,
    simulateCrowdSurge,
    buses,
    busRequests,
    confirmBusRequest,
    supportTickets,
    resourceRequests
  } = useApp();

  const [activeChartTab, setActiveChartTab] = useState('occupancy'); // 'occupancy' | 'queues'

  const totalOccupancy = venues.reduce((acc, v) => acc + (v.currentOccupancy || 0), 0);
  const totalCapacity = venues.reduce((acc, v) => acc + (v.capacity || 0), 0);
  const totalQueued = venues.reduce((acc, v) => acc + (v.queueSize || 0), 0);
  const activeEventsCount = events.filter(e => e.status === 'Active').length;
  const criticalIncidentsCount = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;
  const pendingRecsCount = recommendations.filter(r => r.status === 'Pending').length;
  const availableVolunteersCount = volunteers.filter(v => v.status === 'Available').length;
  const activeVolunteersCount = volunteers.filter(v => v.status === 'Active').length;

  // Pie chart risk distribution
  const riskCounts = {
    Normal: venues.filter(v => v.riskLevel === 'Normal').length,
    Warning: venues.filter(v => v.riskLevel === 'Warning').length,
    Critical: venues.filter(v => v.riskLevel === 'Critical').length
  };

  const riskPieData = [
    { name: 'Normal (0-39)', value: riskCounts.Normal, color: '#10b981' },
    { name: 'Warning (40-69)', value: riskCounts.Warning, color: '#f59e0b' },
    { name: 'Critical (70-100)', value: riskCounts.Critical, color: '#f43f5e' }
  ];

  // Venue chart data
  const venueChartData = venues.map(v => ({
    name: v.code || v.name.split(' ')[0],
    fullName: v.name,
    Occupancy: v.currentOccupancy,
    Capacity: v.capacity,
    Queue: v.queueSize,
    Risk: v.riskScore,
    rate: Math.round((v.currentOccupancy / v.capacity) * 100)
  }));

  return (
    <div className="space-y-6">
      {/* Page Title & Tactical Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Real-Time Operational Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            COMMAND DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Synchronized spatial crowd flow monitoring, bottleneck prediction, and automated safety directives.
          </p>
        </div>

        {/* Global Quick Actions */}
        <div className="flex items-center gap-2.5">
          <Link to="/recommendations">
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              className="text-xs"
            >
              Directives ({pendingRecsCount})
            </Button>
          </Link>
          <Link to="/incidents">
            <Button
              variant={criticalIncidentsCount > 0 ? 'danger' : 'outline'}
              size="sm"
              icon={AlertOctagon}
              className="text-xs"
            >
              Alerts ({criticalIncidentsCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metric KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Complex Occupancy"
          value={`${totalOccupancy.toLocaleString()}`}
          subtitle={`Max capacity: ${totalCapacity.toLocaleString()} pax`}
          icon={Building2}
          accentColor={overallRisk.avgOccupancy > 80 ? 'rose' : overallRisk.avgOccupancy > 60 ? 'amber' : 'cyan'}
          progress={overallRisk.avgOccupancy}
          trend={{
            value: `${overallRisk.avgOccupancy}%`,
            direction: overallRisk.avgOccupancy > 75 ? 'up' : 'neutral',
            label: "utilization"
          }}
        />

        <StatCard
          title="Active Congestion Queues"
          value={`${totalQueued.toLocaleString()}`}
          subtitle="Waiting at entrance & concourses"
          icon={TrendingUp}
          accentColor={totalQueued > 1500 ? 'rose' : totalQueued > 800 ? 'amber' : 'blue'}
          trend={{
            value: totalQueued > 1200 ? '+18%' : '+4%',
            direction: totalQueued > 1200 ? 'up' : 'neutral',
            label: 'flow delta'
          }}
          badgeText={`${venues.filter(v => v.queueSize > 250).length} bottlenecks`}
        />

        <StatCard
          title="Critical Alerts & Incidents"
          value={criticalIncidentsCount}
          subtitle={`${incidents.filter(i => i.status !== 'Resolved').length} total open issues`}
          icon={AlertOctagon}
          accentColor={criticalIncidentsCount > 0 ? 'rose' : 'emerald'}
          trend={{
            value: criticalIncidentsCount > 0 ? 'ELEVATED' : 'STABLE',
            direction: criticalIncidentsCount > 0 ? 'up' : 'down'
          }}
        />

        <StatCard
          title="Safety Marshals & Volunteers"
          value={`${activeVolunteersCount} Active`}
          subtitle={`${availableVolunteersCount} available in reserve pool`}
          icon={Users}
          accentColor="emerald"
          badgeText={`${volunteers.length} total staff`}
        />
      </div>

      {/* Main Charts & Risk Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Two-Tab Venue Occupancy & Queues Chart */}
        <Card
          className="lg:col-span-2"
          title="Spatial Density & Throughput Metrics"
          subtitle="Real-time headcounts against structural thresholds across all venue zones"
          icon={Activity}
          action={
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveChartTab('occupancy')}
                className={`px-3 py-1 rounded-md font-mono text-xs transition-colors ${
                  activeChartTab === 'occupancy' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Occupancy Ratio
              </button>
              <button
                onClick={() => setActiveChartTab('queues')}
                className={`px-3 py-1 rounded-md font-mono text-xs transition-colors ${
                  activeChartTab === 'queues' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Queue Depths
              </button>
            </div>
          }
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {activeChartTab === 'occupancy' ? (
                <BarChart data={venueChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0b1220', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="Occupancy" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Current Occupants" />
                  <Bar dataKey="Capacity" fill="#1e293b" radius={[4, 4, 0, 0]} name="Max Safety Capacity" />
                </BarChart>
              ) : (
                <BarChart data={venueChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0b1220', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="Queue" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Waiting in Queue" />
                  <Bar dataKey="Risk" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Risk Score (0-100)" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800/80 mt-2">
            <span>Color code: Cyan (Occupancy) • Slate (Capacity ceiling) • Amber (Queue backlog)</span>
            <Link to="/venues" className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-semibold">
              Live Venue Telemetry <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>

        {/* Risk Distribution & Overall Threat Gauge */}
        <Card
          title="Operational Risk Index"
          subtitle="Zonal threat distribution computed via deterministic safety engine"
          icon={ShieldAlert}
        >
          <div className="flex flex-col items-center justify-center pt-2">
            {/* Donut Chart */}
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0b1220" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0b1220', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-white">{overallRisk.score}</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{overallRisk.level}</span>
              </div>
            </div>

            {/* Distribution Legends */}
            <div className="w-full space-y-2 mt-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Normal (0 - 39)
                </span>
                <span className="font-mono font-bold text-white">{riskCounts.Normal} venues</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Warning (40 - 69)
                </span>
                <span className="font-mono font-bold text-white">{riskCounts.Warning} venues</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Critical (70 - 100)
                </span>
                <span className="font-mono font-bold text-rose-400">{riskCounts.Critical} venues</span>
              </div>
            </div>

            <Link to="/risk-intelligence" className="w-full mt-4">
              <Button variant="secondary" size="sm" className="w-full text-xs font-mono justify-between">
                <span>View Mathematical Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Queue Growth Trend Chart */}
      <Card
        title="Crowd Inflow & Queue Expansion Dynamics"
        subtitle="Historical timeline and predictive trend analysis over event operating window"
        icon={TrendingUp}
      >
        <div className="h-64 w-full pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riskHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorQueue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0b1220', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="actualOccupancy" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorOcc)" name="Actual Headcount" />
              <Area type="monotone" dataKey="forecastOccupancy" stroke="#818cf8" strokeDasharray="4 4" fill="none" name="AI Forecast Model" />
              <Area type="monotone" dataKey="queueTotal" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorQueue)" name="Queue Total Backlog" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Real-time Transit Operations & Volunteer Bus Requests Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
              Event Transit Fleet & Field Bus Alerts
            </h2>
            {busRequests.filter(r => r.status === 'Pending').length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                {busRequests.filter(r => r.status === 'Pending').length} Pending Ground Alert
              </span>
            )}
          </div>
          <Link to="/bus-fleet" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono">
            Full Fleet Console ({buses.length} Buses) →
          </Link>
        </div>

        {/* If pending requests exist, render prominent alert cards */}
        {busRequests.filter(r => r.status === 'Pending').length > 0 && (
          <div className="space-y-3">
            {busRequests.filter(r => r.status === 'Pending').map(req => (
              <div
                key={req.id}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-amber-950/20 to-slate-900 border-2 border-rose-500/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="critical" dot size="sm">VOLUNTEER ALERT: BUS FULL</Badge>
                    <span className="text-xs font-mono font-bold text-cyan-300">{req.busNumber}</span>
                    <span className="text-xs font-mono text-slate-400">({req.eventName})</span>
                  </div>
                  <h4 className="text-base font-bold text-white flex items-center gap-1.5 font-mono">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    {req.pickupLocation}
                  </h4>
                  <p className="text-xs text-slate-300">
                    <strong className="text-amber-400">{req.passengersWaiting} attendees</strong> stranded in queue • Reported by {req.volunteerName} ({req.volunteerPhone})
                  </p>
                  <p className="text-xs text-slate-400 italic">
                    "{req.volunteerNotes}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="primary"
                    icon={Send}
                    size="sm"
                    onClick={() => confirmBusRequest(req.id, {
                      backupBusNumber: 'BUS-04 (Standby Fleet)',
                      backupDriverName: 'Gurpreet Singh',
                      backupDriverPhone: '+91 98333 44556',
                      backupEtaMinutes: 10,
                      adminNotes: 'Backup bus authorized and dispatched from Central Depot. ETA is 10 minutes.'
                    })}
                    className="text-xs font-mono bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400/40"
                  >
                    Quick Dispatch (BUS-04 • 10m ETA)
                  </Button>
                  <Link
                    to="/bus-fleet"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mini fleet preview bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {buses.slice(0, 3).map(b => {
            const isFull = b.status === 'Full' || b.currentPassengers >= b.totalCapacity;
            const pct = Math.round((b.currentPassengers / b.totalCapacity) * 100);
            return (
              <div key={b.id} className="p-3.5 rounded-xl bg-[#0b1120] border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-white">{b.busNumber}</span>
                    <Badge variant={isFull ? 'critical' : b.status === 'En Route' ? 'blue' : 'warning'} size="sm">
                      {isFull ? 'FULL' : b.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-cyan-400 font-mono truncate">{b.pickupLocation}</p>
                </div>
                <div className="mt-2.5 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Seats:</span>
                    <span className={isFull ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                      {b.currentPassengers}/{b.totalCapacity} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isFull ? 'bg-rose-500' : 'bg-cyan-500'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Section: Active Support Tickets & Volunteer Resource Requisitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Tickets Card */}
        <Card
          title="Participant Support Tickets"
          subtitle="Real-time helpdesk tickets and attendee communications"
          icon={MessageSquare}
          action={
            <Link to="/support-tickets" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono">
              Helpdesk Console ({(supportTickets || []).length}) →
            </Link>
          }
        >
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-slate-800">
              <span className="text-slate-400">Open Tickets Awaiting Intake:</span>
              <span className="text-cyan-400 font-bold">
                {(supportTickets || []).filter(t => t.status === 'Open').length} Tickets
              </span>
            </div>

            {(supportTickets || []).slice(0, 3).map(ticket => (
              <Link
                key={ticket.id}
                to="/support-tickets"
                className="block p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all font-sans"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-300">{ticket.id}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border text-slate-300 border-slate-700 bg-slate-800">
                      {ticket.priority}
                    </span>
                  </div>
                  <Badge variant={ticket.status === 'Open' ? 'warning' : ticket.status === 'In Progress' ? 'blue' : 'normal'} size="sm">
                    {ticket.status}
                  </Badge>
                </div>
                <h4 className="text-xs font-semibold text-white line-clamp-1">{ticket.subject}</h4>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-1.5 pt-1.5 border-t border-slate-800/80">
                  <span>From: {ticket.participantName}</span>
                  <span>{new Date(ticket.updatedAt || ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Volunteer Resource Requests Card */}
        <Card
          title="Volunteer Field Resource Requests"
          subtitle="Ground logistics requisitions, admin reviews, and operations dispatch"
          icon={Package}
          action={
            <Link to="/resource-requests" className="text-xs text-emerald-400 hover:text-emerald-300 font-mono">
              Logistics Console ({(resourceRequests || []).length}) →
            </Link>
          }
        >
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-slate-800">
              <span className="text-slate-400">Awaiting Admin Decision:</span>
              <span className="text-amber-400 font-bold">
                {(resourceRequests || []).filter(r => r.status === 'Pending').length} Pending Requests
              </span>
            </div>

            {(resourceRequests || []).slice(0, 3).map(req => (
              <Link
                key={req.id}
                to="/resource-requests"
                className="block p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all font-sans"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-300">{req.id}</span>
                    <span className="text-[10px] font-mono uppercase text-slate-400">{req.resourceCategory}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={req.status === 'Approved' ? 'normal' : req.status === 'Pending' ? 'warning' : 'secondary'} size="sm">
                      {req.status}
                    </Badge>
                    <span className="text-[10px] font-mono text-cyan-400 border border-cyan-800 bg-cyan-950/40 px-1.5 py-0.2 rounded">
                      {req.fulfillmentStatus}
                    </span>
                  </div>
                </div>
                <h4 className="text-xs font-semibold text-white line-clamp-1">{req.resourceName}</h4>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-1.5 pt-1.5 border-t border-slate-800/80">
                  <span className="text-rose-400 font-bold">Shortage: {req.shortage} units</span>
                  <span>{req.location}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Venues Live Status Grid with Quick Surge Buttons */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
              Venue Sectors & Rapid Surge Controls
            </h2>
          </div>
          <Link to="/venues" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono">
            All 8 Sectors →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {venues.slice(0, 4).map(venue => {
            const occRatio = Math.round((venue.currentOccupancy / venue.capacity) * 100);
            return (
              <div
                key={venue.id}
                className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-white truncate max-w-[170px]" title={venue.name}>
                        {venue.name}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400">{venue.zone}</p>
                    </div>
                    <Badge variant={venue.riskLevel} dot size="sm">
                      {venue.riskLevel}
                    </Badge>
                  </div>

                  <div className="space-y-2 my-3">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Occupancy:</span>
                      <span className="text-slate-200 font-bold">{venue.currentOccupancy.toLocaleString()} / {venue.capacity.toLocaleString()}</span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${occRatio >= 90 ? 'bg-rose-500' : occRatio >= 75 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                        style={{ width: `${Math.min(100, occRatio)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Queue: <strong className="text-amber-400">{venue.queueSize}</strong></span>
                      <span>Risk: <strong className={venue.riskLevel === 'Critical' ? 'text-rose-400' : 'text-slate-200'}>{venue.riskScore}/100</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <Link to="/venues" className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono">
                    Details →
                  </Link>
                  <Button
                    variant="warning"
                    size="sm"
                    icon={Zap}
                    onClick={() => simulateCrowdSurge(venue.id, 1.3)}
                    className="text-[11px] py-1 px-2.5 font-mono"
                  >
                    Surge
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Active Directives & Recent Operational Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending AI Directives */}
        <Card
          title="Active AI Safety Directives"
          subtitle="Real-time recommended load-balancing actions requiring operator consent"
          icon={Sparkles}
          action={
            <Link to="/recommendations" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono">
              View All ({recommendations.length}) →
            </Link>
          }
        >
          <div className="space-y-3">
            {recommendations.slice(0, 3).map(rec => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-white line-clamp-1">{rec.title}</span>
                  <Badge variant={rec.priority === 'High' ? 'danger' : 'warning'} size="sm">
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-2.5">
                  {rec.rationale}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-400">Confidence: {rec.confidenceScore}%</span>
                  <span className={`px-2 py-0.5 rounded ${
                    rec.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' :
                    rec.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {rec.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Audit Log Feed */}
        <Card
          title="Recent Operational Activity"
          subtitle="Continuous immutable audit trail of operator decisions and telemetry triggers"
          icon={Clock}
          action={
            <Link to="/audit-logs" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono">
              Audit Trail →
            </Link>
          }
        >
          <div className="space-y-2.5">
            {auditLogs.slice(0, 4).map(log => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-900/50 transition-colors text-xs"
              >
                <div className="p-1.5 rounded-md bg-slate-800 text-cyan-400 mt-0.5">
                  {log.actionType.includes('CRITICAL') ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  ) : log.actionType.includes('APPROVED') ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-200 truncate">{log.actionType}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">
                    {log.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
