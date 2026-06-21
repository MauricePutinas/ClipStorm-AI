import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkAdminToken, getAdminToken } from "@/lib/auth";
import { fail, readJson } from "@/lib/api";

export async function POST(req: Request) {
  if (!getAdminToken()) {
    return fail("Admin-Login ist nicht konfiguriert (ADMIN_TOKEN in .env setzen).", 503);
  }
  const body = await readJson<{ token?: string }>(req);
  if (!checkAdminToken(body.token)) {
    return fail("Falscher Admin-Token", 401);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, body.token!, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 Stunden
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
