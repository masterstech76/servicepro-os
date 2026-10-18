import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export interface DispatchScoringWeights {
  loadPerJob: number; // default 15
  travelPerMin: number; // default 0.5
  clusterBonus: number; // default 10
  exactSkillBonus: number; // default 5
}

export const DEFAULT_DISPATCH_WEIGHTS: DispatchScoringWeights = {
  loadPerJob: 15,
  travelPerMin: 0.5,
  clusterBonus: 10,
  exactSkillBonus: 5,
};

export interface CandidateTechInput {
  id: string;
  name: string;
  color: string;
  active: boolean;
  skills: string[];
  zipCodes: string[]; // empty = covers all
  workingWindow: { start: string; end: string } | null; // HH:mm in business tz
  timeOffRanges: Array<{ startsAt: string; endsAt: string }>;
  existingJobsThatDay: Array<{
    id: string;
    jobNumber: number;
    scheduledStart: string;
    scheduledEnd: string;
    zip: string;
    lat?: number | null;
    lng?: number | null;
  }>;
  travelMinutesFromPreviousStop: number;
  travelMinutesToNextStop: number;
  revenueSoFarThisWeekCents: number;
}

export interface TargetJobInput {
  id: string;
  serviceSkillTag: string;
  zip: string;
  scheduledStart: string;
  scheduledEnd: string;
  bufferMinutes: number;
  timezone: string;
}

export interface TechSuggestionBreakdown {
  load: number;
  travelPrev: number;
  travelNext: number;
  cluster: number;
  skill: number;
}

export interface TechSuggestionResult {
  technicianId: string;
  technicianName: string;
  color: string;
  eligible: boolean;
  hasConflict: boolean;
  score: number;
  breakdown: TechSuggestionBreakdown;
  conflicts: Array<{ jobId: string; jobNumber: number }>;
  reason?: string;
}

/**
 * Haversine distance in miles between two coordinates
 */
export function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Haversine travel-time fallback per BUILD_PLAN Section 13:
 * haversine_miles * 1.4 / 30 mph * 60
 */
export function estimateTravelMinutesHaversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const miles = haversineMiles(lat1, lng1, lat2, lng2);
  return Math.round(((miles * 1.4) / 30) * 60);
}

/**
 * Evaluates and ranks technicians for a target job per BUILD_PLAN Section 13:
 * score = 100
 *       - 15 * jobsAlreadyThatDay
 *       - 0.5 * travelMinutesFromPreviousStop
 *       - 0.5 * travelMinutesToNextStop
 *       + 10 * (techAlreadyInZipThatDay ? 1 : 0)
 *       + 5  * (exactSkillMatch ? 1 : 0)
 *       tiebreak: lower revenueSoFarThisWeekCents wins
 */
