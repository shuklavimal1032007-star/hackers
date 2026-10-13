import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Radio,
  Shield,
  ShieldAlert,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Building,
  User,
  Sparkles,
  Zap,
  Activity,
  Bus,
  MessageSquare,
  Package,
  TrendingUp,
  Cpu,
  ChevronRight,
  Check,
  Eye,
  EyeOff,
  Ticket,
  HelpCircle,
  Clock,
  Briefcase,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function LandingHomePage() {
  const {
    currentRole,
    setCurrentRole,
    organisers,
    events,
    volunteers,
    buses,
    overallRisk,
    tasks,
    registerOrganiser,
    loginOrganiser,
    showToast
  } = useApp();

  const navigate = useNavigate();

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('sarah.organiser@aegis.ai');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState('Lead Event Operations Director');
  const [regScope, setRegScope] = useState('Conference & Summit');
  const [regPassword, setRegPassword] = useState('');

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    loginOrganiser(loginEmail.trim());
    setAuthModalOpen(false);
    navigate('/organiser-dashboard');
  };

  // Handle Register
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    registerOrganiser({
      name: regName.trim(),
      email: regEmail.trim(),
      organisation: regOrg.trim() || 'Independent Organization',
      phone: regPhone.trim(),
      roleTitle: regRole,
      scope: regScope
    });

    setAuthModalOpen(false);
    navigate('/organiser-dashboard');
  };

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleQuickDemoFill = (org) => {
    setLoginEmail(org.email);
    setLoginPassword('password123');
  };

  const activeVolunteersCount = volunteers.filter(v => v.status === 'Active').length;
  const totalAttendees = events.reduce((acc, curr) => acc + (curr.registeredAttendees || 0), 0);
  const completedTasksCount = (tasks || []).filter(t => t.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
      </div>

      {/* TOP NAVIGATION HEADER */}
      <header className="relative z-30 border-b border-slate-800/80 bg-[#080e1c]/90 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-950/40">
              <div className="w-full h-full bg-[#080e1c] rounded-[10px] flex items-center justify-center">
                <Radio className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-wider text-white font-mono">
                  AEGIS<span className="text-cyan-400">.AI</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  COMMAND PLATFORM
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
                AI Event Operations & Spatial Crowd Intelligence
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#organiser-tools" className="hover:text-cyan-400 transition-colors">Organiser Suite</a>
            <a href="#roles" className="hover:text-cyan-400 transition-colors">Role Matrix</a>
            <a href="#telemetry" className="hover:text-cyan-400 transition-colors">Live Telemetry</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Organiser Login CTA */}
            <button
              onClick={() => handleOpenAuth('login')}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-slate-200 border border-slate-700 bg-slate-900/80 hover:bg-slate-800 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400" />
              <span>Organiser Login</span>
            </button>

            {/* Organiser Register CTA */}
            <button
              onClick={() => handleOpenAuth('register')}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-md shadow-amber-950/40 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Organiser</span>
            </button>

            {/* Admin Command Centre Quick Button */}
            <Link
              to="/"
              onClick={() => setCurrentRole('admin')}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/50 transition-all"
              title="Superuser Admin Platform with risk models & AI directives"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Live System Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">
              NEXT-GEN EVENT NERVOUS SYSTEM • <strong>VERSION 2.4 LIVE</strong>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              AI ENGINE READY
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Orchestrate High-Impact Events with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              Real-Time AI Command
            </span>{' '}
            & Spatial Intelligence
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            From multi-venue crowd dynamics and volunteer task dispatch to automated bus fleet pickups and student chat triage. 
            Empower <strong className="text-white">Organisers</strong> with tactical control and provide <strong className="text-white">Admins</strong> with total platform governance.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            {/* Primary: Organiser Console */}
            <button
              onClick={() => handleOpenAuth('login')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-mono font-bold text-sm shadow-xl shadow-amber-950/50 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/40"
            >
              <Briefcase className="w-4 h-4" />
              <span>Launch Organiser Console</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* Secondary: Admin Dashboard */}
            <Link
              to="/"
              onClick={() => {
                setCurrentRole('admin');
                showToast("Admin Console", "Accessing full platform management features", "info");
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-cyan-500/50 font-mono font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/40"
            >
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Admin Platform (Full Features)</span>
            </Link>

            {/* Tertiary: Register Organiser */}
            <button
              onClick={() => handleOpenAuth('register')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 hover:text-white hover:bg-cyan-900/40 font-mono text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>Register New Organiser</span>
            </button>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Zero installation required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Instant demo role switching
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Dedicated Organiser & Admin segregation
            </span>
          </div>
        </div>

        {/* HERO INTERACTIVE SHOWCASE CARD */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-slate-800/80 via-[#0a1020] to-[#070b16] border border-slate-700/80 shadow-2xl p-5 sm:p-7 relative overflow-hidden backdrop-blur-xl">
          {/* Top telemetry bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-white font-bold tracking-wide">LIVE EVENT COMMAND TELEMETRY</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-400">GLOBAL AI HACKATHON 2026</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>Telemetry: <strong>100 Hz</strong></span>
              <span>Network: <strong className="text-emerald-400">NOMINAL (14ms)</strong></span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Total Attendees</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">{totalAttendees.toLocaleString()}</div>
              <p className="text-[10px] text-emerald-400 font-mono">↑ 93% Check-in Completion</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Active Volunteers</span>
                <Radio className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-300">{activeVolunteersCount} Active</div>
              <p className="text-[10px] text-slate-400 font-mono">5 Squads on duty</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Platform Risk</span>
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-300">{overallRisk?.score || 38}/100</div>
              <p className="text-[10px] text-slate-400 font-mono">Normal Egress Flow</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Organiser Tasks</span>
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-cyan-300">{(tasks || []).length} Active</div>
              <p className="text-[10px] text-cyan-400 font-mono">{completedTasksCount} Completed Today</p>
            </div>
          </div>

          {/* Quick Launch Switchboard inside Showcase */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Select which dashboard to enter for instant demonstration:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleOpenAuth('login')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors font-bold cursor-pointer"
              >
                Organiser Dashboard →
              </button>
              <Link
                to="/"
                onClick={() => setCurrentRole('admin')}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-colors font-bold"
              >
                Admin Command Dashboard →
              </Link>
              <Link
                to="/volunteer-portal"
                onClick={() => setCurrentRole('volunteer')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
              >
                Volunteer Portal →
              </Link>
              <Link
                to="/participant-portal"
                onClick={() => setCurrentRole('participant')}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition-colors"
              >
                Participant Pass →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ORGANISER SUITE HIGHLIGHTS */}
      <section id="organiser-tools" className="relative z-10 py-20 border-t border-slate-800/80 bg-[#070b16]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              DESIGNED SPECIFICALLY FOR EVENT DIRECTORS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              The Complete Organiser Command Suite
            </h2>
            <p className="text-sm text-slate-400">
              Organisers gain full operational oversight to manage venues, coordinate specialized team squads, assign volunteer duties, and track live milestones in one unified interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Events Management */}
            <div className="p-6 rounded-3xl bg-[#090e1c] border border-slate-800 hover:border-amber-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">1. Event Orchestration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create, schedule, and edit multi-track events. Monitor registered attendees versus real-time gate occupancy and synchronize venue capacity limits dynamically.
              </p>
              <ul className="text-xs font-mono text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Multi-track schedule timeline
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Gate capacity alerts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Instant event creation modal
                </li>
              </ul>
            </div>

            {/* Feature 2: Teams & Workforce */}
            <div className="p-6 rounded-3xl bg-[#090e1c] border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">2. Squad & Team Roster</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Form and mobilize dedicated operational teams: Core Operations, Security & Access, Medical Triage, Shuttle Fleet, and Tech Support Squads with designated leads.
              </p>
              <ul className="text-xs font-mono text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400" /> 5 pre-configured squad templates
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400" /> Volunteer check-in & shift tracker
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400" /> Radio channels & contact directory
                </li>
              </ul>
            </div>

            {/* Feature 3: Tasks & Assignments */}
            <div className="p-6 rounded-3xl bg-[#090e1c] border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">3. Task Board & Assignments</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dispatch urgent directives with priorities (Urgent, High, Medium, Low). Drag or click to advance tasks from To Do to In Progress and Completed with live notifications.
              </p>
              <ul className="text-xs font-mono text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Interactive Kanban status columns
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Real-time assignee notifications
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> 1-Click progress updates
                </li>
              </ul>
            </div>
          </div>

          {/* Organiser CTA strip */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white font-mono">Ready to manage your next event?</h4>
              <p className="text-xs text-slate-300">Login as an existing organiser or register in 30 seconds.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpenAuth('login')}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
              >
                Organiser Login
              </button>
              <button
                onClick={() => handleOpenAuth('register')}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 transition-colors cursor-pointer"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ROLE ARCHITECTURE MATRIX */}
      <section id="roles" className="relative z-10 py-20 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              ROLE SEGREGATION & ACCESS CONTROL
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Separation of Concerns: Admin vs. Organiser
            </h2>
            <p className="text-sm text-slate-400">
              AEGIS AI strictly separates high-level platform administration from front-line event organization, while empowering volunteers and attendees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Admin */}
            <div className="p-6 rounded-3xl bg-[#090e1c] border-2 border-cyan-500/40 relative flex flex-col justify-between space-y-4 shadow-xl shadow-cyan-950/20">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="blue" size="sm">SUPERUSER</Badge>
                  <ShieldAlert className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-mono">Admin Command</h3>
                <p className="text-xs text-slate-400">
                  Global platform administration, AI spatial directives, crowd surge simulation, bus fleet approvals, audit trails, and global system configuration.
                </p>
                <div className="text-xs font-mono space-y-1.5 text-slate-300 pt-2 border-t border-slate-800">
                  <p>✓ Spatial Risk Engine (0-100)</p>
                  <p>✓ Real-Time Surge Simulator</p>
                  <p>✓ Bus Fleet & Logistics Approval</p>
                  <p>✓ Permanent Audit Logs</p>
                </div>
              </div>

              <Link
                to="/"
                onClick={() => setCurrentRole('admin')}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold text-center block transition-colors"
              >
                Access Admin Console →
              </Link>
            </div>

            {/* Card 2: Organiser */}
            <div className="p-6 rounded-3xl bg-[#090e1c] border-2 border-amber-500/40 relative flex flex-col justify-between space-y-4 shadow-xl shadow-amber-950/20">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="warning" size="sm">EVENT OPS</Badge>
                  <Briefcase className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-mono">Event Organiser</h3>
                <p className="text-xs text-slate-400">
                  Event scheduling, squad formation, volunteer allocation, task Kanban board, resource requests, and attendee communication.
                </p>
                <div className="text-xs font-mono space-y-1.5 text-slate-300 pt-2 border-t border-slate-800">
                  <p>✓ Create & Edit Events</p>
                  <p>✓ 5 Team Squads Management</p>
                  <p>✓ Interactive Task Assignment</p>
                  <p>✓ Volunteer Roster & Shifts</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenAuth('login')}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold text-center block transition-colors cursor-pointer"
              >
                Organiser Portal →
              </button>
            </div>

            {/* Card 3: Volunteer */}
            <div className="p-6 rounded-3xl bg-[#090e1c] border border-slate-800 hover:border-emerald-500/50 relative flex flex-col justify-between space-y-4 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="success" size="sm">FIELD OPS</Badge>
                  <Radio className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-mono">Field Volunteer</h3>
                <p className="text-xs text-slate-400">
                  Mobile checkpoint terminal, bus passenger headcount reporting, resource deficiency requests, and instant radio alerts.
                </p>
                <div className="text-xs font-mono space-y-1.5 text-slate-300 pt-2 border-t border-slate-800">
                  <p>✓ Bus Full One-Click Alert</p>
                  <p>✓ Field Resource Requests</p>
                  <p>✓ Checkpoint Scanner</p>
                  <p>✓ Shift Coordination</p>
                </div>
              </div>

              <Link
                to="/volunteer-portal"
                onClick={() => setCurrentRole('volunteer')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-xs font-bold text-center block transition-colors border border-slate-700"
              >
                Volunteer Checkpoint →
              </Link>
            </div>

            {/* Card 4: Participant */}
            <div className="p-6 rounded-3xl bg-[#090e1c] border border-slate-800 hover:border-purple-500/50 relative flex flex-col justify-between space-y-4 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="blue" size="sm">ATTENDEE</Badge>
                  <Ticket className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-mono">Participant Pass</h3>
                <p className="text-xs text-slate-400">
                  Digital event credentials, shuttle bus arrival live tracking, ticket support desk, and direct live chat with command ops.
                </p>
                <div className="text-xs font-mono space-y-1.5 text-slate-300 pt-2 border-t border-slate-800">
                  <p>✓ QR Digital Transit Pass</p>
                  <p>✓ Live Shuttle ETA Tracker</p>
                  <p>✓ Raise Support Ticket</p>
                  <p>✓ Student Helpdesk Chat</p>
                </div>
              </div>

              <Link
                to="/participant-portal"
                onClick={() => setCurrentRole('participant')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-mono text-xs font-bold text-center block transition-colors border border-slate-700"
              >
                Participant Pass Hub →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800 bg-[#050810] py-12 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white text-sm">AEGIS-AI EVENT COMMAND CENTRE</span>
            <span>•</span>
            <span>Enterprise Spatial Safety</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <Link to="/" onClick={() => setCurrentRole('admin')} className="hover:text-cyan-400">Admin Console</Link>
            <button onClick={() => handleOpenAuth('login')} className="hover:text-amber-400 cursor-pointer">Organiser Portal</button>
            <Link to="/volunteer-portal" onClick={() => setCurrentRole('volunteer')} className="hover:text-emerald-400">Volunteer Desk</Link>
            <Link to="/participant-portal" onClick={() => setCurrentRole('participant')} className="hover:text-purple-400">Participant Pass</Link>
          </div>

          <div className="text-slate-500 text-[10px]">
            © 2026 Aegis AI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ORGANISER AUTH MODAL (LOGIN & REGISTER) */}
      <Modal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title={authMode === 'login' ? "Organiser Access Portal" : "Register as Event Organiser"}
        subtitle={authMode === 'login' ? "Enter your credentials to access the Organiser Command Dashboard" : "Create an event organiser profile to manage events, teams & workforce"}
        icon={Briefcase}
        size="lg"
      >
        <div className="space-y-5 font-sans text-xs">
          {/* Tabs: Login vs Register */}
          <div className="flex border-b border-slate-800 space-x-2 font-mono">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'border-amber-400 text-amber-400 bg-amber-950/20'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Organiser Login</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register New Organiser</span>
            </button>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Demo quick fill button */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-[11px] font-mono text-amber-300">
                  <strong>Demo Mode:</strong> Pre-registered Organiser Profile Available
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill(organisers[0])}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-mono text-[10px] font-bold hover:bg-amber-400 transition-colors shrink-0"
                >
                  Auto-Fill Sarah Jenkins
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  Organiser Email Address *
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. sarah.organiser@aegis.ai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-amber-500 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Password *
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-amber-500 text-xs"
                  required
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-amber-500" />
                  <span>Remember my session</span>
                </label>
                <span className="text-amber-400/80">Role: Event Director</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setAuthModalOpen(false)}
                  className="text-xs font-mono"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={LogIn}
                  className="text-xs font-mono font-bold bg-gradient-to-r from-amber-500 to-orange-600 border-amber-400/40"
                >
                  Login to Organiser Dashboard
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Alex Montgomery"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-cyan-400" />
                    Organisation / Company *
                  </label>
                  <input
                    type="text"
                    value={regOrg}
                    onChange={(e) => setRegOrg(e.target.value)}
                    placeholder="e.g. TechSummit Global LLC"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    Work Email *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="alex@techsummit.io"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold text-slate-300">
                    Phone / Radio ID
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (555) 345-6789"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold text-slate-300">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    placeholder="Lead Event Operations Director"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold text-slate-300">
                    Event Category Scope
                  </label>
                  <select
                    value={regScope}
                    onChange={(e) => setRegScope(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500 text-xs"
                  >
                    <option value="Conference & Summit">Conference & Summit</option>
                    <option value="Hackathon & Tech Competition">Hackathon & Tech Competition</option>
                    <option value="Expo & Exhibition">Expo & Exhibition</option>
                    <option value="Concert & Festival">Concert & Festival</option>
                    <option value="Sports & Esports">Sports & Esports</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  Account Password *
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-sans focus:outline-none focus:border-cyan-500 text-xs"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200/90 font-mono">
                ✓ <strong>Immediate Provisioning:</strong> Registering will instantly create your organiser profile, allocate default squads, and redirect you to the Organiser Command Dashboard.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setAuthModalOpen(false)}
                  className="text-xs font-mono"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={UserPlus}
                  className="text-xs font-mono font-bold bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-500/40"
                >
                  Complete Registration & Launch
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}
