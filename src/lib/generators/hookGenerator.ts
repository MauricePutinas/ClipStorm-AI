// Hook Engine – erzeugt aufmerksamkeitsstarke Hooks in 9 Varianten.
import type { HookType, HookVariant, Language } from "../types";
import { HOOK_TYPES } from "../constants";
import { capitalize, coreStatement, topKeywords } from "./textUtils";

const NUMBERS = [3, 5, 7, 21, 30];

function pickNumber(seed: number): number {
  return NUMBERS[seed % NUMBERS.length];
}

// Leitet ein knappes Thema (Substantiv-Phrase) aus Text/Keywords ab.
export function topicFromText(text: string, fallback = "dein Thema"): string {
  const keywords = topKeywords(text, 3);
  if (keywords.length === 0) return fallback;
  return keywords.map((k) => capitalize(k)).join(" ");
}

interface HookBuildParams {
  text: string;
  topic: string;
  type: HookType;
  language: Language;
  seed?: number;
}

const TEMPLATES_DE: Record<HookType, (p: HookBuildParams) => string> = {
  problem: ({ topic }) => `Das größte Problem mit ${topic}? Die meisten machen es genau falsch.`,
  shock: ({ topic }) => `Das hätte ich bei ${topic} wirklich nicht erwartet.`,
  story: ({ topic, seed = 0 }) =>
    `Vor ${pickNumber(seed)} Monaten hatte ich von ${topic} keine Ahnung – heute sieht das anders aus.`,
  numbers: ({ topic, seed = 0 }) =>
    `${pickNumber(seed)} Dinge über ${topic}, die wirklich funktionieren.`,
  mistake: ({ topic }) => `Der Fehler, den fast jeder bei ${topic} macht – und wie du ihn vermeidest.`,
  myth: ({ topic }) => `Der größte Mythos über ${topic} – und warum er einfach falsch ist.`,
  nobody: ({ topic }) => `Niemand spricht darüber, aber ${topic} entscheidet am Ende über alles.`,
  tested: ({ topic, seed = 0 }) =>
    `Ich habe ${topic} ${pickNumber(seed)} Tage getestet. Das Ergebnis hat mich überrascht.`,
  earlier: ({ topic }) => `3 Dinge über ${topic}, die ich gerne früher gewusst hätte.`,
};

const TEMPLATES_EN: Record<HookType, (p: HookBuildParams) => string> = {
  problem: ({ topic }) => `The biggest problem with ${topic}? Most people get it completely wrong.`,
  shock: ({ topic }) => `I really did not expect this about ${topic}.`,
  story: ({ topic, seed = 0 }) =>
    `${pickNumber(seed)} months ago I knew nothing about ${topic} – today it's a different story.`,
  numbers: ({ topic, seed = 0 }) => `${pickNumber(seed)} things about ${topic} that actually work.`,
  mistake: ({ topic }) => `The mistake almost everyone makes with ${topic} – and how to avoid it.`,
  myth: ({ topic }) => `The biggest myth about ${topic} – and why it's just wrong.`,
  nobody: ({ topic }) => `Nobody talks about this, but ${topic} decides everything in the end.`,
  tested: ({ topic, seed = 0 }) =>
    `I tested ${topic} for ${pickNumber(seed)} days. The result surprised me.`,
  earlier: ({ topic }) => `3 things about ${topic} I wish I had known earlier.`,
};

export function generateHook(params: HookBuildParams): string {
  const tpl = params.language === "en" ? TEMPLATES_EN : TEMPLATES_DE;
  return tpl[params.type](params);
}

// Erzeugt alle 9 Hook-Varianten zu einem Thema (für die Hook Engine Seite).
export function generateHookVariants(
  topicOrText: string,
  language: Language = "de",
  seed = 0,
): HookVariant[] {
  const topic = topicFromText(topicOrText, topicOrText.split(/\s+/).slice(0, 3).join(" "));
  return HOOK_TYPES.map((ht, i) => ({
    type: ht.id as HookType,
    label: ht.label,
    text: generateHook({
      text: topicOrText,
      topic,
      type: ht.id as HookType,
      language,
      seed: seed + i,
    }),
  }));
}

// Wählt für einen Clip-Index rotierend einen Hook-Typ.
export function hookTypeForIndex(index: number): HookType {
  return HOOK_TYPES[index % HOOK_TYPES.length].id as HookType;
}

export { coreStatement };
