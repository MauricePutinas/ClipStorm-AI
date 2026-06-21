"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Layers, CalendarPlus, Check, Hash, Megaphone } from "lucide-react";
import { PLATFORMS, CLIP_STATUS, CLIP_LENGTHS, DIFFICULTIES, platformMeta } from "@/lib/constants";
import { apiFetch } from "@/lib/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CopyButton } from "@/components/ui/copy-button";
import { PlatformBadge } from "@/components/shared/badges";
import type { PlatformId } from "@/lib/types";

interface PlatformVersion {
  platform: string;
  hook: string;
  caption: string;
  hashtags: string[];
  textOverlay: string;
  extra: Record<string, string>;
}

export interface EditorClip {
  id: string;
  projectId: string;
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
  platformVersions: PlatformVersion[];
}

export function ClipEditor({ clip, projectPlatforms }: { clip: EditorClip; projectPlatforms: PlatformId[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: clip.title,
    hook: clip.hook,
    description: clip.description,
    recommendedPlatform: clip.recommendedPlatform,
    lengthSec: clip.lengthSec,
    textOverlay: clip.textOverlay,
    caption: clip.caption,
    hashtags: clip.hashtags.join(" "),
    cutInstruction: clip.cutInstruction,
    bRoll: clip.bRoll,
    cta: clip.cta,
    status: clip.status,
    difficulty: clip.difficulty,
  });
  const [versions, setVersions] = useState<PlatformVersion[]>(clip.platformVersions);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [adapting, setAdapting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  const hashtagList = form.hashtags
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : `#${t}`));

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/api/clips/${clip.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: form.title,
          hook: form.hook,
          description: form.description,
          recommendedPlatform: form.recommendedPlatform,
          lengthSec: Number(form.lengthSec),
          textOverlay: form.textOverlay,
          caption: form.caption,
          hashtags: hashtagList,
          cutInstruction: form.cutInstruction,
          bRoll: form.bRoll,
          cta: form.cta,
          status: form.status,
          difficulty: form.difficulty,
        }),
      });
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  }

  async function generatePlatformVersions() {
    setAdapting(true);
    setError(null);
    try {
      const data = await apiFetch<PlatformVersion[]>(`/api/clips/${clip.id}/platforms`, {
        method: "POST",
        body: JSON.stringify({ platforms: projectPlatforms }),
      });
      setVersions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anpassung fehlgeschlagen");
    } finally {
      setAdapting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Editor */}
      <div className="space-y-5 lg:col-span-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Clip bearbeiten</CardTitle>
            <div className="flex items-center gap-2">
              {saved && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <Check className="size-3.5" /> Gespeichert
                </span>
              )}
              <Button size="sm" onClick={save} disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Speichern
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Titel">
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
            </Field>

            <Field label="Hook" copyValue={form.hook}>
              <Textarea value={form.hook} onChange={(e) => update("hook", e.target.value)} className="min-h-[70px]" />
            </Field>

            <Field label="Kurzbeschreibung">
              <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="min-h-[70px]" />
            </Field>

            <Field label="Text-Overlay" copyValue={form.textOverlay}>
              <Input value={form.textOverlay} onChange={(e) => update("textOverlay", e.target.value)} />
            </Field>

            <Field label="Caption" copyValue={form.caption}>
              <Textarea value={form.caption} onChange={(e) => update("caption", e.target.value)} className="min-h-[120px]" />
            </Field>

            <Field label="Hashtags" copyValue={hashtagList.join(" ")}>
              <Input value={form.hashtags} onChange={(e) => update("hashtags", e.target.value)} placeholder="#tag1 #tag2" />
              <div className="mt-1.5 flex flex-wrap gap-1">
                {hashtagList.map((t, i) => (
                  <span key={i} className="rounded-full bg-cyan/10 px-2 py-0.5 text-xs text-cyan">{t}</span>
                ))}
              </div>
            </Field>

            <Field label="Schnittanweisung" copyValue={form.cutInstruction}>
              <Textarea value={form.cutInstruction} onChange={(e) => update("cutInstruction", e.target.value)} className="min-h-[80px]" />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="B-Roll Idee" copyValue={form.bRoll}>
                <Textarea value={form.bRoll} onChange={(e) => update("bRoll", e.target.value)} className="min-h-[60px]" />
              </Field>
              <Field label="Call-to-Action" copyValue={form.cta}>
                <Textarea value={form.cta} onChange={(e) => update("cta", e.target.value)} className="min-h-[60px]" />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Plattform-Versionen */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Layers className="size-4 text-cyan" /> Plattform-Versionen
            </CardTitle>
            <Button size="sm" variant="secondary" onClick={generatePlatformVersions} disabled={adapting}>
              {adapting ? <Loader2 className="size-4 animate-spin" /> : <Layers className="size-4" />}
              {versions.length ? "Neu anpassen" : "Generieren"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {versions.length === 0 ? (
              <p className="text-sm text-slate-400">
                Erzeuge plattform-spezifische Versionen (TikTok, Reels, Shorts, LinkedIn, Snapchat) mit
                angepasstem Hook, Caption, Hashtags und Overlay.
              </p>
            ) : (
              versions.map((v) => <PlatformVersionCard key={v.platform} version={v} />)
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar: Eigenschaften + Kalender */}
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Eigenschaften</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="text-xs uppercase tracking-wide text-slate-500">Viral-Potenzial</div>
              <div className="mt-1 text-4xl font-bold gradient-text">{clip.viralScore}</div>
              <div className="text-xs text-slate-500">von 100</div>
            </div>

            <Field label="Empfohlene Plattform">
              <Select value={form.recommendedPlatform} onChange={(e) => update("recommendedPlatform", e.target.value)}>
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </Select>
            </Field>

            <Field label="Clip-Länge">
              <Select value={String(form.lengthSec)} onChange={(e) => update("lengthSec", Number(e.target.value))}>
                {CLIP_LENGTHS.map((l) => (
                  <option key={l} value={l}>{l} Sekunden</option>
                ))}
              </Select>
            </Field>

            <Field label="Schwierigkeit">
              <Select value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)}>
                {DIFFICULTIES.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </Select>
            </Field>

            <Field label="Status">
              <Select value={form.status} onChange={(e) => update("status", e.target.value)}>
                {CLIP_STATUS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </Select>
            </Field>
          </CardContent>
        </Card>

        <CalendarAddCard clip={clip} defaultPlatform={form.recommendedPlatform} />

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  copyValue,
}: {
  label: string;
  children: React.ReactNode;
  copyValue?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {copyValue !== undefined && <CopyButton value={copyValue} />}
      </div>
      {children}
    </div>
  );
}

