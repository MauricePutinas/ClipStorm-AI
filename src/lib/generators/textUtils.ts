// Textverarbeitung für die regelbasierten Generatoren.
// Keine externe Abhängigkeit – reine Heuristik.

export const STOPWORDS = new Set<string>([
  // Deutsch
  "und", "oder", "aber", "denn", "weil", "dass", "wenn", "also", "doch", "noch",
  "schon", "sehr", "mehr", "viele", "viel", "eine", "einen", "einem", "einer",
  "eines", "der", "die", "das", "den", "dem", "des", "ein", "ist", "sind",
  "war", "waren", "sein", "haben", "habe", "hast", "hat", "hatte", "wird",
  "werden", "wurde", "kann", "können", "muss", "müssen", "soll", "sollen",
  "will", "wollen", "ich", "du", "er", "sie", "es", "wir", "ihr", "man",
  "mich", "dich", "sich", "uns", "euch", "mein", "dein", "sein", "ihre",
  "für", "mit", "auf", "aus", "bei", "von", "zum", "zur", "über", "unter",
  "vor", "nach", "durch", "gegen", "ohne", "als", "wie", "was", "wer", "wo",
  "warum", "wieso", "dann", "hier", "dort", "diese", "dieser", "dieses",
  "auch", "nur", "nicht", "kein", "keine", "ganz", "immer", "wieder", "mal",
  "etwas", "alles", "selbst", "damit", "dabei", "weiter", "zwischen", "jetzt",
  // Englisch
  "the", "and", "for", "are", "but", "not", "you", "all", "any", "can",
  "her", "was", "one", "our", "out", "day", "get", "has", "him", "his",
  "how", "its", "may", "new", "now", "old", "see", "two", "way", "who",
  "boy", "did", "this", "that", "with", "have", "from", "they", "will",
  "would", "there", "their", "what", "about", "which", "when", "your",
  "just", "like", "into", "over", "than", "then", "them", "some", "more",
  "very", "also", "been", "being", "because", "should", "could",
]);

const POWER_WORDS = [
  "fehler", "geheimnis", "niemals", "immer", "tipp", "trick", "schritt",
  "strategie", "geld", "zeit", "schnell", "einfach", "wahrheit", "problem",
  "lösung", "beste", "schlimmste", "verändert", "gelernt", "getestet",
  "ergebnis", "funktioniert", "wichtig", "unterschätzt", "überrascht",
  "stunden", "tagen", "wochen", "monaten", "prozent", "umsatz", "wachstum",
  "secret", "mistake", "never", "always", "best", "worst", "proven",
  "results", "hack", "framework", "growth", "money", "fast", "easy",
];

const HOWTO_MARKERS = [
  "so ", "wie du", "in 3", "in drei", "schritt", "anleitung", "how to",
  "step", "tutorial", "methode", "framework", "system",
];

export function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Entfernt SRT/VTT-Zeitstempel, Sprechernamen und Index-Zeilen.
export function stripTimestamps(text: string): string {
  return text
    .replace(/\d{2}:\d{2}:\d{2}[,.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[,.]\d{3}.*$/gm, " ")
    .replace(/^\s*\d+\s*$/gm, " ")
    .replace(/^WEBVTT.*$/gm, " ")
    .replace(/\[\d{1,2}:\d{2}(:\d{2})?\]/g, " ")
    .replace(/\(\d{1,2}:\d{2}(:\d{2})?\)/g, " ")
    .replace(/^[A-ZÄÖÜ][a-zäöü]+:\s/gm, " "); // "Sprecher: ..."
}

export function splitSentences(text: string): string[] {
  const clean = stripTimestamps(normalizeText(text));
  const raw = clean
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return raw.filter((s) => s.replace(/[^a-zA-ZäöüÄÖÜß0-9]/g, "").length >= 12);
}

export function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(/[a-zäöüß0-9]+/gi);
  return matches ? matches.map((t) => t.toLowerCase()) : [];
}

