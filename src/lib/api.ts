// Kleine Helfer für API-Routen (einheitliche JSON-Antworten & Fehlerbehandlung).
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return fail("Ungültige Eingabe", 422, {
      issues: error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }
  console.error("[API-Fehler]", error);
  const message = error instanceof Error ? error.message : "Interner Serverfehler";
  return fail(message, 500);
}

export async function readJson<T = unknown>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    return {} as T;
  }
}
