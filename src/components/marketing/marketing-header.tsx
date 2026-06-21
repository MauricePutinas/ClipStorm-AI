import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-navy-500/70 backdrop-blur-xl">
      <div className="section flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-slate-300 transition-colors hover:text-foreground">Features</a>
          <a href="#how" className="text-sm text-slate-300 transition-colors hover:text-foreground">So funktioniert's</a>
          <a href="#preise" className="text-sm text-slate-300 transition-colors hover:text-foreground">Preise</a>
          <a href="#faq" className="text-sm text-slate-300 transition-colors hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}>
            Einloggen
          </Link>
          <Link href="/dashboard" className={cn(buttonVariants({ size: "sm" }))}>
            Kostenlos starten
          </Link>
        </div>
      </div>
    </header>
  );
}
