// Plan-Limits & serverseitige Prüfungen (Lemon Squeezy Vorbereitung).
import { PLANS } from "./constants";
import type { PlanId } from "./types";

export function getPlanMeta(plan: string) {
  return PLANS[(plan as PlanId)] ?? PLANS.FREE;
}

export interface PlanLimitCheck {
  allowed: boolean;
  reason?: string;
  limit: number | null;
  current: number;
}

// Darf der Nutzer ein weiteres Projekt anlegen?
export function canCreateProject(plan: string, currentProjectCount: number): PlanLimitCheck {
  const meta = getPlanMeta(plan);
  const limit = meta.maxProjects;
  if (limit === null) {
    return { allowed: true, limit: null, current: currentProjectCount };
  }
  const allowed = currentProjectCount < limit;
  return {
    allowed,
    limit,
    current: currentProjectCount,
    reason: allowed
      ? undefined
      : `Plan-Limit erreicht: Dein Plan "${meta.name}" erlaubt maximal ${limit} Projekte. Bitte upgraden.`,
  };
}

// Wie viele Clips dürfen pro Projekt generiert werden?
export function maxClipsForPlan(plan: string): number {
  return getPlanMeta(plan).maxClipsPerProject;
}

// Begrenzt eine gewünschte Clip-Anzahl auf das Plan-Limit.
export function clampClipCount(plan: string, requested: number): number {
  const max = maxClipsForPlan(plan);
  const safe = Math.max(1, Math.floor(requested || 0));
  return Math.min(safe, max);
}

export function planSupportsTeam(plan: string): boolean {
  return getPlanMeta(plan).team;
}
