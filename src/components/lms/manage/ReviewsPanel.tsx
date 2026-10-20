import { CheckCircle2, ExternalLink, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Card,
  Drawer,
  Empty,
  FieldLabel,
  PanelHeader,
  Pill,
  fieldCls,
  timeAgo,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { SUBMISSION_LABELS, type LmsSubmission } from "@/lib/lms";
import { reviewLmsSubmission } from "@/lib/lms-admin.functions";
import { cn } from "@/lib/utils";
import { Td, Th, Toolbar, useAction, useLookups, type AdminData } from "./common";

const TONES = { submitted: "new", approved: "live", changes_requested: "warning" } as const;

export function ReviewsPanel({ data }: { data: AdminData }) {
  const look = useLookups(data);
  const [status, setStatus] = useState("submitted");
  const [programId, setProgramId] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const rows = useMemo(
    () =>
      data.submissions.filter(
        (s) =>
          (status === "all" || s.status === status) && (!programId || s.program_id === programId),
      ),
    [data.submissions, status, programId],
  );
  const open = data.submissions.find((s) => s.id === openId);
  const waiting = data.submissions.filter((s) => s.status === "submitted").length;

  return (
    <>
      <PanelHeader
        title="Reviews"
        description={`Assignment submissions from learners. ${waiting} waiting for review.`}
      />
      <Toolbar>
        <select
          className={cn(fieldCls, "w-auto")}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="submitted">Awaiting review</option>
          <option value="changes_requested">Changes requested</option>
          <option value="approved">Approved</option>
          <option value="all">All</option>
        </select>
        <select
          className={cn(fieldCls, "w-auto max-w-xs")}
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
        >
          <option value="">All programmes</option>
          {data.programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </Toolbar>
      {rows.length === 0 ? (
        <Empty title={status === "submitted" ? "You're all caught up" : "Nothing here"}>
          Submissions arrive when learners hand in assignment lessons.
        </Empty>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="border-b border-border">
              <tr>
                <Th>Learner</Th>
                <Th>Assignment</Th>
                <Th>Sent</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((s) => {
                const profile = look.profiles.get(s.user_id);
                const lesson = look.lessons.get(s.lesson_id);
                return (
                  <tr
                    key={s.id}
                    onClick={() => setOpenId(s.id)}
                    className="cursor-pointer transition-colors hover:bg-accent/30"
                  >
                    <Td>
                      <p className="font-medium">{profile?.full_name ?? "Deleted learner"}</p>
                      <p className="text-xs text-muted-foreground">{profile?.email}</p>
                    </Td>
                    <Td>
                      <p>{lesson?.title ?? "Deleted lesson"}</p>
                      <p className="text-xs text-muted-foreground">
                        {look.programs.get(s.program_id)?.title}
                      </p>
                    </Td>
                    <Td className="whitespace-nowrap text-xs text-muted-foreground">
                      {timeAgo(s.updated_at)}
                    </Td>
                    <Td>
                      <Pill tone={TONES[s.status]}>{SUBMISSION_LABELS[s.status]}</Pill>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
      {open && <ReviewDrawer submission={open} data={data} onClose={() => setOpenId(null)} />}
    </>
  );
}

function ReviewDrawer({
  submission,
  data,
  onClose,
}: {
  submission: LmsSubmission;
  data: AdminData;
  onClose: () => void;
}) {
  const look = useLookups(data);
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const { run, busy } = useAction();
  const profile = look.profiles.get(submission.user_id);
  const lesson = look.lessons.get(submission.lesson_id);
  const review = (status: LmsSubmission["status"], message: string) =>
    void run(
      () => reviewLmsSubmission({ data: { id: submission.id, status, feedback } }),
      message,
    ).then((ok) => ok && onClose());

  return (
    <Drawer
      title={lesson?.title ?? "Submission"}
      subtitle={`${profile?.full_name ?? "Learner"} · ${timeAgo(submission.updated_at)}`}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => review("changes_requested", "Sent back for changes.")}
          >
            <RotateCcw /> Request changes
          </Button>
          <Button variant="brand" disabled={busy} onClick={() => review("approved", "Approved.")}>
            <CheckCircle2 /> Approve
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Pill tone={TONES[submission.status]}>{SUBMISSION_LABELS[submission.status]}</Pill>
        {lesson?.body && (
          <details className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
            <summary className="cursor-pointer text-muted-foreground">Assignment brief</summary>
            <p className="mt-3 whitespace-pre-line leading-6 text-muted-foreground">
              {lesson.body}
            </p>
          </details>
        )}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Answer</p>
          {submission.body ? (
            <p className="whitespace-pre-line rounded-xl border border-border p-4 text-sm leading-6">
              {submission.body}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No written answer.</p>
          )}
        </div>
        {submission.link && (
          <a
            href={submission.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 break-all text-sm text-electric hover:underline"
          >
            {submission.link} <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
        )}
        <FieldLabel label="Feedback" hint="The learner sees this on the lesson page.">
          <textarea
            className={cn(fieldCls, "min-h-36")}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What worked, and what to improve…"
          />
        </FieldLabel>
      </div>
    </Drawer>
  );
}
