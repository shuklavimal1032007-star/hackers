import React, { useState } from 'react';
import {
  Building2,
  Zap,
  Search,
  Filter,
  Eye,
  TrendingUp,
  ShieldAlert,
  Thermometer,
  Wind,
  DoorOpen,
  Users,
  Clock,
  ArrowRight,
  Compass,
  MapPin,
  Coffee,
  Wifi,
  Sparkles,
  Info,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

// Wayfinding helper data for participants
const VENUE_METADATA = {
  'ven-001': {
    directions: 'Ground Floor, Central Atrium through Main Portico.',
    entryGates: 'Gate A (General Attendees), Gate B (Speakers & Press)',
    amenities: ['High-speed Wi-Fi', 'Restrooms', 'Water Station', 'First Aid'],
    currentActivity: 'Main Stage Keynote & Panel Sessions'
  },
  'ven-002': {
    directions: 'Level 1, West Wing. Take Escalator 2 from Grand Lobby.',
    entryGates: 'Gate W1 & W2',
    amenities: ['Power Sockets', 'Restrooms', 'Accessibility Ramp'],
    currentActivity: 'AI Track Tech Talks & Presentations'
  },
  'ven-003': {
    directions: 'Level 1, East Wing. Direct access from Exhibition Corridor.',
    entryGates: 'Gates E1 through E4',
    amenities: ['Sponsor Booths', 'Swag Counter', 'Demo Pods', 'Water Station'],
    currentActivity: 'Tech Expo, Live Demos & Startup Showcase'
  },
  'ven-004': {
    directions: 'Level 2 Mezzanine, accessible via Central Glass Elevators.',
    entryGates: 'North & South Food Court Entries',
    amenities: ['Food Stalls', 'Beverage Counter', 'Dining Seating', 'Restrooms'],
    currentActivity: 'Lunch & Networking Open Dining'
  },
  'ven-005': {
    directions: 'Ground Level, North Campus Plaza (Bus Stop 1 Drop-off).',
    entryGates: 'Turnstiles 1-4 (Fast Bag Check)',
    amenities: ['Help Desk', 'Badge Printing', 'Transit Shuttle Stop'],
    currentActivity: 'Attendee Ingress & Security Check'
  },
  'ven-006': {
    directions: 'Ground Level, South Gate Entrance (Metro / Parking Access).',
    entryGates: 'Turnstiles 5-8',
    amenities: ['Help Desk', 'Luggage Cloakroom', 'Roving Volunteers'],
    currentActivity: 'Secondary Entry & Parking Ingress'
  },
  'ven-007': {
    directions: 'Building B, 2nd Floor Hackathon Hangar.',
    entryGates: 'Lab Doors 1 & 2',
    amenities: ['24/7 Power Banks', 'Gigabit Ethernet', 'Coffee Station', 'Mentor Desk'],
    currentActivity: 'Hacking & Project Sprint Development'
  },
  'ven-008': {
    directions: 'Mezzanine Tower, Level 3 (Private Elevator Access).',
    entryGates: 'Credential Checkpoint V',
    amenities: ['Private Dining', 'Interview Studio', 'Lounge'],
    currentActivity: 'Speaker Briefing & VIP Lounge'
  }
};

export default function VenueMonitoringPage() {
  const { venues, simulateCrowdSurge, currentRole } = useApp();

  const isParticipant = currentRole === 'participant';

  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);

  const zones = ['All', 'Zone A - Central', 'Zone B - West Wing', 'Zone C - East Wing', 'Zone D - Upper Level', 'Zone N - Perimeter North', 'Zone S - Perimeter South'];

  const filteredVenues = venues.filter(venue => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = zoneFilter === 'All' || venue.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  const handleInspect = (venue) => {
    setSelectedVenue(venue);
    setInspectModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              {isParticipant ? 'Campus Navigation & Venue Directory' : 'Spatial Density Telemetry'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            {isParticipant ? (
              <>
                <Compass className="w-7 h-7 text-cyan-400" />
                CAMPUS WAYFINDING & VENUES
              </>
            ) : (
              'VENUE & ZONE MONITORING'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {isParticipant
              ? 'Real-time hall crowd levels, entry queue estimates, facilities, and walking directions.'
              : 'Real-time optical headcount tracking, egress clearance projections, and responsive crowd surge simulation.'}
          </p>
        </div>

        {/* Global Surge Simulator trigger (Hidden for Participants) */}
        {!isParticipant && (
          <div className="flex items-center gap-3">
            <Button
              variant="warning"
              icon={Zap}
              onClick={() => simulateCrowdSurge(venues[0]?.id, 1.35)}
              className="text-xs font-mono"
            >
              Simulate Surge (Grand Arena)
            </Button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isParticipant ? "Search hall, stage, food court, or gate..." : "Search venue by name, code, or zone..."}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-mono">Zone:</span>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-cyan-500"
          >
            {zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVenues.map(venue => {
          const occRatio = Math.round((venue.currentOccupancy / venue.capacity) * 100);
          const meta = VENUE_METADATA[venue.id] || {
            directions: 'Follow central campus signage.',
            entryGates: 'Main Concourse Entry',
            amenities: ['Information Desk', 'Restrooms'],
            currentActivity: 'Open Event Access'
          };

          // Participant-friendly crowd status
          const crowdLevel = occRatio >= 85 ? 'Packed / Heavy Rush' :
                             occRatio >= 65 ? 'Moderately Busy' :
                             'Comfortable / Open Seats';
          
          const crowdBadgeVariant = occRatio >= 85 ? 'critical' :
                                    occRatio >= 65 ? 'warning' : 'normal';

          const estWaitTime = Math.max(1, Math.round(venue.queueSize / 35));

          return (
            <div
              key={venue.id}
              className={`p-5 rounded-xl bg-[#0c1322] border transition-all duration-200 flex flex-col justify-between ${
                !isParticipant && venue.riskLevel === 'Critical' ? 'border-rose-500/50 glow-rose' :
                !isParticipant && venue.riskLevel === 'Warning' ? 'border-amber-500/40 glow-amber' :
                'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {venue.code}
                    </span>
                    <h3 className="text-base font-semibold text-white tracking-wide mt-1.5 line-clamp-1" title={venue.name}>
                      {venue.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-400">{venue.zone}</p>
                  </div>
                  <Badge variant={isParticipant ? crowdBadgeVariant : venue.riskLevel} dot size="md">
                    {isParticipant ? crowdLevel : venue.riskLevel}
                  </Badge>
                </div>

                {/* Participant Quick Directions Snippet */}
                {isParticipant && (
                  <div className="my-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{meta.directions}</span>
                  </div>
                )}

                {/* Occupancy Progress & Metric */}
                <div className="my-3 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">
                      {isParticipant ? 'Live Seating / Hall Density:' : 'Occupancy:'}
                    </span>
                    <span className="text-white font-bold">
                      {isParticipant
                        ? `${occRatio}% Capacity Filled`
                        : `${venue.currentOccupancy.toLocaleString()} / ${venue.capacity.toLocaleString()} pax (${occRatio}%)`}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        occRatio >= 90 ? 'bg-rose-500' :
                        occRatio >= 75 ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, occRatio)}%` }}
                    />
                  </div>
                </div>

                {/* Telemetry Stats Grid vs Participant Wayfinding Info */}
                {isParticipant ? (
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono py-3 border-y border-slate-800/80 my-3">
                    <div className="p-2 rounded bg-slate-900/60">
                      <span className="text-slate-400 block text-[10px]">EST. ENTRY WAIT</span>
                      <span className={`font-bold ${estWaitTime > 12 ? 'text-rose-400' : estWaitTime > 6 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        ~{estWaitTime} Mins
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60">
                      <span className="text-slate-400 block text-[10px]">GATE QUEUE</span>
                      <span className="text-slate-200 font-medium">{venue.queueSize} in line</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60 col-span-2">
                      <span className="text-slate-400 block text-[10px]">CURRENT PROGRAM</span>
                      <span className="text-cyan-300 font-medium truncate block">{meta.currentActivity}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono py-3 border-y border-slate-800/80 my-3">
                    <div className="p-2 rounded bg-slate-900/60">
                      <span className="text-slate-400 block text-[10px]">QUEUE SIZE</span>
                      <span className="text-amber-400 font-bold">{venue.queueSize} persons</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60">
                      <span className="text-slate-400 block text-[10px]">RISK INDEX</span>
                      <span className={`font-bold ${
                        venue.riskLevel === 'Critical' ? 'text-rose-400' : venue.riskLevel === 'Warning' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {venue.riskScore} / 100
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60">
                      <span className="text-slate-400 block text-[10px]">INFLOW RATE</span>
                      <span className="text-slate-200 font-medium">+{venue.inflowRate} p/min</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60">
                      <span className="text-slate-400 block text-[10px]">EGRESS GATES</span>
                      <span className="text-slate-200 font-medium">{venue.egressGates} Gates Active</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={isParticipant ? Navigation : Eye}
                  onClick={() => handleInspect(venue)}
                  className="text-xs font-mono flex-1"
                >
                  {isParticipant ? 'Directions & Guide' : 'Inspect'}
                </Button>

                {/* Simulate Surge is strictly admin/operator only */}
                {!isParticipant && (
                  <Button
                    variant="warning"
                    size="sm"
                    icon={Zap}
                    onClick={() => simulateCrowdSurge(venue.id, 1.35)}
                    className="text-xs font-mono flex-1"
                  >
                    Simulate Surge
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* VENUE INSPECT / WAYFINDING MODAL */}
      <Modal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        title={selectedVenue?.name || "Venue Details"}
        subtitle={`Zone: ${selectedVenue?.zone} • Code: ${selectedVenue?.code}`}
        maxWidth="max-w-2xl"
      >
        {selectedVenue && (() => {
          const meta = VENUE_METADATA[selectedVenue.id] || {
            directions: 'Follow campus signs to reach this hall.',
            entryGates: 'Main Concourse Doorways',
            amenities: ['Information Desk', 'Restrooms'],
            currentActivity: 'Open Access Session'
          };
          const estWaitTime = Math.max(1, Math.round(selectedVenue.queueSize / 35));

          return isParticipant ? (
            /* PARTICIPANT WAYFINDING GUIDE */
            <div className="space-y-5">
              {/* Top Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">CROWD LEVEL</span>
                  <span className={`text-base font-bold ${selectedVenue.riskLevel === 'Critical' ? 'text-rose-400' : selectedVenue.riskLevel === 'Warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {selectedVenue.riskLevel === 'Critical' ? 'Heavy Rush' : selectedVenue.riskLevel === 'Warning' ? 'Moderate' : 'Comfortable'}
                  </span>
                  <span className="text-slate-500 block text-[10px]">Seats filled: {Math.round((selectedVenue.currentOccupancy / selectedVenue.capacity) * 100)}%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ENTRY LINE ESTIMATE</span>
                  <span className="text-cyan-400 font-bold text-base">~{estWaitTime} Minutes</span>
                  <span className="text-slate-500 block text-[10px]">{selectedVenue.queueSize} attendees waiting</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">GATES OPEN</span>
                  <span className="text-emerald-400 font-bold text-base">{selectedVenue.egressGates} Access Doors</span>
                  <span className="text-slate-500 block text-[10px]">Entry & exit paths</span>
                </div>
              </div>

              {/* Step-by-Step Walking Directions */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 to-slate-900 border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span>Walking Directions & Location</span>
                </div>
                <p className="text-white text-sm">
                  {meta.directions}
                </p>
                <div className="text-xs font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                  <strong>Access Gates:</strong> {meta.entryGates}
                </div>
              </div>

              {/* Ongoing Program */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-300 font-mono text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ongoing Venue Activity</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  {meta.currentActivity}
                </p>
              </div>

              {/* Amenities available */}
              <div className="space-y-2 font-mono">
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                  Available Amenities in this Zone:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {meta.amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Close */}
              <div className="flex justify-end pt-3 border-t border-slate-800">
                <Button variant="primary" onClick={() => setInspectModalOpen(false)} className="text-xs font-mono">
                  Got It
                </Button>
              </div>
            </div>
          ) : (
            /* ADMIN/OPERATOR INSPECT DOSSIER (Full telemetry) */
            <div className="space-y-5">
              {/* Top Stat Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">HEADCOUNT</span>
                  <span className="text-white font-bold text-base">{selectedVenue.currentOccupancy.toLocaleString()}</span>
                  <span className="text-slate-500 block text-[10px]">Cap: {selectedVenue.capacity.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">QUEUE WAITING</span>
                  <span className="text-amber-400 font-bold text-base">{selectedVenue.queueSize} pax</span>
                  <span className="text-slate-500 block text-[10px]">Wait: ~{Math.round(selectedVenue.queueSize / 35)} mins</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">RISK SCORE</span>
                  <span className={`font-bold text-base ${
                    selectedVenue.riskLevel === 'Critical' ? 'text-rose-400' :
                    selectedVenue.riskLevel === 'Warning' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {selectedVenue.riskScore} / 100
                  </span>
                  <span className="text-slate-500 block text-[10px]">{selectedVenue.riskLevel} Status</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">CLEARANCE TIME</span>
                  <span className="text-cyan-400 font-bold text-base">{selectedVenue.evacuationClearTimeMinutes || '8.5'} min</span>
                  <span className="text-slate-500 block text-[10px]">Egress standard</span>
                </div>
              </div>

              {/* Environmental & Safety Telemetry */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Sensor Array Telemetry
                </h4>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2.5">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">TEMPERATURE</span>
                      <span className="text-white">{selectedVenue.temperature || '21.5°C'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">CO2 CONCENTRATION</span>
                      <span className="text-white">{selectedVenue.co2Level || '650 ppm'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <DoorOpen className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">CAMERA CHANNELS</span>
                      <span className="text-white">{selectedVenue.cameraFeeds || 6} Optical Streams</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Factor Breakdown */}
              {selectedVenue.riskBreakdown && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                    Calculated Risk Sub-Factors
                  </h4>
                  <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Occupancy Density Factor:</span>
                      <span className="text-white font-bold">{selectedVenue.riskBreakdown.occupancy} / 45 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Queue Bottleneck Factor:</span>
                      <span className="text-amber-400 font-bold">{selectedVenue.riskBreakdown.queue} / 25 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Inflow vs Egress Differential:</span>
                      <span className="text-cyan-400 font-bold">{selectedVenue.riskBreakdown.flowDelta} / 20 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Gate Aperture Density Penalty:</span>
                      <span className="text-slate-300 font-bold">{selectedVenue.riskBreakdown.gateDensity} / 10 pts</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <Button
                  variant="warning"
                  icon={Zap}
                  onClick={() => {
                    simulateCrowdSurge(selectedVenue.id, 1.4);
                    setInspectModalOpen(false);
                  }}
                  className="text-xs font-mono"
                >
                  Apply Test Surge To This Sector
                </Button>
                <Button variant="outline" onClick={() => setInspectModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
