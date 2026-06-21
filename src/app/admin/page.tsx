import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { activeProviderName } from "@/lib/ai/provider";
import { isLemonSqueezyConfigured } from "@/lib/lemonsqueezy";
import { DEMO_TRANSCRIPTS } from "@/lib/demoContent";
import { Logo } from "@/components/shared/logo";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminPanel, type AdminUser, type SystemStatus } from "@/components/admin/admin-panel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Adminbereich" };

export default async function AdminPage() {
  const admin = await isAdmin();

  return (
    <div className="min-h-screen">
      <header className="flex h-16 items-center justify-between border-b border-white/5 px-5 sm:px-8">
        <Logo />
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-foreground">
          <ArrowLeft className="size-4" /> Zum Dashboard
        </Link>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {!admin ? (
          <AdminLogin />
        ) : (
          <AdminContent />
        )}
      </main>
    </div>
  );
}

async function AdminContent() {
  const [users, projectCount, clipCount, calendarCount] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { projects: true } },
        projects: { select: { _count: { select: { clips: true } } } },
      },
    }),
    prisma.project.count(),
    prisma.clipIdea.count(),
    prisma.calendarItem.count(),
  ]);

  const adminUsers: AdminUser[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    plan: u.plan,
    role: u.role,
    projectCount: u._count.projects,
    clipCount: u.projects.reduce((sum, p) => sum + p._count.clips, 0),
  }));

  const status: SystemStatus = {
    provider: activeProviderName(),
    lemonSqueezyConfigured: isLemonSqueezyConfigured(),
    userCount: users.length,
    projectCount,
    clipCount,
    calendarCount,
  };

  const templates = DEMO_TRANSCRIPTS.map((t) => ({ id: t.id, label: t.label, text: t.text }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Adminbereich</h1>
      <AdminPanel users={adminUsers} status={status} templates={templates} />
    </div>
  );
}
