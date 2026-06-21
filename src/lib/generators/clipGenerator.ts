// Haupt-Generator: erzeugt aus einem Transkript vollständige Clip-Ideen.
import type { ClipLength, GeneratedClip, GenerationContext, Language, PlatformId } from "../types";
import { hashString, mulberry32 } from "../utils";
import {
  buildSegments,
  capitalize,
  coreStatement,
  topKeywords,
  truncateWords,
  type Segment,
} from "./textUtils";
import { generateHook, hookTypeForIndex, topicFromText } from "./hookGenerator";
import { generateCaption, generateCTA } from "./captionGenerator";
import { generateHashtags } from "./hashtagGenerator";
import { calculateViralScore, difficultyForClip } from "./scoreCalculator";

const TITLE_PREFIX_DE: Record<string, (topic: string) => string> = {
  problem: (t) => `Das Problem mit ${t}`,
  shock: (t) => `Die Wahrheit über ${t}`,
  story: (t) => `Mein Weg mit ${t}`,
  numbers: (t) => `Die wichtigsten Fakten zu ${t}`,
  mistake: (t) => `Der größte Fehler bei ${t}`,
  myth: (t) => `Der Mythos über ${t}`,
  nobody: (t) => `Was niemand über ${t} sagt`,
  tested: (t) => `Ich habe ${t} getestet`,
  earlier: (t) => `Was ich über ${t} früher wissen wollte`,
};

const TITLE_PREFIX_EN: Record<string, (topic: string) => string> = {
  problem: (t) => `The problem with ${t}`,
  shock: (t) => `The truth about ${t}`,
  story: (t) => `My journey with ${t}`,
  numbers: (t) => `The key facts about ${t}`,
  mistake: (t) => `The biggest mistake with ${t}`,
  myth: (t) => `The myth about ${t}`,
  nobody: (t) => `What nobody says about ${t}`,
  tested: (t) => `I tested ${t}`,
  earlier: (t) => `What I wish I knew about ${t}`,
};

const CUT_TEMPLATES_DE = [
  "Start mit Close-up auf die Sprecher:in. Harter Cut auf die Kernaussage. Untertitel durchgehend einblenden.",
  "Jump-Cuts alle 2–3 Sekunden. Zoom-In bei der wichtigsten Zahl. Pattern-Interrupt nach dem Hook.",
  "Kalter Einstieg ohne Intro. Text-Overlay synchron zum Gesagten. Am Ende kurzer Freeze-Frame für die CTA.",
  "B-Roll über die ersten 3 Sekunden legen, dann auf Talking-Head schneiden. Betonte Wörter als Overlay highlighten.",
  "Schneller Sprung direkt in die Aussage. Bei Aufzählungen je Punkt ein Cut. Sound-Effekt beim Übergang.",
];

const CUT_TEMPLATES_EN = [
  "Open with a close-up of the speaker. Hard cut to the key statement. Keep subtitles on throughout.",
  "Jump cuts every 2–3 seconds. Zoom in on the key number. Pattern interrupt right after the hook.",
  "Cold open, no intro. Sync text overlay to the words. End on a short freeze-frame for the CTA.",
  "Lay B-roll over the first 3 seconds, then cut to talking head. Highlight stressed words as overlay.",
  "Jump straight into the statement. One cut per list item. Add a transition sound effect.",
];

const BROLL_TEMPLATES_DE = (kw: string) => [
  `Screen-Recording / Beispiel zu „${kw}“`,
  `Stock-Footage passend zu ${kw}`,
  `Whiteboard- oder Notizen-Aufnahme zu ${kw}`,
  `Vorher/Nachher-Vergleich rund um ${kw}`,
  `Detail-Shots & Hände bei der Arbeit (${kw})`,
];

const BROLL_TEMPLATES_EN = (kw: string) => [
  `Screen recording / example about "${kw}"`,
  `Stock footage matching ${kw}`,
  `Whiteboard or notes shot about ${kw}`,
  `Before/after comparison around ${kw}`,
  `Detail shots & hands at work (${kw})`,
];

function pickLength(platform: PlatformId, seed: number): ClipLength {
  const options: Record<PlatformId, ClipLength[]> = {
    tiktok: [15, 30],
    reels: [15, 30],
    shorts: [30, 60],
    linkedin: [60, 30],
    snapchat: [15],
  };
  const arr = options[platform] ?? [30];
  return arr[seed % arr.length];
}

function pickPlatform(platforms: PlatformId[], segment: Segment, index: number): PlatformId {
  const list = platforms.length ? platforms : (["tiktok"] as PlatformId[]);
  // Howto-Inhalte tendenziell auf Shorts/LinkedIn, wenn verfügbar
  if (segment.signals.isHowto) {
    const pref = list.find((p) => p === "shorts" || p === "linkedin");
    if (pref && index % 2 === 0) return pref;
  }
  return list[index % list.length];
}

