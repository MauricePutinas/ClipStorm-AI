import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ok, fail, handleError, readJson } from "@/lib/api";
import { buildPlatformVersions } from "@/lib/services/clipService";
import { serializePlatformVersion } from "@/lib/serializers";
import { z } from "zod";
import { platformEnum } from "@/lib/validation";

const bodySchema = z.object({
  platforms: z.array(platformEnum).optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ clipId: string }> }) {
  try {
    const { clipId } = await params;
    const user = await getCurrentUser();
    const clip = await prisma.clipIdea.findFirst({
      where: { id: clipId, project: { userId: user.id } },
    });
    if (!clip) return fail("Clip nicht gefunden", 404);

    const body = await readJson(req);
    const input = bodySchema.parse(body);

    await buildPlatformVersions(clipId, input.platforms);

    const versions = await prisma.platformVersion.findMany({ where: { clipId } });
    return ok(versions.map(serializePlatformVersion));
  } catch (error) {
    return handleError(error);
  }
}
