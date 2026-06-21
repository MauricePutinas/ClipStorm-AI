import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export const metadata = { title: "Datenschutz" };

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      <main className="section max-w-3xl py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Datenschutzerklärung</h1>
        <p className="mt-2 text-sm text-slate-500">Platzhalter – bitte vor Produktivbetrieb juristisch prüfen lassen.</p>

        <div className="prose-invert mt-8 space-y-6 text-sm leading-relaxed text-slate-300">
          <Section title="1. Verantwortlicher">
            <p>
              Verantwortlich für die Datenverarbeitung ist der Betreiber dieser Anwendung
              (Kontaktdaten siehe <a href="/impressum" className="text-cyan hover:underline">Impressum</a>).
              Dieser Text ist ein Platzhalter für die Demo-Version von ClipStorm AI.
            </p>
          </Section>

          <Section title="2. Welche Daten verarbeitet werden">
            <p>
              In der lokalen Demo werden ausschließlich die von dir eingegebenen Inhalte
              (Projekte, Transkripte, Clips, Kalender-Einträge, Brand Profiles) in einer
              lokalen SQLite-Datenbank gespeichert. Es findet keine Übertragung an externe
              KI-Dienste statt, solange der lokale Template-Provider aktiv ist.
            </p>
          </Section>

          <Section title="3. Externe KI-Anbieter (optional)">
            <p>
              Wird ein externer AI-Provider (OpenAI, Anthropic Claude, DeepSeek) aktiviert,
              werden die zur Generierung notwendigen Inhalte an den jeweiligen Anbieter
              übermittelt. Beachte dann die Datenschutzbestimmungen des Anbieters.
            </p>
          </Section>

          <Section title="4. Zahlungsabwicklung">
            <p>
              Für die (vorbereitete) Monetarisierung wird Lemon Squeezy als Merchant of Record
              eingesetzt. In der Demo ist keine echte Zahlungsabwicklung aktiv. Bei Aktivierung
              gelten die Datenschutzbestimmungen von Lemon Squeezy.
            </p>
          </Section>

          <Section title="5. Deine Rechte">
            <p>
              Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
              Verarbeitung deiner Daten sowie auf Datenübertragbarkeit. Projekte und alle
              zugehörigen Daten kannst du jederzeit im Dashboard löschen.
            </p>
          </Section>

          <Section title="6. Kontakt">
            <p>Bei Fragen zum Datenschutz wende dich an die im Impressum genannte Adresse.</p>
          </Section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
