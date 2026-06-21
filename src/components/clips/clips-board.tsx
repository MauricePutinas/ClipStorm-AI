"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Clock } from "lucide-react";
import { PLATFORMS, CLIP_STATUS } from "@/lib/constants";
import { apiFetch } from "@/lib/client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { CopyButton } from "@/components/ui/copy-button";
import { DeleteButton } from "@/components/shared/delete-button";
import { PlatformBadge, DifficultyBadge, ScoreBar } from "@/components/shared/badges";

export interface BoardClip {
  id: string;
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  recommendedPlatform: string;
  lengthSec: number;
  viralScore: number;
  difficulty: string;
  status: string;
}

export function ClipsBoard({ clips, projectId }: { clips: BoardClip[]; projectId: string }) {
  const router = useRouter();
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("score");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...clips];
    if (platform !== "all") list = list.filter((c) => c.recommendedPlatform === platform);
    if (status !== "all") list = list.filter((c) => c.status === status);
    if (sort === "score") list.sort((a, b) => b.viralScore - a.viralScore);
    else if (sort === "length") list.sort((a, b) => a.lengthSec - b.lengthSec);
    return list;
  }, [clips, platform, status, sort]);

  async function changeStatus(id: string, newStatus: string) {
    setBusyId(id);
    try {
      await apiFetch(`/api/clips/${id}`, { method: "PATCH", body: JSON.stringify({ status: newStatus }) });
      router.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Status-Update fehlgeschlagen");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select value={platform} onChange={(e) => setPlatform(e.target.value)} className="h-9 w-auto min-w-[150px]">
          <option value="all">Alle Plattformen</option>
          {PLATFORMS.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 w-auto min-w-[140px]">
          <option value="all">Alle Status</option>
          {CLIP_STATUS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 w-auto min-w-[150px]">
          <option value="score">Sortieren: Viral-Score</option>
          <option value="length">Sortieren: Länge</option>
        </Select>
        <span className="ml-auto text-sm text-slate-500">{filtered.length} Clips</span>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-slate-400">
            Keine Clips für diese Filter. Passe die Filter an oder generiere neue Clips.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.id} className={cn("card-hover flex flex-col", busyId === c.id && "opacity-60")}>
              <CardContent className="flex flex-1 flex-col gap-3 pt-5">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/dashboard/projekte/${projectId}/clips/${c.id}`} className="min-w-0 flex-1 group">
                    <h3 className="line-clamp-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-cyan">
                      {c.title}
                    </h3>
                  </Link>
                  <span className="shrink-0 text-lg font-bold text-cyan">{c.viralScore}</span>
                </div>

                <ScoreBar score={c.viralScore} />

                <p className="line-clamp-2 text-sm text-slate-400">{c.hook}</p>

                <div className="flex flex-wrap items-center gap-1.5">
                  <PlatformBadge platform={c.recommendedPlatform} />
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                    <Clock className="size-3" /> {c.lengthSec}s
                  </span>
                  <DifficultyBadge difficulty={c.difficulty} />
                </div>

                <div className="mt-auto flex items-center gap-2 border-t border-white/5 pt-3">
                  <Select
                    value={c.status}
                    onChange={(e) => changeStatus(c.id, e.target.value)}
                    className="h-8 flex-1 text-xs"
                  >
                    {CLIP_STATUS.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </Select>
                  <CopyButton value={c.caption} label="Caption" />
                  <Link
                    href={`/dashboard/projekte/${projectId}/clips/${c.id}`}
                    className="inline-flex size-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-cyan/30 hover:text-cyan"
                    aria-label="Clip öffnen"
                  >
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
