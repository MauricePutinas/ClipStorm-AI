import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 bg-navy-600/50">
      <div className="section flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-sm text-sm text-slate-500">
            Aus langen Videos werden virale Shorts. Clip-Ideen, Hooks, Captions und Schnittpläne in Sekunden.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <Link href="/datenschutz" className="hover:text-foreground">Datenschutz</Link>
          <Link href="/impressum" className="hover:text-foreground">Impressum</Link>
        </div>
      </div>
      <div className="section border-t border-white/5 py-4 text-xs text-slate-400">
        © {new Date().getFullYear()} ClipStorm AI · Demo-Projekt. Keine echte Zahlungsabwicklung aktiv.
      </div>
    </footer>
  );
}
