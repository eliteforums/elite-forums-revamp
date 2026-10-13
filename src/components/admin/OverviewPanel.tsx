import { ArrowUpRight, CalendarDays, FileText, Inbox, Sparkles } from "lucide-react";
import { CONTENT_PAGES } from "@/lib/site-content";
import type { AdminEvent } from "./EventsPanel";
import { FORMS, formLabel, rowContext, rowName, type FormTable, type Row } from "./submissions";
import { Card, PanelHeader, Pill, timeAgo } from "./ui";

export function OverviewPanel({
  email,
  events,
  submissions,
  editedPages,
  openSubmissions,
  openTab,
}: {
  email: string;
  events: AdminEvent[];
  submissions: Record<string, Row[]>;
  editedPages: number;
  openSubmissions: (table: FormTable) => void;
  openTab: (tab: "events" | "content") => void;
}) {
  const everything = FORMS.flatMap((form) =>
    (submissions[form.table] ?? []).map((row) => ({ table: form.table, row })),
  );
  const fresh = everything.filter(({ row }) => row["status"] === "new");
  const latest = [...everything]
    .sort((a, b) => String(b.row["created_at"]).localeCompare(String(a.row["created_at"])))
    .slice(0, 6);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const stats = [
    {
      icon: Sparkles,
      label: "Awaiting review",
      value: fresh.length,
      detail: "Submissions marked new",
    },
    {
      icon: Inbox,
      label: "Total submissions",
      value: everything.length,
      detail: "Across all forms",
    },
    {
      icon: CalendarDays,
      label: "Upcoming events",
      value: upcoming.length,
      detail: `${events.filter((event) => !event.published).length} in draft`,
    },
    {
      icon: FileText,
      label: "Pages customised",
      value: editedPages,
      detail: `of ${CONTENT_PAGES.length} editable pages`,
    },
  ];

  return (
    <>
      <PanelHeader title={`${greeting}.`} description={`Signed in as ${email}.`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, detail }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm">{label}</span>
              <Icon className="h-4 w-4 text-electric" />
            </div>
            <p className="mt-4 font-display text-4xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display font-semibold">Latest submissions</h2>
            <button
              className="inline-flex items-center gap-1 text-sm text-electric hover:underline"
              onClick={() => openSubmissions(latest[0]?.table ?? FORMS[0].table)}
            >
              Open inbox <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {latest.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No submissions yet. They will show up here as people fill in the site's forms.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {latest.map(({ table, row }) => (
                <li key={`${table}-${String(row["id"])}`}>
                  <button
                    onClick={() => openSubmissions(table)}
                    className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-accent/40"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-electric/10 text-sm font-semibold text-electric">
                      {rowName(row).charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{rowName(row)}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {formLabel(table)}
                        {rowContext(table, row) && ` · ${rowContext(table, row)}`}
                      </span>
                    </span>
                    <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                      {timeAgo(row["created_at"])}
                    </span>
                    {typeof row["status"] === "string" && (
                      <Pill tone={row["status"]}>{row["status"]}</Pill>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display font-semibold">Upcoming events</h2>
              <button
                className="inline-flex items-center gap-1 text-sm text-electric hover:underline"
                onClick={() => openTab("events")}
              >
                Manage <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
            {upcoming.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                Nothing scheduled.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {upcoming.slice(0, 4).map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center justify-between gap-3 px-5 py-3.5"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{event.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {new Date(event.date + "T12:00:00").toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                        })}{" "}
                        · {event.type}
                      </span>
                    </span>
                    <Pill tone={event.published ? "live" : "draft"}>
                      {event.published ? "Live" : "Draft"}
                    </Pill>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card className="p-5">
            <h2 className="font-display font-semibold">Edit the website</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Change headlines, paragraphs, programme details, articles and photos on any page.
            </p>
            <button
              className="mt-4 inline-flex items-center gap-1 text-sm text-electric hover:underline"
              onClick={() => openTab("content")}
            >
              Open site content <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </Card>
        </div>
      </div>
    </>
  );
}
