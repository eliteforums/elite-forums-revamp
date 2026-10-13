import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  FileJson,
  Inbox,
  LayoutDashboard,
  LogOut,
  Plus,
  Save,
  Search,
  Settings2,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  deleteAdminEvent,
  getAdminDashboard,
  saveAdminEvent,
  saveSiteContent,
  updateSubmissionStatus,
} from "@/lib/admin.functions";
import { answerLabel, programLabel } from "@/lib/program-application";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Dashboard = Awaited<ReturnType<typeof getAdminDashboard>>;
type AdminEvent = Dashboard["events"][number];
type EventDraft = Omit<AdminEvent, "id" | "created_at" | "updated_at"> & { id?: string };

const emptyEvent: EventDraft = {
  slug: "",
  type: "Workshop",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  format: "Online",
  city: "",
  location: "",
  summary: "",
  image: "/elite-forums-logo-dark.png",
  agenda: [],
  eligibility: "",
  organizer: "Elite Forums",
  published: true,
};

function AdminPage() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSessionEmail(data.session?.user.email ?? null);
        setAuthLoading(false);
      }
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSessionEmail(nextSession?.user.email ?? null);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  }

  if (authLoading)
    return (
      <AdminShell>
        <p className="text-muted-foreground">Checking authentication…</p>
      </AdminShell>
    );
  if (!sessionEmail) {
    return (
      <AdminShell>
        <div className="admin-auth-grid overflow-hidden rounded-[2rem] border border-border bg-surface shadow-glow">
          <div className="relative hidden min-h-[34rem] overflow-hidden bg-brand p-10 text-ink md:flex md:flex-col md:justify-between">
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-50" />
            <div className="relative">
              <p className="eyebrow">Elite Forums / Studio</p>
              <h1 className="display-xl mt-12 max-w-md text-6xl">Shape what comes next.</h1>
            </div>
            <p className="relative max-w-sm text-sm font-medium">
              Your command centre for events, stories, partnerships and the people building with us.
            </p>
          </div>
          <div className="p-7 sm:p-12">
            <p className="eyebrow text-electric">Private workspace</p>
            <h2 className="mt-3 text-3xl">Welcome back.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Sign in with an approved Supabase administrator account.
            </p>
            <form className="mt-9 space-y-4" onSubmit={signIn}>
              <label className="block space-y-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
                <Input
                  type="email"
                  placeholder="admin@eliteforums.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="block space-y-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Password
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              {authError && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {authError}
                </p>
              )}
              <Button className="mt-3 w-full" size="lg" variant="brand">
                Enter workspace <ArrowUpRight />
              </Button>
            </form>
          </div>
        </div>
      </AdminShell>
    );
  }
  return <AdminDashboard email={sessionEmail} />;
}

