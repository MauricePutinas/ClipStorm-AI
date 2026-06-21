import Link from "next/link";
import {
  FolderKanban,
  Clapperboard,
  CalendarClock,
  Sparkles,
  ArrowRight,
  Plus,
  Rocket,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getPlanMeta } from "@/lib/plan";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge, ScoreBar } from "@/components/shared/badges";
import { formatDate, formatDateTime } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const plan = getPlanMeta(user.plan);

  const [projectCount, clipCount, plannedCount, publishedCount, recentProjects, upcoming, topClips] =
    await Promise.all([
      prisma.project.count({ where: { userId: user.id } }),
      prisma.clipIdea.count({ where: { project: { userId: user.id } } }),
      prisma.calendarItem.count({ where: { userId: user.id, status: "PLANNED" } }),
      prisma.calendarItem.count({ where: { userId: user.id, status: "PUBLISHED" } }),
      prisma.project.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: { _count: { select: { clips: true } } },
      }),
      prisma.calendarItem.findMany({
        where: { userId: user.id, scheduledAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
        orderBy: { scheduledAt: "asc" },
        take: 5,
        include: { clip: true },
      }),
      prisma.clipIdea.findMany({
        where: { project: { userId: user.id } },
        orderBy: { viralScore: "desc" },
        take: 5,
        include: { project: { select: { title: true } } },
      }),
    ]);

  const projectLimit = plan.maxProjects === null ? "∞" : plan.maxProjects;

  return (
    <div>
      <PageHeader
        title={`Willkommen zurück, ${user.name.split(" ")[0]} 👋`}
        description="Dein Überblick über Projekte, generierte Clips und geplante Posts."
      >
        <Link href="/dashboard/projekte/neu">
          <Button>
            <Plus className="size-4" /> Neues Projekt
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FolderKanban} label="Projekte" value={`${projectCount}/${projectLimit}`} hint={`Plan: ${plan.name}`} accent="cyan" />
        <StatCard icon={Clapperboard} label="Generierte Clips" value={clipCount} hint="über alle Projekte" accent="electric" />
        <StatCard icon={CalendarClock} label="Geplante Posts" value={plannedCount} hint="im Content-Kalender" accent="emerald" />
        <StatCard icon={Rocket} label="Veröffentlicht" value={publishedCount} hint="als veröffentlicht markiert" accent="red" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Letzte Projekte */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Letzte Analysen</CardTitle>
            <Link href="/dashboard/projekte" className="text-xs text-cyan hover:underline">
              Alle ansehen
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentProjects.length === 0 ? (
              <EmptyHint
                title="Noch keine Projekte"
                cta="Erstes Projekt erstellen"
                href="/dashboard/projekte/neu"
              />
            ) : (
              recentProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/projekte/${p.id}`}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 transition-colors hover:border-cyan/20 hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-foreground">{p.title}</div>
                    <div className="text-xs text-slate-500">
                      {p.niche || "Ohne Nische"} · aktualisiert {formatDate(p.updatedAt)}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge variant="secondary">{p._count.clips} Clips</Badge>
                    <ArrowRight className="size-4 text-slate-500" />
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Plan-Status */}
        <Card>
          <CardHeader>
            <CardTitle>Abo-Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold gradient-text">{plan.name}</span>
                {plan.priceMonthly > 0 && (
                  <span className="text-sm text-slate-400">{plan.priceMonthly} €/Monat</span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">{plan.tagline}</p>
            </div>
            <div className="space-y-1.5 text-sm">
              <UsageRow label="Projekte" value={projectCount} max={plan.maxProjects} />
              <div className="flex justify-between text-slate-400">
                <span>Clips / Projekt</span>
                <span className="text-slate-300">{plan.maxClipsPerProject}</span>
              </div>
            </div>
            <Link href="/dashboard/abo">
              <Button variant="outline" className="w-full">
                Plan verwalten
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Top Clips */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-cyan" /> Top Clip-Ideen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topClips.length === 0 ? (
              <p className="text-sm text-slate-500">Noch keine Clips generiert.</p>
            ) : (
              topClips.map((c) => (
                <div key={c.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{c.title}</span>
                    <span className="shrink-0 text-sm font-semibold text-cyan">{c.viralScore}</span>
                  </div>
                  <div className="mt-2"><ScoreBar score={c.viralScore} /></div>
                  <div className="mt-2 flex items-center gap-2">
                    <PlatformBadge platform={c.recommendedPlatform} />
                    <span className="text-xs text-slate-500">{c.project.title}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Kommende Posts */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="size-4 text-electric" /> Kommende Posts
            </CardTitle>
            <Link href="/dashboard/kalender" className="text-xs text-cyan hover:underline">
              Kalender
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 ? (
              <p className="text-sm text-slate-500">Keine geplanten Posts.</p>
            ) : (
              upcoming.map((i) => (
                <div key={i.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">{i.title}</div>
                    <div className="text-xs text-slate-500">{formatDateTime(i.scheduledAt)}</div>
                  </div>
                  <PlatformBadge platform={i.platform} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UsageRow({ label, value, max }: { label: string; value: number; max: number | null }) {
  const pct = max === null ? 8 : Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div>
      <div className="flex justify-between text-slate-400">
        <span>{label}</span>
        <span className="text-slate-300">
          {value}/{max === null ? "∞" : max}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan to-electric" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function EmptyHint({ title, cta, href }: { title: string; cta: string; href: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <p className="text-sm text-slate-400">{title}</p>
      <Link href={href}>
        <Button size="sm">
          <Plus className="size-4" /> {cta}
        </Button>
      </Link>
    </div>
  );
}
