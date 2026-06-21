// Gemeinsame TypeScript-Typen für ClipStorm AI.
// Diese Typen bilden den Vertrag zwischen Generatoren, AI-Provider, API und UI.

export type PlatformId = "tiktok" | "reels" | "shorts" | "linkedin" | "snapchat";
export type Language = "de" | "en";
export type ClipLength = 15 | 30 | 60;
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type ClipStatus = "IDEA" | "SELECTED" | "PLANNED" | "PUBLISHED";
export type CalendarStatus = "PLANNED" | "PUBLISHED";
export type ProjectStatus = "DRAFT" | "ANALYZED";
export type PlanId = "FREE" | "CREATOR" | "PRO" | "AGENCY";
export type UserRole = "USER" | "ADMIN";

export type HookType =
  | "problem"
  | "shock"
  | "story"
  | "numbers"
  | "mistake"
  | "myth"
  | "nobody"
  | "tested"
  | "earlier";

// Eingabekontext für die Generierung (von der App zusammengestellt).
export interface GenerationContext {
  transcript: string;
  platforms: PlatformId[];
  tone: string;
  audience: string;
  niche: string;
  language: Language;
  videoLengthSec?: number | null;
  count?: number;
  // Optional aus dem Brand Profile
  avoidWords?: string[];
  ctaStyle?: string;
  brandName?: string;
}

// Eine vollständig generierte Clip-Idee (noch nicht in der DB).
export interface GeneratedClip {
  title: string;
  hook: string;
  description: string;
  recommendedPlatform: PlatformId;
  lengthSec: ClipLength;
  textOverlay: string;
  caption: string;
  hashtags: string[];
  cutInstruction: string;
  bRoll: string;
  cta: string;
  viralScore: number;
  difficulty: Difficulty;
}

export interface HookVariant {
  type: HookType;
  label: string;
  text: string;
}

// Plattform-spezifische Ausgabe eines Clips.
export interface PlatformOutput {
  platform: PlatformId;
  hook: string;
  caption: string;
  hashtags: string[];
  textOverlay: string;
  extra: Record<string, string>;
}

// Minimaler Clip-Input für Plattform-Adapter / Hook-Engine.
export interface ClipSeed {
  title: string;
  hook: string;
  description: string;
  caption: string;
  hashtags: string[];
  cta: string;
  textOverlay: string;
}
