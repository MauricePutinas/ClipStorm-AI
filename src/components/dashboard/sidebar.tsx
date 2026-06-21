"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Shield, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-gradient-to-r from-cyan/15 to-electric/5 text-foreground shadow-[inset_1px_0_0_0_rgba(34,211,238,0.6)]"
                : "text-slate-400 hover:bg-white/5 hover:text-foreground",
            )}
          >
            <Icon className={cn("size-[18px]", active ? "text-cyan" : "text-slate-500 group-hover:text-slate-300")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Logo href="/dashboard" />
      <NavLinks onNavigate={onNavigate} />
      <Link
        href="/admin"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
      >
        <Shield className="size-[18px]" />
        Adminbereich
      </Link>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/5 bg-navy-400/40 backdrop-blur-xl lg:block">
      <SidebarInner />
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      (prev ?? triggerRef.current)?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 lg:hidden focus-ring"
        aria-label="Menü öffnen"
        aria-expanded={open}
      >
        <Menu className="size-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigationsmenü"
            tabIndex={-1}
            className="absolute left-0 top-0 h-full w-72 border-r border-white/10 bg-navy-400 outline-none"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 inline-flex size-8 items-center justify-center rounded-md text-slate-400 hover:bg-white/5"
              aria-label="Menü schließen"
            >
              <X className="size-5" />
            </button>
            <SidebarInner onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
