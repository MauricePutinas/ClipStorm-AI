// Seed-Daten für ClipStorm AI.
// Erstellt Demo-Nutzer, Brand Profiles, drei Beispiel-Projekte mit echten
// generierten Clips sowie einige Kalender-Einträge.
import { PrismaClient } from "@prisma/client";
import { generateClips } from "../src/lib/generators/clipGenerator";
import { adaptToPlatform } from "../src/lib/generators/platformAdapter";
import type { GenerationContext, PlatformId } from "../src/lib/types";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@clipstorm.ai";
const AGENCY_EMAIL = "agentur@clipstorm.ai";

const TRANSCRIPT_KI = `
Willkommen zurück. Heute reden wir über KI-Automatisierung im Business und warum die meisten Selbstständigen das komplett falsch angehen.
Der größte Fehler? Die Leute kaufen zehn Tools und automatisieren am Ende nichts. Ich habe 30 Tage lang jeden manuellen Prozess in meiner Firma dokumentiert.
Das Ergebnis hat mich schockiert: Wir haben 14 Stunden pro Woche mit Aufgaben verbracht, die ein einfacher Workflow erledigt.
Niemand spricht darüber, aber Automatisierung beginnt nicht mit Software. Sie beginnt mit einem klaren Prozess auf Papier.
Erst wenn du weißt, welcher Schritt nach welchem kommt, kannst du ihn an eine KI übergeben.
Drei Dinge, die ich gerne früher gewusst hätte: Erstens, automatisiere nur, was du schon mindestens fünfmal manuell gemacht hast.
Zweitens, jede Automatisierung braucht einen Notfall-Plan, wenn die KI etwas falsch macht.
Drittens, der ROI kommt nicht aus Zeitersparnis allein, sondern aus weniger Fehlern und schnellerer Reaktion auf Kunden.
Ein konkretes Beispiel: Wir haben unsere Angebotserstellung automatisiert und damit die Antwortzeit von zwei Tagen auf zwölf Minuten reduziert.
Der Umsatz ist im ersten Quartal um 23 Prozent gestiegen, einfach weil wir schneller waren als die Konkurrenz.
Die Wahrheit ist: KI ersetzt dich nicht. Aber jemand, der KI sinnvoll einsetzt, ersetzt jemanden, der es nicht tut.
`.trim();

const TRANSCRIPT_FITNESS = `
Lass uns über Fitness reden und warum 90 Prozent der Menschen im Januar aufgeben.
Das Problem ist nicht Motivation. Das Problem ist, dass niemand dir die einfachen Grundlagen erklärt.
Ich habe als Personal Trainer über 500 Klienten betreut und immer dieselben drei Fehler gesehen.
Erster Fehler: zu schnell zu viel. Du trainierst sieben Tage die Woche und bist nach zwei Wochen ausgebrannt.
Zweiter Fehler: du unterschätzt Schlaf. Muskeln wachsen nicht im Gym, sie wachsen in der Nacht.
Dritter Fehler: du isst zu wenig Protein. Eine einfache Regel: zwei Gramm pro Kilo Körpergewicht.
Ein Mythos, den ich immer wieder höre: Cardio ist der beste Weg zum Abnehmen. Falsch.
Krafttraining baut Muskeln auf, und mehr Muskeln verbrennen rund um die Uhr mehr Kalorien.
Hier ist, was wirklich funktioniert: drei Trainingseinheiten pro Woche, jeweils 45 Minuten, mit Grundübungen.
Kniebeugen, Kreuzheben, Bankdrücken, Klimmzüge. Das war's. Du brauchst keine 20 Maschinen.
Ich habe das selbst getestet und in zwölf Wochen acht Kilo Fett verloren und gleichzeitig stärker geworden.
Die Wahrheit über Fitness ist langweilig: Konsistenz schlägt Perfektion. Jeden einzelnen Tag.
`.trim();

