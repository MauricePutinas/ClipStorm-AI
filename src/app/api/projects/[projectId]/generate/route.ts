import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ok, fail, handleError, readJson } from "@/lib/api";
import { generateSchema } from "@/lib/validation";
import { generateForProject } from "@/lib/services/clipService";

export async function POST(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const user = await getCurrentUser();
    const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
    if (!project) return fail("Projekt nicht gefunden", 404);

    const body = await readJson(req);
    const input = generateSchema.parse(body);

    const result = await generateForProject(projectId, {
      count: input.count,
      brandProfileId: input.brandProfileId,
      replace: input.replace ?? true,
    });

    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}
