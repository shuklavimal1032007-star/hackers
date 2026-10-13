import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Send,
  UserCheck,
  ChevronRight,
  Shield,
  Tag,
  Sparkles,
  Inbox,
  AlertOctagon,
  RefreshCw,
  Phone,
  MapPin,
  Truck,
  Bus,
  HeartPulse,
  Coffee,
  Droplet,
  Wrench,
  Boxes,
  HelpCircle,
  FileQuestion,
  Check,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function AdminResourceRequestsPage() {
  const {
    resourceRequests,
    reviewResourceRequest,
    fulfillResourceRequest,
    settings,
    volunteers,
    currentRole
  } = useApp();

  const isVolunteer = currentRole === 'volunteer';

  const [searchQuery, setSearchQuery] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState('All');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');

  // Review Modal State (Admin Decision)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRequestForReview, setSelectedRequestForReview] = useState(null);
  const [reviewAction, setReviewAction] = useState('approve'); // 'approve' | 'partial' | 'reject' | 'request_info'
  const [approvedQuantity, setApprovedQuantity] = useState(1);
  const [reviewNotes, setReviewNotes] = useState('');
  const [assignedOpsStaff, setAssignedOpsStaff] = useState('Operations Quick-Dispatch Squad');

  // Fulfillment Modal State (Operations Staff Action)
  const [fulfillModalOpen, setFulfillModalOpen] = useState(false);
  const [selectedRequestForFulfill, setSelectedRequestForFulfill] = useState(null);
  const [fulfillStatus, setFulfillStatus] = useState('In Progress'); // 'In Progress' | 'Fulfilled'
  const [fulfillNotes, setFulfillNotes] = useState('');

  const operationsStaffList = [
    'Operations Quick-Dispatch Squad',
    'Fleet Logistics Unit (Transit Team)',
    'Rapid Medical Squad (Paramedic Ops)',
    'Venue Barricade & Security Escort Team',
    'Hospitality & Hydration Supply Crew',
    'Technical AV & Power Logistics Unit',
    `${settings.operatorName} (Operations Lead)`
  ];

  // Filtering
  const filteredRequests = resourceRequests.filter(req => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.volunteerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.reason && req.reason.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAdminStatus = adminStatusFilter === 'All' || req.status === adminStatusFilter;
    const matchesFulfillment = fulfillmentFilter === 'All' || req.fulfillmentStatus === fulfillmentFilter;
    const matchesCategory = categoryFilter === 'All' || req.resourceCategory === categoryFilter;
    const matchesUrgency = urgencyFilter === 'All' || req.urgency === urgencyFilter;

    return matchesSearch && matchesAdminStatus && matchesFulfillment && matchesCategory && matchesUrgency;
  });

  // Metrics
  const totalRequests = resourceRequests.length;
  const pendingAdminCount = resourceRequests.filter(r => r.status === 'Pending').length;
  const approvedCount = resourceRequests.filter(r => r.status === 'Approved' || r.status === 'Partially Approved').length;
  const inProgressOpsCount = resourceRequests.filter(r => r.fulfillmentStatus === 'In Progress').length;
  const fulfilledCount = resourceRequests.filter(r => r.fulfillmentStatus === 'Fulfilled').length;
  const criticalCount = resourceRequests.filter(r => r.urgency === 'Critical' && r.status !== 'Approved' && r.status !== 'Fulfilled').length;

  const openReviewModal = (req) => {
    setSelectedRequestForReview(req);
    setReviewAction('approve');
    setApprovedQuantity(req.requiredQty);
    setReviewNotes('');
    setAssignedOpsStaff(req.assignedOperationsStaff !== 'Unassigned' ? req.assignedOperationsStaff : 'Operations Quick-Dispatch Squad');
    setReviewModalOpen(true);
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!selectedRequestForReview) return;

    reviewResourceRequest(selectedRequestForReview.id, {
      action: reviewAction,
      approvedQty: Number(approvedQuantity) || 1,
      reason: reviewNotes,
      notes: reviewNotes,
      assignedStaff: assignedOpsStaff
    });

    setReviewModalOpen(false);
  };

  const openFulfillModal = (req) => {
    setSelectedRequestForFulfill(req);
    setFulfillStatus(req.fulfillmentStatus === 'In Progress' ? 'Fulfilled' : 'In Progress');
    setFulfillNotes('');
    setFulfillModalOpen(true);
  };

  const handleSaveFulfillment = (e) => {
    e.preventDefault();
    if (!selectedRequestForFulfill) return;

    fulfillResourceRequest(selectedRequestForFulfill.id, {
      status: fulfillStatus,
      notes: fulfillNotes.trim()
    });

    setFulfillModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Ground Logistics Operations & Requisition Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <Package className="w-7 h-7 text-emerald-400" />
            VOLUNTEER RESOURCE REQUESTS CONSOLE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Two-stage logistics workflow: Admin Review & Approval, followed by separate Operations Fulfillment & Dispatch.
          </p>
        </div>

        {/* Live Counters Badges */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {criticalCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1.5 animate-pulse font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              {criticalCount} Critical Deficit
            </span>
          )}
          {pendingAdminCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {pendingAdminCount} Pending Review
            </span>
          )}
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            {totalRequests} Total
          </span>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
        <div className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Total Requisitions</span>
          <span className="text-xl font-bold text-white mt-1 block">{totalRequests}</span>
          <span className="text-[10px] text-slate-400">All ground requests</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090e1c] border border-amber-500/30 bg-amber-950/10">
          <span className="text-[10px] text-amber-400 block uppercase">1. Awaiting Review</span>
          <span className="text-xl font-bold text-amber-300 mt-1 block">{pendingAdminCount}</span>
          <span className="text-[10px] text-slate-400">Needs admin decision</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090e1c] border border-emerald-500/30 bg-emerald-950/10">
          <span className="text-[10px] text-emerald-400 block uppercase">Approved / Authorized</span>
          <span className="text-xl font-bold text-emerald-300 mt-1 block">{approvedCount}</span>
          <span className="text-[10px] text-slate-400">Admin greenlight</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090e1c] border border-cyan-500/30 bg-cyan-950/10">
          <span className="text-[10px] text-cyan-400 block uppercase">2. Operations En Route</span>
          <span className="text-xl font-bold text-cyan-300 mt-1 block">{inProgressOpsCount}</span>
          <span className="text-[10px] text-slate-400">In transit to zone</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090e1c] border border-teal-500/30 bg-teal-950/10">
          <span className="text-[10px] text-teal-400 block uppercase">Fulfilled On Site</span>
          <span className="text-xl font-bold text-teal-300 mt-1 block">{fulfilledCount}</span>
          <span className="text-[10px] text-slate-400">Delivery confirmed</span>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <Card className="p-3.5 border-slate-800 bg-[#090e1c]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, item, volunteer, venue..."
              className="w-full bg-slate-900 border border-slate-700 text-white pl-9 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-sans"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Admin Decision Filter */}
            <select
              value={adminStatusFilter}
              onChange={(e) => setAdminStatusFilter(e.target.value)}
              className="bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="All">All Admin Decisions</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Partially Approved">Partially Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="More Info Needed">More Info Needed</option>
            </select>

            {/* Operations Fulfillment Filter */}
            <select
              value={fulfillmentFilter}
              onChange={(e) => setFulfillmentFilter(e.target.value)}
              className="bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="All">All Fulfillment</option>
              <option value="Unassigned">Unassigned</option>
              <option value="In Progress">In Progress (En Route)</option>
              <option value="Fulfilled">Fulfilled (Delivered)</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="All">All Categories</option>
              <option value="buses">buses</option>
              <option value="transportation">transportation</option>
              <option value="medical support">medical support</option>
              <option value="security">security</option>
              <option value="equipment">equipment</option>
              <option value="food">food</option>
              <option value="water">water</option>
              <option value="other resources">other resources</option>
            </select>

            {/* Urgency Filter */}
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="All">All Urgencies</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {(searchQuery || adminStatusFilter !== 'All' || fulfillmentFilter !== 'All' || categoryFilter !== 'All' || urgencyFilter !== 'All') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setAdminStatusFilter('All');
                  setFulfillmentFilter('All');
                  setCategoryFilter('All');
                  setUrgencyFilter('All');
                }}
                className="text-xs"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Requests Feed */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-slate-800 bg-[#090e1c] text-slate-400 text-xs font-mono">
            No volunteer resource requests match the specified filters.
          </Card>
        ) : (
          filteredRequests.map(req => {
            let CatIcon = Package;
            if (req.resourceCategory === 'buses' || req.resourceCategory === 'transportation') CatIcon = Bus;
            if (req.resourceCategory === 'medical support') CatIcon = HeartPulse;
            if (req.resourceCategory === 'security') CatIcon = Shield;
            if (req.resourceCategory === 'food') CatIcon = Coffee;
            if (req.resourceCategory === 'water') CatIcon = Droplet;
            if (req.resourceCategory === 'equipment') CatIcon = Wrench;

            const isUrgent = req.urgency === 'Critical' || req.urgency === 'High';
            const isApproved = req.status === 'Approved' || req.status === 'Partially Approved';

            return (
              <Card
                key={req.id}
                className={`p-5 space-y-4 border transition-all ${
                  req.status === 'Pending'
                    ? 'border-amber-500/50 bg-gradient-to-b from-amber-950/20 to-[#090e1c]'
                    : isUrgent && req.fulfillmentStatus !== 'Fulfilled'
                    ? 'border-slate-800 bg-[#090e1c]'
                    : 'border-slate-800 bg-[#090e1c]'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-300">{req.id}</span>
                        <span className="text-slate-500 text-xs">•</span>
                        <span className="text-xs font-mono uppercase font-semibold text-slate-300">
                          {req.resourceCategory}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          req.urgency === 'Critical' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' :
                          req.urgency === 'High' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                          req.urgency === 'Medium' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {req.urgency} Urgency
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white font-mono mt-0.5">
                        {req.resourceName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                    <span className="text-slate-400">Required by:</span>
                    <strong className="text-amber-300">{req.requiredByTime}</strong>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">Logged {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Middle: Details & Quantities Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  {/* Quantities Card */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Inventory Deficit Analysis
                    </span>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Requested:</span>
                      <strong className="text-white">{req.requiredQty} units</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Available:</span>
                      <span>{req.availableQty} units</span>
                    </div>
                    <div className="flex justify-between items-center pt-1.5 border-t border-slate-800">
                      <span className="text-slate-400">Shortage Deficit:</span>
                      <strong className={req.shortage > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                        {req.shortage} units {req.shortage > 0 ? '(Deficit)' : '(None)'}
                      </strong>
                    </div>
                  </div>

                  {/* Requester & Location */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Ground Checkpoint
                    </span>
                    <div className="flex items-center gap-1.5 text-white font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{req.location}</span>
                    </div>
                    <div className="text-slate-300 text-[11px] pt-1.5 border-t border-slate-800">
                      Submitted by: <strong className="text-white">{req.volunteerName}</strong> ({req.volunteerRole})
                    </div>
                  </div>

                  {/* Justification & Replies */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Volunteer Justification
                    </span>
                    <p className="text-slate-300 text-[11px] line-clamp-3 italic">
                      "{req.reason}"
                    </p>
                    {req.volunteerReplies && req.volunteerReplies.length > 0 && (
                      <div className="pt-1 border-t border-slate-800 text-[10px] text-amber-300">
                        {req.volunteerReplies.length} volunteer clarification(s) logged
                      </div>
                    )}
                  </div>
                </div>

                {/* TWO DISTINCT ACTION & STATUS TILES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* TILE 1: ADMIN REVIEW & AUTHORIZATION */}
                  <div className={`p-4 rounded-xl border font-mono text-xs space-y-3 ${
                    req.status === 'Approved' ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' :
                    req.status === 'Partially Approved' ? 'bg-teal-950/20 border-teal-500/40 text-teal-200' :
                    req.status === 'Rejected' ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' :
                    req.status === 'More Info Needed' ? 'bg-amber-950/30 border-amber-500/50 text-amber-200' :
                    'bg-slate-900/90 border-slate-800 text-slate-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                          STAGE 1: Admin Command Review
                        </span>
                      </div>
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

                    <div className="space-y-1.5 text-[11px]">
                      {req.status === 'Pending' && (
                        <p className="text-slate-400">
                          Awaiting administrative command decision. Review requisition to approve, partially approve, or decline.
                        </p>
                      )}

                      {(req.status === 'Approved' || req.status === 'Partially Approved') && (
                        <>
                          <div className="flex justify-between text-slate-300">
                            <span>Authorized Allocation:</span>
                            <strong className="text-white font-mono">{req.approvedQty} units approved</strong>
                          </div>
                          <p className="text-slate-300">
                            <strong>Directives:</strong> "{req.decisionNotes}"
                          </p>
                          <span className="text-[10px] text-slate-400 block">
                            Evaluated by: {req.decidedBy} • {new Date(req.decidedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </>
                      )}

                      {req.status === 'Rejected' && (
                        <>
                          <p className="text-rose-300">
                            <strong>Decline Reason:</strong> "{req.decisionNotes}"
                          </p>
                          <span className="text-[10px] text-slate-400 block">
                            Decided by: {req.decidedBy}
                          </span>
                        </>
                      )}

                      {req.status === 'More Info Needed' && (
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
                          <strong>Admin Inquiry:</strong> "{req.decisionNotes}"
                          {req.volunteerReplies && req.volunteerReplies.length > 0 && (
                            <div className="mt-1.5 pt-1.5 border-t border-amber-500/20 text-slate-200">
                              <strong>Volunteer Replied:</strong> "{req.volunteerReplies[req.volunteerReplies.length - 1].message}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Button for Admin */}
                    {!isVolunteer && (
                      <div className="pt-2 border-t border-slate-800 flex justify-end">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Shield}
                          onClick={() => openReviewModal(req)}
                          className="text-xs font-mono bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500/40"
                        >
                          {req.status === 'Pending' ? 'Review & Authorize' : 'Re-Evaluate Decision'}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* TILE 2: OPERATIONS STAFF FULFILLMENT (SEPARATE ACTION) */}
                  <div className={`p-4 rounded-xl border font-mono text-xs space-y-3 ${
                    req.fulfillmentStatus === 'Fulfilled' ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' :
                    req.fulfillmentStatus === 'In Progress' ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-200' :
                    'bg-slate-900/90 border-slate-800 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                          STAGE 2: Operations Fulfillment
                        </span>
                      </div>
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

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">Assigned Logistics Squad:</span>
                        <strong className="text-slate-200">{req.assignedOperationsStaff || 'Unassigned'}</strong>
                      </div>

                      {req.fulfillmentStatus === 'In Progress' && (
                        <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 space-y-0.5">
                          <strong>Delivery Status:</strong> {req.operationsNotes || 'Supplies en route.'}
                        </div>
                      )}

                      {req.fulfillmentStatus === 'Fulfilled' && (
                        <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 space-y-0.5">
                          <strong>Delivery Confirmed:</strong> {req.operationsNotes || 'Resources arrived and verified.'}
                        </div>
                      )}

                      {req.fulfillmentStatus === 'Unassigned' && (
                        <p className="text-slate-400">
                          Operations dispatch is pending admin approval and assignment.
                        </p>
                      )}
                    </div>

                    {/* Action Button for Operations (Separate from Approval!) */}
                    {!isVolunteer && (
                      <div className="pt-2 border-t border-slate-800 flex justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Truck}
                          disabled={!isApproved}
                          onClick={() => openFulfillModal(req)}
                          className="text-xs font-mono"
                        >
                          Update Operations Status
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* 1. ADMIN DECISION MODAL */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="COMMAND REVIEW & RESOURCE AUTHORIZATION"
        subtitle={`Requisition #${selectedRequestForReview?.id} • ${selectedRequestForReview?.resourceName} (${selectedRequestForReview?.location})`}
        icon={Shield}
        size="md"
      >
        <form onSubmit={handleSaveReview} className="space-y-4 font-sans text-xs">
          {/* Summary Box */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span>Required: <strong>{selectedRequestForReview?.requiredQty} units</strong></span>
              <span>Available: <strong>{selectedRequestForReview?.availableQty} units</strong></span>
              <span>Shortage: <strong className="text-rose-400">{selectedRequestForReview?.shortage} units</strong></span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              Urgency: <strong>{selectedRequestForReview?.urgency}</strong> • Checkpoint: {selectedRequestForReview?.location}
            </div>
          </div>

          {/* Action Selector */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              COMMAND DECISION ACTION *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
              <button
                type="button"
                onClick={() => {
                  setReviewAction('approve');
                  setApprovedQuantity(selectedRequestForReview?.requiredQty || 1);
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  reviewAction === 'approve'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Approve Full
              </button>

              <button
                type="button"
                onClick={() => {
                  setReviewAction('partial');
                  setApprovedQuantity(Math.floor((selectedRequestForReview?.requiredQty || 2) / 2) || 1);
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  reviewAction === 'partial'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Partial Approve
              </button>

              <button
                type="button"
                onClick={() => setReviewAction('request_info')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  reviewAction === 'request_info'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Request Info
              </button>

              <button
                type="button"
                onClick={() => setReviewAction('reject')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  reviewAction === 'reject'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Reject Request
              </button>
            </div>
          </div>

          {/* Conditional Approved Quantity */}
          {(reviewAction === 'approve' || reviewAction === 'partial') && (
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                APPROVED QUANTITY TO DISPATCH (UNITS) *
              </label>
              <input
                type="number"
                min="1"
                max={selectedRequestForReview?.requiredQty || 1000}
                value={approvedQuantity}
                onChange={(e) => setApprovedQuantity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
              <p className="text-[11px] text-slate-400 font-mono">
                {reviewAction === 'partial'
                  ? `Specifying partial allocation out of ${selectedRequestForReview?.requiredQty} requested.`
                  : `Full allocation of ${selectedRequestForReview?.requiredQty} units.`}
              </p>
            </div>
          )}

          {/* Assign Operations Logistics Squad */}
          {reviewAction !== 'reject' && (
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                ASSIGN OPERATIONS LOGISTICS SQUAD *
              </label>
              <select
                value={assignedOpsStaff}
                onChange={(e) => setAssignedOpsStaff(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
              >
                {operationsStaffList.map((op, idx) => (
                  <option key={idx} value={op}>{op}</option>
                ))}
              </select>
            </div>
          )}

          {/* Decision Notes / Inquiry / Reason */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              {reviewAction === 'reject'
                ? 'REJECTION JUSTIFICATION *'
                : reviewAction === 'request_info'
                ? 'INQUIRY / INFORMATION REQUIRED FROM VOLUNTEER *'
                : 'ADMIN DECISION DIRECTIVES & LOGISTICS NOTES'}
            </label>
            <textarea
              rows={3}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder={
                reviewAction === 'reject'
                  ? 'State reason for decline (e.g. inventory depleted, alternate checkpoint available)...'
                  : reviewAction === 'request_info'
                  ? 'Ask volunteer for exact attendee count, bench numbers, or priority details...'
                  : 'Enter routing directives or delivery instructions...'
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-emerald-500"
              required={reviewAction === 'reject' || reviewAction === 'request_info'}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setReviewModalOpen(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Check}
              className="text-xs font-mono font-bold bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500/40"
            >
              Save Decision
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. OPERATIONS FULFILLMENT MODAL (SEPARATE ACTION) */}
      <Modal
        isOpen={fulfillModalOpen}
        onClose={() => setFulfillModalOpen(false)}
        title="OPERATIONS FULFILLMENT & DISPATCH STATUS"
        subtitle={`Requisition #${selectedRequestForFulfill?.id} • Assigned to ${selectedRequestForFulfill?.assignedOperationsStaff}`}
        icon={Truck}
        size="md"
      >
        <form onSubmit={handleSaveFulfillment} className="space-y-4 font-sans text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs space-y-1">
            <div>Resource: <strong className="text-white">{selectedRequestForFulfill?.resourceName}</strong></div>
            <div>Approved Allocation: <strong className="text-emerald-400">{selectedRequestForFulfill?.approvedQty} units</strong></div>
            <div>Destination: <strong>{selectedRequestForFulfill?.location}</strong></div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              OPERATIONS FULFILLMENT STAGE *
            </label>
            <div className="grid grid-cols-2 gap-3 font-mono">
              <button
                type="button"
                onClick={() => setFulfillStatus('In Progress')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  fulfillStatus === 'In Progress'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                In Progress (En Route)
              </button>

              <button
                type="button"
                onClick={() => setFulfillStatus('Fulfilled')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  fulfillStatus === 'Fulfilled'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Fulfilled (On Site)
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              OPERATIONS LOGISTICS NOTES *
            </label>
            <textarea
              rows={3}
              value={fulfillNotes}
              onChange={(e) => setFulfillNotes(e.target.value)}
              placeholder="e.g. Standby bus en route via Ring Road ETA 8 mins, 200 bottles water delivered to Gate 1..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setFulfillModalOpen(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Check}
              className="text-xs font-mono font-bold bg-gradient-to-r from-cyan-600 to-teal-600 border-cyan-500/40"
            >
              Update Fulfillment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
