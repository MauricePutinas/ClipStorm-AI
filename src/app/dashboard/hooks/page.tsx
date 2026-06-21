import { PageHeader } from "@/components/dashboard/page-header";
import { HookEngine } from "@/components/hooks/hook-engine";

export const metadata = { title: "Hook Engine" };

export default function HooksPage() {
  return (
    <div>
      <PageHeader
        title="Hook Engine"
        description="Erzeuge zu jedem Thema 9 Hook-Varianten: Problem, Shock, Story, Zahlen, Fehler, Mythos, „Niemand spricht darüber“, „Ich habe X getestet“ und „3 Dinge früher gewusst“."
      />
      <HookEngine />
    </div>
  );
}
