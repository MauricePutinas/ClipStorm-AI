"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Brauche ich eine KI-API oder einen Account bei OpenAI?",
    a: "Nein. ClipStorm AI funktioniert komplett lokal mit einem regelbasierten Generator. Eine spätere Anbindung an OpenAI, Claude oder DeepSeek ist vorbereitet, aber nicht erforderlich.",
  },
  {
    q: "Welche Plattformen werden unterstützt?",
    a: "TikTok, Instagram Reels, YouTube Shorts, LinkedIn und Snapchat – jeweils mit eigener, plattformgerechter Version von Hook, Caption, Hashtags und Overlay.",
  },
  {
    q: "Was kann ich als Input einfügen?",
    a: "Jedes Transkript oder jeden Rohtext aus Videos, Podcasts, Interviews oder Webinaren. Auch .srt/.vtt-Inhalte werden automatisch von Zeitstempeln bereinigt.",
  },
  {
    q: "In welchem Format kann ich exportieren?",
    a: "CSV, Markdown und JSON – plus einen speziellen Cutter-Export mit Szene, Text-Overlay, B-Roll und CTA für deinen Videoeditor.",
  },
  {
    q: "Wie funktioniert die Abrechnung?",
    a: "Die Monetarisierung ist über Lemon Squeezy vorbereitet (Pricing, Webhooks, Plan-Limits). In dieser Demo ist keine echte Zahlung aktiv – hinterlege deine Checkout-URLs in der .env, um sie zu aktivieren.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-card/60">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-medium text-foreground">{item.q}</span>
              <ChevronDown className={cn("size-5 shrink-0 text-cyan transition-transform", isOpen && "rotate-180")} />
            </button>
            <div className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
