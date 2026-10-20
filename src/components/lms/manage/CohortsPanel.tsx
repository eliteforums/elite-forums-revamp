import {
  ArrowLeft,
  Award,
  CalendarPlus,
  ExternalLink,
  Layers,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  Video,
} from "lucide-react";
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
import {
  COHORT_STATUSES,
  cohortDates,
  formatDateTime,
  isEmail,
  type LmsCohort,
  type LmsSession,
} from "@/lib/lms";
import {
  deleteLmsRecord,
  enrolLmsUsers,
  saveLmsRecord,
  updateLmsEnrollments,
} from "@/lib/lms-admin.functions";
import { cn } from "@/lib/utils";
import { ProgressBar, minutes } from "../bits";
import { IssueCertificatesDrawer, type Recipient } from "./CertificatesPanel";
import {
  Checkbox,
  SearchBox,
  SelectionBar,
  Td,
  Th,
  Toolbar,
  confirmAction,
  useAction,
  useLookups,
  useSelection,
  type AdminData,
} from "./common";

const STATUS_LABELS: Record<LmsCohort["status"], string> = {
  upcoming: "Upcoming",
  active: "Running",
  completed: "Completed",
  archived: "Archived",
};
const STATUS_TONES: Record<LmsCohort["status"], string> = {
  upcoming: "reviewing",
  active: "live",
  completed: "contacted",
  archived: "closed",
};

export function CohortsPanel({ data }: { data: AdminData }) {
  const look = useLookups(data);
  const [programId, setProgramId] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<LmsCohort> | null>(null);

  const open = data.cohorts.find((c) => c.id === openId);
  if (open) return <CohortDetail cohort={open} data={data} onBack={() => setOpenId(null)} />;

  const cohorts = data.cohorts.filter(
    (c) => (!programId || c.program_id === programId) && (showArchived || c.status !== "archived"),
  );

  return (
    <>
      <PanelHeader
        title="Cohorts"
        description="A cohort is one batch running a programme: its own dates, learners, live classes and announcements."
        actions={
          <Button
            variant="brand"
            disabled={!data.programs.length}
            onClick={() => setDraft({ program_id: programId || data.programs[0]!.id })}
          >
            <Plus /> New cohort
          </Button>
        }
      />
      <Toolbar>
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
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox label="Show archived" checked={showArchived} onChange={setShowArchived} />
          Show archived
        </label>
      </Toolbar>
      {!data.programs.length ? (
        <Empty title="Create a programme first">Cohorts run a programme's curriculum.</Empty>
      ) : cohorts.length === 0 ? (
        <Empty title="No cohorts yet">Create a cohort, then add learners to it.</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cohorts.map((cohort) => {
            const members = data.enrollments.filter(
              (e) => e.cohort_id === cohort.id && e.status !== "dropped",
            );
            const avg = members.length
              ? Math.round(
                  members.reduce(
                    (sum, e) => sum + look.progressOf(e.user_id, cohort.program_id).percent,
                    0,
                  ) / members.length,
                )
              : 0;
            const next = data.sessions.find(
              (s) => s.cohort_id === cohort.id && new Date(s.starts_at).getTime() > Date.now(),
            );
            return (
              <button
                key={cohort.id}
                onClick={() => setOpenId(cohort.id)}
                className="rounded-2xl border border-border bg-surface p-5 text-left transition-colors hover:border-electric/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    {look.programs.get(cohort.program_id)?.title}
                  </p>
                  <Pill tone={STATUS_TONES[cohort.status]}>{STATUS_LABELS[cohort.status]}</Pill>
                </div>
                <p className="mt-1 font-display text-lg font-semibold">{cohort.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {cohortDates(cohort) || "No dates set"}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <ProgressBar value={avg} className="flex-1" />
                  <span className="text-xs tabular-nums">{avg}%</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {members.length} learner{members.length === 1 ? "" : "s"}
                  {next ? ` · Next class ${formatDateTime(next.starts_at)}` : ""}
                </p>
              </button>
            );
          })}
        </div>
      )}
      {draft && <CohortDrawer draft={draft} data={data} onClose={() => setDraft(null)} />}
    </>
  );
}

