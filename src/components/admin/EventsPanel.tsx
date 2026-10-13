import { CalendarDays, ImagePlus, MapPin, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteAdminEvent, saveAdminEvent, uploadEventPoster } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";
import { eventStatus } from "@/lib/content";
import { Card, Drawer, Empty, FieldLabel, PanelHeader, Pill, errorMessage, fieldCls } from "./ui";

export type AdminEvent = {
  id: string;
  slug: string;
  type: string;
  title: string;
  date: string;
  format: string;
  city: string | null;
  location: string;
  summary: string;
  image: string;
  agenda: unknown;
  eligibility: string;
  organizer: string;
  published: boolean;
  registration_url: string | null;
};

type AgendaRow = { time: string; item: string };
type Draft = Omit<AdminEvent, "id" | "agenda" | "city"> & {
  id?: string;
  city: string;
  agenda: AgendaRow[];
  registration_url: string;
};

const TYPES = ["Workshop", "Hackathon", "Founder Connect", "Bootcamp"] as const;
const FORMATS = ["Online", "In-person"] as const;

const blank = (): Draft => ({
  slug: "",
  type: "Workshop",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  format: "In-person",
  city: "",
  location: "",
  summary: "",
  image: "/og-image.png",
  registration_url: "",
  agenda: [{ time: "", item: "" }],
  eligibility: "",
  organizer: "Elite Forums",
  published: true,
});

