import {
  BookOpen,
  ExternalLink,
  FileText,
  Loader2,
  PenLine,
  PlayCircle,
  Radio,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { videoEmbedUrl, type LessonKind } from "@/lib/lms";
import { lmsError } from "./session";

export const LESSON_ICONS: Record<LessonKind, LucideIcon> = {
  video: PlayCircle,
  reading: BookOpen,
  assignment: PenLine,
  live: Radio,
  resource: FileText,
};

export function ProgressBar({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label={label ?? "Progress"}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className="h-full rounded-full bg-brand transition-[width] duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow text-electric">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-electric" /> {label}
    </div>
  );
}

export function LoadError({ error, retry }: { error: unknown; retry?: () => void }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h2 className="font-display text-xl font-semibold">This didn't load</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{lmsError(error)}</p>
      {retry && (
        <Button className="mt-6" variant="outline" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Embeds YouTube, Vimeo, Loom and Google Drive videos; anything else opens as a link. */
export function VideoPlayer({ url, title }: { url: string; title: string }) {
  const embed = videoEmbedUrl(url);
  if (!embed)
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <PlayCircle className="h-10 w-10 text-electric" />
        <span className="inline-flex items-center gap-1.5">
          Open the video <ExternalLink className="h-3.5 w-3.5" />
        </span>
      </a>
    );
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
      <iframe
        src={embed}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export function minutes(value: number | null | undefined) {
  if (!value) return "";
  if (value < 60) return `${value} min`;
  const rest = value % 60;
  return `${Math.floor(value / 60)} h${rest ? ` ${rest} min` : ""}`;
}
