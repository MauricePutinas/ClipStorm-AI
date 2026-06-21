"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  size?: "sm" | "default";
}

export function CopyButton({ value, label, className, size = "sm" }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback für ältere Browser
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } finally {
        document.body.removeChild(ta);
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-foreground focus-ring",
        size === "sm" ? "h-7 px-2 text-xs" : "h-9 px-3 text-sm",
        className,
      )}
      aria-label={`${label ?? "Text"} kopieren`}
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-emerald-400" /> Kopiert
        </>
      ) : (
        <>
          <Copy className="size-3.5" /> {label ?? "Kopieren"}
        </>
      )}
    </button>
  );
}
