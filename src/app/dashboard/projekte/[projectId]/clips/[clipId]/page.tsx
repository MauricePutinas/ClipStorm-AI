import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { parseStringArray } from "@/lib/utils";
import { serializeClip } from "@/lib/serializers";
import { PageHeader } from "@/components/dashboard/page-header";
import { ClipEditor, type EditorClip } from "@/components/clips/clip-editor";
import type { PlatformId } from "@/lib/types";

export default async function ClipDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; clipId: string }>;
}) {
  const { projectId, clipId } = await params;
  const user = await getCurrentUser();
  const clip = await prisma.clipIdea.findFirst({
    where: { id: clipId, projectId, project: { userId: user.id } },
    include: { platformVersions: true, project: true },
  });
  if (!clip) notFound();

  const s = serializeClip(clip);
  const editorClip: EditorClip = {
    id: s.id,
    projectId: s.projectId,
    title: s.title,
    hook: s.hook,
    description: s.description,
    recommendedPlatform: s.recommendedPlatform,
    lengthSec: s.lengthSec,
    textOverlay: s.textOverlay,
    caption: s.caption,
    hashtags: s.hashtags,
    cutInstruction: s.cutInstruction,
    bRoll: s.bRoll,
    cta: s.cta,
    viralScore: s.viralScore,
    difficulty: s.difficulty,
    status: s.status,
    platformVersions: s.platformVersions,
  };

  const projectPlatforms = parseStringArray(clip.project.platforms) as PlatformId[];

  return (
    <div>
      <Link
        href={`/dashboard/projekte/${projectId}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Zurück zum Projekt
      </Link>
      <PageHeader title={clip.title} description={`Clip aus „${clip.project.title}“`} />
      <ClipEditor clip={editorClip} projectPlatforms={projectPlatforms} />
    </div>
  );
}
