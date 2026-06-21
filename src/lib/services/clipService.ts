// Server-Service: Generierung & Speicherung von Clips und Plattform-Versionen.
import { prisma } from "../db";
import { getAIProvider } from "../ai/provider";
import { clampClipCount } from "../plan";
import { parseStringArray } from "../utils";
import { defaultClipCount } from "../generators/clipGenerator";
import type { GenerationContext, PlatformId } from "../types";
import type { AdaptableClip } from "../generators/platformAdapter";

interface GenerateOptions {
  count?: number;
  brandProfileId?: string;
  replace?: boolean;
}

// Generiert Clips für ein Projekt unter Berücksichtigung des Plan-Limits.
export async function generateForProject(projectId: string, options: GenerateOptions = {}) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { user: true },
  });
  if (!project) throw new Error("Projekt nicht gefunden");
  if (!project.transcript || project.transcript.trim().length < 40) {
    throw new Error("Das Transkript ist zu kurz, um Clips zu generieren (mind. 40 Zeichen).");
  }

  // Optionales Brand Profile einbeziehen
  let avoidWords: string[] = [];
  let ctaStyle: string | undefined;
  let brandName: string | undefined;
  if (options.brandProfileId) {
    const bp = await prisma.brandProfile.findFirst({
      where: { id: options.brandProfileId, userId: project.userId },
    });
    if (bp) {
      avoidWords = parseStringArray(bp.avoidWords);
      ctaStyle = bp.ctaStyle;
      brandName = bp.name;
    }
  }

  const platforms = parseStringArray(project.platforms) as PlatformId[];
  const planMax = clampClipCount(project.user.plan, options.count ?? defaultClipCount(project.transcript));

  const ctx: GenerationContext = {
    transcript: project.transcript,
    platforms: platforms.length ? platforms : ["tiktok"],
    tone: project.tone,
    audience: project.audience,
    niche: project.niche,
    language: project.language === "en" ? "en" : "de",
    videoLengthSec: project.videoLengthSec,
    count: planMax,
    avoidWords,
    ctaStyle,
    brandName,
  };

  const provider = getAIProvider();
  let clips = await provider.generateClips(ctx);
  // Sicherstellen, dass das Plan-Limit hart eingehalten wird.
  clips = clips.slice(0, planMax);

  if (options.replace) {
    await prisma.clipIdea.deleteMany({ where: { projectId } });
  }

  const existingCount = options.replace
    ? 0
    : await prisma.clipIdea.count({ where: { projectId } });

  for (let i = 0; i < clips.length; i++) {
    const c = clips[i];
    await prisma.clipIdea.create({
      data: {
        projectId,
        title: c.title,
        hook: c.hook,
        description: c.description,
        recommendedPlatform: c.recommendedPlatform,
        lengthSec: c.lengthSec,
        textOverlay: c.textOverlay,
        caption: c.caption,
        hashtags: JSON.stringify(c.hashtags),
        cutInstruction: c.cutInstruction,
        bRoll: c.bRoll,
        cta: c.cta,
        viralScore: c.viralScore,
        difficulty: c.difficulty,
        status: "IDEA",
        order: existingCount + i,
      },
    });
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "ANALYZED" },
  });

  return { count: clips.length, planMax };
}

// Erzeugt (oder aktualisiert) Plattform-Versionen für einen Clip.
export async function buildPlatformVersions(clipId: string, platforms?: PlatformId[]) {
  const clip = await prisma.clipIdea.findUnique({
    where: { id: clipId },
    include: { project: true },
  });
  if (!clip) throw new Error("Clip nicht gefunden");

  const targetPlatforms =
    platforms && platforms.length
      ? platforms
      : (parseStringArray(clip.project.platforms) as PlatformId[]);

  const list = targetPlatforms.length ? targetPlatforms : (["tiktok"] as PlatformId[]);
  const provider = getAIProvider();

  const adaptable: AdaptableClip = {
    title: clip.title,
    hook: clip.hook,
    description: clip.description,
    caption: clip.caption,
    hashtags: parseStringArray(clip.hashtags),
    cta: clip.cta,
    textOverlay: clip.textOverlay,
    lengthSec: clip.lengthSec,
  };

  for (const platform of list) {
    const out = await provider.adaptToPlatform(adaptable, platform, {
      tone: clip.project.tone,
      niche: clip.project.niche,
      language: clip.project.language === "en" ? "en" : "de",
      ctaStyle: undefined,
    });
    await prisma.platformVersion.upsert({
      where: { clipId_platform: { clipId, platform } },
      update: {
        hook: out.hook,
        caption: out.caption,
        hashtags: JSON.stringify(out.hashtags),
        textOverlay: out.textOverlay,
        extra: JSON.stringify(out.extra),
      },
      create: {
        clipId,
        platform: out.platform,
        hook: out.hook,
        caption: out.caption,
        hashtags: JSON.stringify(out.hashtags),
        textOverlay: out.textOverlay,
        extra: JSON.stringify(out.extra),
      },
    });
  }

  return { count: list.length };
}
