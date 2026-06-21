import { Download, FolderKanban, CalendarDays, Layers } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportButtons } from "@/components/shared/export-buttons";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Exporte" };

export default async function ExportsPage() {
  const user = await getCurrentUser();
  const [projects, logs] = await Promise.all([
    prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { clips: true } } },
    }),
    prisma.exportLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Exporte"
        description="Lade deine Clips als CSV, Markdown, JSON oder als Cutter-Export herunter."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="size-4 text-cyan" /> Alle Projekte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-slate-400">Exportiere alle Clips über sämtliche Projekte hinweg.</p>
            <ExportButtons scope="all" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-4 text-electric" /> Content-Kalender
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-slate-400">Exportiere deinen Redaktionsplan.</p>
            <ExportButtons scope="calendar" />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
          <FolderKanban className="size-5 text-cyan" /> Pro Projekt
        </h2>
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-slate-400">
              Noch keine Projekte zum Exportieren.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <Card key={p.id}>
                <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-medium text-foreground">{p.title}</div>
                    <div className="text-xs text-slate-500">{p._count.clips} Clips</div>
                  </div>
                  <ExportButtons scope="project" projectId={p.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {logs.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="size-4 text-slate-400" /> Letzte Exporte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {logs.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                <span className="text-slate-300">
                  {l.format} <span className="text-slate-500">· {l.scope}</span>
                </span>
                <span className="text-xs text-slate-500">{formatDateTime(l.createdAt)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
