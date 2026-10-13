import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import {
  ambassadorSchema,
  collegeSchema,
  contactSchema,
  eventRegSchema,
  studentSchema,
} from "./schemas";
import { COMMON_KEYS, ACKNOWLEDGEMENTS, programApplicationSchema } from "./program-application";

type Table =
  | "student_registrations"
  | "college_applications"
  | "ambassador_applications"
  | "contact_enquiries"
  | "event_registrations"
  | "program_applications";

type Result = { ok: true } | { ok: false; error: string };

/** Server runtime env, accepting either the plain or VITE_-prefixed names. */
function supabaseEnv() {
  return {
    url: process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"],
    key: process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
  };
}

async function insertRow(table: Table, row: Record<string, unknown>): Promise<Result> {
  const { url, key } = supabaseEnv();
  if (!url || !key) return { ok: false, error: "Submissions are not configured yet." };
  const sb = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await sb.from(table).insert(row as any);
  if (error) {
    if (error.code === "23505")
      return { ok: false, error: "You're already registered with this email." };
    console.error("insert failed", table, error.message);
    return { ok: false, error: "We couldn't save your submission. Please try again." };
  }
  return { ok: true };
}

function strip<T extends Record<string, unknown>>(data: T, ...keys: string[]) {
  const copy: Record<string, unknown> = { ...data };
  for (const k of keys) delete copy[k];
  for (const k of Object.keys(copy)) if (copy[k] === "") copy[k] = null;
  return copy;
}

const make = <S extends z.ZodTypeAny>(schema: S, table: Table, hp: string) =>
  createServerFn({ method: "POST" })
    .inputValidator((d: unknown) => schema.parse(d) as z.infer<S>)
    .handler(async ({ data }) => {
      const d = data as Record<string, unknown>;
      if (d[hp]) return { ok: true } as Result; // silently drop bots
      return insertRow(table, strip(d, hp));
    });

export const submitStudent = make(studentSchema, "student_registrations", "website");
export const submitCollege = make(collegeSchema, "college_applications", "url_hp");
export const submitAmbassador = make(ambassadorSchema, "ambassador_applications", "website");
export const submitContact = make(contactSchema, "contact_enquiries", "website");
export const submitEventReg = make(eventRegSchema, "event_registrations", "website");

export const submitProgramApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => programApplicationSchema.parse(d))
  .handler(async ({ data }) => {
    const { website, program, ...fields } = data as Record<string, unknown>;
    if (website) return { ok: true } as Result; // silently drop bots
    // Questions asked of everyone are columns; the rest are programme-specific answers.
    const columnKeys = new Set<string>([...COMMON_KEYS, ...ACKNOWLEDGEMENTS.map((a) => a.key)]);
    const row: Record<string, unknown> = { program };
    const answers: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (columnKeys.has(key)) row[key] = value === "" ? null : value;
      else if (value !== "" && !(Array.isArray(value) && value.length === 0)) answers[key] = value;
    }
    row["whatsapp_available"] = row["whatsapp_available"] === "Yes";
    return insertRow("program_applications", { ...row, answers });
  });
