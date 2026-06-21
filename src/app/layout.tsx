import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ClipStorm AI – Aus einem langen Video 20 virale Shorts",
    template: "%s · ClipStorm AI",
  },
  description:
    "ClipStorm AI verwandelt lange Videos, Podcasts und Transkripte automatisch in Clip-Ideen, Hooks, Captions, Hashtags und Schnittanweisungen für TikTok, Reels, Shorts, LinkedIn und Snapchat.",
  keywords: [
    "Short-Form-Content",
    "Clip Generator",
    "TikTok",
    "Reels",
    "YouTube Shorts",
    "Content Repurposing",
    "Creator Tools",
  ],
  authors: [{ name: "ClipStorm AI" }],
  openGraph: {
    title: "ClipStorm AI",
    description: "Verwandle ein langes Video in 20 virale Short-Form-Ideen.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className="dark">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
