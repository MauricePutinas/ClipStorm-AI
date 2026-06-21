import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ok, fail, handleError, readJson } from "@/lib/api";
import { clipUpdateSchema } from "@/lib/validation";
import { serializeClip } from "@/lib/serializers";

async function getOwnedClip(clipId: string) {
  const user = await getCurrentUser();
  const clip = await prisma.clipIdea.findFirst({
    where: { id: clipId, project: { userId: user.id } },
    include: { platformVersions: true },
  });
  return { user, clip };
}

export async function GET(_req: Request, { params }: { params: Promise<{ clipId: string }> }) {
  try {
    const { clipId } = await params;
    const { clip } = await getOwnedClip(clipId);
    if (!clip) return fail("Clip nicht gefunden", 404);
    return ok(serializeClip(clip));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ clipId: string }> }) {
  try {
    const { clipId } = await params;
    const { clip } = await getOwnedClip(clipId);
    if (!clip) return fail("Clip nicht gefunden", 404);

    const body = await readJson(req);
    const input = clipUpdateSchema.parse(body);

    const updated = await prisma.clipIdea.update({
      where: { id: clipId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.hook !== undefined ? { hook: input.hook } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.recommendedPlatform !== undefined ? { recommendedPlatform: input.recommendedPlatform } : {}),
        ...(input.lengthSec !== undefined ? { lengthSec: input.lengthSec } : {}),
        ...(input.textOverlay !== undefined ? { textOverlay: input.textOverlay } : {}),
        ...(input.caption !== undefined ? { caption: input.caption } : {}),
        ...(input.hashtags !== undefined ? { hashtags: JSON.stringify(input.hashtags) } : {}),
        ...(input.cutInstruction !== undefined ? { cutInstruction: input.cutInstruction } : {}),
        ...(input.bRoll !== undefined ? { bRoll: input.bRoll } : {}),
        ...(input.cta !== undefined ? { cta: input.cta } : {}),
        ...(input.viralScore !== undefined ? { viralScore: input.viralScore } : {}),
        ...(input.difficulty !== undefined ? { difficulty: input.difficulty } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
      include: { platformVersions: true },
    });
    return ok(serializeClip(updated));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ clipId: string }> }) {
  try {
    const { clipId } = await params;
    const { clip } = await getOwnedClip(clipId);
    if (!clip) return fail("Clip nicht gefunden", 404);
    await prisma.clipIdea.delete({ where: { id: clipId } });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
