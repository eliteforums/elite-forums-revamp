import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/metadata";
import { buildUtmUrl } from "@/lib/utm";
import { cn } from "@/lib/utils";
import { ImageUpload } from "./ImageUpload";
import { FieldLabel, fieldCls } from "./ui";

/** Channels the team shares through, with the tags each one should carry. */
export const CHANNELS = [
  { label: "Instagram", source: "instagram", medium: "social" },
  { label: "LinkedIn", source: "linkedin", medium: "social" },
  { label: "WhatsApp", source: "whatsapp", medium: "messaging" },
  { label: "Email newsletter", source: "newsletter", medium: "email" },
  { label: "X (Twitter)", source: "x", medium: "social" },
  { label: "Facebook", source: "facebook", medium: "social" },
  { label: "College / E-Cell partner", source: "college-partner", medium: "referral" },
  { label: "Poster / QR code", source: "poster", medium: "offline" },
] as const;

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          },
          () => toast.error("Copy failed — select the link and copy it manually."),
        );
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-electric/50 hover:text-foreground"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-electric" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

/** Ready-to-share tagged links to one page, one per channel. */
export function ShareLinks({ path, campaign }: { path: string; campaign: string }) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
      {CHANNELS.map((channel) => {
        const url = buildUtmUrl(path, {
          utm_source: channel.source,
          utm_medium: channel.medium,
          utm_campaign: campaign,
        });
        return (
          <li key={channel.source} className="flex items-center gap-3 px-3 py-2.5">
            <span className="w-36 shrink-0 text-xs font-medium">{channel.label}</span>
            <code
              className="min-w-0 flex-1 truncate text-[0.7rem] text-muted-foreground"
              title={url}
            >
              {url.replace(SITE_URL, "")}
            </code>
            <CopyButton value={url} />
          </li>
        );
      })}
    </ul>
  );
}

export type SeoDraft = {
  title: string;
  description: string;
  image: string;
  keywords: string;
  noindex: boolean;
};

function Counter({ value, ideal }: { value: string; ideal: [number, number] }) {
  const n = value.length;
  const tone =
    n === 0
      ? "text-muted-foreground"
      : n < ideal[0] || n > ideal[1]
        ? "text-amber-400"
        : "text-electric";
  return (
    <span className={cn("text-xs", tone)}>
      {n} / {ideal[1]}
    </span>
  );
}

/** Search-result and social-sharing settings, with a live Google preview. */
export function SeoFields({
  seo,
  onChange,
  path,
  fallback,
}: {
  seo: SeoDraft;
  onChange: (seo: SeoDraft) => void;
  path: string;
  fallback: { title: string; description: string; image: string };
}) {
  const set = <K extends keyof SeoDraft>(key: K, value: SeoDraft[K]) =>
    onChange({ ...seo, [key]: value });
  const title = `${seo.title || fallback.title} — Elite Forums`;
  const description = seo.description || fallback.description;
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-white p-4 text-left">
        <p className="truncate text-xs text-[#4d5156]">eliteforums.in{path}</p>
        <p className="mt-1 line-clamp-1 text-lg leading-6 text-[#1a0dab]">{title}</p>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#4d5156]">{description}</p>
      </div>
      <FieldLabel
        label="Search title"
        hint={`Leave empty to use “${fallback.title}”. Aim for 30–60 characters.`}
        action={<Counter value={seo.title} ideal={[30, 60]} />}
      >
        <input
          className={fieldCls}
          value={seo.title}
          maxLength={120}
          onChange={(e) => set("title", e.target.value)}
        />
      </FieldLabel>
      <FieldLabel
        label="Search description"
        hint="Shown under the title in Google and when the link is shared. Aim for 70–160 characters."
        action={<Counter value={seo.description} ideal={[70, 160]} />}
      >
        <textarea
          className={cn(fieldCls, "leading-6")}
          rows={3}
          maxLength={320}
          value={seo.description}
          placeholder={fallback.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </FieldLabel>
      <FieldLabel
        label="Sharing image link"
        hint="Image shown on WhatsApp, LinkedIn and other link previews (1200×630 works best). Leave empty to use the poster."
      >
        <input
          className={fieldCls}
          value={seo.image}
          placeholder={fallback.image}
          onChange={(e) => set("image", e.target.value)}
        />
        <div className="mt-2">
          <ImageUpload onUploaded={(url) => set("image", url)} label="Upload sharing image" />
        </div>
      </FieldLabel>
      <FieldLabel
        label="Keywords"
        hint="Comma-separated, e.g. startup workshop Mumbai, product development."
      >
        <input
          className={fieldCls}
          value={seo.keywords}
          onChange={(e) => set("keywords", e.target.value)}
        />
      </FieldLabel>
      <label className="flex cursor-pointer items-start gap-2 text-sm">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 accent-[var(--electric)]"
          checked={seo.noindex}
          onChange={(e) => set("noindex", e.target.checked)}
        />
        <span>
          Hide from search engines
          <span className="block text-xs text-muted-foreground">
            The page stays reachable by link but asks Google not to list it.
          </span>
        </span>
      </label>
    </div>
  );
}
