import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { EventItem } from "./content";
import { clearSiteContentCache } from "./content.functions";
import { CONTENT_PAGES, fieldDef, isValidValue, type ContentValue } from "./site-content";

const eventInput = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens"),
  type: z.enum(["Workshop", "Hackathon", "Founder Connect", "Bootcamp"]),
  title: z.string().trim().min(1).max(180),
  date: z.string().date(),
  format: z.enum(["Online", "In-person"]),
  city: z.string().trim().max(120).optional(),
  location: z.string().trim().min(1).max(240),
  summary: z.string().trim().min(1).max(10000),
  image: z.string().trim().url().or(z.string().startsWith("/")),
  registration_url: z.string().trim().url().optional().or(z.literal("")),
  agenda: z.array(z.object({ time: z.string().max(40), item: z.string().max(240) })).max(30),
  eligibility: z.string().trim().min(1).max(500),
  organizer: z.string().trim().min(1).max(180),
  published: z.boolean(),
});

const contentInput = z.object({
  key: z.string().refine((key) => CONTENT_PAGES.some((page) => page.id === key), "Unknown page"),
  value: z.record(z.string(), z.unknown()),
});

const submissionTables = [
  "student_registrations",
  "college_applications",
  "ambassador_applications",
  "contact_enquiries",
  "event_registrations",
  "program_applications",
] as const;

function isAdmin(claims: Record<string, unknown>) {
  const email = typeof claims.email === "string" ? claims.email.toLowerCase() : "";
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(email && allowed.includes(email));
}

function assertAdmin(claims: Record<string, unknown>) {
  if (!isAdmin(claims)) throw new Error("Forbidden: this account is not an administrator.");
}

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    assertAdmin(context.claims as Record<string, unknown>);
    const [events, content, ...submissionResults] = await Promise.all([
      supabaseAdmin.from("admin_events").select("*").order("date", { ascending: true }),
      supabaseAdmin.from("site_content").select("*").order("key"),
      ...submissionTables.map((table) =>
        supabaseAdmin.from(table).select("*").order("created_at", { ascending: false }).limit(200),
      ),
    ]);
    const submissionGroups = Object.fromEntries(
      submissionTables.map((table, index) => [table, submissionResults[index]?.data ?? []]),
    );
    return {
      events: events.data ?? [],
      content: content.data ?? [],
      submissions: submissionGroups,
    };
  });

export const saveAdminEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => eventInput.parse(data))
  .handler(async ({ data, context }) => {
    assertAdmin(context.claims as Record<string, unknown>);
    const { id, ...fields } = data;
    // An emptied city must clear the stored one, not leave it behind.
    const event = { ...fields, city: fields.city || null };
    const query = id
      ? supabaseAdmin.from("admin_events").update(event).eq("id", id)
      : supabaseAdmin.from("admin_events").insert(event);
    const { data: saved, error } = await query
      .select("id, registration_url")
      .single();
    if (error) throw new Error(`Unable to save event: ${error.message}`);
    if ((saved.registration_url ?? "") !== (fields.registration_url ?? "")) {
      throw new Error("The registration URL did not save. Check the Supabase event URL migration.");
    }
    return { ok: true };
  });

export const uploadEventPoster = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        fileName: z.string().trim().min(1).max(120),
        contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
        data: z.string().regex(/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/),
      })
      .refine((value) => value.data.length <= 8_000_000, "Poster must be no larger than 6 MB.")
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context.claims as Record<string, unknown>);
    const { Buffer } = await import("node:buffer");
    const base64 = data.data.slice(data.data.indexOf(",") + 1);
    const bytes = Buffer.from(base64, "base64");
    if (bytes.byteLength > 6 * 1024 * 1024) {
      throw new Error("Poster must be no larger than 6 MB.");
    }
    const safeName = data.fileName.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
    const path = `event-posters/${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabaseAdmin.storage
      .from("event-posters")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(`Unable to upload event poster: ${error.message}`);
    const { data: publicUrl } = supabaseAdmin.storage.from("event-posters").getPublicUrl(path);
    return { url: publicUrl.publicUrl };
  });

export const deleteAdminEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    assertAdmin(context.claims as Record<string, unknown>);
    const { error } = await supabaseAdmin.from("admin_events").delete().eq("id", data.id);
    if (error) throw new Error(`Unable to delete event: ${error.message}`);
    return { ok: true };
  });

export const saveSiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => contentInput.parse(data))
  .handler(async ({ data, context }) => {
    assertAdmin(context.claims as Record<string, unknown>);
    // Keep only known fields whose value has the shape that field expects.
    const value: Record<string, ContentValue> = {};
    for (const [field, fieldValue] of Object.entries(data.value)) {
      const def = fieldDef(data.key, field);
      if (def && isValidValue(def, fieldValue)) value[field] = fieldValue as ContentValue;
    }
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ key: data.key, value, updated_at: new Date().toISOString() });
    if (error) throw new Error(`Unable to save site content: ${error.message}`);
    clearSiteContentCache();
    return { ok: true };
  });

export const updateSubmissionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        table: z.enum(submissionTables),
        id: z.string().uuid(),
        status: z.enum(["new", "reviewing", "contacted", "closed"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context.claims as Record<string, unknown>);
    if (data.table === "event_registrations") {
      throw new Error("Event registrations do not have a status field.");
    }
    const { error } = await supabaseAdmin
      .from(data.table)
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(`Unable to update submission: ${error.message}`);
    return { ok: true };
  });

export const getPublicEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("admin_events")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: true });
  if (error) {
    console.error("Unable to load managed events", error.message);
    return [];
  }
  const managed: EventItem[] = (data ?? []).map((event) => ({
    ...event,
    sample: false,
    agenda: Array.isArray(event.agenda) ? event.agenda : [],
    city: event.city ?? undefined,
    registration_url: event.registration_url?.trim() || null,
  })) as EventItem[];
  return managed;
});
