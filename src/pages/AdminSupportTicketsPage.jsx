import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
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
  Mail,
  Zap,
  Check,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import RaiseTicketModal from '../components/support/RaiseTicketModal';

export default function AdminSupportTicketsPage() {
  const {
    supportTickets,
    addTicketMessage,
    updateTicketStatus,
    assignTicketStaff,
    settings,
    participants,
    volunteers,
    currentRole,
    activeParticipantId
  } = useApp();

  // Participant should only see/manage their own tickets, not admin controls
  const isParticipant = currentRole === 'participant';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const baseTickets = isParticipant
    ? supportTickets.filter(t => t.participantId === activeParticipantId)
    : supportTickets;

  const [selectedTicketId, setSelectedTicketId] = useState(
    baseTickets.length > 0 ? baseTickets[0].id : null
  );
  const [adminReplyText, setAdminReplyText] = useState('');
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolutionText, setResolutionText] = useState('');
  const [raiseModalOpen, setRaiseModalOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Available staff for assignment
  const staffOptions = [
    `${settings.operatorName} (Support Lead)`,
    'Cmdr. Alex Vance (Command Ops)',
    'Sarah Jenkins (Logistics Coordinator)',
    'Marcus Chen (Security Lead)',
    'Amina Al-Mansoor (Field Floor Guide)',
    'Tech Desk Squad A',
    'Unassigned'
  ];

  // Quick reply snippets
  const cannedResponses = [
    'Our technical team has whitelisted your MAC address and reset the bench switch. Please retry connecting.',
    'A volunteer escort has been dispatched to your gate to assist with your equipment cases.',
    'Backup shuttle bus has been authorized by command ops and is currently en route.',
    'Issue has been investigated and marked resolved. Please let us know if you need anything else!'
  ];

  // Filtering
  const filteredTickets = baseTickets.filter(t => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const activeTicket = baseTickets.find(t => t.id === selectedTicketId) || filteredTickets[0] || null;

  // Counts
  const totalCount = baseTickets.length;
  const openCount = baseTickets.filter(t => t.status === 'Open').length;
  const inProgressCount = baseTickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = baseTickets.filter(t => t.status === 'Resolved').length;
  const urgentCount = baseTickets.filter(t => t.priority === 'Urgent' && t.status !== 'Resolved').length;

  const handleSendAdminReply = (e) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !activeTicket) return;
    addTicketMessage(activeTicket.id, adminReplyText.trim());
    setAdminReplyText('');
    setTimeout(scrollToBottom, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeTicket?.id, activeTicket?.messages?.length]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              {isParticipant ? 'My Helpdesk & Live Chat Support' : 'Attendee Helpdesk & Support Dispatch Console'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-cyan-400" />
            {isParticipant ? 'MY SUPPORT TICKETS' : 'SUPPORT TICKETS & CHAT RESOLUTION'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {isParticipant
              ? 'View and manage your support requests, track status, and chat in real-time with event support specialists.'
              : 'Real-time participant communication stream, technician assignment, priority escalation, and live replies.'}
          </p>
        </div>

        {/* Live Status Summary Badges & Action */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {!isParticipant && urgentCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1.5 animate-pulse font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              {urgentCount} Urgent
            </span>
          )}
          <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            {openCount} Open
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            {totalCount} Total
          </span>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setRaiseModalOpen(true)}
            className="text-xs font-mono font-bold bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-500/40 shadow-md shadow-cyan-950/40"
          >
            + Raise New Ticket
          </Button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">
            {isParticipant ? 'My Total Tickets' : 'Total Active Tickets'}
          </span>
          <span className="text-xl font-bold text-white mt-1 block">{totalCount}</span>
          <span className="text-[10px] text-slate-400">
            {isParticipant ? 'Submitted queries' : 'All participant submissions'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090e1c] border border-amber-500/30 bg-amber-950/10">
          <span className="text-[10px] text-amber-400 block uppercase">Awaiting Response (Open)</span>
          <span className="text-xl font-bold text-amber-300 mt-1 block">{openCount}</span>
          <span className="text-[10px] text-slate-400">
            {isParticipant ? 'In support queue' : 'Needs staff intake'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090e1c] border border-cyan-500/30 bg-cyan-950/10">
          <span className="text-[10px] text-cyan-400 block uppercase">In Investigation</span>
          <span className="text-xl font-bold text-cyan-300 mt-1 block">{inProgressCount}</span>
          <span className="text-[10px] text-slate-400">Live chat ongoing</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#090e1c] border border-emerald-500/30 bg-emerald-950/10">
          <span className="text-[10px] text-emerald-400 block uppercase">Resolved / Closed</span>
          <span className="text-xl font-bold text-emerald-300 mt-1 block">{resolvedCount}</span>
          <span className="text-[10px] text-slate-400">Successfully closed</span>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <Card className="p-3.5 border-slate-800 bg-[#090e1c]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID, attendee, subject..."
              className="w-full bg-slate-900 border border-slate-700 text-white pl-9 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-cyan-500 text-xs font-sans"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-cyan-500 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-cyan-500 text-xs"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-cyan-500 text-xs"
            >
              <option value="All">All Categories</option>
              <option value="Technical / Wi-Fi">Technical / Wi-Fi</option>
              <option value="Transportation / Bus">Transportation / Bus</option>
              <option value="Venue Access & Seating">Venue Access & Seating</option>
              <option value="Badge & Credentials">Badge & Credentials</option>
              <option value="Medical / Safety">Medical / Safety</option>
            </select>

            {(searchQuery || statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setPriorityFilter('All');
                  setCategoryFilter('All');
                }}
                className="text-xs"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Main 2-Column Split: Ticket List (Left) + Interactive Console & Chat Thread (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (5 / 12): Tickets Feed */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1 font-mono text-xs">
            <span className="text-slate-400 uppercase font-semibold">
              {isParticipant ? 'My Tickets' : 'Ticket Queue'} ({filteredTickets.length})
            </span>
            <span className="text-cyan-400">
              {filteredTickets.filter(t => t.status === 'Open').length} Awaiting Intake
            </span>
          </div>

          {filteredTickets.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-slate-800 bg-[#090e1c] text-slate-400 text-xs font-mono space-y-3">
              <p>No support tickets match the current filters.</p>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setRaiseModalOpen(true)}
                className="text-xs font-mono mx-auto"
              >
                + Raise New Support Ticket
              </Button>
            </Card>
          ) : (
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredTickets.map(ticket => {
                const isSelected = activeTicket?.id === ticket.id;
                const isUrgent = ticket.priority === 'Urgent';

                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900/90 border-cyan-500 shadow-lg shadow-cyan-950/30'
                        : isUrgent && ticket.status !== 'Resolved'
                        ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                        : 'bg-[#090e1c] border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          {ticket.id}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded border text-[10px] font-mono font-bold ${
                          ticket.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' :
                          ticket.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>

                      <Badge
                        variant={
                          ticket.status === 'Open' ? 'warning' :
                          ticket.status === 'In Progress' ? 'blue' :
                          ticket.status === 'Resolved' ? 'normal' : 'secondary'
                        }
                        size="sm"
                      >
                        {ticket.status}
                      </Badge>
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-1 mb-1">
                      {ticket.subject}
                    </h4>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mb-2">
                      <User className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="text-slate-200 font-medium truncate">{ticket.participantName}</span>
                      <span>•</span>
                      <span className="font-mono text-cyan-400 truncate">{ticket.category}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                      <span>Staff: {ticket.assignedStaff || 'Unassigned'}</span>
                      <span>{new Date(ticket.updatedAt || ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col (7 / 12): Active Ticket Command Desk & Live Conversation */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <Card className="border-slate-800 bg-[#090e1c] flex flex-col h-[700px] max-h-[82vh] p-0 overflow-hidden shadow-2xl">
              {/* Header: Ticket Controls Bar */}
              <div className="p-4 bg-slate-900/90 border-b border-slate-800 space-y-3 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono font-bold text-cyan-400">{activeTicket.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs font-mono text-slate-300">{activeTicket.category}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        activeTicket.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                        activeTicket.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {activeTicket.priority} Priority
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-white font-mono">
                      {activeTicket.subject}
                    </h2>
                  </div>

                  {/* Status & Resolve Controls - Admin/Organiser Only! */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isParticipant ? (
                      /* Participant view: Read-only status pill */
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">Current Status:</span>
                        <Badge
                          variant={
                            activeTicket.status === 'Open' ? 'warning' :
                            activeTicket.status === 'In Progress' ? 'blue' :
                            activeTicket.status === 'Resolved' ? 'normal' : 'secondary'
                          }
                          size="md"
                        >
                          {activeTicket.status}
                        </Badge>
                      </div>
                    ) : (
                      /* Admin/Organiser view: Can change status and resolve */
                      <>
                        <span className="text-[11px] font-mono text-slate-400">Status:</span>
                        <select
                          value={activeTicket.status}
                          onChange={(e) => updateTicketStatus(activeTicket.id, e.target.value)}
                          className="bg-slate-950 text-xs font-mono text-white border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>

                        <Button
                          variant={activeTicket.status === 'Resolved' ? 'secondary' : 'primary'}
                          size="sm"
                          icon={CheckCircle2}
                          onClick={() => {
                            setResolutionText(activeTicket.resolutionNotes || '');
                            setResolveModalOpen(true);
                          }}
                          className={`text-xs font-mono font-bold ${
                            activeTicket.status === 'Resolved'
                              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                              : 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500/40 shadow-md shadow-emerald-950/40'
                          }`}
                        >
                          {activeTicket.status === 'Resolved' ? 'Solved ✓' : 'Solve Issue'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Sub-bar: Participant Info & Staff Assignment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 font-mono text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Attendee: <strong>{activeTicket.participantName}</strong></span>
                    <span className="text-slate-500">({activeTicket.participantEmail})</span>
                  </div>

                  <div className="flex items-center gap-2 justify-start sm:justify-end">
                    <span className="text-slate-400 text-[11px]">Assigned Staff:</span>
                    {isParticipant ? (
                      <span className="text-slate-200 font-semibold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {activeTicket.assignedStaff || 'Event Support Team'}
                      </span>
                    ) : (
                      <select
                        value={activeTicket.assignedStaff || 'Unassigned'}
                        onChange={(e) => assignTicketStaff(activeTicket.id, e.target.value)}
                        className="bg-slate-950 text-xs text-white border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500 max-w-[210px] truncate"
                      >
                        {staffOptions.map(staff => (
                          <option key={staff} value={staff}>{staff}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat Thread Messages Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 font-sans bg-slate-950/40">
                {/* Official Admin Resolution Banner (if solved) */}
                {activeTicket.status === 'Resolved' && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/20 border-2 border-emerald-500/60 shadow-lg text-xs font-mono text-emerald-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>OFFICIAL RESOLUTION &amp; SOLUTION:</span>
                      <span className="text-[10px] text-slate-400 font-normal ml-auto">
                        Resolved by: {activeTicket.assignedStaff || settings.operatorName}
                      </span>
                    </div>
                    <p className="text-white text-xs font-sans pl-6">
                      {activeTicket.resolutionNotes || 'This issue was successfully resolved and closed by Command Administration.'}
                    </p>
                  </div>
                )}

                {/* Initial Participant Description Box */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <span>Initial Ticket Description</span>
                    <span>{new Date(activeTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-200 mt-1">{activeTicket.description}</p>
                </div>

                {/* Chat bubbles */}
                {(activeTicket.messages || []).map((msg) => {
                  const isMe = isParticipant
                    ? (msg.senderRole === 'participant' || msg.senderId === activeParticipantId)
                    : (msg.senderRole === 'admin' || msg.senderRole === 'support');

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[11px] font-mono font-semibold text-slate-300">
                          {isMe ? `${msg.senderName} (You)` : msg.senderName}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${
                          msg.senderRole === 'admin' || msg.senderRole === 'support'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        }`}>
                          {msg.senderRole === 'admin' || msg.senderRole === 'support' ? 'Command Support' : 'Participant'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-tr-none shadow-md shadow-cyan-950/30'
                            : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Canned Responses Bar (Admin/Organiser Only) */}
              {!isParticipant && (
                <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 text-[11px] font-mono flex items-center gap-2 overflow-x-auto">
                  <span className="text-slate-400 shrink-0 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    Quick Reply:
                  </span>
                  {cannedResponses.map((snip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAdminReplyText(snip)}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-500 transition-colors truncate max-w-[220px]"
                      title={snip}
                    >
                      {snip}
                    </button>
                  ))}
                </div>
              )}

              {/* Message Reply Input Form */}
              <form onSubmit={handleSendAdminReply} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  placeholder={isParticipant ? "Type your message to support..." : `Reply directly to ${activeTicket.participantName}...`}
                  className="flex-1 bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 font-sans"
                />
                <Button
                  type="submit"
                  variant="primary"
                  icon={Send}
                  disabled={!adminReplyText.trim()}
                  className="text-xs font-mono shrink-0 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400/40"
                >
                  Send
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="p-12 text-center border-slate-800 bg-[#090e1c] text-slate-400 text-xs font-mono">
              Select a support ticket from the queue to view conversation and dispatch replies.
            </Card>
          )}
        </div>
      </div>

      {/* SOLVE ISSUE MODAL (Admin/Organiser Only) */}
      {!isParticipant && (
        <Modal
          isOpen={resolveModalOpen}
          onClose={() => setResolveModalOpen(false)}
          title="SOLVE STUDENT ISSUE & DISPATCH RESOLUTION"
          subtitle={`Ticket #${activeTicket?.id} • Submitted by ${activeTicket?.participantName}`}
          icon={CheckCircle2}
          size="md"
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!activeTicket) return;
            updateTicketStatus(activeTicket.id, 'Resolved', resolutionText.trim());
            setResolveModalOpen(false);
          }} className="space-y-4 font-sans text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono space-y-1">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Topic: <strong className="text-white">{activeTicket?.category}</strong></span>
                <span>Priority: <strong className="text-cyan-400">{activeTicket?.priority}</strong></span>
              </div>
              <div className="font-semibold text-white mt-1 text-xs">
                "{activeTicket?.subject}"
              </div>
              <p className="text-slate-300 text-[11px] pt-1 border-t border-slate-800 line-clamp-2">
                {activeTicket?.description}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-slate-300">
                OFFICIAL RESOLUTION / SOLUTION INSTRUCTIONS *
              </label>
              <textarea
                rows={4}
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="Explain how this issue was fixed (e.g. Wi-Fi MAC added to whitelist, backup bus dispatched with 10 min ETA, badge re-issued at desk 1)..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Quick preset solution pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 block">Quick Solutions:</span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                {[
                  'Backup shuttle bus dispatched to your location.',
                  'Device MAC whitelisted and port restarted.',
                  'Duplicate event credentials ready at Gate 1 Helpdesk.',
                  'Ground marshal assigned to escort attendee.'
                ].map((pill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setResolutionText(pill)}
                    className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-200/90 font-mono">
              <strong>Instant Student Notification:</strong> Submitting will mark the ticket as Resolved and deliver the solution directly into the student's Contact Us portal.
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setResolveModalOpen(false)}
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
                Mark Solved & Send Solution
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* RAISE NEW TICKET MODAL */}
      <RaiseTicketModal
        isOpen={raiseModalOpen}
        onClose={() => setRaiseModalOpen(false)}
        onTicketCreated={(created) => {
          if (created?.id) setSelectedTicketId(created.id);
        }}
      />
    </div>
  );
}
