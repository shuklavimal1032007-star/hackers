# AEGIS-AI | Event Command Centre & Crowd Intelligence Platform

A high-performance, dark-themed operational intelligence frontend engineered for high-concurrency event monitoring, real-time spatial density tracking, predictive bottleneck forecasting, and autonomous safety directives.

Built specifically for hackathon demonstrations with realistic synthetic data, reactive state synchronization, and enterprise REST API readiness.

---

## 🚀 Live Tech Stack

* **Framework:** React 18.3.1 (Fast Refresh, StrictMode)
* **Build Tool:** Vite 6
* **Routing:** React Router DOM 6.28.0 (Client-side single-page routing)
* **Styling:** Tailwind CSS 3.4.16 (Custom tactical dark palette, grid styling, neon glow badges)
* **Charts & Visualizations:** Recharts 2.15.0 (Area charts, bar charts, line charts, donut risk gauges)
* **Icons:** Lucide React 0.468.0

---

## 📋 10 Comprehensive Working Sections

1. **Dashboard (`/`):**
   * Real-time metrics: Complex Occupancy, Congestion Queues, Critical Incidents, Active Volunteers.
   * Dual-mode interactive Recharts visualization: Occupancy vs safety capacity, queue depths.
   * Operational Risk Index donut gauge (Normal / Warning / Critical).
   * Predictive historical & forecast crowd inflow curve.
   * Sector cards with one-click **Simulate Crowd Surge** buttons.
   * Live immutable activity log feed.

2. **Events Schedule (`/events`):**
   * Complete event roster with categories, registered headcounts, schedules, and venues.
   * Instant search and multi-criteria filters (Category & Status).
   * Working **Create Event**, **Edit Event**, and **Delete Event** (with confirmation dialog).
   * Detailed Event Briefing inspection modal.

3. **Venue Monitoring (`/venues`):**
   * Visual capacity meters, queue backlogs, gate apertures, and risk indices across 8 sectors.
   * Active **Simulate Crowd Surge** button on every single venue.
   * Venue inspect dossier featuring sensor arrays (Ambient Temperature, CO2 levels, Optical Camera channels, and evacuation clearance times).

4. **Risk Intelligence (`/risk-intelligence`):**
   * Deterministic safety calculation model based on NFPA 101 Life Safety Code standards.
   * Transparent breakdown: Occupancy Pressure (45%), Queue Bottleneck (25%), Inflow Imbalance (20%), Gate Density (10%).
   * Multi-variable time-series comparison chart (Actual Pax vs Forecast Pax vs Risk Score).
   * Explicit forecast model assumptions and safety threshold protocols.

5. **Incidents & Alerts (`/incidents`):**
   * Live incident table with severity (Critical, Warning, Info) and status (Open, In Progress, Resolved).
   * Severity & status filters + keyword search.
   * Detailed Incident Dossier modal displaying Computer Vision optical evidence.
   * Status transition workflow (Open ➔ In Progress ➔ Resolved) with operational notes.
   * **Report Field Incident** modal form.

6. **AI Safety Directives (`/recommendations`):**
   * AI-generated queue rebalancing, gate redirection, and volunteer wave recommendations.
   * Supporting sensor telemetry points and projected flow impact calculations.
   * **Approve Directive:** Requires human confirmation modal, applies physical venue queue relief, and generates an audit log.
   * **Reject Directive:** Requires mandatory operator justification with quick presets to fine-tune AI alignment.
   * Decision deduplication prevention.

7. **Volunteer Management (`/volunteers`):**
   * Staff roster with avatars, roles, certified skills, and shift statuses.
   * **Assign Sector Modal:** Conflict-prevention logic prevents double assignments and enforces sector personnel limits.
   * Release to Roving Pool button.
   * Skill and status filters.

8. **Audit Trail (`/audit-logs`):**
   * Immutable chronological activity log tracking all surge simulations, approvals, overrides, and threshold alarms.
   * Filtering by Category and Severity.
   * One-click JSON copy and complete audit export.

9. **Notifications Tray (`/notifications`):**
   * Interactive notification stream with unread highlights.
   * Mark-as-read, Mark-all-read, and Clear Tray controls.
   * Click-to-navigate directly to related incident, venue, or directive pages.

10. **Settings & Profile (`/settings`):**
    * Incident Commander profile credentials editor.
    * Configurable refresh rate, simulation speed, and layout density.
    * Safety alarm escalation threshold sliders.
    * Future Spring Boot REST API base URL configuration (`http://localhost:8080/api/v1`).
    * **Reset Demo Data:** Restores pristine scenario state with confirmation.

---

## ⚡ Instant Setup & Execution

```bash
# 1. Install dependencies
npm install

# 2. Launch local Vite development server
npm run dev

# 3. Build production bundle
npm run build
```

Open `http://localhost:5173` in your browser.

---

## 🛡️ Hackathon Operational Demo Notice

* All telemetry feeds, crowd counts, risk metrics, and AI recommendations are generated using realistic synthetic models.
* The frontend includes a dedicated REST API service layer (`src/services/api.js`) ready to interface directly with a Java Spring Boot backend without refactoring UI components.
