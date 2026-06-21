"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Loader2, List, CalendarDays } from "lucide-react";
import { PLATFORMS, CALENDAR_STATUS, platformMeta } from "@/lib/constants";
import { apiFetch } from "@/lib/client";
import { cn, formatDateTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlatformBadge } from "@/components/shared/badges";
import { DeleteButton } from "@/components/shared/delete-button";

export interface CalItem {
  id: string;
  title: string;
  platform: string;
  scheduledAt: string;
  status: string;
  notes: string;
  projectTitle?: string | null;
  clipTitle?: string | null;
}

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

export function CalendarView({ items }: { items: CalItem[] }) {
  const router = useRouter();
  const [view, setView] = useState<"month" | "list">("month");
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const itemsByDay = useMemo(() => {
    const map = new Map<string, CalItem[]>();
    for (const it of items) {
      const d = new Date(it.scheduledAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const arr = map.get(key) ?? [];
      arr.push(it);
      map.set(key, arr);
    }
    return map;
  }, [items]);

  function changeMonth(delta: number) {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  // Monatsraster (Montag-Start)
  const firstDay = new Date(cursor.year, cursor.month, 1);
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const leadingBlanks = (firstDay.getDay() + 6) % 7; // So=0 -> 6
  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="space-y-5">
      <NewEntryForm onCreated={() => router.refresh()} />

      <Card>
        <CardContent className="pt-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)} aria-label="Vorheriger Monat">
                <ChevronLeft className="size-4" />
              </Button>
              <span className="min-w-[160px] text-center font-semibold text-foreground">
                {MONTHS[cursor.month]} {cursor.year}
              </span>
              <Button variant="ghost" size="icon" onClick={() => changeMonth(1)} aria-label="Nächster Monat">
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5">
              <ToggleBtn active={view === "month"} onClick={() => setView("month")} icon={CalendarDays} label="Monat" />
              <ToggleBtn active={view === "list"} onClick={() => setView("list")} icon={List} label="Liste" />
            </div>
          </div>

          {view === "month" ? (
            <div>
              <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-slate-500">
                {WEEKDAYS.map((w) => (
                  <div key={w}>{w}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {cells.map((day, idx) => {
                  if (day === null) return <div key={`b${idx}`} className="min-h-[84px] rounded-lg" />;
                  const key = `${cursor.year}-${cursor.month}-${day}`;
                  const dayItems = itemsByDay.get(key) ?? [];
                  const isToday =
                    day === today.getDate() &&
                    cursor.month === today.getMonth() &&
                    cursor.year === today.getFullYear();
                  return (
                    <div
                      key={key}
                      className={cn(
                        "min-h-[84px] rounded-lg border p-1.5 transition-colors",
                        isToday ? "border-cyan/40 bg-cyan/5" : "border-white/5 bg-white/[0.02]",
                      )}
                    >
                      <div className={cn("mb-1 text-xs font-medium", isToday ? "text-cyan" : "text-slate-500")}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayItems.slice(0, 3).map((it) => (
                          <div
                            key={it.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setView("list")}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") setView("list");
                            }}
                            className={cn(
                              "cursor-pointer truncate rounded px-1.5 py-0.5 text-[10px] font-medium transition-opacity hover:opacity-80",
                              platformMeta(it.platform).badge,
                            )}
                            title={`${it.title} – zur Listenansicht`}
                          >
                            {it.title}
                          </div>
                        ))}
                        {dayItems.length > 3 && (
                          <div className="px-1 text-[10px] text-slate-500">+{dayItems.length - 3} mehr</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <ListView items={items} onChange={() => router.refresh()} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof List;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
        active ? "bg-cyan/15 text-cyan" : "text-slate-400 hover:text-foreground",
      )}
    >
      <Icon className="size-3.5" /> {label}
    </button>
  );
}

function ListView({ items, onChange }: { items: CalItem[]; onChange: () => void }) {
  const sorted = [...items].sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));
  const router = useRouter();

  async function updateStatus(id: string, status: string) {
    await apiFetch(`/api/calendar/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    router.refresh();
  }

  if (sorted.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">Noch keine geplanten Posts.</p>;
  }

  return (
    <div className="space-y-2">
      {sorted.map((it) => (
        <div
          key={it.id}
          className="flex flex-col gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground">{it.title}</div>
            <div className="text-xs text-slate-500">
              {formatDateTime(it.scheduledAt)}
              {it.projectTitle ? ` · ${it.projectTitle}` : ""}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PlatformBadge platform={it.platform} />
            <Select value={it.status} onChange={(e) => updateStatus(it.id, e.target.value)} className="h-8 w-auto text-xs">
              {CALENDAR_STATUS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </Select>
            <DeleteButton url={`/api/calendar/${it.id}`} iconOnly />
          </div>
        </div>
      ))}
    </div>
  );
}

function NewEntryForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<string>("tiktok");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !date) {
      setError("Titel und Datum sind erforderlich.");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/api/calendar", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          platform,
          scheduledAt: new Date(date).toISOString(),
          notes,
          status: "PLANNED",
        }),
      });
      setTitle("");
      setDate("");
      setNotes("");
      setOpen(false);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Anlegen");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" /> Post planen
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className="pt-5">
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5 lg:col-span-2">
            <Label>Titel</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post-Titel" />
          </div>
          <div className="space-y-1.5">
            <Label>Plattform</Label>
            <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Datum & Uhrzeit</Label>
            <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-4">
            <Label>Notizen</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
          </div>
          {error && <p className="text-xs text-red-300 sm:col-span-2 lg:col-span-4">{error}</p>}
          <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Speichern
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
