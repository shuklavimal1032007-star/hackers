import React, { useState } from 'react';
import {
  Bus,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  Send,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Radio,
  MapPin,
  Sparkles,
  QrCode,
  Check,
  RotateCcw,
  AlertOctagon,
  ChevronRight,
  Package,
  Plus,
  Truck,
  Droplet,
  Coffee,
  HeartPulse,
  Shield,
  Wrench,
  Boxes,
  HelpCircle,
  MessageCircle,
  FileText,
  Calendar,
  Briefcase,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function VolunteerPortalPage() {
  const {
    volunteers,
    activeVolunteerId,
    setActiveVolunteerId,
    buses,
    busRequests,
    sendBusRequest,
    updateBusOccupancy,
    markBusDeparted,
    resourceRequests,
    createResourceRequest,
    volunteerRespondResourceRequest,
    events,
    teams,
    tasks,
    updateTaskStatus,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' | 'checkpoint' | 'resources'
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [replyingRequestId, setReplyingRequestId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Resource Request form state
  const [resCategory, setResCategory] = useState('buses');
  const [resName, setResName] = useState('');
  const [resRequiredQty, setResRequiredQty] = useState(1);
  const [resAvailableQty, setResAvailableQty] = useState(0);
  const [resUrgency, setResUrgency] = useState('High');
  const [resLocation, setResLocation] = useState('');
  const [resReason, setResReason] = useState('');
  const [resRequiredBy, setResRequiredBy] = useState('Within 1 hour');

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [passengersWaiting, setPassengersWaiting] = useState(28);
  const [urgencyLevel, setUrgencyLevel] = useState('Critical');
  const [customNotes, setCustomNotes] = useState(
    'Bus 02 is 100% full (50/50). More than 28 registered hackathon participants are stranded at the North Hostel Circle stop. Urgently requesting an additional backup bus before opening ceremony!'
  );

  // Current active volunteer
  const activeVolunteer = volunteers.find(v => v.id === activeVolunteerId) || volunteers[2] || volunteers[0];

  // Assigned bus (or first bus matching volunteer or default BUS-02)
  const assignedBus = buses.find(b => b.assignedVolunteerId === activeVolunteer.id) ||
                      buses.find(b => b.busNumber === 'BUS-02') ||
                      buses[1] || buses[0];

  // Look for any request related to this bus or volunteer
  const activeRequest = busRequests.find(r => r.busId === assignedBus?.id || r.volunteerId === activeVolunteer?.id);

  const isBusFull = assignedBus ? (assignedBus.currentPassengers >= assignedBus.totalCapacity || assignedBus.status === 'Full') : false;
  const occupancyPct = assignedBus ? Math.round((assignedBus.currentPassengers / assignedBus.totalCapacity) * 100) : 0;

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!assignedBus) return;

    sendBusRequest({
      busId: assignedBus.id,
      pickupLocation: assignedBus.pickupLocation,
      passengersWaiting: Number(passengersWaiting) || 20,
      urgency: urgencyLevel,
      volunteerNotes: customNotes
    });

    setRequestModalOpen(false);
  };

  const myResourceRequests = resourceRequests.filter(r => r.volunteerId === activeVolunteer.id);
  const displayedRequests = showAllRequests ? resourceRequests : myResourceRequests;

  const handleCreateResourceRequest = (e) => {
    e.preventDefault();
    if (!resName.trim() && !resCategory) return;

    createResourceRequest({
      resourceCategory: resCategory,
      resourceName: resName.trim() || `${resCategory.toUpperCase()} Unit`,
      requiredQty: Number(resRequiredQty) || 1,
      availableQty: Number(resAvailableQty) || 0,
      urgency: resUrgency,
      location: resLocation.trim() || assignedBus?.pickupLocation || activeVolunteer.assignedVenueName || 'Designated Checkpoint',
      reason: resReason.trim() || 'Immediate resource requisition from ground operations.',
      requiredByTime: resRequiredBy
    });

    setResName('');
    setResRequiredQty(1);
    setResAvailableQty(0);
    setResUrgency('High');
    setResReason('');
    setResourceModalOpen(false);
  };

  const handleSendClarification = (e, reqId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    volunteerRespondResourceRequest(reqId, replyText.trim());
    setReplyText('');
    setReplyingRequestId(null);
  };

  const assignedTeam = (teams || []).find(t => t.id === activeVolunteer?.teamId) || (teams || [])[0];
  const assignedEvent = (events || []).find(e => e.id === activeVolunteer?.eventId) || (events || [])[0];
  const myTasks = (tasks || []).filter(t => t.assignedTo === activeVolunteer?.name || t.teamId === activeVolunteer?.teamId);
  const pendingMyTasks = myTasks.filter(t => t.status !== 'Completed');
  const squadTeammates = (volunteers || []).filter(v => v.teamId === (activeVolunteer?.teamId || assignedTeam?.id) && v.id !== activeVolunteer?.id);

  return (
    <div className="space-y-6">
      {/* Top Banner & Volunteer Identity Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Ground Volunteer Field Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <Radio className="w-7 h-7 text-emerald-400" />
            VOLUNTEER DISPATCH & FIELD LOGISTICS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            View assigned events, squads, and tasks dispatched by event organisers, manage attendee transit, and requisition field supplies.
          </p>
        </div>

        {/* Volunteer Persona Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl">
          <span className="text-xs font-mono text-slate-400 pl-2">Active Volunteer:</span>
          <select
            value={activeVolunteer.id}
            onChange={(e) => setActiveVolunteerId(e.target.value)}
            className="bg-slate-800 text-xs font-mono text-white py-1 px-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {volunteers.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.teamName || v.role.split('-')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs between Assignments, Bus Terminal & Resource Requests */}
      <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-mono font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'assignments'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Event, Squad & Tasks</span>
          {pendingMyTasks.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {pendingMyTasks.length} Active
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('checkpoint')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-mono font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'checkpoint'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Bus Checkpoint Terminal</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-mono font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'resources'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Resource Requests</span>
          {myResourceRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {myResourceRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Volunteer Duty Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/20 border border-emerald-500/30 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={activeVolunteer.avatar}
              alt={activeVolunteer.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white font-mono">{activeVolunteer.name}</h2>
                <Badge variant="normal" dot size="sm">ON FIELD DUTY</Badge>
                {activeVolunteer.teamName && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {activeVolunteer.teamName}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">{activeVolunteer.role}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                <span>Event: <strong className="text-slate-200">{activeVolunteer.eventName || assignedEvent?.title}</strong></span>
                <span>•</span>
                <span>Shift: <strong className="text-cyan-300">{activeVolunteer.shiftSchedule || '08:00 - 16:00'}</strong></span>
                <span>•</span>
                <span>Radio: <strong className="text-amber-300">{assignedTeam?.contactRadio || 'Channel 2'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-right font-mono">
              <span className="block text-[10px] text-slate-400">ASSIGNED SQUAD</span>
              <span className="text-xs font-bold text-emerald-300">{assignedTeam?.name}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-right font-mono">
              <span className="block text-[10px] text-slate-400">ACTIVE DIRECTIVES</span>
              <span className="text-sm font-bold text-cyan-400">{pendingMyTasks.length} Pending</span>
            </div>
          </div>
        </div>
      </div>
      {/* TAB 1: MY EVENT, SQUAD & TASKS */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Section 1: Assigned Event & Squad Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Event Details Card */}
            <Card className="p-6 bg-[#090e1c] border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Assigned Event</span>
                </div>
                <Badge variant="normal" size="sm">LIVE EVENT</Badge>
              </div>

              <div>
                <h3 className="text-lg font-bold font-mono text-white">
                  {assignedEvent?.title || 'Global AI Hackathon Grand Finals'}
                </h3>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">
                  Code: {assignedEvent?.code || 'AI-HACK-2026'}
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Venue: <strong className="text-white">{assignedEvent?.venueName || 'Grand Arena Hall'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Your Shift: <strong className="text-emerald-400">{activeVolunteer?.shiftSchedule || '08:00 - 16:00'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Supervised by: <strong className="text-slate-200">Sarah Jenkins (Lead Director)</strong></span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
                Check-in status: <span className="text-emerald-400 font-bold">Verified on site</span>. Egress gate access granted.
              </div>
            </Card>

            {/* Squad Details Card */}
            <Card className="p-6 bg-[#090e1c] border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Operational Squad</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  {assignedTeam?.membersCount || 10} MEMBERS
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold font-mono text-white">
                  {assignedTeam?.name || 'Perimeter Security & Access'}
                </h3>
                <p className="text-xs text-amber-400 font-mono mt-0.5">
                  Radio Channel: <strong>{assignedTeam?.contactRadio || 'Channel 2 (Security)'}</strong>
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-300">
                <p>Squad Lead: <strong className="text-white">{assignedTeam?.lead || 'Marcus Chen'}</strong> ({assignedTeam?.leadRole || 'Lead'})</p>
                <p>Primary Staging: <strong className="text-slate-200">{assignedTeam?.venue || 'Gate 1 North Checkpoint'}</strong></p>
                <p className="text-slate-400 text-[11px] font-sans">
                  "{assignedTeam?.primaryDuty || 'Maintain perimeter cordons and coordinate field logistics.'}"
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${assignedTeam?.lead ? '+15553459012' : ''}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-xs font-mono text-slate-200 text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Squad Lead</span>
                </a>
              </div>
            </Card>

            {/* Defined Responsibilities & Safety Directives */}
            <Card className="p-6 bg-[#090e1c] border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">My Responsibilities</span>
                </div>
                <Badge variant="success" size="sm">ASSIGNED</Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 font-sans leading-relaxed">
                <span className="block font-bold text-emerald-400 font-mono text-[11px] mb-1">ORGANISER DIRECTIVE:</span>
                "{activeVolunteer?.responsibilities || 'Support concourse pedestrian routing, enforce safety guidelines, and assist attendee inquiries.'}"
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-300 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Wear official lanyard & badge at all times</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Report overcrowding immediately on radio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Coordinate shift handoff with squad lead</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Section 2: Assigned Tasks & Directives Board */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  MY ASSIGNED TASKS & FIELD DIRECTIVES
                </h3>
                <p className="text-xs text-slate-400">
                  Tasks assigned directly to you or your squad by Event Organisers. Update status in real time.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                  Total: <strong className="text-white">{myTasks.length}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300">
                  Pending: <strong className="text-white">{pendingMyTasks.length}</strong>
                </span>
              </div>
            </div>

            {myTasks.length === 0 ? (
              <Card className="p-8 text-center bg-[#090e1c] border-slate-800 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold font-mono text-white">All Caught Up!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You currently have no pending tasks assigned. Stand by at your checkpoint or monitor your squad radio channel.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myTasks.map(task => {
                  const isDone = task.status === 'Completed';
                  const inProgress = task.status === 'In Progress';

                  return (
                    <Card
                      key={task.id}
                      className={`p-5 space-y-4 transition-all border ${
                        isDone
                          ? 'bg-slate-950/60 border-slate-800/80 opacity-80'
                          : inProgress
                          ? 'bg-[#090e1c] border-cyan-500/50 shadow-lg shadow-cyan-950/20'
                          : 'bg-[#090e1c] border-amber-500/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {task.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={
                              task.priority === 'Urgent' ? 'critical' :
                              task.priority === 'High' ? 'warning' :
                              'normal'
                            }
                            size="sm"
                          >
                            {task.priority}
                          </Badge>
                          <Badge
                            variant={
                              isDone ? 'success' :
                              inProgress ? 'blue' :
                              'warning'
                            }
                            size="sm"
                          >
                            {task.status}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className={`text-sm font-bold font-mono text-white ${isDone ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                        <span>Due: <strong className="text-cyan-300">{task.dueDate}</strong></span>
                        <span>Squad: <strong className="text-slate-300">{task.teamName}</strong></span>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="pt-2 flex items-center gap-2">
                        {!isDone && !inProgress && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'In Progress')}
                            className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                          >
                            Start Task →
                          </button>
                        )}

                        {inProgress && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'Completed')}
                            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Completed ✓</span>
                          </button>
                        )}

                        {isDone && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'In Progress')}
                            className="w-full py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-mono text-[11px] transition-colors cursor-pointer"
                          >
                            Re-open Task
                          </button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Squad Teammates on Duty */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              SQUAD TEAMMATES ON DUTY ({assignedTeam?.name})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {squadTeammates.slice(0, 8).map(teammate => (
                <div
                  key={teammate.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3"
                >
                  <img
                    src={teammate.avatar}
                    alt={teammate.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white font-mono truncate">{teammate.name}</div>
                    <div className="text-[10px] text-emerald-400 font-mono truncate">{teammate.role}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{teammate.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUS CHECKPOINT TERMINAL */}
      {activeTab === 'checkpoint' && (
        <div className="space-y-6">

      {/* HIGHLIGHTED ADMIN CONFIRMATION STREAM (KEY REQUIREMENT!) */}
      {activeRequest && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white font-mono tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            LIVE ADMIN TELEMETRY & CONFIRMATION STATUS
          </h2>

          {activeRequest.status === 'Pending' && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border-2 border-amber-500/60 shadow-xl shadow-amber-950/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                    <Badge variant="warning">
                      REQUEST PENDING: WAITING FOR ADMIN CONFIRMATION
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">
                      ID: {activeRequest.id}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Backup Bus Requested for {activeRequest.pickupLocation}
                  </h3>
                  <p className="text-xs text-amber-200/90 font-mono">
                    Admin Command Centre has received your alert ({activeRequest.passengersWaiting} attendees waiting). The operator is evaluating the reserve fleet pool.
                  </p>
                  <div className="text-[11px] font-mono text-slate-400 pt-1">
                    Sent at: {new Date(activeRequest.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Urgency: {activeRequest.urgency}
                  </div>
                </div>

                <div className="shrink-0 p-3 rounded-xl bg-slate-950/80 border border-amber-500/40 text-center font-mono">
                  <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1 animate-spin" />
                  <span className="text-xs text-amber-300 font-bold block">Awaiting Dispatch</span>
                  <span className="text-[10px] text-slate-400">Admin reviewing...</span>
                </div>
              </div>
            </div>
          )}

          {activeRequest.status === 'Approved' && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-teal-950/40 to-slate-900 border-2 border-emerald-500 shadow-2xl shadow-emerald-950/50 animate-in fade-in duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981]" />
                    <Badge variant="normal" size="lg" dot>
                      ADMIN CONFIRMATION RECEIVED — BACKUP BUS ON THE WAY!
                    </Badge>
                    <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      CONFIRMED BY: {activeRequest.confirmedBy}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    Extra Bus Assigned: {activeRequest.assignedBackupBusNumber}
                  </h3>

                  {/* Admin Note Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-xs text-emerald-200 font-mono leading-relaxed">
                    <span className="text-emerald-400 font-bold block mb-1">DIRECTIVE FROM COMMAND OPERATOR:</span>
                    "{activeRequest.adminNotes}"
                  </div>

                  {/* Backup Fleet Driver & ETA */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="block text-[10px] text-slate-400">ESTIMATED ARRIVAL</span>
                      <span className="text-emerald-400 font-bold text-base">
                        ~{activeRequest.backupEtaMinutes} MINUTES
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="block text-[10px] text-slate-400">BACKUP DRIVER</span>
                      <span className="text-white font-semibold">{activeRequest.backupDriverName}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="block text-[10px] text-slate-400">DRIVER PHONE</span>
                      <span className="text-cyan-300 font-semibold">{activeRequest.backupDriverPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  <a
                    href={`tel:${activeRequest.backupDriverPhone}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-lg shadow-emerald-950/50 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Backup Driver
                  </a>
                  <button
                    onClick={() => alert("Marked backup bus as arrived! You can now commence boarding remaining attendees.")}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Acknowledge & Ready
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRequest.status === 'Rejected' && (
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/50 text-xs font-mono text-rose-200">
              <div className="flex items-center gap-2 font-bold text-rose-300 text-sm mb-1">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Request Declined by Command Admin
              </div>
              <p>Reason: "{activeRequest.adminNotes}"</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Reviewed at: {new Date(activeRequest.confirmedAt).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* MAIN CHECKPOINT BOARDING TERMINAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Bus Status & Big Alert Trigger */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6 border-slate-800 bg-[#090e1c]">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white font-mono">{assignedBus?.busNumber}</span>
                  <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {assignedBus?.licensePlate}
                  </span>
                  {isBusFull ? (
                    <Badge variant="critical" dot>BUS FULL (100%)</Badge>
                  ) : (
                    <Badge variant="warning" dot>BOARDING ACTIVE</Badge>
                  )}
                </div>
                <p className="text-xs text-cyan-400 font-mono mt-1">{assignedBus?.routeName}</p>
              </div>

              <div className="text-left sm:text-right font-mono text-xs">
                <span className="text-slate-400 block">SCHEDULED DEPARTURE</span>
                <span className="text-cyan-300 font-bold text-sm">{assignedBus?.departureTime}</span>
              </div>
            </div>

            {/* Pickup Point Banner */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">YOUR PICKUP POINT</span>
                  <span className="text-sm font-bold text-white font-mono">{assignedBus?.pickupLocation}</span>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/60 hidden sm:inline">
                Checkpoint Open
              </span>
            </div>

            {/* Capacity Meter */}
            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono">
                <div>
                  <span className="text-xs text-slate-400 block">SEAT OCCUPANCY METER</span>
                  <span className={`text-2xl font-bold ${isBusFull ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                    {assignedBus?.currentPassengers} / {assignedBus?.totalCapacity} Seats Filled
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">AVAILABLE SEATS</span>
                  <span className={`text-xl font-bold ${isBusFull ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {Math.max(0, (assignedBus?.totalCapacity || 50) - (assignedBus?.currentPassengers || 0))} Left
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isBusFull
                      ? 'bg-gradient-to-r from-amber-500 to-rose-600 shadow-[0_0_12px_#f43f5e]'
                      : occupancyPct > 80
                      ? 'bg-gradient-to-r from-cyan-500 to-amber-500'
                      : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                  }`}
                  style={{ width: `${Math.min(100, occupancyPct)}%` }}
                />
              </div>

              {/* Counter Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-mono text-slate-400 mr-2">Boarding Controls:</span>
                <button
                  onClick={() => updateBusOccupancy(assignedBus?.id, (assignedBus?.currentPassengers || 0) + 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-medium transition-colors border border-slate-700"
                >
                  +1 Attendee
                </button>
                <button
                  onClick={() => updateBusOccupancy(assignedBus?.id, (assignedBus?.currentPassengers || 0) + 5)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-medium transition-colors border border-slate-700"
                >
                  +5 Batch
                </button>
                <button
                  onClick={() => updateBusOccupancy(assignedBus?.id, Math.max(0, (assignedBus?.currentPassengers || 0) - 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-mono transition-colors border border-slate-700"
                >
                  -1
                </button>
                <button
                  onClick={() => updateBusOccupancy(assignedBus?.id, assignedBus?.totalCapacity || 50)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-mono font-bold transition-colors border border-rose-500/40"
                >
                  Simulate Full (50/50)
                </button>
              </div>
            </div>

            {/* THE CORE BUTTON: REPORT BUS FULL / REQUEST EXTRA BUS */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-amber-950/20 to-slate-900 border-2 border-rose-500/60 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    BUS FULL / CAPACITY OVERFLOW
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    If the bus is packed and registered participants are still waiting at the pickup stop, alert Admin Command immediately.
                  </p>
                </div>

                <Button
                  variant="danger"
                  icon={Send}
                  onClick={() => setRequestModalOpen(true)}
                  className="text-xs font-mono font-bold py-3 px-5 shadow-rose-950/60 shrink-0"
                >
                  🚨 Request Extra Bus From Admin
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Route Stops, Driver Contact & Quick Actions */}
        <div className="space-y-6">
          {/* Driver Contact Box */}
          <Card className="p-5 space-y-4 border-slate-800 bg-[#090e1c]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Assigned Bus Driver
            </h3>
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-sm font-bold text-white font-mono block">{assignedBus?.driverName}</span>
                <span className="text-xs text-slate-400 font-mono">{assignedBus?.driverPhone}</span>
              </div>
              <a
                href={`tel:${assignedBus?.driverPhone}`}
                className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                title="Call Driver"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            <Button
              variant="outline"
              icon={Check}
              onClick={() => markBusDeparted(assignedBus?.id)}
              className="w-full text-xs font-mono"
            >
              Mark Bus Departed to Venue
            </Button>
          </Card>

          {/* Route Stops Progression */}
          <Card className="p-5 space-y-4 border-slate-800 bg-[#090e1c]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Route Itinerary & Stops
            </h3>
            <div className="space-y-3 font-mono text-xs">
              {assignedBus?.stops && assignedBus.stops.length > 0 ? (
                assignedBus.stops.map((stop, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-300 font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 pb-3 border-b border-slate-800/80">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{stop.name}</span>
                        <span className="text-cyan-400">{stop.time}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Status: {stop.status} {stop.count > 0 ? `(${stop.count} boarded)` : ''}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-2 text-slate-400 text-xs">
                  <div className="flex justify-between">
                    <span>1. {assignedBus?.pickupLocation}</span>
                    <span className="text-cyan-400">08:15 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2. {assignedBus?.destination}</span>
                    <span className="text-cyan-400">08:50 AM</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      </div>
      )}

      {/* TAB 2: RESOURCE REQUESTS (FEATURE 2) */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold uppercase text-emerald-300">
                  Field Resource Requisitions & Operations Tracking
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-mono text-white">
                Resource Logistics Desk for {activeVolunteer.name}
              </h2>
              <p className="text-xs text-slate-400">
                Request backup buses, transport vans, medical kits, crowd barriers, equipment, food, or water directly from Command Ops.
              </p>
            </div>

            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                setResLocation(assignedBus?.pickupLocation || activeVolunteer.assignedVenueName || 'Field Checkpoint');
                setResourceModalOpen(true);
              }}
              className="text-xs font-mono shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500/40 shadow-lg shadow-emerald-950/50"
            >
              Request Resources
            </Button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Total Requisitions</span>
              <span className="text-xl font-bold text-white mt-1 block">{resourceRequests.length}</span>
              <span className="text-[10px] text-slate-400">Logged across all zones</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800">
              <span className="text-[10px] text-emerald-400 block uppercase">Approved / En Route</span>
              <span className="text-xl font-bold text-emerald-300 mt-1 block">
                {resourceRequests.filter(r => r.status === 'Approved' || r.status === 'Partially Approved').length}
              </span>
              <span className="text-[10px] text-slate-400">Admin authorized</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800">
              <span className="text-[10px] text-cyan-400 block uppercase">Delivered (Fulfilled)</span>
              <span className="text-xl font-bold text-cyan-300 mt-1 block">
                {resourceRequests.filter(r => r.fulfillmentStatus === 'Fulfilled').length}
              </span>
              <span className="text-[10px] text-slate-400">Operations completed</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800">
              <span className="text-[10px] text-amber-400 block uppercase">Pending Review</span>
              <span className="text-xl font-bold text-amber-300 mt-1 block">
                {resourceRequests.filter(r => r.status === 'Pending' || r.status === 'More Info Needed').length}
              </span>
              <span className="text-[10px] text-slate-400">Under admin assessment</span>
            </div>
          </div>

          {/* View Filter Toggles */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAllRequests(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  !showAllRequests
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                My Checkpoint Requests ({myResourceRequests.length})
              </button>
              <button
                onClick={() => setShowAllRequests(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  showAllRequests
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                All Field Requisitions ({resourceRequests.length})
              </button>
            </div>

            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Showing {displayedRequests.length} requisitions
            </span>
          </div>

          {/* Requests Stream */}
          {displayedRequests.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-slate-800 bg-[#090e1c] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <Boxes className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-white font-mono">No Resource Requests Logged</h3>
                <p className="text-xs text-slate-400">
                  You have not submitted any logistics or equipment requisitions for this checkpoint. Need extra buses, water packs, medical support, or barricades?
                </p>
              </div>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setResLocation(assignedBus?.pickupLocation || activeVolunteer.assignedVenueName || 'Field Checkpoint');
                  setResourceModalOpen(true);
                }}
                className="text-xs font-mono bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500/40"
              >
                Request Resources Now
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {displayedRequests.map((req) => {
                const isUrgent = req.urgency === 'Critical' || req.urgency === 'High';
                const hasShortage = req.shortage > 0;

                // Category Icon
                let CatIcon = Package;
                if (req.resourceCategory === 'buses' || req.resourceCategory === 'transportation') CatIcon = Bus;
                if (req.resourceCategory === 'medical support') CatIcon = HeartPulse;
                if (req.resourceCategory === 'security') CatIcon = Shield;
                if (req.resourceCategory === 'food') CatIcon = Coffee;
                if (req.resourceCategory === 'water') CatIcon = Droplet;
                if (req.resourceCategory === 'equipment') CatIcon = Wrench;

                return (
                  <Card
                    key={req.id}
                    className={`p-5 space-y-4 border transition-all ${
                      req.status === 'More Info Needed'
                        ? 'border-amber-500/60 bg-gradient-to-b from-amber-950/20 to-[#090e1c]'
                        : isUrgent
                        ? 'border-slate-800 hover:border-slate-700 bg-[#090e1c]'
                        : 'border-slate-800 bg-[#090e1c]'
                    }`}
                  >
                    {/* Top Row: ID, Category, Urgency, Timestamp */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                          <CatIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-cyan-300">{req.id}</span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-xs font-mono font-semibold uppercase text-slate-300">
                              {req.resourceCategory}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">
                            {req.resourceName}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          req.urgency === 'Critical' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' :
                          req.urgency === 'High' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                          req.urgency === 'Medium' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {req.urgency} Urgency
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          Required by: <strong className="text-slate-200">{req.requiredByTime}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Middle: Quantities, Location, and Reason */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                      {/* Quantities Card */}
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">
                          Quantities Breakdown
                        </span>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Required:</span>
                          <span className="text-white font-bold">{req.requiredQty} units</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Available on ground:</span>
                          <span>{req.availableQty} units</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                          <span className="text-slate-400">Net Shortage:</span>
                          <span className={`font-bold ${hasShortage ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {req.shortage} units {hasShortage ? '(Deficit)' : '(Balanced)'}
                          </span>
                        </div>
                      </div>

                      {/* Location & Requester */}
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">
                          Checkpoint Location
                        </span>
                        <div className="flex items-center gap-1.5 text-white font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{req.location}</span>
                        </div>
                        <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                          Requested by: <strong className="text-slate-200">{req.volunteerName}</strong> ({req.volunteerRole})
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">
                          Justification & Reason
                        </span>
                        <p className="text-slate-300 text-[11px] line-clamp-3 italic">
                          "{req.reason}"
                        </p>
                      </div>
                    </div>

                    {/* TWO SEPARATE STATUS PANELS: 1. ADMIN DECISION  2. OPERATIONS FULFILLMENT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {/* PANEL 1: ADMIN DECISION STATUS */}
                      <div className={`p-3.5 rounded-xl border font-mono text-xs space-y-2 ${
                        req.status === 'Approved' ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' :
                        req.status === 'Partially Approved' ? 'bg-teal-950/20 border-teal-500/40 text-teal-200' :
                        req.status === 'Rejected' ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' :
                        req.status === 'More Info Needed' ? 'bg-amber-950/30 border-amber-500/50 text-amber-200' :
                        'bg-slate-900/90 border-slate-800 text-slate-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            1. Admin Command Review
                          </span>
                          <Badge
                            variant={
                              req.status === 'Approved' ? 'normal' :
                              req.status === 'Partially Approved' ? 'blue' :
                              req.status === 'Rejected' ? 'critical' :
                              req.status === 'More Info Needed' ? 'warning' : 'secondary'
                            }
                            size="sm"
                          >
                            {req.status}
                          </Badge>
                        </div>

                        {req.status === 'Pending' && (
                          <p className="text-[11px] text-slate-400">
                            Waiting for Command Ops evaluation. Resources will be dispatched upon review.
                          </p>
                        )}

                        {(req.status === 'Approved' || req.status === 'Partially Approved') && (
                          <div className="space-y-1 text-[11px]">
                            <div className="flex justify-between">
                              <span>Approved Quantity:</span>
                              <strong className="text-white">{req.approvedQty} units</strong>
                            </div>
                            <p className="text-slate-300">
                              <strong>Decision Note:</strong> "{req.decisionNotes}"
                            </p>
                            <span className="text-[10px] text-slate-400 block">
                              Decided by: {req.decidedBy} • {new Date(req.decidedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}

                        {req.status === 'Rejected' && (
                          <div className="space-y-1 text-[11px]">
                            <p className="text-rose-300">
                              <strong>Decline Reason:</strong> "{req.decisionNotes}"
                            </p>
                            <span className="text-[10px] text-slate-400 block">
                              Decided by: {req.decidedBy}
                            </span>
                          </div>
                        )}

                        {req.status === 'More Info Needed' && (
                          <div className="space-y-2 text-[11px]">
                            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200">
                              <strong>Admin Inquiry:</strong> "{req.decisionNotes}"
                            </div>

                            {/* Volunteer Clarification Reply Area */}
                            {replyingRequestId === req.id ? (
                              <form onSubmit={(e) => handleSendClarification(e, req.id)} className="space-y-2 pt-1">
                                <textarea
                                  rows={2}
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Type clarification regarding attendee headcount, location details..."
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                                  required
                                />
                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setReplyingRequestId(null)}
                                    className="text-[10px] font-mono py-1"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    icon={Send}
                                    className="text-[10px] font-mono py-1 bg-amber-600 hover:bg-amber-500"
                                  >
                                    Submit Clarification
                                  </Button>
                                </div>
                              </form>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                icon={MessageCircle}
                                onClick={() => {
                                  setReplyingRequestId(req.id);
                                  setReplyText('');
                                }}
                                className="w-full text-xs font-mono border-amber-500/50 text-amber-300 hover:bg-amber-950/30"
                              >
                                Reply with Clarification to Admin
                              </Button>
                            )}
                          </div>
                        )}

                        {/* If replies exist */}
                        {req.volunteerReplies && req.volunteerReplies.length > 0 && (
                          <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                            <span className="text-[10px] text-slate-400 block font-bold">Volunteer Clarification History:</span>
                            {req.volunteerReplies.map(rep => (
                              <p key={rep.id} className="text-slate-300 italic bg-slate-950/50 p-1.5 rounded border border-slate-800">
                                "{rep.message}" <span className="text-[10px] text-slate-500">({rep.volunteerName})</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* PANEL 2: OPERATIONS FULFILLMENT STATUS (SEPARATE ACTION) */}
                      <div className={`p-3.5 rounded-xl border font-mono text-xs space-y-2 ${
                        req.fulfillmentStatus === 'Fulfilled' ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' :
                        req.fulfillmentStatus === 'In Progress' ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-200' :
                        'bg-slate-900/90 border-slate-800 text-slate-400'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            2. Ground Operations Delivery
                          </span>
                          <Badge
                            variant={
                              req.fulfillmentStatus === 'Fulfilled' ? 'normal' :
                              req.fulfillmentStatus === 'In Progress' ? 'blue' : 'secondary'
                            }
                            size="sm"
                          >
                            {req.fulfillmentStatus}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Assigned Logistics Squad:</span>
                            <strong className="text-slate-200">{req.assignedOperationsStaff || 'Unassigned'}</strong>
                          </div>

                          {req.fulfillmentStatus === 'In Progress' && (
                            <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 space-y-0.5">
                              <strong>Delivery Status:</strong> {req.operationsNotes || 'Supplies dispatched and en route to checkpoint.'}
                            </div>
                          )}

                          {req.fulfillmentStatus === 'Fulfilled' && (
                            <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 space-y-0.5">
                              <strong>Delivery Confirmed:</strong> {req.operationsNotes || 'Resources arrived and verified on site.'}
                            </div>
                          )}

                          {req.fulfillmentStatus === 'Unassigned' && (
                            <p className="text-[11px] text-slate-400 pt-1">
                              Awaiting operations assignment. Ground logistics units are notified automatically upon admin approval.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CREATE RESOURCE REQUEST MODAL */}
      <Modal
        isOpen={resourceModalOpen}
        onClose={() => setResourceModalOpen(false)}
        title="SUBMIT RESOURCE REQUISITION"
        subtitle={`Request field logistics from Command Ops for ${activeVolunteer.name}`}
        icon={Package}
        size="md"
      >
        <form onSubmit={handleCreateResourceRequest} className="space-y-4 font-sans text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                RESOURCE CATEGORY *
              </label>
              <select
                value={resCategory}
                onChange={(e) => setResCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value="buses">buses (Standby / Backup Shuttles)</option>
                <option value="transportation">transportation (Vans / Carts / Escorts)</option>
                <option value="medical support">medical support (First Aid / Paramedics)</option>
                <option value="security">security (Barricades / Security Staff)</option>
                <option value="equipment">equipment (Radios / Generators / Cables)</option>
                <option value="food">food (Meal Boxes / Snacks / Catering)</option>
                <option value="water">water (Drinking Bottled Water / Dispensers)</option>
                <option value="other resources">other resources (Miscellaneous)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                RESOURCE ITEM NAME *
              </label>
              <input
                type="text"
                value={resName}
                onChange={(e) => setResName(e.target.value)}
                placeholder="e.g. 50-Seater Backup Bus, 200x Water Bottles"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                REQUIRED QUANTITY *
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={resRequiredQty}
                onChange={(e) => setResRequiredQty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                AVAILABLE QUANTITY
              </label>
              <input
                type="number"
                min="0"
                max="10000"
                value={resAvailableQty}
                onChange={(e) => setResAvailableQty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                SHORTAGE (AUTO)
              </label>
              <div className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono font-bold flex items-center justify-between">
                <span>{Math.max(0, Number(resRequiredQty) - Number(resAvailableQty))}</span>
                <span className="text-[10px] text-slate-500">Deficit</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                URGENCY LEVEL *
              </label>
              <select
                value={resUrgency}
                onChange={(e) => setResUrgency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value="Critical">Critical — Immediate risk / bottleneck</option>
                <option value="High">High — Urgent within the hour</option>
                <option value="Medium">Medium — Standard supply replenishment</option>
                <option value="Low">Low — Routine standby requisition</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                REQUIRED-BY TIME *
              </label>
              <select
                value={resRequiredBy}
                onChange={(e) => setResRequiredBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value="Immediate">Immediate (&lt;15 mins)</option>
                <option value="Within 30 mins">Within 30 mins</option>
                <option value="Within 1 hour">Within 1 hour</option>
                <option value="Before Event Start">Before Event Start</option>
                <option value="End of Day Shift">End of Day Shift</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              GROUND LOCATION / CHECKPOINT *
            </label>
            <input
              type="text"
              value={resLocation}
              onChange={(e) => setResLocation(e.target.value)}
              placeholder="e.g. North Hostel Circle, Gate 1 North Checkpoint"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              REASON & GROUND CONTEXT *
            </label>
            <textarea
              rows={3}
              value={resReason}
              onChange={(e) => setResReason(e.target.value)}
              placeholder="Explain why this resource is needed (e.g. queue overflow, dehydration risk, equipment failure)..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-200/90 font-mono">
            <strong>Unique Request Tracking:</strong> A unique Request ID (REQ-RES-XXXX) will be generated. Command Ops can approve or partially approve, followed by separate Operations fulfillment dispatch.
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setResourceModalOpen(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Send}
              className="text-xs font-mono font-bold bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500/40"
            >
              Dispatch Requisition
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL TO SEND REQUEST TO ADMIN */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="REPORT BUS FULL — REQUEST BACKUP BUS"
        subtitle={`Command Centre escalation for ${assignedBus?.pickupLocation}`}
        icon={Send}
        size="md"
      >
        <form onSubmit={handleSubmitRequest} className="space-y-4 font-sans">
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 font-mono">
            <strong>Pickup Location:</strong> {assignedBus?.pickupLocation}
            <br />
            <strong>Primary Bus:</strong> {assignedBus?.busNumber} ({assignedBus?.totalCapacity} seats full)
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              ESTIMATED PARTICIPANTS STRANDED IN QUEUE
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={passengersWaiting}
              onChange={(e) => setPassengersWaiting(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
              required
            />
            <p className="text-[11px] text-slate-400">
              Count attendees waiting at the stop who cannot board this bus.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              URGENCY PRIORITY
            </label>
            <select
              value={urgencyLevel}
              onChange={(e) => setUrgencyLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
            >
              <option value="Critical">Critical — Immediate backup bus required before event start</option>
              <option value="High">High — Queue growing rapidly</option>
              <option value="Normal">Normal — Secondary shuttle needed</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              FIELD NOTES & DETAILS FOR COMMAND OPERATOR
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRequestModalOpen(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              icon={Send}
              className="text-xs font-mono font-bold"
            >
              Send Alert to Admin
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