function AdminDashboard({ email }: { email: string }) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [event, setEvent] = useState<EventDraft>(emptyEvent);
  const [contentKey, setContentKey] = useState("homepage");
  const [contentValue, setContentValue] = useState("{}");
  const [tab, setTab] = useState<"overview" | "events" | "content" | "submissions">("overview");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const data = await getAdminDashboard();
      setDashboard(data);
      const homepage = data.content.find((item) => item.key === "homepage");
      if (homepage) setContentValue(JSON.stringify(homepage.value, null, 2));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void refresh();
  }, []);

  const submissionCount = useMemo(
    () =>
      Object.values(dashboard?.submissions ?? {}).reduce((total, rows) => total + rows.length, 0),
    [dashboard],
  );

  async function saveEvent() {
    setMessage("");
    try {
      await saveAdminEvent({ data: { ...event, city: event.city || undefined } });
      setMessage("Event saved.");
      setEvent(emptyEvent);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save event.");
    }
  }

  async function removeEvent(id: string) {
    if (!window.confirm("Delete this event?")) return;
    await deleteAdminEvent({ data: { id } });
    await refresh();
  }

  async function saveContent() {
    try {
      const value = JSON.parse(contentValue) as Record<string, unknown>;
      await saveSiteContent({ data: { key: contentKey, value } });
      setMessage("Content saved.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Content must be valid JSON.");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (loading && !dashboard)
    return (
      <AdminShell>
        <p className="text-muted-foreground">Loading admin console…</p>
      </AdminShell>
    );
  return (
    <AdminShell>
      <div className="admin-topbar flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="eyebrow text-electric">Elite Forums / Studio</p>
          <h1 className="display-xl mt-3 text-4xl md:text-5xl">Good morning.</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{email}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <Button variant="outline" size="icon" aria-label="Sign out" onClick={signOut}>
            <LogOut />
          </Button>
        </div>
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <nav className="admin-sidebar">
          <p className="eyebrow mb-3 hidden px-3 text-muted-foreground lg:block">Workspace</p>
          {(
            [
              ["overview", "Overview", LayoutDashboard],
              ["events", "Events", CalendarDays],
              ["content", "Site content", FileJson],
              ["submissions", "Submissions", Inbox],
            ] as const
          ).map(([item, label, Icon]) => (
            <button
              key={item}
              className={`admin-nav-item ${tab === item ? "is-active" : ""}`}
              onClick={() => setTab(item)}
            >
              <Icon />
              <span>{label}</span>
              {item === "submissions" && <span className="ml-auto text-xs">{submissionCount}</span>}
            </button>
          ))}
          <div className="mt-8 hidden border-t border-border px-3 pt-5 text-xs leading-5 text-muted-foreground lg:block">
            <Settings2 className="mb-3 h-4 w-4 text-electric" />
            Changes publish directly to the live experience.
          </div>
        </nav>
        <div className="min-w-0">
          {message && (
            <p className="mb-5 flex items-center gap-2 rounded-xl border border-electric/30 bg-electric/10 px-4 py-3 text-sm text-foreground">
              <CheckCircle2 className="h-4 w-4 text-electric" /> {message}
            </p>
          )}
          {tab === "overview" && <Overview dashboard={dashboard} />}
          {tab === "events" && (
            <EventsPanel
              events={dashboard?.events ?? []}
              event={event}
              setEvent={setEvent}
              saveEvent={saveEvent}
              removeEvent={removeEvent}
            />
          )}
          {tab === "content" && (
            <ContentPanel
              contentKey={contentKey}
              setContentKey={setContentKey}
              value={contentValue}
              setValue={setContentValue}
              save={saveContent}
            />
          )}
          {tab === "submissions" && (
            <SubmissionsPanel submissions={dashboard?.submissions ?? {}} refresh={refresh} />
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function Overview({ dashboard }: { dashboard: Dashboard | null }) {
  const events = dashboard?.events.length ?? 0;
  const submissions = Object.values(dashboard?.submissions ?? {}).reduce(
    (total, rows) => total + rows.length,
    0,
  );
  return (
    <div className="admin-content mt-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-electric">At a glance</p>
          <h2 className="mt-2 text-3xl">The whole picture.</h2>
        </div>
        <p className="hidden text-sm text-muted-foreground sm:block">Live workspace overview</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat
          icon={CalendarDays}
          label="Managed events"
          value={events}
          detail="Published and drafts"
        />
        <Stat
          icon={Users}
          label="Form submissions"
          value={submissions}
          detail="Across all channels"
        />
        <Stat
          icon={FileJson}
          label="Content records"
          value={dashboard?.content.length ?? 0}
          detail="Editable site data"
        />
      </div>
      <div className="mt-5 rounded-2xl border border-border bg-surface p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-electric">Next move</p>
            <h3 className="mt-2 text-2xl">Keep the community moving.</h3>
            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              Create the next experience, review incoming interest, and keep every public touchpoint
              current.
            </p>
          </div>
          <ArrowUpRight className="hidden h-6 w-6 text-electric sm:block" />
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 transition-transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-electric" />
        <span className="text-xs text-muted-foreground">Live</span>
      </div>
      <p className="mt-8 text-5xl font-medium tracking-tight text-foreground">{value}</p>
      <p className="mt-2 font-medium">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function EventsPanel({
  events,
  event,
  setEvent,
  saveEvent,
  removeEvent,
}: {
  events: AdminEvent[];
  event: EventDraft;
  setEvent: (event: EventDraft) => void;
  saveEvent: () => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
}) {
  const field = (key: keyof EventDraft, value: string | boolean) =>
    setEvent({ ...event, [key]: value });
  return (
    <div className="admin-content mt-8 grid gap-8 xl:grid-cols-[1fr_1.05fr]">
      <div>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="eyebrow text-electric">Your calendar</p>
            <h2 className="mt-2 text-2xl">Events</h2>
          </div>
          <span className="text-sm text-muted-foreground">{events.length} total</span>
        </div>
        <div className="space-y-3">
          {events.map((item) => (
            <div
              key={item.id}
              className="admin-list-row group flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-ink sm:flex">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.date} · {item.type}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`admin-status ${item.published ? "is-live" : ""}`}>
                  {item.published ? "Live" : "Draft"}
                </span>
                <Button variant="outline" size="sm" onClick={() => setEvent(item)}>
                  Edit
                </Button>
                <Button variant="ghost" size="icon" onClick={() => void removeEvent(item.id)}>
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No managed events yet. Create the first one here.
            </div>
          )}
        </div>
      </div>
      <div className="admin-editor rounded-2xl border border-border bg-surface p-5 sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="eyebrow text-electric">Event editor</p>
            <h2 className="mt-2 text-2xl">{event.id ? "Edit event" : "Create an event"}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setEvent(emptyEvent)}>
            <Plus /> New
          </Button>
        </div>
        <div className="space-y-4">
          <label className="admin-field">
            Title
            <Input
              placeholder="The event title"
              value={event.title}
              onChange={(e) => field("title", e.target.value)}
            />
          </label>
          <label className="admin-field">
            Slug
            <Input
              placeholder="campus-build-weekend"
              value={event.slug}
              onChange={(e) => field("slug", e.target.value)}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="admin-field">
              Date
              <Input
                type="date"
                value={event.date}
                onChange={(e) => field("date", e.target.value)}
              />
            </label>
            <label className="admin-field">
              Format
              <select
                className="admin-select"
                value={event.format}
                onChange={(e) => field("format", e.target.value)}
              >
                <option>Online</option>
                <option>In-person</option>
              </select>
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="admin-field">
              Type
              <select
                className="admin-select"
                value={event.type}
                onChange={(e) => field("type", e.target.value)}
              >
                <option>Workshop</option>
                <option>Hackathon</option>
                <option>Founder Connect</option>
                <option>Bootcamp</option>
              </select>
            </label>
            <label className="admin-field">
              Location
              <Input
                placeholder="Partner campus or online"
                value={event.location}
                onChange={(e) => field("location", e.target.value)}
              />
            </label>
          </div>
          <label className="admin-field">
            City (optional)
            <Input
              placeholder="Mumbai"
              value={event.city ?? ""}
              onChange={(e) => field("city", e.target.value)}
            />
          </label>
          <label className="admin-field">
            Image URL or public path
            <Input
              placeholder="/elite-forums-logo-dark.png"
              value={event.image}
              onChange={(e) => field("image", e.target.value)}
            />
          </label>
          <label className="admin-field">
            Summary
            <Textarea
              placeholder="A concise description of the experience"
              value={event.summary}
              onChange={(e) => field("summary", e.target.value)}
            />
          </label>
          <label className="admin-field">
            Eligibility
            <Textarea
              placeholder="Who should attend?"
              value={event.eligibility}
              onChange={(e) => field("eligibility", e.target.value)}
            />
          </label>
          <label className="admin-field">
            Organizer
            <Input
              placeholder="Elite Forums"
              value={event.organizer}
              onChange={(e) => field("organizer", e.target.value)}
            />
          </label>
          <label className="admin-field">
            Agenda JSON
            <Textarea
              className="font-mono text-xs"
              placeholder='[{"time":"10:00","item":"Welcome"}]'
              value={JSON.stringify(event.agenda)}
              onChange={(e) => {
                try {
                  setEvent({ ...event, agenda: JSON.parse(e.target.value) });
                } catch {
                  /* wait for valid JSON */
                }
              }}
            />
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-border px-3 py-3 text-sm">
            <input
              type="checkbox"
              checked={event.published}
              onChange={(e) => field("published", e.target.checked)}
            />{" "}
            Publish this event
          </label>
          <Button className="w-full" size="lg" variant="brand" onClick={() => void saveEvent()}>
            <Save /> Save event
          </Button>
        </div>
      </div>
    </div>
  );
}

function ContentPanel({
  contentKey,
  setContentKey,
  value,
  setValue,
  save,
}: {
  contentKey: string;
  setContentKey: (value: string) => void;
  value: string;
  setValue: (value: string) => void;
  save: () => Promise<void>;
}) {
  return (
    <div className="admin-content mt-8">
      <div className="mb-7">
        <p className="eyebrow text-electric">Content studio</p>
        <h2 className="mt-2 text-3xl">Edit your voice.</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Manage structured content records that can be connected to any public page without
          changing the design system.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <FileJson className="h-5 w-5 text-electric" />
          <p className="font-medium">JSON content record</p>
        </div>
        <div className="grid gap-4">
          <label className="admin-field">
            Record key
            <Input
              value={contentKey}
              onChange={(e) => setContentKey(e.target.value)}
              placeholder="homepage"
            />
          </label>
          <label className="admin-field">
            Value
            <Textarea
              className="min-h-80 font-mono text-sm leading-6"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </label>
        </div>
        <div className="mt-5 flex justify-end">
          <Button variant="brand" onClick={() => void save()}>
            <Save /> Save content
          </Button>
        </div>
      </div>
    </div>
  );
}

const showValue = (value: unknown) =>
  Array.isArray(value)
    ? value.join(", ")
    : typeof value === "boolean"
      ? value
        ? "Yes"
        : "No"
      : String(value ?? "");

/** Label/value pairs for one submission; programme answers are shown under their question text. */
function submissionDetails(row: Record<string, unknown>): Array<[string, string]> {
  const details: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(row)) {
    if (["id", "created_at", "email", "status"].includes(key)) continue;
    if (key === "program") details.push([key, programLabel(String(value))]);
    else if (key === "answers" && value && typeof value === "object" && !Array.isArray(value)) {
      for (const [answerKey, answer] of Object.entries(value))
        details.push([answerLabel(String(row["program"]), answerKey), showValue(answer)]);
    } else details.push([key, showValue(value)]);
  }
  return details;
}

function SubmissionsPanel({
  submissions,
  refresh,
}: {
  submissions: Record<string, Array<Record<string, unknown>>>;
  refresh: () => Promise<void>;
}) {
  return (
    <div className="admin-content mt-8 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-electric">Inbox</p>
          <h2 className="mt-2 text-3xl">People reaching out.</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground">
          <Search className="h-3.5 w-3.5" /> Showing latest submissions
        </div>
      </div>
      {Object.entries(submissions).map(([table, rows]) => (
        <section key={table}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xl capitalize">{table.replaceAll("_", " ")}</h3>
            <span className="text-xs text-muted-foreground">{rows.length} records</span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Details</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={String(row.id)}
                    className="border-b border-border align-top last:border-0"
                  >
                    <td className="min-w-48 p-4">
                      {String(
                        row.name ?? row.full_name ?? row.rep_name ?? row.email ?? "Submission",
                      )}
                      <br />
                      <span className="mt-1 inline-block text-xs text-muted-foreground">
                        {String(row.email ?? "")}
                      </span>
                    </td>
                    <td className="max-w-md p-4 text-xs leading-5 text-muted-foreground">
                      {submissionDetails(row).map(([label, value]) => (
                        <p key={label}>
                          <b>{label}:</b> {value}
                        </p>
                      ))}
                    </td>
                    <td className="whitespace-nowrap p-4">
                      {row.status ? (
                        <select
                          className="admin-select min-w-28 !px-2 !py-1 text-xs"
                          value={String(row.status)}
                          onChange={async (e) => {
                            await updateSubmissionStatus({
                              data: {
                                table: table as never,
                                id: String(row.id),
                                status: e.target.value as never,
                              },
                            });
                            await refresh();
                          }}
                        >
                          <option>new</option>
                          <option>reviewing</option>
                          <option>contacted</option>
                          <option>closed</option>
                        </select>
                      ) : (
                        <span className="admin-status is-live">registered</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-5 py-24 md:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_75%_0%,color-mix(in_oklab,var(--electric)_14%,transparent),transparent_52%)]" />
      <div className="mx-auto max-w-7xl">{children}</div>
    </main>
  );
}
