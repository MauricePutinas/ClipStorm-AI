// Lemon Squeezy Webhook-Endpunkt.
// Verifiziert die Signatur, ordnet das Event einem Plan/Status zu und
// aktualisiert Subscription + Nutzerplan.
import { prisma } from "@/lib/db";
import { fail } from "@/lib/api";
import {
  normalizeStatus,
  parseWebhook,
  verifyWebhookSignature,
} from "@/lib/lemonsqueezy";
import type { PlanId } from "@/lib/types";

export async function POST(req: Request) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  const signature = req.headers.get("x-signature");

  // Raw-Body wird für die Signaturprüfung benötigt.
  const rawBody = await req.text();

  // Signaturprüfung (vorbereitet). Ohne konfiguriertes Secret wird abgelehnt.
  if (!secret) {
    return fail("Webhook-Secret nicht konfiguriert (LEMON_SQUEEZY_WEBHOOK_SECRET).", 503);
  }
  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    return fail("Ungültige Webhook-Signatur", 401);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return fail("Ungültiger JSON-Body", 400);
  }

  const parsed = parseWebhook(payload);

  // Nutzer über die im Webhook übermittelte E-Mail finden.
  if (!parsed.email) {
    // Event quittieren, aber nichts zuordnen.
    return new Response(JSON.stringify({ ok: true, note: "Keine E-Mail im Event" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (!user) {
    return new Response(JSON.stringify({ ok: true, note: "Nutzer nicht gefunden" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const status = normalizeStatus(parsed.status);
  const isActive = status === "active" || status === "on_trial";
  const plan: PlanId = isActive && parsed.plan ? parsed.plan : "FREE";

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      plan,
      status,
      lemonSqueezyId: parsed.subscriptionId ?? undefined,
      customerId: parsed.customerId ?? undefined,
      variantId: parsed.variantId ?? undefined,
      renewsAt: parsed.renewsAt ? new Date(parsed.renewsAt) : null,
      endsAt: parsed.endsAt ? new Date(parsed.endsAt) : null,
    },
    create: {
      userId: user.id,
      plan,
      status,
      lemonSqueezyId: parsed.subscriptionId ?? undefined,
      customerId: parsed.customerId ?? undefined,
      variantId: parsed.variantId ?? undefined,
      renewsAt: parsed.renewsAt ? new Date(parsed.renewsAt) : null,
      endsAt: parsed.endsAt ? new Date(parsed.endsAt) : null,
    },
  });

  // Nutzerplan aktualisieren (bei Kündigung/Ablauf -> FREE).
  await prisma.user.update({
    where: { id: user.id },
    data: { plan },
  });

  return new Response(JSON.stringify({ ok: true, event: parsed.eventName, plan, status }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
