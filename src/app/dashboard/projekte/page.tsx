import Link from "next/link";
import { Plus, FolderKanban, Clock, Languages } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getPlanMeta } from "@/lib/plan";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "@/components/shared/badges";
import { DeleteButton } from "@/components/shared/delete-button";
import { parseStringArray, formatDate } from "@/lib/utils";

export const metadata = { title: "Projekte" };

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  const plan = getPlanMeta(user.plan);
  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { clips: true } } },
  });

  const limitLabel = plan.maxProjects === null ? "∞" : plan.maxProjects;

  return (
    <div>
      <PageHeader
        title="Projekte"
        description={`${projects.length} von ${limitLabel} Projekten genutzt.`}
      >
        <Link href="/dashboard/projekte/neu">
          <Button>
            <Plus className="size-4" /> Neues Projekt
          </Button>
        </Link>
      </PageHeader>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-cyan/10 text-cyan">
              <FolderKanban className="size-7" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Noch keine Projekte</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-400">
                Erstelle dein erstes Projekt und verwandle ein Transkript in virale Short-Form-Ideen.
              </p>
            </div>
            <Link href="/dashboard/projekte/neu">
              <Button>
                <Plus className="size-4" /> Erstes Projekt erstellen
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => {
            const platforms = parseStringArray(p.platforms);
            return (
              <Card key={p.id} className="card-hover group flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-3 pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/dashboard/projekte/${p.id}`} className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-foreground transition-colors group-hover:text-cyan">
                        {p.title}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{p.niche || "Ohne Nische"}</p>
                    </Link>
                    <Badge variant={p.status === "ANALYZED" ? "success" : "secondary"}>
                      {p.status === "ANALYZED" ? "Analysiert" : "Entwurf"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {platforms.slice(0, 4).map((pl) => (
                      <PlatformBadge key={pl} platform={pl} />
                    ))}
                  </div>

                  <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <FolderKanban className="size-3.5" /> {p._count.clips} Clips
                    </span>
                    <span className="flex items-center gap-1">
                      <Languages className="size-3.5" /> {p.language.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" /> {formatDate(p.updatedAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-3">
                    <Link href={`/dashboard/projekte/${p.id}`}>
                      <Button size="sm" variant="secondary">Öffnen</Button>
                    </Link>
                    <DeleteButton
                      url={`/api/projects/${p.id}`}
                      confirmText={`Projekt "${p.title}" und alle Clips wirklich löschen?`}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
