import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_VENUES,
  INITIAL_EVENTS,
  INITIAL_INCIDENTS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_VOLUNTEERS,
  INITIAL_RISK_HISTORY,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  INITIAL_BUSES,
  INITIAL_BUS_REQUESTS,
  INITIAL_PARTICIPANTS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_RESOURCE_REQUESTS,
  INITIAL_ORGANISERS,
  INITIAL_TEAMS,
  INITIAL_TASKS
} from '../data/mockData';
import { calculateVenueRisk, calculateOverallSystemRisk } from '../utils/riskCalculator';

const AppContext = createContext();

const STORAGE_KEY = 'aegis_ai_command_centre_store_v1';

export function AppProvider({ children }) {
  // Load persisted state or fallback to initial mock fixtures
  const [venues, setVenues] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_venues`);
      return saved ? JSON.parse(saved) : INITIAL_VENUES;
    } catch {
      return INITIAL_VENUES;
    }
  });

  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [incidents, setIncidents] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_incidents`);
      return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [recommendations, setRecommendations] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_recommendations`);
      return saved ? JSON.parse(saved) : INITIAL_RECOMMENDATIONS;
    } catch {
      return INITIAL_RECOMMENDATIONS;
    }
  });

  const [volunteers, setVolunteers] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_volunteers`);
      return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERS;
    } catch {
      return INITIAL_VOLUNTEERS;
    }
  });

  const [riskHistory, setRiskHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_risk_history`);
      return saved ? JSON.parse(saved) : INITIAL_RISK_HISTORY;
    } catch {
      return INITIAL_RISK_HISTORY;
    }
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_audit_logs`);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // User Role: 'admin' | 'volunteer' | 'participant'
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_role`);
      return saved || 'admin';
    } catch {
      return 'admin';
    }
  });

  // Active simulated volunteer
  const [activeVolunteerId, setActiveVolunteerId] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_active_volunteer_id`);
      return saved || 'vol-003'; // Default to Amina Al-Mansoor (assigned to Bus-02)
    } catch {
      return 'vol-003';
    }
  });

  // Active simulated participant
  const [activeParticipantId, setActiveParticipantId] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_active_participant_id`);
      return saved || 'part-001';
    } catch {
      return 'part-001';
    }
  });

  // Buses & Transit Fleet
  const [buses, setBuses] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_buses`);
      return saved ? JSON.parse(saved) : INITIAL_BUSES;
    } catch {
      return INITIAL_BUSES;
    }
  });

  // Bus Requests (from volunteers to admin)
  const [busRequests, setBusRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_bus_requests`);
      return saved ? JSON.parse(saved) : INITIAL_BUS_REQUESTS;
    } catch {
      return INITIAL_BUS_REQUESTS;
    }
  });

  // Participants
  const [participants, setParticipants] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_participants`);
      return saved ? JSON.parse(saved) : INITIAL_PARTICIPANTS;
    } catch {
      return INITIAL_PARTICIPANTS;
    }
  });

  // Feature 1: Support Tickets & Chat
  const [supportTickets, setSupportTickets] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_support_tickets`);
      return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
    } catch {
      return INITIAL_SUPPORT_TICKETS;
    }
  });

  // Feature 2: Volunteer Resource Requests
  const [resourceRequests, setResourceRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_resource_requests`);
      return saved ? JSON.parse(saved) : INITIAL_RESOURCE_REQUESTS;
    } catch {
      return INITIAL_RESOURCE_REQUESTS;
    }
  });

  // Feature 3: Organisers, Teams & Tasks
  const [organisers, setOrganisers] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_organisers`);
      return saved ? JSON.parse(saved) : INITIAL_ORGANISERS;
    } catch {
      return INITIAL_ORGANISERS;
    }
  });

  const [activeOrganiserId, setActiveOrganiserId] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_active_organiser_id`);
      return saved || 'org-001';
    } catch {
      return 'org-001';
    }
  });

  const [teams, setTeams] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_teams`);
      return saved ? JSON.parse(saved) : INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Active Toasts
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const showToast = (title, message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, title, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Persist states to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_venues`, JSON.stringify(venues));
      localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
      localStorage.setItem(`${STORAGE_KEY}_incidents`, JSON.stringify(incidents));
      localStorage.setItem(`${STORAGE_KEY}_recommendations`, JSON.stringify(recommendations));
      localStorage.setItem(`${STORAGE_KEY}_volunteers`, JSON.stringify(volunteers));
      localStorage.setItem(`${STORAGE_KEY}_risk_history`, JSON.stringify(riskHistory));
      localStorage.setItem(`${STORAGE_KEY}_audit_logs`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
      localStorage.setItem(`${STORAGE_KEY}_role`, currentRole);
      localStorage.setItem(`${STORAGE_KEY}_active_volunteer_id`, activeVolunteerId);
      localStorage.setItem(`${STORAGE_KEY}_active_participant_id`, activeParticipantId);
      localStorage.setItem(`${STORAGE_KEY}_buses`, JSON.stringify(buses));
      localStorage.setItem(`${STORAGE_KEY}_bus_requests`, JSON.stringify(busRequests));
      localStorage.setItem(`${STORAGE_KEY}_participants`, JSON.stringify(participants));
      localStorage.setItem(`${STORAGE_KEY}_support_tickets`, JSON.stringify(supportTickets));
      localStorage.setItem(`${STORAGE_KEY}_resource_requests`, JSON.stringify(resourceRequests));
      localStorage.setItem(`${STORAGE_KEY}_organisers`, JSON.stringify(organisers));
      localStorage.setItem(`${STORAGE_KEY}_active_organiser_id`, activeOrganiserId);
      localStorage.setItem(`${STORAGE_KEY}_teams`, JSON.stringify(teams));
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
    } catch (e) {
      console.warn('LocalStorage persistence error:', e);
    }
  }, [venues, events, incidents, recommendations, volunteers, riskHistory, auditLogs, notifications, settings, currentRole, activeVolunteerId, activeParticipantId, buses, busRequests, participants, supportTickets, resourceRequests, organisers, activeOrganiserId, teams, tasks]);

  // Recalculate venue statuses dynamically whenever venue data changes
  const enrichedVenues = venues.map(v => {
    const risk = calculateVenueRisk(v);
    return {
      ...v,
      riskScore: risk.score,
      riskLevel: risk.level,
      riskBreakdown: risk.breakdown,
      riskMetrics: risk.metrics
    };
  });

  const overallRisk = calculateOverallSystemRisk(enrichedVenues);

  // 1. SIMULATE CROWD SURGE
  const simulateCrowdSurge = (venueId, surgeMultiplier = 1.35) => {
    const targetVenue = venues.find(v => v.id === venueId);
    if (!targetVenue) return;

    const oldOccupancy = targetVenue.currentOccupancy;
    const oldQueue = targetVenue.queueSize;

    // Surge math
    const addedOccupancy = Math.round(targetVenue.capacity * 0.22 * (surgeMultiplier > 1 ? surgeMultiplier : 1.2));
    const newOccupancy = Math.min(Math.round(targetVenue.capacity * 1.08), oldOccupancy + addedOccupancy);
    const newQueue = Math.round(oldQueue * 1.6 + 180);
    const newInflow = Math.round(targetVenue.inflowRate * 1.5 + 40);

    const updatedVenue = {
      ...targetVenue,
      currentOccupancy: newOccupancy,
      queueSize: newQueue,
      inflowRate: newInflow
    };

    const newRisk = calculateVenueRisk(updatedVenue);
    updatedVenue.status = newRisk.level;

    setVenues(prev => prev.map(v => v.id === venueId ? updatedVenue : v));

    // Audit Log entry
    const newAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${settings.operatorName} (Operator)`,
      actionType: "CROWD_SURGE_SIMULATION",
      category: "Simulation Engine",
      details: `Simulated surge at ${targetVenue.name}. Occupancy increased from ${oldOccupancy.toLocaleString()} to ${newOccupancy.toLocaleString()} (${Math.round((newOccupancy / targetVenue.capacity) * 100)}%). Queue jumped from ${oldQueue} to ${newQueue}. Risk Score: ${newRisk.score}/100.`,
      severity: newRisk.level === 'Critical' ? 'Critical' : 'Warning',
      ipAddress: "127.0.0.1 (Demo Engine)"
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);

    // Push notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `Surge Triggered: ${targetVenue.name}`,
      message: `Crowd surge simulated! Risk index escalated to ${newRisk.score} (${newRisk.level}). Concourse flow threshold exceeded.`,
      category: "Crowd Surge",
      severity: newRisk.level,
      read: false,
      timestamp: new Date().toISOString(),
      link: `/venues`
    };
    setNotifications(prev => [newNotif, ...prev]);

    // If critical risk, automatically open a surge incident and generate AI mitigation recommendation
    if (newRisk.score >= 70) {
      const newIncId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
      const surgeIncident = {
        id: newIncId,
        venueId: targetVenue.id,
        venueName: targetVenue.name,
        title: `Surge Escalation: Extreme Congestion at ${targetVenue.name}`,
        severity: "Critical",
        status: "Open",
        timestamp: new Date().toISOString(),
        reportedBy: "AEGIS Simulated Telemetry Engine",
        description: `Sudden crowd surge detected. Density at ${Math.round((newOccupancy / targetVenue.capacity) * 100)}% capacity. Queue backlog of ${newQueue} attendees at active choke points.`,
        evidence: `Optical density peaked at ${(newOccupancy / targetVenue.capacity * 3.8).toFixed(1)} p/m². Inflow rate spiked to ${newInflow} p/min against discharge rate of ${targetVenue.outflowRate} p/min.`,
        assignedVolunteers: [],
        actionTaken: "Awaiting operator authorization of recommended mitigation tactics."
      };
      setIncidents(prev => [surgeIncident, ...prev]);

      // Generate recommendation
      const newRecId = `REC-${Math.floor(510 + Math.random() * 480)}`;
      const surgeRec = {
        id: newRecId,
        title: `Emergency Flow Throttling & Perimeter Divert for ${targetVenue.name}`,
        venueId: targetVenue.id,
        venueName: targetVenue.name,
        category: "Surge Containment",
        priority: "High",
        confidenceScore: 96,
        status: "Pending",
        rationale: `${targetVenue.name} has crossed critical safety envelope (${newRisk.score}/100 risk). Divert subsequent waves to adjacent standby concourse and deploy emergency roving marshals.`,
        evidence: [
          `Occupancy: ${newOccupancy.toLocaleString()} / ${targetVenue.capacity.toLocaleString()} (${Math.round((newOccupancy / targetVenue.capacity) * 100)}%)`,
          `Queue Backlog: ${newQueue} persons`,
          `Discharge deficit: -${newInflow - targetVenue.outflowRate} p/min net accumulation`
        ],
        impact: "Halts runaway density; protects ingress vestibule from crush threshold within 6 min",
        actionsToExecute: [
          "Engage auxiliary egress doors and turnstile reversal",
          "Deploy nearest 3 available roving pool volunteers",
          "Broadcast queue divert notice across perimeter wayfinding"
        ],
        rejectionReason: null,
        decidedAt: null
      };
      setRecommendations(prev => [surgeRec, ...prev]);
    }

    // Add point to risk history
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRiskHistory(prev => [
      ...prev,
      {
        time: `${nowTimeStr} (Surge)`,
        actualOccupancy: newOccupancy,
        forecastOccupancy: newOccupancy + 200,
        riskScore: newRisk.score,
        queueTotal: newQueue
      }
    ]);

    showToast(
      "Simulate Surge Applied",
      `${targetVenue.name} crowd expanded (+${addedOccupancy.toLocaleString()} attendees). Risk Score is now ${newRisk.score} (${newRisk.level}).`,
      newRisk.level === 'Critical' ? 'error' : 'warning'
    );
  };

  // 2. AI RECOMMENDATIONS APPROVAL & REJECTION
  const approveRecommendation = (recId, notes = "") => {
    const rec = recommendations.find(r => r.id === recId);
    if (!rec) return;
    if (rec.status !== 'Pending') {
      showToast("Action Notice", `Recommendation ${recId} has already been ${rec.status.toLowerCase()}.`, "info");
      return;
    }

    const decidedAt = new Date().toISOString();

    setRecommendations(prev => prev.map(r => r.id === recId ? {
      ...r,
      status: 'Approved',
      decidedAt,
      operatorNotes: notes
    } : r));

    // Execute physical impact on venue if applicable
    if (rec.venueId) {
      setVenues(prev => prev.map(v => {
        if (v.id === rec.venueId) {
          const relievedQueue = Math.max(20, Math.round(v.queueSize * 0.45));
          const relievedOccupancy = Math.max(100, Math.round(v.currentOccupancy * 0.92));
          return {
            ...v,
            queueSize: relievedQueue,
            currentOccupancy: relievedOccupancy,
            inflowRate: Math.max(30, Math.round(v.inflowRate * 0.7))
          };
        }
        // If rerouting to a target venue (e.g., Gate 2)
        if (rec.targetVenueId && v.id === rec.targetVenueId) {
          return {
            ...v,
            inflowRate: v.inflowRate + 35,
            queueSize: v.queueSize + 40
          };
        }
        return v;
      }));
    }

    // Audit log
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: decidedAt,
        actor: `${settings.operatorName} (Operator)`,
        actionType: "RECOMMENDATION_APPROVED",
        category: "AI Governance",
        details: `Approved recommendation ${rec.id}: "${rec.title}". Automated mitigation commands dispatched. Operator Notes: ${notes || 'None'}.`,
        severity: "Success",
        ipAddress: "192.168.10.42"
      },
      ...prev
    ]);

    // Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Recommendation Approved: ${rec.id}`,
        message: `Plan executed: ${rec.title}. Traffic balancing initiated.`,
        category: "AI Decision",
        severity: "Info",
        read: false,
        timestamp: decidedAt,
        link: "/recommendations"
      },
      ...prev
    ]);

    showToast("Recommendation Approved", `Dispatched automated mitigation for ${rec.title}.`, "success");
  };

  const rejectRecommendation = (recId, reason) => {
    const rec = recommendations.find(r => r.id === recId);
    if (!rec) return;
    if (rec.status !== 'Pending') {
      showToast("Action Notice", `Recommendation ${recId} has already been ${rec.status.toLowerCase()}.`, "info");
      return;
    }

    const decidedAt = new Date().toISOString();

    setRecommendations(prev => prev.map(r => r.id === recId ? {
      ...r,
      status: 'Rejected',
      decidedAt,
      rejectionReason: reason
    } : r));

    // Audit log
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: decidedAt,
        actor: `${settings.operatorName} (Operator)`,
        actionType: "RECOMMENDATION_REJECTED",
        category: "AI Governance",
        details: `Rejected recommendation ${rec.id}: "${rec.title}". Rejection Reason: "${reason}".`,
        severity: "Warning",
        ipAddress: "192.168.10.42"
      },
      ...prev
    ]);

    showToast("Recommendation Rejected", `Logged rejection for ${rec.id}. Feedback captured for AI model alignment.`, "info");
  };

  // 3. VOLUNTEER ASSIGNMENT & CONFLICT PREVENTION
  const assignVolunteer = (volunteerId, targetVenueId) => {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    const targetVenue = venues.find(v => v.id === targetVenueId);
    if (!volunteer || !targetVenue) return false;

    // Conflict Check: Already assigned to this exact venue
    if (volunteer.assignedVenueId === targetVenueId) {
      showToast("Assignment Notice", `${volunteer.name} is already assigned to ${targetVenue.name}.`, "info");
      return false;
    }

    // Check if venue has max capacity of volunteers (e.g., max 6)
    const currentVenueVolunteers = volunteers.filter(v => v.assignedVenueId === targetVenueId);
    if (currentVenueVolunteers.length >= 6) {
      showToast("Assignment Limit", `${targetVenue.name} already has maximum volunteer allocation (6 personnel).`, "error");
      return false;
    }

    const prevVenue = volunteer.assignedVenueName;

    setVolunteers(prev => prev.map(v => v.id === volunteerId ? {
      ...v,
      assignedVenueId: targetVenue.id,
      assignedVenueName: targetVenue.name,
      status: 'Active'
    } : v));

    // Audit Log
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: `${settings.operatorName} (Operator)`,
        actionType: "VOLUNTEER_ASSIGNED",
        category: "Staff Deployment",
        details: `Reassigned ${volunteer.name} from "${prevVenue || 'Unassigned'}" to "${targetVenue.name}".`,
        severity: "Info",
        ipAddress: "192.168.10.42"
      },
      ...prev
    ]);

    showToast("Volunteer Assigned", `${volunteer.name} deployed to ${targetVenue.name}.`, "success");
    return true;
  };

  const unassignVolunteer = (volunteerId) => {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    if (!volunteer) return;

    setVolunteers(prev => prev.map(v => v.id === volunteerId ? {
      ...v,
      assignedVenueId: null,
      assignedVenueName: "Unassigned (Roving Pool)",
      status: "Available"
    } : v));

    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: `${settings.operatorName} (Operator)`,
        actionType: "VOLUNTEER_UNASSIGNED",
        category: "Staff Deployment",
        details: `Released ${volunteer.name} from ${volunteer.assignedVenueName} to Roving Reserve Pool.`,
        severity: "Info",
        ipAddress: "192.168.10.42"
      },
      ...prev
    ]);

    showToast("Volunteer Released", `${volunteer.name} returned to Roving Pool.`, "info");
  };

  // 4. EVENTS CRUD
  const addEvent = (eventData) => {
    const venue = venues.find(v => v.id === eventData.venueId);
    const newEvent = {
      id: `evt-${Date.now()}`,
      venueName: venue ? venue.name : "TBD Venue",
      riskLevel: "Normal",
      ...eventData
    };

    setEvents(prev => [newEvent, ...prev]);

    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: `${settings.operatorName} (Operator)`,
        actionType: "EVENT_CREATED",
        category: "Event Schedule",
        details: `Created new event "${newEvent.title}" scheduled at ${newEvent.venueName}.`,
        severity: "Info",
        ipAddress: "192.168.10.42"
      },
      ...prev
    ]);

    showToast("Event Created", `"${newEvent.title}" was successfully registered.`, "success");
    return newEvent;
  };

  const updateEvent = (eventId, eventData) => {
    const venue = venues.find(v => v.id === eventData.venueId);
    setEvents(prev => prev.map(e => e.id === eventId ? {
      ...e,
      ...eventData,
      venueName: venue ? venue.name : e.venueName
    } : e));

    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: `${settings.operatorName} (Operator)`,
        actionType: "EVENT_UPDATED",
        category: "Event Schedule",
        details: `Updated parameters for event ID ${eventId} ("${eventData.title || eventId}").`,
        severity: "Info",
        ipAddress: "192.168.10.42"
      },
      ...prev
    ]);

    showToast("Event Updated", `Event details updated successfully.`, "success");
  };

  const deleteEvent = (eventId) => {
    const target = events.find(e => e.id === eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));

    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: `${settings.operatorName} (Operator)`,
        actionType: "EVENT_DELETED",
        category: "Event Schedule",
        details: `Deleted event ID ${eventId} ("${target?.title || 'Unknown'}").`,
        severity: "Warning",
        ipAddress: "192.168.10.42"
      },
      ...prev
    ]);

    showToast("Event Removed", `Event has been removed from the schedule.`, "info");
  };

  // 5. INCIDENTS MANAGEMENT
  const updateIncidentStatus = (incidentId, newStatus, resolutionNotes = "") => {
    const inc = incidents.find(i => i.id === incidentId);
    if (!inc) return;

    setIncidents(prev => prev.map(i => i.id === incidentId ? {
      ...i,
      status: newStatus,
      actionTaken: resolutionNotes || i.actionTaken,
      resolvedAt: newStatus === 'Resolved' ? new Date().toISOString() : i.resolvedAt
    } : i));

    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: `${settings.operatorName} (Operator)`,
        actionType: "INCIDENT_STATUS_CHANGE",
        category: "Incident Management",
        details: `Changed incident ${incidentId} ("${inc.title}") status to "${newStatus.toUpperCase()}". Resolution log: ${resolutionNotes || 'None'}.`,
        severity: newStatus === 'Resolved' ? 'Success' : 'Info',
        ipAddress: "192.168.10.42"
      },
      ...prev
    ]);

    showToast("Incident Updated", `${incidentId} marked as ${newStatus}.`, newStatus === 'Resolved' ? 'success' : 'info');
  };

  const addIncident = (incidentData) => {
    const venue = venues.find(v => v.id === incidentData.venueId);
    const newInc = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      venueName: venue ? venue.name : "Unspecified Zone",
      assignedVolunteers: [],
      ...incidentData
    };

    setIncidents(prev => [newInc, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `New Incident Logged: ${newInc.id}`,
        message: `${newInc.title} at ${newInc.venueName}`,
        category: "Incident Alert",
        severity: newInc.severity,
        read: false,
        timestamp: new Date().toISOString(),
        link: "/incidents"
      },
      ...prev
    ]);

    showToast("Incident Logged", `${newInc.id} registered into active log.`, newInc.severity === 'Critical' ? 'error' : 'warning');
  };

  // 6. NOTIFICATIONS
  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("Notifications", "All notifications marked as read.", "info");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast("Notifications", "Notification tray cleared.", "info");
  };

  // 8. TRANSIT & BUS FLEET LOGISTICS
  const sendBusRequest = ({ busId, pickupLocation, passengersWaiting = 25, urgency = 'Critical', volunteerNotes = '' }) => {
    const bus = buses.find(b => b.id === busId);
    const volunteer = volunteers.find(v => v.id === activeVolunteerId) || volunteers[0];
    
    const newReq = {
      id: `req-bus-${Date.now()}`,
      busId: bus ? bus.id : (busId || 'bus-102'),
      busNumber: bus ? bus.busNumber : 'BUS-02',
      eventId: bus ? bus.eventId : 'evt-101',
      eventName: bus ? bus.eventName : 'Global AI Hackathon Grand Finals',
      pickupLocation: pickupLocation || (bus ? bus.pickupLocation : 'Designated Stop'),
      volunteerId: volunteer.id,
      volunteerName: volunteer.name,
      volunteerPhone: volunteer.phone,
      passengersWaiting: Number(passengersWaiting) || 25,
      currentBusCapacity: bus ? bus.totalCapacity : 50,
      currentBusOccupancy: bus ? bus.currentPassengers : 50,
      urgency,
      status: 'Pending',
      requestedAt: new Date().toISOString(),
      volunteerNotes: volunteerNotes || `Bus has reached full capacity. Attendees are waiting at pickup location. Immediate backup bus requested.`,
      confirmedAt: null,
      confirmedBy: null,
      adminNotes: null,
      assignedBackupBusId: null,
      assignedBackupBusNumber: null,
      backupDriverName: null,
      backupDriverPhone: null,
      backupEtaMinutes: null
    };

    // Automatically update target bus status to Full
    if (bus) {
      setBuses(prev => prev.map(b => b.id === bus.id ? { ...b, status: 'Full', currentPassengers: b.totalCapacity } : b));
    }

    setBusRequests(prev => [newReq, ...prev]);

    // Audit log
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: `${volunteer.name} (Field Volunteer)`,
        actionType: "BUS_FULL_ALERT",
        category: "Transit Logistics",
        details: `Volunteer reported ${newReq.busNumber} FULL at ${newReq.pickupLocation}. ${newReq.passengersWaiting} passengers waiting in queue. Urgent backup bus requested.`,
        severity: urgency === 'Critical' ? 'Critical' : 'Warning',
        ipAddress: "192.168.10.74 (Volunteer Mobile)"
      },
      ...prev
    ]);

    // System Notification for Admin
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `🚨 Bus Full Alert: ${newReq.busNumber} (${newReq.pickupLocation})`,
        message: `${volunteer.name} reported ${newReq.passengersWaiting} participants left behind! Backup bus request pending authorization.`,
        category: "Transit Request",
        severity: urgency === 'Critical' ? 'Critical' : 'Warning',
        read: false,
        timestamp: new Date().toISOString(),
        link: "/bus-fleet"
      },
      ...prev
    ]);

    showToast(
      "Backup Bus Requested!",
      `Alert dispatched to Admin Command Centre for ${newReq.pickupLocation} (${newReq.passengersWaiting} waiting).`,
      "warning"
    );

    return newReq;
  };

  const confirmBusRequest = (requestId, { backupBusId, backupBusNumber, backupDriverName, backupDriverPhone, backupEtaMinutes = 10, adminNotes = "" } = {}) => {
    const req = busRequests.find(r => r.id === requestId);
    if (!req) return;

    const nowIso = new Date().toISOString();
    const chosenBusNumber = backupBusNumber || "BUS-04 (Standby Fleet)";
    const chosenDriver = backupDriverName || "Gurpreet Singh";
    const chosenPhone = backupDriverPhone || "+91 98333 44556";
    const chosenEta = Number(backupEtaMinutes) || 10;
    const finalNotes = adminNotes || `Backup Bus ${chosenBusNumber} authorized and dispatched from Central Depot. ETA is ${chosenEta} minutes.`;

    // Mark backup bus as En Route
    if (backupBusId) {
      setBuses(prev => prev.map(b => b.id === backupBusId ? {
        ...b,
        status: 'En Route',
        destination: req.pickupLocation,
        etaMinutes: chosenEta
      } : b));
    }

    setBusRequests(prev => prev.map(r => r.id === requestId ? {
      ...r,
      status: 'Approved',
      confirmedAt: nowIso,
      confirmedBy: `${settings.operatorName} (Admin Command)`,
      adminNotes: finalNotes,
      assignedBackupBusId: backupBusId || 'bus-104',
      assignedBackupBusNumber: chosenBusNumber,
      backupDriverName: chosenDriver,
      backupDriverPhone: chosenPhone,
      backupEtaMinutes: chosenEta
    } : r));

    // Audit log
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: nowIso,
        actor: `${settings.operatorName} (Command Admin)`,
        actionType: "BACKUP_BUS_DISPATCHED",
        category: "Transit Logistics",
        details: `Approved backup bus request ${requestId}. Dispatched ${chosenBusNumber} to ${req.pickupLocation} (ETA: ${chosenEta} min). Driver: ${chosenDriver}.`,
        severity: "Success",
        ipAddress: "192.168.10.42"
      },
      ...prev
    ]);

    // Notification broadcast
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `✅ Backup Bus Dispatched: ${chosenBusNumber}`,
        message: `Dispatched to ${req.pickupLocation}. ETA: ${chosenEta} mins. Volunteer ${req.volunteerName} notified!`,
        category: "Transit Update",
        severity: "Info",
        read: false,
        timestamp: nowIso,
        link: "/volunteer-portal"
      },
      ...prev
    ]);

    showToast(
      "Backup Bus Confirmed & Dispatched!",
      `Confirmation sent to Volunteer ${req.volunteerName}! ${chosenBusNumber} is en route.`,
      "success"
    );
  };

  const rejectBusRequest = (requestId, reason = "Alternative transport already deployed") => {
    const req = busRequests.find(r => r.id === requestId);
    if (!req) return;

    const nowIso = new Date().toISOString();

    setBusRequests(prev => prev.map(r => r.id === requestId ? {
      ...r,
      status: 'Rejected',
      confirmedAt: nowIso,
      confirmedBy: `${settings.operatorName} (Admin Command)`,
      adminNotes: reason
    } : r));

    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: nowIso,
        actor: `${settings.operatorName} (Command Admin)`,
        actionType: "BACKUP_BUS_REJECTED",
        category: "Transit Logistics",
        details: `Rejected backup bus request ${requestId}. Reason: "${reason}".`,
        severity: "Warning",
        ipAddress: "192.168.10.42"
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Transit Request Rejected: ${req.busNumber}`,
        message: `Request for ${req.pickupLocation} was rejected: ${reason}`,
        category: "Transit Update",
        severity: "Warning",
        read: false,
        timestamp: nowIso,
        link: "/volunteer-portal"
      },
      ...prev
    ]);

    showToast("Request Rejected", `Notification sent to volunteer.`, "info");
  };

  const updateBusOccupancy = (busId, newCount) => {
    setBuses(prev => prev.map(b => {
      if (b.id !== busId) return b;
      const count = Math.max(0, Math.min(b.totalCapacity + 25, newCount));
      const isFull = count >= b.totalCapacity;
      return {
        ...b,
        currentPassengers: count,
        status: isFull ? 'Full' : (b.status === 'Full' ? 'Boarding' : b.status)
      };
    }));
  };

  const markBusDeparted = (busId) => {
    setBuses(prev => prev.map(b => b.id === busId ? { ...b, status: 'En Route' } : b));
    showToast("Bus Departed", "Bus marked as en route to event venue.", "success");
  };

  const addBus = (busData) => {
    const newBus = {
      id: `bus-${Date.now()}`,
      status: 'Standby',
      currentPassengers: 0,
      totalCapacity: 50,
      stops: [],
      ...busData
    };
    setBuses(prev => [...prev, newBus]);
    showToast("Bus Added", `${newBus.busNumber} added to transit fleet.`, "success");
    return newBus;
  };

  // 9. FEATURE 1: CHAT SUPPORT & TICKETING METHODS
  const createSupportTicket = ({ subject, category = 'General Inquiry', description, priority = 'Medium', participantId, participantName, participantEmail, location }) => {
    const participant = (participantId && participants.find(p => p.id === participantId)) ||
      participants.find(p => p.id === activeParticipantId) ||
      participants[0];
    const newTicketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();
    const resolvedId = participantId || participant?.id || 'part-1';
    const resolvedName = participantName || participant?.name || 'Attendee';
    const resolvedEmail = participantEmail || participant?.email || 'attendee@event.dev';
    const resolvedLocation = location || participant?.pickupStop || 'Main Event Arena';

    const newTicket = {
      id: newTicketId,
      participantId: resolvedId,
      participantName: resolvedName,
      participantEmail: resolvedEmail,
      subject,
      category,
      priority,
      location: resolvedLocation,
      status: 'Open',
      assignedStaff: 'Unassigned',
      createdAt: nowIso,
      updatedAt: nowIso,
      description,
      resolutionNotes: null,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: resolvedId,
          senderName: resolvedName,
          senderRole: 'participant',
          message: description,
          timestamp: nowIso
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);

    // Audit log
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: nowIso,
        actor: `${participant.name} (Participant)`,
        actionType: "SUPPORT_TICKET_CREATED",
        category: "Participant Support",
        details: `Created support ticket ${newTicketId}: "${subject}" (Category: ${category}, Priority: ${priority}).`,
        severity: priority === 'Urgent' || priority === 'High' ? 'Warning' : 'Info',
        ipAddress: "192.168.10.155 (Participant Portal)"
      },
      ...prev
    ]);

    // Push notification for Admin
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `💬 Support Ticket: ${newTicketId}`,
        message: `${participant.name} opened ticket: "${subject}" (${priority} Priority)`,
        category: "Support Ticket",
        severity: priority === 'Urgent' ? 'Critical' : priority === 'High' ? 'Warning' : 'Info',
        read: false,
        timestamp: nowIso,
        link: "/support-tickets"
      },
      ...prev
    ]);

    showToast("Support Ticket Created", `Ticket #${newTicketId} submitted. Support team has been alerted.`, "success");
    return newTicket;
  };

  const addTicketMessage = (ticketId, messageText) => {
    if (!messageText || !messageText.trim()) return;
    const ticket = supportTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const nowIso = new Date().toISOString();
    const isParticipant = currentRole === 'participant';
    const participant = participants.find(p => p.id === activeParticipantId) || participants[0];

    const senderName = isParticipant 
      ? participant.name 
      : `${settings.operatorName} (Support Lead)`;
    const senderId = isParticipant ? participant.id : settings.operatorId;
    const senderRole = isParticipant ? 'participant' : 'admin';

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      senderRole,
      message: messageText.trim(),
      timestamp: nowIso
    };

    setSupportTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        status: !isParticipant && t.status === 'Open' ? 'In Progress' : t.status,
        updatedAt: nowIso,
        messages: [...(t.messages || []), newMessage]
      };
    }));

    // Notification to the other party
    if (isParticipant) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: `💬 New Message in ${ticketId}`,
          message: `${senderName}: "${messageText.slice(0, 70)}..."`,
          category: "Support Chat",
          severity: "Info",
          read: false,
          timestamp: nowIso,
          link: "/support-tickets"
        },
        ...prev
      ]);
    } else {
      showToast("Reply Sent", `Message sent to participant ${ticket.participantName}.`, "success");
    }
  };

  const updateTicketStatus = (ticketId, newStatus, resolutionNotes = null) => {
    const nowIso = new Date().toISOString();
    const ticket = supportTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    setSupportTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      const updatedMessages = resolutionNotes ? [
        ...(t.messages || []),
        {
          id: `msg-${Date.now()}`,
          senderId: settings.operatorId,
          senderName: `${settings.operatorName} (Admin Resolution)`,
          senderRole: 'admin',
          message: `✅ [ADMIN SOLUTION]: ${resolutionNotes}`,
          timestamp: nowIso
        }
      ] : t.messages;

      return {
        ...t,
        status: newStatus,
        updatedAt: nowIso,
        resolutionNotes: resolutionNotes || t.resolutionNotes,
        messages: updatedMessages
      };
    }));

    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: nowIso,
        actor: `${settings.operatorName} (Admin)`,
        actionType: newStatus === 'Resolved' ? "STUDENT_QUERY_RESOLVED" : "TICKET_STATUS_UPDATED",
        category: "Participant Support",
        details: resolutionNotes
          ? `Solved ticket ${ticketId}. Resolution: "${resolutionNotes}".`
          : `Updated support ticket ${ticketId} status to "${newStatus.toUpperCase()}".`,
        severity: newStatus === 'Resolved' ? 'Success' : 'Info',
        ipAddress: "192.168.10.42"
      },
      ...prev
    ]);

    if (newStatus === 'Resolved') {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: `✅ Query Solved: #${ticketId}`,
          message: resolutionNotes
            ? `Admin resolved: "${resolutionNotes.slice(0, 60)}..."`
            : `Your query #${ticketId} was marked as resolved by Admin.`,
          category: "Student Query Solved",
          severity: "Info",
          read: false,
          timestamp: nowIso,
          link: "/participant-portal"
        },
        ...prev
      ]);
      showToast("Issue Solved", `Ticket #${ticketId} marked resolved. Solution dispatched to student.`, "success");
    } else {
      showToast("Ticket Updated", `Ticket #${ticketId} marked as ${newStatus}.`, "info");
    }
  };

  const assignTicketStaff = (ticketId, staffName) => {
    const nowIso = new Date().toISOString();
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignedStaff: staffName, updatedAt: nowIso } : t));
    showToast("Staff Assigned", `Ticket #${ticketId} assigned to ${staffName}.`, "info");
  };

  // 10. FEATURE 2: VOLUNTEER RESOURCE REQUESTS METHODS
  const createResourceRequest = ({ resourceCategory = 'other resources', resourceName, requiredQty = 1, availableQty = 0, urgency = 'Medium', location, reason, requiredByTime = 'Within 1 hour' }) => {
    const volunteer = volunteers.find(v => v.id === activeVolunteerId) || volunteers[0];
    const newReqId = `REQ-RES-${Math.floor(100 + Math.random() * 900)}`;
    const nowIso = new Date().toISOString();
    const reqQ = Number(requiredQty) || 1;
    const availQ = Number(availableQty) || 0;
    const shortage = Math.max(0, reqQ - availQ);

    const newRequest = {
      id: newReqId,
      volunteerId: volunteer.id,
      volunteerName: volunteer.name,
      volunteerRole: volunteer.role,
      resourceCategory,
      resourceName: resourceName || `${resourceCategory.toUpperCase()} Pack`,
      requiredQty: reqQ,
      availableQty: availQ,
      shortage,
      urgency,
      location: location || volunteer.assignedVenueName || 'Designated Zone',
      reason: reason || 'Urgent requirement reported from ground volunteer.',
      requiredByTime: requiredByTime || 'ASAP',
      status: 'Pending', // 'Pending' | 'Approved' | 'Partially Approved' | 'Rejected' | 'More Info Needed'
      fulfillmentStatus: 'Unassigned', // 'Unassigned' | 'In Progress' | 'Fulfilled' (Separate action!)
      approvedQty: null,
      decisionNotes: null,
      decidedBy: null,
      decidedAt: null,
      assignedOperationsStaff: 'Unassigned',
      operationsNotes: null,
      volunteerReplies: [],
      createdAt: nowIso
    };

    setResourceRequests(prev => [newRequest, ...prev]);

    // Audit log
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: nowIso,
        actor: `${volunteer.name} (Field Volunteer)`,
        actionType: "RESOURCE_REQUEST_CREATED",
        category: "Resource Logistics",
        details: `Volunteer submitted request ${newReqId} for ${reqQ}x ${newRequest.resourceName} at ${newRequest.location} (Shortage: ${shortage}, Urgency: ${urgency}).`,
        severity: urgency === 'Critical' ? 'Critical' : urgency === 'High' ? 'Warning' : 'Info',
        ipAddress: "192.168.10.74 (Field Device)"
      },
      ...prev
    ]);

    // Notification for Admin
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `📦 Volunteer Resource Request: ${newReqId}`,
        message: `${volunteer.name} requests ${reqQ}x ${newRequest.resourceName} at ${newRequest.location} (Urgency: ${urgency})`,
        category: "Resource Request",
        severity: urgency === 'Critical' ? 'Critical' : urgency === 'High' ? 'Warning' : 'Info',
        read: false,
        timestamp: nowIso,
        link: "/resource-requests"
      },
      ...prev
    ]);

    showToast("Resource Request Dispatched", `Request #${newReqId} sent to Admin Command Ops.`, "success");
    return newRequest;
  };

  const reviewResourceRequest = (requestId, { action, approvedQty, reason, notes, assignedStaff }) => {
    const req = resourceRequests.find(r => r.id === requestId);
    if (!req) return;
    const nowIso = new Date().toISOString();

    let newStatus = 'Approved';
    let finalApprovedQty = req.requiredQty;
    let decisionNotes = notes || '';

    if (action === 'partial') {
      newStatus = 'Partially Approved';
      finalApprovedQty = Number(approvedQty) || Math.floor(req.requiredQty / 2);
      decisionNotes = notes || `Partially approved ${finalApprovedQty} out of ${req.requiredQty} units requested.`;
    } else if (action === 'reject') {
      newStatus = 'Rejected';
      finalApprovedQty = 0;
      decisionNotes = reason || 'Request declined due to operational constraints.';
    } else if (action === 'request_info') {
      newStatus = 'More Info Needed';
      decisionNotes = notes || 'Please clarify specific zone checkpoint and estimated attendee count.';
    } else {
      // Full approval
      newStatus = 'Approved';
      finalApprovedQty = Number(approvedQty) || req.requiredQty;
      decisionNotes = notes || `Fully approved ${finalApprovedQty} units as requested.`;
    }

    const assignedOps = assignedStaff || (newStatus === 'Rejected' ? 'Unassigned' : (req.assignedOperationsStaff !== 'Unassigned' ? req.assignedOperationsStaff : 'Operations Quick-Dispatch Squad'));

    setResourceRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      return {
        ...r,
        status: newStatus,
        approvedQty: finalApprovedQty,
        decisionNotes,
        decidedBy: `${settings.operatorName} (Admin)`,
        decidedAt: nowIso,
        assignedOperationsStaff: assignedOps
      };
    }));

    // Audit log
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: nowIso,
        actor: `${settings.operatorName} (Admin Command)`,
        actionType: "RESOURCE_REQUEST_REVIEWED",
        category: "Resource Logistics",
        details: `Reviewed request ${requestId}: Marked as "${newStatus}". Decision Notes: "${decisionNotes}". Operations Staff: ${assignedOps}.`,
        severity: newStatus === 'Approved' || newStatus === 'Partially Approved' ? 'Success' : 'Warning',
        ipAddress: "192.168.10.42"
      },
      ...prev
    ]);

    // Notification for Volunteer
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Decision on Request: ${requestId}`,
        message: `Admin decision: ${newStatus} (${decisionNotes})`,
        category: "Resource Decision",
        severity: newStatus === 'Approved' ? 'Info' : 'Warning',
        read: false,
        timestamp: nowIso,
        link: "/volunteer-portal"
      },
      ...prev
    ]);

    showToast("Decision Saved", `Request #${requestId} is now ${newStatus}.`, "success");
  };

  const fulfillResourceRequest = (requestId, { status = 'Fulfilled', notes = '' }) => {
    const req = resourceRequests.find(r => r.id === requestId);
    if (!req) return;
    const nowIso = new Date().toISOString();

    setResourceRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      return {
        ...r,
        fulfillmentStatus: status,
        operationsNotes: notes || (status === 'Fulfilled' ? 'Resources delivered and confirmed at location.' : 'Supplies en route.')
      };
    }));

    // Audit log
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: nowIso,
        actor: req.assignedOperationsStaff || `${settings.operatorName} (Operations)`,
        actionType: "RESOURCE_FULFILLMENT_UPDATE",
        category: "Resource Logistics",
        details: `Updated fulfillment status of request ${requestId} to "${status.toUpperCase()}". Operations Log: "${notes || 'None'}".`,
        severity: status === 'Fulfilled' ? 'Success' : 'Info',
        ipAddress: "192.168.10.88 (Operations Handheld)"
      },
      ...prev
    ]);

    // Push notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `📦 Delivery Update: ${requestId}`,
        message: `Fulfillment status changed to ${status}: ${notes || 'Supplies on site.'}`,
        category: "Resource Delivery",
        severity: status === 'Fulfilled' ? 'Info' : 'Warning',
        read: false,
        timestamp: nowIso,
        link: "/volunteer-portal"
      },
      ...prev
    ]);

    showToast("Fulfillment Updated", `Request #${requestId} fulfillment status: ${status}.`, "success");
  };

  const volunteerRespondResourceRequest = (requestId, responseText) => {
    if (!responseText || !responseText.trim()) return;
    const volunteer = volunteers.find(v => v.id === activeVolunteerId) || volunteers[0];
    const nowIso = new Date().toISOString();

    setResourceRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      return {
        ...r,
        status: 'Pending', // Returned to pending for admin re-evaluation
        volunteerReplies: [
          ...(r.volunteerReplies || []),
          {
            id: `rep-${Date.now()}`,
            volunteerName: volunteer.name,
            message: responseText.trim(),
            timestamp: nowIso
          }
        ]
      };
    }));

    showToast("Clarification Sent", "Your response was submitted to Admin Command for re-evaluation.", "success");
  };

  // 7. SETTINGS & RESET DEMO DATA
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast("Settings Saved", "Command centre configuration updated.", "success");
  };

  // 8. FEATURE 3: ORGANISERS, TEAMS & TASK MANAGEMENT METHODS
  const registerOrganiser = ({ name, email, organisation, phone, roleTitle = 'Event Director', scope = 'Conference & Summit' }) => {
    const newId = `org-${Math.floor(100 + Math.random() * 900)}`;
    const newOrganiser = {
      id: newId,
      name,
      email,
      organisation: organisation || 'Independent Event Org',
      roleTitle,
      phone: phone || '+1 (555) 000-1122',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      eventsSupervised: ['evt-101'],
      teamsCount: 5,
      tasksCount: 6,
      registeredDate: new Date().toISOString().split('T')[0]
    };

    setOrganisers(prev => [newOrganiser, ...prev]);
    setActiveOrganiserId(newId);
    setCurrentRole('organiser');
    showToast("Registration Successful", `Welcome to Aegis Command, ${name}! Organiser dashboard activated.`, "success");
    return newOrganiser;
  };

  const loginOrganiser = (email) => {
    const matched = organisers.find(o => o.email.toLowerCase() === (email || '').toLowerCase()) || organisers[0];
    setActiveOrganiserId(matched.id);
    setCurrentRole('organiser');
    showToast("Organiser Login", `Authenticated as ${matched.name} (${matched.organisation})`, "success");
    return matched;
  };

  const createOrganiserTask = ({ title, teamId, assignedTo, priority = 'Medium', dueDate, eventId = 'evt-101', category = 'Operations', description }) => {
    const team = teams.find(t => t.id === teamId) || teams[0];
    const taskId = `TSK-${Math.floor(100 + Math.random() * 900)}`;
    const newTask = {
      id: taskId,
      title,
      teamId: team.id,
      teamName: team.name,
      assignedTo: assignedTo || team.lead,
      priority,
      status: 'To Do',
      dueDate: dueDate || 'Today, 18:00',
      eventId,
      category,
      description: description || 'Operational directive dispatched from Event Organiser Console.'
    };

    setTasks(prev => [newTask, ...prev]);
    showToast("Task Dispatched", `Task #${taskId} assigned to ${newTask.assignedTo} (${newTask.teamName})`, "success");
    return newTask;
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    showToast("Task Updated", `Task moved to "${newStatus}"`, "info");
  };

  const assignVolunteerToTeam = (volunteerId, teamId, roleInTeam) => {
    const targetTeam = teams.find(t => t.id === teamId);
    setVolunteers(prev => prev.map(v => {
      if (v.id === volunteerId) {
        return {
          ...v,
          teamId,
          teamName: targetTeam ? targetTeam.name : v.teamName,
          role: roleInTeam || v.role
        };
      }
      return v;
    }));
    showToast("Volunteer Assigned", `Volunteer updated in ${targetTeam?.name || 'Team'}`, "success");
  };

  const addVolunteerAndSendInvite = ({
    name,
    email,
    phone,
    eventId = 'evt-101',
    teamId = 'team-001',
    role = 'Crowd Flow Marshall',
    responsibilities = 'Support concourse pedestrian routing, enforce safety guidelines, and assist attendee inquiries.',
    shiftSchedule = '08:00 - 16:00 (Standard Shift)',
    skills = ['Crowd Control', 'Customer Assistance'],
    initialTaskTitle
  }) => {
    const newId = `vol-${Math.floor(100 + Math.random() * 900)}`;
    const inviteToken = `inv-${(name || 'guest').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5)}-${Math.floor(100 + Math.random() * 900)}`;
    const targetEvent = events.find(e => e.id === eventId) || events[0];
    const targetTeam = teams.find(t => t.id === teamId) || teams[0];

    const newVolunteer = {
      id: newId,
      name,
      email,
      phone: phone || '+1 (555) 012-3456',
      role,
      assignedVenueId: targetEvent?.venueId || 'ven-001',
      assignedVenueName: targetEvent?.venueName || 'Grand Arena Hall',
      skills: Array.isArray(skills) ? skills : [skills],
      status: 'Invited',
      invitationStatus: 'Pending',
      inviteToken,
      checkInTime: null,
      shiftDurationHours: 8,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      teamId: targetTeam.id,
      teamName: targetTeam.name,
      eventId: targetEvent?.id || 'evt-101',
      eventName: targetEvent?.title || 'Global AI Hackathon Grand Finals',
      responsibilities,
      shiftSchedule
    };

    setVolunteers(prev => [newVolunteer, ...prev]);

    // If initial task provided, create it
    if (initialTaskTitle && initialTaskTitle.trim()) {
      createOrganiserTask({
        title: initialTaskTitle.trim(),
        teamId: targetTeam.id,
        assignedTo: name,
        priority: 'High',
        dueDate: 'Today, 15:00',
        eventId: targetEvent.id,
        category: 'Operations',
        description: `Direct directive assigned during volunteer onboarding for ${name}: ${responsibilities}`
      });
    }

    // Push notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `Volunteer Invited: ${name}`,
      message: `Invitation generated for ${name} (${role}) to join ${targetTeam.name} for ${targetEvent.title}. Token: ${inviteToken}`,
      category: "Workforce",
      severity: "Info",
      read: false,
      timestamp: new Date().toISOString(),
      link: "/volunteers"
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Add audit log
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: `VOLUNTEER_INVITED`,
        entityId: newId,
        details: `Organiser invited ${name} (${email}) as ${role} for ${targetTeam.name}. Token: ${inviteToken}`,
        operator: 'Sarah Jenkins (Organiser)',
        severity: 'Info',
        ipAddress: '127.0.0.1'
      },
      ...prev
    ]);

    showToast("Volunteer Invited", `Invitation link created for ${name} to join ${targetTeam.name}!`, "success");

    return {
      volunteer: newVolunteer,
      inviteToken,
      inviteLink: `/volunteer-invite?token=${inviteToken}`
    };
  };

  const acceptVolunteerInvitation = ({ inviteToken, password, phone, emergencyContact }) => {
    const matched = volunteers.find(v => v.inviteToken === inviteToken || v.email?.toLowerCase() === (inviteToken || '').toLowerCase());
    if (!matched) {
      showToast("Invalid Invitation", "Could not find a valid volunteer invitation with this token.", "error");
      return null;
    }

    const updatedVolunteer = {
      ...matched,
      status: 'Active',
      invitationStatus: 'Accepted',
      checkInTime: new Date().toISOString(),
      phone: phone || matched.phone,
      emergencyContact: emergencyContact || '+1 (555) 999-0000',
      hasAccount: true
    };

    setVolunteers(prev => prev.map(v => v.id === matched.id ? updatedVolunteer : v));
    setActiveVolunteerId(matched.id);
    setCurrentRole('volunteer');

    showToast("Account Activated!", `Welcome to the squad, ${matched.name}! You are on duty for ${matched.teamName}.`, "success");

    return updatedVolunteer;
  };

  const updateVolunteerResponsibilities = (volunteerId, { teamId, role, responsibilities, shiftSchedule }) => {
    const targetTeam = teams.find(t => t.id === teamId);
    setVolunteers(prev => prev.map(v => {
      if (v.id === volunteerId) {
        return {
          ...v,
          ...(teamId ? { teamId, teamName: targetTeam ? targetTeam.name : v.teamName } : {}),
          ...(role ? { role } : {}),
          ...(responsibilities ? { responsibilities } : {}),
          ...(shiftSchedule ? { shiftSchedule } : {})
        };
      }
      return v;
    }));
    showToast("Volunteer Updated", "Volunteer team, role, and responsibilities saved.", "success");
  };

  const resendVolunteerInvite = (volunteerId) => {
    const vol = volunteers.find(v => v.id === volunteerId);
    if (!vol) return null;
    const token = vol.inviteToken || `inv-${vol.id}`;
    showToast("Invitation Link Copied", `Invitation for ${vol.name}: /volunteer-invite?token=${token}`, "info");
    return token;
  };

  const resetDemoData = () => {
    // Clear all storage keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('aegis_ai_command_centre_store_v1')) {
        localStorage.removeItem(key);
      }
    });

    setVenues(INITIAL_VENUES);
    setEvents(INITIAL_EVENTS);
    setIncidents(INITIAL_INCIDENTS);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setVolunteers(INITIAL_VOLUNTEERS);
    setRiskHistory(INITIAL_RISK_HISTORY);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    setCurrentRole('admin');
    setActiveVolunteerId('vol-003');
    setActiveParticipantId('part-001');
    setBuses(INITIAL_BUSES);
    setBusRequests(INITIAL_BUS_REQUESTS);
    setParticipants(INITIAL_PARTICIPANTS);
    setSupportTickets(INITIAL_SUPPORT_TICKETS);
    setResourceRequests(INITIAL_RESOURCE_REQUESTS);
    setOrganisers(INITIAL_ORGANISERS);
    setActiveOrganiserId('org-001');
    setTeams(INITIAL_TEAMS);
    setTasks(INITIAL_TASKS);

    showToast("Demo Reset Complete", "All venues, queues, incidents, bus fleet, support tickets, and resource requests restored to baseline demo state.", "info");
  };

  return (
    <AppContext.Provider value={{
      venues: enrichedVenues,
      rawVenues: venues,
      events,
      incidents,
      recommendations,
      volunteers,
      riskHistory,
      auditLogs,
      notifications,
      settings,
      overallRisk,
      currentRole,
      setCurrentRole,
      activeVolunteerId,
      setActiveVolunteerId,
      activeParticipantId,
      setActiveParticipantId,
      organisers,
      setOrganisers,
      activeOrganiserId,
      setActiveOrganiserId,
      teams,
      setTeams,
      tasks,
      setTasks,
      registerOrganiser,
      loginOrganiser,
      createOrganiserTask,
      updateTaskStatus,
      assignVolunteerToTeam,
      addVolunteerAndSendInvite,
      acceptVolunteerInvitation,
      updateVolunteerResponsibilities,
      resendVolunteerInvite,
      buses,
      busRequests,
      participants,
      supportTickets,
      createSupportTicket,
      addTicketMessage,
      updateTicketStatus,
      assignTicketStaff,
      resourceRequests,
      createResourceRequest,
      reviewResourceRequest,
      fulfillResourceRequest,
      volunteerRespondResourceRequest,
      sendBusRequest,
      confirmBusRequest,
      rejectBusRequest,
      updateBusOccupancy,
      markBusDeparted,
      addBus,
      toasts,
      showToast,
      removeToast,
      simulateCrowdSurge,
      approveRecommendation,
      rejectRecommendation,
      assignVolunteer,
      unassignVolunteer,
      addEvent,
      updateEvent,
      deleteEvent,
      updateIncidentStatus,
      addIncident,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearAllNotifications,
      updateSettings,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
