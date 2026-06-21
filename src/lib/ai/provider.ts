// AI-Provider-Abstraktion.
// Standardmäßig wird der lokale Template-Provider genutzt (keine externe API).
// Über die Env-Variable AI_PROVIDER kann später ein echtes Modell aktiviert werden.
import type {
  GeneratedClip,
  GenerationContext,
  HookVariant,
  Language,
  PlatformId,
  PlatformOutput,
} from "../types";
import type { AdaptableClip } from "../generators/platformAdapter";
import { templateProvider } from "./templateProvider";
import { openaiProvider, openaiImplemented } from "./openaiProvider.placeholder";
import { claudeProvider, claudeImplemented } from "./claudeProvider.placeholder";
import { deepseekProvider, deepseekImplemented } from "./deepseekProvider.placeholder";

export interface AIProvider {
  name: string;
  generateClips(ctx: GenerationContext): Promise<GeneratedClip[]>;
  generateHooks(topic: string, language: Language, seed?: number): Promise<HookVariant[]>;
  adaptToPlatform(
    clip: AdaptableClip,
    platform: PlatformId,
    ctx: Pick<GenerationContext, "tone" | "niche" | "language" | "ctaStyle" | "avoidWords">,
  ): Promise<PlatformOutput>;
}

type ProviderId = "template" | "openai" | "claude" | "deepseek";

function resolveProviderId(): ProviderId {
  const raw = (process.env.AI_PROVIDER || "template").toLowerCase();
  if (raw === "openai" || raw === "claude" || raw === "deepseek") return raw;
  return "template";
}

// Liefert den aktiven Provider. Fällt sicher auf den Template-Provider zurück,
// solange ein echter Provider nicht implementiert / nicht konfiguriert ist.
export function getAIProvider(): AIProvider {
  const id = resolveProviderId();

  switch (id) {
    case "openai":
      if (openaiImplemented && process.env.OPENAI_API_KEY) return openaiProvider;
      warnFallback("openai");
      return templateProvider;
    case "claude":
      if (claudeImplemented && process.env.ANTHROPIC_API_KEY) return claudeProvider;
      warnFallback("claude");
      return templateProvider;
    case "deepseek":
      if (deepseekImplemented && process.env.DEEPSEEK_API_KEY) return deepseekProvider;
      warnFallback("deepseek");
      return templateProvider;
    default:
      return templateProvider;
  }
}

let warned = false;
function warnFallback(requested: string) {
  if (warned) return;
  warned = true;
  console.warn(
    `[ClipStorm AI] AI_PROVIDER="${requested}" ist nicht aktiv (Platzhalter oder fehlender API-Key). ` +
      `Es wird der lokale Template-Provider verwendet.`,
  );
}

export function activeProviderName(): string {
  return getAIProvider().name;
}
