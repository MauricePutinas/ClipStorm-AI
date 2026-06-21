// Beispiel-Transkripte für den schnellen Test im "Neues Projekt"-Formular.
export interface DemoTranscript {
  id: string;
  label: string;
  niche: string;
  audience: string;
  tone: string;
  text: string;
}

export const DEMO_TRANSCRIPTS: DemoTranscript[] = [
  {
    id: "ki",
    label: "KI-Automatisierung",
    niche: "KI & Automatisierung",
    audience: "Selbstständige & kleine Teams",
    tone: "direkt",
    text: `Der größte Fehler bei KI-Automatisierung? Die Leute kaufen zehn Tools und automatisieren am Ende nichts. Ich habe 30 Tage lang jeden manuellen Prozess in meiner Firma dokumentiert. Das Ergebnis hat mich schockiert: Wir haben 14 Stunden pro Woche mit Aufgaben verbracht, die ein einfacher Workflow erledigt. Niemand spricht darüber, aber Automatisierung beginnt nicht mit Software, sondern mit einem klaren Prozess auf Papier. Drei Dinge, die ich gerne früher gewusst hätte: Automatisiere nur, was du schon fünfmal manuell gemacht hast. Jede Automatisierung braucht einen Notfall-Plan. Und der ROI kommt aus weniger Fehlern, nicht nur aus Zeitersparnis. Wir haben unsere Angebotserstellung automatisiert und die Antwortzeit von zwei Tagen auf zwölf Minuten reduziert. Der Umsatz ist im ersten Quartal um 23 Prozent gestiegen.`,
  },
  {
    id: "fitness",
    label: "Fitness-Grundlagen",
    niche: "Fitness & Gesundheit",
    audience: "Einsteiger:innen im Krafttraining",
    tone: "inspirierend",
    text: `Warum geben 90 Prozent der Menschen im Januar wieder auf? Das Problem ist nicht Motivation, sondern dass niemand die einfachen Grundlagen erklärt. Als Personal Trainer habe ich über 500 Klienten betreut und immer dieselben drei Fehler gesehen. Erstens: zu schnell zu viel. Zweitens: du unterschätzt Schlaf, denn Muskeln wachsen nachts, nicht im Gym. Drittens: zu wenig Protein, eine einfache Regel sind zwei Gramm pro Kilo Körpergewicht. Ein Mythos: Cardio sei der beste Weg zum Abnehmen. Falsch. Krafttraining baut Muskeln auf, die rund um die Uhr Kalorien verbrennen. Was wirklich funktioniert: drei Einheiten pro Woche, jeweils 45 Minuten, mit Grundübungen. Ich habe das selbst getestet und in zwölf Wochen acht Kilo Fett verloren. Konsistenz schlägt Perfektion.`,
  },
  {
    id: "webdesign",
    label: "Webdesign das verkauft",
    niche: "Webdesign & Conversion",
    audience: "Selbstständige & KMU",
    tone: "professionell",
    text: `Warum bringen die meisten Websites keine Kunden, obwohl sie schön aussehen? Der größte Fehler: Designer bauen für andere Designer, nicht für echte Besucher. Eine Website hat genau drei Sekunden Zeit, um zu zeigen, was sie anbietet und für wen. Niemand spricht darüber, aber Geschwindigkeit ist das wichtigste Designelement. Eine Sekunde mehr Ladezeit senkt die Conversion um sieben Prozent. Ich habe 50 Landingpages analysiert und ein klares Muster gefunden: eine klare Überschrift, ein einziger Call-to-Action, keine Ablenkung. Drei Dinge, die ich gerne früher gewusst hätte: Weniger ist fast immer mehr. Text schlägt Animationen. Und mobile First ist kein Trend, weil 70 Prozent über das Handy kommen. Ein Test: Zeig deine Seite jemandem fünf Sekunden und frag, was du verkaufst.`,
  },
];
