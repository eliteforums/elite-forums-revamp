import {
  Award,
  Copy,
  Download,
  ExternalLink,
  Pencil,
  RotateCcw,
  ShieldX,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Card,
  Drawer,
  Empty,
  FieldLabel,
  PanelHeader,
  Pill,
  fieldCls,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/content-context";
import {
  certificatePath,
  downloadFile,
  formatDate,
  isEmail,
  parseTable,
  toCsv,
  type LmsCertificate,
} from "@/lib/lms";
import { issueLmsCertificates, updateLmsCertificates } from "@/lib/lms-admin.functions";
import { cn } from "@/lib/utils";
import { CertificateArt, SITE_ORIGIN } from "../Certificate";
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
  todayIso,
  useAction,
  useLookups,
  useSelection,
  type AdminData,
} from "./common";

export type Recipient = { userId?: string | null; name: string; email?: string };

const certUrl = (serial: string) => `${SITE_ORIGIN}${certificatePath(serial)}`;

const exportCertificates = (rows: LmsCertificate[]) =>
  downloadFile(
    `elite-forums-certificates-${todayIso()}.csv`,
    toCsv([
      ["Name", "Email", "Certificate", "Programme", "Issued", "Certificate ID", "Link", "Status"],
      ...rows.map((c) => [
        c.recipient_name,
        c.recipient_email,
        c.title,
        c.program_title,
        c.issued_on,
        c.serial,
        certUrl(c.serial),
        c.revoked ? "Revoked" : "Valid",
      ]),
    ]),
  );

export function CertificatesPanel({ data }: { data: AdminData }) {
  const [query, setQuery] = useState("");
  const [programId, setProgramId] = useState("");
  const [status, setStatus] = useState("all");
  const [issuing, setIssuing] = useState(false);
  const [editing, setEditing] = useState<LmsCertificate | null>(null);
  const { run, busy } = useAction();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.certificates.filter((c) => {
      if (programId && c.program_id !== programId) return false;
      if (status === "valid" && c.revoked) return false;
      if (status === "revoked" && !c.revoked) return false;
      return (
        !q ||
        [c.recipient_name, c.recipient_email ?? "", c.serial, c.title, c.program_title ?? ""].some(
          (value) => value.toLowerCase().includes(q),
        )
      );
    });
  }, [data.certificates, query, programId, status]);
  const selection = useSelection(rows.map((row) => row.id));
  const act = (action: "revoke" | "restore" | "delete", ids: string[], message: string) =>
    run(() => updateLmsCertificates({ data: { ids, action } }), message);

  return (
    <>
      <PanelHeader
        title="Certificates"
        description="Issue certificates to one person or a whole cohort. Each has a public verification page that learners can download as a PDF and add to LinkedIn."
        actions={
          <Button variant="brand" onClick={() => setIssuing(true)}>
            <Award /> Issue certificates
          </Button>
        }
      />
      <Toolbar>
        <SearchBox value={query} onChange={setQuery} placeholder="Search name, email or ID…" />
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
        <select
          className={cn(fieldCls, "w-auto")}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="valid">Valid</option>
          <option value="revoked">Revoked</option>
        </select>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => exportCertificates(rows)}
        >
          <Download /> Export {rows.length}
        </Button>
      </Toolbar>

      <SelectionBar count={selection.count} onClear={selection.clear}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => exportCertificates(data.certificates.filter((c) => selection.has(c.id)))}
        >
          <Download /> Export
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => void act("restore", selection.ids, "Certificates restored.")}
        >
          <RotateCcw /> Restore
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => {
            if (
              confirmAction(
                `Revoke ${selection.count} certificates? Their pages will say they're no longer valid.`,
              )
            )
              void act("revoke", selection.ids, "Certificates revoked.");
          }}
        >
          <ShieldX /> Revoke
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive"
          disabled={busy}
          onClick={() => {
            if (
              confirmAction(
                `Delete ${selection.count} certificates permanently? Their links will stop working.`,
              )
            )
              void act("delete", selection.ids, "Certificates deleted.").then(selection.clear);
          }}
        >
          <Trash2 /> Delete
        </Button>
      </SelectionBar>

      {data.certificates.length === 0 ? (
        <Empty title="No certificates issued yet">
          Use Issue certificates to award one person, a cohort, or a pasted list.
        </Empty>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-sm">
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
                <Th>Recipient</Th>
                <Th>Certificate</Th>
                <Th>Issued</Th>
                <Th>ID</Th>
                <Th />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((cert) => (
                <tr key={cert.id} className={cn(cert.revoked && "opacity-60")}>
                  <Td>
                    <Checkbox
                      label={`Select ${cert.recipient_name}`}
                      checked={selection.has(cert.id)}
                      onChange={(on) => selection.toggle(cert.id, on)}
                    />
                  </Td>
                  <Td>
                    <p className="font-medium">{cert.recipient_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cert.recipient_email ?? "No email"}
                    </p>
                  </Td>
                  <Td>
                    <p>{cert.title}</p>
                    {cert.program_title && (
                      <p className="text-xs text-muted-foreground">{cert.program_title}</p>
                    )}
                  </Td>
                  <Td className="whitespace-nowrap text-xs">{formatDate(cert.issued_on)}</Td>
                  <Td>
                    <span className="font-mono text-xs">{cert.serial}</span>
                    {cert.revoked && (
                      <span className="ml-2">
                        <Pill tone="closed">Revoked</Pill>
                      </span>
                    )}
                  </Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <IconButton
                        label="Copy link"
                        onClick={() =>
                          void navigator.clipboard
                            .writeText(certUrl(cert.serial))
                            .then(() => toast.success("Link copied."))
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </IconButton>
                      <a
                        href={certificatePath(cert.serial)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open certificate"
                        className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <IconButton label="Edit" onClick={() => setEditing(cert)}>
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No certificates match these filters.
            </p>
          )}
        </Card>
      )}

      {issuing && <IssueCertificatesDrawer data={data} onClose={() => setIssuing(false)} />}
      {editing && <EditCertificateDrawer cert={editing} onClose={() => setEditing(null)} />}
    </>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      {children}
    </button>
  );
}

