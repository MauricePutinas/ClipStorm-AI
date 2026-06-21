"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { LANGUAGES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/ui/copy-button";
import type { HookVariant } from "@/lib/types";

const EXAMPLES = ["KI-Automatisierung", "Krafttraining für Anfänger", "Webdesign für Selbstständige", "Produktivität"];

export function HookEngine() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("de");
  const [variants, setVariants] = useState<HookVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(t?: string) {
    const value = (t ?? topic).trim();
    if (value.length < 3) {
      setError("Bitte gib ein Thema ein (mind. 3 Zeichen).");
      return;
    }
    if (t) setTopic(t);
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<HookVariant[]>("/api/hooks", {
        method: "POST",
        body: JSON.stringify({ topic: value, language }),
      });
      setVariants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generierung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <div className="space-y-1.5">
              <Label htmlFor="topic">Thema</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate()}
                placeholder="Worüber geht dein Clip?"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lang">Sprache</Label>
              <Select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full sm:w-32">
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={() => generate()} disabled={loading} className="w-full sm:w-auto">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Hooks generieren
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500">Beispiele:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => generate(ex)}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10"
              >
                {ex}
              </button>
            ))}
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
        </CardContent>
      </Card>

      {variants.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {variants.map((v) => (
            <Card key={v.type} className="card-hover">
              <CardContent className="space-y-2 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-cyan">{v.label}</span>
                  <CopyButton value={v.text} />
                </div>
                <p className="text-sm leading-relaxed text-foreground">{v.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
