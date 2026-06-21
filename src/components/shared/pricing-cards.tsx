import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { PLANS, PLAN_ORDER } from "@/lib/constants";
import { getCheckoutUrl } from "@/lib/lemonsqueezy";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PlanId } from "@/lib/types";

export function PricingCards({ currentPlan }: { currentPlan?: PlanId }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {PLAN_ORDER.map((planId) => {
        const plan = PLANS[planId];
        const isCurrent = currentPlan === planId;
        const checkoutUrl = getCheckoutUrl(planId);
        const isFree = planId === "FREE";

        return (
          <div
            key={planId}
            className={cn(
              "relative flex flex-col rounded-2xl border p-6 transition-all",
              plan.highlight
                ? "border-cyan/40 bg-gradient-to-b from-cyan/[0.08] to-transparent shadow-glow"
                : "border-white/10 bg-card/60",
            )}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="default" className="shadow-glow">
                  <Sparkles className="size-3" /> Beliebt
                </Badge>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="mt-0.5 text-xs text-slate-400">{plan.tagline}</p>
            </div>

            <div className="mb-5 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                {plan.priceMonthly === 0 ? "0 €" : `${plan.priceMonthly} €`}
              </span>
              <span className="text-sm text-slate-500">/Monat</span>
            </div>

            <ul className="mb-6 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="mt-0.5 size-4 shrink-0 text-cyan" /> {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              {isCurrent ? (
                <Button variant="secondary" className="w-full" disabled>
                  Aktueller Plan
                </Button>
              ) : isFree ? (
                <Link href="/dashboard" className={cn(buttonVariants({ variant: "secondary" }), "w-full")}>
                  Kostenlos starten
                </Link>
              ) : checkoutUrl ? (
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: plan.highlight ? "default" : "outline" }), "w-full")}
                >
                  {plan.name} wählen
                </a>
              ) : (
                <Button variant="outline" className="w-full" disabled title="Checkout-URL in .env hinterlegen">
                  Bald verfügbar
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
