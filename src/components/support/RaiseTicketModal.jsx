import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  MapPin,
  Tag,
  AlertCircle,
  FileText,
  User,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function RaiseTicketModal({
  isOpen,
  onClose,
  initialParticipantId = null,
  onTicketCreated = null
}) {
  const {
    participants,
    activeParticipantId,
    createSupportTicket
  } = useApp();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical / Wi-Fi');
  const [priority, setPriority] = useState('Medium');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [participantId, setParticipantId] = useState(
    initialParticipantId || activeParticipantId || (participants[0]?.id || '')
  );
  const [submitting, setSubmitting] = useState(false);

  // Synchronize when initialParticipantId changes
  useEffect(() => {
    if (initialParticipantId) {
      setParticipantId(initialParticipantId);
    } else if (activeParticipantId) {
      setParticipantId(activeParticipantId);
    }
  }, [initialParticipantId, activeParticipantId]);

  const activeParticipant = participants.find(p => p.id === participantId) || participants[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const created = createSupportTicket({
        subject: subject.trim(),
        category,
        priority,
        location: location.trim() || activeParticipant?.pickupStop || 'Main Event Arena',
        description: description.trim(),
        participantId: activeParticipant?.id,
        participantName: activeParticipant?.name,
        participantEmail: activeParticipant?.email
      });

      // Reset form fields
      setSubject('');
      setCategory('Technical / Wi-Fi');
      setPriority('Medium');
      setLocation('');
      setDescription('');

      if (onTicketCreated && created) {
        onTicketCreated(created);
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Raise New Support Ticket"
      subtitle={`Submit an operational issue or assistance request for ${activeParticipant?.name || 'Attendee'}`}
      icon={MessageSquare}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        {/* Responsive 2-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Ticket Subject - Spans 2 columns */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Ticket Subject *
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Summary of the issue</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Wi-Fi disconnected in Lab 3, Baggage lost at North Gate"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-sans focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              required
            />
          </div>

          {/* Category Dropdown - Column 1 */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            >
              <option value="Technical / Wi-Fi">Technical / Wi-Fi</option>
              <option value="Transportation / Bus">Transportation / Bus</option>
              <option value="Venue Access & Seating">Venue Access & Seating</option>
              <option value="Badge & Credentials">Badge & Credentials</option>
              <option value="Medical / Safety">Medical / Safety</option>
              <option value="Food & Facilities">Food & Facilities</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>

          {/* Priority Dropdown - Column 2 */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
              Priority *
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            >
              <option value="Low">Low — General inquiry</option>
              <option value="Medium">Medium — Standard assistance needed</option>
              <option value="High">High — Blocking participation</option>
              <option value="Urgent">Urgent — Immediate intervention</option>
            </select>
          </div>

          {/* Event Location Input - Spans 2 columns */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Event Location *
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Gate, hall, room, or bus stop</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Main Auditorium - Row 4, Hackathon Arena Desk 12, West Shuttle Gate"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-sans focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>

          {/* Attendee Info / Selector (if multiple attendees available) */}
          {participants.length > 1 && (
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  Attendee / Participant
                </span>
                <span className="text-[10px] text-slate-400 font-mono">ID: {activeParticipant?.ticketNumber}</span>
              </label>
              <select
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              >
                {participants.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.ticketNumber}) — {p.pickupStop}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Description Textarea - Spans 2 columns */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-300 flex items-center justify-between">
              <span>Detailed Description *</span>
              <span className="text-[10px] text-slate-400 font-normal">Provide clear context</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue with specific location, workbench number, device details, or bus stop conditions..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-sans focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
              required
            />
          </div>
        </div>

        {/* Ticket ID Notice Banner */}
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200/90 font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Automatic Ticket Tracking:</strong> A unique tracking ID (e.g. TCK-XXXX) will be generated automatically and routed to the Command Support Desk.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="text-xs font-mono px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Send}
            disabled={submitting || !subject.trim() || !description.trim()}
            className="text-xs font-mono font-bold px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-500/40 shadow-lg shadow-cyan-950/40 hover:from-cyan-500 hover:to-blue-500"
          >
            {submitting ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