type Mode = "programme" | "people" | "paste";

/** Issue one or many certificates. `initial` pre-fills the recipients (from People). */
export function IssueCertificatesDrawer({
  data,
  initial,
  onClose,
}: {
  data: AdminData;
  initial?: Recipient[];
  onClose: () => void;
}) {
  const c = useContent("lms");
  const look = useLookups(data);
  const [mode, setMode] = useState<Mode>(initial ? "people" : "programme");
  const [target, setTarget] = useState("");
  const [onlyFinished, setOnlyFinished] = useState(false);
  const [picked, setPicked] = useState<Recipient[]>(initial ?? []);
  const [search, setSearch] = useState("");
  const [pasted, setPasted] = useState("");
  const [title, setTitle] = useState("");
  const [programLine, setProgramLine] = useState("");
  const [description, setDescription] = useState("");
  const [issuedOn, setIssuedOn] = useState(todayIso());
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [issued, setIssued] = useState<{ rows: LmsCertificate[]; skipped: string[] } | null>(null);
  const { run, busy } = useAction();
  const { programId, cohortId } = splitTarget(target);
  const program = programId ? look.programs.get(programId) : undefined;
  const cohort = cohortId ? look.cohorts.get(cohortId) : undefined;

  // Learners in the chosen programme or cohort, with their progress.
  const members = useMemo(() => {
    if (!programId) return [];
    return data.enrollments
      .filter(
        (e) =>
          e.program_id === programId &&
          e.status !== "dropped" &&
          (!cohortId || e.cohort_id === cohortId),
      )
      .map((e) => ({
        enrolment: e,
        profile: look.profiles.get(e.user_id),
        progress: look.progressOf(e.user_id, programId),
      }))
      .filter((row) => row.profile)
      .filter(
        (row) =>
          !onlyFinished || row.progress.percent === 100 || row.enrolment.status === "completed",
      );
  }, [data.enrollments, programId, cohortId, onlyFinished, look]);
  const memberSelection = useSelection(members.map((m) => m.profile!.id));

  const pastedRecipients = useMemo<(Recipient & { problem?: string })[]>(() => {
    const byEmail = new Map(data.profiles.map((p) => [p.email.toLowerCase(), p]));
    return parseTable(pasted)
      .filter((cells) => !/^(name|full name)$/i.test(cells[0] ?? ""))
      .map((cells) => {
        const [first = "", second = ""] = cells;
        const [name, email] = isEmail(first) ? [second, first] : [first, second];
        const profile = email ? byEmail.get(email.toLowerCase()) : undefined;
        return {
          name: name || profile?.full_name || "",
          email: email.toLowerCase(),
          userId: profile?.id ?? null,
          ...(!name && !profile
            ? { problem: "Missing name" }
            : email && !isEmail(email)
              ? { problem: "Invalid email" }
              : {}),
        };
      });
  }, [pasted, data.profiles]);

  const recipients: Recipient[] =
    mode === "programme"
      ? members
          .filter((m) => memberSelection.has(m.profile!.id))
          .map((m) => ({
            userId: m.profile!.id,
            name: m.profile!.full_name,
            email: m.profile!.email,
          }))
      : mode === "people"
        ? picked
        : pastedRecipients.filter((r) => !r.problem);

  const defaultTitle = program?.certificate_title || c.t("cert.defaultTitle");
  const defaultLine = [program?.title, cohort?.name].filter(Boolean).join(" · ");
  const finalTitle = title.trim() || defaultTitle;
  const finalLine = programLine.trim() || defaultLine;

  const searchResults = search.trim()
    ? data.profiles
        .filter((p) =>
          [p.full_name, p.email].some((v) => v.toLowerCase().includes(search.trim().toLowerCase())),
        )
        .filter((p) => !picked.some((r) => r.userId === p.id))
        .slice(0, 8)
    : [];

  async function issue() {
    const result = await run(
      () =>
        issueLmsCertificates({
          data: {
            recipients: recipients.map((r) => ({
              userId: r.userId ?? null,
              name: r.name,
              email: r.email ?? "",
            })),
            title: finalTitle,
            programId,
            cohortId,
            programTitle: finalLine,
            description,
            issuedOn,
            skipDuplicates,
          },
        }),
      (r) => `Issued ${r.issued.length} certificate${r.issued.length === 1 ? "" : "s"}.`,
    );
    if (result) setIssued({ rows: result.issued, skipped: result.skipped });
  }

  if (issued)
    return (
      <Drawer
        title="Certificates issued"
        subtitle={`${issued.rows.length} issued${issued.skipped.length ? ` · ${issued.skipped.length} skipped (already had one)` : ""}`}
        onClose={onClose}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => exportCertificates(issued.rows)}>
              <Download /> Download list
            </Button>
            <Button variant="brand" onClick={onClose}>
              Done
            </Button>
          </div>
        }
      >
        <p className="mb-4 text-sm text-muted-foreground">
          Learners with an account see these under My certificates. Share the links below with
          anyone else.
        </p>
        <ul className="divide-y divide-border rounded-xl border border-border">
          {issued.rows.map((cert) => (
            <li key={cert.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="min-w-0 truncate">{cert.recipient_name}</span>
              <a
                href={certificatePath(cert.serial)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-electric hover:underline"
              >
                {cert.serial} <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          ))}
        </ul>
        {issued.skipped.length > 0 && (
          <p className="mt-4 text-xs text-muted-foreground">Skipped: {issued.skipped.join(", ")}</p>
        )}
      </Drawer>
    );

  return (
    <Drawer
      title="Issue certificates"
      subtitle="Pick who receives one, then check the wording."
      onClose={onClose}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Checkbox
              label="Skip duplicates"
              checked={skipDuplicates}
              onChange={setSkipDuplicates}
            />
            Skip people who already have this certificate
          </label>
          <Button
            variant="brand"
            disabled={!recipients.length || busy}
            onClick={() => void issue()}
          >
            <Award />{" "}
            {busy
              ? "Issuing…"
              : `Issue ${recipients.length || ""} certificate${recipients.length === 1 ? "" : "s"}`}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-1 rounded-xl border border-border p-1" role="tablist">
          {(
            [
              ["programme", "Cohort or programme"],
              ["people", "Pick people"],
              ["paste", "Paste a list"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={mode === id}
              onClick={() => setMode(id)}
              className={cn(
                "min-h-10 rounded-lg px-2 text-xs font-medium transition-colors sm:text-sm",
                mode === id
                  ? "bg-electric/15 text-electric"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <FieldLabel
          label="Programme"
          hint={
            mode === "programme" ? undefined : "Optional: links the certificates to a programme."
          }
        >
          <TargetSelect
            programs={data.programs}
            cohorts={data.cohorts}
            value={target}
            onChange={(value) => {
              setTarget(value);
              memberSelection.clear();
            }}
            emptyLabel={
              mode === "programme" ? "Choose a programme or cohort" : "Not linked to a programme"
            }
          />
        </FieldLabel>

        {mode === "programme" && programId && (
          <div className="rounded-xl border border-border">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  label="Select all"
                  checked={memberSelection.allChecked}
                  indeterminate={memberSelection.someChecked}
                  onChange={memberSelection.toggleAll}
                />
                {members.length} learner{members.length === 1 ? "" : "s"}
              </label>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox label="Only finished" checked={onlyFinished} onChange={setOnlyFinished} />
                Only those who finished
              </label>
            </div>
            <ul className="max-h-72 divide-y divide-border overflow-y-auto">
              {members.map(({ profile, progress }) => (
                <li key={profile!.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/30">
                    <Checkbox
                      label={`Select ${profile!.full_name}`}
                      checked={memberSelection.has(profile!.id)}
                      onChange={(on) => memberSelection.toggle(profile!.id, on)}
                    />
                    <span className="min-w-0 flex-1 truncate">{profile!.full_name}</span>
                    <span
                      className={cn(
                        "text-xs tabular-nums",
                        progress.percent === 100 ? "text-electric" : "text-muted-foreground",
                      )}
                    >
                      {progress.percent}%
                    </span>
                  </label>
                </li>
              ))}
              {members.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No learners match.
                </li>
              )}
            </ul>
          </div>
        )}

        {mode === "people" && (
          <div className="space-y-3">
            <SearchBox value={search} onChange={setSearch} placeholder="Find a learner…" />
            {searchResults.length > 0 && (
              <ul className="divide-y divide-border rounded-xl border border-border">
                {searchResults.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => {
                        setPicked([...picked, { userId: p.id, name: p.full_name, email: p.email }]);
                        setSearch("");
                      }}
                      className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm hover:bg-accent/30"
                    >
                      <span className="truncate">{p.full_name}</span>
                      <span className="truncate text-xs text-muted-foreground">{p.email}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <ExternalRecipient onAdd={(r) => setPicked([...picked, r])} />
            {picked.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {picked.map((r, i) => (
                  <li
                    key={`${r.userId ?? r.email ?? r.name}-${i}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border py-1 pl-3 pr-1 text-sm"
                  >
                    {r.name}
                    <button
                      aria-label={`Remove ${r.name}`}
                      onClick={() => setPicked(picked.filter((_, j) => j !== i))}
                      className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {mode === "paste" && (
          <FieldLabel
            label="Recipients"
            hint="One per line: name, email. Email is optional; matching emails link to learner accounts."
          >
            <textarea
              className={cn(fieldCls, "min-h-36 font-mono text-xs")}
              placeholder={"Aisha Khan, aisha@example.com\nRohan Mehta, rohan@example.com"}
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
            />
            {pastedRecipients.some((r) => r.problem) && (
              <p className="text-xs text-destructive">
                {pastedRecipients.filter((r) => r.problem).length} line(s) skipped: missing name or
                invalid email.
              </p>
            )}
          </FieldLabel>
        )}

        <div className="space-y-4 border-t border-border pt-6">
          <h3 className="font-display text-sm font-semibold">Wording</h3>
          <FieldLabel label="Certificate title">
            <input
              className={fieldCls}
              value={title}
              placeholder={defaultTitle}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Programme line" hint="Printed under the name.">
            <input
              className={fieldCls}
              value={programLine}
              placeholder={defaultLine || "e.g. Founder Bootcamp · Cohort 1"}
              onChange={(e) => setProgramLine(e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Description (optional)">
            <textarea
              className={cn(fieldCls, "min-h-20")}
              value={description}
              maxLength={1000}
              placeholder="e.g. For completing 8 weeks of founder training, including a final investor pitch."
              onChange={(e) => setDescription(e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Date of issue">
            <input
              type="date"
              className={fieldCls}
              value={issuedOn}
              onChange={(e) => setIssuedOn(e.target.value)}
            />
          </FieldLabel>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Preview</p>
          <div className="overflow-hidden rounded-xl ring-1 ring-border">
            <CertificateArt
              certificate={{
                serial: `EF-${issuedOn.slice(0, 4)}-XXXXXX`,
                recipient_name: recipients[0]?.name || "Recipient name",
                title: finalTitle,
                program_title: finalLine || null,
                description: description || null,
                issued_on: issuedOn,
                revoked: false,
              }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Signatures, issuer and footer are edited in Website admin → Site content → Learning
            platform.
          </p>
        </div>
      </div>
    </Drawer>
  );
}

function ExternalRecipient({ onAdd }: { onAdd: (recipient: Recipient) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const valid = name.trim() && (!email.trim() || isEmail(email.trim()));
  return (
    <div className="rounded-xl border border-dashed border-border p-3">
      <p className="mb-2 text-xs text-muted-foreground">Someone without a learner account</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className={fieldCls}
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={fieldCls}
          placeholder="Email (optional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="outline"
          disabled={!valid}
          onClick={() => {
            onAdd({ name: name.trim(), email: email.trim().toLowerCase(), userId: null });
            setName("");
            setEmail("");
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

function EditCertificateDrawer({ cert, onClose }: { cert: LmsCertificate; onClose: () => void }) {
  const [form, setForm] = useState({
    recipient_name: cert.recipient_name,
    recipient_email: cert.recipient_email ?? "",
    title: cert.title,
    program_title: cert.program_title ?? "",
    description: cert.description ?? "",
    issued_on: cert.issued_on,
  });
  const { run, busy } = useAction();
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <Drawer
      title="Edit certificate"
      subtitle={cert.serial}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-between gap-2">
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() =>
              void run(
                () =>
                  updateLmsCertificates({
                    data: { ids: [cert.id], action: cert.revoked ? "restore" : "revoke" },
                  }),
                cert.revoked ? "Certificate restored." : "Certificate revoked.",
              ).then(onClose)
            }
          >
            {cert.revoked ? <RotateCcw /> : <ShieldX />} {cert.revoked ? "Restore" : "Revoke"}
          </Button>
          <Button
            variant="brand"
            disabled={busy || !form.recipient_name.trim() || !form.title.trim()}
            onClick={() =>
              void run(
                () =>
                  updateLmsCertificates({ data: { ids: [cert.id], action: "edit", fields: form } }),
                "Certificate updated.",
              ).then((ok) => ok && onClose())
            }
          >
            Save changes
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FieldLabel label="Recipient name">
          <input
            className={fieldCls}
            value={form.recipient_name}
            onChange={set("recipient_name")}
          />
        </FieldLabel>
        <FieldLabel label="Recipient email" hint="Links it to the learner account with this email.">
          <input
            className={fieldCls}
            type="email"
            value={form.recipient_email}
            onChange={set("recipient_email")}
          />
        </FieldLabel>
        <FieldLabel label="Certificate title">
          <input className={fieldCls} value={form.title} onChange={set("title")} />
        </FieldLabel>
        <FieldLabel label="Programme line">
          <input className={fieldCls} value={form.program_title} onChange={set("program_title")} />
        </FieldLabel>
        <FieldLabel label="Description">
          <textarea
            className={cn(fieldCls, "min-h-20")}
            value={form.description}
            onChange={set("description")}
          />
        </FieldLabel>
        <FieldLabel label="Date of issue">
          <input
            type="date"
            className={fieldCls}
            value={form.issued_on}
            onChange={set("issued_on")}
          />
        </FieldLabel>
        <div className="overflow-hidden rounded-xl ring-1 ring-border">
          <CertificateArt
            certificate={{
              serial: cert.serial,
              recipient_name: form.recipient_name,
              title: form.title,
              program_title: form.program_title || null,
              description: form.description || null,
              issued_on: form.issued_on,
              revoked: cert.revoked,
            }}
          />
        </div>
      </div>
    </Drawer>
  );
}