export function scoreAndRankTechnicians(
  job: TargetJobInput,
  techs: CandidateTechInput[],
  weights: DispatchScoringWeights = DEFAULT_DISPATCH_WEIGHTS
): TechSuggestionResult[] {
  const startMs = new Date(job.scheduledStart).getTime();
  const endMs = new Date(job.scheduledEnd).getTime();
  const occEndMs = endMs + job.bufferMinutes * 60 * 1000;
  const localDate = formatInTimeZone(new Date(startMs), job.timezone, "yyyy-MM-dd");

  const results: Array<TechSuggestionResult & { revenueTiebreak: number }> = [];

  for (const tech of techs) {
    const jobsOther = tech.existingJobsThatDay.filter((j) => j.id !== job.id);
    const jobsAlreadyThatDay = jobsOther.length;
    const techAlreadyInZip = jobsOther.some((j) => j.zip === job.zip);
    const exactSkillMatch = tech.skills[0] === job.serviceSkillTag;

    const loadPenalty = jobsAlreadyThatDay > 0 ? -weights.loadPerJob * jobsAlreadyThatDay : 0;
    const travelPrevPenalty =
      tech.travelMinutesFromPreviousStop > 0
        ? -weights.travelPerMin * tech.travelMinutesFromPreviousStop
        : 0;
    const travelNextPenalty =
      tech.travelMinutesToNextStop > 0
        ? -weights.travelPerMin * tech.travelMinutesToNextStop
        : 0;
    const clusterBonus = techAlreadyInZip ? weights.clusterBonus : 0;
    const skillBonus = exactSkillMatch ? weights.exactSkillBonus : 0;

    const rawScore =
      100 +
      loadPenalty +
      travelPrevPenalty +
      travelNextPenalty +
      clusterBonus +
      skillBonus;
    const score = Math.round(rawScore * 10) / 10;

    const breakdown: TechSuggestionBreakdown = {
      load: loadPenalty,
      travelPrev: travelPrevPenalty,
      travelNext: travelNextPenalty,
      cluster: clusterBonus,
      skill: skillBonus,
    };

    // Check hard eligibility constraints
    let ineligibleReason: string | undefined;

    if (!tech.active) {
      ineligibleReason = "Inactive technician";
    } else if (!tech.skills.includes(job.serviceSkillTag)) {
      ineligibleReason = `Missing ${job.serviceSkillTag.toUpperCase()} skill`;
    } else if (tech.zipCodes.length > 0 && !tech.zipCodes.includes(job.zip)) {
      ineligibleReason = "Outside coverage";
    } else if (!tech.workingWindow) {
      ineligibleReason = "Off duty today";
    } else {
      const workStartMs = fromZonedTime(
        `${localDate}T${tech.workingWindow.start}:00`,
        job.timezone
      ).getTime();
      const workEndMs = fromZonedTime(
        `${localDate}T${tech.workingWindow.end}:00`,
        job.timezone
      ).getTime();

      if (startMs < workStartMs || endMs > workEndMs) {
        ineligibleReason = `Outside working hours (${tech.workingWindow.start}–${tech.workingWindow.end})`;
      }
    }

    if (!ineligibleReason) {
      const hasTimeOff = tech.timeOffRanges.some(
        (t) =>
          new Date(t.startsAt).getTime() < endMs &&
          new Date(t.endsAt).getTime() > startMs
      );
      if (hasTimeOff) {
        ineligibleReason = "Time off";
      }
    }

    // Check overlapping jobs in [start, end + buffer)
    const conflicts: Array<{ jobId: string; jobNumber: number }> = [];
    for (const other of jobsOther) {
      const otherStartMs = new Date(other.scheduledStart).getTime();
      const otherOccEndMs =
        new Date(other.scheduledEnd).getTime() + job.bufferMinutes * 60 * 1000;
      if (otherStartMs < occEndMs && otherOccEndMs > startMs) {
        conflicts.push({ jobId: other.id, jobNumber: other.jobNumber });
      }
    }

    const hasConflict = conflicts.length > 0;
    if (!ineligibleReason && hasConflict) {
      ineligibleReason = `Overlaps job #${conflicts[0].jobNumber}`;
    }

    results.push({
      technicianId: tech.id,
      technicianName: tech.name,
      color: tech.color,
      eligible: !ineligibleReason,
      hasConflict: !ineligibleReason ? false : hasConflict && ineligibleReason.startsWith("Overlaps"),
      score: ineligibleReason && !ineligibleReason.startsWith("Overlaps") ? -1 : score,
      breakdown,
      conflicts,
      reason: ineligibleReason,
      revenueTiebreak: tech.revenueSoFarThisWeekCents,
    });
  }

  // Sort: eligible first, then conflict-only, then ineligible; higher score wins; lower weekly revenue breaks ties
  results.sort((a, b) => {
    const rankGroup = (r: TechSuggestionResult) =>
      r.eligible ? 0 : r.hasConflict ? 1 : 2;
    const ga = rankGroup(a);
    const gb = rankGroup(b);
    if (ga !== gb) return ga - gb;
    if (b.score !== a.score) return b.score - a.score;
    return a.revenueTiebreak - b.revenueTiebreak;
  });

  return results.map(({ revenueTiebreak: _tie, ...rest }) => rest);
}
