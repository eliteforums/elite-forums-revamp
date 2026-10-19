import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { FORM_IDS, FORM_META, formSchema, resolveForm, toRow, type FormId } from "./forms";
import { flatten } from "./schemas";
import { attributionSchema } from "./utm";

type Result = { ok: true } | { ok: false; error: string; errors?: Record<string, string> };

/** Server runtime env, accepting either the plain or VITE_-prefixed names. */
function supabaseEnv() {
  return {
    url: process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"],
    key: process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
  };
}

/** Columns added by later migrations; older databases save the submission without them. */
const OPTIONAL_COLUMNS = ["utm", "answers"] as const;

async function insertRow(
  table: (typeof FORM_META)[FormId]["table"],
  row: Record<string, unknown>,
): Promise<Result> {
  const { url, key } = supabaseEnv();
  if (!url || !key) return { ok: false, error: "Submissions are not configured yet." };
  const sb = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  let attempt = { ...row };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { error } = await sb.from(table).insert(attempt as any);
  for (const column of OPTIONAL_COLUMNS) {
    if (!error || !(column in attempt) || !error.message.includes(column)) continue;
    if (column === "answers" && Object.keys(attempt[column] as object).length)
      console.error(`${table}: extra answers dropped — run migration 0006`, attempt[column]);
    const { [column]: _dropped, ...rest } = attempt;
    attempt = rest;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ error } = await sb.from(table).insert(attempt as any));
  }
  if (error) {
    if (error.code === "23505")
      return { ok: false, error: "You're already registered with this email." };
    console.error("insert failed", table, error.code, error.message);
    return { ok: false, error: "We couldn't save your submission. Please try again." };
  }
  return { ok: true };
}

const submissionInput = z.object({
  form: z.enum(FORM_IDS),
  values: z.record(z.string(), z.unknown()),
  programme: z.string().max(60).optional(),
  event_slug: z.string().max(120).optional(),
  hp: z.string().max(200).optional(),
  utm: z.unknown().optional(),
});

/** Every website form submits here; questions and rules come from the form's settings. */
export const submitForm = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => submissionInput.parse(d))
  .handler(async ({ data }): Promise<Result> => {
    if (data.hp) return { ok: true }; // silently drop bots
    const { loadSiteData } = await import("./site-data.server");
    const config = resolveForm(data.form, (await loadSiteData()).forms);
    const meta = FORM_META[data.form];
    if (data.form === "programme" && !config.programmes?.some((p) => p.id === data.programme))
      return {
        ok: false,
        error: "Choose the program you are applying for.",
        errors: { program: "Choose the program you are applying for" },
      };
    if (data.form === "event" && !data.event_slug)
      return { ok: false, error: "This event is not open for registration." };
    const parsed = formSchema(config, data.programme).safeParse(data.values);
    if (!parsed.success)
      return {
        ok: false,
        error: "Some answers are missing or need fixing — they are marked above.",
        errors: flatten(parsed.error),
      };
    const { row, answers } = toRow(data.form, parsed.data);
    return insertRow(meta.table, {
      ...row,
      ...(data.form === "programme" ? { program: data.programme } : {}),
      ...(data.form === "event" ? { event_slug: data.event_slug } : {}),
      answers,
      utm: attributionSchema.parse(data.utm ?? {}),
    });
  });
