import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import CommandLayout from './components/layout/CommandLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import VenueMonitoringPage from './pages/VenueMonitoringPage';
import RiskIntelligencePage from './pages/RiskIntelligencePage';
import IncidentsAlertsPage from './pages/IncidentsAlertsPage';
import AiRecommendationsPage from './pages/AiRecommendationsPage';
import VolunteerManagementPage from './pages/VolunteerManagementPage';
import BusFleetPage from './pages/BusFleetPage';
import VolunteerPortalPage from './pages/VolunteerPortalPage';
import ParticipantPortalPage from './pages/ParticipantPortalPage';
import AdminSupportTicketsPage from './pages/AdminSupportTicketsPage';
import AdminResourceRequestsPage from './pages/AdminResourceRequestsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import LandingHomePage from './pages/LandingHomePage';
import OrganiserDashboardPage from './pages/OrganiserDashboardPage';
import VolunteerInvitePage from './pages/VolunteerInvitePage';

/*
 * ──────────────────────────────────────────────────────────────
 *  ROLE-BASED ACCESS MATRIX
 * ──────────────────────────────────────────────────────────────
 *  Route                    │ Admin │ Organiser │ Volunteer │ Participant
 *  ─────────────────────────┼───────┼───────────┼───────────┼────────────
 *  /admin-dashboard         │  ✅   │     ❌    │    ❌     │     ❌
 *  /organiser-dashboard     │  ✅   │     ✅    │    ❌     │     ❌
 *  /volunteer-portal        │  ✅   │     ❌    │    ✅     │     ❌
 *  /participant-portal      │  ✅   │     ❌    │    ❌     │     ✅
 *  /events                  │  ✅   │     ✅    │    ✅     │     ✅
 *  /venues                  │  ✅   │     ❌    │    ❌     │     ✅
 *  /risk-intelligence       │  ✅   │     ❌    │    ❌     │     ❌
 *  /incidents               │  ✅   │     ❌    │    ✅     │     ❌
 *  /recommendations         │  ✅   │     ❌    │    ❌     │     ❌
 *  /volunteers              │  ✅   │     ✅    │    ❌     │     ❌
 *  /bus-fleet               │  ✅   │     ✅    │    ✅     │     ❌
 *  /support-tickets         │  ✅   │     ✅    │    ❌     │     ✅
 *  /resource-requests       │  ✅   │     ✅    │    ✅     │     ❌
 *  /audit-logs              │  ✅   │     ❌    │    ❌     │     ❌
 *  /notifications           │  ✅   │     ✅    │    ✅     │     ✅
 *  /settings                │  ✅   │     ❌    │    ❌     │     ❌
 * ──────────────────────────────────────────────────────────────
 */

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes — No role restriction */}
          <Route path="/" element={<LandingHomePage />} />
          <Route path="/home" element={<LandingHomePage />} />
          <Route path="/volunteer-invite" element={<VolunteerInvitePage />} />

          {/* Protected Operational Workspaces with CommandLayout (Sidebar + Header) */}
          <Route element={<CommandLayout />}>

            {/* ── ADMIN-ONLY ROUTES ──────────────────────────────── */}
            <Route path="admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="admin-dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="command" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="risk-intelligence" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RiskIntelligencePage />
              </ProtectedRoute>
            } />
            <Route path="recommendations" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AiRecommendationsPage />
              </ProtectedRoute>
            } />
            <Route path="audit-logs" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AuditLogsPage />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SettingsPage />
              </ProtectedRoute>
            } />

            {/* ── ORGANISER ROUTES (Admin + Organiser) ──────────── */}
            <Route path="organiser-dashboard" element={
              <ProtectedRoute allowedRoles={['admin', 'organiser']}>
                <OrganiserDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="volunteers" element={
              <ProtectedRoute allowedRoles={['admin', 'organiser']}>
                <VolunteerManagementPage />
              </ProtectedRoute>
            } />

            {/* ── VOLUNTEER PORTAL (Admin + Volunteer) ──────────── */}
            <Route path="volunteer-portal" element={
              <ProtectedRoute allowedRoles={['admin', 'volunteer']}>
                <VolunteerPortalPage />
              </ProtectedRoute>
            } />

            {/* ── PARTICIPANT PORTAL (Admin + Participant) ──────── */}
            <Route path="participant-portal" element={
              <ProtectedRoute allowedRoles={['admin', 'participant']}>
                <ParticipantPortalPage />
              </ProtectedRoute>
            } />

            {/* ── SHARED: Admin + Organiser + Volunteer ──────────── */}
            <Route path="bus-fleet" element={
              <ProtectedRoute allowedRoles={['admin', 'organiser', 'volunteer']}>
                <BusFleetPage />
              </ProtectedRoute>
            } />
            <Route path="resource-requests" element={
              <ProtectedRoute allowedRoles={['admin', 'organiser', 'volunteer']}>
                <AdminResourceRequestsPage />
              </ProtectedRoute>
            } />
            <Route path="incidents" element={
              <ProtectedRoute allowedRoles={['admin', 'volunteer']}>
                <IncidentsAlertsPage />
              </ProtectedRoute>
            } />

            {/* ── SHARED: Admin + Organiser + Participant ────────── */}
            <Route path="support-tickets" element={
              <ProtectedRoute allowedRoles={['admin', 'organiser', 'participant']}>
                <AdminSupportTicketsPage />
              </ProtectedRoute>
            } />
            <Route path="venues" element={
              <ProtectedRoute allowedRoles={['admin', 'participant']}>
                <VenueMonitoringPage />
              </ProtectedRoute>
            } />

            {/* ── SHARED: All Authenticated Roles ────────────────── */}
            <Route path="events" element={
              <ProtectedRoute allowedRoles={['admin', 'organiser', 'volunteer', 'participant']}>
                <EventsPage />
              </ProtectedRoute>
            } />
            <Route path="notifications" element={
              <ProtectedRoute allowedRoles={['admin', 'organiser', 'volunteer']}>
                <NotificationsPage />
              </ProtectedRoute>
            } />

            {/* ── FALLBACK: Redirect unknown routes ──────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
