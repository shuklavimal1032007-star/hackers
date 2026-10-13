import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  Filter,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import RejectionModal from '../components/ui/RejectionModal';

export default function AiRecommendationsPage() {
  const { recommendations, approveRecommendation, rejectRecommendation } = useApp();

  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRec, setSelectedRec] = useState(null);
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];

  const filteredRecs = recommendations.filter(rec => {
    if (statusFilter === 'All') return true;
    return rec.status === statusFilter;
  });

  const handleOpenApprove = (rec) => {
    setSelectedRec(rec);
    setConfirmApproveOpen(true);
  };

  const handleOpenReject = (rec) => {
    setSelectedRec(rec);
    setRejectModalOpen(true);
  };

  const handleConfirmApproval = () => {
    if (selectedRec) {
      approveRecommendation(selectedRec.id, "Authorized by Command Operator");
      setConfirmApproveOpen(false);
    }
  };

  const handleConfirmRejection = (reason) => {
    if (selectedRec) {
      rejectRecommendation(selectedRec.id, reason);
      setRejectModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Autonomous Safety Directives</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            AI RECOMMENDATIONS & MITIGATION
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Agentic multi-variable optimization proposing dynamic gate rerouting, volunteer deployment, and egress adjustments.
          </p>
        </div>

        <Badge variant="demo" size="md">
          SIMULATED AI DIRECTIVES (HUMAN-IN-THE-LOOP)
        </Badge>
      </div>

      {/* Advisory Banner */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-slate-300 flex items-start gap-3">
        <BrainCircuit className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-cyan-300 block mb-0.5">Operational Safety Protocol (Level 4 Governance)</span>
          Every automated directive requires explicit human confirmation before dispatch. Rejections require documented operational rationale to continuously fine-tune predictive neural models.
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-400">Filter Status:</span>
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {statuses.map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  statusFilter === st ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500">
          Showing {filteredRecs.length} Directives
        </span>
      </div>

      {/* Recommendations Cards */}
      {filteredRecs.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0c1322] border border-slate-800">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">No recommendations matching current filter</h4>
          <p className="text-xs text-slate-500 mt-1">All venue flows currently balanced.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecs.map(rec => {
            const isPending = rec.status === 'Pending';
            const isApproved = rec.status === 'Approved';
            const isRejected = rec.status === 'Rejected';

            return (
              <div
                key={rec.id}
                className={`p-5 rounded-xl bg-[#0c1322] border transition-all ${
                  isPending ? 'border-cyan-500/40 glow-cyan' :
                  isApproved ? 'border-emerald-500/40' : 'border-slate-800 opacity-80'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {rec.id}
                    </span>
                    <Badge variant={rec.priority === 'High' ? 'danger' : 'warning'} size="sm">
                      {rec.priority} Priority
                    </Badge>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                      Confidence: {rec.confidenceScore}%
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Sector: <strong className="text-white">{rec.venueName}</strong>
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {isPending && (
                      <Badge variant="warning" dot size="sm">
                        Awaiting Authorization
                      </Badge>
                    )}
                    {isApproved && (
                      <Badge variant="normal" dot size="sm">
                        Approved & Executed
                      </Badge>
                    )}
                    {isRejected && (
                      <Badge variant="critical" size="sm">
                        Rejected by Operator
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Title & Rationale */}
                <div className="my-4 space-y-2">
                  <h3 className="text-lg font-semibold text-white tracking-wide">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {rec.rationale}
                  </p>
                </div>

                {/* Evidence & Projected Impact Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs font-mono">
                  {/* Supporting Evidence */}
                  <div>
                    <h4 className="text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                      Supporting Sensor Telemetry
                    </h4>
                    <ul className="space-y-1.5 text-slate-300">
                      {rec.evidence?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Projected Impact & Actions */}
                  <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                    <h4 className="text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Projected Flow Impact
                    </h4>
                    <p className="text-emerald-300 font-semibold mb-3">
                      {rec.impact}
                    </p>

                    {rec.actionsToExecute && (
                      <div>
                        <span className="text-[11px] text-slate-500 uppercase block mb-1">Actions To Dispatch:</span>
                        <ul className="space-y-1 text-slate-400 text-[11px]">
                          {rec.actionsToExecute.map((act, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rejection reason display if rejected */}
                {isRejected && rec.rejectionReason && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300 mb-4">
                    <strong>Logged Operator Rejection Justification:</strong> "{rec.rejectionReason}"
                  </div>
                )}

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">
                    {rec.decidedAt ? `Decided at ${new Date(rec.decidedAt).toLocaleTimeString()}` : 'Decision pending operator action'}
                  </span>

                  <div className="flex items-center gap-3">
                    {isPending ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={X}
                          onClick={() => handleOpenReject(rec)}
                          className="hover:border-rose-500/50 hover:text-rose-400 font-mono text-xs"
                        >
                          Reject Directive...
                        </Button>

                        <Button
                          variant="success"
                          size="sm"
                          icon={Check}
                          onClick={() => handleOpenApprove(rec)}
                          className="font-mono text-xs"
                        >
                          Approve & Execute Directive
                        </Button>
                      </>
                    ) : (
                      <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                        {isApproved ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-4 h-4" /> Directive Activated
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1 font-semibold">
                            <XCircle className="w-4 h-4" /> Directive Overridden
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* APPROVAL CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={confirmApproveOpen}
        onClose={() => setConfirmApproveOpen(false)}
        onConfirm={handleConfirmApproval}
        title="Authorize AI Safety Directive"
        message={selectedRec ? `Are you sure you want to approve directive "${selectedRec.title}"? This will immediately apply crowd diversion flows and dispatch field volunteers.` : ''}
        confirmText="Confirm & Dispatch Action"
        variant="success"
        iconType="question"
      />

      {/* REJECTION REASON MODAL */}
      <RejectionModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleConfirmRejection}
        recommendationTitle={selectedRec?.title || ''}
      />
    </div>
  );
}
