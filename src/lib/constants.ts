// Zentrale Konstanten für ClipStorm AI.
// Werte hier werden in Generatoren, Validierung und UI gemeinsam genutzt.

import type { PlanId, PlatformId } from "./types";

export interface PlatformMeta {
  id: PlatformId;
  label: string;
  short: string;
  color: string; // Tailwind-Textfarbe / Akzent
  badge: string; // Tailwind-Klassen für Badge-Hintergrund
}

export const PLATFORMS: PlatformMeta[] = [
  {
    id: "tiktok",
    label: "TikTok",
    short: "TikTok",
    color: "text-cyan",
    badge: "bg-cyan/10 text-cyan border-cyan/30",
  },
  {
    id: "reels",
    label: "Instagram Reels",
    short: "Reels",
    color: "text-fuchsia-400",
    badge: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30",
  },
  {
    id: "shorts",
    label: "YouTube Shorts",
    short: "Shorts",
    color: "text-red-400",
    badge: "bg-red-500/10 text-red-300 border-red-500/30",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    short: "LinkedIn",
    color: "text-electric",
    badge: "bg-electric/10 text-electric border-electric/30",
  },
  {
    id: "snapchat",
    label: "Snapchat",
    short: "Snapchat",
    color: "text-yellow-300",
    badge: "bg-yellow-400/10 text-yellow-200 border-yellow-400/30",
  },
];

export const PLATFORM_IDS = PLATFORMS.map((p) => p.id) as PlatformId[];

export function platformMeta(id: string): PlatformMeta {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0];
}

export const TONES = [
  { id: "locker", label: "Locker & nahbar" },
  { id: "professionell", label: "Professionell" },
  { id: "inspirierend", label: "Inspirierend" },
  { id: "humorvoll", label: "Humorvoll" },
  { id: "direkt", label: "Direkt & provokant" },
  { id: "edukativ", label: "Edukativ" },
] as const;

export const LANGUAGES = [
  { id: "de", label: "Deutsch" },
  { id: "en", label: "English" },
] as const;

export const CLIP_LENGTHS = [15, 30, 60] as const;

export const DIFFICULTIES = [
  { id: "EASY", label: "Einfach", color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" },
  { id: "MEDIUM", label: "Mittel", color: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
  { id: "HARD", label: "Anspruchsvoll", color: "bg-red-500/10 text-red-300 border-red-500/30" },
] as const;

export const CLIP_STATUS = [
  { id: "IDEA", label: "Idee", color: "bg-slate-500/10 text-slate-300 border-slate-500/30" },
  { id: "SELECTED", label: "Ausgewählt", color: "bg-cyan/10 text-cyan border-cyan/30" },
  { id: "PLANNED", label: "Geplant", color: "bg-electric/10 text-electric border-electric/30" },
  { id: "PUBLISHED", label: "Veröffentlicht", color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" },
] as const;

export const CALENDAR_STATUS = [
  { id: "PLANNED", label: "Geplant", color: "bg-electric/10 text-electric border-electric/30" },
  { id: "PUBLISHED", label: "Veröffentlicht", color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" },
] as const;

export const CTA_STYLES = [
  { id: "direkt", label: "Direkt (Folge mir / Speichern)" },
  { id: "soft", label: "Soft (Was meinst du?)" },
  { id: "frage", label: "Frage (Kommentar-Trigger)" },
  { id: "fomo", label: "FOMO (Verpass es nicht)" },
] as const;

export const HOOK_TYPES = [
  { id: "problem", label: "Problem Hook" },
  { id: "shock", label: "Shock Hook" },
  { id: "story", label: "Story Hook" },
  { id: "numbers", label: "Zahlen Hook" },
  { id: "mistake", label: "Fehler Hook" },
  { id: "myth", label: "Mythos Hook" },
  { id: "nobody", label: '"Niemand spricht darüber" Hook' },
  { id: "tested", label: '"Ich habe X getestet" Hook' },
  { id: "earlier", label: '"3 Dinge früher gewusst" Hook' },
] as const;

export type HookTypeId = (typeof HOOK_TYPES)[number]["id"];

// ---------------------------------------------------------------------------
// Pläne & Limits (Lemon Squeezy Vorbereitung)
// maxProjects / maxClipsPerProject: null bedeutet "unbegrenzt"
// ---------------------------------------------------------------------------
export interface PlanMeta {
  id: PlanId;
  name: string;
  priceMonthly: number;
  currency: string;
  maxProjects: number | null;
  maxClipsPerProject: number;
  team: boolean;
  highlight?: boolean;
  tagline: string;
  features: string[];
  checkoutEnv?: string; // Name der öffentlichen Env-Variable mit der Checkout-URL
}

export const PLANS: Record<PlanId, PlanMeta> = {
  FREE: {
    id: "FREE",
    name: "Free Demo",
    priceMonthly: 0,
    currency: "EUR",
    maxProjects: 3,
    maxClipsPerProject: 10,
    team: false,
    tagline: "Zum Ausprobieren – ohne Risiko",
    features: [
      "3 Projekte",
      "10 Clip-Ideen pro Projekt",
      "Alle Plattform-Versionen",
      "CSV / Markdown / JSON Export",
    ],
  },
  CREATOR: {
    id: "CREATOR",
    name: "Creator",
    priceMonthly: 9,
    currency: "EUR",
    maxProjects: 30,
    maxClipsPerProject: 30,
    team: false,
    highlight: true,
    tagline: "Für aktive Creator & Coaches",
    features: [
      "30 Projekte",
      "30 Clip-Ideen pro Projekt",
      "Hook Engine & Plattform-Anpassung",
      "Content-Kalender",
      "Alle Exporte inkl. Cutter-Export",
    ],
    checkoutEnv: "NEXT_PUBLIC_LEMON_SQUEEZY_CREATOR_CHECKOUT_URL",
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    priceMonthly: 19,
    currency: "EUR",
    maxProjects: null,
    maxClipsPerProject: 30,
    team: false,
    tagline: "Für Power-User & Podcaster",
    features: [
      "Unbegrenzte Projekte",
      "30 Clip-Ideen pro Projekt",
      "Brand Profile",
      "Priorisierte Generierung (Platzhalter)",
      "Alle Funktionen aus Creator",
    ],
    checkoutEnv: "NEXT_PUBLIC_LEMON_SQUEEZY_PRO_CHECKOUT_URL",
  },
  AGENCY: {
    id: "AGENCY",
    name: "Agency",
    priceMonthly: 49,
    currency: "EUR",
    maxProjects: null,
    maxClipsPerProject: 30,
    team: true,
    tagline: "Für Agenturen & Teams",
    features: [
      "Alles aus Pro",
      "Team-Funktionen (Platzhalter)",
      "Mehrere Brand Profiles",
      "Whitelabel-Export (Platzhalter)",
      "Priorisierter Support",
    ],
    checkoutEnv: "NEXT_PUBLIC_LEMON_SQUEEZY_AGENCY_CHECKOUT_URL",
  },
};

export const PLAN_ORDER: PlanId[] = ["FREE", "CREATOR", "PRO", "AGENCY"];

export const DEMO_USER_EMAIL = "demo@clipstorm.ai";
export const AGENCY_USER_EMAIL = "agentur@clipstorm.ai";
