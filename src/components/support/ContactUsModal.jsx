import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Send,
  User,
  Mail,
  Phone,
  Ticket,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Headphones,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function ContactUsModal({ isOpen, onClose }) {
  const {
    participants,
    activeParticipantId,
    supportTickets,
    createSupportTicket
  } = useApp();

  const activeParticipant = participants.find(p => p.id === activeParticipantId) || participants[0];

  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'my_queries'
  const [studentName, setStudentName] = useState(activeParticipant?.name || '');
  const [studentEmail, setStudentEmail] = useState(activeParticipant?.email || '');
  const [studentPhone, setStudentPhone] = useState(activeParticipant?.phone || '');
  const [ticketNumber, setTicketNumber] = useState(activeParticipant?.ticketNumber || '');
  const [category, setCategory] = useState('General Query');
  const [urgency, setUrgency] = useState('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [lastSubmittedId, setLastSubmittedId] = useState(null);

  // Filter student queries
  const myQueries = supportTickets.filter(
    t => t.participantId === activeParticipant?.id || t.participantEmail === activeParticipant?.email
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newTicket = createSupportTicket({
      subject: subject.trim(),
      category,
      priority: urgency === 'Urgent' ? 'Urgent' : 'Medium',
      description: description.trim(),
      participantId: activeParticipant?.id,
      participantName: studentName.trim() || activeParticipant?.name,
      participantEmail: studentEmail.trim() || activeParticipant?.email
    });

    setSubject('');
    setDescription('');
    setCategory('General Query');
    setUrgency('Medium');
    if (newTicket?.id) {
      setLastSubmittedId(newTicket.id);
    }
    setActiveTab('my_queries');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="STUDENT HELPDESK & CONTACT US"
      subtitle="Direct line to Event Command Ops: Ask queries, report issues, and view Admin solutions"
      icon={Headphones}
      size="lg"
    >
      <div className="space-y-4 font-sans text-xs">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-2">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-semibold border-b-2 transition-all ${
              activeTab === 'new'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ask a Query / Contact Admin</span>
          </button>

          <button
            onClick={() => setActiveTab('my_queries')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-semibold border-b-2 transition-all ${
              activeTab === 'my_queries'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>My Queries & Admin Solutions</span>
            {myQueries.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {myQueries.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: SUBMIT NEW QUERY */}
        {activeTab === 'new' && (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Student Info Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1">
                  <User className="w-3 h-3 text-cyan-400" />
                  Student Name *
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1">
                  <Mail className="w-3 h-3 text-cyan-400" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@university.dev"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1">
                  <Ticket className="w-3 h-3 text-cyan-400" />
                  Ticket / Student ID
                </label>
                <input
                  type="text"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  placeholder="e.g. TKT-AEGIS-1049"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Category & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-semibold">
                  Query Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500 text-xs"
                >
                  <option value="Registration & Pass Issue">Registration & Pass Issue</option>
                  <option value="Bus Pickup & Transportation">Bus Pickup & Transportation</option>
                  <option value="Venue Wayfinding & Seating">Venue Wayfinding & Seating</option>
                  <option value="Wi-Fi & Technical Glitch">Wi-Fi & Technical Glitch</option>
                  <option value="Food, Water & Facilities">Food, Water & Facilities</option>
                  <option value="Certificates & Attendance">Certificates & Attendance</option>
                  <option value="Urgent Safety / Medical">Urgent Safety / Medical</option>
                  <option value="General Query">General Query</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-semibold">
                  Priority / Urgency *
                </label>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <button
                    type="button"
                    onClick={() => setUrgency('Medium')}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      urgency === 'Medium'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Normal Query
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('Urgent')}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      urgency === 'Urgent'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold animate-pulse'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Urgent Issue
                  </button>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 font-semibold">
                Query Subject / Summary *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Bus 02 pickup timing from North Hostel, Wi-Fi password not working"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            {/* Detailed Description */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 font-semibold">
                Detailed Issue Description *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue with specific gate, table number, or bus stop details so Admin can resolve it quickly..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            {/* Info Notice */}
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200/90 font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Your query will be routed immediately to Event Command Ops. Admins can review, assign staff, and dispatch solutions.
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="text-xs font-mono"
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={Send}
                className="text-xs font-mono font-bold bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-500/40"
              >
                Send Query to Admin
              </Button>
            </div>
          </form>
        )}

        {/* TAB 2: MY QUERIES & ADMIN SOLUTIONS */}
        {activeTab === 'my_queries' && (
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {lastSubmittedId && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center justify-between">
                <span>Query #{lastSubmittedId} was successfully dispatched to Admin!</span>
                <span className="text-[10px] text-emerald-400">Tracking Active</span>
              </div>
            )}

            {myQueries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-mono text-xs space-y-2">
                <p>No queries submitted yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('new')}
                  className="text-xs font-mono"
                >
                  Submit a Query Now
                </Button>
              </div>
            ) : (
              myQueries.map((ticket) => {
                const isResolved = ticket.status === 'Resolved';
                const hasResolution = isResolved && ticket.resolutionNotes;

                return (
                  <div
                    key={ticket.id}
                    className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                      isResolved
                        ? 'bg-gradient-to-r from-emerald-950/20 via-slate-900 to-[#090e1c] border-emerald-500/40'
                        : ticket.status === 'In Progress'
                        ? 'bg-cyan-950/15 border-cyan-500/40'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-cyan-300 text-xs">{ticket.id}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 text-[11px]">{ticket.category}</span>
                      </div>
                      <Badge
                        variant={
                          ticket.status === 'Resolved' ? 'normal' :
                          ticket.status === 'In Progress' ? 'blue' : 'warning'
                        }
                        size="sm"
                      >
                        {ticket.status === 'Resolved' ? 'SOLVED' : ticket.status}
                      </Badge>
                    </div>

                    {/* Subject & Description */}
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">{ticket.subject}</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                        "{ticket.description}"
                      </p>
                    </div>

                    {/* ADMIN SOLUTION BANNER (KEY REQUIREMENT!) */}
                    {isResolved && (
                      <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 font-mono text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>ADMIN SOLUTION & RESOLUTION:</span>
                        </div>
                        <p className="text-slate-100 text-xs font-sans pl-5">
                          {ticket.resolutionNotes || 'Admin has investigated and resolved this query.'}
                        </p>
                        <span className="text-[10px] text-emerald-400/80 block pl-5">
                          Resolved by: {ticket.assignedStaff || 'Command Support Lead'}
                        </span>
                      </div>
                    )}

                    {/* Footer Details */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                      <span>Submitted: {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>Assigned Staff: {ticket.assignedStaff || 'Command Pool'}</span>
                    </div>
                  </div>
                );
              })
            )}

            <div className="pt-2 text-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveTab('new')}
                className="text-xs font-mono"
              >
                + Ask Another Query
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
