import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export const metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      <main className="section max-w-3xl py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Impressum</h1>
        <p className="mt-2 text-sm text-slate-500">Platzhalter – bitte mit echten Angaben gemäß § 5 TMG ersetzen.</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-300">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">Angaben gemäß § 5 TMG</h2>
            <p>
              [Dein Name / Firmenname]
              <br />
              [Straße & Hausnummer]
              <br />
              [PLZ Ort]
              <br />
              [Land]
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">Kontakt</h2>
            <p>
              E-Mail: [deine@email.de]
              <br />
              Telefon: [optional]
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">Umsatzsteuer-ID</h2>
            <p>[USt-IdNr., falls vorhanden]</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">Verantwortlich für den Inhalt</h2>
            <p>[Name gemäß § 18 Abs. 2 MStV]</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">Haftungshinweis</h2>
            <p>
              ClipStorm AI ist ein Demo-/MVP-Projekt. Die generierten Inhalte sind Vorschläge und
              sollten vor der Veröffentlichung redaktionell geprüft werden.
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
