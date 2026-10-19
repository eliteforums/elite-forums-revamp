import { Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { useContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.84 9.84 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

/** Phone numbers as written for display; digits (with +) for dialling. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Instagram, LinkedIn and WhatsApp community, as round icon links. */
export function SocialLinks({ className }: { className?: string }) {
  const c = useContent("global");
  const links = [
    { href: c.t("social.instagram"), label: "Elite Forums on Instagram", Icon: Instagram },
    { href: c.t("social.linkedin"), label: "Elite Forums on LinkedIn", Icon: Linkedin },
    {
      href: c.t("social.whatsapp"),
      label: "Join the Elite Forums WhatsApp community",
      Icon: WhatsAppIcon,
    },
  ].filter((link) => link.href.trim());
  if (!links.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {links.map(({ href, label, Icon }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-electric hover:text-electric"
          >
            <Icon className="h-4 w-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Email addresses and phone number, each a working link. */
export function ContactDetails({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const c = useContent("global");
  const email = c.t("contact.email").trim();
  const founder = c.t("contact.founderEmail").trim();
  const phone = c.t("contact.phone").trim();
  const rows = [
    email && { Icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    founder && {
      Icon: Mail,
      label: c.t("contact.founderLabel") || "Founder",
      value: founder,
      href: `mailto:${founder}`,
    },
    phone && { Icon: Phone, label: "Phone", value: phone, href: telHref(phone) },
  ].filter(Boolean) as { Icon: typeof Mail; label: string; value: string; href: string }[];
  if (!rows.length) return null;
  return (
    <ul className={cn(compact ? "space-y-2" : "space-y-4", className)}>
      {rows.map(({ Icon, label, value, href }) => (
        <li key={label + value} className="flex items-start gap-3">
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
          <span className="min-w-0">
            {!compact && <span className="block text-xs text-muted-foreground">{label}</span>}
            <a
              href={href}
              className="break-all text-sm text-foreground/90 transition-colors hover:text-electric"
            >
              {compact && label !== "Email" && label !== "Phone" ? `${label}: ` : ""}
              {value}
            </a>
          </span>
        </li>
      ))}
    </ul>
  );
}
