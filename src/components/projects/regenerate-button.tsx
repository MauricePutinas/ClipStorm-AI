"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { Button } from "@/components/ui/button";

export function RegenerateButton({ projectId, maxClips }: { projectId: string; maxClips: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(Math.min(12, maxClips));
  const [open, setOpen] = useState(false);

  async function regenerate() {
    setLoading(true);
    try {
      await apiFetch(`/api/projects/${projectId}/generate`, {
        method: "POST",
        body: JSON.stringify({ count, replace: true }),
      });
      setOpen(false);
      router.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Generierung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <RefreshCw className="size-4" /> Neu generieren
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-1.5">
      <label className="flex items-center gap-2 px-2 text-xs text-slate-400">
        Anzahl
        <input
          type="number"
          min={5}
          max={maxClips}
          value={count}
          onChange={(e) => setCount(Math.min(maxClips, Math.max(5, Number(e.target.value))))}
          className="h-8 w-16 rounded-md border border-input bg-navy-300/60 px-2 text-sm text-foreground focus-ring"
        />
      </label>
      <Button size="sm" onClick={regenerate} disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
        Generieren
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
        Abbrechen
      </Button>
    </div>
  );
}
