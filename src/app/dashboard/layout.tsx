import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getPlanMeta } from "@/lib/plan";
import { Sidebar, MobileSidebar } from "@/components/dashboard/sidebar";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const plan = getPlanMeta(user.plan);
  const projectCount = await prisma.project.count({ where: { userId: user.id } });
  const limitLabel = plan.maxProjects === null ? "∞" : plan.maxProjects;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-white/5 bg-navy-500/70 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <MobileSidebar />
            <div className="lg:hidden">
              <Logo href="/dashboard" compact />
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm text-slate-400">Plan:</span>
              <Badge variant={plan.id === "FREE" ? "secondary" : "default"}>{plan.name}</Badge>
              <span className="text-xs text-slate-500">
                {projectCount}/{limitLabel} Projekte
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium text-foreground">{user.name}</div>
              <div className="text-xs text-slate-500">{user.email}</div>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-electric to-cyan text-sm font-bold text-navy-900">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <Link href="/dashboard/projekte/neu">
              <Button size="sm" className="hidden sm:inline-flex">
                <Plus className="size-4" /> Neues Projekt
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
