import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Radio,
  Shield,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  AlertCircle,
  FileText,
  BadgeCheck,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function VolunteerInvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenParam = searchParams.get('token') || '';

  const {
    volunteers,
    teams,
    events,
    acceptVolunteerInvitation,
    showToast
  } = useApp();

  const [inputToken, setInputToken] = useState(tokenParam);
  const [selectedToken, setSelectedToken] = useState(tokenParam);
  const [password, setPassword] = useState('volunteer123');
  const [confirmPassword, setConfirmPassword] = useState('volunteer123');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync token from URL param
  useEffect(() => {
    if (tokenParam) {
      setInputToken(tokenParam);
      setSelectedToken(tokenParam);
    }
  }, [tokenParam]);

  // Find matching volunteer by inviteToken
  const matchedVolunteer = volunteers.find(
    v => v.inviteToken === selectedToken || (selectedToken && v.email?.toLowerCase() === selectedToken.toLowerCase())
  );

  // Also fallback to Chloe Dupont or first invited volunteer for demo if none selected
  const demoInvitedVolunteers = volunteers.filter(v => v.status === 'Invited' || v.invitationStatus === 'Pending');

  // Fill default phone if matched
  useEffect(() => {
    if (matchedVolunteer) {
      if (!phone) setPhone(matchedVolunteer.phone || '');
    }
  }, [matchedVolunteer]);

  const assignedTeam = teams.find(t => t.id === matchedVolunteer?.teamId) || teams[0];
  const assignedEvent = events.find(e => e.id === matchedVolunteer?.eventId) || events[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedToken) {
      showToast("Invitation Required", "Please enter or select a valid invitation token.", "error");
      return;
    }
    if (!agreed) {
      showToast("Agreement Required", "Please accept the volunteer code of conduct.", "warning");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Password Mismatch", "Passwords do not match.", "error");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = acceptVolunteerInvitation({
        inviteToken: selectedToken,
        password,
        phone,
        emergencyContact
      });

      setIsSubmitting(false);

      if (result) {
        navigate('/volunteer-portal');
      }
    }, 400);
  };

  const handleSelectDemoToken = (tok) => {
    setSelectedToken(tok);
    setInputToken(tok);
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 p-0.5 shadow-lg shadow-emerald-950/40">
            <div className="w-full h-full bg-[#080e1c] rounded-[10px] flex items-center justify-center">
              <Radio className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-wider text-white font-mono">AEGIS<span className="text-emerald-400">.AI</span></span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                VOLUNTEER ONBOARDING
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">Event Operations Workforce Portal</p>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs font-mono text-slate-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <span>Return Home</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Invitation Box */}
      <main className="relative z-10 max-w-3xl mx-auto w-full my-8">
        {!matchedVolunteer ? (
          /* Step 1: Token Lookup if no token or token not found */
          <Card className="p-6 sm:p-8 bg-[#090e1c] border-slate-800 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold font-mono text-white">Enter Volunteer Invitation Token</h1>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Event Organisers issue unique invitation tokens to add volunteers to specific squads and events.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSelectedToken(inputToken.trim());
              }}
              className="space-y-4 max-w-md mx-auto"
            >
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Invitation Token or Registered Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value)}
                    placeholder="e.g. inv-chloe-771 or chloe.dupont@volunteer.org"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="absolute right-1.5 top-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs"
                  >
                    Lookup
                  </Button>
                </div>
              </div>

              {/* Demo Quick-Pick Pills */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 block text-center">
                  Or select a pending volunteer invitation from your active event:
                </span>
                <div className="flex flex-col gap-2">
                  {demoInvitedVolunteers.map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleSelectDemoToken(v.inviteToken)}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 transition-all text-left flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img src={v.avatar} alt={v.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <div className="text-xs font-bold text-white font-mono group-hover:text-emerald-300">
                            {v.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {v.role} • {v.teamName}
                          </div>
                        </div>
                      </div>
                      <Badge variant="warning" size="sm">Invite Pending</Badge>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </Card>
        ) : (
          /* Step 2: Matched Volunteer Acceptance Form */
          <div className="space-y-6">
            {/* INVITATION DETAILS CARD */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-[#090e1c] border-2 border-emerald-500/50 shadow-2xl shadow-emerald-950/40 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3.5">
                  <img
                    src={matchedVolunteer.avatar}
                    alt={matchedVolunteer.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white font-mono">{matchedVolunteer.name}</span>
                      <Badge variant="warning" size="sm">Invitation Awaiting Acceptance</Badge>
                    </div>
                    <p className="text-xs text-emerald-400 font-mono mt-0.5">
                      Assigned Role: <strong>{matchedVolunteer.role}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Invited by Sarah Jenkins • Lead Event Operations Director
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedToken('')}
                  className="text-xs font-mono text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Change Account
                </button>
              </div>

              {/* Event & Team Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                {/* Event info */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <Calendar className="w-4 h-4" />
                    <span className="font-bold">ASSIGNED EVENT</span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-mono">
                    {assignedEvent?.title || 'Global AI Hackathon Grand Finals'}
                  </h4>
                  <div className="space-y-1 text-[11px] font-mono text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {assignedEvent?.venueName || 'Grand Arena Hall & Labs'}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Shift: {matchedVolunteer.shiftSchedule || '08:00 - 16:00 (Standard Shift)'}
                    </p>
                  </div>
                </div>

                {/* Team info */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <Users className="w-4 h-4" />
                    <span className="font-bold">OPERATIONAL SQUAD</span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-mono">
                    {assignedTeam?.name || 'Perimeter Security Squad'}
                  </h4>
                  <div className="space-y-1 text-[11px] font-mono text-slate-400">
                    <p>Squad Lead: <strong className="text-slate-300">{assignedTeam?.lead || 'Marcus Chen'}</strong></p>
                    <p>Radio: <strong className="text-slate-300">{assignedTeam?.contactRadio || 'Channel 2 (Security)'}</strong></p>
                    <p>Squad Size: <strong className="text-slate-300">{assignedTeam?.membersCount || 8} personnel</strong></p>
                  </div>
                </div>
              </div>

              {/* Responsibilities Callout */}
              <div className="mt-5 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                  <FileText className="w-4 h-4" />
                  <span>YOUR DEFINED RESPONSIBILITIES (DISPATCHED BY ORGANISER):</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  "{matchedVolunteer.responsibilities || 'Support concourse pedestrian routing, enforce safety guidelines, and assist attendee inquiries.'}"
                </p>
              </div>
            </div>

            {/* ACCOUNT ACTIVATION FORM */}
            <Card className="p-6 sm:p-8 bg-[#090e1c] border-slate-800 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-emerald-400" />
                  Create Your Volunteer Account & Confirm Access
                </h3>
                <p className="text-xs text-slate-400">
                  Set up your password and emergency contact to access your personal volunteer dispatch dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={matchedVolunteer.name}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Official Email</label>
                    <input
                      type="email"
                      value={matchedVolunteer.email}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Mobile Contact Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Emergency Contact / Phone</label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="e.g. Sarah Miller (+1 555-999-1111)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Create Account Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                    />
                    <span>
                      I agree to the volunteer operations code of conduct, radio dispatch protocol, and emergency safety directives.
                    </span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Token verified: <strong className="text-white">{selectedToken}</strong>
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-mono font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Activating Account...</span>
                    ) : (
                      <>
                        <span>Accept Invitation & Open Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-6 border-t border-slate-800/80 text-center text-xs font-mono text-slate-500">
        AEGIS Command System • Event Operations & Volunteer Workforce Management Engine
      </footer>
    </div>
  );
}
