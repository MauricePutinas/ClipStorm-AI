// Plattform-Adapter: passt einen Clip an die jeweilige Plattform an.
import type { GenerationContext, PlatformId, PlatformOutput } from "../types";
import { generateCaption, generateCTA } from "./captionGenerator";
import { generateHashtags } from "./hashtagGenerator";
import { topKeywords, coreStatement, truncateWords } from "./textUtils";

export interface AdaptableClip {
  title: string;
  hook: string;
  description: string;
  caption: string;
  hashtags: string[];
  cta: string;
  textOverlay: string;
  lengthSec: number;
}

function clipKeywords(clip: AdaptableClip): string[] {
  const base = `${clip.title} ${clip.description} ${clip.hook}`;
  return topKeywords(base, 4);
}

export function adaptToPlatform(
  clip: AdaptableClip,
  platform: PlatformId,
  ctx: Pick<GenerationContext, "tone" | "niche" | "language" | "ctaStyle" | "avoidWords">,
): PlatformOutput {
  const language = ctx.language ?? "de";
  const keywords = clipKeywords(clip);
  const core = coreStatement(clip.description || clip.title, 120);

  const baseCaptionInput = {
    core,
    topic: clip.title,
    hook: clip.hook,
    tone: ctx.tone ?? "locker",
    language,
    ctaStyle: ctx.ctaStyle,
    audience: undefined,
  };

  switch (platform) {
    case "tiktok": {
      return {
        platform,
        hook: truncateWords(clip.hook, 12),
        caption: generateCaption({ ...baseCaptionInput, platform }),
        hashtags: generateHashtags({ keywords, niche: ctx.niche, platform, language, count: 8, avoidWords: ctx.avoidWords }),
        textOverlay: clip.textOverlay || truncateWords(clip.hook, 6).toUpperCase(),
        extra: {
          stil: language === "en" ? "Fast-paced, trend-driven" : "Schneller Schnitt, Trend-getrieben",
          sound: language === "en" ? "Use a trending sound" : "Aktuellen Trend-Sound verwenden",
          tipp: language === "en" ? "Hook in the first 1.5s" : "Hook in den ersten 1,5 Sekunden",
        },
      };
    }
    case "reels": {
      return {
        platform,
        hook: truncateWords(clip.hook, 14),
        caption: generateCaption({ ...baseCaptionInput, platform }),
        hashtags: generateHashtags({ keywords, niche: ctx.niche, platform, language, count: 5, avoidWords: ctx.avoidWords }),
        textOverlay: clip.textOverlay || truncateWords(clip.hook, 7),
        extra: {
          aesthetik: language === "en" ? "Clean, aesthetic look, soft transitions" : "Cleaner, ästhetischer Look, weiche Übergänge",
          carousel: language === "en"
            ? `Carousel idea: 5 slides about "${clip.title}"`
            : `Carousel-Idee: 5 Slides zu "${clip.title}"`,
          story: language === "en" ? "Tease in your Story 24h before" : "24h vorher in der Story teasern",
        },
      };
    }
    case "shorts": {
      return {
        platform,
        hook: truncateWords(clip.hook, 14),
        caption: generateCaption({ ...baseCaptionInput, platform }),
        hashtags: generateHashtags({ keywords, niche: ctx.niche, platform, language, count: 5, avoidWords: ctx.avoidWords }),
        textOverlay: clip.textOverlay || truncateWords(clip.title, 8),
        extra: {
          titel: truncateWords(`${clip.title}`, 10),
          start: language === "en" ? "Strong opening sentence, no intro" : "Starker erster Satz, kein Intro",
          beschreibung: `${core} ${generateCTA(ctx.ctaStyle, language, platform)}`,
        },
      };
    }
    case "linkedin": {
      const question = language === "en"
        ? "How do you approach this in your team?"
        : "Wie geht ihr in eurem Team damit um?";
      return {
        platform,
        hook: clip.hook,
        caption: generateCaption({ ...baseCaptionInput, platform }),
        hashtags: generateHashtags({ keywords, niche: ctx.niche, platform, language, count: 3, avoidWords: ctx.avoidWords }),
        textOverlay: clip.textOverlay || truncateWords(clip.title, 9),
        extra: {
          kontext: language === "en"
            ? "Frame it as a business learning with context"
            : "Als Business-Learning mit Kontext einordnen",
          frage: question,
          format: language === "en" ? "Professional, value-first post" : "Professioneller Post, Mehrwert zuerst",
        },
      };
    }
    case "snapchat":
    default: {
      return {
        platform: "snapchat",
        hook: truncateWords(clip.hook, 8),
        caption: generateCaption({ ...baseCaptionInput, platform: "snapchat" }),
        hashtags: generateHashtags({ keywords, niche: ctx.niche, platform: "snapchat", language, count: 2, avoidWords: ctx.avoidWords }),
        textOverlay: clip.textOverlay || truncateWords(clip.hook, 5).toUpperCase(),
        extra: {
          stil: language === "en" ? "Casual, direct, raw" : "Locker, direkt, ungefiltert",
          zielgruppe: language === "en" ? "Younger audience (Gen Z)" : "Junge Zielgruppe (Gen Z)",
          laenge: language === "en" ? "Keep it under 15s" : "Unter 15 Sekunden halten",
        },
      };
    }
  }
}

// Erzeugt Plattform-Versionen für mehrere Plattformen.
export function adaptToPlatforms(
  clip: AdaptableClip,
  platforms: PlatformId[],
  ctx: Pick<GenerationContext, "tone" | "niche" | "language" | "ctaStyle" | "avoidWords">,
): PlatformOutput[] {
  return platforms.map((p) => adaptToPlatform(clip, p, ctx));
}
