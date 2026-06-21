// Export-Logik: CSV, Markdown, JSON und Cutter-Export.
import { platformMeta } from "./constants";
import { formatDateTime } from "./utils";

export interface ExportClip {
  title: string;
  hook: string;
  description: string;
  recommendedPlatform: string;
  lengthSec: number;
  textOverlay: string;
  caption: string;
  hashtags: string[];
  cutInstruction: string;
  bRoll: string;
  cta: string;
  viralScore: number;
  difficulty: string;
  status: string;
}

export interface ExportCalendarItem {
  title: string;
  platform: string;
  scheduledAt: Date | string;
  status: string;
  notes: string;
  projectTitle?: string | null;
  clipTitle?: string | null;
}

function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  // Schutz vor CSV-Formula-Injection (CWE-1236): führende Formel-Trigger neutralisieren.
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(s)) {
    return `"'${s.replace(/"/g, '""')}"`;
  }
  if (/[",\n\r;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function rowsToCsv(headers: string[], rows: (string | number)[][]): string {
  const head = headers.map(csvEscape).join(",");
  const body = rows.map((r) => r.map(csvEscape).join(",")).join("\r\n");
  return `${head}\r\n${body}`;
}

export function clipsToCsv(clips: ExportClip[]): string {
  const headers = [
    "Titel",
    "Hook",
    "Beschreibung",
    "Plattform",
    "Länge (s)",
    "Text-Overlay",
    "Caption",
    "Hashtags",
    "Schnittanweisung",
    "B-Roll",
    "CTA",
    "Viral-Score",
    "Schwierigkeit",
    "Status",
  ];
  const rows = clips.map((c) => [
    c.title,
    c.hook,
    c.description,
    platformMeta(c.recommendedPlatform).label,
    c.lengthSec,
    c.textOverlay,
    c.caption,
    c.hashtags.join(" "),
    c.cutInstruction,
    c.bRoll,
    c.cta,
    c.viralScore,
    c.difficulty,
    c.status,
  ]);
  return rowsToCsv(headers, rows);
}

// Cutter-Export: reduziert auf die für den Schnitt relevanten Felder.
export function clipsToCutterCsv(clips: ExportClip[]): string {
  const headers = ["Clip-Titel", "Szene / Schnitt", "Text-Overlay", "B-Roll", "CTA", "Länge (s)"];
  const rows = clips.map((c) => [c.title, c.cutInstruction, c.textOverlay, c.bRoll, c.cta, c.lengthSec]);
  return rowsToCsv(headers, rows);
}

export function calendarToCsv(items: ExportCalendarItem[]): string {
  const headers = ["Titel", "Plattform", "Geplant für", "Status", "Projekt", "Clip", "Notizen"];
  const rows = items.map((i) => [
    i.title,
    platformMeta(i.platform).label,
    formatDateTime(i.scheduledAt),
    i.status,
    i.projectTitle ?? "",
    i.clipTitle ?? "",
    i.notes,
  ]);
  return rowsToCsv(headers, rows);
}

export function clipsToJson(clips: ExportClip[]): string {
  return JSON.stringify(clips, null, 2);
}

export interface MarkdownProjectMeta {
  title: string;
  niche?: string;
  audience?: string;
  tone?: string;
  language?: string;
  platforms?: string[];
}

export function clipsToMarkdown(project: MarkdownProjectMeta, clips: ExportClip[]): string {
  const lines: string[] = [];
  lines.push(`# ${project.title}`);
  lines.push("");
  lines.push("> Erstellt mit **ClipStorm AI**");
  lines.push("");
  if (project.niche) lines.push(`- **Nische:** ${project.niche}`);
  if (project.audience) lines.push(`- **Zielgruppe:** ${project.audience}`);
  if (project.tone) lines.push(`- **Tonalität:** ${project.tone}`);
  if (project.platforms?.length) {
    lines.push(`- **Plattformen:** ${project.platforms.map((p) => platformMeta(p).label).join(", ")}`);
  }
  lines.push(`- **Anzahl Clips:** ${clips.length}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  clips.forEach((c, i) => {
    lines.push(`## ${i + 1}. ${c.title}`);
    lines.push("");
    lines.push(`**Plattform:** ${platformMeta(c.recommendedPlatform).label} · **Länge:** ${c.lengthSec}s · **Viral-Score:** ${c.viralScore}/100 · **Schwierigkeit:** ${c.difficulty}`);
    lines.push("");
    lines.push(`**🎣 Hook:** ${c.hook}`);
    lines.push("");
    lines.push(`**📝 Beschreibung:** ${c.description}`);
    lines.push("");
    lines.push(`**🅰️ Text-Overlay:** ${c.textOverlay}`);
    lines.push("");
    lines.push(`**💬 Caption:**`);
    lines.push("");
    lines.push("```");
    lines.push(c.caption);
    lines.push("```");
    lines.push("");
    lines.push(`**#️⃣ Hashtags:** ${c.hashtags.join(" ")}`);
    lines.push("");
    lines.push(`**✂️ Schnittanweisung:** ${c.cutInstruction}`);
    lines.push("");
    lines.push(`**🎬 B-Roll:** ${c.bRoll}`);
    lines.push("");
    lines.push(`**📣 CTA:** ${c.cta}`);
    lines.push("");
    lines.push("---");
    lines.push("");
  });

  return lines.join("\n");
}

export function exportFilename(base: string, format: string): string {
  const ext = format === "markdown" ? "md" : format === "json" ? "json" : "csv";
  const safe = base.replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").toLowerCase() || "clipstorm";
  return `${safe}.${ext}`;
}
