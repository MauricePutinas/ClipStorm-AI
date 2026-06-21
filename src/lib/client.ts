// Kleiner Client-seitiger Fetch-Helper für API-Aufrufe.
export async function apiFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  if (!res.ok || (json && json.ok === false)) {
    const message = json?.error || `Fehler (${res.status})`;
    throw new Error(message);
  }
  return (json?.data ?? json) as T;
}
