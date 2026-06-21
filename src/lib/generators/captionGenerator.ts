// Erzeugt Captions und Call-to-Actions passend zu Ton, Plattform und Sprache.
import type { Language, PlatformId } from "../types";

type CtaStyle = "direkt" | "soft" | "frage" | "fomo" | string;

const CTA_DE: Record<string, string> = {
  direkt: "Folge für mehr Tipps wie diesen. 🚀",
  soft: "Was sind deine Erfahrungen damit? 👇",
  frage: "Welcher Punkt war neu für dich? Schreib's in die Kommentare. 💬",
  fomo: "Speichere das Video, bevor es untergeht. 🔖",
};

const CTA_EN: Record<string, string> = {
  direkt: "Follow for more tips like this. 🚀",
  soft: "What's your experience with this? 👇",
  frage: "Which point was new to you? Drop it in the comments. 💬",
  fomo: "Save this before it gets buried. 🔖",
};

export function generateCTA(style: CtaStyle = "direkt", language: Language = "de", platform?: PlatformId): string {
  const map = language === "en" ? CTA_EN : CTA_DE;
  // LinkedIn: professioneller, Kommentar-orientiert
  if (platform === "linkedin") {
    return language === "en"
      ? "How do you handle this in your business? Curious about your take. 👇"
      : "Wie löst du das in deinem Business? Ich bin gespannt auf deine Sicht. 👇";
  }
  // Snapchat: sehr kurz
  if (platform === "snapchat") {
    return language === "en" ? "Swipe up. 👻" : "Swipe up. 👻";
  }
  return map[style] ?? map.direkt;
}

const EMOJIS_BY_TONE: Record<string, string> = {
  locker: "✨",
  professionell: "→",
  inspirierend: "🔥",
  humorvoll: "😅",
  direkt: "⚡",
  edukativ: "🧠",
};

export interface CaptionInput {
  core: string;
  topic: string;
  hook: string;
  tone: string;
  platform: PlatformId;
  language?: Language;
  ctaStyle?: CtaStyle;
  audience?: string;
}

export function generateCaption(input: CaptionInput): string {
  const { core, hook, tone, platform } = input;
  const language = input.language ?? "de";
  const emoji = EMOJIS_BY_TONE[tone] ?? "✨";
  const cta = generateCTA(input.ctaStyle, language, platform);

  // Snapchat: sehr kurze, direkte Caption
  if (platform === "snapchat") {
    return `${core} ${emoji}`.trim();
  }

  // LinkedIn: professioneller, mit Business-Kontext
  if (platform === "linkedin") {
    const intro = language === "en" ? "A quick thought:" : "Ein kurzer Gedanke:";
    return `${intro} ${core}\n\n${cta}`.trim();
  }

  // TikTok / Reels / Shorts
  const line2 = language === "en" ? "Here's the part most people miss." : "Genau diesen Teil übersehen die meisten.";
  return `${hook} ${emoji}\n\n${core}\n${line2}\n\n${cta}`.trim();
}
