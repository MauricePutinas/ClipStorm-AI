// Generiert plattformpassende Hashtags aus Keywords, Nische und Plattform.
import type { Language, PlatformId } from "../types";
import { toCamelHashtag } from "./textUtils";

const PLATFORM_TAGS: Record<PlatformId, string[]> = {
  tiktok: ["fyp", "foryou", "viral", "tiktokdeutschland"],
  reels: ["reels", "instagram", "explore", "reelsinstagram"],
  shorts: ["shorts", "youtubeshorts", "shortsvideo"],
  linkedin: ["linkedin", "business", "karriere"],
  snapchat: ["snapchat", "spotlight", "snap"],
};

const GENERIC_DE = ["content", "creator", "tipps", "lernen", "motivation"];
const GENERIC_EN = ["content", "creator", "tips", "learn", "motivation"];

export interface HashtagInput {
  keywords: string[];
  niche?: string;
  platform: PlatformId;
  language?: Language;
  count?: number;
  avoidWords?: string[];
}

export function generateHashtags(input: HashtagInput): string[] {
  const { keywords, niche, platform } = input;
  const count = input.count ?? 8;
  const language = input.language ?? "de";
  const avoid = new Set((input.avoidWords ?? []).map((w) => w.toLowerCase().replace(/[^a-z0-9]/gi, "")));

  const candidates: string[] = [];

  // 1. Keyword-Hashtags
  for (const k of keywords) {
    const tag = toCamelHashtag(k);
    if (tag.length >= 3) candidates.push(tag);
  }

  // 2. Nische
  if (niche) {
    const nicheTag = toCamelHashtag(niche);
    if (nicheTag.length >= 3) candidates.push(nicheTag);
  }

  // 3. Plattform-spezifisch
  candidates.push(...(PLATFORM_TAGS[platform] ?? []));

  // 4. Generische Reichweiten-Tags
  candidates.push(...(language === "en" ? GENERIC_EN : GENERIC_DE));

  // Dedupe + avoid-Filter + Normalisierung
  const seen = new Set<string>();
  const result: string[] = [];
  for (const c of candidates) {
    const clean = c.replace(/[^a-z0-9äöüß]/gi, "");
    if (!clean) continue;
    const lower = clean.toLowerCase();
    if (seen.has(lower)) continue;
    if (avoid.has(lower)) continue;
    seen.add(lower);
    result.push(`#${clean.charAt(0).toLowerCase() + clean.slice(1)}`);
    if (result.length >= count) break;
  }
  return result;
}

export function hashtagsToString(tags: string[]): string {
  return tags.join(" ");
}
