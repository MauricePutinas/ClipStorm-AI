"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, FolderKanban, Activity, FileStack, LogOut, Loader2 } from "lucide-react";
import { PLAN_ORDER } from "@/lib/constants";
import { apiFetch } from "@/lib/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  role: string;
  projectCount: number;
  clipCount: number;
}

export interface SystemStatus {
  provider: string;
  lemonSqueezyConfigured: boolean;
  userCount: number;
  projectCount: number;
  clipCount: number;
  calendarCount: number;
}

export interface TemplateItem {
  id: string;
  label: string;
  text: string;
}

export function AdminPanel({
  users,
  status,
  templates,
}: {
  users: AdminUser[];
  status: SystemStatus;
  templates: TemplateItem[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function updateUser(id: string, field: "plan" | "role", value: string) {
    setBusy(id + field);
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: "PATCH", body: JSON.stringify({ [field]: value }) });
      router.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Update fehlgeschlagen");
    } finally {
      setBusy(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatusTile icon={Users} label="Nutzer" value={status.userCount} />
        <StatusTile icon={FolderKanban} label="Projekte" value={status.projectCount} />
        <StatusTile icon={FileStack} label="Clips" value={status.clipCount} />
        <StatusTile icon={Activity} label="Kalender" value={status.calendarCount} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-4 text-cyan" /> Systemstatus
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <StatusRow label="AI-Provider" value={status.provider} ok={status.provider === "template" ? undefined : true} />
          <StatusRow
            label="Lemon Squeezy"
            value={status.lemonSqueezyConfigured ? "konfiguriert" : "Demo-Modus"}
            ok={status.lemonSqueezyConfigured}
          />
        </CardContent>
      </Card>

      {/* Nutzerverwaltung */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4 text-cyan" /> Nutzer & Pläne
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="size-4" /> Logout
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex flex-col gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-foreground">{u.name}</span>
                  {u.role === "ADMIN" && <Badge variant="warning">Admin</Badge>}
                </div>
                <div className="text-xs text-slate-500">
                  {u.email} · {u.projectCount} Projekte · {u.clipCount} Clips
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={u.plan}
                  onChange={(e) => updateUser(u.id, "plan", e.target.value)}
                  className="h-8 w-auto text-xs"
                  disabled={busy === u.id + "plan"}
                >
                  {PLAN_ORDER.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
                <Select
                  value={u.role}
                  onChange={(e) => updateUser(u.id, "role", e.target.value)}
                  className="h-8 w-auto text-xs"
                  disabled={busy === u.id + "role"}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </Select>
                {busy?.startsWith(u.id) && <Loader2 className="size-4 animate-spin text-slate-500" />}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Beispiel-Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileStack className="size-4 text-electric" /> Beispiel-Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="mb-2 text-xs text-slate-500">
            Diese Vorlagen-Transkripte stehen im „Neues Projekt“-Formular zum schnellen Test bereit.
          </p>
          {templates.map((t) => (
            <div key={t.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{t.label}</span>
                <CopyButton value={t.text} />
              </div>
              <p className="line-clamp-2 text-xs text-slate-500">{t.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusTile({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <Icon className="size-4 text-cyan" />
      </div>
      <div className="mt-2 text-2xl font-bold text-foreground">{value}</div>
    </Card>
  );
}

function StatusRow({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="flex items-center gap-2 text-slate-300">
        {value}
        <span
          className={
            "size-2 rounded-full " +
            (ok === undefined ? "bg-slate-500" : ok ? "bg-emerald-400" : "bg-amber-400")
          }
        />
      </span>
    </div>
  );
}
