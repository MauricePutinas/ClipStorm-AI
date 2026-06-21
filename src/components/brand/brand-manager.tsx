"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Star, Pencil, Save, X } from "lucide-react";
import { PLATFORMS, TONES, CTA_STYLES, platformMeta } from "@/lib/constants";
import { apiFetch } from "@/lib/client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/shared/delete-button";
import type { PlatformId } from "@/lib/types";

export interface BrandProfileData {
  id: string;
  name: string;
  audience: string;
  tone: string;
  niche: string;
  avoidWords: string[];
  preferredPlatforms: string[];
  ctaStyle: string;
  isDefault: boolean;
}

const EMPTY = {
  name: "",
  audience: "",
  tone: "locker",
  niche: "",
  avoidWords: "",
  preferredPlatforms: [] as PlatformId[],
  ctaStyle: "direkt",
  isDefault: false,
};

export function BrandManager({ profiles }: { profiles: BrandProfileData[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startCreate() {
    setForm({ ...EMPTY });
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(p: BrandProfileData) {
    setForm({
      name: p.name,
      audience: p.audience,
      tone: p.tone,
      niche: p.niche,
      avoidWords: p.avoidWords.join(", "),
      preferredPlatforms: p.preferredPlatforms as PlatformId[],
      ctaStyle: p.ctaStyle,
      isDefault: p.isDefault,
    });
    setEditingId(p.id);
    setShowForm(true);
  }

  function togglePlatform(id: PlatformId) {
    setForm((f) => ({
      ...f,
      preferredPlatforms: f.preferredPlatforms.includes(id)
        ? f.preferredPlatforms.filter((p) => p !== id)
        : [...f.preferredPlatforms, id],
    }));
  }

  async function save() {
    if (!form.name.trim()) {
      setError("Name ist erforderlich.");
      return;
    }
    setLoading(true);
    setError(null);
    const body = {
      name: form.name.trim(),
      audience: form.audience,
      tone: form.tone,
      niche: form.niche,
      avoidWords: form.avoidWords
        .split(/[,\n]/)
        .map((w) => w.trim())
        .filter(Boolean),
      preferredPlatforms: form.preferredPlatforms,
      ctaStyle: form.ctaStyle,
      isDefault: form.isDefault,
    };
    try {
      await apiFetch(editingId ? `/api/brand/${editingId}` : "/api/brand", {
        method: editingId ? "PATCH" : "POST",
        body: JSON.stringify(body),
      });
      setShowForm(false);
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={startCreate}>
          <Plus className="size-4" /> Neues Brand Profile
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{editingId ? "Brand Profile bearbeiten" : "Neues Brand Profile"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
              <X className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Name / Brand</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="z.B. Mein Creator Brand" />
              </div>
              <div className="space-y-1.5">
                <Label>Nische</Label>
                <Input value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} placeholder="z.B. Online Business" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Zielgruppe</Label>
                <Input value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} placeholder="z.B. Selbstständige 25–40" />
              </div>
              <div className="space-y-1.5">
                <Label>Tonalität</Label>
                <Select value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })}>
                  {TONES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>CTA-Stil</Label>
                <Select value={form.ctaStyle} onChange={(e) => setForm({ ...form, ctaStyle: e.target.value })}>
                  {CTA_STYLES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Wörter, die vermieden werden sollen (kommagetrennt)</Label>
                <Input
                  value={form.avoidWords}
                  onChange={(e) => setForm({ ...form, avoidWords: e.target.value })}
                  placeholder="z.B. billig, Garantie"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bevorzugte Plattformen</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => {
                  const active = form.preferredPlatforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
                        active ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-white/10 bg-white/[0.02] text-slate-400",
                      )}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                className="size-4 accent-cyan"
              />
              Als Standard-Profil verwenden
            </label>

            {error && <p className="text-sm text-red-300">{error}</p>}

            <div className="flex gap-2">
              <Button onClick={save} disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Speichern
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Abbrechen</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {profiles.length === 0 && !showForm ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-slate-400">
            Noch kein Brand Profile. Lege eines an, um Tonalität, CTA-Stil und Tabu-Wörter automatisch
            in die Generierung einfließen zu lassen.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {profiles.map((p) => (
            <Card key={p.id} className="card-hover">
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{p.name}</h3>
                      {p.isDefault && (
                        <Badge variant="default">
                          <Star className="size-3" /> Standard
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{p.niche || "Ohne Nische"}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="inline-flex size-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 hover:border-cyan/30 hover:text-cyan"
                      aria-label="Bearbeiten"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <DeleteButton url={`/api/brand/${p.id}`} iconOnly confirmText={`Brand Profile "${p.name}" löschen?`} />
                  </div>
                </div>
                <dl className="space-y-1 text-sm">
                  <Row label="Zielgruppe" value={p.audience || "—"} />
                  <Row label="Tonalität" value={p.tone} />
                  <Row label="CTA-Stil" value={p.ctaStyle} />
                </dl>
                {p.preferredPlatforms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.preferredPlatforms.map((pl) => (
                      <span key={pl} className={cn("rounded-full border px-2 py-0.5 text-xs", platformMeta(pl).badge)}>
                        {platformMeta(pl).short}
                      </span>
                    ))}
                  </div>
                )}
                {p.avoidWords.length > 0 && (
                  <div className="text-xs text-slate-500">
                    Tabu: {p.avoidWords.map((w) => `„${w}“`).join(", ")}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right text-slate-300">{value}</dd>
    </div>
  );
}
