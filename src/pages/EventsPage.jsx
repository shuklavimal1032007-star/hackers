import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Eye,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Sparkles,
  Ticket
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmationModal from '../components/ui/ConfirmationModal';

export default function EventsPage() {
  const { events, venues, addEvent, updateEvent, deleteEvent, currentRole } = useApp();

  // Strictly only Admin and Organiser can create, edit, or delete events
  const canManageEvents = currentRole === 'admin' || currentRole === 'organiser';
  const isParticipant = currentRole === 'participant';

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);

  // Form State
  const initialForm = {
    title: '',
    code: '',
    venueId: venues[0]?.id || '',
    category: 'Competition',
    registeredAttendees: 1000,
    startTime: '2026-10-11T10:00:00',
    endTime: '2026-10-11T18:00:00',
    status: 'Active',
    organizer: '',
    description: ''
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  const categories = ['All', 'Competition', 'Keynote', 'Exhibition', 'Networking', 'Workshop', 'Entertainment'];
  const statuses = ['All', 'Active', 'Upcoming', 'Concluded'];

  // Filtering
  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venueName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = categoryFilter === 'All' || event.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || event.status === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  // Open Create
  const handleOpenCreate = () => {
    setFormData(initialForm);
    setFormErrors({});
    setCreateModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (evt) => {
    setSelectedEvent(evt);
    setFormData({
      title: evt.title || '',
      code: evt.code || '',
      venueId: evt.venueId || venues[0]?.id,
      category: evt.category || 'Competition',
      registeredAttendees: evt.registeredAttendees || 500,
      startTime: evt.startTime ? evt.startTime.slice(0, 19) : '',
      endTime: evt.endTime ? evt.endTime.slice(0, 19) : '',
      status: evt.status || 'Active',
      organizer: evt.organizer || '',
      description: evt.description || ''
    });
    setFormErrors({});
    setEditModalOpen(true);
  };

  // Open View
  const handleOpenView = (evt) => {
    setSelectedEvent(evt);
    setViewModalOpen(true);
  };

  // Open Delete
  const handleOpenDelete = (evt) => {
    setSelectedEvent(evt);
    setDeleteModalOpen(true);
  };

  // Validate form
  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.code.trim()) errs.code = 'Event Code is required';
    if (!formData.organizer.trim()) errs.organizer = 'Organizer name is required';
    if (!formData.registeredAttendees || formData.registeredAttendees <= 0) {
      errs.registeredAttendees = 'Must be greater than 0';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Create
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    addEvent({
      ...formData,
      registeredAttendees: Number(formData.registeredAttendees)
    });
    setCreateModalOpen(false);
  };

  // Submit Edit
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    updateEvent(selectedEvent.id, {
      ...formData,
      registeredAttendees: Number(formData.registeredAttendees)
    });
    setEditModalOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              {isParticipant ? 'Conference Schedule & Agendas' : 'Event Operations'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-cyan-400" />
            {isParticipant ? 'EVENT SCHEDULE & SESSIONS' : 'EVENTS SCHEDULE & ROSTER'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {isParticipant
              ? 'Explore hackathon stages, keynote timelines, workshops, and venue locations.'
              : 'Manage scheduled congresses, keynotes, hackathons, and monitor projected attendance footprints.'}
          </p>
        </div>

        {/* Create Event Button: strictly admin/organiser only! */}
        {canManageEvents && (
          <Button
            icon={Plus}
            variant="primary"
            onClick={handleOpenCreate}
            className="font-mono text-xs"
          >
            Create New Event
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, code, venue, organizer..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 font-mono">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-cyan-500"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-mono">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-cyan-500"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Events Table / Card Roster */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0c1322] border border-slate-800">
          <CalendarDays className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">No matching events found</h4>
          <p className="text-xs text-slate-500 mt-1">Try resetting search filters or keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map(evt => {
            const venue = venues.find(v => v.id === evt.venueId);
            return (
              <div
                key={evt.id}
                className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {evt.code}
                    </span>
                    <Badge variant={evt.status === 'Active' ? 'normal' : 'default'} size="sm">
                      {evt.status}
                    </Badge>
                  </div>

                  <h3
                    className="text-base font-semibold text-white tracking-wide mb-1.5 hover:text-cyan-300 cursor-pointer"
                    onClick={() => handleOpenView(evt)}
                  >
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {evt.description || 'No detailed briefing available for this scheduled session.'}
                  </p>

                  <div className="space-y-2 text-xs font-mono text-slate-300 border-t border-slate-800/80 pt-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{evt.venueName || venue?.name || 'Unassigned Zone'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        {isParticipant
                          ? `${evt.registeredAttendees?.toLocaleString()} Expected Attendees`
                          : `${evt.registeredAttendees?.toLocaleString()} Registrations`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {new Date(evt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(evt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/70 text-slate-400">
                    {evt.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {canManageEvents ? (
                      /* Admin/Organiser gets full Edit & Delete */
                      <>
                        <button
                          onClick={() => handleOpenView(evt)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(evt)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                          title="Edit Event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(evt)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      /* Volunteers & Participants get a clean Session Info button */
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Eye}
                        onClick={() => handleOpenView(evt)}
                        className="text-xs font-mono py-1 px-2.5"
                      >
                        Session Info
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE EVENT MODAL (Admin/Organiser Only) */}
      {canManageEvents && (
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Schedule New Event"
          subtitle="Register scheduled session to forecast crowd spatial density and gate demands"
        >
          <form onSubmit={handleSubmitCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. AI Keynote Finals"
                  className={`w-full px-3 py-2 rounded-lg bg-slate-900 border text-sm text-slate-100 ${formErrors.title ? 'border-rose-500' : 'border-slate-700'}`}
                />
                {formErrors.title && <span className="text-[11px] text-rose-400">{formErrors.title}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Event Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. EVT-KEYNOTE"
                  className={`w-full px-3 py-2 rounded-lg bg-slate-900 border text-sm text-slate-100 font-mono ${formErrors.code ? 'border-rose-500' : 'border-slate-700'}`}
                />
                {formErrors.code && <span className="text-[11px] text-rose-400">{formErrors.code}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Assigned Venue *
                </label>
                <select
                  value={formData.venueId}
                  onChange={e => setFormData({ ...formData, venueId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
                >
                  {venues.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.zone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Registered Attendees *
                </label>
                <input
                  type="number"
                  value={formData.registeredAttendees}
                  onChange={e => setFormData({ ...formData, registeredAttendees: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Organizer Organization *
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={e => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="e.g. Frontier AI Institute"
                  className={`w-full px-3 py-2 rounded-lg bg-slate-900 border text-sm text-slate-100 ${formErrors.organizer ? 'border-rose-500' : 'border-slate-700'}`}
                />
                {formErrors.organizer && <span className="text-[11px] text-rose-400">{formErrors.organizer}</span>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Event Description & Operational Notes
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide briefing details for crowd management..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Register Event
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT EVENT MODAL (Admin/Organiser Only) */}
      {canManageEvents && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Event Details"
          subtitle={`Modifying ${selectedEvent?.code || ''}`}
        >
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Event Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Assigned Venue *
                </label>
                <select
                  value={formData.venueId}
                  onChange={e => setFormData({ ...formData, venueId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
                >
                  {venues.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
                >
                  {statuses.filter(s => s !== 'All').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Registered Attendees
                </label>
                <input
                  type="number"
                  value={formData.registeredAttendees}
                  onChange={e => setFormData({ ...formData, registeredAttendees: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Organizer Organization
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={e => setFormData({ ...formData, organizer: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* EVENT DETAILS VIEW MODAL (Session Details) */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={selectedEvent?.title || "Session Details"}
        subtitle={`Session ID: ${selectedEvent?.code}`}
        maxWidth="max-w-xl"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">HOST / ORGANIZER</span>
                <span className="text-white font-bold">{selectedEvent.organizer || 'Event Committee'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SESSION CATEGORY</span>
                <span className="text-cyan-400 font-bold">{selectedEvent.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">HALL LOCATION</span>
                <span className="text-white font-bold">{selectedEvent.venueName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SCHEDULE TIME</span>
                <span className="text-cyan-300 font-bold">
                  {new Date(selectedEvent.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedEvent.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                {isParticipant ? 'Session Agenda & Summary' : 'Operational Briefing'}
              </h4>
              <p className="text-sm text-slate-300 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
                {selectedEvent.description || 'No detailed briefing logged for this event.'}
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* DELETE CONFIRMATION MODAL (Admin/Organiser Only) */}
      {canManageEvents && (
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Event Confirmation"
          message={`Are you sure you want to delete event "${selectedEvent?.title}" (${selectedEvent?.code})? This will remove its projected crowd requirements from the simulation.`}
          confirmText="Delete Event"
          variant="danger"
          iconType="danger"
        />
      )}
    </div>
  );
}
