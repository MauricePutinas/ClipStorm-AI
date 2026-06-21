import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ok, fail, handleError, readJson } from "@/lib/api";
import { brandProfileSchema } from "@/lib/validation";
import { serializeBrandProfile } from "@/lib/serializers";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const existing = await prisma.brandProfile.findFirst({ where: { id, userId: user.id } });
    if (!existing) return fail("Brand Profile nicht gefunden", 404);

    const body = await readJson(req);
    const input = brandProfileSchema.parse(body);

    if (input.isDefault) {
      await prisma.brandProfile.updateMany({
        where: { userId: user.id, NOT: { id } },
        data: { isDefault: false },
      });
    }

    const profile = await prisma.brandProfile.update({
      where: { id },
      data: {
        name: input.name,
        audience: input.audience,
        tone: input.tone,
        niche: input.niche,
        avoidWords: JSON.stringify(input.avoidWords),
        preferredPlatforms: JSON.stringify(input.preferredPlatforms),
        ctaStyle: input.ctaStyle,
        isDefault: input.isDefault,
      },
    });
    return ok(serializeBrandProfile(profile));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const existing = await prisma.brandProfile.findFirst({ where: { id, userId: user.id } });
    if (!existing) return fail("Brand Profile nicht gefunden", 404);
    await prisma.brandProfile.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
