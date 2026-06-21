import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ok, fail, handleError, readJson } from "@/lib/api";
import { calendarCreateSchema } from "@/lib/validation";
import { serializeCalendarItem } from "@/lib/serializers";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const items = await prisma.calendarItem.findMany({
      where: { userId: user.id },
      orderBy: { scheduledAt: "asc" },
      include: { project: true, clip: true },
    });
    return ok(items.map(serializeCalendarItem));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await readJson(req);
    const input = calendarCreateSchema.parse(body);

    // Referenzen müssen dem aktuellen Nutzer gehören (verhindert FK-Crash & fremde Verknüpfung).
    if (input.projectId) {
      const owned = await prisma.project.findFirst({
        where: { id: input.projectId, userId: user.id },
        select: { id: true },
      });
      if (!owned) return fail("Projekt nicht gefunden", 404);
    }
    if (input.clipId) {
      const owned = await prisma.clipIdea.findFirst({
        where: { id: input.clipId, project: { userId: user.id } },
        select: { id: true },
      });
      if (!owned) return fail("Clip nicht gefunden", 404);
    }

    const item = await prisma.calendarItem.create({
      data: {
        userId: user.id,
        title: input.title,
        platform: input.platform,
        scheduledAt: input.scheduledAt,
        status: input.status,
        notes: input.notes,
        clipId: input.clipId || null,
        projectId: input.projectId || null,
      },
      include: { project: true, clip: true },
    });
    return ok(serializeCalendarItem(item), 201);
  } catch (error) {
    return handleError(error);
  }
}
