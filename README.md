<div align="center">

# ⚡ ClipStorm AI

### Verwandle ein langes Video in **20 virale Short-Form-Ideen**

Aus Transkripten von Videos, Podcasts, Interviews oder Webinaren entstehen automatisch
Clip-Ideen, Hooks, Captions, Hashtags, Text-Overlays und Schnittanweisungen –
plattformgerecht für **TikTok · Instagram Reels · YouTube Shorts · LinkedIn · Snapchat**.

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-local-003B57?logo=sqlite&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-22d3ee.svg)

</div>

---

> **🔋 Läuft sofort & komplett lokal – ohne externe KI-API.**
> Die gesamte Generierung erfolgt regelbasiert über Template-Logik. Eine Anbindung an
> **OpenAI, Anthropic Claude oder DeepSeek** ist vorbereitet, aber nicht erforderlich.

ClipStorm AI ist ein vollständiges **SaaS-MVP** für Creator, Coaches, Podcaster, YouTuber,
Agenturen und Selbstständige, die aus langen Inhalten in Sekunden Short-Form-Content machen.

---

## 📋 Inhalt

- [Highlights](#-highlights)
- [Features im Detail](#-features-im-detail)
- [Tech-Stack](#-tech-stack)
- [Schnellstart](#-schnellstart)
- [Wichtige Seiten](#-wichtige-seiten)
- [Projektstruktur](#-projektstruktur)
- [Datenmodell](#-datenmodell)
- [AI-Provider aktivieren](#-ai-provider-aktivieren)
- [Lemon Squeezy einrichten](#-lemon-squeezy-einrichten)
- [Sicherheit](#-sicherheit)
- [Roadmap](#-roadmap)
- [Lizenz](#-lizenz)

---

## ✨ Highlights

| | |
|---|---|
| 🎬 **Clip-Generator** | 10–30 Clip-Ideen pro Projekt aus jedem Transkript |
| 🪝 **Hook Engine** | 9 Hook-Typen (Problem, Shock, Story, Zahlen, Fehler, Mythos …) |
| 📱 **5 Plattformen** | Eigene Version für TikTok, Reels, Shorts, LinkedIn & Snapchat |
| 📊 **Viral-Score** | Bewertung 0–100 + Schwierigkeitsgrad pro Clip |
| 🗓️ **Content-Kalender** | Monats- & Listenansicht, Posts planen |
| 📤 **Exporte** | CSV · Markdown · JSON · Cutter-Export |
| 🎨 **Brand Profiles** | Tonalität, Tabu-Wörter & CTA-Stil fließen in die Generierung ein |
| 💳 **Lemon Squeezy** | Pricing, Plan-Limits & Webhook vorbereitet |
| 🛠️ **Adminbereich** | Nutzer- & Plan-Verwaltung, Systemstatus |

---

## 🚀 Features im Detail

### 1. Projekte & Transkript-Eingabe
- Projekttitel, Nische, Zielgruppe, Tonalität, Sprache (**Deutsch / English**)
- Plattformauswahl + optionale Video-Länge
- Transkript oder Rohtext einfügen – **`.srt`/`.vtt`-Zeitstempel werden automatisch bereinigt**
- 3 Beispiel-Transkripte zum Sofort-Test integriert

### 2. Clip-Ideen-Generator
Jede generierte Clip-Idee enthält:

`Titel` · `Hook` · `Kurzbeschreibung` · `empfohlene Plattform` · `Clip-Länge (15/30/60s)` ·
`Text-Overlay` · `Caption` · `Hashtags` · `Schnittanweisung` · `B-Roll-Idee` · `CTA` ·
`Viral-Potenzial-Score (0–100)` · `Schwierigkeitsgrad` · `Status (Idee → Ausgewählt → Geplant → Veröffentlicht)`

### 3. Hook Engine
9 Hook-Varianten zu jedem Thema auf Knopfdruck:
**Problem · Shock · Story · Zahlen · Fehler · Mythos · „Niemand spricht darüber" ·
„Ich habe X getestet" · „3 Dinge, die ich früher gewusst hätte"**

### 4. Plattform-Anpassung
Pro Plattform eine eigene, passende Ausgabe:

| Plattform | Stil |
|---|---|
| **TikTok** | Schneller Hook, lockere Caption, starke Overlays, Trend-Hinweise |
| **Instagram Reels** | Ästhetische Caption, Carousel-/Story-Idee, kurze Hashtags |
| **YouTube Shorts** | Präziser Titel, starker Anfang, Beschreibung |
| **LinkedIn** | Professioneller Post, Business-Kontext, Kommentarfrage |
| **Snapchat** | Sehr kurze, direkte Caption, lockerer Stil, junge Zielgruppe |

### 5. Clip-Editor
- Alle Felder editierbar (Hook, Caption, Hashtags, Overlay, Schnittanweisung, B-Roll, CTA …)
- **Copy-Buttons** für Hook, Caption, Hashtags & Schnittanweisung
- Status ändern, Plattform-Versionen generieren, direkt in den Kalender übernehmen

### 6. Content-Kalender
- **Monatsansicht** & **Listenansicht**
- Posts planen (Datum, Plattform, Status), Status wechseln, löschen
- CSV-/JSON-Export des Redaktionsplans

### 7. Export-Funktionen
- **CSV** (alle Clips eines Projekts oder aller Projekte)
- **Markdown** (schön formatiert pro Projekt)
- **JSON** (maschinenlesbar)
- **Cutter-Export** (CSV): Clip-Titel, Szene/Schnitt, Text-Overlay, B-Roll, CTA

### 8. Brand Profiles
Speichere **Name, Zielgruppe, Tonalität, Nische, Tabu-Wörter, bevorzugte Plattformen und
CTA-Stil** – diese fließen automatisch in die Clip-Generierung ein.

### 9. Dashboard & Admin
- **Dashboard:** Kennzahlen (Projekte, Clips, geplante/veröffentlichte Posts), Top-Clips, kommende Posts, Abo-Status
- **Adminbereich:** Nutzerliste, Plan & Rolle setzen, Beispiel-Templates, Systemstatus

---

## 🧱 Tech-Stack

- **[Next.js 15](https://nextjs.org/)** (App Router) + **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS** + eigenes, hochwertiges UI-Komponenten-System (kein UI-Framework-Lock-in)
- **Prisma ORM** + **SQLite** (lokal, leicht auf PostgreSQL umstellbar)
- **Zod** für serverseitige Validierung
- **Lemon Squeezy** Integration (Pricing, Plan-Limits, Webhook)
- **lucide-react** Icons

---

## ⚡ Schnellstart

> Voraussetzungen: **Node.js 18.18+** (empfohlen 20+) und npm

```bash
# 1. Repository klonen
git clone https://github.com/MauricePutinas/ClipStorm-AI.git
cd ClipStorm-AI

# 2. Abhängigkeiten installieren (generiert auch den Prisma Client)
npm install

# 3. Umgebungsvariablen anlegen (Standardwerte funktionieren sofort)
cp .env.example .env        # Windows: copy .env.example .env

# 4. Datenbank + Demo-Daten in einem Schritt
npm run setup               # prisma generate + db:push + seed

# 5. Starten
npm run dev                 # → http://localhost:3000
```

**Demo-Zugang:** Du bist automatisch als `demo@clipstorm.ai` eingeloggt (kein Passwort nötig).
**Adminbereich:** `/admin` · Token = `ADMIN_TOKEN` aus der `.env` (Demo-Standard: `clipstorm-admin`).

### Verfügbare Skripte
```bash
npm run dev          # Entwicklungsserver
npm run build        # Produktions-Build (inkl. prisma generate)
npm run start        # Produktionsserver
npm run typecheck    # TypeScript-Prüfung
npm run db:push      # Schema -> DB
npm run db:seed      # Seed-Daten
npm run db:reset     # DB zurücksetzen + neu seeden
npm run setup        # generate + push + seed
```

---

## 🧭 Wichtige Seiten

| Bereich | Pfad |
|---|---|
| Landingpage | `/` |
| Dashboard | `/dashboard` |
| Projekte / Neues Projekt | `/dashboard/projekte`, `/dashboard/projekte/neu` |
| Clip-Editor | `/dashboard/projekte/[id]/clips/[clipId]` |
| Hook Engine | `/dashboard/hooks` |
| Content-Kalender | `/dashboard/kalender` |
| Brand Profiles | `/dashboard/brand` |
| Exporte | `/dashboard/exporte` |
| Abo & Preise | `/dashboard/abo` |
| Adminbereich | `/admin` |
| Datenschutz / Impressum | `/datenschutz`, `/impressum` |

---

## 📁 Projektstruktur

```
src/
├─ app/
│  ├─ page.tsx              # Landingpage
│  ├─ dashboard/            # Dashboard-Bereich (Layout + Seiten)
│  ├─ admin/                # Adminbereich
│  └─ api/                  # Route Handler (REST-API)
├─ components/              # UI- & Feature-Komponenten
└─ lib/
   ├─ generators/           # clip / hook / caption / hashtag / platformAdapter / scoreCalculator
   ├─ ai/                   # Provider-Abstraktion (+ OpenAI/Claude/DeepSeek-Platzhalter)
   ├─ services/             # Server-Services (Generierung)
   ├─ constants.ts · types.ts · validation.ts · plan.ts
   ├─ lemonsqueezy.ts · export.ts · serializers.ts · auth.ts
prisma/
├─ schema.prisma           # Datenmodell
└─ seed.ts                 # Demo-Daten
```

---

## 🗄️ Datenmodell

8 Prisma-Modelle: **User · Project · ClipIdea · PlatformVersion · CalendarItem · Subscription ·
ExportLog · BrandProfile**

> Hinweis: SQLite unterstützt in Prisma keine Enums/Scalar-Listen. Aufzählungswerte werden als
> `String` (per Zod validiert), Listen (Hashtags/Plattformen) als JSON-String gespeichert.

---

## 🤖 AI-Provider aktivieren

Standardmäßig ist der **Template-Provider** aktiv (`AI_PROVIDER="template"`, ohne externe API).
Die Schnittstelle liegt in `src/lib/ai/`:

```
provider.ts                      # Interface + Auswahl-Logik (sicherer Fallback auf Template)
templateProvider.ts              # lokaler Regel-Provider (Standard)
openaiProvider.placeholder.ts    # Platzhalter OpenAI
claudeProvider.placeholder.ts    # Platzhalter Anthropic Claude
deepseekProvider.placeholder.ts  # Platzhalter DeepSeek
```

Beispiel (Claude aktivieren):
1. `npm install @anthropic-ai/sdk`
2. In `.env`: `AI_PROVIDER="claude"` und `ANTHROPIC_API_KEY="..."`
3. Methoden in `claudeProvider.placeholder.ts` implementieren und `claudeImplemented = true` setzen.

Solange ein Provider nicht implementiert oder kein Key gesetzt ist, fällt die App automatisch
(mit Log-Warnung) auf den Template-Provider zurück – **die App funktioniert immer.**

---

## 💳 Lemon Squeezy einrichten

Pläne: **Free Demo** (3 Projekte / 10 Clips) · **Creator** 9 €/Monat (30 Projekte) ·
**Pro** 19 €/Monat (unbegrenzt) · **Agency** 49 €/Monat (Team, Platzhalter).

In der `.env`:
```env
LEMON_SQUEEZY_API_KEY="..."
LEMON_SQUEEZY_WEBHOOK_SECRET="..."
LEMON_SQUEEZY_STORE_ID="..."
NEXT_PUBLIC_LEMON_SQUEEZY_CREATOR_CHECKOUT_URL="https://...lemonsqueezy.com/checkout/..."
NEXT_PUBLIC_LEMON_SQUEEZY_PRO_CHECKOUT_URL="https://..."
NEXT_PUBLIC_LEMON_SQUEEZY_AGENCY_CHECKOUT_URL="https://..."
```

Webhook-Endpunkt: `POST /api/webhooks/lemon-squeezy` (HMAC-SHA256-Signaturprüfung).
Plan-Limits werden **serverseitig** durchgesetzt.

---

## 🔐 Sicherheit

- ✅ **Keine echten API-Keys** im Repo – nur `.env.example`; `.env` ist gitignored
- ✅ Serverseitige **Input-Validierung** (Zod) auf allen API-Routen
- ✅ **Plan-Limits** serverseitig geprüft (Projekt- & Clip-Anzahl)
- ✅ **Webhook-Signaturprüfung** (HMAC-SHA256, `timingSafeEqual`)
- ✅ **Owner-Checks** auf allen Ressourcen (kein Cross-Tenant-Zugriff)
- ✅ Admin-Token ohne unsicheren Hardcoded-Fallback
- ✅ **CSV-Formula-Injection-Schutz** beim Export
- ✅ Begrenzte Transkript-Größe, kein gefährlicher Datei-Upload

> Hinweis: Das MVP nutzt einen **Demo-Nutzer** (kein echtes Login). Die `getCurrentUser()`-Schicht
> in `src/lib/auth.ts` ist der zentrale Einstiegspunkt, um z. B. NextAuth zu ergänzen.

---

## 🗺️ Roadmap

- [ ] Echtes Login/Auth (NextAuth)
- [ ] Datei-Upload für `.txt` / `.srt` / `.vtt`
- [ ] Echte AI-Provider-Anbindung (Claude / OpenAI / DeepSeek)
- [ ] Team-Funktionen (Agency-Plan)
- [ ] PostgreSQL für Produktion

---

## 📦 Deployment

- Schnelle Demo: **Vercel**. ⚠️ SQLite ist auf serverlosen Plattformen nicht persistent –
  für Produktion auf **PostgreSQL** (z. B. Supabase/Neon) wechseln und `DATABASE_URL` setzen.
- Build: `npm run build` · Start: `npm run start`
- Alle Variablen aus `.env.example` in den Deployment-Umgebungsvariablen setzen.

---

## 📄 Lizenz

[MIT](LICENSE) – frei nutzbar.

---

<div align="center">

**ClipStorm AI** · Demo-/MVP-Projekt.
Generierte Inhalte sind Vorschläge und sollten vor der Veröffentlichung redaktionell geprüft werden.

</div>
