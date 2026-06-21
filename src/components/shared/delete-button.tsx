"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { cn } from "@/lib/utils";

interface Props {
  url: string;
  confirmText?: string;
  redirectTo?: string;
  className?: string;
  iconOnly?: boolean;
  label?: string;
}

export function DeleteButton({ url, confirmText, redirectTo, className, iconOnly, label = "Löschen" }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (confirmText && !window.confirm(confirmText)) return;
    setLoading(true);
    try {
      await apiFetch(url, { method: "DELETE" });
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Löschen fehlgeschlagen");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 text-sm font-medium text-slate-400 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 focus-ring disabled:opacity-50",
        iconOnly ? "size-8 justify-center" : "h-8 px-2.5 text-xs",
        className,
      )}
      aria-label={label}
    >
      {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
      {!iconOnly && label}
    </button>
  );
}
