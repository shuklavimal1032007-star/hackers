import React, { useState } from 'react';
import {
  Bus,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Navigation,
  Phone,
  Send,
  Plus,
  ShieldAlert,
  ArrowRight,
  Filter,
  Check,
  X,
  Radio,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function BusFleetPage() {
  const {
    buses,
    busRequests,
    volunteers,
    confirmBusRequest,
    rejectBusRequest,
    updateBusOccupancy,
    markBusDeparted,
    addBus,
    currentRole,
    sendBusRequest,
    activeVolunteerId
  } = useApp();

  const isVolunteer = currentRole === 'volunteer';

  // Modals state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [addBusModalOpen, setAddBusModalOpen] = useState(false);
  const [requestBackupModalOpen, setRequestBackupModalOpen] = useState(false);
  const [targetBusForRequest, setTargetBusForRequest] = useState(null);
  const [strandedCount, setStrandedCount] = useState(15);
  const [urgencyLevel, setUrgencyLevel] = useState('Critical');
  const [requestNotes, setRequestNotes] = useState('Bus reached full capacity. Attendees waiting at the designated shelter stop.');

  // Dispatch form state
  const [dispatchForm, setDispatchForm] = useState({
    backupBusId: 'bus-104',
    backupBusNumber: 'BUS-04 (Standby Fleet)',
    backupDriverName: 'Gurpreet Singh',
    backupDriverPhone: '+91 98333 44556',
    backupEtaMinutes: 10,
    adminNotes: 'Backup bus authorized and dispatched from Central Depot. Please instruct remaining attendees to wait at the shelter point.'
  });

  const [rejectReason, setRejectReason] = useState('Alternative transport has already been arranged from nearby venue.');

  // New Bus form
  const [newBusForm, setNewBusForm] = useState({
    busNumber: 'BUS-06',
    licensePlate: 'DL-01-AX-9912',
    routeName: 'Route D: South Hub Express',
    pickupLocation: 'South Metro Terminal',
    destination: 'Grand Arena Hall',
    totalCapacity: 50,
    driverName: 'Mohit Sharma',
    driverPhone: '+91 98999 11223'
  });

  const pendingRequests = busRequests.filter(r => r.status === 'Pending');
  const pastRequests = busRequests.filter(r => r.status !== 'Pending');

  const totalCapacity = buses.reduce((acc, b) => acc + (b.totalCapacity || 0), 0);
  const totalPassengers = buses.reduce((acc, b) => acc + (b.currentPassengers || 0), 0);
  const fullBusesCount = buses.filter(b => b.status === 'Full' || b.currentPassengers >= b.totalCapacity).length;
  const standbyBuses = buses.filter(b => b.status === 'Standby');

  const handleOpenDispatch = (req) => {
    setSelectedRequest(req);
    // Find first standby bus if available
    const firstStandby = buses.find(b => b.status === 'Standby');
    if (firstStandby) {
      setDispatchForm(prev => ({
        ...prev,
        backupBusId: firstStandby.id,
        backupBusNumber: firstStandby.busNumber,
        backupDriverName: firstStandby.driverName,
        backupDriverPhone: firstStandby.driverPhone
      }));
    }
    setDispatchModalOpen(true);
  };

  const handleConfirmDispatch = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    confirmBusRequest(selectedRequest.id, dispatchForm);
    setDispatchModalOpen(false);
    setSelectedRequest(null);
  };

  const handleOpenReject = (req) => {
    setSelectedRequest(req);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedRequest) return;
    rejectBusRequest(selectedRequest.id, rejectReason);
    setRejectModalOpen(false);
    setSelectedRequest(null);
  };

  const handleCreateBus = (e) => {
    e.preventDefault();
    addBus({
      ...newBusForm,
      totalCapacity: Number(newBusForm.totalCapacity) || 50
    });
    setAddBusModalOpen(false);
    setNewBusForm({
      busNumber: `BUS-0${buses.length + 2}`,
      licensePlate: 'DL-01-AX-0000',
      routeName: 'New Route Express',
      pickupLocation: 'City Hub',
      destination: 'Grand Arena Hall',
      totalCapacity: 50,
      driverName: 'Driver Name',
      driverPhone: '+91 98000 00000'
    });
  };

  const handleOpenRequestBackup = (bus) => {
    setTargetBusForRequest(bus);
    setStrandedCount(15);
    setUrgencyLevel('Critical');
    setRequestNotes(`Bus ${bus.busNumber} is at capacity. Registered attendees waiting at ${bus.pickupLocation}.`);
    setRequestBackupModalOpen(true);
  };

  const handleConfirmSendRequest = (e) => {
    e.preventDefault();
    if (!targetBusForRequest) return;
    const vol = volunteers.find(v => v.id === activeVolunteerId) || volunteers[0];
    sendBusRequest({
      busId: targetBusForRequest.id,
      busNumber: targetBusForRequest.busNumber,
      pickupLocation: targetBusForRequest.pickupLocation,
      passengersWaiting: Number(strandedCount) || 10,
      urgency: urgencyLevel,
      volunteerNotes: requestNotes,
      volunteerId: vol?.id,
      volunteerName: vol?.name,
      volunteerPhone: vol?.phone
    });
    setRequestBackupModalOpen(false);
    setTargetBusForRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Fleet Operations & Transit Logistics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <Bus className="w-7 h-7 text-cyan-400" />
            TRANSIT & BUS FLEET COMMAND
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time event pickup coordination, crowd transit monitoring, and field volunteer backup bus dispatch.
          </p>
        </div>

        {!isVolunteer && (
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setAddBusModalOpen(true)}
              className="text-xs font-mono"
            >
              Add Fleet Bus
            </Button>
          </div>
        )}
      </div>

      {/* High-Level Fleet Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL FLEET BUSES"
          value={buses.length}
          subtitle={`${standbyBuses.length} buses currently on reserve standby`}
          icon={Bus}
          color="cyan"
        />
        <StatCard
          title="PASSENGERS IN TRANSIT"
          value={totalPassengers.toLocaleString()}
          subtitle={`${Math.round((totalPassengers / (totalCapacity || 1)) * 100)}% overall fleet utilization`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="BUSES AT FULL CAPACITY"
          value={fullBusesCount}
          subtitle={fullBusesCount > 0 ? "Requires active monitoring" : "Flow normal"}
          icon={AlertTriangle}
          color={fullBusesCount > 0 ? "rose" : "emerald"}
        />
        <StatCard
          title="PENDING BACKUP REQUESTS"
          value={pendingRequests.length}
          subtitle={pendingRequests.length > 0 ? "Immediate Admin action needed" : "All pickup routes served"}
          icon={ShieldAlert}
          color={pendingRequests.length > 0 ? "amber" : "slate"}
        />
      </div>

      {/* URGENT VOLUNTEER REQUESTS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${pendingRequests.length > 0 ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
            <h2 className="text-base font-bold text-white font-mono tracking-wider">
              FIELD VOLUNTEER BUS REQUESTS ({pendingRequests.length} ACTIVE)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Direct telemetry link with ground volunteers
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <Card className="p-6 text-center border-dashed border-slate-800 bg-[#0a1020]/50">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-semibold text-slate-200">No Pending Bus Full Alerts</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              All pickup points have sufficient capacity. When a field volunteer reports a full bus or stranded attendees, the alert will instantly flash here for authorization.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-amber-950/20 to-slate-900 border-2 border-rose-500/50 shadow-xl shadow-rose-950/30 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Request Details */}
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="critical" dot>
                        {req.urgency.toUpperCase()} ALERT: BUS FULL
                      </Badge>
                      <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/80">
                        {req.busNumber}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {req.eventName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-white font-semibold text-base sm:text-lg">
                      <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
                      <span>{req.pickupLocation}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
                      <span className="text-rose-400 font-bold font-mono mr-1.5">[Volunteer Report]:</span>
                      "{req.volunteerNotes}"
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                      <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <Users className="w-4 h-4 text-amber-400" />
                        {req.passengersWaiting} Attendees Stranded at Stop
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Reporter: {req.volunteerName} ({req.volunteerPhone})
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Reported at: {new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Actions (Admin/Organiser only) */}
                  <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                    {isVolunteer ? (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        Awaiting Command Dispatch
                      </span>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          icon={Send}
                          onClick={() => handleOpenDispatch(req)}
                          className="text-xs font-mono shadow-emerald-950/40 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-emerald-400/40"
                        >
                          Authorize & Dispatch Backup Bus
                        </Button>
                        <Button
                          variant="secondary"
                          icon={X}
                          onClick={() => handleOpenReject(req)}
                          className="text-xs font-mono text-slate-300 hover:text-rose-300"
                        >
                          Decline Request
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FLEET ROSTER & REAL-TIME CAPACITY TRACKING */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white font-mono tracking-wider">
              ACTIVE TRANSIT FLEET & PICKUP BUSES ({buses.length})
            </h2>
            <p className="text-xs text-slate-400">
              Live capacity monitoring, stop progression, and passenger check-ins
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {buses.map((bus) => {
            const isFull = bus.status === 'Full' || bus.currentPassengers >= bus.totalCapacity;
            const occupancyPct = Math.round((bus.currentPassengers / bus.totalCapacity) * 100);

            const getStatusBadge = () => {
              if (isFull) return <Badge variant="critical" dot>BUS FULL (100%)</Badge>;
              if (bus.status === 'En Route') return <Badge variant="blue" dot>EN ROUTE</Badge>;
              if (bus.status === 'Boarding') return <Badge variant="warning" dot>BOARDING</Badge>;
              return <Badge variant="normal" dot>STANDBY RESERVE</Badge>;
            };

            return (
              <Card
                key={bus.id}
                className={`p-5 space-y-4 border transition-all ${
                  isFull
                    ? 'border-rose-500/50 bg-[#120a10]/70 shadow-lg shadow-rose-950/20'
                    : 'border-slate-800 bg-[#090e1c]/80'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-mono">{bus.busNumber}</span>
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {bus.licensePlate}
                      </span>
                    </div>
                    <p className="text-xs text-cyan-400 font-medium mt-0.5">{bus.routeName}</p>
                  </div>
                  {getStatusBadge()}
                </div>

                {/* Pickup Location & Destination */}
                <div className="space-y-1.5 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Pickup Stop:</span>
                    <span className="font-semibold text-slate-100">{bus.pickupLocation}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Destination:</span>
                    <span className="font-semibold text-slate-100">{bus.destination}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Departure:</span>
                    <span className="text-cyan-300 font-bold">{bus.departureTime}</span>
                  </div>
                </div>

                {/* Capacity Gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Occupancy:</span>
                    <span className={`font-bold ${isFull ? 'text-rose-400' : 'text-slate-200'}`}>
                      {bus.currentPassengers} / {bus.totalCapacity} Seats ({occupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_10px_#f43f5e]'
                          : occupancyPct > 75
                          ? 'bg-gradient-to-r from-cyan-500 to-amber-500'
                          : 'bg-gradient-to-r from-teal-500 to-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, occupancyPct)}%` }}
                    />
                  </div>
                </div>

                {/* Driver & Volunteer Personnel */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-3">
                  <div>
                    <span className="block text-slate-400 text-[10px]">DRIVER:</span>
                    <span className="text-slate-200 font-semibold">{bus.driverName}</span>
                    <span className="block text-slate-400 text-[10px]">{bus.driverPhone}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px]">FIELD VOLUNTEER:</span>
                    <span className="text-cyan-300 font-semibold">{bus.assignedVolunteerName}</span>
                  </div>
                </div>

                {/* Interactive Simulator Buttons for Demo */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateBusOccupancy(bus.id, bus.currentPassengers + 5)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono font-medium transition-colors"
                    >
                      +5 Board
                    </button>
                    <button
                      onClick={() => updateBusOccupancy(bus.id, bus.totalCapacity)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[11px] font-mono font-medium transition-colors"
                    >
                      Mark Full
                    </button>
                    <button
                      onClick={() => markBusDeparted(bus.id)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-medium transition-colors"
                    >
                      Depart
                    </button>
                  </div>

                  {/* Dedicated Volunteer / Staff Request Backup Bus Button */}
                  <Button
                    size="sm"
                    variant="warning"
                    icon={Send}
                    onClick={() => handleOpenRequestBackup(bus)}
                    className="w-full text-xs font-mono font-semibold py-1.5 bg-gradient-to-r from-amber-600/30 to-rose-600/30 border-amber-500/40 text-amber-200 hover:text-white"
                  >
                    🚨 Request Extra Bus For Stop
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* DISPATCH CONFIRMATION MODAL */}
      <Modal
        isOpen={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        title="AUTHORIZE & DISPATCH BACKUP BUS"
        subtitle={`Responding to ${selectedRequest?.volunteerName}'s bus full alert at ${selectedRequest?.pickupLocation}`}
        icon={Send}
        size="lg"
      >
        <form onSubmit={handleConfirmDispatch} className="space-y-4 font-sans">
          {/* Summary Box */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 font-mono">
            <div className="font-bold flex items-center gap-1.5 text-amber-300 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Incoming Ground Request Details
            </div>
            <p><strong>Primary Bus:</strong> {selectedRequest?.busNumber} (Full)</p>
            <p><strong>Pickup Location:</strong> {selectedRequest?.pickupLocation}</p>
            <p><strong>Stranded Attendees:</strong> {selectedRequest?.passengersWaiting} registered participants</p>
            <p><strong>Volunteer Reporter:</strong> {selectedRequest?.volunteerName} ({selectedRequest?.volunteerPhone})</p>
          </div>

          {/* Standby Bus Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-300">
              SELECT BACKUP BUS FROM RESERVE STANDBY FLEET
            </label>
            <select
              value={dispatchForm.backupBusId}
              onChange={(e) => {
                const b = buses.find(x => x.id === e.target.value);
                if (b) {
                  setDispatchForm(prev => ({
                    ...prev,
                    backupBusId: b.id,
                    backupBusNumber: b.busNumber,
                    backupDriverName: b.driverName,
                    backupDriverPhone: b.driverPhone
                  }));
                }
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            >
              {buses.map(b => (
                <option key={b.id} value={b.id}>
                  {b.busNumber} • Capacity: {b.totalCapacity} • Status: {b.status} • Driver: {b.driverName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">ESTIMATED ARRIVAL (ETA MINUTES)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={dispatchForm.backupEtaMinutes}
                onChange={(e) => setDispatchForm(prev => ({ ...prev, backupEtaMinutes: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">DRIVER CONTACT</label>
              <input
                type="text"
                value={dispatchForm.backupDriverPhone}
                onChange={(e) => setDispatchForm(prev => ({ ...prev, backupDriverPhone: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">COMMAND OPERATOR INSTRUCTION (SHOWN TO VOLUNTEER)</label>
            <textarea
              rows={3}
              value={dispatchForm.adminNotes}
              onChange={(e) => setDispatchForm(prev => ({ ...prev, adminNotes: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
              required
            />
            <p className="text-[11px] text-slate-400">
              This message and real-time confirmation badge will be immediately visible on the Volunteer's page and Participant view.
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDispatchModalOpen(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Check}
              className="text-xs font-mono bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400/40"
            >
              Confirm Dispatch & Alert Volunteer
            </Button>
          </div>
        </form>
      </Modal>

      {/* REJECT MODAL */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="DECLINE TRANSIT BACKUP REQUEST"
        subtitle={`Request ID: ${selectedRequest?.id}`}
        icon={X}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Provide operational reasoning for declining the field request. The volunteer will receive this feedback on their ground terminal.
          </p>
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">REJECTION RATIONALE</label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              variant="secondary"
              onClick={() => setRejectModalOpen(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmReject}
              className="text-xs font-mono"
            >
              Decline Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* ADD BUS MODAL */}
      <Modal
        isOpen={addBusModalOpen}
        onClose={() => setAddBusModalOpen(false)}
        title="REGISTER NEW FLEET BUS"
        subtitle="Add a vehicle to event transportation division"
        icon={Plus}
        size="md"
      >
        <form onSubmit={handleCreateBus} className="space-y-3 font-sans">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">BUS ID / NUMBER</label>
              <input
                type="text"
                value={newBusForm.busNumber}
                onChange={(e) => setNewBusForm(prev => ({ ...prev, busNumber: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">LICENSE PLATE</label>
              <input
                type="text"
                value={newBusForm.licensePlate}
                onChange={(e) => setNewBusForm(prev => ({ ...prev, licensePlate: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">ROUTE NAME</label>
            <input
              type="text"
              value={newBusForm.routeName}
              onChange={(e) => setNewBusForm(prev => ({ ...prev, routeName: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">PICKUP STOP</label>
              <input
                type="text"
                value={newBusForm.pickupLocation}
                onChange={(e) => setNewBusForm(prev => ({ ...prev, pickupLocation: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">CAPACITY (SEATS)</label>
              <input
                type="number"
                value={newBusForm.totalCapacity}
                onChange={(e) => setNewBusForm(prev => ({ ...prev, totalCapacity: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">DRIVER NAME</label>
              <input
                type="text"
                value={newBusForm.driverName}
                onChange={(e) => setNewBusForm(prev => ({ ...prev, driverName: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">DRIVER PHONE</label>
              <input
                type="text"
                value={newBusForm.driverPhone}
                onChange={(e) => setNewBusForm(prev => ({ ...prev, driverPhone: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setAddBusModalOpen(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="text-xs font-mono"
            >
              Save Bus
            </Button>
          </div>
        </form>
      {/* REQUEST EXTRA BUS MODAL */}
      <Modal
        isOpen={requestBackupModalOpen}
        onClose={() => setRequestBackupModalOpen(false)}
        title="REQUEST EXTRA STANDBY SHUTTLE"
        subtitle={`Alerting Command Centre for ${targetBusForRequest?.busNumber} • ${targetBusForRequest?.pickupLocation}`}
        icon={Send}
        size="md"
      >
        <form onSubmit={handleConfirmSendRequest} className="space-y-4 font-sans text-xs">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 font-mono space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Pickup Stop Overcrowding Alert
            </div>
            <p><strong>Pickup Stop:</strong> {targetBusForRequest?.pickupLocation}</p>
            <p><strong>Route:</strong> {targetBusForRequest?.routeName}</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              STRANDED PASSENGERS COUNT *
            </label>
            <input
              type="number"
              min="1"
              value={strandedCount}
              onChange={(e) => setStrandedCount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              URGENCY LEVEL
            </label>
            <select
              value={urgencyLevel}
              onChange={(e) => setUrgencyLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
            >
              <option value="Critical">Critical (Crowd spilling into road / immediate standby needed)</option>
              <option value="High">High (More than 15 people left behind)</option>
              <option value="Medium">Medium (Anticipating next batch surge)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              FIELD SITUATION NOTES
            </label>
            <textarea
              rows={3}
              value={requestNotes}
              onChange={(e) => setRequestNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRequestBackupModalOpen(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Send}
              className="text-xs font-mono font-bold bg-gradient-to-r from-amber-600 to-rose-600 border-amber-500/40"
            >
              Send Dispatch Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
