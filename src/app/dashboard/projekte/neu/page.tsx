import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getPlanMeta, maxClipsForPlan } from "@/lib/plan";
import { PageHeader } from "@/components/dashboard/page-header";
import { NewProjectForm } from "@/components/projects/new-project-form";

export const metadata = { title: "Neues Projekt" };

export default async function NewProjectPage() {
  const user = await getCurrentUser();
  const plan = getPlanMeta(user.plan);
  const [projectCount, brandProfiles] = await Promise.all([
    prisma.project.count({ where: { userId: user.id } }),
    prisma.brandProfile.findMany({ where: { userId: user.id }, orderBy: { isDefault: "desc" } }),
  ]);

  const atLimit = plan.maxProjects !== null && projectCount >= plan.maxProjects;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Neues Projekt"
        description="Füge ein Transkript ein – ClipStorm erstellt automatisch Clip-Ideen, Hooks, Captions, Hashtags und Schnittanweisungen."
      />
      <NewProjectForm
        brandProfiles={brandProfiles.map((b) => ({
          id: b.id,
          name: b.name,
          tone: b.tone,
          niche: b.niche,
          audience: b.audience,
        }))}
        planMaxClips={maxClipsForPlan(user.plan)}
        atLimit={atLimit}
      />
    </div>
  );
}
