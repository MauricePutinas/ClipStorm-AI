import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  CalendarDays,
  Palette,
  Download,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard },
  { href: "/dashboard/projekte", label: "Projekte", icon: FolderKanban },
  { href: "/dashboard/hooks", label: "Hook Engine", icon: Sparkles },
  { href: "/dashboard/kalender", label: "Content-Kalender", icon: CalendarDays },
  { href: "/dashboard/brand", label: "Brand Profile", icon: Palette },
  { href: "/dashboard/exporte", label: "Exporte", icon: Download },
  { href: "/dashboard/abo", label: "Abo & Preise", icon: CreditCard },
];
