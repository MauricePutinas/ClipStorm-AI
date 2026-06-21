import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ok, fail, handleError, readJson } from "@/lib/api";
import { projectCreateSchema } from "@/lib/validation";
import { canCreateProject } from "@/lib/plan";
import { generateForProject } from "@/lib/services/clipService";
import { serializeProject } from "@/lib/serializers";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { clips: true } } },
    });
    return ok(
      projects.map((p) => ({ ...serializeProject(p), clipCount: p._count.clips })),
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await readJson(req);
    const input = projectCreateSchema.parse(body);

    // Plan-Limit serverseitig prüfen
    const projectCount = await prisma.project.count({ where: { userId: user.id } });
    const check = canCreateProject(user.plan, projectCount);
    if (!check.allowed) {
      return fail(check.reason ?? "Plan-Limit erreicht", 403, { limit: check.limit, current: check.current });
    }

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        title: input.title,
        niche: input.niche,
        audience: input.audience,
        tone: input.tone,
        language: input.language,
        platforms: JSON.stringify(input.platforms),
        transcript: input.transcript,
        videoLengthSec: input.videoLengthSec ?? null,
        status: "DRAFT",
      },
    });

    // Direkt generieren, wenn ein ausreichend langes Transkript vorliegt.
    let projectForResponse = project;
    let generated = 0;
    if (input.transcript && input.transcript.trim().length >= 40) {
      const result = await generateForProject(project.id, {
        count: input.count,
        brandProfileId: input.brandProfileId,
        replace: true,
      });
      generated = result.count;
      // Frischen Stand laden (Status wurde auf ANALYZED gesetzt).
      projectForResponse = await prisma.project.findUniqueOrThrow({ where: { id: project.id } });
    }

    return ok({ project: serializeProject(projectForResponse), generated }, 201);
  } catch (error) {
    return handleError(error);
  }
}
