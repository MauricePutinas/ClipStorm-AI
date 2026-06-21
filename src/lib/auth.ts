// Vereinfachte Auth-Schicht für das MVP.
// Es gibt (noch) kein echtes Login – wir arbeiten mit einem Demo-Nutzer.
// Die Struktur ist so gewählt, dass echtes Auth später leicht ergänzt werden kann.
import { cookies } from "next/headers";
import { prisma } from "./db";
import { DEMO_USER_EMAIL } from "./constants";

export const ADMIN_COOKIE = "cs_admin";

// Liefert den aktuellen (Demo-)Nutzer. Legt ihn bei Bedarf an,
// damit die App auch ohne vorherigen Seed nicht abstürzt.
export async function getCurrentUser() {
  let user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: DEMO_USER_EMAIL,
        name: "Demo Creator",
        plan: "FREE",
        role: "USER",
      },
    });
  }
  return user;
}

export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user.id;
}

// Liefert das konfigurierte Admin-Token – oder null, wenn keines gesetzt ist.
// Kein hartkodierter Fallback (verhindert öffentlich bekannte Default-Credentials).
export function getAdminToken(): string | null {
  const t = process.env.ADMIN_TOKEN?.trim();
  return t && t.length > 0 ? t : null;
}

// Prüft, ob der Request als Admin authentifiziert ist (Cookie-Token).
export async function isAdmin(): Promise<boolean> {
  const expected = getAdminToken();
  if (!expected) return false; // kein Token konfiguriert -> niemals Admin
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === expected;
}

export function checkAdminToken(token: string | null | undefined): boolean {
  const expected = getAdminToken();
  if (!expected) return false; // kein Token konfiguriert -> Login unmöglich
  return !!token && token === expected;
}
