import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Layers,
  MapPin,
  Radio,
  Building,
  User,
  Shield,
  Phone,
  Mail,
  TrendingUp,
  Tag,
  ArrowRight,
  Sparkles,
  Check,
  Zap,
  Package,
  Activity,
  ChevronRight,
  ExternalLink,
  Copy,
  Send,
  UserPlus,
  FileText,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function OrganiserDashboardPage() {
  const {
    events,
    volunteers,
    teams,
    tasks,
    organisers,
    activeOrganiserId,
    venues,
    createOrganiserTask,
    updateTaskStatus,
    addEvent,
    assignVolunteerToTeam,
    addVolunteerAndSendInvite,
    updateVolunteerResponsibilities,
    resendVolunteerInvite,
    showToast
  } = useApp();

  // Active organiser
  const activeOrganiser = (organisers && organisers.find(o => o.id === activeOrganiserId)) || (organisers && organisers[0]) || {
    name: 'Sarah Jenkins',
    organisation: 'Global AI Dev Alliance',
    roleTitle: 'Lead Event Operations Director'
  };

  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'events' | 'teams' | 'volunteers' | 'data'
  const [selectedEventId, setSelectedEventId] = useState('all');

  // Task Filter State
  const [taskSearch, setTaskSearch] = useState('');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('All');
  const [taskTeamFilter, setTaskTeamFilter] = useState('All');

  // Modals
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [assignVolModalOpen, setAssignVolModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTeamId, setNewTaskTeamId] = useState(teams[0]?.id || 'team-001');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Today, 17:00');
  const [newTaskCategory, setNewTaskCategory] = useState('Operations');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('Competition');
  const [newEventVenueId, setNewEventVenueId] = useState(venues[0]?.id || 'ven-001');
  const [newEventAttendees, setNewEventAttendees] = useState(2500);
  const [newEventDesc, setNewEventDesc] = useState('');

  // Assign Volunteer State
  const [assignedTeamId, setAssignedTeamId] = useState(teams[0]?.id || 'team-001');
  const [assignedRoleTitle, setAssignedRoleTitle] = useState('');

  // Volunteer Management & Invite States
  const [inviteVolModalOpen, setInviteVolModalOpen] = useState(false);
  const [inviteSuccessModalOpen, setInviteSuccessModalOpen] = useState(false);
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');
  const [invitedVolSummary, setInvitedVolSummary] = useState(null);

  // New Volunteer Invite Form
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volEventId, setVolEventId] = useState(events[0]?.id || 'evt-101');
  const [volTeamId, setVolTeamId] = useState(teams[0]?.id || 'team-001');
  const [volRole, setVolRole] = useState('Crowd Flow Marshall');
  const [volResponsibilities, setVolResponsibilities] = useState('Monitor main concourse entry gates, enforce bag check protocols, direct overflow to standby lane, and report choke points via squad radio.');
  const [volShiftSchedule, setVolShiftSchedule] = useState('08:00 - 16:00 (Morning Shift)');
  const [volInitialTask, setVolInitialTask] = useState('Conduct morning checkpoint radio test & inspect turnstile stanchions');
  const [volSkills, setVolSkills] = useState('Crowd Control, Radio Ops, Customer Support');

  // Volunteer Filter & Search State
  const [volSearch, setVolSearch] = useState('');
  const [volTeamFilter, setVolTeamFilter] = useState('All');
  const [volStatusFilter, setVolStatusFilter] = useState('All');

  // Edit / Reassign Volunteer State
  const [editVolModalOpen, setEditVolModalOpen] = useState(false);
  const [editVolResponsibilities, setEditVolResponsibilities] = useState('');
  const [editVolShift, setEditVolShift] = useState('');

  const filteredVolunteers = (volunteers || []).filter(vol => {
    const matchesSearch = vol.name.toLowerCase().includes(volSearch.toLowerCase()) ||
                          vol.email.toLowerCase().includes(volSearch.toLowerCase()) ||
                          vol.role.toLowerCase().includes(volSearch.toLowerCase());
    const matchesTeam = volTeamFilter === 'All' || vol.teamId === volTeamFilter;
    const matchesStatus = volStatusFilter === 'All' ||
                          (volStatusFilter === 'Active' && vol.status === 'Active') ||
                          (volStatusFilter === 'Invited' && (vol.status === 'Invited' || vol.invitationStatus === 'Pending'));
    return matchesSearch && matchesTeam && matchesStatus;
  });

  const handleInviteVolunteerSubmit = (e) => {
    e.preventDefault();
    if (!volName.trim() || !volEmail.trim()) {
      showToast("Required Fields", "Please enter volunteer full name and official email.", "warning");
      return;
    }

    const result = addVolunteerAndSendInvite({
      name: volName.trim(),
      email: volEmail.trim(),
      phone: volPhone.trim() || '+1 (555) 012-3456',
      eventId: volEventId,
      teamId: volTeamId,
      role: volRole.trim() || 'Field Operations Specialist',
      responsibilities: volResponsibilities.trim() || 'Support concourse pedestrian routing and event safety directives.',
      shiftSchedule: volShiftSchedule.trim() || '08:00 - 16:00 (Standard Shift)',
      skills: volSkills.split(',').map(s => s.trim()).filter(Boolean),
      initialTaskTitle: volInitialTask.trim()
    });

    setInvitedVolSummary(result.volunteer);
    const origin = window.location.origin || 'http://localhost:5173';
    setGeneratedInviteLink(`${origin}${result.inviteLink}`);
    setInviteVolModalOpen(false);
    setInviteSuccessModalOpen(true);

    // Reset form
    setVolName('');
    setVolEmail('');
    setVolPhone('');
  };

  const handleUpdateVolunteerDuties = (e) => {
    e.preventDefault();
    if (!selectedVolunteer) return;

    updateVolunteerResponsibilities(selectedVolunteer.id, {
      teamId: assignedTeamId,
      role: assignedRoleTitle,
      responsibilities: editVolResponsibilities,
      shiftSchedule: editVolShift
    });

    setEditVolModalOpen(false);
    setSelectedVolunteer(null);
  };

  // Filtered Tasks
  const filteredTasks = (tasks || []).filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
                          task.assignedTo.toLowerCase().includes(taskSearch.toLowerCase()) ||
                          task.id.toLowerCase().includes(taskSearch.toLowerCase());
    const matchesPriority = taskPriorityFilter === 'All' || task.priority === taskPriorityFilter;
    const matchesTeam = taskTeamFilter === 'All' || task.teamId === taskTeamFilter;
    const matchesEvent = selectedEventId === 'all' || task.eventId === selectedEventId;
    return matchesSearch && matchesPriority && matchesTeam && matchesEvent;
  });

  const todoTasks = filteredTasks.filter(t => t.status === 'To Do');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'In Progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'Completed');

  // Handle Create Task
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    createOrganiserTask({
      title: newTaskTitle.trim(),
      teamId: newTaskTeamId,
      assignedTo: newTaskAssignee.trim(),
      priority: newTaskPriority,
      dueDate: newTaskDueDate.trim(),
      category: newTaskCategory,
      description: newTaskDescription.trim()
    });

    setNewTaskTitle('');
    setNewTaskAssignee('');
    setNewTaskDescription('');
    setCreateTaskModalOpen(false);
  };

  // Handle Create Event
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const targetVenue = venues.find(v => v.id === newEventVenueId) || venues[0];

    addEvent({
      title: newEventTitle.trim(),
      code: `EVT-${Math.floor(100 + Math.random() * 900)}`,
      venueId: targetVenue.id,
      venueName: targetVenue.name,
      category: newEventCategory,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      registeredAttendees: Number(newEventAttendees) || 1000,
      status: 'Active',
      organizer: activeOrganiser.name,
      description: newEventDesc.trim() || 'Organised via Aegis Command Console.'
    });

    setNewEventTitle('');
    setNewEventDesc('');
    setCreateEventModalOpen(false);
    showToast("Event Created", `New event "${newEventTitle}" added to live schedule.`, "success");
  };

  // Handle Volunteer Assignment
  const handleAssignVolunteer = (e) => {
    e.preventDefault();
    if (!selectedVolunteer) return;

    assignVolunteerToTeam(selectedVolunteer.id, assignedTeamId, assignedRoleTitle.trim());
    setAssignVolModalOpen(false);
    setSelectedVolunteer(null);
  };

  return (
    <div className="space-y-6">
      {/* ORGANISER PROFILE & IDENTITY HEADER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0c1428] via-[#090f20] to-[#070b16] border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Organiser Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 p-0.5 shadow-lg shadow-amber-950/40 shrink-0">
              <div className="w-full h-full bg-[#0a1020] rounded-[14px] flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  EVENT DIRECTOR & WORKFORCE COMMAND
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono text-slate-400">{activeOrganiser.organisation}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono flex items-center gap-2">
                {activeOrganiser.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {activeOrganiser.roleTitle} • Directing {events.length} active event tracks & {teams.length} operational squads.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs shrink-0">
            <Button
              variant="secondary"
              icon={Calendar}
              onClick={() => setCreateEventModalOpen(true)}
              className="text-xs font-mono border-slate-700 bg-slate-900 hover:bg-slate-800"
            >
              + Create Event
            </Button>

            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setCreateTaskModalOpen(true)}
              className="text-xs font-mono font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 border-amber-400/40 shadow-lg shadow-amber-950/40 text-white"
            >
              + Assign New Task
            </Button>
          </div>
        </div>

        {/* Quick Metrics Bar inside Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Active Events</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{events.length} Tracks</span>
            <span className="text-[10px] text-cyan-400">All venues operational</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Operational Squads</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{teams.length} Teams</span>
            <span className="text-[10px] text-emerald-400">100% Leads checked-in</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Field Volunteers</span>
            <span className="text-lg font-bold text-emerald-300 mt-0.5 block">{volunteers.length} Marshals</span>
            <span className="text-[10px] text-slate-400">{volunteers.filter(v => v.status === 'Active').length} Active on shift</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20 bg-amber-950/10">
            <span className="text-[10px] text-amber-400 block uppercase">Open Tasks</span>
            <span className="text-lg font-bold text-amber-300 mt-0.5 block">{todoTasks.length + inProgressTasks.length} Pending</span>
            <span className="text-[10px] text-slate-400">{completedTasks.length} Done today</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD NAVIGATION TABS */}
      <div className="flex border-b border-slate-800 space-x-2 font-mono text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'tasks'
              ? 'border-amber-400 text-amber-400 bg-amber-950/20'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Task Board & Assignments</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300">
            {filteredTasks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'events'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Events Management</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300">
            {events.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'teams'
              ? 'border-indigo-400 text-indigo-400 bg-indigo-950/20'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Teams & Squads</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300">
            {teams.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('volunteers')}
          className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'volunteers'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Volunteer Roster & Duty</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300">
            {volunteers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'data'
              ? 'border-purple-400 text-purple-400 bg-purple-950/20'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Event Telemetry & Data</span>
        </button>
      </div>

      {/* TAB 1: TASK BOARD & ASSIGNMENTS (KANBAN COLUMNS) */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <Card className="p-3.5 border-slate-800 bg-[#090e1c]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  placeholder="Search tasks, assignees, ID..."
                  className="w-full bg-slate-900 border border-slate-700 text-white pl-9 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-amber-500 text-xs font-sans"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {/* Priority */}
                <select
                  value={taskPriorityFilter}
                  onChange={(e) => setTaskPriorityFilter(e.target.value)}
                  className="bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-amber-500 text-xs"
                >
                  <option value="All">All Priorities</option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                {/* Team */}
                <select
                  value={taskTeamFilter}
                  onChange={(e) => setTaskTeamFilter(e.target.value)}
                  className="bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-amber-500 text-xs"
                >
                  <option value="All">All Teams</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => setCreateTaskModalOpen(true)}
                  className="text-xs bg-gradient-to-r from-amber-500 to-orange-600 border-amber-400/40 text-slate-950 font-bold"
                >
                  + Add Task
                </Button>
              </div>
            </div>
          </Card>

          {/* 3-Column Task Board (To Do, In Progress, Completed) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* COLUMN 1: TO DO */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono text-xs">
                <span className="flex items-center gap-2 font-bold text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  TO DO ({todoTasks.length})
                </span>
                <span className="text-[10px] text-slate-500">Awaiting Action</span>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {todoTasks.length === 0 ? (
                  <div className="p-8 text-center border-dashed border border-slate-800/80 rounded-2xl text-slate-500 text-xs font-mono">
                    No pending tasks in queue.
                  </div>
                ) : (
                  todoTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl bg-[#090e1c] border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400">{task.id}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                          task.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                          task.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                          'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white font-mono leading-tight">{task.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Squad: <strong className="text-slate-200">{task.teamName}</strong></span>
                        <span className="text-slate-500">{task.dueDate}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-300 font-mono">Assignee: {task.assignedTo}</span>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'In Progress')}
                          className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold hover:bg-amber-500/30 transition-colors cursor-pointer"
                        >
                          Start Task →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 2: IN PROGRESS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono text-xs">
                <span className="flex items-center gap-2 font-bold text-amber-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  IN PROGRESS ({inProgressTasks.length})
                </span>
                <span className="text-[10px] text-amber-400">Active Deployment</span>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {inProgressTasks.length === 0 ? (
                  <div className="p-8 text-center border-dashed border border-slate-800/80 rounded-2xl text-slate-500 text-xs font-mono">
                    No active tasks currently running.
                  </div>
                ) : (
                  inProgressTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl bg-[#090e1c] border border-amber-500/40 hover:border-amber-400 transition-all space-y-3 shadow-lg shadow-amber-950/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400">{task.id}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                          task.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' :
                          task.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                          'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white font-mono leading-tight">{task.title}</h4>
                      <p className="text-[11px] text-slate-300 line-clamp-2">{task.description}</p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Squad: <strong className="text-slate-200">{task.teamName}</strong></span>
                        <span className="text-amber-400 font-semibold">{task.dueDate}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-300 font-mono">Assignee: {task.assignedTo}</span>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'Completed')}
                          className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-mono text-[10px] font-bold hover:bg-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Mark Done</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 3: COMPLETED */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono text-xs">
                <span className="flex items-center gap-2 font-bold text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  COMPLETED ({completedTasks.length})
                </span>
                <span className="text-[10px] text-emerald-400">Verified by Ops</span>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {completedTasks.length === 0 ? (
                  <div className="p-8 text-center border-dashed border border-slate-800/80 rounded-2xl text-slate-500 text-xs font-mono">
                    No completed tasks yet.
                  </div>
                ) : (
                  completedTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl bg-[#090e1c] border border-emerald-500/30 opacity-80 hover:opacity-100 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-400">{task.id}</span>
                        <Badge variant="success" size="sm">COMPLETED ✓</Badge>
                      </div>

                      <h4 className="text-xs font-bold text-slate-300 font-mono line-through">{task.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{task.description}</p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>Squad: {task.teamName}</span>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'In Progress')}
                          className="text-cyan-400 hover:underline cursor-pointer"
                        >
                          Reopen
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVENTS MANAGEMENT */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1 font-mono text-xs">
            <span className="text-slate-400 uppercase font-semibold">Scheduled Events ({events.length})</span>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setCreateEventModalOpen(true)}
              className="text-xs font-mono"
            >
              + Create New Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(event => (
              <Card key={event.id} className="p-5 border-slate-800 bg-[#090e1c] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">{event.code || event.id}</span>
                  <Badge variant={event.status === 'Active' ? 'success' : 'secondary'} size="sm">
                    {event.status}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-white font-mono">{event.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{event.description}</p>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Venue:</span>
                    <span className="text-slate-200">{event.venueName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Attendees:</span>
                    <span className="text-cyan-400 font-bold">{event.registeredAttendees?.toLocaleString()} registered</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-slate-300">{event.category}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Organised by: {event.organizer || activeOrganiser.name}</span>
                  <span className="text-emerald-400 font-semibold">Active Track</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TEAMS & SQUADS */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1 font-mono text-xs">
            <span className="text-slate-400 uppercase font-semibold">Operational Squads ({teams.length})</span>
            <span className="text-slate-400">Coordinated by Event Operations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map(team => (
              <Card key={team.id} className="p-5 border-slate-800 bg-[#090e1c] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
                      {team.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white font-mono">{team.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{team.contactRadio}</span>
                    </div>
                  </div>
                  <Badge variant="blue" size="sm">{team.membersCount} Members</Badge>
                </div>

                <p className="text-xs text-slate-300">{team.primaryDuty}</p>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Squad Lead:</span>
                    <span className="text-amber-300 font-bold">{team.lead}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Primary Sector:</span>
                    <span className="text-slate-200">{team.venue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Readiness:</span>
                    <span className="text-emerald-400 font-semibold">{team.status} • On Station</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNewTaskTeamId(team.id);
                      setCreateTaskModalOpen(true);
                    }}
                    className="text-xs font-mono"
                  >
                    + Assign Directive
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VOLUNTEERS WORKFORCE & ASSIGNMENT MANAGEMENT */}
      {activeTab === 'volunteers' && (
        <div className="space-y-6">
          {/* Volunteer Workforce KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-[#090e1c] border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">Total Workforce</span>
              <div className="text-xl font-bold font-mono text-white">{volunteers.length} Personnel</div>
              <p className="text-[10px] text-slate-500 font-mono">Assigned to {teams.length} Squads</p>
            </Card>

            <Card className="p-4 bg-[#090e1c] border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">Active On Duty</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {volunteers.filter(v => v.status === 'Active').length} Active
              </div>
              <p className="text-[10px] text-emerald-500 font-mono">Checked in on site</p>
            </Card>

            <Card className="p-4 bg-[#090e1c] border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">Pending Invitations</span>
              <div className="text-xl font-bold font-mono text-amber-400">
                {volunteers.filter(v => v.status === 'Invited' || v.invitationStatus === 'Pending').length} Pending
              </div>
              <p className="text-[10px] text-amber-500 font-mono">Email invites dispatched</p>
            </Card>

            <Card className="p-4 bg-[#090e1c] border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">Operational Squads</span>
              <div className="text-xl font-bold font-mono text-cyan-400">{teams.length} Active</div>
              <p className="text-[10px] text-cyan-500 font-mono">100% Team Coverage</p>
            </Card>
          </div>

          {/* Search, Filter & Add Volunteer Toolbar */}
          <div className="p-4 rounded-2xl bg-[#090e1c] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-mono text-xs">
            <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={volSearch}
                  onChange={(e) => setVolSearch(e.target.value)}
                  placeholder="Search volunteers by name, email, or role..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <select
                value={volTeamFilter}
                onChange={(e) => setVolTeamFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-amber-500 text-xs cursor-pointer"
              >
                <option value="All">All Operational Squads</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              <select
                value={volStatusFilter}
                onChange={(e) => setVolStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-amber-500 text-xs cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active (On Duty)</option>
                <option value="Invited">Invited (Pending Acceptance)</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={UserPlus}
              onClick={() => setInviteVolModalOpen(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:from-amber-400 hover:to-orange-400 shrink-0 shadow-lg shadow-amber-950/40"
            >
              + Invite / Add Volunteer
            </Button>
          </div>

          {/* Volunteer Workforce Cards */}
          {filteredVolunteers.length === 0 ? (
            <Card className="p-10 text-center bg-[#090e1c] border-slate-800 space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold font-mono text-white">No Volunteers Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No personnel match your current search query or filter. Invite new volunteers to assign them to your event squads.
              </p>
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={() => setInviteVolModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold mx-auto text-xs"
              >
                + Invite Volunteer Now
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVolunteers.map(vol => {
                const isInvited = vol.status === 'Invited' || vol.invitationStatus === 'Pending';

                return (
                  <Card
                    key={vol.id}
                    className={`p-5 space-y-4 transition-all border ${
                      isInvited
                        ? 'bg-[#090e1c] border-amber-500/40 shadow-lg shadow-amber-950/20'
                        : 'bg-[#090e1c] border-slate-800 hover:border-emerald-500/40'
                    }`}
                  >
                    {/* Header: Avatar, Name & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={vol.avatar}
                          alt={vol.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white font-mono">{vol.name}</h4>
                          </div>
                          <p className="text-xs text-cyan-400 font-mono">{vol.role}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{vol.email}</p>
                        </div>
                      </div>

                      <Badge
                        variant={
                          isInvited ? 'warning' :
                          vol.status === 'Active' ? 'success' :
                          'secondary'
                        }
                        size="sm"
                      >
                        {isInvited ? 'Invite Pending' : vol.status}
                      </Badge>
                    </div>

                    {/* Team & Event Pills */}
                    <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                        {vol.teamName || 'Operations Squad'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {vol.eventName || 'Global AI Hackathon'}
                      </span>
                    </div>

                    {/* Defined Responsibilities Box */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-1">
                      <span className="block text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wide">
                        Defined Responsibilities:
                      </span>
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        "{vol.responsibilities || 'Support concourse pedestrian routing, enforce safety guidelines, and assist attendee inquiries.'}"
                      </p>
                    </div>

                    {/* Shift & Contact Details */}
                    <div className="text-[11px] font-mono text-slate-400 space-y-1 pt-1 border-t border-slate-800/60">
                      <div className="flex justify-between">
                        <span>Shift Schedule:</span>
                        <span className="text-white font-semibold">{vol.shiftSchedule || '08:00 - 16:00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contact Phone:</span>
                        <span className="text-slate-300">{vol.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sector / Venue:</span>
                        <span className="text-slate-300">{vol.assignedVenueName || 'Main Concourse'}</span>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(vol.skills || []).map((skill, idx) => (
                        <span key={idx} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      {isInvited && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const token = resendVolunteerInvite(vol.id);
                              if (token) {
                                const origin = window.location.origin || 'http://localhost:5173';
                                navigator.clipboard?.writeText(`${origin}/volunteer-invite?token=${token}`);
                              }
                            }}
                            className="flex-1 py-1.5 px-2 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 font-mono text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Invite Link</span>
                          </button>

                          <a
                            href={`/volunteer-invite?token=${vol.inviteToken || `inv-${vol.id}`}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-mono text-[11px] transition-colors flex items-center gap-1"
                            title="Open volunteer onboarding link in a new tab"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Test</span>
                          </a>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVolunteer(vol);
                            setAssignedTeamId(vol.teamId || teams[0]?.id);
                            setAssignedRoleTitle(vol.role);
                            setEditVolResponsibilities(vol.responsibilities || '');
                            setEditVolShift(vol.shiftSchedule || '08:00 - 16:00');
                            setEditVolModalOpen(true);
                          }}
                          className="flex-1 text-[11px] font-mono py-1.5"
                        >
                          Edit Duties & Squad
                        </Button>

                        <button
                          onClick={() => {
                            setNewTaskAssignee(vol.name);
                            setNewTaskTeamId(vol.teamId || teams[0]?.id);
                            setCreateTaskModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[11px] transition-colors cursor-pointer"
                          title="Dispatch direct task to this volunteer"
                        >
                          + Task
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: EVENT-RELATED DATA & TELEMETRY */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 border-slate-800 bg-[#090e1c] space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Total Event Inflow Rate</span>
              <div className="text-2xl font-bold font-mono text-cyan-400">420 Attendees / min</div>
              <p className="text-xs text-slate-400">Peak flow concentrated at North & West perimeter gates.</p>
            </Card>

            <Card className="p-5 border-slate-800 bg-[#090e1c] space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Emergency Resource Reserves</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">94% Stocked</div>
              <p className="text-xs text-slate-400">Water pallets, medical kits, and backup shuttle fleet active.</p>
            </Card>

            <Card className="p-5 border-slate-800 bg-[#090e1c] space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Task Completion Velocity</span>
              <div className="text-2xl font-bold font-mono text-amber-400">
                {Math.round((completedTasks.length / (tasks?.length || 1)) * 100)}% Fulfilled
              </div>
              <p className="text-xs text-slate-400">{completedTasks.length} tasks executed in the last 6 hours.</p>
            </Card>
          </div>

          <Card className="p-6 border-slate-800 bg-[#090e1c] space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Building className="w-5 h-5 text-cyan-400" />
              Venue Spatial Capacities Under Organiser Management
            </h3>

            <div className="divide-y divide-slate-800/80 font-mono text-xs">
              {venues.map(venue => (
                <div key={venue.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">{venue.name}</h4>
                    <p className="text-slate-400 text-xs">{venue.category} • {venue.zone}</p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-slate-300 block font-bold">{venue.currentOccupancy?.toLocaleString()} / {venue.capacity?.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500">
                        {Math.round((venue.currentOccupancy / venue.capacity) * 100)}% Capacity
                      </span>
                    </div>

                    <Badge variant={venue.riskLevel === 'Critical' ? 'danger' : venue.riskLevel === 'Warning' ? 'warning' : 'success'} size="sm">
                      {venue.riskLevel}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      <Modal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        title="Assign Operational Directive"
        subtitle="Dispatch a new task to an operational squad or team lead"
        icon={Plus}
        size="lg"
      >
        <form onSubmit={handleCreateTask} className="space-y-4 font-sans text-xs">
          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">Task Title *</label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Stage 200 water bottles at Concourse 4, Soundcheck VIP microphones"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-amber-500 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Assign to Squad *</label>
              <select
                value={newTaskTeamId}
                onChange={(e) => setNewTaskTeamId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500 text-xs"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} (Lead: {t.lead})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Specific Assignee Name</label>
              <input
                type="text"
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                placeholder="Leave blank to assign to Squad Lead"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Priority Level *</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500 text-xs"
              >
                <option value="Urgent">Urgent — Immediate Action</option>
                <option value="High">High — Within 30 mins</option>
                <option value="Medium">Medium — Standard shift task</option>
                <option value="Low">Low — General maintenance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Due By</label>
              <input
                type="text"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                placeholder="Today, 18:00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Category</label>
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500 text-xs"
              >
                <option value="Operations">Operations</option>
                <option value="Security">Security</option>
                <option value="Medical">Medical</option>
                <option value="Transit">Transit</option>
                <option value="Technical">Technical</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">Task Details & Description</label>
            <textarea
              rows={3}
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Provide tactical instructions, specific gate numbers, radio channels, or equipment needed..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCreateTaskModalOpen(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="text-xs font-mono font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950"
            >
              Dispatch Directive
            </Button>
          </div>
        </form>
      </Modal>

      {/* CREATE EVENT MODAL */}
      <Modal
        isOpen={createEventModalOpen}
        onClose={() => setCreateEventModalOpen(false)}
        title="Schedule New Event Track"
        subtitle="Publish a new event track into the command centre registry"
        icon={Calendar}
        size="lg"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4 font-sans text-xs">
          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">Event Title *</label>
            <input
              type="text"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder="e.g. Keynote: Autonomous Drone Logistics Summit"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-cyan-500 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Assigned Venue *</label>
              <select
                value={newEventVenueId}
                onChange={(e) => setNewEventVenueId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500 text-xs"
              >
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name} (Cap: {v.capacity})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Category</label>
              <select
                value={newEventCategory}
                onChange={(e) => setNewEventCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500 text-xs"
              >
                <option value="Competition">Competition</option>
                <option value="Keynote">Keynote</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Networking">Networking</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Expected Attendees</label>
              <input
                type="number"
                value={newEventAttendees}
                onChange={(e) => setNewEventAttendees(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">Description / Schedule Notes</label>
            <textarea
              rows={3}
              value={newEventDesc}
              onChange={(e) => setNewEventDesc(e.target.value)}
              placeholder="Outline event agenda, VIP speakers, or specific stage requirements..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCreateEventModalOpen(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="text-xs font-mono font-bold bg-gradient-to-r from-cyan-600 to-blue-600"
            >
              Publish Event Track
            </Button>
          </div>
        </form>
      </Modal>

      {/* REASSIGN VOLUNTEER MODAL */}
      <Modal
        isOpen={assignVolModalOpen}
        onClose={() => setAssignVolModalOpen(false)}
        title="Reassign Volunteer to Squad"
        subtitle={`Update tactical deployment for ${selectedVolunteer?.name}`}
        icon={Users}
        size="md"
      >
        <form onSubmit={handleAssignVolunteer} className="space-y-4 font-sans text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono space-y-1">
            <div className="text-slate-400">Volunteer: <strong className="text-white">{selectedVolunteer?.name}</strong></div>
            <div className="text-slate-400">Current Duty: <span className="text-cyan-400">{selectedVolunteer?.role}</span></div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">Select Target Squad *</label>
            <select
              value={assignedTeamId}
              onChange={(e) => setAssignedTeamId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500 text-xs"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name} (Lead: {t.lead})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">Updated Role Title</label>
            <input
              type="text"
              value={assignedRoleTitle}
              onChange={(e) => setAssignedRoleTitle(e.target.value)}
              placeholder="e.g. Lead Queue Marshal, Emergency Runner"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setAssignVolModalOpen(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500"
            >
              Confirm Squad Reassignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: INVITE & ADD VOLUNTEER TO EVENT */}
      <Modal
        isOpen={inviteVolModalOpen}
        onClose={() => setInviteVolModalOpen(false)}
        title="Invite & Assign Volunteer to Event"
        subtitle="Dispatch an email invitation link, assign squad, and define responsibilities"
        icon={UserPlus}
        size="lg"
      >
        <form onSubmit={handleInviteVolunteerSubmit} className="space-y-4 font-sans text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Volunteer Full Name *</label>
              <input
                type="text"
                value={volName}
                onChange={(e) => setVolName(e.target.value)}
                placeholder="e.g. Liam Sterling, Maya Patel"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-amber-500 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Official Email (Invitation Target) *</label>
              <input
                type="email"
                value={volEmail}
                onChange={(e) => setVolEmail(e.target.value)}
                placeholder="e.g. liam.sterling@volunteer.org"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-amber-500 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Contact Phone Number</label>
              <input
                type="text"
                value={volPhone}
                onChange={(e) => setVolPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Target Event *</label>
              <select
                value={volEventId}
                onChange={(e) => setVolEventId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500 text-xs cursor-pointer"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Assign Operational Squad *</label>
              <select
                value={volTeamId}
                onChange={(e) => setVolTeamId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500 text-xs cursor-pointer"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} (Lead: {t.lead})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Assigned Role Title *</label>
              <input
                type="text"
                value={volRole}
                onChange={(e) => setVolRole(e.target.value)}
                placeholder="e.g. Crowd Flow Marshall, Gate Access Specialist"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-amber-500 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              Define Responsibilities & Operational Directives *
            </label>
            <textarea
              rows={3}
              value={volResponsibilities}
              onChange={(e) => setVolResponsibilities(e.target.value)}
              placeholder="State clear, actionable duties (e.g. Monitor main concourse entry gates, enforce bag check protocols, direct overflow to standby lane, and report choke points via squad radio)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-amber-500 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Shift Schedule</label>
              <input
                type="text"
                value={volShiftSchedule}
                onChange={(e) => setVolShiftSchedule(e.target.value)}
                placeholder="e.g. 08:00 - 16:00 (Morning Shift)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Skills / Badges (Comma-separated)</label>
              <input
                type="text"
                value={volSkills}
                onChange={(e) => setVolSkills(e.target.value)}
                placeholder="Crowd Control, Radio Ops, CPR First Aid"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              Initial Direct Task (Auto-dispatch to Task Board)
            </label>
            <input
              type="text"
              value={volInitialTask}
              onChange={(e) => setVolInitialTask(e.target.value)}
              placeholder="e.g. Conduct morning checkpoint radio test & inspect turnstile stanchions"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              An invitation token and personalized onboarding link will be generated. The volunteer can use this link to create their password and access their dedicated volunteer dashboard.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setInviteVolModalOpen(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="text-xs font-mono font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400"
            >
              Send Invitation & Generate Link
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: INVITATION DISPATCHED CONFIRMATION */}
      <Modal
        isOpen={inviteSuccessModalOpen}
        onClose={() => setInviteSuccessModalOpen(false)}
        title="Volunteer Invitation Dispatched!"
        subtitle="Invitation token generated and added to event workforce roster"
        icon={CheckCircle2}
        size="md"
      >
        <div className="space-y-4 font-sans text-xs">
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
              <Check className="w-4 h-4" />
              <span>Invitation Registered for {invitedVolSummary?.name}</span>
            </div>
            <p className="text-slate-300 text-xs">
              Role: <strong className="text-white">{invitedVolSummary?.role}</strong> • Squad: <strong className="text-emerald-300">{invitedVolSummary?.teamName}</strong>
            </p>
            <p className="text-slate-400 text-[11px] font-mono">
              Target Email: {invitedVolSummary?.email}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-300">
              Personalized Volunteer Invitation Link:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedInviteLink}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-xs select-all"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(generatedInviteLink);
                  showToast("Link Copied", "Volunteer invitation link copied to clipboard!", "success");
                }}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <p>Token ID: <span className="text-cyan-400">{invitedVolSummary?.inviteToken}</span></p>
            <p>Assigned Event: <span className="text-slate-200">{invitedVolSummary?.eventName}</span></p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t border-slate-800">
            <a
              href={generatedInviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Simulate Volunteer Opening Link</span>
            </a>
            <Button
              type="button"
              variant="primary"
              onClick={() => setInviteSuccessModalOpen(false)}
              className="text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500"
            >
              Done & Return to Roster
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL: EDIT DUTIES & SQUAD REASSIGNMENT */}
      <Modal
        isOpen={editVolModalOpen}
        onClose={() => setEditVolModalOpen(false)}
        title="Edit Volunteer Duties & Responsibilities"
        subtitle={`Update tactical deployment and responsibilities for ${selectedVolunteer?.name}`}
        icon={FileText}
        size="md"
      >
        <form onSubmit={handleUpdateVolunteerDuties} className="space-y-4 font-sans text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono space-y-1">
            <div className="text-slate-400">Personnel: <strong className="text-white">{selectedVolunteer?.name}</strong></div>
            <div className="text-slate-400">Email: <span className="text-slate-300">{selectedVolunteer?.email}</span></div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">Target Squad *</label>
            <select
              value={assignedTeamId}
              onChange={(e) => setAssignedTeamId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500 text-xs cursor-pointer"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name} (Lead: {t.lead})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">Role Title</label>
            <input
              type="text"
              value={assignedRoleTitle}
              onChange={(e) => setAssignedRoleTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">Defined Responsibilities</label>
            <textarea
              rows={3}
              value={editVolResponsibilities}
              onChange={(e) => setEditVolResponsibilities(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">Shift Schedule</label>
            <input
              type="text"
              value={editVolShift}
              onChange={(e) => setEditVolShift(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditVolModalOpen(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500"
            >
              Save Responsibilities & Squad
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
