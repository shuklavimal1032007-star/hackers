import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/**
 * ProtectedRoute — Role-Based Access Control (RBAC) Guard
 * 
 * Wraps a route element and only renders it if the current user's role
 * is included in the `allowedRoles` array. Otherwise, redirects to
 * the appropriate default dashboard for their role with a toast alert.
 */

// Role display labels
const ROLE_LABELS = {
  admin: 'Admin Command',
  organiser: 'Event Organiser',
  volunteer: 'Field Volunteer',
  participant: 'Participant'
};

// Default landing route for each role when they try to access unauthorized pages
const ROLE_HOME_ROUTES = {
  admin: '/admin-dashboard',
  organiser: '/organiser-dashboard',
  volunteer: '/volunteer-portal',
  participant: '/participant-portal'
};

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentRole, showToast } = useApp();
  const location = useLocation();
  const hasShownToast = useRef(false);

  // If current role is in the allowed list, render the page
  if (allowedRoles.includes(currentRole)) {
    hasShownToast.current = false;
    return children;
  }

  // Show a one-time access denied toast (useRef prevents re-renders from spamming)
  if (!hasShownToast.current) {
    hasShownToast.current = true;
    const roleLabel = ROLE_LABELS[currentRole] || currentRole;
    const allowedLabels = allowedRoles.map(r => ROLE_LABELS[r] || r).join(', ');
    showToast(
      '🔒 Access Restricted',
      `"${location.pathname}" is restricted to: ${allowedLabels}. Your current role (${roleLabel}) does not have permission.`,
      'error'
    );
  }

  // Unauthorized — redirect to the user's own dashboard
  const redirectTo = ROLE_HOME_ROUTES[currentRole] || '/';

  return <Navigate to={redirectTo} replace />;
}
