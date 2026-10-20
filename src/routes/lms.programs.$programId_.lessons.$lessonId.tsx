import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  FileText,
  Loader2,
  Radio,
  Send,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Card, FieldLabel, Pill, fieldCls } from "@/components/admin/ui";
import { LESSON_ICONS, Loading, LoadError, VideoPlayer, minutes } from "@/components/lms/bits";
import { lmsError, lmsKeys, useLmsProgram, type LmsProgramData } from "@/components/lms/session";
import { Markdown } from "@/components/site/Markdown";
import { Button } from "@/components/ui/button";
import {
  LESSON_KIND_LABELS,
  SUBMISSION_LABELS,
  formatDate,
  type LmsLesson,
  type LmsSubmission,
} from "@/lib/lms";
import { setLessonComplete, submitAssignment } from "@/lib/lms.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lms/programs/$programId_/lessons/$lessonId")({
  component: LessonPage,
});

function LessonPage() {
  const { programId, lessonId } = Route.useParams();
  const query = useLmsProgram(programId);
  const client = useQueryClient();
  const key = lmsKeys.program(programId);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [lessonId]);

  const toggle = useMutation({
    mutationFn: (complete: boolean) => setLessonComplete({ data: { lessonId, complete } }),
    onMutate: async (complete) => {
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData<LmsProgramData>(key);
      if (previous)
        client.setQueryData<LmsProgramData>(key, {
          ...previous,
          completed: complete
            ? [...new Set([...previous.completed, lessonId])]
            : previous.completed.filter((id) => id !== lessonId),
        });
      return { previous };
    },
    onError: (error, _complete, context) => {
      if (context?.previous) client.setQueryData(key, context.previous);
      toast.error(lmsError(error, "Unable to save your progress."));
    },
    onSettled: () => void client.invalidateQueries({ queryKey: lmsKeys.home }),
  });

  if (query.isPending) return <Loading />;
  if (query.isError) return <LoadError error={query.error} retry={() => void query.refetch()} />;
  const { program, modules, lessons, completed, submissions, enrollment, cohort } = query.data;
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  const lesson = lessons[index];
  if (!lesson)
    return (
      <LoadError
        error={new Error("This lesson isn't available. It may have been moved or removed.")}
      />
    );
  const done = new Set(completed);
  const isDone = done.has(lesson.id);
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const module = modules.find((m) => m.id === lesson.module_id);
  const canTrack = Boolean(enrollment);
  const Icon = LESSON_ICONS[lesson.kind];
  const liveLink = lesson.kind === "live" ? lesson.resource_url || cohort?.meeting_url : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <article className="min-w-0">
        <Link
          to="/lms/programs/$programId"
          params={{ programId }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {program.title}
        </Link>
        <p className="mt-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Icon className="h-3.5 w-3.5 text-electric" />
          {LESSON_KIND_LABELS[lesson.kind]}
          {lesson.duration_minutes ? ` · ${minutes(lesson.duration_minutes)}` : ""}
          {module && ` · ${module.title}`}
          {!lesson.published && " · Draft"}
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {lesson.title}
        </h1>

        {lesson.video_url && (
          <div className="mt-6">
            <VideoPlayer url={lesson.video_url} title={lesson.title} />
          </div>
        )}

        {(liveLink || (lesson.resource_url && lesson.kind !== "live")) && (
          <div className="mt-6 flex flex-wrap gap-2">
            {liveLink && (
              <Button asChild variant="brand">
                <a href={liveLink} target="_blank" rel="noopener noreferrer">
                  <Radio /> Join the live class
                </a>
              </Button>
            )}
            {lesson.resource_url && lesson.kind !== "live" && (
              <Button asChild variant="outline">
                <a href={lesson.resource_url} target="_blank" rel="noopener noreferrer">
                  <FileText /> {lesson.resource_label || "Open the resource"}
                  <ExternalLink />
                </a>
              </Button>
            )}
          </div>
        )}

        {lesson.body && <Markdown text={lesson.body} className="mt-8" />}

        {lesson.kind === "assignment" && (
          <AssignmentBox
            lesson={lesson}
            submission={submissions.find((s) => s.lesson_id === lesson.id)}
            canSubmit={canTrack}
            programId={programId}
          />
        )}

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          {canTrack ? (
            <Button
              variant={isDone ? "outline" : "brand"}
              onClick={() => toggle.mutate(!isDone)}
              disabled={toggle.isPending}
            >
              {isDone ? <CheckCircle2 className="text-electric" /> : <Circle />}
              {isDone ? "Completed" : "Mark as complete"}
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">
              Preview mode: progress is saved for learner accounts only.
            </p>
          )}
          <div className="flex gap-2">
            {prev && (
              <Button asChild variant="ghost">
                <Link
                  to="/lms/programs/$programId/lessons/$lessonId"
                  params={{ programId, lessonId: prev.id }}
                >
                  <ArrowLeft /> Previous
                </Link>
              </Button>
            )}
            {next ? (
              <Button asChild variant="outline">
                <Link
                  to="/lms/programs/$programId/lessons/$lessonId"
                  params={{ programId, lessonId: next.id }}
                  onClick={() => {
                    if (canTrack && !isDone && lesson.kind !== "assignment") toggle.mutate(true);
                  }}
                >
                  Next <ArrowRight />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link to="/lms/programs/$programId" params={{ programId }}>
                  Back to programme
                </Link>
              </Button>
            )}
          </div>
        </div>
      </article>

      <aside className="lg:sticky lg:top-8 lg:self-start">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              {lessons.filter((l) => done.has(l.id)).length} of {lessons.length} complete
            </p>
          </div>
          <nav className="max-h-[70vh] overflow-y-auto py-2" aria-label="Lessons">
            {modules.map((m) => {
              const items = lessons.filter((l) => l.module_id === m.id);
              if (!items.length) return null;
              return (
                <div key={m.id} className="py-1">
                  <p className="px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {m.title}
                  </p>
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      to="/lms/programs/$programId/lessons/$lessonId"
                      params={{ programId, lessonId: item.id }}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-2 text-sm transition-colors",
                        item.id === lesson.id
                          ? "bg-electric/10 font-medium text-foreground"
                          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                      )}
                    >
                      {done.has(item.id) ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-electric" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 opacity-50" />
                      )}
                      <span className="truncate">{item.title}</span>
                    </Link>
                  ))}
                </div>
              );
            })}
          </nav>
        </Card>
      </aside>
    </div>
  );
}

