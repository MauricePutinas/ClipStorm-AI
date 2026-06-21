// Berechnet das Viral-Potenzial (0–100) und den Schwierigkeitsgrad eines Clips.
import type { Difficulty, PlatformId } from "../types";
import { analyzeSignals } from "./textUtils";

export interface ScoreInput {
  hook: string;
  title: string;
  caption: string;
  text: string;
  hashtags: string[];
  lengthSec: number;
  platform: PlatformId;
  baseScore?: number;
}

// Plattform-spezifische Idealwerte für die Clip-Länge.
const PLATFORM_IDEAL_LENGTH: Record<PlatformId, number[]> = {
  tiktok: [15, 30],
  reels: [15, 30],
  shorts: [30, 60],
  linkedin: [60],
  snapchat: [15],
};

export function calculateViralScore(input: ScoreInput): number {
  const hookSignals = analyzeSignals(input.hook);
  const textSignals = analyzeSignals(input.text);

  let score = input.baseScore ?? 45;

  // Hook-Qualität ist der wichtigste Faktor
  if (hookSignals.hasNumber) score += 10;
  if (hookSignals.hasQuestion) score += 6;
  score += Math.min(hookSignals.powerCount * 5, 18);

  // Kürze & Knackigkeit des Hooks (ideal < 70 Zeichen)
  if (input.hook.length > 0 && input.hook.length <= 70) score += 8;
  else if (input.hook.length > 130) score -= 6;

  // Inhaltliche Substanz
  if (textSignals.hasNumber) score += 4;
  if (textSignals.isHowto) score += 5;

  // Hashtag-Hygiene (3–8 ist ideal)
  if (input.hashtags.length >= 3 && input.hashtags.length <= 8) score += 5;

  // Plattform-Fit der Länge
  const ideal = PLATFORM_IDEAL_LENGTH[input.platform] ?? [30];
  if (ideal.includes(input.lengthSec)) score += 8;
  else score -= 4;

  // Call-to-Action im Caption-Text
  if (/\b(folge|speichern|kommentier|teile|link|swipe|abonnier|save|follow|comment)\b/i.test(input.caption)) {
    score += 4;
  }

  // Leichtes deterministisches Rauschen über die Hook-Länge (Variation)
  score += (input.hook.length % 5) - 2;

  return Math.max(5, Math.min(99, Math.round(score)));
}

export function difficultyForClip(lengthSec: number, viralScore: number, isHowto: boolean): Difficulty {
  // Längere & how-to-lastige Clips sind aufwändiger zu produzieren.
  let points = 0;
  if (lengthSec >= 60) points += 2;
  else if (lengthSec >= 30) points += 1;
  if (isHowto) points += 1;
  if (viralScore >= 85) points += 1; // hoher Anspruch an die Umsetzung

  if (points >= 3) return "HARD";
  if (points >= 1) return "MEDIUM";
  return "EASY";
}
