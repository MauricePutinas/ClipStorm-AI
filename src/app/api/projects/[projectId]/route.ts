import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ok, fail, handleError, readJson } from "@/lib/api";
import { projectUpdateSchema } from "@/lib/validation";
import { serializeProject } from "@/lib/serializers";

async function getOwnedProject(projectId: string) {
  const user = await getCurrentUser();
  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
  return { user, project };
}

export async function GET(_req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const { project } = await getOwnedProject(projectId);
    if (!project) return fail("Projekt nicht gefunden", 404);
    return ok(serializeProject(project));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const { project } = await getOwnedProject(projectId);
    if (!project) return fail("Projekt nicht gefunden", 404);

    const body = await readJson(req);
    const input = projectUpdateSchema.parse(body);

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.niche !== undefined ? { niche: input.niche } : {}),
        ...(input.audience !== undefined ? { audience: input.audience } : {}),
        ...(input.tone !== undefined ? { tone: input.tone } : {}),
        ...(input.language !== undefined ? { language: input.language } : {}),
        ...(input.platforms !== undefined ? { platforms: JSON.stringify(input.platforms) } : {}),
        ...(input.transcript !== undefined ? { transcript: input.transcript } : {}),
        ...(input.videoLengthSec !== undefined ? { videoLengthSec: input.videoLengthSec } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
    });
    return ok(serializeProject(updated));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const { project } = await getOwnedProject(projectId);
    if (!project) return fail("Projekt nicht gefunden", 404);
    await prisma.project.delete({ where: { id: projectId } });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
