import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Filter,
  ArrowRight,
  Clock,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications
  } = useApp();

  const [filterRead, setFilterRead] = useState('All'); // 'All' | 'Unread' | 'Read'
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifs = notifications.filter(n => {
    if (filterRead === 'Unread') return !n.read;
    if (filterRead === 'Read') return n.read;
    return true;
  });

  const getIcon = (category, severity) => {
    if (severity === 'Critical') return <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />;
    if (severity === 'Warning') return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
    if (category?.includes('AI')) return <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />;
    return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
  };

  const handleNotificationClick = (n) => {
    markNotificationAsRead(n.id);
    if (n.link) {
      navigate(n.link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Priority Event Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            NOTIFICATIONS & DISPATCH ALERTS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Operational queue alerts, high-risk threshold alarms, and automated recommendation notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={CheckCircle2}
              onClick={markAllNotificationsAsRead}
              className="font-mono text-xs"
            >
              Mark All Read
            </Button>
          )}

          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={clearAllNotifications}
              className="text-xs text-slate-400 hover:text-rose-400"
            >
              Clear Tray
            </Button>
          )}
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-400">View:</span>
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {['All', 'Unread', 'Read'].map(st => (
              <button
                key={st}
                onClick={() => setFilterRead(st)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterRead === st ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st} {st === 'Unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500">
          {notifications.length} Total Alerts in Buffer
        </span>
      </div>

      {/* Notification Stream */}
      {filteredNotifs.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0c1322] border border-slate-800">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">All notifications cleared</h4>
          <p className="text-xs text-slate-500 mt-1">No pending unread alerts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifs.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                !notif.read
                  ? 'bg-[#0e172a] border-cyan-500/40 hover:border-cyan-400 shadow-lg shadow-cyan-950/20'
                  : 'bg-[#0c1322] border-slate-800/80 hover:border-slate-700 opacity-80'
              }`}
            >
              {/* Icon */}
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 mt-0.5">
                {getIcon(notif.category, notif.severity)}
              </div>

              {/* Text & Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white tracking-wide">
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                    )}
                    <Badge variant={notif.severity} size="sm">
                      {notif.category || notif.severity}
                    </Badge>
                  </div>

                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {notif.timestamp ? new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {notif.message}
                </p>

                {notif.link && (
                  <div className="mt-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-semibold">
                    <span>Jump to related operational view</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