function makeTitle(topic: string, core: string, hookType: string, language: Language): string {
  const prefixMap = language === "en" ? TITLE_PREFIX_EN : TITLE_PREFIX_DE;
  const prefix = prefixMap[hookType]?.(topic) ?? capitalize(topic);
  return truncateWords(prefix, 9);
}

function sanitize(text: string, avoidWords: string[]): string {
  if (!avoidWords.length) return text;
  let out = text;
  for (const w of avoidWords) {
    if (!w.trim()) continue;
    const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    out = out.replace(re, "—");
  }
  return out.replace(/\s+—\s+/g, " ").trim();
}

export function defaultClipCount(transcript: string): number {
  const segs = buildSegments(transcript).length;
  return Math.max(10, Math.min(20, segs >= 10 ? 18 : segs + 8));
}

export function generateClips(ctx: GenerationContext): GeneratedClip[] {
  const language: Language = ctx.language ?? "de";
  const platforms = (ctx.platforms && ctx.platforms.length ? ctx.platforms : ["tiktok"]) as PlatformId[];
  const avoidWords = ctx.avoidWords ?? [];
  const count = Math.max(1, Math.min(30, ctx.count ?? defaultClipCount(ctx.transcript)));

  const segments = buildSegments(ctx.transcript);
  const ranked = [...segments].sort((a, b) => b.baseScore - a.baseScore);
  if (ranked.length === 0) {
    return [];
  }

  const rng = mulberry32(hashString(ctx.transcript || "clipstorm"));
  const clips: GeneratedClip[] = [];
  const usedTitles = new Set<string>();

  for (let i = 0; i < count; i++) {
    const segment = ranked[i % ranked.length];
    const seed = Math.floor(rng() * 100000) + i;
    const hookType = hookTypeForIndex(i);
    const platform = pickPlatform(platforms, segment, i);
    const lengthSec = pickLength(platform, seed);

    const topic = topicFromText(segment.text, ctx.niche || "dein Thema");
    const core = coreStatement(segment.text, 170);
    const keywords = segment.keywords.length ? segment.keywords : topKeywords(segment.text, 4);
    const primaryKw = keywords[0] ? capitalize(keywords[0]) : topic;

    let title = makeTitle(topic, core, hookType, language);
    // Doppelte Titel vermeiden
    if (usedTitles.has(title.toLowerCase())) {
      title = `${title} – Teil ${i + 1}`;
    }
    usedTitles.add(title.toLowerCase());

    const hook = generateHook({ text: segment.text, topic, type: hookType, language, seed });

    const description =
      language === "en"
        ? `${core} Turn this moment into a punchy ${lengthSec}s clip for ${platform}.`
        : `${core} Mach aus diesem Moment einen knackigen ${lengthSec}s-Clip für ${platform}.`;

    const textOverlay = truncateWords(hook, 6).replace(/[.…]+$/, "").toUpperCase();

    const caption = generateCaption({
      core,
      topic,
      hook,
      tone: ctx.tone ?? "locker",
      platform,
      language,
      ctaStyle: ctx.ctaStyle,
      audience: ctx.audience,
    });

    const hashtags = generateHashtags({
      keywords,
      niche: ctx.niche,
      platform,
      language,
      count: platform === "linkedin" ? 4 : 8,
      avoidWords,
    });

    const cutTemplates = language === "en" ? CUT_TEMPLATES_EN : CUT_TEMPLATES_DE;
    const cutInstruction = cutTemplates[seed % cutTemplates.length];

    const brollTemplates = (language === "en" ? BROLL_TEMPLATES_EN : BROLL_TEMPLATES_DE)(primaryKw);
    const bRoll = brollTemplates[seed % brollTemplates.length];

    const cta = generateCTA(ctx.ctaStyle, language, platform);

    const viralScore = calculateViralScore({
      hook,
      title,
      caption,
      text: segment.text,
      hashtags,
      lengthSec,
      platform,
      baseScore: segment.baseScore,
    });

    const difficulty = difficultyForClip(lengthSec, viralScore, segment.signals.isHowto);

    clips.push({
      title: sanitize(title, avoidWords),
      hook: sanitize(hook, avoidWords),
      description: sanitize(description, avoidWords),
      recommendedPlatform: platform,
      lengthSec,
      textOverlay: sanitize(textOverlay, avoidWords),
      caption: sanitize(caption, avoidWords),
      hashtags,
      cutInstruction,
      bRoll,
      cta: sanitize(cta, avoidWords),
      viralScore,
      difficulty,
    });
  }

  // Nach Viral-Score sortieren (stärkste Ideen zuerst)
  return clips.sort((a, b) => b.viralScore - a.viralScore);
}
