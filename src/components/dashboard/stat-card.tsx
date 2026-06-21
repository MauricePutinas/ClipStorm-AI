import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "cyan",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: "cyan" | "electric" | "emerald" | "red";
}) {
  const accentMap = {
    cyan: "text-cyan bg-cyan/10",
    electric: "text-electric bg-electric/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    red: "text-red-400 bg-red-500/10",
  } as const;

  return (
    <Card className="card-hover p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{label}</span>
        <span className={cn("flex size-9 items-center justify-center rounded-lg", accentMap[accent])}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-foreground">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </Card>
  );
}