const TRANSCRIPT_WEBDESIGN = `
Heute zeige ich dir, warum die meisten Websites keine Kunden bringen, obwohl sie schön aussehen.
Der größte Fehler im Webdesign ist, dass Designer für andere Designer bauen, nicht für echte Besucher.
Eine Website hat genau drei Sekunden Zeit, um zu zeigen, was sie anbietet und für wen.
Wenn ein Besucher nach drei Sekunden nicht weiß, wo er ist, klickt er weg. Für immer.
Niemand spricht darüber, aber Geschwindigkeit ist das wichtigste Designelement überhaupt.
Eine Sekunde mehr Ladezeit kann deine Conversion um sieben Prozent senken. Das ist bares Geld.
Ich habe 50 Landingpages analysiert und ein klares Muster gefunden bei den erfolgreichen.
Sie haben eine klare Überschrift, einen einzigen Call-to-Action und keine Ablenkung.
Drei Dinge, die ich gerne früher gewusst hätte: Erstens, weniger ist fast immer mehr.
Zweitens, Text schlägt fancy Animationen, weil Menschen lesen, bevor sie kaufen.
Drittens, mobile First ist kein Trend, sondern die Realität, weil 70 Prozent über das Handy kommen.
Ein einfacher Test: Zeig deine Website jemandem für fünf Sekunden und frag, was wir verkaufen.
Wenn die Person es nicht beantworten kann, hast du ein Designproblem, kein Geschmacksproblem.
`.trim();

