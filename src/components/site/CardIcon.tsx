import {
  Briefcase,
  Building2,
  Cpu,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Network,
  Rocket,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Rocket,
  Flask: FlaskConical,
  Building: Building2,
  Users,
  Sparkles,
  Network,
  Briefcase,
  Lightbulb,
  Cpu,
  "Graduation cap": GraduationCap,
};

/** The icon an administrator picked for a card (see ICON_NAMES in site-content). */
export function CardIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}