const toDraft = (event: AdminEvent): Draft => ({
  ...event,
  city: event.city ?? "",
  registration_url: event.registration_url ?? "",
  agenda: Array.isArray(event.agenda)
    ? event.agenda.map((row) => ({
        time: String((row as AgendaRow | null)?.time ?? ""),
        item: String((row as AgendaRow | null)?.item ?? ""),
      }))
    : [],
});

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const longDate = (date: string) =>
  new Date(date + "T12:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function EventsPanel({
  events,
  refresh,
}: {
  events: AdminEvent[];
  refresh: () => Promise<void>;
}) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  async function save() {
    if (!draft) return;
    const missing = (
      [
        ["title", "a title"],
        ["slug", "a web address"],
        ["location", "a location"],
        ["summary", "a summary"],
        ["eligibility", "who can join"],
        ["organizer", "an organiser"],
      ] as const
    ).find(([key]) => !draft[key].trim());
    if (missing) return void toast.error(`Add ${missing[1]} before saving.`);
    setSaving(true);
    try {
      const { city, agenda, registration_url, ...rest } = draft;
      await saveAdminEvent({
        data: {
          ...rest,
          type: rest.type as (typeof TYPES)[number],
          format: rest.format as (typeof FORMATS)[number],
          agenda: agenda.filter((row) => row.time.trim() || row.item.trim()),
          ...(city.trim() ? { city: city.trim() } : {}),
          registration_url: registration_url.trim(),
        },
      });
      await refresh();
      toast.success(draft.published ? "Event saved and live." : "Event saved as a draft.");
      setDraft(null);
    } catch (error) {
      toast.error(errorMessage(error, "Unable to save the event."));
    } finally {
      setSaving(false);
    }
  }

  async function remove(event: AdminEvent) {
    if (!window.confirm(`Delete “${event.title}”? This cannot be undone.`)) return;
    try {
      await deleteAdminEvent({ data: { id: event.id } });
      await refresh();
      toast.success("Event deleted.");
    } catch (error) {
      toast.error(errorMessage(error, "Unable to delete the event."));
    }
  }

  return (
    <>
      <PanelHeader
        title="Events"
        description="Create and publish events. Add a registration URL to show a Register button, or leave it empty to collect registrations on the event page."
        actions={
          <Button variant="brand" size="sm" onClick={() => setDraft(blank())}>
            <Plus /> New event
          </Button>
        }
      />
      {sorted.length === 0 ? (
        <Empty title="No events yet.">
          <Button variant="outline" size="sm" className="mt-3" onClick={() => setDraft(blank())}>
            <Plus /> Create the first event
          </Button>
        </Empty>
      ) : (
        <Card className="divide-y divide-border">
          {sorted.map((event) => (
            <div key={event.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-background text-center leading-none">
                <span className="text-[0.6rem] uppercase text-muted-foreground">
                  {new Date(event.date + "T12:00:00").toLocaleDateString("en-IN", {
                    month: "short",
                  })}
                </span>
                <span className="mt-0.5 text-base font-semibold">{event.date.slice(8, 10)}</span>
              </div>
              <button className="min-w-0 flex-1 text-left" onClick={() => setDraft(toDraft(event))}>
                <p className="truncate font-medium hover:text-electric">{event.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" /> {longDate(event.date)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {event.format} · {event.location}
                  </span>
                  <span>{event.type}</span>
                </p>
              </button>
              <div className="flex items-center gap-2">
                <Pill tone={eventStatus(event) === "Already completed" ? "closed" : "live"}>
                  {eventStatus(event)}
                </Pill>
                <Pill tone={event.published ? "live" : "draft"}>
                  {event.published ? "Live" : "Draft"}
                </Pill>
                <Button variant="outline" size="sm" onClick={() => setDraft(toDraft(event))}>
                  Edit
                </Button>
                <button
                  aria-label={`Delete ${event.title}`}
                  onClick={() => void remove(event)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}
      {draft && (
        <EventDrawer
          draft={draft}
          setDraft={setDraft}
          saving={saving}
          onSave={() => void save()}
          onClose={() => setDraft(null)}
        />
      )}
    </>
  );
}

function EventDrawer({
  draft,
  setDraft,
  saving,
  onSave,
  onClose,
}: {
  draft: Draft;
  setDraft: (draft: Draft) => void;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft({ ...draft, [key]: value });
  const setAgenda = (index: number, key: keyof AgendaRow, value: string) =>
    set(
      "agenda",
      draft.agenda.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    );
  async function uploadPoster(file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Use a JPG, PNG or WebP poster.");
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      toast.error("Poster must be no larger than 6 MB.");
      return;
    }
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Unable to read poster."));
      reader.readAsDataURL(file);
    });
    try {
      const result = await uploadEventPoster({
        data: {
          fileName: file.name,
          contentType: file.type as "image/jpeg" | "image/png" | "image/webp",
          data,
        },
      });
      set("image", result.url);
      toast.success("Event poster uploaded.");
    } catch (error) {
      toast.error(errorMessage(error, "Unable to upload poster."));
    }
  }
  return (
    <Drawer
      title={draft.id ? "Edit event" : "New event"}
      subtitle={draft.title || undefined}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--electric)]"
              checked={draft.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            Publish on the website
          </label>
          <Button variant="brand" disabled={saving} onClick={onSave}>
            <Save /> {saving ? "Saving…" : "Save event"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <FieldLabel label="Title">
          <input
            className={fieldCls}
            value={draft.title}
            placeholder="Founder Connect: From Idea to First Users"
            onChange={(e) =>
              setDraft({
                ...draft,
                title: e.target.value,
                // Keep the address in step with the title until the event exists.
                ...(draft.id || draft.slug !== slugify(draft.title)
                  ? {}
                  : { slug: slugify(e.target.value) }),
              })
            }
          />
        </FieldLabel>
        <FieldLabel
          label="Web address"
          hint={`eliteforums.in/events/${draft.slug || "your-event"} — lowercase letters, numbers and hyphens.`}
        >
          <input
            className={fieldCls}
            value={draft.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
          />
        </FieldLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          <FieldLabel label="Date">
            <input
              type="date"
              className={fieldCls}
              value={draft.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Type">
            <select
              className={fieldCls}
              value={draft.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Format">
            <select
              className={fieldCls}
              value={draft.format}
              onChange={(e) => set("format", e.target.value)}
            >
              {FORMATS.map((format) => (
                <option key={format}>{format}</option>
              ))}
            </select>
          </FieldLabel>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldLabel label="Location">
            <input
              className={fieldCls}
              value={draft.location}
              placeholder="Venue name, or “Live online session”"
              onChange={(e) => set("location", e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="City (optional)">
            <input
              className={fieldCls}
              value={draft.city}
              placeholder="Mumbai"
              onChange={(e) => set("city", e.target.value)}
            />
          </FieldLabel>
        </div>
        <FieldLabel label="Summary">
          <textarea
            className={cn(fieldCls, "leading-6")}
            rows={4}
            maxLength={10000}
            value={draft.summary}
            placeholder="What the event is and why someone should come."
            onChange={(e) => set("summary", e.target.value)}
          />
          <p className="mt-1 text-right text-xs text-muted-foreground">
            {draft.summary.length}/10000
          </p>
        </FieldLabel>
        <FieldLabel label="Who can join">
          <textarea
            className={cn(fieldCls, "leading-6")}
            rows={2}
            value={draft.eligibility}
            onChange={(e) => set("eligibility", e.target.value)}
          />
        </FieldLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldLabel label="Organised by">
            <input
              className={fieldCls}
              value={draft.organizer}
              onChange={(e) => set("organizer", e.target.value)}
            />
          </FieldLabel>
          <FieldLabel
            label="Event poster"
            hint="Upload a JPG, PNG or WebP up to 6 MB, or paste an image URL."
          >
            <input
              className={fieldCls}
              value={draft.image}
              onChange={(e) => set("image", e.target.value)}
            />
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm hover:bg-accent">
              <ImagePlus className="h-4 w-4" /> Upload poster
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadPoster(file);
                  e.currentTarget.value = "";
                }}
              />
            </label>
          </FieldLabel>
        </div>
        <FieldLabel
          label="Event registration URL (optional)"
          hint="When set, the event page shows a Register button that opens this URL. Leave empty to show the on-page registration form."
        >
          <input
            type="url"
            className={fieldCls}
            value={draft.registration_url}
            placeholder="https://example.com/register"
            onChange={(e) => set("registration_url", e.target.value)}
          />
        </FieldLabel>
        <div>
          <p className="mb-2 text-xs font-medium text-foreground/90">Agenda</p>
          <div className="space-y-2">
            {draft.agenda.map((row, index) => (
              <div key={index} className="flex gap-2">
                <input
                  className={cn(fieldCls, "w-28 shrink-0")}
                  placeholder="10:00"
                  aria-label="Time"
                  value={row.time}
                  onChange={(e) => setAgenda(index, "time", e.target.value)}
                />
                <input
                  className={fieldCls}
                  placeholder="What happens"
                  aria-label="Agenda item"
                  value={row.item}
                  onChange={(e) => setAgenda(index, "item", e.target.value)}
                />
                <button
                  aria-label="Remove agenda row"
                  onClick={() =>
                    set(
                      "agenda",
                      draft.agenda.filter((_, i) => i !== index),
                    )
                  }
                  className="rounded-lg px-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => set("agenda", [...draft.agenda, { time: "", item: "" }])}
          >
            <Plus /> Add agenda row
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
