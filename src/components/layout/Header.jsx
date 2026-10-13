import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Bell, 
  Zap, 
  Menu, 
  Clock, 
  Radio, 
  ChevronDown, 
  User, 
  Ticket,
  Bus,
  Headphones,
  HelpCircle,
  Briefcase,
  Home
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import ContactUsModal from '../support/ContactUsModal';

export default function Header({ onToggleSidebar, onOpenSurgeModal }) {
  const { 
    overallRisk, 
    notifications, 
    settings, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    currentRole,
    setCurrentRole,
    busRequests,
    volunteers,
    activeVolunteerId,
    participants,
    activeParticipantId,
    organisers,
    activeOrganiserId,
    showToast
  } = useApp();

  const [timeStr, setTimeStr] = useState('');
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const navigate = useNavigate();

  const activeVolunteer = volunteers.find(v => v.id === activeVolunteerId) || volunteers[0];
  const activeParticipant = participants.find(p => p.id === activeParticipantId) || participants[0];
  const activeOrganiser = (organisers && organisers.find(o => o.id === activeOrganiserId)) || (organisers && organisers[0]) || { name: 'Sarah Jenkins', organisation: 'Event Operations' };
  const pendingBusRequestsCount = busRequests.filter(r => r.status === 'Pending').length;

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadNotifs = notifications.filter(n => !n.read);

  const getRiskColor = (level) => {
    if (level === 'Critical') return 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_12px_#f43f5e]';
    if (level === 'Warning') return 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_12px_#f59e0b]';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_#10b981]';
  };

  const handleSelectRole = (newRole) => {
    setCurrentRole(newRole);
    setRoleDropdownOpen(false);
    if (newRole === 'organiser') {
      navigate('/organiser-dashboard');
      showToast("Role Switched", "Active: Organiser Command Dashboard", "info");
    } else if (newRole === 'volunteer') {
      navigate('/volunteer-portal');
      showToast("Role Switched", "Active: Field Volunteer Checkpoint", "info");
    } else if (newRole === 'participant') {
      navigate('/participant-portal');
      showToast("Role Switched", "Active: Event Participant Pass & Transit", "info");
    } else {
      navigate('/admin-dashboard');
      showToast("Role Switched", "Active: Admin Command Centre", "info");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#080e1c]/95 backdrop-blur-md border-b border-slate-800">
      <div className="px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-900/30">
              <div className="w-full h-full bg-[#080e1c] rounded-[10px] flex items-center justify-center">
                <Radio className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wider text-white font-mono">AEGIS<span className="text-cyan-400">.AI</span></span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 hidden sm:inline">
                  COMMAND OPS
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 hidden sm:block">Event Crowd & Spatial Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Center: Live Clock & System Risk Status */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>UTC+5:30</span>
            <span className="font-bold text-white tracking-widest">{timeStr || '12:00:00'}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">COMPLEX RISK:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${getRiskColor(overallRisk.level)}`}>
              {overallRisk.score} / 100 • {overallRisk.level.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Right Side: Bus Fleet Shortcut, Surge, Notifications & SINGLE Role Login Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Bus Fleet Shortcut for Admin */}
          {currentRole === 'admin' && (
            <Link
              to="/bus-fleet"
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 hover:border-cyan-500/50 transition-colors"
            >
              <Bus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bus Fleet</span>
              {pendingBusRequestsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                  {pendingBusRequestsCount}
                </span>
              )}
            </Link>
          )}

          {/* Surge Simulator Quick Trigger (Admin / Organiser Only) */}
          {currentRole !== 'participant' && (
            <Button
              size="sm"
              variant="warning"
              icon={Zap}
              onClick={onOpenSurgeModal}
              className="hidden sm:inline-flex text-xs font-mono shadow-amber-950/50"
            >
              Simulate Surge
            </Button>
          )}

          {/* Public Homepage Link */}
          <Link
            to="/home"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-mono text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
            title="Go to Public Homepage"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline font-semibold">Homepage</span>
          </Link>

          {/* Contact Us / Student Helpdesk Icon Button */}
          <button
            onClick={() => setContactModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              currentRole === 'participant'
                ? 'bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border-purple-500/50 text-purple-200 hover:border-purple-400 shadow-md shadow-purple-950/40'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title="Contact Admin / Student Query Desk"
          >
            <Headphones className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline font-semibold">Contact Us</span>
          </button>

          {/* Notifications Dropdown (Hidden for Participants) */}
          {currentRole !== 'participant' && (
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(prev => !prev)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/90 transition-colors border border-transparent hover:border-slate-700"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-mono font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

            {notifDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setNotifDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#0b1220] border border-slate-700/80 shadow-2xl z-50 overflow-hidden animate-in fade-in duration-150">
                  <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Alert Stream</span>
                      <span className="text-[11px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                        {unreadNotifs.length} unread
                      </span>
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications currently active.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          className={`p-3.5 hover:bg-slate-800/40 transition-colors cursor-pointer ${n.read ? 'opacity-65' : 'bg-cyan-950/15'}`}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.link) {
                              navigate(n.link);
                              setNotifDropdownOpen(false);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />}
                              {n.title}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 shrink-0">
                              {n.timestamp ? new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-900/80 border-t border-slate-800 text-center font-mono">
                    <Link
                      to="/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs font-medium text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5"
                    >
                      View All Notifications & History →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

          {/* SINGLE LOGIN & ROLE SWITCHER ON THE RIGHT */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800 hover:opacity-90 transition-opacity select-none cursor-pointer"
              aria-label="User Account & Role Switcher"
            >
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                currentRole === 'organiser'
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-400'
                  : currentRole === 'volunteer'
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                  : currentRole === 'participant'
                  ? 'bg-purple-950/80 border-purple-500/50 text-purple-400'
                  : 'bg-slate-800 border-slate-700 text-cyan-400'
              }`}>
                {currentRole === 'organiser' ? (
                  <Briefcase className="w-4 h-4" />
                ) : currentRole === 'volunteer' ? (
                  <Radio className="w-4 h-4" />
                ) : currentRole === 'participant' ? (
                  <Ticket className="w-4 h-4" />
                ) : (
                  <ShieldAlert className="w-4 h-4" />
                )}
              </div>

              <div className="text-left font-mono">
                <div className="text-xs font-semibold text-slate-200 leading-tight flex items-center gap-1">
                  <span>
                    {currentRole === 'organiser'
                      ? activeOrganiser.name.split(' ')[0]
                      : currentRole === 'volunteer'
                      ? activeVolunteer.name.split(' ')[0]
                      : currentRole === 'participant'
                      ? activeParticipant.name.split(' ')[0]
                      : settings.operatorName.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${
                  currentRole === 'organiser' ? 'text-amber-400' :
                  currentRole === 'volunteer' ? 'text-emerald-400' :
                  currentRole === 'participant' ? 'text-purple-400' : 'text-cyan-400'
                }`}>
                  {currentRole === 'organiser' ? 'Organiser' : currentRole === 'volunteer' ? 'Volunteer' : currentRole === 'participant' ? 'Participant' : 'Admin'}
                </div>
              </div>
            </button>

            {/* Dropdown Menu directly under Right Login Button */}
            {roleDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setRoleDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl bg-[#0a1020] border border-slate-700 shadow-2xl z-50 overflow-hidden font-mono text-xs animate-in fade-in duration-100">
                  <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">SWITCH ROLE / LOGIN</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                      Active: {currentRole.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-1.5 space-y-1 font-sans">
                    {/* Organiser */}
                    <button
                      onClick={() => handleSelectRole('organiser')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        currentRole === 'organiser' 
                          ? 'bg-amber-950/70 border border-amber-500/40 text-amber-200 font-bold' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 font-mono">
                        <div className="flex items-center justify-between text-xs">
                          <span>Organiser (Event Director)</span>
                          {currentRole === 'organiser' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-normal">Events, teams, tasks & volunteer roster</span>
                      </div>
                    </button>

                    {/* Admin */}
                    <button
                      onClick={() => handleSelectRole('admin')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        currentRole === 'admin' 
                          ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 font-bold' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 font-mono">
                        <div className="flex items-center justify-between text-xs">
                          <span>Admin (Command Ops)</span>
                          {currentRole === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-normal">Command dashboard & bus dispatch</span>
                      </div>
                    </button>

                    {/* Volunteer */}
                    <button
                      onClick={() => handleSelectRole('volunteer')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        currentRole === 'volunteer' 
                          ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 font-bold' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Radio className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 font-mono">
                        <div className="flex items-center justify-between text-xs">
                          <span>Volunteer (Field Ops)</span>
                          {currentRole === 'volunteer' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-normal">Bus checkpoint & report full</span>
                      </div>
                    </button>

                    {/* Participant */}
                    <button
                      onClick={() => handleSelectRole('participant')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        currentRole === 'participant' 
                          ? 'bg-purple-950/70 border border-purple-500/40 text-purple-200 font-bold' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                        <Ticket className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 font-mono">
                        <div className="flex items-center justify-between text-xs">
                          <span>Participant (Attendee)</span>
                          {currentRole === 'participant' && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-normal">Event pass & bus arrivals</span>
                      </div>
                    </button>
                  </div>

                  <div className="p-2 bg-slate-900 border-t border-slate-800 text-center font-mono">
                    <Link
                      to="/home"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-semibold"
                    >
                      <Home className="w-3 h-3" />
                      Visit Public Homepage →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Student Contact Us / Query Desk Modal */}
      <ContactUsModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </header>
  );
}
