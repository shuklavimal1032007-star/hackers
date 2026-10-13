import React, { useState } from 'react';
import {
  Ticket,
  Bus,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
  Phone,
  Navigation,
  Calendar,
  Share2,
  Info,
  ShieldCheck,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function ParticipantPortalPage() {
  const {
    events,
    buses,
    busRequests,
    participants,
    activeParticipantId,
    setActiveParticipantId
  } = useApp();

  const participant = participants.find(p => p.id === activeParticipantId) || participants[0];
  const event = events.find(e => e.id === participant.eventId) || events[0];

  // Assigned bus
  const assignedBus = buses.find(b => b.id === participant.assignedBusId) || buses[1] || buses[0];

  // Check if there is an active backup request for this bus/stop
  const activeRequest = busRequests.find(r => r.busId === assignedBus?.id);
  const isBusFull = assignedBus?.status === 'Full' || assignedBus?.currentPassengers >= assignedBus?.totalCapacity;

  return (
    <div className="space-y-6">
      {/* Page Title & Attendee Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Attendee Transportation & Pass Terminal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <Ticket className="w-7 h-7 text-cyan-400" />
            MY PASS & TRANSIT TRACKER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Your live event credentials, pickup shuttle status, and real-time fleet arrival updates.
          </p>
        </div>

        {/* Participant Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl">
          <span className="text-xs font-mono text-slate-400 pl-2">Participant:</span>
          <select
            value={participant.id}
            onChange={(e) => setActiveParticipantId(e.target.value)}
            className="bg-slate-800 text-xs font-mono text-white py-1 px-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            {participants.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.ticketNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LIVE TRANSIT ALERT BANNER (IF BUS FULL OR BACKUP DISPATCHED) */}
      {isBusFull && (
        <div className="space-y-3">
          {activeRequest?.status === 'Approved' ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-900 border-2 border-emerald-500 shadow-xl shadow-emerald-950/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <Badge variant="normal" size="lg" dot>
                      EXTRA BUS DISPATCHED — NO PARTICIPANT LEFT BEHIND
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono">
                    Backup Bus {activeRequest.assignedBackupBusNumber} is En Route to {participant.pickupLocation}
                  </h3>
                  <p className="text-xs text-emerald-200/90 font-mono">
                    The primary bus reached capacity. Event Command Ops dispatched an extra bus with estimated arrival in <strong>~{activeRequest.backupEtaMinutes} minutes</strong>. Please wait safely at the sheltered bus queue.
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Driver: {activeRequest.backupDriverName} ({activeRequest.backupDriverPhone}) • Command Directive: "{activeRequest.adminNotes}"
                  </p>
                </div>

                <div className="shrink-0 p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 text-center font-mono">
                  <span className="text-[10px] text-slate-400 block">ESTIMATED ETA</span>
                  <span className="text-xl font-bold text-emerald-400">~{activeRequest.backupEtaMinutes} MINS</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Extra Bus Dispatched</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/50 text-xs font-mono text-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-300 text-sm mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Primary Bus Capacity Full — Volunteer has alerted Command Ops
              </div>
              <p>
                Volunteer {assignedBus?.assignedVolunteerName} has submitted a request for an extra standby shuttle to pick up remaining participants at {participant.pickupLocation}. Stand by for dispatch updates.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TWO-COLUMN GRID: DIGITAL PASS & BUS PICKUP TRACKER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Digital Event & Transit Pass */}
        <div className="space-y-6">
          <Card className="p-6 space-y-6 border-cyan-500/30 bg-gradient-to-b from-[#0e1628] to-[#070b14] relative overflow-hidden">
            {/* Holographic accent glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Pass Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                  Official Boarding Pass
                </span>
                <h3 className="text-base font-bold text-white font-mono">
                  AEGIS EVENT PASS
                </h3>
              </div>
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>

            {/* Attendee Details */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">ATTENDEE:</span>
                <span className="font-bold text-white text-sm">{participant.name}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">PASS ID:</span>
                <span className="text-cyan-300 font-bold">{participant.ticketNumber}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">CATEGORY:</span>
                <span className="text-slate-200">{participant.seatCategory}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">DESIGNATED STOP:</span>
                <span className="font-semibold text-white">{participant.pickupLocation}</span>
              </div>
            </div>

            {/* Simulated QR Code for Boarding */}
            <div className="p-4 rounded-xl bg-white flex flex-col items-center justify-center text-slate-900 shadow-xl">
              <QrCode className="w-36 h-36 text-slate-950" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-700 mt-2">
                SCAN AT BUS ENTRANCE
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                {participant.ticketNumber} • {participant.seatNumber}
              </span>
            </div>

            <div className="text-center font-mono text-[11px] text-slate-400">
              Show this pass to field volunteer <strong className="text-slate-200">{assignedBus?.assignedVolunteerName}</strong> upon boarding.
            </div>
          </Card>
        </div>

        {/* Right 2 Cols: Pickup Transportation Tracker & Stop Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6 border-slate-800 bg-[#090e1c]">
            {/* Event Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold block">REGISTERED EVENT</span>
                <h2 className="text-xl font-bold text-white font-mono">{event.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Venue: {event.venueName} • Organizer: {event.organizer}</p>
              </div>
              <Badge variant="normal" dot>CONFIRMED</Badge>
            </div>

            {/* Shuttle Bus Status Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
                    <Bus className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white font-mono">{assignedBus?.busNumber}</span>
                      <span className="text-xs font-mono text-slate-400">({assignedBus?.routeName})</span>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 block mt-0.5">
                      Pickup Location: {assignedBus?.pickupLocation}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block">SCHEDULED TIME</span>
                  <span className="text-base font-bold text-white">{assignedBus?.departureTime}</span>
                </div>
              </div>

              {/* Live Occupancy Gauge */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Bus Seating Status:</span>
                  <span className={isBusFull ? 'text-rose-400 font-bold' : 'text-emerald-400 font-semibold'}>
                    {assignedBus?.currentPassengers} / {assignedBus?.totalCapacity} Seats ({isBusFull ? '100% - FULL' : 'Boarding'})
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isBusFull
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                        : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.round(((assignedBus?.currentPassengers || 0) / (assignedBus?.totalCapacity || 1)) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Volunteer & Driver Assistance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="block text-[10px] text-slate-400">FIELD VOLUNTEER ON SITE</span>
                  <span className="text-cyan-300 font-semibold block">{assignedBus?.assignedVolunteerName}</span>
                  <span className="text-[11px] text-slate-400">Available at pickup point</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="block text-[10px] text-slate-400">BUS DRIVER</span>
                  <span className="text-slate-200 font-semibold block">{assignedBus?.driverName}</span>
                  <span className="text-[11px] text-slate-400">{assignedBus?.driverPhone}</span>
                </div>
              </div>
            </div>

            {/* Route Stops Progression */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Transit Stops & Destination
              </h3>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">
                    A
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-white font-semibold">
                      <span>{assignedBus?.pickupLocation}</span>
                      <span className="text-cyan-400">{assignedBus?.departureTime}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Designated attendee pickup point</span>
                  </div>
                </div>

                <div className="border-l-2 border-dashed border-slate-700 ml-3.5 h-6" />

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                    B
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-white font-semibold">
                      <span>{assignedBus?.destination}</span>
                      <span className="text-emerald-400">~25 min transit</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Grand Arena Entry Gates 1 & 2</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
