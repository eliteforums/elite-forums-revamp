import {
  Award,
  Download,
  FileUp,
  KeyRound,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
  ENROLLMENT_STATUSES,
  downloadFile,
  formatDate,
  generatePassword,
  isEmail,
  parseTable,
  toCsv,
  type LmsProfile,
} from "@/lib/lms";
import {
  bulkLmsUsers,
  createLmsUsers,
  enrolLmsUsers,
  resetLmsPasswords,
  updateLmsEnrollments,
  updateLmsUser,
  type CreatedUser,
} from "@/lib/lms-admin.functions";
import { cn } from "@/lib/utils";
import { ProgressBar } from "../bits";
import { IssueCertificatesDrawer, type Recipient } from "./CertificatesPanel";
import { CredentialsDrawer } from "./Credentials";
import {
  Checkbox,
  SearchBox,
  SelectionBar,
  TargetSelect,
  Td,
  Th,
  Toolbar,
  confirmAction,
  splitTarget,
  useAction,
  useLookups,
  useSelection,
  type AdminData,
  type Lookups,
} from "./common";

type Credentials = { title: string; results: CreatedUser[] };

export function PeoplePanel({ data }: { data: AdminData }) {
  const look = useLookups(data);
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState("");
  const [status, setStatus] = useState("all");
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [certify, setCertify] = useState<Recipient[] | null>(null);
  const [enrolTarget, setEnrolTarget] = useState("");
  const { run, busy } = useAction();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const { programId, cohortId } = splitTarget(target);
    return data.profiles.filter((profile) => {
      if (
        q &&
        ![profile.full_name, profile.email, profile.phone ?? "", profile.organisation ?? ""].some(
          (value) => value.toLowerCase().includes(q),
        )
      )
        return false;
      if (status === "active" && profile.status !== "active") return false;
      if (status === "suspended" && profile.status !== "suspended") return false;
      if (status === "never" && profile.last_seen_at) return false;
      if (status === "unenrolled" && look.enrollmentsOf(profile.id).length) return false;
      if (programId) {
        const match = look
          .enrollmentsOf(profile.id)
          .some((e) => e.program_id === programId && (!cohortId || e.cohort_id === cohortId));
        if (!match) return false;
      }
      return true;
    });
  }, [data.profiles, query, target, status, look]);

  const selection = useSelection(rows.map((row) => row.id));
  const selectedProfiles = data.profiles.filter((p) => selection.has(p.id));

  const exportRows = (profiles: LmsProfile[]) =>
    downloadFile(
      `elite-forums-learners-${new Date().toISOString().slice(0, 10)}.csv`,
      toCsv([
        [
          "Name",
          "Email",
          "Phone",
          "College or startup",
          "Programmes",
          "Status",
          "Last active",
          "Added",
        ],
        ...profiles.map((p) => [
          p.full_name,
          p.email,
          p.phone,
          p.organisation,
          look
            .enrollmentsOf(p.id)
            .map((e) => {
              const cohort = e.cohort_id ? look.cohorts.get(e.cohort_id)?.name : "";
              const progress = look.progressOf(p.id, e.program_id).percent;
              return `${look.programs.get(e.program_id)?.title ?? ""}${cohort ? ` (${cohort})` : ""} ${progress}%`;
            })
            .join("; "),
          p.status,
          p.last_seen_at ? formatDate(p.last_seen_at) : "Never",
          formatDate(p.created_at),
        ]),
      ]),
    );

  const open = data.profiles.find((p) => p.id === openId);

  return (
    <>
      <PanelHeader
        title="People"
        description="Create learner logins one at a time or in bulk, enrol them into programmes and cohorts, and manage their access."
        actions={
          <>
            <Button variant="outline" onClick={() => setImporting(true)}>
              <FileUp /> Bulk import
            </Button>
            <Button variant="brand" onClick={() => setAdding(true)}>
              <UserPlus /> Add learner
            </Button>
          </>
        }
      />

      <Toolbar>
        <SearchBox value={query} onChange={setQuery} placeholder="Search name, email, college…" />
        <TargetSelect
          programs={data.programs}
          cohorts={data.cohorts}
          value={target}
          onChange={setTarget}
          emptyLabel="All programmes"
          className="w-auto max-w-xs"
        />
        <select
          className={cn(fieldCls, "w-auto")}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">Everyone</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="never">Never signed in</option>
          <option value="unenrolled">Not enrolled</option>
        </select>
        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => exportRows(rows)}>
          <Download /> Export {rows.length}
        </Button>
      </Toolbar>

      <SelectionBar count={selection.count} onClear={selection.clear}>
        <TargetSelect
          programs={data.programs}
          cohorts={data.cohorts}
          value={enrolTarget}
          onChange={setEnrolTarget}
          emptyLabel="Enrol in…"
          className="h-9 min-h-9 w-auto max-w-[14rem] py-1"
        />
        <Button
          size="sm"
          variant="outline"
          disabled={!enrolTarget || busy}
          onClick={() =>
            void run(
              () =>
                enrolLmsUsers({ data: { userIds: selection.ids, ...splitTarget(enrolTarget) } }),
              `Enrolled ${selection.count} learner${selection.count === 1 ? "" : "s"}.`,
            )
          }
        >
          <Plus /> Enrol
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setCertify(
              selectedProfiles.map((p) => ({ userId: p.id, name: p.full_name, email: p.email })),
            )
          }
        >
          <Award /> Certificates
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={async () => {
            if (
              !confirmAction(
                `Reset passwords for ${selection.count} learners? Their current passwords stop working.`,
              )
            )
              return;
            const result = await run(() => resetLmsPasswords({ data: { ids: selection.ids } }));
            if (result) setCredentials({ title: "New passwords", results: result.results });
          }}
        >
          <KeyRound /> Reset passwords
        </Button>
        <Button size="sm" variant="ghost" onClick={() => exportRows(selectedProfiles)}>
          <Download /> Export
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={busy}
          onClick={() =>
            void run(
              () => bulkLmsUsers({ data: { ids: selection.ids, action: "suspend" } }),
              "Access paused.",
            )
          }
        >
          <Pause /> Suspend
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={busy}
          onClick={() =>
            void run(
              () => bulkLmsUsers({ data: { ids: selection.ids, action: "activate" } }),
              "Access restored.",
            )
          }
        >
          <Play /> Activate
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive"
          disabled={busy}
          onClick={async () => {
            if (
              !confirmAction(
                `Delete ${selection.count} learner accounts? Their logins, progress and submissions are removed. Certificates already issued stay valid.`,
              )
            )
              return;
            const done = await run(
              () => bulkLmsUsers({ data: { ids: selection.ids, action: "delete" } }),
              "Learners deleted.",
            );
            if (done) selection.clear();
          }}
        >
          <Trash2 /> Delete
        </Button>
      </SelectionBar>

      {data.profiles.length === 0 ? (
        <Empty title="No learners yet">
          Add learners one by one, or paste a spreadsheet with Bulk import.
        </Empty>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-sm">
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
                <Th>Programmes</Th>
                <Th className="w-40">Progress</Th>
                <Th>Last active</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((profile) => {
                const enrolments = look.enrollmentsOf(profile.id);
                const progress = enrolments.length
                  ? Math.round(
                      enrolments.reduce(
                        (sum, e) => sum + look.progressOf(profile.id, e.program_id).percent,
                        0,
                      ) / enrolments.length,
                    )
                  : null;
                return (
                  <tr
                    key={profile.id}
                    onClick={() => setOpenId(profile.id)}
                    className="cursor-pointer transition-colors hover:bg-accent/30"
                  >
                    <Td>
                      <Checkbox
                        label={`Select ${profile.full_name}`}
                        checked={selection.has(profile.id)}
                        onChange={(on) => selection.toggle(profile.id, on)}
                      />
                    </Td>
                    <Td>
                      <p className="font-medium">{profile.full_name}</p>
                      <p className="text-xs text-muted-foreground">{profile.email}</p>
                    </Td>
                    <Td>
                      <div className="flex max-w-xs flex-wrap gap-1">
                        {enrolments.length === 0 && (
                          <span className="text-xs text-muted-foreground">Not enrolled</span>
                        )}
                        {enrolments.map((e) => (
                          <span
                            key={e.id}
                            className={cn(
                              "rounded-md border border-border px-1.5 py-0.5 text-xs",
                              e.status === "dropped" && "line-through opacity-60",
                            )}
                          >
                            {look.programs.get(e.program_id)?.title}
                            {e.cohort_id && ` · ${look.cohorts.get(e.cohort_id)?.name ?? ""}`}
                          </span>
                        ))}
                      </div>
                    </Td>
                    <Td>
                      {progress === null ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <ProgressBar value={progress} className="w-20" />
                          <span className="text-xs tabular-nums">{progress}%</span>
                        </div>
                      )}
                    </Td>
                    <Td className="whitespace-nowrap text-xs text-muted-foreground">
                      {profile.last_seen_at ? timeAgo(profile.last_seen_at) : "Never"}
                    </Td>
                    <Td>
                      <Pill tone={profile.status === "active" ? "live" : "closed"}>
                        {profile.status === "active" ? "Active" : "Suspended"}
                      </Pill>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No learners match these filters.
            </p>
          )}
        </Card>
      )}

      {adding && (
        <AddLearnerDrawer
          data={data}
          onClose={() => setAdding(false)}
          onCreated={(results) => {
            setAdding(false);
            setCredentials({ title: "Learner added", results });
          }}
        />
      )}
      {importing && (
        <BulkImportDrawer
          data={data}
          onClose={() => setImporting(false)}
          onCreated={(results) => {
            setImporting(false);
            setCredentials({ title: "Import complete", results });
          }}
        />
      )}
      {open && (
        <PersonDrawer
          profile={open}
          data={data}
          look={look}
          onClose={() => setOpenId(null)}
          onCredentials={(results) => setCredentials({ title: "New password", results })}
          onCertify={(recipients) => setCertify(recipients)}
        />
      )}
      {credentials && (
        <CredentialsDrawer
          title={credentials.title}
          results={credentials.results}
          onClose={() => setCredentials(null)}
        />
      )}
      {certify && (
        <IssueCertificatesDrawer data={data} initial={certify} onClose={() => setCertify(null)} />
      )}
    </>
  );
}

