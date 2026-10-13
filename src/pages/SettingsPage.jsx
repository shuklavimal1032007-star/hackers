import React, { useState } from 'react';
import {
  Settings,
  User,
  Sliders,
  Bell,
  RotateCcw,
  Shield,
  Save,
  Server,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConfirmationModal from '../components/ui/ConfirmationModal';

export default function SettingsPage() {
  const { settings, updateSettings, resetDemoData } = useApp();

  const [formData, setFormData] = useState({ ...settings });
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setResetModalOpen(false);
    setFormData({ ...settings });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">System Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            COMMAND SETTINGS & OPERATOR PROFILE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configure telemetry intervals, audible alert limits, Spring Boot API bindings, and restore demo presets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="danger"
            icon={RotateCcw}
            onClick={() => setResetModalOpen(true)}
            className="text-xs font-mono"
          >
            Reset Demo Data
          </Button>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Operator Profile Section */}
        <Card
          title="Incident Commander Profile"
          subtitle="Identity credentials attached to all automated AI decisions and audit events"
          icon={User}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Operator Full Name
              </label>
              <input
                type="text"
                value={formData.operatorName}
                onChange={e => setFormData({ ...formData, operatorName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Badge / Identification Token
              </label>
              <input
                type="text"
                value={formData.operatorId}
                onChange={e => setFormData({ ...formData, operatorId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono text-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Assigned Operational Role
              </label>
              <input
                type="text"
                value={formData.operatorRole}
                onChange={e => setFormData({ ...formData, operatorRole: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Command Directorate
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              />
            </div>
          </div>
        </Card>

        {/* Dashboard & Telemetry Preferences */}
        <Card
          title="Telemetry & Display Parameters"
          subtitle="Configure refresh cadences and simulated data rates"
          icon={Sliders}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Telemetry Refresh Interval
              </label>
              <select
                value={formData.refreshIntervalSeconds}
                onChange={e => setFormData({ ...formData, refreshIntervalSeconds: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              >
                <option value={5}>5 seconds (High Frequency)</option>
                <option value={15}>15 seconds (Standard)</option>
                <option value={30}>30 seconds (Conserve bandwidth)</option>
                <option value={60}>60 seconds (Slow Polling)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Simulation Engine Speed
              </label>
              <select
                value={formData.demoSimulationSpeed}
                onChange={e => setFormData({ ...formData, demoSimulationSpeed: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              >
                <option value="1x">1x (Real-time speed)</option>
                <option value="2x">2x (Accelerated testing)</option>
                <option value="5x">5x (Hyper-lapse surge)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Layout Density
              </label>
              <select
                value={formData.darkModeDensity}
                onChange={e => setFormData({ ...formData, darkModeDensity: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              >
                <option value="compact">Compact Tactical (High Information Density)</option>
                <option value="comfortable">Comfortable Spacing</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Risk Thresholds & Safety Alarm Limits */}
        <Card
          title="Safety Alarm Escalation Thresholds"
          subtitle="Points at which deterministic warnings transition to critical alarms"
          icon={Bell}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Critical Threat Cutoff Index (0-100)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={formData.riskCriticalThreshold}
                  onChange={e => setFormData({ ...formData, riskCriticalThreshold: Number(e.target.value) })}
                  className="flex-1 accent-rose-500"
                />
                <span className="font-mono text-sm font-bold text-rose-400 w-12 text-right">
                  {formData.riskCriticalThreshold}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Scores at or above this trigger automated incidents and turnstile throttling.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Warning Caution Cutoff Index (0-100)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="25"
                  max="60"
                  value={formData.riskWarningThreshold}
                  onChange={e => setFormData({ ...formData, riskWarningThreshold: Number(e.target.value) })}
                  className="flex-1 accent-amber-500"
                />
                <span className="font-mono text-sm font-bold text-amber-400 w-12 text-right">
                  {formData.riskWarningThreshold}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Scores at or above this generate queue rebalance directives.</p>
            </div>
          </div>
        </Card>

        {/* Future Spring Boot Integration Section */}
        <Card
          title="Future Backend REST API Binding"
          subtitle="Spring Boot 3.x controller connectivity readiness"
          icon={Server}
        >
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Spring Boot API Base URL
              </label>
              <input
                type="text"
                value={formData.springBootApiBaseUrl}
                onChange={e => setFormData({ ...formData, springBootApiBaseUrl: e.target.value })}
                placeholder="http://localhost:8080/api/v1"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono text-cyan-400"
              />
            </div>
            <p className="text-xs text-slate-400">
              When the Java Spring Boot backend is running, toggle <code className="text-cyan-300">USE_REMOTE_BACKEND = true</code> in <code className="text-cyan-300">src/services/api.js</code> to stream from real Spring Boot JPA entities.
            </p>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            variant="danger"
            icon={RotateCcw}
            onClick={() => setResetModalOpen(true)}
            className="text-xs font-mono"
          >
            Reset All Demo Data
          </Button>

          <Button
            type="submit"
            variant="primary"
            icon={Save}
            className="font-mono text-xs"
          >
            Save Configuration Changes
          </Button>
        </div>
      </form>

      {/* RESET CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Demo Data"
        message="This will clear all simulated crowd surges, newly created events, approved recommendations, and custom volunteer assignments, restoring the pristine demo scenario. Proceed?"
        confirmText="Confirm Reset"
        variant="danger"
        iconType="warning"
      />
    </div>
  );
}
