import { cn } from "@/lib/utils";
import { CLIP_STATUS, DIFFICULTIES, platformMeta } from "@/lib/constants";
import { classForScore } from "@/lib/utils";

export function PlatformBadge({ platform, className }: { platform: string; className?: string }) {
  const meta = platformMeta(platform);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        meta.badge,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = CLIP_STATUS.find((s) => s.id === status) ?? CLIP_STATUS[0];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        meta.color,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}

export function DifficultyBadge({ difficulty, className }: { difficulty: string; className?: string }) {
  const meta = DIFFICULTIES.find((d) => d.id === difficulty) ?? DIFFICULTIES[1];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        meta.color,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}

export function ScoreBadge({ score, className }: { score: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-1 font-semibold", classForScore(score), className)}>
      <span className="text-base">{score}</span>
      <span className="text-xs text-slate-500">/100</span>
    </span>
  );
}

export function ScoreBar({ score, className }: { score: number; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/5", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-electric to-cyan transition-all"
        style={{ width: `${Math.max(3, Math.min(100, score))}%` }}
      />
    </div>
  );
}