function CohortDrawer({
  draft,
  data,
  onClose,
}: {
  draft: Partial<LmsCohort>;
  data: AdminData;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    program_id: draft.program_id ?? data.programs[0]?.id ?? "",
    name: draft.name ?? "",
    starts_on: draft.starts_on ?? "",
    ends_on: draft.ends_on ?? "",
    status: (draft.status ?? "upcoming") as LmsCohort["status"],
    meeting_url: draft.meeting_url ?? "",
    community_url: draft.community_url ?? "",
    notes: draft.notes ?? "",
  });
  const { run, busy } = useAction();
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <Drawer
      title={draft.id ? "Edit cohort" : "New cohort"}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="brand"
            disabled={busy || !form.name.trim() || !form.program_id}
            onClick={() =>
              void run(
                () =>
                  saveLmsRecord({
                    data: { entity: "cohort", ...(draft.id ? { id: draft.id } : {}), data: form },
                  }),
                "Cohort saved.",
              ).then((ok) => ok && onClose())
            }
          >
            Save cohort
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FieldLabel label="Programme">
          <select
            className={fieldCls}
            value={form.program_id}
            onChange={set("program_id")}
            disabled={Boolean(draft.id)}
          >
            {data.programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </FieldLabel>
        <FieldLabel label="Name" hint='e.g. "Cohort 3 — Jan 2027" or "NMIMS Batch"'>
          <input className={fieldCls} value={form.name} onChange={set("name")} />
        </FieldLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          <FieldLabel label="Starts">
            <input
              type="date"
              className={fieldCls}
              value={form.starts_on}
              onChange={set("starts_on")}
            />
          </FieldLabel>
          <FieldLabel label="Ends">
            <input
              type="date"
              className={fieldCls}
              value={form.ends_on}
              onChange={set("ends_on")}
            />
          </FieldLabel>
          <FieldLabel label="Status">
            <select className={fieldCls} value={form.status} onChange={set("status")}>
              {COHORT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </FieldLabel>
        </div>
        <FieldLabel
          label="Class link"
          hint="Zoom, Meet or Teams link used for every live class unless a class has its own."
        >
          <input
            className={fieldCls}
            placeholder="https://"
            value={form.meeting_url}
            onChange={set("meeting_url")}
          />
        </FieldLabel>
        <FieldLabel
          label="Cohort group link"
          hint="WhatsApp, Slack or Discord group for this cohort."
        >
          <input
            className={fieldCls}
            placeholder="https://chat.whatsapp.com/…"
            value={form.community_url}
            onChange={set("community_url")}
          />
        </FieldLabel>
        <FieldLabel label="Notes for learners" hint="Shown on the programme's About tab.">
          <textarea
            className={cn(fieldCls, "min-h-24")}
            value={form.notes}
            onChange={set("notes")}
          />
        </FieldLabel>
      </div>
    </Drawer>
  );
}

const toLocalInput = (iso: string) => {
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};

