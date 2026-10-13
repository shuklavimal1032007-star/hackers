import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  ShieldAlert,
  AlertOctagon,
  Sparkles,
  Users,
  ScrollText,
  Bell,
  Settings,
  ChevronRight,
  Radio,
  Zap,
  Bus,
  Ticket,
  MessageSquare,
  Package,
  Briefcase,
  Home
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ isOpen, onClose, onOpenSurgeModal }) {
  const { 
    incidents, 
    recommendations, 
    volunteers, 
    notifications, 
    busRequests, 
    supportTickets,
    resourceRequests,
    tasks,
    currentRole,
    setCurrentRole,
    showToast
  } = useApp();

  const openCriticalIncidentsCount = incidents.filter(i => i.status !== 'Resolved' && i.severity === 'Critical').length;
  const pendingRecommendationsCount = recommendations.filter(r => r.status === 'Pending').length;
  const activeVolunteersCount = volunteers.filter(v => v.status === 'Active').length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const pendingBusRequestsCount = busRequests.filter(r => r.status === 'Pending').length;
  const openTicketsCount = (supportTickets || []).filter(t => t.status === 'Open').length;
  const pendingResourceRequestsCount = (resourceRequests || []).filter(r => r.status === 'Pending').length;
  const openTasksCount = (tasks || []).filter(t => t.status !== 'Completed').length;

  // Role-Specific Navigation items
  let navItems = [];

  if (currentRole === 'organiser') {
    navItems = [
      {
        to: '/organiser-dashboard',
        name: 'Organiser Command',
        icon: LayoutDashboard,
        badge: {
          text: 'Director',
          color: 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
        }
      },
      {
        to: '/events',
        name: 'Events Management',
        icon: CalendarDays,
        badge: null
      },
      {
        to: '/volunteers',
        name: 'Teams & Volunteers',
        icon: Users,
        badge: {
          text: `${activeVolunteersCount} Active`,
          color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
        }
      },
      {
        to: '/resource-requests',
        name: 'Resource Requests',
        icon: Package,
        badge: pendingResourceRequestsCount > 0 ? {
          text: `${pendingResourceRequestsCount} Req`,
          color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
        } : null
      },
      {
        to: '/support-tickets',
        name: 'Attendee Support Chat',
        icon: MessageSquare,
        badge: openTicketsCount > 0 ? {
          text: `${openTicketsCount} Open`,
          color: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
        } : null
      },
      {
        to: '/bus-fleet',
        name: 'Transit Fleet & Shuttles',
        icon: Bus,
        badge: pendingBusRequestsCount > 0 ? {
          text: `${pendingBusRequestsCount} Alert`,
          color: 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
        } : null
      },
      {
        to: '/home',
        name: 'Public Homepage',
        icon: Home,
        badge: null
      }
    ];
  } else if (currentRole === 'volunteer') {
    navItems = [
      {
        to: '/volunteer-portal',
        name: 'Field Checkpoint Terminal',
        icon: Radio,
        badge: {
          text: 'Assigned',
          color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
        }
      },
      {
        to: '/bus-fleet',
        name: 'Bus Fleet Operations',
        icon: Bus,
        badge: pendingBusRequestsCount > 0 ? {
          text: `${pendingBusRequestsCount} Alert`,
          color: 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
        } : null
      },
      {
        to: '/events',
        name: 'Events Schedule',
        icon: CalendarDays,
        badge: null
      },
      {
        to: '/incidents',
        name: 'Incidents & Alerts',
        icon: AlertOctagon,
        badge: null
      },
      {
        to: '/resource-requests',
        name: 'Field Resources Desk',
        icon: Package,
        badge: pendingResourceRequestsCount > 0 ? {
          text: `${pendingResourceRequestsCount} Active`,
          color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
        } : null
      },
      {
        to: '/notifications',
        name: 'Alert Stream',
        icon: Bell,
        badge: unreadNotificationsCount > 0 ? {
          text: unreadNotificationsCount,
          color: 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
        } : null
      }
    ];
  } else if (currentRole === 'participant') {
    navItems = [
      {
        to: '/participant-portal',
        name: 'My Pass & Bus Tracker',
        icon: Ticket,
        badge: {
          text: 'Pass Active',
          color: 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
        }
      },
      {
        to: '/support-tickets',
        name: 'Support & Live Chat',
        icon: MessageSquare,
        badge: openTicketsCount > 0 ? {
          text: `${openTicketsCount} Open`,
          color: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
        } : null
      },
      {
        to: '/events',
        name: 'Events Schedule',
        icon: CalendarDays,
        badge: null
      },
      {
        to: '/venues',
        name: 'Venues & Wayfinding',
        icon: Building2,
        badge: null
      }
    ];
  } else {
    // Admin (Full Command Ops)
    navItems = [
      {
        to: '/admin-dashboard',
        name: 'Command Dashboard',
        icon: LayoutDashboard,
        badge: null
      },
      {
        to: '/support-tickets',
        name: 'Support Tickets',
        icon: MessageSquare,
        badge: openTicketsCount > 0 ? {
          text: `${openTicketsCount} Open`,
          color: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
        } : null
      },
      {
        to: '/resource-requests',
        name: 'Resource Requests',
        icon: Package,
        badge: pendingResourceRequestsCount > 0 ? {
          text: `${pendingResourceRequestsCount} Req`,
          color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
        } : null
      },
      {
        to: '/bus-fleet',
        name: 'Bus Fleet & Transit',
        icon: Bus,
        badge: pendingBusRequestsCount > 0 ? {
          text: `${pendingBusRequestsCount} Alert`,
          color: 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
        } : null
      },
      {
        to: '/events',
        name: 'Events Schedule',
        icon: CalendarDays,
        badge: null
      },
      {
        to: '/venues',
        name: 'Venue Monitoring',
        icon: Building2,
        badge: null
      },
      {
        to: '/risk-intelligence',
        name: 'Risk Intelligence',
        icon: ShieldAlert,
        badge: null
      },
      {
        to: '/incidents',
        name: 'Incidents & Alerts',
        icon: AlertOctagon,
        badge: openCriticalIncidentsCount > 0 ? {
          text: openCriticalIncidentsCount,
          color: 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
        } : null
      },
      {
        to: '/recommendations',
        name: 'AI Directives & Actions',
        icon: Sparkles,
        badge: pendingRecommendationsCount > 0 ? {
          text: pendingRecommendationsCount,
          color: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
        } : null
      },
      {
        to: '/volunteers',
        name: 'Volunteer Dispatch',
        icon: Users,
        badge: {
          text: activeVolunteersCount,
          color: 'bg-slate-800 text-slate-300 border border-slate-700'
        }
      },
      {
        to: '/audit-logs',
        name: 'Audit Trail',
        icon: ScrollText,
        badge: null
      },
      {
        to: '/notifications',
        name: 'Notifications',
        icon: Bell,
        badge: unreadNotificationsCount > 0 ? {
          text: unreadNotificationsCount,
          color: 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
        } : null
      },
      {
        to: '/settings',
        name: 'Settings & Profiling',
        icon: Settings,
        badge: null
      },
      {
        to: '/organiser-dashboard',
        name: 'Organiser Portal',
        icon: Briefcase,
        badge: null
      },
      {
        to: '/home',
        name: 'Public Homepage',
        icon: Home,
        badge: null
      }
    ];
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-[#0a0f1d] border-r border-slate-800/90 flex flex-col transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Mobile Header Inside Sidebar */}
        <div className="lg:hidden p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <span className="font-mono font-bold text-white tracking-wider">AEGIS COMMAND</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Section title */}
        <div className="px-5 pt-5 pb-1 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
          {currentRole === 'organiser'
            ? 'Event Director Console'
            : currentRole === 'volunteer'
            ? 'Volunteer Operations'
            : currentRole === 'participant'
            ? 'Attendee Directory'
            : 'Operational Navigation'}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `
                  group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/60 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-950/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                      <span className="tracking-wide">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.badge.color}`}>
                          {item.badge.text}
                        </span>
                      )}
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom System Health Box (Admin / Staff Only) */}
        {currentRole !== 'participant' && (
          <div className="p-3.5 m-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400">
            <div className="flex items-center justify-between text-[11px] font-mono mb-2">
              <span className="text-slate-400">SIMULATION ENGINE</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>

            <div className="space-y-1 text-[10px] font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Telemetry Feed:</span>
                <span className="text-slate-300">Active (100 Hz)</span>
              </div>
              <div className="flex justify-between">
                <span>Sensor Latency:</span>
                <span className="text-slate-300">14 ms (nominal)</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose?.();
                onOpenSurgeModal?.();
              }}
              className="w-full mt-3 py-1.5 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Surge Event</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
