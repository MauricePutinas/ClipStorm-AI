// Lemon Squeezy Integration (vorbereitet).
// - Statische Checkout-URLs aus öffentlichen Env-Variablen
// - Webhook-Signaturprüfung (HMAC SHA256)
// - Mapping von Webhook-Payload -> Plan/Status
import crypto from "node:crypto";
import type { PlanId } from "./types";

// WICHTIG: NEXT_PUBLIC_* müssen statisch referenziert werden, damit Next sie inlined.
export const CHECKOUT_URLS: Record<PlanId, string> = {
  FREE: "",
  CREATOR: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CREATOR_CHECKOUT_URL || "",
  PRO: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_CHECKOUT_URL || "",
  AGENCY: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_AGENCY_CHECKOUT_URL || "",
};

export function getCheckoutUrl(plan: PlanId): string {
  return CHECKOUT_URLS[plan] || "";
}

export function isLemonSqueezyConfigured(): boolean {
  return Boolean(process.env.LEMON_SQUEEZY_API_KEY && process.env.LEMON_SQUEEZY_STORE_ID);
}

// Verifiziert die Webhook-Signatur von Lemon Squeezy.
// Lemon Squeezy sendet den Header "X-Signature" (HMAC-SHA256, hex) über den Raw-Body.
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
  secret: string | undefined,
): boolean {
  if (!secret || !signature) return false;
  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(rawBody, "utf8").digest("hex");
    const a = Buffer.from(digest, "hex");
    const b = Buffer.from(signature, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// Sehr toleranter Parser für eine Lemon-Squeezy-Webhook-Payload.
export interface ParsedWebhook {
  eventName: string;
  status: string;
  plan: PlanId | null;
  email: string | null;
  subscriptionId: string | null;
  customerId: string | null;
  variantId: string | null;
  renewsAt: string | null;
  endsAt: string | null;
}

export function parseWebhook(payload: any): ParsedWebhook {
  const eventName: string = payload?.meta?.event_name ?? "unknown";
  const attrs = payload?.data?.attributes ?? {};
  const custom = payload?.meta?.custom_data ?? {};

  const status: string = attrs?.status ?? "none";
  const variantName: string = (attrs?.variant_name ?? attrs?.product_name ?? "").toString();

  return {
    eventName,
    status,
    plan: resolvePlanFromPayload(custom?.plan, variantName, attrs?.variant_id),
    email: attrs?.user_email ?? custom?.email ?? null,
    subscriptionId: payload?.data?.id ?? null,
    customerId: attrs?.customer_id ? String(attrs.customer_id) : null,
    variantId: attrs?.variant_id ? String(attrs.variant_id) : null,
    renewsAt: attrs?.renews_at ?? null,
    endsAt: attrs?.ends_at ?? null,
  };
}

// Bestimmt den Plan aus (a) custom_data.plan, (b) Variantenname, (c) Variant-ID-Env-Mapping.
export function resolvePlanFromPayload(
  customPlan: string | undefined,
  variantName: string | undefined,
  variantId: string | number | undefined,
): PlanId | null {
  const explicit = (customPlan || "").toUpperCase();
  if (explicit === "CREATOR" || explicit === "PRO" || explicit === "AGENCY" || explicit === "FREE") {
    return explicit as PlanId;
  }
  const name = (variantName || "").toLowerCase();
  if (name.includes("agency") || name.includes("agentur")) return "AGENCY";
  if (name.includes("pro")) return "PRO";
  if (name.includes("creator")) return "CREATOR";

  // Optionales Mapping über Env-Variant-IDs (falls gesetzt)
  const id = variantId ? String(variantId) : "";
  if (id && id === process.env.LEMON_SQUEEZY_AGENCY_VARIANT_ID) return "AGENCY";
  if (id && id === process.env.LEMON_SQUEEZY_PRO_VARIANT_ID) return "PRO";
  if (id && id === process.env.LEMON_SQUEEZY_CREATOR_VARIANT_ID) return "CREATOR";

  return null;
}

// Wandelt einen Lemon-Squeezy-Status in unseren internen Subscription-Status.
export function normalizeStatus(status: string): string {
  const s = (status || "").toLowerCase();
  const allowed = ["active", "on_trial", "cancelled", "expired", "past_due", "paused", "unpaid"];
  return allowed.includes(s) ? s : "none";
}
