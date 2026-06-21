import Link from "next/link";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ href = "/", className, compact = false }: { href?: string; className?: string; compact?: boolean }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-electric shadow-glow">
        <Zap className="size-5 text-navy-900" strokeWidth={2.5} />
      </span>
      {!compact && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          ClipStorm<span className="gradient-text"> AI</span>
        </span>
      )}
    </Link>
  );
}
