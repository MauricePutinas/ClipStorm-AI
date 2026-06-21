import { FileText, FileJson, Table, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  scope: "project" | "all" | "calendar";
  projectId?: string;
  className?: string;
  showCutter?: boolean;
}

// Export-Downloads als einfache Links (GET-Download, kein Client-State nötig).
export function ExportButtons({ scope, projectId, className, showCutter = true }: Props) {
  const base = `/api/export?scope=${scope}${projectId ? `&projectId=${projectId}` : ""}`;
  const items: { format: string; label: string; icon: typeof FileText }[] = [
    { format: "csv", label: "CSV", icon: Table },
    { format: "markdown", label: "Markdown", icon: FileText },
    { format: "json", label: "JSON", icon: FileJson },
  ];
  if (showCutter && scope !== "calendar") {
    items.push({ format: "cutter", label: "Cutter-CSV", icon: Scissors });
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <a
            key={it.format}
            href={`${base}&format=${it.format}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 text-sm font-medium text-slate-300 transition-colors hover:border-cyan/30 hover:bg-cyan/10 hover:text-cyan focus-ring"
          >
            <Icon className="size-4" /> {it.label}
          </a>
        );
      })}
    </div>
  );
}
