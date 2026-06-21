// Lokaler Template-/Regel-Provider – funktioniert komplett ohne externe API.
import type { AIProvider } from "./provider";
import type {
  GeneratedClip,
  GenerationContext,
  HookVariant,
  Language,
  PlatformId,
  PlatformOutput,
} from "../types";
import { generateClips } from "../generators/clipGenerator";
import { generateHookVariants } from "../generators/hookGenerator";
import { adaptToPlatform, type AdaptableClip } from "../generators/platformAdapter";

export const templateProvider: AIProvider = {
  name: "template",

  async generateClips(ctx: GenerationContext): Promise<GeneratedClip[]> {
    return generateClips(ctx);
  },

  async generateHooks(topic: string, language: Language = "de", seed = 0): Promise<HookVariant[]> {
    return generateHookVariants(topic, language, seed);
  },

  async adaptToPlatform(
    clip: AdaptableClip,
    platform: PlatformId,
    ctx: Pick<GenerationContext, "tone" | "niche" | "language" | "ctaStyle" | "avoidWords">,
  ): Promise<PlatformOutput> {
    return adaptToPlatform(clip, platform, ctx);
  },
};
