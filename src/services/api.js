/**
 * AEGIS-AI Operational REST API Service Abstraction
 * Configured with synthetic endpoint handlers and ready for Spring Boot 3.x controller binding.
 * Set VITE_API_BASE_URL to transition from in-memory/localStorage mock to real REST server.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const USE_REMOTE_BACKEND = false; // Toggle to true when Spring Boot backend is spun up

// Simulated network latency helper for realistic command centre interaction
const mockLatency = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms));

export const ApiService = {
  // --- VENUE MONITORING ENDPOINTS ---
  async getVenues() {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/venues`);
      return res.json();
    }
    await mockLatency(80);
    return null; // Handled reactively by AppContext with localStorage persistence
  },

  async triggerCrowdSurge(venueId, surgeFactor = 1.25) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/venues/${venueId}/simulate-surge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surgeFactor })
      });
      return res.json();
    }
    await mockLatency(180);
    return { success: true, venueId, surgeFactor };
  },

  // --- EVENT ENDPOINTS ---
  async getEvents() {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/events`);
      return res.json();
    }
    await mockLatency(90);
    return null;
  },

  async createEvent(eventPayload) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload)
      });
      return res.json();
    }
    await mockLatency(150);
    return { id: `evt-${Date.now()}`, ...eventPayload };
  },

  async updateEvent(id, eventPayload) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload)
      });
      return res.json();
    }
    await mockLatency(120);
    return { id, ...eventPayload };
  },

  async deleteEvent(id) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE'
      });
      return res.json();
    }
    await mockLatency(100);
    return { success: true, id };
  },

  // --- INCIDENTS & ALERTS ENDPOINTS ---
  async getIncidents() {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/incidents`);
      return res.json();
    }
    await mockLatency(70);
    return null;
  },

  async updateIncidentStatus(incidentId, status, resolutionNotes = '') {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/incidents/${incidentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolutionNotes })
      });
      return res.json();
    }
    await mockLatency(140);
    return { incidentId, status, resolutionNotes, updated: true };
  },

  // --- AI RECOMMENDATIONS ENDPOINTS ---
  async getRecommendations() {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/ai/recommendations`);
      return res.json();
    }
    await mockLatency(90);
    return null;
  },

  async approveRecommendation(recommendationId, operatorNotes = '') {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/ai/recommendations/${recommendationId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorNotes, decidedBy: 'Operator #8841' })
      });
      return res.json();
    }
    await mockLatency(200);
    return { recommendationId, status: 'Approved', operatorNotes };
  },

  async rejectRecommendation(recommendationId, rejectionReason) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/ai/recommendations/${recommendationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason, decidedBy: 'Operator #8841' })
      });
      return res.json();
    }
    await mockLatency(180);
    return { recommendationId, status: 'Rejected', rejectionReason };
  },

  // --- VOLUNTEER DISPATCH ENDPOINTS ---
  async assignVolunteer(volunteerId, venueId) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/volunteers/${volunteerId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueId })
      });
      return res.json();
    }
    await mockLatency(140);
    return { volunteerId, venueId, assigned: true };
  },

  async unassignVolunteer(volunteerId) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/volunteers/${volunteerId}/unassign`, {
        method: 'POST'
      });
      return res.json();
    }
    await mockLatency(100);
    return { volunteerId, unassigned: true };
  },

  // --- AUDIT LOGS & SYSTEM ---
  async getAuditLogs() {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/audit-logs`);
      return res.json();
    }
    await mockLatency(70);
    return null;
  },

  // --- FEATURE 1: SUPPORT TICKETS & CHAT ENDPOINTS ---
  async getSupportTickets(participantId = null) {
    if (USE_REMOTE_BACKEND) {
      const url = participantId 
        ? `${API_BASE_URL}/support/tickets?participantId=${participantId}`
        : `${API_BASE_URL}/support/tickets`;
      const res = await fetch(url);
      return res.json();
    }
    await mockLatency(75);
    return null;
  },

  async createSupportTicket(ticketPayload) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/support/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketPayload)
      });
      return res.json();
    }
    await mockLatency(120);
    return { id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`, ...ticketPayload };
  },

  async addTicketMessage(ticketId, messagePayload) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messagePayload)
      });
      return res.json();
    }
    await mockLatency(80);
    return { id: `msg-${Date.now()}`, ...messagePayload };
  },

  async updateTicketStatus(ticketId, status) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/support/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return res.json();
    }
    await mockLatency(90);
    return { ticketId, status, updated: true };
  },

  async assignTicketStaff(ticketId, assignedStaff) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/support/tickets/${ticketId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedStaff })
      });
      return res.json();
    }
    await mockLatency(90);
    return { ticketId, assignedStaff, updated: true };
  },

  // --- FEATURE 2: VOLUNTEER RESOURCE REQUESTS ENDPOINTS ---
  async getResourceRequests(volunteerId = null) {
    if (USE_REMOTE_BACKEND) {
      const url = volunteerId
        ? `${API_BASE_URL}/resources/requests?volunteerId=${volunteerId}`
        : `${API_BASE_URL}/resources/requests`;
      const res = await fetch(url);
      return res.json();
    }
    await mockLatency(80);
    return null;
  },

  async createResourceRequest(requestPayload) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/resources/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });
      return res.json();
    }
    await mockLatency(130);
    return { id: `REQ-RES-${Math.floor(100 + Math.random() * 900)}`, ...requestPayload };
  },

  async reviewResourceRequest(requestId, reviewPayload) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/resources/requests/${requestId}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload)
      });
      return res.json();
    }
    await mockLatency(110);
    return { requestId, ...reviewPayload, reviewed: true };
  },

  async fulfillResourceRequest(requestId, fulfillPayload) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/resources/requests/${requestId}/fulfill`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fulfillPayload)
      });
      return res.json();
    }
    await mockLatency(110);
    return { requestId, ...fulfillPayload, fulfilled: true };
  },

  async respondToResourceRequest(requestId, responsePayload) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE_URL}/resources/requests/${requestId}/volunteer-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responsePayload)
      });
      return res.json();
    }
    await mockLatency(90);
    return { requestId, ...responsePayload, replied: true };
  }
};