function SessionDrawer({
  draft,
  onClose,
}: {
  draft: Partial<LmsSession> & { cohort_id: string };
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: draft.title ?? "",
    description: draft.description ?? "",
    starts_at: draft.starts_at ? toLocalInput(draft.starts_at) : "",
    duration: String(draft.duration_minutes ?? 60),
    meeting_url: draft.meeting_url ?? "",
    recording_url: draft.recording_url ?? "",
  });
  const { run, busy } = useAction();
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm({ ...form, [key]: e.target.value });
  const duration = Number(form.duration);
  const valid =
    form.title.trim() &&
    form.starts_at &&
    Number.isInteger(duration) &&
    duration >= 5 &&
    duration <= 1440;

  return (
    <Drawer
      title={draft.id ? "Edit live class" : "Schedule a live class"}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-between gap-2">
          {draft.id ? (
            <Button
              variant="ghost"
              className="text-destructive"
              disabled={busy}
              onClick={() => {
                if (confirmAction("Delete this class?"))
                  void run(
                    () => deleteLmsRecord({ data: { entity: "session", id: draft.id! } }),
                    "Class deleted.",
                  ).then((ok) => ok && onClose());
              }}
            >
              <Trash2 /> Delete
            </Button>
          ) : (
            <span />
          )}
          <Button
            variant="brand"
            disabled={busy || !valid}
            onClick={() =>
              void run(
                () =>
                  saveLmsRecord({
                    data: {
                      entity: "session",
                      ...(draft.id ? { id: draft.id } : {}),
                      data: {
                        cohort_id: draft.cohort_id,
                        title: form.title,
                        description: form.description,
                        starts_at: new Date(form.starts_at).toISOString(),
                        duration_minutes: duration,
                        meeting_url: form.meeting_url,
                        recording_url: form.recording_url,
                      },
                    },
                  }),
                "Class saved.",
              ).then((ok) => ok && onClose())
            }
          >
            Save class
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FieldLabel label="Title">
          <input
            className={fieldCls}
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. Pitch clinic with investors"
          />
        </FieldLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldLabel label="Starts" hint="Your local time.">
            <input
              type="datetime-local"
              className={fieldCls}
              value={form.starts_at}
              onChange={set("starts_at")}
            />
          </FieldLabel>
          <FieldLabel label="Length (minutes)">
            <input
              className={fieldCls}
              inputMode="numeric"
              value={form.duration}
              onChange={set("duration")}
            />
          </FieldLabel>
        </div>
        <FieldLabel label="Class link" hint="Leave empty to use the cohort's class link.">
          <input
            className={fieldCls}
            placeholder="https://"
            value={form.meeting_url}
            onChange={set("meeting_url")}
          />
        </FieldLabel>
        <FieldLabel
          label="Recording link"
          hint="Add after the class; learners see it under Past classes."
        >
          <input
            className={fieldCls}
            placeholder="https://"
            value={form.recording_url}
            onChange={set("recording_url")}
          />
        </FieldLabel>
        <FieldLabel label="Description (optional)">
          <textarea
            className={cn(fieldCls, "min-h-24")}
            value={form.description}
            onChange={set("description")}
          />
        </FieldLabel>
      </div>
    </Drawer>
  );
}

function AddMembersDrawer({
  cohort,
  data,
  onClose,
}: {
  cohort: LmsCohort;
  data: AdminData;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [emails, setEmails] = useState("");
  const { run, busy } = useAction();
  const inCohort = new Set(
    data.enrollments.filter((e) => e.cohort_id === cohort.id).map((e) => e.user_id),
  );
  const candidates = data.profiles.filter(
    (p) =>
      !inCohort.has(p.id) &&
      (!query.trim() ||
        [p.full_name, p.email, p.organisation ?? ""].some((v) =>
          v.toLowerCase().includes(query.trim().toLowerCase()),
        )),
  );
  const selection = useSelection(candidates.map((p) => p.id));
  const byEmail = new Map(data.profiles.map((p) => [p.email.toLowerCase(), p.id]));
  const pastedEmails = emails
    .split(/[\s,;]+/)
    .map((v) => v.trim().toLowerCase())
    .filter(isEmail);
  const pastedIds = pastedEmails.map((e) => byEmail.get(e)).filter(Boolean) as string[];
  const unknown = pastedEmails.filter((e) => !byEmail.has(e));
  const ids = [...new Set([...selection.ids, ...pastedIds])];

  return (
    <Drawer
      title={`Add learners to ${cohort.name}`}
      subtitle="Existing accounts only. Create new ones in People → Bulk import."
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="brand"
            disabled={!ids.length || busy}
            onClick={() =>
              void run(
                () => enrolLmsUsers({ data: { userIds: ids, cohortId: cohort.id } }),
                `Added ${ids.length} learner${ids.length === 1 ? "" : "s"}.`,
              ).then((ok) => ok && onClose())
            }
          >
            <UserPlus /> Add {ids.length || ""}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <p className="text-xs leading-5 text-muted-foreground">
          Learners already in another cohort of this programme are moved here.
        </p>
        <FieldLabel label="Paste emails" hint="Separated by commas, spaces or new lines.">
          <textarea
            className={cn(fieldCls, "min-h-20 font-mono text-xs")}
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
          {unknown.length > 0 && (
            <p className="text-xs text-destructive">No account for: {unknown.join(", ")}</p>
          )}
        </FieldLabel>
        <div>
          <div className="mb-3 flex items-center gap-3">
            <SearchBox value={query} onChange={setQuery} placeholder="Search learners…" />
            <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
              <Checkbox
                label="Select all"
                checked={selection.allChecked}
                indeterminate={selection.someChecked}
                onChange={selection.toggleAll}
              />
              All {candidates.length}
            </label>
          </div>
          <ul className="max-h-[45vh] divide-y divide-border overflow-y-auto rounded-xl border border-border">
            {candidates.slice(0, 500).map((p) => (
              <li key={p.id}>
                <label className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/30">
                  <Checkbox
                    label={`Select ${p.full_name}`}
                    checked={selection.has(p.id)}
                    onChange={(on) => selection.toggle(p.id, on)}
                  />
                  <span className="min-w-0 flex-1 truncate">{p.full_name}</span>
                  <span className="truncate text-xs text-muted-foreground">{p.email}</span>
                </label>
              </li>
            ))}
            {candidates.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                Everyone is already in this cohort.
              </li>
            )}
          </ul>
        </div>
      </div>
    </Drawer>
  );
}

