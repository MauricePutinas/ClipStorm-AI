import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ok, fail, handleError, readJson } from "@/lib/api";
import { calendarUpdateSchema } from "@/lib/validation";
import { serializeCalendarItem } from "@/lib/serializers";

export async function PATCH(req: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;
    const user = await getCurrentUser();
    const existing = await prisma.calendarItem.findFirst({ where: { id: itemId, userId: user.id } });
    if (!existing) return fail("Kalender-Eintrag nicht gefunden", 404);

    const body = await readJson(req);
    const input = calendarUpdateSchema.parse(body);

    const item = await prisma.calendarItem.update({
      where: { id: itemId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.platform !== undefined ? { platform: input.platform } : {}),
        ...(input.scheduledAt !== undefined ? { scheduledAt: input.scheduledAt } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.notes !== undefined ? { notes: input.notes } : {}),
      },
      include: { project: true, clip: true },
    });
    return ok(serializeCalendarItem(item));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;
    const user = await getCurrentUser();
    const existing = await prisma.calendarItem.findFirst({ where: { id: itemId, userId: user.id } });
    if (!existing) return fail("Kalender-Eintrag nicht gefunden", 404);
    await prisma.calendarItem.delete({ where: { id: itemId } });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
