import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Clock,
  Scissors,
  Hash,
  Megaphone,
  CalendarDays,
  Download,
  Wand2,
  Film,
  Zap,
  Target,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { FAQ } from "@/components/marketing/faq";
import { PricingCards } from "@/components/shared/pricing-cards";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlatformBadge } from "@/components/shared/badges";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <div className="absolute inset-0 bg-dotgrid opacity-40" aria-hidden />
        <div className="section relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 inline-flex">
              <Sparkles className="size-3 text-cyan" /> Short-Form-Content auf Autopilot
            </Badge>
            <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
              Verwandle ein langes Video in{" "}
              <span className="gradient-text">20 virale Short-Form-Ideen</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-slate-400">
              Füge ein Transkript ein – ClipStorm AI erstellt automatisch Clip-Ideen, Hooks, Captions,
              Hashtags, Text-Overlays und Schnittanweisungen für TikTok, Reels, Shorts, LinkedIn & Snapchat.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }))}>
                <Sparkles className="size-4" /> Jetzt kostenlos starten
              </Link>
              <Link href="#how" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
                So funktioniert's <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {(["tiktok", "reels", "shorts", "linkedin", "snapchat"] as const).map((p) => (
                <PlatformBadge key={p} platform={p} />
              ))}
            </div>
          </div>

          {/* Vorher / Nachher */}
          <BeforeAfter />
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Stundenlanges Schneiden frisst deine Reichweite
          </h2>
          <p className="mt-4 text-slate-400">
            Du produzierst großartige lange Inhalte – aber das Auskoppeln von Shorts dauert ewig.
            Welche Stelle ist viral? Welcher Hook zieht? Welche Hashtags? Genau hier setzt ClipStorm an.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          <ProblemCard icon={Clock} title="Zu zeitaufwändig" text="Ein langes Video manuell in Clips zu zerlegen kostet Stunden." />
          <ProblemCard icon={Target} title="Kein System" text="Welche Momente performen? Bauchgefühl statt klarer Struktur." />
          <ProblemCard icon={Layers} title="Plattform-Chaos" text="Jede Plattform braucht eigene Hooks, Captions und Formate." />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="section py-16">
        <SectionHeading
          eyebrow="So funktioniert's"
          title="In 3 Schritten zu fertigen Clips"
          subtitle="Kein Setup, keine API-Keys. Text rein, Clips raus."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <StepCard step="1" icon={Wand2} title="Transkript einfügen" text="Kopiere dein Transkript oder den Rohtext aus Video, Podcast oder Webinar in das Projekt." />
          <StepCard step="2" icon={Sparkles} title="Clips generieren" text="ClipStorm analysiert den Text und erstellt 10–30 Clip-Ideen inkl. Hook, Caption & Score." />
          <StepCard step="3" icon={Download} title="Planen & exportieren" text="Plane Posts im Kalender und exportiere als CSV, Markdown, JSON oder Cutter-Export." />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section py-16">
        <SectionHeading
          eyebrow="Features"
          title="Alles, was du für virale Shorts brauchst"
          subtitle="Von der Idee bis zum fertigen Schnittplan – in einem Tool."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={Sparkles} title="Clip-Ideen mit Score" text="10–30 Ideen pro Projekt mit Viral-Potenzial-Score und Schwierigkeitsgrad." />
          <FeatureCard icon={Zap} title="Hook Engine" text="9 Hook-Typen: Problem, Shock, Story, Zahlen, Fehler, Mythos & mehr." />
          <FeatureCard icon={Megaphone} title="Captions & CTAs" text="Plattformgerechte Captions inklusive passender Call-to-Actions." />
          <FeatureCard icon={Hash} title="Hashtag-Vorschläge" text="Relevante Hashtags aus Keywords, Nische und Plattform." />
          <FeatureCard icon={Scissors} title="Schnittanweisungen" text="Konkrete Cut-Hinweise, Text-Overlays und B-Roll-Ideen für den Editor." />
          <FeatureCard icon={Layers} title="Plattform-Versionen" text="TikTok, Reels, Shorts, LinkedIn & Snapchat – je eigene Variante." />
          <FeatureCard icon={CalendarDays} title="Content-Kalender" text="Posts planen, Status verwalten, Monats- und Listenansicht." />
          <FeatureCard icon={Download} title="Export für Cutter" text="CSV, Markdown, JSON und ein Cutter-Export mit Szene, Overlay, B-Roll, CTA." />
          <FeatureCard icon={Film} title="Brand Profile" text="Tonalität, Tabu-Wörter und CTA-Stil fließen automatisch in die Generierung." />
        </div>
      </section>

      {/* PRICING */}
      <section id="preise" className="section py-16">
        <SectionHeading
          eyebrow="Preise"
          title="Fair und transparent"
          subtitle="Starte kostenlos. Upgrade, wenn du mehr Output brauchst."
        />
        <div className="mt-10">
          <PricingCards />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section py-16">
        <SectionHeading eyebrow="FAQ" title="Häufige Fragen" />
        <div className="mt-10">
          <FAQ />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section py-16">
        <div className="relative overflow-hidden rounded-3xl border border-cyan/20 bg-gradient-to-br from-cyan/10 via-electric/5 to-transparent p-10 text-center sm:p-16">
          <div className="absolute inset-0 bg-dotgrid opacity-30" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Bereit, schneller viral zu gehen?
            </h2>
            <p className="mt-4 text-slate-400">
              Erstelle dein erstes Projekt in unter einer Minute – komplett kostenlos.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }))}>
                <Sparkles className="size-4" /> Kostenlos starten
              </Link>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <CheckCircle2 className="size-4 text-emerald-400" /> Keine Kreditkarte nötig
              </span>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function BeforeAfter() {
  const clips = [
    { t: "Der Fehler bei KI-Automatisierung", p: "tiktok", s: 92 },
    { t: "3 Dinge, die ich früher wissen wollte", p: "reels", s: 87 },
    { t: "Warum 90% im Januar aufgeben", p: "shorts", s: 81 },
    { t: "Niemand spricht über diesen Punkt", p: "linkedin", s: 78 },
  ];
  return (
    <div className="mx-auto mt-16 grid max-w-5xl items-center gap-4 md:grid-cols-[1fr_auto_1.2fr]">
      {/* Vorher */}
      <div className="rounded-2xl border border-white/10 bg-card/60 p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          <Film className="size-4" /> Vorher
        </div>
        <div className="flex aspect-video items-center justify-center rounded-xl border border-white/5 bg-navy-300/60">
          <div className="text-center">
            <Film className="mx-auto size-8 text-slate-600" />
            <p className="mt-2 text-sm text-slate-400">1 langes Video / Podcast</p>
            <p className="text-xs text-slate-400">z.B. 45 Minuten</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-electric text-navy-900 shadow-glow">
          <ArrowRight className="size-6" />
        </div>
      </div>

      {/* Nachher */}
      <div className="rounded-2xl border border-cyan/20 bg-gradient-to-b from-cyan/[0.06] to-transparent p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-cyan">
          <Sparkles className="size-4" /> Nachher
        </div>
        <div className="space-y-2">
          {clips.map((c, i) => (
            <div key={i} className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-navy-300/40 px-3 py-2.5">
              <span className="truncate text-sm text-foreground">{c.t}</span>
              <div className="flex shrink-0 items-center gap-2">
                <PlatformBadge platform={c.p} />
                <span className="text-sm font-bold text-cyan">{c.s}</span>
              </div>
            </div>
          ))}
          <div className="pt-1 text-center text-xs text-slate-500">+ 16 weitere Clip-Ideen …</div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan">{eyebrow}</div>
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-slate-400">{subtitle}</p>}
    </div>
  );
}

function ProblemCard({ icon: Icon, title, text }: { icon: typeof Clock; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-card/60 p-5 text-center">
      <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
        <Icon className="size-5" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-400">{text}</p>
    </div>
  );
}

function StepCard({ step, icon: Icon, title, text }: { step: string; icon: typeof Clock; title: string; text: string }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-card/60 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-electric text-lg font-bold text-navy-900">
          {step}
        </span>
        <Icon className="size-5 text-cyan" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-400">{text}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }: { icon: typeof Clock; title: string; text: string }) {
  return (
    <div className="card-hover rounded-xl border border-white/10 bg-card/60 p-5">
      <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
        <Icon className="size-5" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-400">{text}</p>
    </div>
  );
}