async function main() {
  console.log("🌱 Seed startet …");

  // Aufräumen (idempotent)
  await prisma.platformVersion.deleteMany();
  await prisma.calendarItem.deleteMany();
  await prisma.clipIdea.deleteMany();
  await prisma.exportLog.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.brandProfile.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // --- Demo Creator ---
  const creator = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      name: "Demo Creator",
      role: "USER",
      plan: "FREE",
      subscription: {
        create: { plan: "FREE", status: "none" },
      },
      brandProfiles: {
        create: {
          name: "Mein Creator Brand",
          audience: "Selbstständige & angehende Creator (25–40)",
          tone: "locker",
          niche: "Online Business & Produktivität",
          avoidWords: JSON.stringify(["billig", "Garantie"]),
          preferredPlatforms: JSON.stringify(["tiktok", "reels", "shorts"]),
          ctaStyle: "frage",
          isDefault: true,
        },
      },
    },
  });

  // --- Agentur ---
  const agency = await prisma.user.create({
    data: {
      email: AGENCY_EMAIL,
      name: "Pixel & Pulse Agentur",
      role: "ADMIN",
      plan: "AGENCY",
      subscription: {
        create: {
          plan: "AGENCY",
          status: "active",
          renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
      brandProfiles: {
        create: {
          name: "Agency Voice",
          audience: "B2B-Kunden & Coaches",
          tone: "professionell",
          niche: "Marketing & Beratung",
          avoidWords: JSON.stringify(["günstig"]),
          preferredPlatforms: JSON.stringify(["linkedin", "reels", "shorts"]),
          ctaStyle: "direkt",
          isDefault: true,
        },
      },
    },
  });

  const projects: {
    userId: string;
    title: string;
    niche: string;
    audience: string;
    tone: string;
    platforms: PlatformId[];
    transcript: string;
    videoLengthSec: number;
    ctaStyle: string;
    count: number;
  }[] = [
    {
      userId: creator.id,
      title: "KI-Automatisierung für Selbstständige",
      niche: "KI & Automatisierung",
      audience: "Selbstständige & kleine Teams",
      tone: "direkt",
      platforms: ["tiktok", "reels", "shorts", "linkedin"],
      transcript: TRANSCRIPT_KI,
      videoLengthSec: 1320,
      ctaStyle: "frage",
      count: 10,
    },
    {
      userId: creator.id,
      title: "Fitness-Grundlagen Podcast",
      niche: "Fitness & Gesundheit",
      audience: "Einsteiger:innen im Krafttraining",
      tone: "inspirierend",
      platforms: ["tiktok", "reels", "shorts", "snapchat"],
      transcript: TRANSCRIPT_FITNESS,
      videoLengthSec: 1080,
      ctaStyle: "direkt",
      count: 10,
    },
    {
      userId: agency.id,
      title: "Webdesign das verkauft (Kunden-Webinar)",
      niche: "Webdesign & Conversion",
      audience: "Selbstständige & KMU",
      tone: "professionell",
      platforms: ["linkedin", "reels", "shorts"],
      transcript: TRANSCRIPT_WEBDESIGN,
      videoLengthSec: 2400,
      ctaStyle: "direkt",
      count: 12,
    },
  ];

  const createdClipIds: { clipId: string; platforms: PlatformId[] }[] = [];

  for (const p of projects) {
    const project = await prisma.project.create({
      data: {
        userId: p.userId,
        title: p.title,
        niche: p.niche,
        audience: p.audience,
        tone: p.tone,
        language: "de",
        platforms: JSON.stringify(p.platforms),
        transcript: p.transcript,
        videoLengthSec: p.videoLengthSec,
        status: "ANALYZED",
      },
    });

    const ctx: GenerationContext = {
      transcript: p.transcript,
      platforms: p.platforms,
      tone: p.tone,
      audience: p.audience,
      niche: p.niche,
      language: "de",
      videoLengthSec: p.videoLengthSec,
      count: p.count,
      ctaStyle: p.ctaStyle,
    };

    const clips = generateClips(ctx);

    for (let i = 0; i < clips.length; i++) {
      const c = clips[i];
      const clip = await prisma.clipIdea.create({
        data: {
          projectId: project.id,
          title: c.title,
          hook: c.hook,
          description: c.description,
          recommendedPlatform: c.recommendedPlatform,
          lengthSec: c.lengthSec,
          textOverlay: c.textOverlay,
          caption: c.caption,
          hashtags: JSON.stringify(c.hashtags),
          cutInstruction: c.cutInstruction,
          bRoll: c.bRoll,
          cta: c.cta,
          viralScore: c.viralScore,
          difficulty: c.difficulty,
          status: i === 0 ? "SELECTED" : "IDEA",
          order: i,
        },
      });

      // Für die ersten beiden Clips jedes Projekts Plattform-Versionen erzeugen.
      if (i < 2) {
        for (const platform of p.platforms) {
          const out = adaptToPlatform(
            {
              title: c.title,
              hook: c.hook,
              description: c.description,
              caption: c.caption,
              hashtags: c.hashtags,
              cta: c.cta,
              textOverlay: c.textOverlay,
              lengthSec: c.lengthSec,
            },
            platform,
            { tone: p.tone, niche: p.niche, language: "de", ctaStyle: p.ctaStyle },
          );
          await prisma.platformVersion.create({
            data: {
              clipId: clip.id,
              platform: out.platform,
              hook: out.hook,
              caption: out.caption,
              hashtags: JSON.stringify(out.hashtags),
              textOverlay: out.textOverlay,
              extra: JSON.stringify(out.extra),
            },
          });
        }
      }

      if (i === 0) {
        createdClipIds.push({ clipId: clip.id, platforms: p.platforms });
      }
    }

    console.log(`  ✅ Projekt "${p.title}" mit ${clips.length} Clips`);
  }

  // --- Kalender-Einträge ---
  const base = new Date();
  base.setHours(10, 0, 0, 0);
  let dayOffset = 1;
  for (const entry of createdClipIds) {
    const clip = await prisma.clipIdea.findUnique({ where: { id: entry.clipId } });
    if (!clip) continue;
    const scheduledAt = new Date(base.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    await prisma.calendarItem.create({
      data: {
        userId: clip.projectId
          ? (await prisma.project.findUnique({ where: { id: clip.projectId } }))!.userId
          : creator.id,
        projectId: clip.projectId,
        clipId: clip.id,
        title: clip.title,
        platform: entry.platforms[0],
        scheduledAt,
        status: "PLANNED",
        notes: "Automatisch aus Clip geplant (Demo).",
      },
    });
    dayOffset += 2;
  }

  console.log("✅ Seed abgeschlossen.");
  console.log(`   Demo-Login (kein Passwort nötig): ${DEMO_EMAIL}`);
  console.log(`   Admin-Token (siehe .env ADMIN_TOKEN): clipstorm-admin`);
}

main()
  .catch((e) => {
    console.error("❌ Seed-Fehler:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
