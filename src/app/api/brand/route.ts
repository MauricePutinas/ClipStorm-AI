import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ok, handleError, readJson } from "@/lib/api";
import { brandProfileSchema } from "@/lib/validation";
import { serializeBrandProfile } from "@/lib/serializers";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const profiles = await prisma.brandProfile.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return ok(profiles.map(serializeBrandProfile));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await readJson(req);
    const input = brandProfileSchema.parse(body);

    // Wenn als Standard markiert: andere Profile zurücksetzen.
    if (input.isDefault) {
      await prisma.brandProfile.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const profile = await prisma.brandProfile.create({
      data: {
        userId: user.id,
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
    return ok(serializeBrandProfile(profile), 201);
  } catch (error) {
    return handleError(error);
  }
}
