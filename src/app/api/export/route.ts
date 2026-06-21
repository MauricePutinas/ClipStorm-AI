import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { fail, handleError } from "@/lib/api";
import { exportQuerySchema } from "@/lib/validation";
import { clipToExport, serializeCalendarItem } from "@/lib/serializers";
import {
  calendarToCsv,
  clipsToCsv,
  clipsToCutterCsv,
  clipsToJson,
  clipsToMarkdown,
  exportFilename,
  type ExportCalendarItem,
} from "@/lib/export";
import { parseStringArray } from "@/lib/utils";

const BOM = "﻿";

function fileResponse(content: string, filename: string, contentType: string, withBom = false) {
  const body = withBom ? BOM + content : content;
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": `${contentType}; charset=utf-8`,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const url = new URL(req.url);
    const parsed = exportQuerySchema.safeParse({
      format: url.searchParams.get("format"),
      scope: url.searchParams.get("scope") ?? "project",
      projectId: url.searchParams.get("projectId") ?? undefined,
    });
    if (!parsed.success) return fail("Ungültige Export-Parameter", 422);
    const { format, scope, projectId } = parsed.data;

    // --- Kalender-Export ---
    if (scope === "calendar") {
      const items = await prisma.calendarItem.findMany({
        where: { userId: user.id },
        orderBy: { scheduledAt: "asc" },
        include: { project: true, clip: true },
      });
      const serialized = items.map(serializeCalendarItem);
      if (format === "json") {
        await logExport(user.id, "JSON", "calendar");
        return fileResponse(JSON.stringify(serialized, null, 2), "clipstorm-kalender.json", "application/json");
      }
      const rows: ExportCalendarItem[] = serialized.map((i) => ({
        title: i.title,
        platform: i.platform,
        scheduledAt: i.scheduledAt,
        status: i.status,
        notes: i.notes,
        projectTitle: i.projectTitle,
        clipTitle: i.clipTitle,
      }));
      await logExport(user.id, "CSV", "calendar");
      return fileResponse(calendarToCsv(rows), "clipstorm-kalender.csv", "text/csv", true);
    }

    // --- Clips sammeln (project oder all) ---
    let projects;
    if (scope === "project") {
      if (!projectId) return fail("projectId fehlt", 400);
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId: user.id },
        include: { clips: { orderBy: { order: "asc" } } },
      });
      if (!project) return fail("Projekt nicht gefunden", 404);
      projects = [project];
    } else {
      projects = await prisma.project.findMany({
        where: { userId: user.id },
        include: { clips: { orderBy: { order: "asc" } } },
        orderBy: { createdAt: "asc" },
      });
    }

    const allClips = projects.flatMap((p) => p.clips.map(clipToExport));
    const baseName = scope === "project" ? projects[0].title : "alle-projekte";

    if (format === "json") {
      await logExport(user.id, "JSON", `${scope}:clips`, projectId);
      return fileResponse(clipsToJson(allClips), exportFilename(baseName, "json"), "application/json");
    }
    if (format === "markdown") {
      const md = projects
        .map((p) =>
          clipsToMarkdown(
            {
              title: p.title,
              niche: p.niche,
              audience: p.audience,
              tone: p.tone,
              language: p.language,
              platforms: parseStringArray(p.platforms),
            },
            p.clips.map(clipToExport),
          ),
        )
        .join("\n\n");
      await logExport(user.id, "MARKDOWN", `${scope}:clips`, projectId);
      return fileResponse(md, exportFilename(baseName, "markdown"), "text/markdown");
    }
    if (format === "cutter") {
      await logExport(user.id, "CUTTER", `${scope}:clips`, projectId);
      return fileResponse(clipsToCutterCsv(allClips), exportFilename(`${baseName}-cutter`, "csv"), "text/csv", true);
    }
    // default csv
    await logExport(user.id, "CSV", `${scope}:clips`, projectId);
    return fileResponse(clipsToCsv(allClips), exportFilename(baseName, "csv"), "text/csv", true);
  } catch (error) {
    return handleError(error);
  }
}

async function logExport(userId: string, format: string, scope: string, projectId?: string) {
  try {
    await prisma.exportLog.create({
      data: { userId, format, scope, projectId: projectId || null },
    });
  } catch {
    // Logging darf den Export nie blockieren.
  }
}
