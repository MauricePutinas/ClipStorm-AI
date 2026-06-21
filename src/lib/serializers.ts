// Wandelt Prisma-Datensätze (mit JSON-String-Feldern) in saubere Objekte
// für API-Responses, UI und Export.
import type {
  BrandProfile,
  CalendarItem,
  ClipIdea,
  PlatformVersion,
  Project,
} from "@prisma/client";
import { parseRecord, parseStringArray } from "./utils";
import type { ExportClip } from "./export";

export function serializeClip(clip: ClipIdea & { platformVersions?: PlatformVersion[] }) {
  return {
    id: clip.id,
    projectId: clip.projectId,
    title: clip.title,
    hook: clip.hook,
    description: clip.description,
    recommendedPlatform: clip.recommendedPlatform,
    lengthSec: clip.lengthSec,
    textOverlay: clip.textOverlay,
    caption: clip.caption,
    hashtags: parseStringArray(clip.hashtags),
    cutInstruction: clip.cutInstruction,
    bRoll: clip.bRoll,
    cta: clip.cta,
    viralScore: clip.viralScore,
    difficulty: clip.difficulty,
    status: clip.status,
    order: clip.order,
    createdAt: clip.createdAt,
    platformVersions: (clip.platformVersions ?? []).map(serializePlatformVersion),
  };
}

export type SerializedClip = ReturnType<typeof serializeClip>;

export function serializePlatformVersion(pv: PlatformVersion) {
  return {
    id: pv.id,
    clipId: pv.clipId,
    platform: pv.platform,
    hook: pv.hook,
    caption: pv.caption,
    hashtags: parseStringArray(pv.hashtags),
    textOverlay: pv.textOverlay,
    extra: parseRecord(pv.extra),
  };
}

export function serializeProject(project: Project) {
  return {
    id: project.id,
    title: project.title,
    niche: project.niche,
    audience: project.audience,
    tone: project.tone,
    language: project.language,
    platforms: parseStringArray(project.platforms),
    transcript: project.transcript,
    videoLengthSec: project.videoLengthSec,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export function serializeBrandProfile(bp: BrandProfile) {
  return {
    id: bp.id,
    name: bp.name,
    audience: bp.audience,
    tone: bp.tone,
    niche: bp.niche,
    avoidWords: parseStringArray(bp.avoidWords),
    preferredPlatforms: parseStringArray(bp.preferredPlatforms),
    ctaStyle: bp.ctaStyle,
    isDefault: bp.isDefault,
  };
}

export function clipToExport(clip: ClipIdea): ExportClip {
  return {
    title: clip.title,
    hook: clip.hook,
    description: clip.description,
    recommendedPlatform: clip.recommendedPlatform,
    lengthSec: clip.lengthSec,
    textOverlay: clip.textOverlay,
    caption: clip.caption,
    hashtags: parseStringArray(clip.hashtags),
    cutInstruction: clip.cutInstruction,
    bRoll: clip.bRoll,
    cta: clip.cta,
    viralScore: clip.viralScore,
    difficulty: clip.difficulty,
    status: clip.status,
  };
}

export function serializeCalendarItem(
  item: CalendarItem & { project?: Project | null; clip?: ClipIdea | null },
) {
  return {
    id: item.id,
    title: item.title,
    platform: item.platform,
    scheduledAt: item.scheduledAt,
    status: item.status,
    notes: item.notes,
    projectId: item.projectId,
    clipId: item.clipId,
    projectTitle: item.project?.title ?? null,
    clipTitle: item.clip?.title ?? null,
  };
}
