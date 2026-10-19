import { createFileRoute, useRouter } from "@tanstack/react-router";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Megaphone,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { CampaignsPanel } from "@/components/admin/CampaignsPanel";
import { ContentPanel } from "@/components/admin/ContentPanel";
import { FormsPanel } from "@/components/admin/FormsPanel";
import type { FormOverrides } from "@/lib/forms";
import { EventsPanel, type AdminEvent } from "@/components/admin/EventsPanel";
import { OverviewPanel } from "@/components/admin/OverviewPanel";
import { SubmissionsPanel } from "@/components/admin/SubmissionsPanel";
import { FORMS, setFormSettings, type FormTable, type Row } from "@/components/admin/submissions";
import { errorMessage, fieldCls } from "@/components/admin/ui";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { getAdminDashboard } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Elite Forums" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPage,
});

type Dashboard = Awaited<ReturnType<typeof getAdminDashboard>>;
type Tab = "overview" | "submissions" | "events" | "content" | "forms" | "campaigns";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "submissions", label: "Submissions", icon: Inbox },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "content", label: "Site content", icon: FileText },
  { id: "forms", label: "Forms", icon: ClipboardList },
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
] as const;

function AdminPage() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  return (
    <div className="min-h-svh bg-background text-foreground">
      {authLoading ? (
        <Centered>
          <Loader2 className="h-5 w-5 animate-spin text-electric" />
        </Centered>
      ) : sessionEmail ? (
        <AdminDashboard email={sessionEmail} />
      ) : (
        <SignIn />
      )}
      <Toaster position="top-right" />
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-svh items-center justify-center px-5">{children}</div>;
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError(authError.message);
    setBusy(false);
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand p-12 text-ink lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-50" />
        <Logo variant="ink" className="relative h-9 self-start" />
        <div className="relative">
          <h1 className="display-xl max-w-md text-5xl xl:text-6xl">
            Run the whole site from here.
          </h1>
          <p className="mt-6 max-w-sm text-sm font-medium leading-6">
            Review applications, publish events and edit every page — without touching code.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-16">
        <form className="w-full max-w-sm" onSubmit={signIn}>
          <Logo className="mb-10 h-8 lg:hidden" />
          <p className="eyebrow text-electric">Admin console</p>
          <h2 className="mt-3 font-display text-3xl font-semibold">Sign in</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Use your approved administrator account.
          </p>
          <label className="mt-8 block space-y-1.5 text-xs font-medium">
            Email
            <input
              type="email"
              className={fieldCls}
              autoComplete="username"
              placeholder="you@eliteforums.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="mt-4 block space-y-1.5 text-xs font-medium">
            Password
            <input
              type="password"
              className={fieldCls}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && (
            <p
              className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm"
              role="alert"
            >
              {error}
            </p>
          )}
          <Button className="mt-6 w-full" size="lg" variant="brand" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"} <ArrowUpRight />
          </Button>
          <a
            href="/"
            className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground"
          >
            Back to the website
          </a>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [table, setTable] = useState<FormTable>(FORMS[0].table);
  const [loadError, setLoadError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setDashboard(await getAdminDashboard());
      setLoadError("");
    } catch (error) {
      setLoadError(errorMessage(error, "Unable to load admin data."));
    } finally {
      setRefreshing(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (!dashboard)
    return (
      <Centered>
        {loadError ? (
          <div className="max-w-md text-center">
            <h1 className="font-display text-2xl font-semibold">You can't open the console.</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{loadError}</p>
            <p className="mt-2 text-xs text-muted-foreground">Signed in as {email}</p>
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="outline" onClick={() => void refresh()}>
                Try again
              </Button>
              <Button variant="ghost" onClick={() => void signOut()}>
                Sign out
              </Button>
            </div>
          </div>
        ) : (
          <Loader2 className="h-5 w-5 animate-spin text-electric" />
        )}
      </Centered>
    );

  const submissions = dashboard.submissions as Record<string, Row[]>;
  const newCount = FORMS.reduce(
    (total, form) =>
      total + (submissions[form.table] ?? []).filter((row) => row["status"] === "new").length,
    0,
  );
  const forms = Object.fromEntries(
    dashboard.content
      .filter((row) => row.key.startsWith("form."))
      .map((row) => [row.key.slice(5), row.value]),
  ) as FormOverrides;
  setFormSettings(forms);
  const saved = Object.fromEntries(
    dashboard.content
      .filter((row) => !row.key.startsWith("form."))
      .map((row) => [
        row.key,
        row.value && typeof row.value === "object" && !Array.isArray(row.value)
          ? (row.value as Record<string, unknown>)
          : {},
      ]),
  );
  const editedPages = Object.values(saved).filter((value) => Object.keys(value).length > 0).length;

  const nav = TABS.map(({ id, label, icon: Icon }) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      aria-current={tab === id ? "page" : undefined}
      className={cn(
        "flex min-h-11 shrink-0 touch-manipulation items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        tab === id
          ? "bg-electric/10 font-medium text-electric"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
      {id === "submissions" && newCount > 0 && (
        <span className="ml-auto rounded-full bg-electric px-1.5 text-xs font-semibold text-ink">
          {newCount}
        </span>
      )}
    </button>
  ));

  return (
    <div className="lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface/60 lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <Logo className="h-7" />
          <span className="rounded-md border border-border px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Admin
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Admin sections">
          {nav}
        </nav>
        <div className="space-y-1 border-t border-border p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" /> View website
          </a>
          <button
            onClick={() => void signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <p className="truncate px-3 pt-2 text-xs text-muted-foreground" title={email}>
            {email}
          </p>
        </div>
      </aside>
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-5">
          <Logo className="h-7" />
          <button
            onClick={() => void signOut()}
            aria-label="Sign out"
            className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2" aria-label="Admin sections">
          {nav}
        </nav>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-10">
        <div className="mb-2 flex justify-end">
          <button
            onClick={() => void refresh().then(() => toast.success("Up to date."))}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-60"
          >
            <RefreshCw className={cn("h-3 w-3", refreshing && "animate-spin")} /> Refresh
          </button>
        </div>
        {tab === "overview" && (
          <OverviewPanel
            email={email}
            events={dashboard.events as AdminEvent[]}
            submissions={submissions}
            editedPages={editedPages}
            openSubmissions={(next) => {
              setTable(next);
              setTab("submissions");
            }}
            openTab={setTab}
          />
        )}
        {tab === "submissions" && (
          <SubmissionsPanel
            submissions={submissions}
            table={table}
            setTable={setTable}
            refresh={refresh}
          />
        )}
        {tab === "events" && (
          <EventsPanel events={dashboard.events as AdminEvent[]} refresh={refresh} />
        )}
        {tab === "content" && (
          <ContentPanel
            saved={saved}
            onSaved={async () => {
              await refresh();
              await router.invalidate();
            }}
          />
        )}
        {tab === "forms" && (
          <FormsPanel
            saved={forms}
            migrated={dashboard.schema?.formAnswers ?? false}
            onSaved={async () => {
              await refresh();
              await router.invalidate();
            }}
          />
        )}
        {tab === "campaigns" && (
          <CampaignsPanel
            events={dashboard.events as AdminEvent[]}
            submissions={submissions}
            forms={forms}
          />
        )}
      </div>
    </div>
  );
}
