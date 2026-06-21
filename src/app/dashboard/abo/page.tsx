import { CheckCircle2, XCircle, CreditCard } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getPlanMeta } from "@/lib/plan";
import { isLemonSqueezyConfigured } from "@/lib/lemonsqueezy";
import { PageHeader } from "@/components/dashboard/page-header";
import { PricingCards } from "@/components/shared/pricing-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { PlanId } from "@/lib/types";

export const metadata = { title: "Abo & Preise" };

const CHECKOUT_ENVS = [
  { plan: "Creator", env: "NEXT_PUBLIC_LEMON_SQUEEZY_CREATOR_CHECKOUT_URL" },
  { plan: "Pro", env: "NEXT_PUBLIC_LEMON_SQUEEZY_PRO_CHECKOUT_URL" },
  { plan: "Agency", env: "NEXT_PUBLIC_LEMON_SQUEEZY_AGENCY_CHECKOUT_URL" },
];

export default async function AboPage() {
  const user = await getCurrentUser();
  const plan = getPlanMeta(user.plan);
  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
  const lsConfigured = isLemonSqueezyConfigured();

  const checkoutStatus = CHECKOUT_ENVS.map((c) => ({
    ...c,
    configured: Boolean(process.env[c.env]),
  }));

  return (
    <div>
      <PageHeader
        title="Abo & Preise"
        description="Wähle den Plan, der zu deinem Output passt. Monetarisierung über Lemon Squeezy ist vorbereitet."
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Dein Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold gradient-text">{plan.name}</span>
              <Badge variant={subscription?.status === "active" ? "success" : "secondary"}>
                {subscription?.status ?? "none"}
              </Badge>
            </div>
            {subscription?.renewsAt && (
              <p className="text-xs text-slate-500">Verlängert sich am {formatDate(subscription.renewsAt)}</p>
            )}
            <p className="text-sm text-slate-400">{plan.tagline}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-4 text-cyan" /> Lemon Squeezy Konfiguration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              {lsConfigured ? (
                <CheckCircle2 className="size-4 text-emerald-400" />
              ) : (
                <XCircle className="size-4 text-amber-400" />
              )}
              <span className="text-slate-300">
                API-Key & Store-ID {lsConfigured ? "konfiguriert" : "nicht gesetzt (Demo-Modus)"}
              </span>
            </div>
            <div className="space-y-1.5">
              {checkoutStatus.map((c) => (
                <div key={c.env} className="flex items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 text-xs">
                  <span className="font-mono text-slate-400">{c.env}</span>
                  {c.configured ? (
                    <Badge variant="success">gesetzt</Badge>
                  ) : (
                    <Badge variant="warning">leer</Badge>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Hinterlege die Checkout-URLs in der <code className="text-cyan">.env</code>, um die Kauf-Buttons zu aktivieren.
            </p>
          </CardContent>
        </Card>
      </div>

      <PricingCards currentPlan={user.plan as PlanId} />
    </div>
  );
}