function PlatformVersionCard({ version }: { version: PlatformVersion }) {
  const meta = platformMeta(version.platform);
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center justify-between">
        <PlatformBadge platform={version.platform} />
      </div>
      <div className="space-y-2.5 text-sm">
        <VersionRow icon={Megaphone} label="Hook" value={version.hook} />
        <VersionRow label="Caption" value={version.caption} multiline />
        <VersionRow icon={Hash} label="Hashtags" value={version.hashtags.join(" ")} />
        <VersionRow label="Overlay" value={version.textOverlay} />
        {Object.entries(version.extra).map(([k, val]) => (
          <div key={k} className="flex gap-2 text-xs">
            <span className="shrink-0 capitalize text-slate-500">{k}:</span>
            <span className="text-slate-300">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VersionRow({
  label,
  value,
  multiline,
  icon: Icon,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  icon?: typeof Hash;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
          {Icon && <Icon className="size-3" />} {label}
        </div>
        <p className={multiline ? "whitespace-pre-line text-slate-300" : "text-slate-300"}>{value}</p>
      </div>
      <CopyButton value={value} />
    </div>
  );
}

function CalendarAddCard({ clip, defaultPlatform }: { clip: EditorClip; defaultPlatform: string }) {
  const router = useRouter();
  const [platform, setPlatform] = useState(defaultPlatform);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addToCalendar() {
    if (!date) {
      setError("Bitte Datum wählen.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await apiFetch("/api/calendar", {
        method: "POST",
        body: JSON.stringify({
          title: clip.title,
          platform,
          scheduledAt: new Date(date).toISOString(),
          clipId: clip.id,
          projectId: clip.projectId,
          status: "PLANNED",
        }),
      });
      setDone(true);
      router.refresh();
      setTimeout(() => setDone(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Planen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarPlus className="size-4 text-electric" /> In Kalender übernehmen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Field label="Datum & Uhrzeit">
          <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Plattform">
          <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </Select>
        </Field>
        {error && <p className="text-xs text-red-300">{error}</p>}
        <Button className="w-full" onClick={addToCalendar} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : done ? <Check className="size-4" /> : <CalendarPlus className="size-4" />}
          {done ? "Eingeplant!" : "Einplanen"}
        </Button>
      </CardContent>
    </Card>
  );
}
