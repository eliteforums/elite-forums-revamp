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

type Table =
  | "student_registrations"
  | "college_applications"
  | "ambassador_applications"
  | "contact_enquiries"
  | "event_registrations";

type Result = { ok: true } | { ok: false; error: string };

async function insertRow(table: Table, row: Record<string, unknown>): Promise<Result> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { ok: false, error: "Submissions are not configured yet." };
  const sb = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await sb.from(table).insert(row as any);
  if (error) {
    if (error.code === "23505") return { ok: false, error: "You're already registered with this email." };
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
