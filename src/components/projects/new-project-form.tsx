"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Sparkles, AlertTriangle, Wand2 } from "lucide-react";
import { PLATFORMS, TONES, LANGUAGES } from "@/lib/constants";
import { DEMO_TRANSCRIPTS } from "@/lib/demoContent";
import { apiFetch } from "@/lib/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { PlatformId } from "@/lib/types";

interface BrandProfileOption {
  id: string;
  name: string;
  tone: string;
  niche: string;
  audience: string;
}

interface Props {
  brandProfiles: BrandProfileOption[];
  planMaxClips: number;
  atLimit: boolean;
}

export function NewProjectForm({ brandProfiles, planMaxClips, atLimit }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("locker");
  const [language, setLanguage] = useState("de");
  const [platforms, setPlatforms] = useState<PlatformId[]>(["tiktok", "reels", "shorts"]);
  const [videoMin, setVideoMin] = useState("");
  const [count, setCount] = useState(Math.min(12, planMaxClips));
  const [brandProfileId, setBrandProfileId] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function togglePlatform(id: PlatformId) {
    setPlatforms((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function applyDemo(demoId: string) {
    const demo = DEMO_TRANSCRIPTS.find((d) => d.id === demoId);
    if (!demo) return;
    setTranscript(demo.text);
    setNiche(demo.niche);
    setAudience(demo.audience);
    setTone(demo.tone);
    if (!title) setTitle(demo.label);
  }

  function applyBrand(id: string) {
    setBrandProfileId(id);
    const bp = brandProfiles.find((b) => b.id === id);
    if (bp) {
      setTone(bp.tone || tone);
      if (bp.niche) setNiche(bp.niche);
      if (bp.audience) setAudience(bp.audience);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError("Bitte gib einen Projekttitel ein.");
    if (platforms.length === 0) return setError("Bitte wähle mindestens eine Plattform.");
    if (transcript.trim().length < 40)
      return setError("Das Transkript ist zu kurz (mindestens 40 Zeichen für gute Ergebnisse).");

    setLoading(true);
    try {
      const data = await apiFetch<{ project: { id: string }; generated: number }>("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          niche,
          audience,
          tone,
          language,
          platforms,
          transcript,
          videoLengthSec: videoMin ? Math.round(Number(videoMin) * 60) : null,
          count,
          brandProfileId: brandProfileId || undefined,
        }),
      });
      router.push(`/dashboard/projekte/${data.project.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      setLoading(false);
    }
  }

  if (atLimit) {
    return (
      <Card className="border-amber-500/20">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-300">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Projekt-Limit erreicht</h3>
            <p className="mt-1 max-w-md text-sm text-slate-400">
              Dein aktueller Plan erlaubt keine weiteren Projekte. Upgrade deinen Plan, um mehr
              Projekte anzulegen.
            </p>
          </div>
          <Link href="/dashboard/abo">
            <Button>Plan upgraden</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      {/* Linke Spalte: Metadaten */}
      <div className="space-y-5 lg:col-span-1">
        <Card>
          <CardContent className="space-y-4 pt-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">Projekttitel *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z.B. Mein Podcast Folge 12" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="niche">Thema / Nische</Label>
              <Input id="niche" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="z.B. Online Marketing" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="audience">Zielgruppe</Label>
              <Input id="audience" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="z.B. Coaches & Berater" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="tone">Tonalität</Label>
                <Select id="tone" value={tone} onChange={(e) => setTone(e.target.value)}>
                  {TONES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="language">Sprache</Label>
                <Select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="videoMin">Video-Länge (Minuten, optional)</Label>
              <Input id="videoMin" type="number" min="0" value={videoMin} onChange={(e) => setVideoMin(e.target.value)} placeholder="z.B. 22" />
            </div>
            {brandProfiles.length > 0 && (
              <div className="space-y-1.5">
                <Label htmlFor="brand">Brand Profile (optional)</Label>
                <Select id="brand" value={brandProfileId} onChange={(e) => applyBrand(e.target.value)}>
                  <option value="">Kein Brand Profile</option>
                  {brandProfiles.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 pt-5">
            <Label>Plattformen *</Label>
            <div className="grid grid-cols-1 gap-2">
              {PLATFORMS.map((p) => {
                const active = platforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "border-cyan/40 bg-cyan/10 text-foreground"
                        : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20",
                    )}
                  >
                    {p.label}
                    <span className={cn("size-4 rounded-full border", active ? "border-cyan bg-cyan" : "border-slate-600")} />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rechte Spalte: Transkript */}
      <div className="space-y-5 lg:col-span-2">
        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="transcript">Transkript oder Rohtext *</Label>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500">Demo laden:</span>
                {DEMO_TRANSCRIPTS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => applyDemo(d.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300 hover:bg-white/10"
                  >
                    <Wand2 className="size-3" /> {d.label}
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Füge hier dein Transkript ein (auch .srt/.vtt-Inhalte werden bereinigt) …"
              className="min-h-[320px] font-mono text-[13px] leading-relaxed"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>{transcript.length.toLocaleString("de-DE")} Zeichen</span>
              <span>Tipp: Je mehr Inhalt, desto bessere Clip-Ideen.</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="flex items-center justify-between">
              <Label htmlFor="count">Anzahl Clip-Ideen</Label>
              <span className="text-sm font-semibold text-cyan">{count}</span>
            </div>
            <input
              id="count"
              type="range"
              min={5}
              max={planMaxClips}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-cyan"
            />
            <p className="text-xs text-slate-500">
              Dein Plan erlaubt bis zu {planMaxClips} Clips pro Projekt.
            </p>
          </CardContent>
        </Card>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertTriangle className="size-4 shrink-0" /> {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link href="/dashboard/projekte">
            <Button type="button" variant="ghost">Abbrechen</Button>
          </Link>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generiere Clips …
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Projekt erstellen & {count} Clips generieren
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
