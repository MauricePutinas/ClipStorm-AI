import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { serializeCalendarItem } from "@/lib/serializers";
import { PageHeader } from "@/components/dashboard/page-header";
import { ExportButtons } from "@/components/shared/export-buttons";
import { CalendarView, type CalItem } from "@/components/calendar/calendar-view";

export const metadata = { title: "Content-Kalender" };

export default async function CalendarPage() {
  const user = await getCurrentUser();
  const items = await prisma.calendarItem.findMany({
    where: { userId: user.id },
    orderBy: { scheduledAt: "asc" },
    include: { project: true, clip: true },
  });

  const calItems: CalItem[] = items.map((i) => {
    const s = serializeCalendarItem(i);
    return {
      id: s.id,
      title: s.title,
      platform: s.platform,
      scheduledAt: new Date(s.scheduledAt).toISOString(),
      status: s.status,
      notes: s.notes,
      projectTitle: s.projectTitle,
      clipTitle: s.clipTitle,
    };
  });

  return (
    <div>
      <PageHeader
        title="Content-Kalender"
        description="Plane deine Clips über alle Plattformen hinweg – Monats- oder Listenansicht."
      >
        <ExportButtons scope="calendar" />
      </PageHeader>
      <CalendarView items={calItems} />
    </div>
  );
}
