// Zod-Validierungsschemata für alle API-Eingaben (serverseitige Sicherheit).
import { z } from "zod";

export const platformEnum = z.enum(["tiktok", "reels", "shorts", "linkedin", "snapchat"]);
export const languageEnum = z.enum(["de", "en"]);
export const clipStatusEnum = z.enum(["IDEA", "SELECTED", "PLANNED", "PUBLISHED"]);
export const calendarStatusEnum = z.enum(["PLANNED", "PUBLISHED"]);
export const difficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"]);
export const planEnum = z.enum(["FREE", "CREATOR", "PRO", "AGENCY"]);
export const roleEnum = z.enum(["USER", "ADMIN"]);
export const lengthEnum = z.coerce
  .number()
  .refine((v) => v === 15 || v === 30 || v === 60, "Länge muss 15, 30 oder 60 Sekunden sein");

const MAX_TRANSCRIPT = 100_000;

export const projectCreateSchema = z.object({
  title: z.string().trim().min(2, "Titel ist erforderlich").max(120),
  niche: z.string().trim().max(120).default(""),
  audience: z.string().trim().max(200).default(""),
  tone: z.string().trim().max(40).default("locker"),
  language: languageEnum.default("de"),
  platforms: z.array(platformEnum).min(1, "Mindestens eine Plattform wählen"),
  transcript: z.string().max(MAX_TRANSCRIPT, "Transkript ist zu lang").default(""),
  videoLengthSec: z.coerce.number().int().positive().max(86400).optional().nullable(),
  count: z.coerce.number().int().min(5).max(30).optional(),
  brandProfileId: z.string().optional(),
});

export const projectUpdateSchema = z.object({
  title: z.string().trim().min(2).max(120).optional(),
  niche: z.string().trim().max(120).optional(),
  audience: z.string().trim().max(200).optional(),
  tone: z.string().trim().max(40).optional(),
  language: languageEnum.optional(),
  platforms: z.array(platformEnum).min(1).optional(),
  transcript: z.string().max(MAX_TRANSCRIPT).optional(),
  videoLengthSec: z.coerce.number().int().positive().max(86400).optional().nullable(),
  status: z.enum(["DRAFT", "ANALYZED"]).optional(),
});

export const generateSchema = z.object({
  count: z.coerce.number().int().min(5).max(30).optional(),
  brandProfileId: z.string().optional(),
  replace: z.boolean().optional(),
});

export const clipUpdateSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  hook: z.string().trim().max(400).optional(),
  description: z.string().trim().max(800).optional(),
  recommendedPlatform: platformEnum.optional(),
  lengthSec: lengthEnum.optional(),
  textOverlay: z.string().trim().max(400).optional(),
  caption: z.string().trim().max(1200).optional(),
  hashtags: z.array(z.string().trim().max(60)).max(40).optional(),
  cutInstruction: z.string().trim().max(1200).optional(),
  bRoll: z.string().trim().max(600).optional(),
  cta: z.string().trim().max(300).optional(),
  viralScore: z.coerce.number().int().min(0).max(100).optional(),
  difficulty: difficultyEnum.optional(),
  status: clipStatusEnum.optional(),
});

export const calendarCreateSchema = z.object({
  title: z.string().trim().min(1, "Titel erforderlich").max(160),
  platform: platformEnum.default("tiktok"),
  scheduledAt: z.coerce.date(),
  status: calendarStatusEnum.default("PLANNED"),
  notes: z.string().trim().max(600).default(""),
  clipId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
});

export const calendarUpdateSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  platform: platformEnum.optional(),
  scheduledAt: z.coerce.date().optional(),
  status: calendarStatusEnum.optional(),
  notes: z.string().trim().max(600).optional(),
});

export const brandProfileSchema = z.object({
  name: z.string().trim().min(2, "Name erforderlich").max(120),
  audience: z.string().trim().max(200).default(""),
  tone: z.string().trim().max(40).default("locker"),
  niche: z.string().trim().max(120).default(""),
  avoidWords: z.array(z.string().trim().max(40)).max(60).default([]),
  preferredPlatforms: z.array(platformEnum).default([]),
  ctaStyle: z.string().trim().max(40).default("direkt"),
  isDefault: z.boolean().default(false),
});

export const hookGenerateSchema = z.object({
  topic: z.string().trim().min(3, "Thema erforderlich").max(400),
  language: languageEnum.default("de"),
  niche: z.string().trim().max(120).optional(),
  audience: z.string().trim().max(200).optional(),
});

export const adminUserUpdateSchema = z.object({
  plan: planEnum.optional(),
  role: roleEnum.optional(),
});

export const exportQuerySchema = z.object({
  format: z.enum(["csv", "markdown", "json", "cutter"]),
  scope: z.enum(["project", "all", "calendar"]).default("project"),
  projectId: z.string().optional(),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type ClipUpdateInput = z.infer<typeof clipUpdateSchema>;
export type CalendarCreateInput = z.infer<typeof calendarCreateSchema>;
export type BrandProfileInput = z.infer<typeof brandProfileSchema>;
