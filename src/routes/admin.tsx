import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { LogOut, Plus, Save, Trash2 } from "lucide-react";
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
        <div className="mx-auto max-w-md border border-border bg-surface p-8">
          <p className="eyebrow text-electric">Elite Forums</p>
          <h1 className="mt-3 text-3xl">Admin sign in</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Use a Supabase account included in the server&apos;s <code>ADMIN_EMAILS</code>{" "}
            allowlist.
          </p>
          <form className="mt-8 space-y-4" onSubmit={signIn}>
            <Input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {authError && <p className="text-sm text-destructive">{authError}</p>}
            <Button className="w-full" variant="brand">
              Sign in
            </Button>
          </form>
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
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow text-electric">Control centre</p>
          <h1 className="mt-3 text-4xl">Admin console</h1>
          <p className="mt-2 text-sm text-muted-foreground">{email}</p>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut /> Sign out
        </Button>
      </div>
      <nav className="mt-10 flex flex-wrap gap-2 border-b border-border pb-3">
        {(["overview", "events", "content", "submissions"] as const).map((item) => (
          <Button
            key={item}
            variant={tab === item ? "brand" : "ghost"}
            onClick={() => setTab(item)}
          >
            {item === "submissions"
              ? `Submissions (${submissionCount})`
              : item[0].toUpperCase() + item.slice(1)}
          </Button>
        ))}
      </nav>
      {message && (
        <p className="mt-5 border border-border bg-surface px-4 py-3 text-sm">{message}</p>
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
    <div className="mt-8 grid gap-5 md:grid-cols-3">
      <Stat label="Managed events" value={events} />
      <Stat label="Form submissions" value={submissions} />
      <Stat label="Editable content records" value={dashboard?.content.length ?? 0} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-surface p-6">
      <p className="text-4xl text-electric">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
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
    <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-3">
        {events.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 border border-border bg-surface p-4"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.date} · {item.published ? "Published" : "Draft"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEvent(item)}>
                Edit
              </Button>
              <Button variant="ghost" size="icon" onClick={() => void removeEvent(item.id)}>
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3 border border-border bg-surface p-6">
        <div className="flex justify-between">
          <h2 className="text-2xl">{event.id ? "Edit event" : "New event"}</h2>
          <Button variant="ghost" size="sm" onClick={() => setEvent(emptyEvent)}>
            <Plus /> New
          </Button>
        </div>
        <Input
          placeholder="Title"
          value={event.title}
          onChange={(e) => field("title", e.target.value)}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="Slug"
            value={event.slug}
            onChange={(e) => field("slug", e.target.value)}
          />
          <Input type="date" value={event.date} onChange={(e) => field("date", e.target.value)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            className="rounded-md border border-input bg-transparent px-3 py-2"
            value={event.type}
            onChange={(e) => field("type", e.target.value)}
          >
            <option>Workshop</option>
            <option>Hackathon</option>
            <option>Founder Connect</option>
            <option>Bootcamp</option>
          </select>
          <select
            className="rounded-md border border-input bg-transparent px-3 py-2"
            value={event.format}
            onChange={(e) => field("format", e.target.value)}
          >
            <option>Online</option>
            <option>In-person</option>
          </select>
        </div>
        <Input
          placeholder="Location"
          value={event.location}
          onChange={(e) => field("location", e.target.value)}
        />
        <Input
          placeholder="City (optional)"
          value={event.city ?? ""}
          onChange={(e) => field("city", e.target.value)}
        />
        <Input
          placeholder="Image URL or /public path"
          value={event.image}
          onChange={(e) => field("image", e.target.value)}
        />
        <Textarea
          placeholder="Summary"
          value={event.summary}
          onChange={(e) => field("summary", e.target.value)}
        />
        <Textarea
          placeholder="Eligibility"
          value={event.eligibility}
          onChange={(e) => field("eligibility", e.target.value)}
        />
        <Input
          placeholder="Organizer"
          value={event.organizer}
          onChange={(e) => field("organizer", e.target.value)}
        />
        <Textarea
          placeholder='Agenda JSON: [{"time":"10:00","item":"Welcome"}]'
          value={JSON.stringify(event.agenda)}
          onChange={(e) => {
            try {
              setEvent({ ...event, agenda: JSON.parse(e.target.value) });
            } catch {
              /* wait for valid JSON */
            }
          }}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={event.published}
            onChange={(e) => field("published", e.target.checked)}
          />{" "}
          Publish this event
        </label>
        <Button variant="brand" onClick={() => void saveEvent()}>
          <Save /> Save event
        </Button>
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
    <div className="mt-8 max-w-3xl space-y-4">
      <p className="text-sm text-muted-foreground">
        Store editable JSON content by key. Site components can consume these records without a code
        deployment.
      </p>
      <Input
        value={contentKey}
        onChange={(e) => setContentKey(e.target.value)}
        placeholder="Content key, e.g. homepage"
      />
      <Textarea
        className="min-h-80 font-mono text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button variant="brand" onClick={() => void save()}>
        <Save /> Save content
      </Button>
    </div>
  );
}

function SubmissionsPanel({
  submissions,
  refresh,
}: {
  submissions: Record<string, Array<Record<string, unknown>>>;
  refresh: () => Promise<void>;
}) {
  return (
    <div className="mt-8 space-y-8">
      {Object.entries(submissions).map(([table, rows]) => (
        <section key={table}>
          <h2 className="text-2xl">{table.replaceAll("_", " ")}</h2>
          <div className="mt-3 overflow-x-auto border border-border">
            <table className="w-full text-left text-sm">
              <tbody>
                {rows.map((row) => (
                  <tr key={String(row.id)} className="border-b border-border align-top">
                    <td className="p-3">
                      {String(
                        row.name ?? row.full_name ?? row.rep_name ?? row.email ?? "Submission",
                      )}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {String(row.email ?? "")}
                      </span>
                    </td>
                    <td className="max-w-md p-3 text-muted-foreground">
                      {Object.entries(row)
                        .filter(([key]) => !["id", "created_at", "email", "status"].includes(key))
                        .map(([key, value]) => (
                          <p key={key}>
                            <b>{key}:</b>{" "}
                            {Array.isArray(value) ? value.join(", ") : String(value ?? "")}
                          </p>
                        ))}
                    </td>
                    <td className="p-3">
                      {row.status ? (
                        <select
                          className="rounded border border-input bg-transparent p-1"
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
                        "registered"
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
    <main className="min-h-screen bg-background px-5 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">{children}</div>
    </main>
  );
}
