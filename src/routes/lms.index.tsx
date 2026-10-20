import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  CalendarClock,
  CheckCircle2,
  Megaphone,
  Pin,
  Video,
} from "lucide-react";
import { useMemo } from "react";
import { Card, Empty } from "@/components/admin/ui";
import { Loading, LoadError, PageHeading, ProgressBar, Stat } from "@/components/lms/bits";
import { useLmsHome, useLmsMe } from "@/components/lms/session";
import { Markdown } from "@/components/site/Markdown";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/content-context";
import {
  PROGRAM_KIND_LABELS,
  certificatePath,
  cohortDates,
  formatDate,
  formatDateTime,
  orderLessons,
  percent,
} from "@/lib/lms";

export const Route = createFileRoute("/lms/")({
  component: LmsHome,
});

function LmsHome() {
  const me = useLmsMe();
  const c = useContent("lms");
  const home = useLmsHome();

  const programmes = useMemo(() => {
    if (!home.data) return [];
    const { programs, modules, lessons, progress, enrollments, cohorts } = home.data;
    const done = new Set(progress.map((row) => row.lesson_id));
    return programs.map((program) => {
      const ordered = orderLessons(
        modules.filter((m) => m.program_id === program.id),
        lessons.filter((l) => l.program_id === program.id),
      );
      const completed = ordered.filter((lesson) => done.has(lesson.id)).length;
      const enrollment = enrollments.find((row) => row.program_id === program.id);
      return {
        program,
        total: ordered.length,
        completed,
        progress: percent(completed, ordered.length),
        next: ordered.find((lesson) => !done.has(lesson.id)) ?? null,
        cohort: cohorts.find((row) => row.id === enrollment?.cohort_id) ?? null,
      };
    });
  }, [home.data]);

  if (home.isPending) return <Loading />;
  if (home.isError) return <LoadError error={home.error} retry={() => void home.refetch()} />;
  const { sessions, announcements, certificates, cohorts, programs } = home.data;
  const firstName = me.profile?.full_name.split(/\s+/)[0];
  const lessonsDone = programmes.reduce((sum, row) => sum + row.completed, 0);
  const previewing = me.isAdmin && !me.profile;

  return (
    <>
      <PageHeading
        eyebrow={new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
        title={`${c.t("home.welcome")}${firstName ? `, ${firstName}` : ""}`}
        description={c.t("home.intro")}
        actions={
          me.isAdmin ? (
            <Button asChild variant="outline" size="sm">
              <Link to="/lms/manage" search={{ tab: "overview" }}>
                Manage the LMS
              </Link>
            </Button>
          ) : null
        }
      />

      {previewing && (
        <p className="mb-6 rounded-xl border border-cyan/30 bg-cyan/5 px-4 py-3 text-sm text-muted-foreground">
          You're signed in as an administrator, so every programme is shown as a preview. Progress
          is only saved for learner accounts.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Programmes" value={programmes.length} />
        <Stat label="Lessons completed" value={lessonsDone} />
        <Stat label="Upcoming classes" value={sessions.length} />
        <Stat label="Certificates" value={certificates.length} />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold">Continue learning</h2>
        {programmes.length === 0 ? (
          <div className="mt-4">
            <Empty title={c.t("home.emptyTitle")}>
              {c.t("home.emptyBody")}{" "}
              <a className="underline hover:text-foreground" href={`mailto:${c.t("help.email")}`}>
                {c.t("help.email")}
              </a>
            </Empty>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {programmes.map(({ program, total, completed, progress, next, cohort }) => (
              <Card key={program.id} className="flex flex-col overflow-hidden">
                <Link
                  to="/lms/programs/$programId"
                  params={{ programId: program.id }}
                  className="group relative block h-32 overflow-hidden bg-brand-soft"
                >
                  {program.cover_image ? (
                    <img
                      src={program.cover_image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 grid-lines opacity-60" />
                  )}
                  {!program.published && (
                    <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2 py-0.5 text-[0.68rem] font-semibold uppercase">
                      Draft
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs text-muted-foreground">
                    {PROGRAM_KIND_LABELS[program.kind]}
                    {cohort && ` · ${cohort.name}`}
                  </p>
                  <Link
                    to="/lms/programs/$programId"
                    params={{ programId: program.id }}
                    className="mt-1 font-display text-lg font-semibold leading-snug hover:text-electric"
                  >
                    {program.title}
                  </Link>
                  {cohort && cohortDates(cohort) && (
                    <p className="mt-1 text-xs text-muted-foreground">{cohortDates(cohort)}</p>
                  )}
                  <div className="mt-auto pt-5">
                    <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                      <span>
                        {completed} of {total} lessons
                      </span>
                      <span className="font-medium text-foreground">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} label={`${program.title} progress`} />
                    {next ? (
                      <Button
                        asChild
                        variant="brand"
                        size="sm"
                        className="mt-4 w-full max-w-full sm:w-auto"
                      >
                        <Link
                          to="/lms/programs/$programId/lessons/$lessonId"
                          params={{ programId: program.id, lessonId: next.id }}
                        >
                          <span className="truncate">
                            {completed ? "Continue" : "Start"}: {next.title}
                          </span>
                          <ArrowRight />
                        </Link>
                      </Button>
                    ) : total > 0 ? (
                      <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-electric">
                        <CheckCircle2 className="h-4 w-4" /> All lessons complete
                      </p>
                    ) : (
                      <p className="mt-4 text-sm text-muted-foreground">
                        Lessons will appear here soon.
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="min-w-0">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <CalendarClock className="h-4 w-4 text-electric" /> Upcoming classes
          </h2>
          <div className="mt-4 space-y-3">
            {sessions.length === 0 ? (
              <Empty title="No classes scheduled">New live sessions will show up here.</Empty>
            ) : (
              sessions.map((session) => {
                const cohort = cohorts.find((row) => row.id === session.cohort_id);
                const program = programs.find((row) => row.id === cohort?.program_id);
                const start = new Date(session.starts_at);
                const live =
                  Date.now() >= start.getTime() - 15 * 60_000 &&
                  Date.now() <= start.getTime() + session.duration_minutes * 60_000;
                return (
                  <Card key={session.id} className="flex items-center gap-4 p-4">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-background">
                      <span className="text-[0.65rem] font-semibold uppercase text-electric">
                        {start.toLocaleDateString("en-IN", { month: "short" })}
                      </span>
                      <span className="font-display text-xl font-semibold leading-none">
                        {start.getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{session.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {formatDateTime(session.starts_at)}
                        {program && ` · ${program.title}`}
                      </p>
                    </div>
                    {(session.meeting_url || cohort?.meeting_url) && (
                      <Button asChild size="sm" variant={live ? "brand" : "outline"}>
                        <a
                          href={session.meeting_url || cohort!.meeting_url!}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Video /> {live ? "Join now" : "Join"}
                        </a>
                      </Button>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </section>

        <section className="min-w-0">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Megaphone className="h-4 w-4 text-electric" /> Announcements
          </h2>
          <div className="mt-4 space-y-3">
            {announcements.length === 0 ? (
              <Empty title="Nothing new">Updates from the team will appear here.</Empty>
            ) : (
              [...announcements]
                .sort((a, b) => Number(b.pinned) - Number(a.pinned))
                .map((item) => (
                  <Card key={item.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{item.title}</p>
                      {item.pinned && <Pin className="h-4 w-4 shrink-0 text-electric" />}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(item.created_at)}
                      {item.program_id &&
                        ` · ${programs.find((p) => p.id === item.program_id)?.title ?? ""}`}
                    </p>
                    {item.body && <Markdown text={item.body} className="mt-3 text-sm" />}
                  </Card>
                ))
            )}
          </div>
        </section>
      </div>

      {certificates.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Award className="h-4 w-4 text-electric" /> Your certificates
            </h2>
            <Link
              to="/lms/certificates"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              See all
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.slice(0, 3).map((cert) => (
              <a
                key={cert.id}
                href={certificatePath(cert.serial)}
                className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-electric/50"
              >
                <Award className="h-5 w-5 text-electric" />
                <p className="mt-3 font-medium">{cert.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {cert.program_title ?? "Elite Forums"} · {formatDate(cert.issued_on)}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
