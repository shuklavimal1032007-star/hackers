import React, { useState } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  Building2,
  Users,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function IncidentsAlertsPage() {
  const { incidents, venues, volunteers, updateIncidentStatus, addIncident, currentRole } = useApp();

  const isVolunteer = currentRole === 'volunteer';

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [statusUpdateModalOpen, setStatusUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('Resolved');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // New incident form state
  const [newIncidentData, setNewIncidentData] = useState({
    title: '',
    venueId: venues[0]?.id || '',
    severity: 'Warning',
    description: '',
    evidence: '',
    reportedBy: 'Field Safety Officer'
  });

  const severities = ['All', 'Critical', 'Warning', 'Info'];
  const statuses = ['All', 'Open', 'In Progress', 'Resolved'];

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.venueName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'All' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || inc.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleOpenDetails = (inc) => {
    setSelectedIncident(inc);
    setDetailsModalOpen(true);
  };

  const handleOpenStatusModal = (inc, targetStatus) => {
    setSelectedIncident(inc);
    setNewStatus(targetStatus);
    setResolutionNotes('');
    setStatusUpdateModalOpen(true);
  };

  const handleConfirmStatusUpdate = () => {
    if (selectedIncident) {
      updateIncidentStatus(selectedIncident.id, newStatus, resolutionNotes);
      setStatusUpdateModalOpen(false);
      if (detailsModalOpen) setDetailsModalOpen(false);
    }
  };

  const handleCreateIncident = (e) => {
    e.preventDefault();
    if (!newIncidentData.title.trim() || !newIncidentData.description.trim()) return;

    addIncident({
      ...newIncidentData,
      status: 'Open'
    });
    setCreateModalOpen(false);
    setNewIncidentData({
      title: '',
      venueId: venues[0]?.id || '',
      severity: 'Warning',
      description: '',
      evidence: '',
      reportedBy: 'Field Safety Officer'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">Incident Command Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            INCIDENTS & TACTICAL ALERTS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time optical flow anomalies, turnstile failures, emergency exits, and rapid response dispatches.
          </p>
        </div>

        <Button
          variant="danger"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
          className="text-xs font-mono"
        >
          Report Incident
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incident by ID, title, venue, or evidence keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 font-mono">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-cyan-500"
            >
              {severities.map(s => <option key={s} value={s}>{s}</option>)}
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

      {/* Incidents Data Table */}
      {filteredIncidents.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0c1322] border border-slate-800">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">No active incidents matching filters</h4>
          <p className="text-xs text-slate-500 mt-1">All venue sectors within normal risk thresholds.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIncidents.map(inc => {
            const isResolved = inc.status === 'Resolved';
            const isCritical = inc.severity === 'Critical';

            return (
              <div
                key={inc.id}
                className={`p-4 sm:p-5 rounded-xl bg-[#0c1322] border transition-all ${
                  !isResolved && isCritical ? 'border-rose-500/50 glow-rose' :
                  !isResolved ? 'border-amber-500/40' : 'border-slate-800/80 opacity-75'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left Column: ID, Severity, Title */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {inc.id}
                      </span>
                      <Badge variant={inc.severity} dot size="sm">
                        {inc.severity}
                      </Badge>
                      <Badge variant={inc.status === 'Resolved' ? 'normal' : inc.status === 'In Progress' ? 'info' : 'warning'} size="sm">
                        {inc.status}
                      </Badge>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h3 
                      className="text-base font-semibold text-white tracking-wide cursor-pointer hover:text-cyan-300 transition-colors"
                      onClick={() => handleOpenDetails(inc)}
                    >
                      {inc.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {inc.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <Building2 className="w-3.5 h-3.5" />
                        {inc.venueName}
                      </span>
                      <span>Reported By: {inc.reportedBy}</span>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => handleOpenDetails(inc)}
                      className="text-xs font-mono"
                    >
                      Evidence & Logs
                    </Button>

                    {!isResolved && (
                      <>
                        {inc.status === 'Open' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenStatusModal(inc, 'In Progress')}
                            className="text-xs font-mono"
                          >
                            Mark In Progress
                          </Button>
                        )}
                        {!isVolunteer && (
                          <Button
                            variant="success"
                            size="sm"
                            icon={CheckCircle2}
                            onClick={() => handleOpenStatusModal(inc, 'Resolved')}
                            className="text-xs font-mono"
                          >
                            Resolve
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INCIDENT DETAILS & EVIDENCE MODAL */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={selectedIncident ? `${selectedIncident.id}: ${selectedIncident.title}` : 'Incident Dossier'}
        subtitle={`Location: ${selectedIncident?.venueName} • Reported: ${selectedIncident?.timestamp ? new Date(selectedIncident.timestamp).toLocaleTimeString() : ''}`}
        maxWidth="max-w-2xl"
      >
        {selectedIncident && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={selectedIncident.severity} dot size="md">
                Severity: {selectedIncident.severity}
              </Badge>
              <Badge variant={selectedIncident.status === 'Resolved' ? 'normal' : 'warning'} size="md">
                Status: {selectedIncident.status}
              </Badge>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Full Incident Description
              </h4>
              <p className="text-sm text-slate-200 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                {selectedIncident.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Sensor & Optical Vision Evidence
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 leading-relaxed">
                {selectedIncident.evidence || 'Sensor stream verified by Computer Vision flow analysis model.'}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Operational Mitigation Actions Taken
              </h4>
              <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {selectedIncident.actionTaken || 'No action resolution logged yet.'}
              </p>
            </div>

              {/* Resolution button if open (Admin only) */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>
                  Close
                </Button>

                {!isVolunteer && selectedIncident.status !== 'Resolved' && (
                  <Button
                    variant="success"
                    icon={CheckCircle2}
                    onClick={() => handleOpenStatusModal(selectedIncident, 'Resolved')}
                  >
                    Mark as Resolved
                  </Button>
                )}
              </div>
          </div>
        )}
      </Modal>

      {/* RESOLUTION STATUS UPDATE MODAL */}
      <Modal
        isOpen={statusUpdateModalOpen}
        onClose={() => setStatusUpdateModalOpen(false)}
        title={`Update Incident ${selectedIncident?.id} Status`}
        subtitle={`Transitioning to: ${newStatus}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Provide operational logs for the audit trail regarding actions taken to handle this incident.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Action Taken / Resolution Summary
            </label>
            <textarea
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Volunteer squad guided crowd to exit 4; turnstile reset and verified operational."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
            <Button variant="outline" onClick={() => setStatusUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmStatusUpdate}>
              Confirm Update
            </Button>
          </div>
        </div>
      </Modal>

      {/* CREATE NEW INCIDENT MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Report Field Incident"
        subtitle="Log optical bottlenecks, medical situations, or security breaches into command log"
      >
        <form onSubmit={handleCreateIncident} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Incident Title *
            </label>
            <input
              type="text"
              required
              value={newIncidentData.title}
              onChange={e => setNewIncidentData({ ...newIncidentData, title: e.target.value })}
              placeholder="e.g. Stalled Optical Scanner Gate 2"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Venue Location *
              </label>
              <select
                value={newIncidentData.venueId}
                onChange={e => setNewIncidentData({ ...newIncidentData, venueId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              >
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Severity Level *
              </label>
              <select
                value={newIncidentData.severity}
                onChange={e => setNewIncidentData({ ...newIncidentData, severity: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              >
                <option value="Critical">Critical (Immediate Hazard)</option>
                <option value="Warning">Warning (Potential Bottleneck)</option>
                <option value="Info">Info (Standard Log)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Incident Description *
            </label>
            <textarea
              rows={3}
              required
              value={newIncidentData.description}
              onChange={e => setNewIncidentData({ ...newIncidentData, description: e.target.value })}
              placeholder="Describe tactical situation on ground..."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Sensor / Camera Evidence Details
            </label>
            <input
              type="text"
              value={newIncidentData.evidence}
              onChange={e => setNewIncidentData({ ...newIncidentData, evidence: e.target.value })}
              placeholder="e.g. Optical density 3.2 p/m² on Camera #07"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger">
              Register Incident
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
