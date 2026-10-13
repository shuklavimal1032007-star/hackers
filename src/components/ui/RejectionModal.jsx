import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { ShieldAlert } from 'lucide-react';

const PRESET_REASONS = [
  "Local fire marshal constraint / egress compliance conflict",
  "Insufficient staff available in requested sector",
  "Secondary transit route is also experiencing high density",
  "Operational preference: Manual attendee monitoring preferred",
  "Event sponsor / VIP movement restriction in effect"
];

export default function RejectionModal({
  isOpen,
  onClose,
  onConfirm,
  recommendationTitle = "",
  loading = false
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide or select a rejection rationale before proceeding.");
      return;
    }
    setError("");
    onConfirm(reason.trim());
    setReason("");
  };

  const handleClose = () => {
    setError("");
    setReason("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reject AI Recommendation"
      subtitle="Operational feedback is logged in the audit trail for AI calibration"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold block text-amber-200 mb-0.5">Mandatory Rationale Requirement</span>
            You are overriding recommendation: <span className="font-semibold text-white">"{recommendationTitle}"</span>. 
            All overrides require an operational justification for hackathon audit review.
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Quick Rationale Presets
          </label>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {PRESET_REASONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setReason(preset);
                  setError("");
                }}
                className={`text-[11px] text-left px-2.5 py-1.5 rounded-lg border transition-all ${
                  reason === preset 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Operational Justification (Required)
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            placeholder="Describe tactical operational reasoning for rejecting this automated recommendation..."
            className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 transition-all ${
              error ? 'border-rose-500 ring-rose-500' : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500'
            }`}
          />
          {error && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            loading={loading}
          >
            Confirm Rejection
          </Button>
        </div>
      </div>
    </Modal>
  );
}
