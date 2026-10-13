import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Building2,
  Phone,
  Mail,
  Shield,
  Clock,
  ArrowRight,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function VolunteerManagementPage() {
  const { volunteers, venues, assignVolunteer, unassignVolunteer } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');

  // Assign Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [targetVenueId, setTargetVenueId] = useState(venues[0]?.id || '');
  const [assignError, setAssignError] = useState('');

  const statuses = ['All', 'Active', 'Available', 'On Break'];
  const allSkills = ['All', 'Crowd Control', 'First Aid CPR', 'Access Security', 'Bilingual', 'Emergency Evacuation'];

  const filteredVolunteers = volunteers.filter(vol => {
    const matchesSearch =
      vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.assignedVenueName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || vol.status === statusFilter;
    const matchesSkill = skillFilter === 'All' || vol.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesSkill;
  });

  const handleOpenAssign = (vol) => {
    setSelectedVolunteer(vol);
    setTargetVenueId(venues[0]?.id || '');
    setAssignError('');
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = (e) => {
    e.preventDefault();
    if (!selectedVolunteer || !targetVenueId) return;

    const success = assignVolunteer(selectedVolunteer.id, targetVenueId);
    if (success) {
      setAssignModalOpen(false);
    } else {
      setAssignError('Conflict detected: Unable to complete assignment. Check sector limits or duplicate role.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Field Staff Logistics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            VOLUNTEER & MARSHAL DISPATCH
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time deployment of first responders, multilingual guides, and crowd control marshals with conflict avoidance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {volunteers.filter(v => v.status === 'Active').length} Deployed
          </span>
          <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            {volunteers.filter(v => v.status === 'Available').length} In Reserve
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search volunteers by name, role, or sector..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 font-mono">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-cyan-500"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-mono">Skill:</span>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-cyan-500"
            >
              {allSkills.map(sk => <option key={sk} value={sk}>{sk}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Volunteers Cards Grid */}
      {filteredVolunteers.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0c1322] border border-slate-800">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">No volunteers match criteria</h4>
          <p className="text-xs text-slate-500 mt-1">Try resetting search or skill filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVolunteers.map(vol => {
            const isAssigned = !!vol.assignedVenueId;
            return (
              <div
                key={vol.id}
                className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top user badge and status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={vol.avatar}
                        alt={vol.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {vol.name}
                        </h3>
                        <p className="text-xs text-slate-400">{vol.role}</p>
                      </div>
                    </div>

                    <Badge
                      variant={vol.status === 'Active' ? 'normal' : vol.status === 'Available' ? 'info' : 'warning'}
                      dot
                      size="sm"
                    >
                      {vol.status}
                    </Badge>
                  </div>

                  {/* Contact details */}
                  <div className="space-y-1 text-xs font-mono text-slate-400 mb-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{vol.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{vol.email}</span>
                    </div>
                  </div>

                  {/* Assigned Venue Banner */}
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 mb-3">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">CURRENT SECTOR ASSIGNMENT</span>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs font-semibold text-cyan-300">
                      <Building2 className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                      <span className="truncate">{vol.assignedVenueName || 'Unassigned (Roving Pool)'}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase">CERTIFIED SKILLS</span>
                    <div className="flex flex-wrap gap-1.5">
                      {vol.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={UserCheck}
                    onClick={() => handleOpenAssign(vol)}
                    className="flex-1 text-xs font-mono"
                  >
                    {isAssigned ? 'Reassign Sector' : 'Assign Sector'}
                  </Button>

                  {isAssigned && (
                    <button
                      onClick={() => unassignVolunteer(vol.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Unassign to Roving Pool"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VOLUNTEER ASSIGNMENT MODAL */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Deploy Volunteer: ${selectedVolunteer?.name}`}
        subtitle={`Role: ${selectedVolunteer?.role} • Conflict-avoidance enabled`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmAssign} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Target Venue / Checkpoint Sector *
            </label>
            <select
              value={targetVenueId}
              onChange={(e) => setTargetVenueId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
            >
              {venues.map(v => {
                const venueVols = volunteers.filter(vol => vol.assignedVenueId === v.id);
                return (
                  <option key={v.id} value={v.id}>
                    {v.name} ({venueVols.length} staff currently deployed)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Current assignment display */}
          <div className="p-3 rounded-lg bg-slate-900 text-xs font-mono text-slate-300">
            <span className="text-slate-400 block text-[10px]">CURRENT STATION</span>
            <span>{selectedVolunteer?.assignedVenueName || 'Unassigned (Roving Pool)'}</span>
          </div>

          {assignError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{assignError}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="outline" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Deployment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