function PasswordField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <FieldLabel
      label="Password"
      hint="Leave empty to generate one. Learners choose their own when they first sign in."
      action={
        <button
          type="button"
          onClick={() => onChange(generatePassword())}
          className="inline-flex items-center gap-1 text-xs text-electric hover:underline"
        >
          <RefreshCw className="h-3 w-3" /> Generate
        </button>
      }
    >
      <input
        className={cn(fieldCls, "font-mono")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Generated automatically"
        autoComplete="off"
      />
    </FieldLabel>
  );
}

function AddLearnerDrawer({
  data,
  onClose,
  onCreated,
}: {
  data: AdminData;
  onClose: () => void;
  onCreated: (results: CreatedUser[]) => void;
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organisation: "",
    password: "",
  });
  const [target, setTarget] = useState("");
  const [mustChange, setMustChange] = useState(true);
  const { run, busy } = useAction();
  const set = (key: keyof typeof form) => (value: string) => setForm({ ...form, [key]: value });
  const valid =
    form.fullName.trim() &&
    isEmail(form.email.trim()) &&
    (!form.password || form.password.length >= 8);

  async function save() {
    const result = await run(() =>
      createLmsUsers({
        data: {
          users: [{ ...form, email: form.email.trim() }],
          ...splitTarget(target),
          mustChangePassword: mustChange,
        },
      }),
    );
    if (result) {
      const failed = result.results.find((row) => row.outcome === "failed");
      if (failed) return void toast.error(failed.message ?? "Unable to create the login.");
      onCreated(result.results);
    }
  }

  return (
    <Drawer
      title="Add a learner"
      subtitle="Creates their login and, optionally, enrols them."
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="brand" disabled={!valid || busy} onClick={() => void save()}>
            {busy ? "Creating…" : "Create login"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FieldLabel label="Full name">
          <input
            className={fieldCls}
            value={form.fullName}
            onChange={(e) => set("fullName")(e.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Email" hint="This is their login.">
          <input
            className={fieldCls}
            type="email"
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
          />
        </FieldLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldLabel label="Phone">
            <input
              className={fieldCls}
              value={form.phone}
              onChange={(e) => set("phone")(e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="College or startup">
            <input
              className={fieldCls}
              value={form.organisation}
              onChange={(e) => set("organisation")(e.target.value)}
            />
          </FieldLabel>
        </div>
        <PasswordField value={form.password} onChange={set("password")} />
        <FieldLabel label="Enrol in">
          <TargetSelect
            programs={data.programs}
            cohorts={data.cohorts}
            value={target}
            onChange={setTarget}
            emptyLabel="Don't enrol yet"
          />
        </FieldLabel>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox label="Ask for a new password" checked={mustChange} onChange={setMustChange} />
          Ask them to choose a new password when they first sign in
        </label>
      </div>
    </Drawer>
  );
}

const COLUMN_ALIASES: Record<string, string[]> = {
  fullName: [
    "name",
    "full name",
    "fullname",
    "full_name",
    "student name",
    "learner",
    "learner name",
  ],
  email: ["email", "email address", "e-mail", "mail", "email id"],
  phone: [
    "phone",
    "mobile",
    "phone number",
    "mobile number",
    "whatsapp",
    "contact",
    "contact number",
  ],
  organisation: [
    "organisation",
    "organization",
    "college",
    "institution",
    "company",
    "startup",
    "university",
  ],
  password: ["password", "pass", "temporary password"],
  cohort: ["cohort", "batch", "programme", "program", "course"],
};

type ImportRow = {
  line: number;
  fullName: string;
  email: string;
  phone: string;
  organisation: string;
  password: string;
  cohortLabel: string;
  programId: string | null;
  cohortId: string | null;
  problem: string | null;
  existing: boolean;
};

function readImport(text: string, data: AdminData): ImportRow[] {
  const table = parseTable(text);
  if (!table.length) return [];
  const header = table[0]!.map((cell) => cell.toLowerCase().replace(/\*/g, "").trim());
  const columns: Record<string, number> = {};
  for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
    const index = header.findIndex((cell) => aliases.includes(cell));
    if (index >= 0) columns[key] = index;
  }
  const hasHeader = "email" in columns || "fullName" in columns;
  if (!hasHeader) {
    // No headings: name, email, phone, college, password, cohort — or email first.
    const emailFirst = isEmail(table[0]![0] ?? "") && !isEmail(table[0]![1] ?? "");
    Object.assign(
      columns,
      emailFirst
        ? { email: 0, fullName: 1, phone: 2, organisation: 3, password: 4, cohort: 5 }
        : { fullName: 0, email: 1, phone: 2, organisation: 3, password: 4, cohort: 5 },
    );
  }
  const known = new Set(data.profiles.map((p) => p.email.toLowerCase()));
  const seen = new Set<string>();
  const cohortLookup = (label: string) => {
    const value = label.trim().toLowerCase();
    if (!value) return { programId: null, cohortId: null, ok: true };
    for (const cohort of data.cohorts) {
      const program = data.programs.find((p) => p.id === cohort.program_id);
      const names = [
        cohort.name,
        `${program?.title} — ${cohort.name}`,
        `${program?.title} - ${cohort.name}`,
      ];
      if (names.some((name) => name.toLowerCase() === value))
        return { programId: cohort.program_id, cohortId: cohort.id, ok: true };
    }
    const program = data.programs.find((p) => p.title.toLowerCase() === value || p.slug === value);
    return program
      ? { programId: program.id, cohortId: null, ok: true }
      : { programId: null, cohortId: null, ok: false };
  };
  return table.slice(hasHeader ? 1 : 0).map((cells, index) => {
    const get = (key: string) =>
      columns[key] === undefined ? "" : (cells[columns[key]!] ?? "").trim();
    const email = get("email").toLowerCase();
    const cohortLabel = get("cohort");
    const target = cohortLookup(cohortLabel);
    const password = get("password");
    let problem: string | null = null;
    if (!get("fullName")) problem = "Missing name";
    else if (!isEmail(email)) problem = "Invalid email";
    else if (seen.has(email)) problem = "Duplicate in this list";
    else if (password && password.length < 8) problem = "Password under 8 characters";
    else if (!target.ok) problem = `No cohort or programme called "${cohortLabel}"`;
    seen.add(email);
    return {
      line: index + (hasHeader ? 2 : 1),
      fullName: get("fullName"),
      email,
      phone: get("phone"),
      organisation: get("organisation"),
      password,
      cohortLabel,
      programId: target.programId,
      cohortId: target.cohortId,
      problem,
      existing: known.has(email),
    };
  });
}

const SAMPLE = `Name,Email,Phone,College,Cohort
Aisha Khan,aisha@example.com,9876543210,IIT Bombay,
Rohan Mehta,rohan@example.com,,NMIMS,`;

function BulkImportDrawer({
  data,
  onClose,
  onCreated,
}: {
  data: AdminData;
  onClose: () => void;
  onCreated: (results: CreatedUser[]) => void;
}) {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("");
  const [mustChange, setMustChange] = useState(true);
  const [progress, setProgress] = useState<string | null>(null);
  const rows = useMemo(() => readImport(text, data), [text, data]);
  const ready = rows.filter((row) => !row.problem);
  const problems = rows.length - ready.length;

  async function start() {
    const results: CreatedUser[] = [];
    const fallback = splitTarget(target);
    try {
      for (let i = 0; i < ready.length; i += 100) {
        setProgress(`Creating ${Math.min(i + 100, ready.length)} of ${ready.length}…`);
        const chunk = ready.slice(i, i + 100);
        const result = await createLmsUsers({
          data: {
            users: chunk.map((row) => ({
              fullName: row.fullName,
              email: row.email,
              phone: row.phone,
              organisation: row.organisation,
              ...(row.password ? { password: row.password } : {}),
              ...(row.cohortId || row.programId
                ? { cohortId: row.cohortId, programId: row.programId }
                : {}),
            })),
            ...fallback,
            mustChangePassword: mustChange,
          },
        });
        results.push(...result.results);
      }
      toast.success(`Processed ${results.length} learners.`);
      onCreated(results);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Import failed.");
      if (results.length) onCreated(results);
    } finally {
      setProgress(null);
    }
  }

  return (
    <Drawer
      title="Bulk import learners"
      subtitle="Paste from Excel or Google Sheets, or upload a CSV."
      onClose={onClose}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {rows.length
              ? `${ready.length} ready${problems ? ` · ${problems} need fixing` : ""}`
              : "Up to a few thousand rows at a time."}
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose} disabled={Boolean(progress)}>
              Cancel
            </Button>
            <Button
              variant="brand"
              disabled={!ready.length || Boolean(progress)}
              onClick={() => void start()}
            >
              {progress ?? `Create ${ready.length} login${ready.length === 1 ? "" : "s"}`}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-surface p-4 text-sm leading-6 text-muted-foreground">
          <p>
            Columns: <strong className="text-foreground">Name</strong> and{" "}
            <strong className="text-foreground">Email</strong> are required. Optional: Phone,
            College, Password (blank = generated) and Cohort (a cohort or programme name).
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setText(SAMPLE)}>
              Paste an example
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                downloadFile("learners-template.csv", "Name,Email,Phone,College,Password,Cohort\n")
              }
            >
              <Download /> Template
            </Button>
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-3 text-xs font-medium hover:bg-accent md:h-8">
              <FileUp className="h-4 w-4" /> Upload CSV
              <input
                type="file"
                accept=".csv,.tsv,.txt,text/csv"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void file.text().then(setText);
                  e.currentTarget.value = "";
                }}
              />
            </label>
          </div>
        </div>
        <FieldLabel label="Learners">
          <textarea
            className={cn(fieldCls, "min-h-40 font-mono text-xs")}
            placeholder={SAMPLE}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </FieldLabel>
        <FieldLabel
          label="Enrol everyone in"
          hint="Rows with their own Cohort column use that instead."
        >
          <TargetSelect
            programs={data.programs}
            cohorts={data.cohorts}
            value={target}
            onChange={setTarget}
            emptyLabel="Don't enrol"
          />
        </FieldLabel>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox label="Ask for a new password" checked={mustChange} onChange={setMustChange} />
          Ask them to choose a new password when they first sign in
        </label>
        {rows.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[34rem] text-xs">
              <thead className="border-b border-border bg-surface">
                <tr>
                  <Th>Row</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Cohort</Th>
                  <Th>Check</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.slice(0, 300).map((row) => (
                  <tr key={row.line} className={row.problem ? "bg-destructive/5" : undefined}>
                    <Td className="text-muted-foreground">{row.line}</Td>
                    <Td>{row.fullName}</Td>
                    <Td>{row.email}</Td>
                    <Td>{row.cohortLabel || "—"}</Td>
                    <Td>
                      {row.problem ? (
                        <span className="text-destructive">{row.problem}</span>
                      ) : row.existing ? (
                        <span className="text-cyan">
                          {row.cohortId || row.programId || target
                            ? "Already a learner — will be enrolled"
                            : "Already a learner — no change"}
                        </span>
                      ) : (
                        <span className="text-electric">Ready</span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 300 && (
              <p className="px-4 py-2 text-xs text-muted-foreground">
                Showing the first 300 of {rows.length} rows.
              </p>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}

function PersonDrawer({
  profile,
  data,
  look,
  onClose,
  onCredentials,
  onCertify,
}: {
  profile: LmsProfile;
  data: AdminData;
  look: Lookups;
  onClose: () => void;
  onCredentials: (results: CreatedUser[]) => void;
  onCertify: (recipients: Recipient[]) => void;
}) {
  const [form, setForm] = useState({
    fullName: profile.full_name,
    email: profile.email,
    phone: profile.phone ?? "",
    organisation: profile.organisation ?? "",
  });
  const [target, setTarget] = useState("");
  const { run, busy } = useAction();
  const enrolments = look.enrollmentsOf(profile.id);
  const certificates = data.certificates.filter(
    (c) => c.user_id === profile.id || c.recipient_email === profile.email,
  );
  const submissions = data.submissions.filter((s) => s.user_id === profile.id);
  const suspended = profile.status === "suspended";

  return (
    <Drawer title={profile.full_name} subtitle={profile.email} onClose={onClose}>
      <div className="space-y-8">
        <div className="flex flex-wrap gap-2">
          <Pill tone={suspended ? "closed" : "live"}>{suspended ? "Suspended" : "Active"}</Pill>
          <span className="text-xs text-muted-foreground">
            Added {formatDate(profile.created_at)} · Last active{" "}
            {profile.last_seen_at ? timeAgo(profile.last_seen_at) : "never"}
            {profile.must_change_password && " · Hasn't set their own password yet"}
          </span>
        </div>

        <section className="space-y-4">
          <h3 className="font-display text-sm font-semibold">Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldLabel label="Full name">
              <input
                className={fieldCls}
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </FieldLabel>
            <FieldLabel label="Email (login)">
              <input
                className={fieldCls}
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </FieldLabel>
            <FieldLabel label="Phone">
              <input
                className={fieldCls}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </FieldLabel>
            <FieldLabel label="College or startup">
              <input
                className={fieldCls}
                value={form.organisation}
                onChange={(e) => setForm({ ...form, organisation: e.target.value })}
              />
            </FieldLabel>
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="brand"
              disabled={busy || !form.fullName.trim() || !isEmail(form.email.trim())}
              onClick={() =>
                void run(
                  () =>
                    updateLmsUser({ data: { id: profile.id, ...form, email: form.email.trim() } }),
                  "Details saved.",
                )
              }
            >
              Save details
            </Button>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-display text-sm font-semibold">Programmes</h3>
          {enrolments.length === 0 && (
            <p className="text-sm text-muted-foreground">Not enrolled in anything yet.</p>
          )}
          {enrolments.map((enrolment) => {
            const program = look.programs.get(enrolment.program_id);
            const progress = look.progressOf(profile.id, enrolment.program_id);
            return (
              <div key={enrolment.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{program?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {progress.done} of {progress.total} lessons · {progress.percent}%
                    </p>
                  </div>
                  <button
                    aria-label="Remove from programme"
                    onClick={() => {
                      if (confirmAction(`Remove ${profile.full_name} from ${program?.title}?`))
                        void run(
                          () =>
                            updateLmsEnrollments({
                              data: { ids: [enrolment.id], action: "remove" },
                            }),
                          "Removed from programme.",
                        );
                    }}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <ProgressBar value={progress.percent} className="mt-3" />
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <select
                    className={fieldCls}
                    aria-label="Cohort"
                    value={enrolment.cohort_id ?? ""}
                    onChange={(e) =>
                      void run(
                        () =>
                          updateLmsEnrollments({
                            data: {
                              ids: [enrolment.id],
                              action: "cohort",
                              cohortId: e.target.value || null,
                            },
                          }),
                        "Cohort updated.",
                      )
                    }
                  >
                    <option value="">No cohort</option>
                    {data.cohorts
                      .filter((c) => c.program_id === enrolment.program_id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                  <select
                    className={fieldCls}
                    aria-label="Enrolment status"
                    value={enrolment.status}
                    onChange={(e) =>
                      void run(
                        () =>
                          updateLmsEnrollments({
                            data: {
                              ids: [enrolment.id],
                              action: "status",
                              status: e.target.value as (typeof ENROLLMENT_STATUSES)[number],
                            },
                          }),
                        "Status updated.",
                      )
                    }
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped (hidden from learner)</option>
                  </select>
                </div>
              </div>
            );
          })}
          <div className="flex gap-2">
            <TargetSelect
              programs={data.programs}
              cohorts={data.cohorts}
              value={target}
              onChange={setTarget}
              emptyLabel="Add to a programme…"
            />
            <Button
              variant="outline"
              disabled={!target || busy}
              onClick={() =>
                void run(
                  () => enrolLmsUsers({ data: { userIds: [profile.id], ...splitTarget(target) } }),
                  "Enrolled.",
                ).then(() => setTarget(""))
              }
            >
              <Plus /> Add
            </Button>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="flex items-center justify-between font-display text-sm font-semibold">
            Certificates
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                onCertify([{ userId: profile.id, name: profile.full_name, email: profile.email }])
              }
            >
              <Award /> Issue
            </Button>
          </h3>
          {certificates.length === 0 ? (
            <p className="text-sm text-muted-foreground">None issued yet.</p>
          ) : (
            certificates.map((cert) => (
              <a
                key={cert.id}
                href={`/certificates/${cert.serial}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm hover:border-electric/50"
              >
                <span className="min-w-0 truncate">
                  {cert.title}
                  {cert.program_title && ` · ${cert.program_title}`}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {cert.revoked ? "Revoked" : formatDate(cert.issued_on)}
                </span>
              </a>
            ))
          )}
          <p className="text-xs text-muted-foreground">
            {submissions.length} assignment submission{submissions.length === 1 ? "" : "s"}
          </p>
        </section>

        <section className="space-y-3 border-t border-border pt-6">
          <h3 className="font-display text-sm font-semibold">Access</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={async () => {
                if (!confirmAction("Reset this password? The current one stops working.")) return;
                const result = await run(() => resetLmsPasswords({ data: { ids: [profile.id] } }));
                if (result) onCredentials(result.results);
              }}
            >
              <KeyRound /> Reset password
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() =>
                void run(
                  () =>
                    bulkLmsUsers({
                      data: { ids: [profile.id], action: suspended ? "activate" : "suspend" },
                    }),
                  suspended ? "Access restored." : "Access paused.",
                )
              }
            >
              {suspended ? <Play /> : <Pause />} {suspended ? "Restore access" : "Suspend"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              disabled={busy}
              onClick={async () => {
                if (
                  !confirmAction(
                    `Delete ${profile.full_name}'s account? Their login, progress and submissions are removed. Certificates stay valid.`,
                  )
                )
                  return;
                const done = await run(
                  () => bulkLmsUsers({ data: { ids: [profile.id], action: "delete" } }),
                  "Learner deleted.",
                );
                if (done) onClose();
              }}
            >
              <Trash2 /> Delete account
            </Button>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