const TONES = { submitted: "reviewing", approved: "live", changes_requested: "warning" } as const;

function AssignmentBox({
  lesson,
  submission,
  canSubmit,
  programId,
}: {
  lesson: LmsLesson;
  submission: LmsSubmission | undefined;
  canSubmit: boolean;
  programId: string;
}) {
  const client = useQueryClient();
  const [editing, setEditing] = useState(!submission);
  const [body, setBody] = useState(submission?.body ?? "");
  const [link, setLink] = useState(submission?.link ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setEditing(!submission);
    setBody(submission?.body ?? "");
    setLink(submission?.link ?? "");
  }, [lesson.id, submission]);

  async function send(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await submitAssignment({ data: { lessonId: lesson.id, body, link } });
      toast.success("Submitted. The team will review it soon.");
      await client.invalidateQueries({ queryKey: lmsKeys.program(programId) });
      void client.invalidateQueries({ queryKey: lmsKeys.home });
      setEditing(false);
    } catch (error) {
      toast.error(lmsError(error, "Unable to send your submission."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mt-8 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-base font-semibold">Your submission</h2>
        {submission && (
          <Pill tone={TONES[submission.status]}>{SUBMISSION_LABELS[submission.status]}</Pill>
        )}
      </div>
      {submission?.feedback && (
        <div className="mt-4 rounded-xl border border-electric/30 bg-electric/5 p-4">
          <p className="text-xs font-medium text-electric">Feedback from the team</p>
          <p className="mt-1.5 whitespace-pre-line text-sm leading-6">{submission.feedback}</p>
        </div>
      )}
      {!canSubmit ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Learners submit their work here. Submissions appear in Manage → Reviews.
        </p>
      ) : editing ? (
        <form onSubmit={send} className="mt-4 space-y-4">
          <FieldLabel label="Your answer" hint="Write your response, or share a link below.">
            <textarea
              className={cn(fieldCls, "min-h-36")}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={20000}
            />
          </FieldLabel>
          <FieldLabel label="Link (optional)" hint="Google Doc, Drive folder, deck, Figma, GitHub…">
            <input
              type="url"
              className={fieldCls}
              placeholder="https://"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </FieldLabel>
          <div className="flex gap-2">
            <Button variant="brand" disabled={busy || (!body.trim() && !link.trim())}>
              {busy ? <Loader2 className="animate-spin" /> : <Send />}
              {submission ? "Resubmit" : "Submit"}
            </Button>
            {submission && (
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      ) : (
        submission && (
          <div className="mt-4 space-y-3 text-sm">
            <p className="text-xs text-muted-foreground">
              Sent {formatDate(submission.updated_at)}
            </p>
            {submission.body && <p className="whitespace-pre-line leading-6">{submission.body}</p>}
            {submission.link && (
              <a
                href={submission.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 break-all text-electric hover:underline"
              >
                {submission.link} <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
            )}
            {submission.status !== "approved" && (
              <div>
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  Edit and resubmit
                </Button>
              </div>
            )}
          </div>
        )
      )}
    </Card>
  );
}
