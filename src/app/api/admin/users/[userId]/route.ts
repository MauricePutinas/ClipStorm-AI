import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { ok, fail, handleError, readJson } from "@/lib/api";
import { adminUserUpdateSchema } from "@/lib/validation";

export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    if (!(await isAdmin())) return fail("Nicht autorisiert", 401);
    const { userId } = await params;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return fail("Nutzer nicht gefunden", 404);

    const body = await readJson(req);
    const input = adminUserUpdateSchema.parse(body);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.plan !== undefined ? { plan: input.plan } : {}),
        ...(input.role !== undefined ? { role: input.role } : {}),
      },
    });

    // Subscription-Plan mitziehen, wenn der Plan manuell gesetzt wird.
    if (input.plan !== undefined) {
      await prisma.subscription.upsert({
        where: { userId },
        update: { plan: input.plan, status: input.plan === "FREE" ? "none" : "active" },
        create: { userId, plan: input.plan, status: input.plan === "FREE" ? "none" : "active" },
      });
    }

    return ok({ id: updated.id, plan: updated.plan, role: updated.role });
  } catch (error) {
    return handleError(error);
  }
}
