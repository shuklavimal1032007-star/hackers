/**
 * AEGIS-AI Transparent Risk Scoring Engine
 * Computes deterministic operational safety risk indices (0 - 100)
 * based on venue capacity, real-time occupancy, queue size, egress throughput, and flow differential.
 */

export function calculateVenueRisk(venue) {
  if (!venue) return { score: 0, level: 'Normal', factors: [] };

  const {
    capacity = 1000,
    currentOccupancy = 0,
    queueSize = 0,
    inflowRate = 50,
    outflowRate = 50,
    egressGates = 2
  } = venue;

  // 1. Occupancy Pressure (Weight: 45 pts max)
  const occRatio = currentOccupancy / Math.max(capacity, 1);
  let occScore = 0;
  if (occRatio < 0.6) {
    occScore = occRatio * 35; // 0 - 21 pts
  } else if (occRatio < 0.8) {
    occScore = 21 + (occRatio - 0.6) * 60; // 21 - 33 pts
  } else if (occRatio < 0.92) {
    occScore = 33 + (occRatio - 0.8) * 75; // 33 - 42 pts
  } else {
    // Non-linear critical escalation above 92%
    occScore = 42 + Math.min(3, (occRatio - 0.92) * 37.5); // up to 45 pts
  }

  // 2. Queue Bottleneck Pressure (Weight: 25 pts max)
  // Nominal gate clearing rate is ~40 people/gate/minute
  const estimatedGateDischargeRate = Math.max(egressGates * 35, 30);
  const queueClearanceMinutes = queueSize / estimatedGateDischargeRate;
  let queueScore = 0;
  if (queueClearanceMinutes < 3) {
    queueScore = queueClearanceMinutes * 2; // 0 - 6 pts
  } else if (queueClearanceMinutes < 8) {
    queueScore = 6 + (queueClearanceMinutes - 3) * 2.2; // 6 - 17 pts
  } else {
    queueScore = Math.min(25, 17 + (queueClearanceMinutes - 8) * 1.5); // up to 25 pts
  }

  // 3. Flow Imbalance Rate (Weight: 20 pts max)
  // When inflow exceeds outflow, pressure accumulates inside venue
  const flowDelta = inflowRate - outflowRate;
  let flowScore = 0;
  if (flowDelta > 0) {
    flowScore = Math.min(20, (flowDelta / 15) * 5);
  } else {
    // Flow is discharging safely
    flowScore = Math.max(0, 3 + (flowDelta / 30));
  }

  // 4. Physical Gate Density Penalty (Weight: 10 pts max)
  // Low number of egress gates relative to high crowd increases crush danger
  const attendeesPerGate = currentOccupancy / Math.max(egressGates, 1);
  let gateScore = 0;
  if (attendeesPerGate > 2500) {
    gateScore = 10;
  } else if (attendeesPerGate > 1500) {
    gateScore = 6;
  } else if (attendeesPerGate > 800) {
    gateScore = 3;
  } else {
    gateScore = 1;
  }

  const rawScore = Math.round(occScore + queueScore + flowScore + gateScore);
  const finalScore = Math.min(100, Math.max(0, rawScore));

  const level = getRiskLevel(finalScore);

  return {
    score: finalScore,
    level,
    breakdown: {
      occupancy: Math.round(occScore),
      queue: Math.round(queueScore),
      flowDelta: Math.round(flowScore),
      gateDensity: Math.round(gateScore)
    },
    metrics: {
      occRatio: (occRatio * 100).toFixed(1),
      queueClearanceMinutes: queueClearanceMinutes.toFixed(1),
      flowDelta
    }
  };
}

export function getRiskLevel(score) {
  if (score >= 70) return 'Critical';
  if (score >= 40) return 'Warning';
  return 'Normal';
}

export function getRiskColorClass(levelOrScore) {
  const level = typeof levelOrScore === 'number' ? getRiskLevel(levelOrScore) : levelOrScore;
  switch (level) {
    case 'Critical':
      return {
        badgeBg: 'bg-rose-500/15',
        badgeText: 'text-rose-400',
        badgeBorder: 'border-rose-500/30',
        text: 'text-rose-400',
        bg: 'bg-rose-500',
        border: 'border-rose-500/40',
        hex: '#f43f5e'
      };
    case 'Warning':
      return {
        badgeBg: 'bg-amber-500/15',
        badgeText: 'text-amber-400',
        badgeBorder: 'border-amber-500/30',
        text: 'text-amber-400',
        bg: 'bg-amber-500',
        border: 'border-amber-500/40',
        hex: '#f59e0b'
      };
    case 'Normal':
    default:
      return {
        badgeBg: 'bg-emerald-500/15',
        badgeText: 'text-emerald-400',
        badgeBorder: 'border-emerald-500/30',
        text: 'text-emerald-400',
        bg: 'bg-emerald-500',
        border: 'border-emerald-500/40',
        hex: '#10b981'
      };
  }
}

export function calculateOverallSystemRisk(venues = []) {
  if (!venues || venues.length === 0) return { score: 0, level: 'Normal', avgOccupancy: 0 };

  let totalOccupancy = 0;
  let totalCapacity = 0;
  let weightedRiskSum = 0;

  venues.forEach(v => {
    const risk = calculateVenueRisk(v);
    const cap = v.capacity || 1000;
    totalOccupancy += (v.currentOccupancy || 0);
    totalCapacity += cap;
    weightedRiskSum += risk.score * cap;
  });

  const aggregateScore = Math.round(weightedRiskSum / Math.max(totalCapacity, 1));
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

  return {
    score: aggregateScore,
    level: getRiskLevel(aggregateScore),
    totalOccupancy,
    totalCapacity,
    avgOccupancy
  };
}
