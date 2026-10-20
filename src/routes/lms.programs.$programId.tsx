import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  MessageCircle,
  PlayCircle,
  Video,
} from "lucide-react";
import { useState } from "react";
import { Card, Empty, Pill } from "@/components/admin/ui";
import { LESSON_ICONS, Loading, LoadError, ProgressBar, minutes } from "@/components/lms/bits";
import { useLmsProgram } from "@/components/lms/session";
import { Markdown } from "@/components/site/Markdown";
import { Button } from "@/components/ui/button";
import {
  LESSON_KIND_LABELS,
  PROGRAM_KIND_LABELS,
  SUBMISSION_LABELS,
  cohortDates,
  formatDate,
  formatDateTime,
  percent,
} from "@/lib/lms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lms/programs/$programId")({
  component: ProgramPage,
});

const TABS = [
  { id: "curriculum", label: "Curriculum" },
  { id: "schedule", label: "Schedule" },
  { id: "updates", label: "Announcements" },
  { id: "about", label: "About" },
] as const;

const SUBMISSION_TONE = { submitted: "reviewing", approved: "live", changes_requested: "warning" };

function ProgramPage() {
  const { programId } = Route.useParams();
  const query = useLmsProgram(programId);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("curriculum");

  if (query.isPending) return <Loading />;
  if (query.isError) return <LoadError error={query.error} retry={() => void query.refetch()} />;
  const { program, modules, lessons, completed, submissions, cohort, sessions, announcements } =
    query.data;
  const done = new Set(completed);
  const doneCount = lessons.filter((lesson) => done.has(lesson.id)).length;
  const progress = percent(doneCount, lessons.length);
  const next = lessons.find((lesson) => !done.has(lesson.id)) ?? lessons[0];
  const now = Date.now();
  const upcoming = sessions.filter(
    (s) => new Date(s.starts_at).getTime() + s.duration_minutes * 60_000 >= now,
  );
  const past = sessions.filter((s) => !upcoming.includes(s)).reverse();

  return (
    <>
      <Link
        to="/lms"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="p-6 md:p-8">
            <p className="text-xs text-muted-foreground">
              {PROGRAM_KIND_LABELS[program.kind]}
              {cohort && ` · ${cohort.name}`}
              {!program.published && " · Draft (only admins can see it)"}
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-4xl">
              {program.title}
            </h1>
            {program.summary && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                {program.summary}
              </p>
            )}
            <div className="mt-6 max-w-md">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>
                  {doneCount} of {lessons.length} lessons complete
                </span>
                <span className="font-medium text-foreground">{progress}%</span>
              </div>
              <ProgressBar value={progress} />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {next && (
                <Button asChild variant="brand">
                  <Link
                    to="/lms/programs/$programId/lessons/$lessonId"
                    params={{ programId, lessonId: next.id }}
                  >
                    {doneCount === 0 ? "Start learning" : progress === 100 ? "Review" : "Continue"}
                    <ArrowRight />
                  </Link>
                </Button>
              )}
              {cohort?.meeting_url && (
                <Button asChild variant="outline">
                  <a href={cohort.meeting_url} target="_blank" rel="noopener noreferrer">
                    <Video /> Class link
                  </a>
                </Button>
              )}
              {cohort?.community_url && (
                <Button asChild variant="outline">
                  <a href={cohort.community_url} target="_blank" rel="noopener noreferrer">
                    <MessageCircle /> Cohort group
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="relative hidden min-h-48 bg-brand-soft md:block">
            {program.cover_image ? (
              <img src={program.cover_image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 grid-lines opacity-60" />
            )}
          </div>
        </div>
        {cohort && cohortDates(cohort) && (
          <div className="border-t border-border px-6 py-3 text-xs text-muted-foreground md:px-8">
            {cohort.name}: {cohortDates(cohort)}
          </div>
        )}
      </Card>

      <div
        className="mt-8 flex gap-1 overflow-x-auto border-b border-border"
        role="tablist"
        aria-label="Programme sections"
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "-mb-px min-h-11 shrink-0 border-b-2 px-4 text-sm transition-colors",
              tab === id
                ? "border-electric font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
            {id === "schedule" && upcoming.length > 0 && (
              <span className="ml-1.5 rounded-full bg-electric/15 px-1.5 text-xs text-electric">
                {upcoming.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "curriculum" &&
          (lessons.length === 0 ? (
            <Empty title="No lessons yet">The curriculum is being prepared.</Empty>
          ) : (
            <div className="space-y-4">
              {modules.map((module, index) => {
                const moduleLessons = lessons.filter((lesson) => lesson.module_id === module.id);
                if (!moduleLessons.length) return null;
                const moduleDone = moduleLessons.filter((lesson) => done.has(lesson.id)).length;
                return (
                  <Card key={module.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Module {index + 1}</p>
                        <h2 className="mt-0.5 font-display text-base font-semibold">
                          {module.title}
                        </h2>
                        {module.summary && (
                          <p className="mt-1 text-sm text-muted-foreground">{module.summary}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {moduleDone}/{moduleLessons.length} done
                      </span>
                    </div>
                    <ul className="divide-y divide-border">
                      {moduleLessons.map((lesson) => {
                        const Icon = LESSON_ICONS[lesson.kind];
                        const submission = submissions.find((s) => s.lesson_id === lesson.id);
                        return (
                          <li key={lesson.id}>
                            <Link
                              to="/lms/programs/$programId/lessons/$lessonId"
                              params={{ programId, lessonId: lesson.id }}
                              className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-accent/40"
                            >
                              {done.has(lesson.id) ? (
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-electric" />
                              ) : (
                                <Circle className="h-5 w-5 shrink-0 text-muted-foreground/50" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{lesson.title}</p>
                                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Icon className="h-3.5 w-3.5" />
                                  {LESSON_KIND_LABELS[lesson.kind]}
                                  {lesson.duration_minutes
                                    ? ` · ${minutes(lesson.duration_minutes)}`
                                    : ""}
                                  {!lesson.published && " · Draft"}
                                </p>
                              </div>
                              {submission && (
                                <Pill tone={SUBMISSION_TONE[submission.status]}>
                                  {SUBMISSION_LABELS[submission.status]}
                                </Pill>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </Card>
                );
              })}
            </div>
          ))}

        {tab === "schedule" &&
          (sessions.length === 0 ? (
            <Empty title="No live classes scheduled">
              {cohort
                ? "Your cohort's classes will appear here."
                : "This programme is self-paced, so there are no live classes."}
            </Empty>
          ) : (
            <div className="space-y-8">
              {upcoming.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-medium text-muted-foreground">Coming up</h2>
                  {upcoming.map((session) => (
                    <Card key={session.id} className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-electric">
                            {formatDateTime(session.starts_at)} ·{" "}
                            {minutes(session.duration_minutes)}
                          </p>
                          <p className="mt-1 font-medium">{session.title}</p>
                          {session.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {session.description}
                            </p>
                          )}
                        </div>
                        {(session.meeting_url || cohort?.meeting_url) && (
                          <Button asChild size="sm" variant="brand">
                            <a
                              href={session.meeting_url || cohort!.meeting_url!}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Video /> Join class
                            </a>
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              {past.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-medium text-muted-foreground">Past classes</h2>
                  {past.map((session) => (
                    <Card key={session.id} className="flex flex-wrap items-center gap-3 p-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{session.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(session.starts_at)}
                        </p>
                      </div>
                      {session.recording_url ? (
                        <Button asChild size="sm" variant="outline">
                          <a href={session.recording_url} target="_blank" rel="noopener noreferrer">
                            <PlayCircle /> Recording
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">No recording</span>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}

        {tab === "updates" &&
          (announcements.length === 0 ? (
            <Empty title="No announcements yet" />
          ) : (
            <div className="space-y-3">
              {announcements.map((item) => (
                <Card key={item.id} className="p-5">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(item.created_at)}
                  </p>
                  {item.body && <Markdown text={item.body} className="mt-3 text-sm" />}
                </Card>
              ))}
            </div>
          ))}

        {tab === "about" && (
          <Card className="p-6 md:p-8">
            {program.description ? (
              <Markdown text={program.description} />
            ) : (
              <p className="text-sm text-muted-foreground">
                {program.summary || "No description."}
              </p>
            )}
            {cohort?.notes && (
              <div className="mt-8 border-t border-border pt-6">
                <h2 className="font-display text-base font-semibold">About your cohort</h2>
                <Markdown text={cohort.notes} className="mt-3 text-sm" />
              </div>
            )}
            {cohort?.community_url && (
              <a
                href={cohort.community_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-electric hover:underline"
              >
                Join your cohort group <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
