import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookMarked,
  CalendarClock,
  ClipboardCheck,
  UserPlus,
} from "lucide-react";
import { Card, PanelHeader, timeAgo } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/lms";
import { Stat } from "../bits";
import type { ManageTab } from "../LmsShell";
import { useLookups, type AdminData } from "./common";

function Shortcut({
  tab,
  icon: Icon,
  title,
  body,
}: {
  tab: ManageTab;
  icon: typeof UserPlus;
  title: string;
  body: string;
}) {
  return (
    <Link
      to="/lms/manage"
      search={{ tab }}
      className="group flex items-start gap-3 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-electric/50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric/10 text-electric">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 font-medium">
          {title}
          <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{body}</span>
      </span>
    </Link>
  );
}

export function OverviewPanel({ data }: { data: AdminData }) {
  const look = useLookups(data);
  const weekAgo = Date.now() - 7 * 86_400_000;
  const activeThisWeek = data.profiles.filter(
    (p) => p.last_seen_at && new Date(p.last_seen_at).getTime() > weekAgo,
  ).length;
  const waiting = data.submissions.filter((s) => s.status === "submitted");
  const upcoming = data.sessions
    .filter((s) => new Date(s.starts_at).getTime() > Date.now() - 3_600_000)
    .slice(0, 5);
  const runningCohorts = data.cohorts.filter((c) => c.status === "active").length;

  return (
    <>
      <PanelHeader
        title="Learning platform"
        description="Learners sign in at /lms with the login you create for them. Everything they see is managed here."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="Learners"
          value={data.profiles.length}
          hint={`${activeThisWeek} active this week`}
        />
        <Stat
          label="Programmes"
          value={data.programs.length}
          hint={`${data.programs.filter((p) => p.published).length} published`}
        />
        <Stat
          label="Cohorts running"
          value={runningCohorts}
          hint={`${data.cohorts.length} in total`}
        />
        <Stat
          label="Certificates"
          value={data.certificates.filter((c) => !c.revoked).length}
          hint={`${waiting.length} assignments to review`}
        />
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Shortcut
          tab="people"
          icon={UserPlus}
          title="Add learners"
          body="One by one or a whole spreadsheet at once."
        />
        <Shortcut
          tab="programmes"
          icon={BookMarked}
          title="Build a programme"
          body="Modules, video lessons, readings and assignments."
        />
        <Shortcut
          tab="cohorts"
          icon={CalendarClock}
          title="Run a cohort"
          body="Dates, learners and live classes for one batch."
        />
        <Shortcut
          tab="certificates"
          icon={Award}
          title="Issue certificates"
          body="To one person or everyone who finished."
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="min-w-0 p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold">
              <ClipboardCheck className="h-4 w-4 text-electric" /> Waiting for review
            </h2>
            <Link
              to="/lms/manage"
              search={{ tab: "reviews" }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Open reviews
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {waiting.slice(0, 6).map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="min-w-0 truncate">
                  {look.profiles.get(s.user_id)?.full_name} ·{" "}
                  <span className="text-muted-foreground">
                    {look.lessons.get(s.lesson_id)?.title}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {timeAgo(s.updated_at)}
                </span>
              </li>
            ))}
            {waiting.length === 0 && (
              <li className="py-2.5 text-sm text-muted-foreground">Nothing waiting.</li>
            )}
          </ul>
        </Card>
        <Card className="min-w-0 p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <CalendarClock className="h-4 w-4 text-electric" /> Upcoming classes
          </h2>
          <ul className="mt-4 divide-y divide-border">
            {upcoming.map((s) => {
              const cohort = look.cohorts.get(s.cohort_id);
              return (
                <li key={s.id} className="py-2.5 text-sm">
                  <p className="truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(s.starts_at)} · {cohort?.name}
                  </p>
                </li>
              );
            })}
            {upcoming.length === 0 && (
              <li className="py-2.5 text-sm text-muted-foreground">No classes scheduled.</li>
            )}
          </ul>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-display text-base font-semibold">Newest learners</h2>
        <ul className="mt-4 divide-y divide-border">
          {data.profiles.slice(0, 6).map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span className="min-w-0 truncate">
                {p.full_name} <span className="text-muted-foreground">· {p.email}</span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {timeAgo(p.created_at)}
              </span>
            </li>
          ))}
          {data.profiles.length === 0 && (
            <li className="py-2.5 text-sm text-muted-foreground">No learners yet.</li>
          )}
        </ul>
      </Card>
    </>
  );
}
