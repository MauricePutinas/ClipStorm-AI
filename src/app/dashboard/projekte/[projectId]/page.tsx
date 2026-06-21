import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { maxClipsForPlan } from "@/lib/plan";
import { parseStringArray } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "@/components/shared/badges";
import { ExportButtons } from "@/components/shared/export-buttons";
import { RegenerateButton } from "@/components/projects/regenerate-button";
import { ClipsBoard, type BoardClip } from "@/components/clips/clips-board";
import { serializeClip } from "@/lib/serializers";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const user = await getCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: { clips: { orderBy: { order: "asc" } } },
  });
  if (!project) notFound();

  const platforms = parseStringArray(project.platforms);
  const boardClips: BoardClip[] = project.clips.map((c) => {
    const s = serializeClip(c);
    return {
      id: s.id,
      title: s.title,
      hook: s.hook,
      caption: s.caption,
      hashtags: s.hashtags,
      recommendedPlatform: s.recommendedPlatform,
      lengthSec: s.lengthSec,
      viralScore: s.viralScore,
      difficulty: s.difficulty,
      status: s.status,
    };
  });

  return (
    <div>
      <Link
        href="/dashboard/projekte"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Zurück zu Projekten
      </Link>

      <PageHeader title={project.title} description={project.audience || project.niche || undefined}>
        <RegenerateButton projectId={project.id} maxClips={maxClipsForPlan(user.plan)} />
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-5 text-sm">
            <Meta label="Status">
              <Badge variant={project.status === "ANALYZED" ? "success" : "secondary"}>
                {project.status === "ANALYZED" ? "Analysiert" : "Entwurf"}
              </Badge>
            </Meta>
            <Meta label="Nische">{project.niche || "—"}</Meta>
            <Meta label="Tonalität">{project.tone}</Meta>
            <Meta label="Sprache">{project.language.toUpperCase()}</Meta>
            <Meta label="Clips">{project.clips.length}</Meta>
            <Meta label="Plattformen">
              <span className="flex flex-wrap gap-1.5">
                {platforms.map((p) => (
                  <PlatformBadge key={p} platform={p} />
                ))}
              </span>
            </Meta>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FileText className="size-4 text-cyan" /> Exporte
            </div>
            <ExportButtons scope="project" projectId={project.id} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="size-5 text-cyan" />
          <h2 className="text-lg font-semibold text-foreground">Clip-Ideen</h2>
        </div>
        {boardClips.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-sm text-slate-400">
                Noch keine Clips. Klicke auf „Neu generieren“, um Clip-Ideen zu erzeugen.
              </p>
            </CardContent>
          </Card>
        ) : (
          <ClipsBoard clips={boardClips} projectId={project.id} />
        )}
      </div>
    </div>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
      <span className="font-medium text-foreground">{children}</span>
    </div>
  );
}