export function topKeywords(text: string, n = 8): string[] {
  const freq = new Map<string, number>();
  for (const tok of tokenize(text)) {
    if (tok.length < 4) continue;
    if (STOPWORDS.has(tok)) continue;
    if (/^\d+$/.test(tok)) continue;
    freq.set(tok, (freq.get(tok) || 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([w]) => w);
}

export interface SegmentSignals {
  hasNumber: boolean;
  hasQuestion: boolean;
  powerCount: number;
  isHowto: boolean;
  length: number;
}

export function analyzeSignals(text: string): SegmentSignals {
  const lower = text.toLowerCase();
  const hasNumber = /\d/.test(text) || /\b(eins|zwei|drei|vier|fünf|hundert|tausend)\b/.test(lower);
  const hasQuestion = text.includes("?");
  let powerCount = 0;
  for (const w of POWER_WORDS) {
    if (lower.includes(w)) powerCount++;
  }
  const isHowto = HOWTO_MARKERS.some((m) => lower.includes(m));
  return { hasNumber, hasQuestion, powerCount, isHowto, length: text.length };
}

export interface Segment {
  text: string;
  keywords: string[];
  signals: SegmentSignals;
  baseScore: number;
}

// Gruppiert Sätze zu „Momenten“ und bewertet ihre Clip-Tauglichkeit.
export function buildSegments(transcript: string, maxLen = 320): Segment[] {
  const sentences = splitSentences(transcript);
  const segments: Segment[] = [];
  let buffer = "";

  const flush = () => {
    const t = buffer.trim();
    if (t.replace(/[^a-zA-ZäöüÄÖÜß0-9]/g, "").length < 20) {
      buffer = "";
      return;
    }
    const signals = analyzeSignals(t);
    segments.push({
      text: t,
      keywords: topKeywords(t, 5),
      signals,
      baseScore: scoreSegment(signals),
    });
    buffer = "";
  };

  for (const s of sentences) {
    if ((buffer + " " + s).trim().length > maxLen && buffer) {
      flush();
    }
    buffer = buffer ? `${buffer} ${s}` : s;
    // Einzelne starke Sätze (Frage/Zahl) sofort als eigener Moment.
    if (s.length > 80 || s.includes("?")) {
      flush();
    }
  }
  flush();

  // Fallback: wenn nichts erkannt wurde, ganzen Text als ein Segment.
  if (segments.length === 0) {
    const t = normalizeText(transcript).slice(0, maxLen);
    if (t) {
      const signals = analyzeSignals(t);
      segments.push({ text: t, keywords: topKeywords(t, 5), signals, baseScore: scoreSegment(signals) });
    }
  }
  return segments;
}

export function scoreSegment(signals: SegmentSignals): number {
  let score = 40;
  if (signals.hasNumber) score += 14;
  if (signals.hasQuestion) score += 10;
  if (signals.isHowto) score += 10;
  score += Math.min(signals.powerCount * 6, 24);
  // Ideale Länge für einen Clip-Kern: 80–220 Zeichen
  if (signals.length >= 80 && signals.length <= 220) score += 8;
  else if (signals.length < 40) score -= 10;
  return Math.max(10, Math.min(100, score));
}

// Bildet aus einem Segment eine prägnante Kernaussage (für Titel / Beschreibung).
export function coreStatement(text: string, max = 110): string {
  const firstSentence = splitSentences(text)[0] ?? text;
  let s = firstSentence.replace(/\s+/g, " ").trim();
  if (s.length > max) {
    s = s.slice(0, max).replace(/\s+\S*$/, "") + "…";
  }
  return s;
}

export function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(" ").replace(/[.,;:!?]+$/, "") + "…";
}

export function capitalize(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function toCamelHashtag(keyword: string): string {
  return keyword
    .split(/[\s-]+/)
    .map((w) => capitalize(w))
    .join("");
}
