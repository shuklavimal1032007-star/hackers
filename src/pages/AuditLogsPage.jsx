import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Copy,
  Check,
  Download,
  Clock,
  Shield,
  Activity,
  UserCheck,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function AuditLogsPage() {
  const { auditLogs, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['All', 'Incident Detection', 'AI Governance', 'Staff Deployment', 'Simulation Engine', 'Incident Management', 'Security', 'Event Schedule'];
  const severities = ['All', 'Critical', 'Warning', 'Success', 'Info'];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.actionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = categoryFilter === 'All' || log.category === categoryFilter;
    const matchesSev = severityFilter === 'All' || log.severity === severityFilter;

    return matchesSearch && matchesCat && matchesSev;
  });

  const handleCopyLog = (log) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopiedId(log.id);
    showToast("Audit Copied", `Log entry ${log.id} copied to clipboard.`, "info");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aegis_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Export Ready", "Audit trail downloaded as JSON.", "success");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Immutable Decision Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            COMMAND AUDIT TRAIL
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Cryptographically timestamped log of AI directives, operator overrides, surge triggers, and volunteer reallocations.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={handleExportJSON}
          className="font-mono text-xs"
        >
          Export Audit Trail JSON
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
            placeholder="Search audit trail by actor, action type, or keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

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
            <span className="text-xs text-slate-400 font-mono">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-cyan-500"
            >
              {severities.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table / Timeline */}
      <Card
        title="Audit Trail Records"
        subtitle={`Displaying ${filteredLogs.length} verified operations`}
        icon={ScrollText}
      >
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No audit records matching the specified criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredLogs.map(log => {
              const date = new Date(log.timestamp);
              const formattedDate = date.toLocaleDateString();
              const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

              return (
                <div
                  key={log.id}
                  className="py-4 first:pt-0 last:pb-0 hover:bg-slate-900/30 px-2 rounded-lg transition-colors flex flex-col md:flex-row md:items-start justify-between gap-3"
                >
                  {/* Left: Timestamp & Action */}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {log.actionType}
                      </span>
                      <Badge variant={log.severity === 'Critical' ? 'critical' : log.severity === 'Warning' ? 'warning' : log.severity === 'Success' ? 'normal' : 'default'} size="sm">
                        {log.severity}
                      </Badge>
                      <span className="text-xs font-mono text-cyan-400">
                        {log.category}
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed pt-1">
                      {log.details}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
                      <span>Actor: <strong className="text-slate-300">{log.actor}</strong></span>
                      <span>IP / Origin: {log.ipAddress || 'Internal'}</span>
                    </div>
                  </div>

                  {/* Right: Timestamp & Copy JSON */}
                  <div className="flex items-center md:flex-col md:items-end justify-between md:justify-start gap-2 shrink-0 pt-2 md:pt-0">
                    <div className="text-right font-mono text-xs text-slate-400">
                      <div>{formattedTime}</div>
                      <div className="text-[10px] text-slate-500">{formattedDate}</div>
                    </div>

                    <button
                      onClick={() => handleCopyLog(log)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Copy Entry JSON"
                    >
                      {copiedId === log.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
