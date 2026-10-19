import { answerLabel, programLabel } from "@/lib/program-application";

export type Row = Record<string, unknown>;

/** Every public form, in the order the inbox lists them. */
export const FORMS = [
  { table: "program_applications", label: "Programme applications", context: "program" },
  { table: "student_registrations", label: "Community registrations", context: "institution" },
  { table: "college_applications", label: "College partnerships", context: "institution_name" },
  { table: "ambassador_applications", label: "Ambassador applications", context: "college" },
  { table: "contact_enquiries", label: "Contact enquiries", context: "topic" },
  { table: "event_registrations", label: "Event registrations", context: "event_slug" },
] as const;

export type FormTable = (typeof FORMS)[number]["table"];
export const STATUSES = ["new", "reviewing", "contacted", "closed"] as const;

export const formLabel = (table: string) =>
  FORMS.find((form) => form.table === table)?.label ?? table;

export const rowName = (row: Row) =>
  String(row["full_name"] ?? row["name"] ?? row["rep_name"] ?? row["email"] ?? "Unnamed");

const LABELS: Record<string, string> = {
  full_name: "Full name",
  rep_name: "Representative",
  rep_designation: "Designation",
  ecell_name: "E-Cell name",
  course_year: "Course and year / role",
  profile_url: "Profile link",
  website_url: "Website",
  heard_from: "Heard about us from",
  why_join: "Why they want to join",
  whatsapp_available: "On WhatsApp",
  marketing_opt_in: "Wants updates",
  terms_agreed: "Agreed to terms",
  contact_ok: "Agreed to be contacted",
  accuracy_confirmed: "Confirmed accuracy",
  event_slug: "Event",
  created_at: "Received",
};

const pretty = (key: string) =>
  LABELS[key] ?? key.replaceAll("_", " ").replace(/^./, (first) => first.toUpperCase());

export const showValue = (value: unknown): string =>
  Array.isArray(value)
    ? value.join(", ")
    : typeof value === "boolean"
      ? value
        ? "Yes"
        : "No"
      : value === null || value === undefined
        ? ""
        : String(value);

/** One-line context for the table: which programme, college, topic or event. */
export function rowContext(table: string, row: Row): string {
  const key = FORMS.find((form) => form.table === table)?.context;
  const value = key ? row[key] : undefined;
  return key === "program" ? programLabel(String(value ?? "")) : showValue(value);
}

const HIDDEN = new Set(["id", "status", "answers", "utm"]);

const UTM_LABELS: Record<string, string> = {
  utm_source: "Source",
  utm_medium: "Medium",
  utm_campaign: "Campaign",
  utm_term: "Term",
  utm_content: "Content",
  landing_page: "Landing page",
  referrer: "Referrer",
};

/** Campaign tags saved with a submission (empty before migration 0005). */
export function rowUtm(row: Row): Record<string, string> {
  const raw = row["utm"];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return Object.fromEntries(
    Object.entries(raw).filter(([, value]) => typeof value === "string" && value),
  ) as Record<string, string>;
}

/** Short "where from" label for tables: source / campaign, the referring site, or Direct. */
export function rowSource(row: Row): string {
  const utm = rowUtm(row);
  if (utm["utm_source"])
    return [utm["utm_source"], utm["utm_campaign"]].filter(Boolean).join(" / ");
  if (utm["referrer"]) {
    try {
      return new URL(utm["referrer"]).hostname.replace(/^www\./, "");
    } catch {
      return "Referral";
    }
  }
  return "Direct";
}

/** Labelled answers for one submission, split into the main form and programme-specific answers. */
export function rowDetails(row: Row): {
  main: [string, string][];
  answers: [string, string][];
  source: [string, string][];
} {
  const main: [string, string][] = [];
  for (const [key, value] of Object.entries(row)) {
    if (HIDDEN.has(key)) continue;
    const shown =
      key === "program"
        ? programLabel(String(value))
        : key === "created_at"
          ? new Date(String(value)).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : showValue(value);
    if (shown) main.push([pretty(key), shown]);
  }
  const raw = row["answers"];
  const answers: [string, string][] =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? Object.entries(raw).map(([key, value]) => [
          answerLabel(String(row["program"]), key),
          showValue(value),
        ])
      : [];
  const source = Object.entries(rowUtm(row)).map(
    ([key, value]) => [UTM_LABELS[key] ?? key, value] as [string, string],
  );
  return { main, answers, source };
}

const csvCell = (value: string) => `"${value.replaceAll('"', '""')}"`;

/** Download the given submissions as a spreadsheet-friendly CSV file. */
export function downloadCsv(table: string, rows: Row[]) {
  const columns: string[] = [];
  const records = rows.map((row) => {
    const { main, answers, source } = rowDetails(row);
    const record = new Map<string, string>([
      ...main,
      ...answers,
      ...source,
      ["Status", showValue(row["status"])],
    ]);
    for (const column of record.keys()) if (!columns.includes(column)) columns.push(column);
    return record;
  });
  const body = [
    columns.map(csvCell).join(","),
    ...records.map((record) => columns.map((c) => csvCell(record.get(c) ?? "")).join(",")),
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿" + body], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${table}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
