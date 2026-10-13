import { Download, Mail, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateSubmissionStatus } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";
import {
  FORMS,
  STATUSES,
  downloadCsv,
  rowContext,
  rowDetails,
  rowName,
  type FormTable,
  type Row,
} from "./submissions";
import { Card, Drawer, Empty, PanelHeader, Pill, errorMessage, fieldCls, timeAgo } from "./ui";

export function SubmissionsPanel({
  submissions,
  table,
  setTable,
  refresh,
}: {
  submissions: Record<string, Row[]>;
  table: FormTable;
  setTable: (table: FormTable) => void;
  refresh: () => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const all = useMemo(() => submissions[table] ?? [], [submissions, table]);
  const hasStatus = table !== "event_registrations";
  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return all.filter(
      (row) =>
        (status === "all" || !hasStatus || row["status"] === status) &&
        (!query || JSON.stringify(row).toLowerCase().includes(query)),
    );
  }, [all, search, status, hasStatus]);
  const open = all.find((row) => String(row["id"]) === openId);

  async function changeStatus(row: Row, next: string) {
    setSaving(true);
    try {
      await updateSubmissionStatus({
        data: { table, id: String(row["id"]), status: next as (typeof STATUSES)[number] },
      });
      await refresh();
      toast.success(`Marked as ${next}`);
    } catch (error) {
      toast.error(errorMessage(error, "Unable to update the status."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PanelHeader
        title="Submissions"
        description="Everything people send through the website's forms. Open a row to read the full submission and update its status."
        actions={
          <Button
            variant="outline"
            size="sm"
            disabled={rows.length === 0}
            onClick={() => downloadCsv(table, rows)}
          >
            <Download /> Export CSV
          </Button>
        }
      />
      <div className="-mx-1 mb-5 flex gap-1 overflow-x-auto px-1 pb-1">
        {FORMS.map((form) => {
          const list = submissions[form.table] ?? [];
          const fresh = list.filter((row) => row["status"] === "new").length;
          return (
            <button
              key={form.table}
              onClick={() => {
                setTable(form.table);
                setStatus("all");
              }}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                table === form.table
                  ? "border-electric bg-electric text-ink"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {form.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs font-semibold",
                  table === form.table ? "bg-ink/15" : "bg-muted",
                )}
              >
                {list.length}
              </span>
              {fresh > 0 && table !== form.table && (
                <span
                  className="h-1.5 w-1.5 rounded-full bg-electric"
                  aria-label={`${fresh} new`}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className={cn(fieldCls, "pl-9")}
            placeholder="Search by name, email or any answer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search submissions"
          />
        </label>
        {hasStatus && (
          <select
            className={cn(fieldCls, "w-auto capitalize")}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
      </div>
      {rows.length === 0 ? (
        <Empty title={all.length ? "Nothing matches these filters." : "No submissions yet."}>
          {all.length === 0 && "They will appear here as soon as someone submits this form."}
        </Empty>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Details</th>
                <th className="px-5 py-3 font-medium">Received</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={String(row["id"])}
                  onClick={() => setOpenId(String(row["id"]))}
                  className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-accent/40"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium">{rowName(row)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {String(row["email"] ?? "")}
                    </p>
                  </td>
                  <td className="max-w-xs truncate px-5 py-4 text-muted-foreground">
                    {rowContext(table, row)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                    {timeAgo(row["created_at"])}
                  </td>
                  <td className="px-5 py-4">
                    <Pill tone={hasStatus ? String(row["status"]) : "live"}>
                      {hasStatus ? String(row["status"]) : "registered"}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {open && (
        <SubmissionDrawer
          row={open}
          hasStatus={hasStatus}
          saving={saving}
          onStatus={(next) => void changeStatus(open, next)}
          onClose={() => setOpenId(null)}
        />
      )}
    </>
  );
}

function SubmissionDrawer({
  row,
  hasStatus,
  saving,
  onStatus,
  onClose,
}: {
  row: Row;
  hasStatus: boolean;
  saving: boolean;
  onStatus: (status: string) => void;
  onClose: () => void;
}) {
  const { main, answers } = rowDetails(row);
  const email = String(row["email"] ?? "");
  return (
    <Drawer
      title={rowName(row)}
      subtitle={email}
      onClose={onClose}
      footer={
        email && (
          <Button asChild variant="brand" className="w-full">
            <a href={`mailto:${email}`}>
              <Mail /> Reply by email
            </a>
          </Button>
        )
      }
    >
      {hasStatus && (
        <div className="mb-7">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Status</p>
          <div className="grid grid-cols-4 gap-1 rounded-xl border border-border p-1">
            {STATUSES.map((s) => (
              <button
                key={s}
                disabled={saving}
                onClick={() => onStatus(s)}
                className={cn(
                  "rounded-lg px-2 py-2 text-xs font-medium capitalize transition-colors disabled:opacity-60",
                  row["status"] === s
                    ? "bg-electric text-ink"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      <DetailList entries={main} />
      {answers.length > 0 && (
        <>
          <p className="mb-4 mt-9 border-t border-border pt-6 text-xs font-semibold uppercase tracking-wider text-electric">
            Programme answers
          </p>
          <DetailList entries={answers} />
        </>
      )}
    </Drawer>
  );
}

function DetailList({ entries }: { entries: [string, string][] }) {
  return (
    <dl className="space-y-5">
      {entries.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