function CohortDetail({
  cohort,
  data,
  onBack,
}: {
  cohort: LmsCohort;
  data: AdminData;
  onBack: () => void;
}) {
  const look = useLookups(data);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [session, setSession] = useState<(Partial<LmsSession> & { cohort_id: string }) | null>(
    null,
  );
  const [certify, setCertify] = useState<Recipient[] | null>(null);
  const [moveTo, setMoveTo] = useState("");
  const { run, busy } = useAction();
  const program = look.programs.get(cohort.program_id);

  const members = useMemo(
    () =>
      data.enrollments
        .filter((e) => e.cohort_id === cohort.id)
        .map((e) => ({
          enrolment: e,
          profile: look.profiles.get(e.user_id)!,
          progress: look.progressOf(e.user_id, cohort.program_id),
        }))
        .filter((row) => row.profile)
        .sort((a, b) => a.profile.full_name.localeCompare(b.profile.full_name)),
    [data.enrollments, cohort, look],
  );
  const selection = useSelection(members.map((m) => m.enrolment.id));
  const sessions = data.sessions.filter((s) => s.cohort_id === cohort.id);
  const otherCohorts = data.cohorts.filter(
    (c) => c.program_id === cohort.program_id && c.id !== cohort.id,
  );
  const selectedRecipients = () =>
    members
      .filter((m) => selection.has(m.enrolment.id))
      .map((m) => ({ userId: m.profile.id, name: m.profile.full_name, email: m.profile.email }));
  const setStatus = (status: "active" | "completed" | "dropped") =>
    void run(
      () => updateLmsEnrollments({ data: { ids: selection.ids, action: "status", status } }),
      "Status updated.",
    );

  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All cohorts
      </button>
      <PanelHeader
        title={cohort.name}
        description={`${program?.title ?? ""}${cohortDates(cohort) ? ` · ${cohortDates(cohort)}` : ""}`}
        actions={
          <>
            <Pill tone={STATUS_TONES[cohort.status]}>{STATUS_LABELS[cohort.status]}</Pill>
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil /> Edit
            </Button>
            <Button variant="brand" size="sm" onClick={() => setAdding(true)}>
              <UserPlus /> Add learners
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold">
            <Layers className="h-4 w-4 text-electric" /> Learners ({members.length})
          </h2>
          <SelectionBar count={selection.count} onClear={selection.clear}>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => setStatus("completed")}
            >
              Mark completed
            </Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => setStatus("active")}>
              Mark active
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCertify(selectedRecipients())}>
              <Award /> Certificates
            </Button>
            {otherCohorts.length > 0 && (
              <>
                <select
                  className={cn(fieldCls, "h-9 min-h-9 w-auto py-1")}
                  value={moveTo}
                  onChange={(e) => setMoveTo(e.target.value)}
                >
                  <option value="">Move to…</option>
                  {otherCohorts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!moveTo || busy}
                  onClick={() =>
                    void run(
                      () =>
                        updateLmsEnrollments({
                          data: { ids: selection.ids, action: "cohort", cohortId: moveTo },
                        }),
                      "Learners moved.",
                    ).then(selection.clear)
                  }
                >
                  Move
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              disabled={busy}
              onClick={() => {
                if (
                  confirmAction(
                    `Remove ${selection.count} learners from ${program?.title}? Their accounts stay; their progress in this programme is kept if re-enrolled.`,
                  )
                )
                  void run(
                    () => updateLmsEnrollments({ data: { ids: selection.ids, action: "remove" } }),
                    "Removed from the programme.",
                  ).then(selection.clear);
              }}
            >
              <Trash2 /> Remove
            </Button>
          </SelectionBar>
          {members.length === 0 ? (
            <Empty title="No learners in this cohort">
              Use Add learners, or pick this cohort when you bulk import.
            </Empty>
          ) : (
            <Card className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <Th className="w-10">
                      <Checkbox
                        label="Select all"
                        checked={selection.allChecked}
                        indeterminate={selection.someChecked}
                        onChange={selection.toggleAll}
                      />
                    </Th>
                    <Th>Learner</Th>
                    <Th className="w-44">Progress</Th>
                    <Th>Last active</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {members.map(({ enrolment, profile, progress }) => (
                    <tr key={enrolment.id}>
                      <Td>
                        <Checkbox
                          label={`Select ${profile.full_name}`}
                          checked={selection.has(enrolment.id)}
                          onChange={(on) => selection.toggle(enrolment.id, on)}
                        />
                      </Td>
                      <Td>
                        <p className="font-medium">{profile.full_name}</p>
                        <p className="text-xs text-muted-foreground">{profile.email}</p>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <ProgressBar value={progress.percent} className="w-24" />
                          <span className="text-xs tabular-nums">
                            {progress.done}/{progress.total}
                          </span>
                        </div>
                      </Td>
                      <Td className="whitespace-nowrap text-xs text-muted-foreground">
                        {profile.last_seen_at ? timeAgo(profile.last_seen_at) : "Never"}
                      </Td>
                      <Td>
                        <Pill
                          tone={
                            enrolment.status === "completed"
                              ? "contacted"
                              : enrolment.status === "active"
                                ? "live"
                                : "closed"
                          }
                        >
                          {enrolment.status}
                        </Pill>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold">
              <Video className="h-4 w-4 text-electric" /> Live classes
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSession({ cohort_id: cohort.id })}
            >
              <CalendarPlus /> Schedule
            </Button>
          </div>
          <div className="space-y-2">
            {sessions.length === 0 && (
              <Empty title="No classes scheduled">
                Learners see scheduled classes on their home page with a Join button.
              </Empty>
            )}
            {sessions.map((s) => {
              const past =
                new Date(s.starts_at).getTime() + s.duration_minutes * 60_000 < Date.now();
              return (
                <button
                  key={s.id}
                  onClick={() => setSession(s)}
                  className={cn(
                    "block w-full rounded-xl border border-border bg-surface px-4 py-3 text-left transition-colors hover:border-electric/50",
                    past && "opacity-70",
                  )}
                >
                  <p className="text-xs text-electric">
                    {formatDateTime(s.starts_at)} · {minutes(s.duration_minutes)}
                  </p>
                  <p className="mt-0.5 text-sm font-medium">{s.title}</p>
                  {past && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.recording_url ? "Recording added" : "Past — add a recording link"}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-6 space-y-2 text-sm">
            {cohort.meeting_url && (
              <a
                href={cohort.meeting_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Class link
              </a>
            )}
            {cohort.community_url && (
              <a
                href={cohort.community_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Cohort group
              </a>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-8 text-destructive"
            disabled={busy}
            onClick={async () => {
              if (
                !confirmAction(
                  `Delete ${cohort.name}? Its classes and announcements are deleted. Learners stay enrolled in ${program?.title} without a cohort.`,
                )
              )
                return;
              const done = await run(
                () => deleteLmsRecord({ data: { entity: "cohort", id: cohort.id } }),
                "Cohort deleted.",
              );
              if (done) onBack();
            }}
          >
            <Trash2 /> Delete cohort
          </Button>
        </section>
      </div>

      {editing && <CohortDrawer draft={cohort} data={data} onClose={() => setEditing(false)} />}
      {adding && <AddMembersDrawer cohort={cohort} data={data} onClose={() => setAdding(false)} />}
      {session && <SessionDrawer draft={session} onClose={() => setSession(null)} />}
      {certify && (
        <IssueCertificatesDrawer data={data} initial={certify} onClose={() => setCertify(null)} />
      )}
    </>
  );
}
