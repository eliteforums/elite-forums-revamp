import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  announcementFor,
  orderLessons,
  type LmsAnnouncement,
  type LmsCertificate,
  type LmsCohort,
  type LmsEnrollment,
  type LmsLesson,
  type LmsModule,
  type LmsProfile,
  type LmsProgram,
  type LmsSession,
  type LmsSubmission,
  type PublicCertificate,
} from "./lms";

/** The LMS tables are not in the generated types; rows are typed in ./lms instead. */
export const lmsDb = () => supabaseAdmin as unknown as SupabaseClient;

export const SETUP_MESSAGE =
  "The learning platform's tables are missing. Run supabase/migrations/0007_lms.sql in the Supabase SQL editor, then reload.";

export function isMissingTable(error: { message?: string; code?: string } | null | undefined) {
  if (!error) return false;
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /lms_\w+/.test(error.message ?? "") ||
    /does not exist|could not find the table/i.test(error.message ?? "")
  );
}

export function isAdminEmail(email: unknown) {
  const value = typeof email === "string" ? email.toLowerCase() : "";
  const allowed = (process.env["ADMIN_EMAILS"] ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(value && allowed.includes(value));
}

function fail(error: { message: string } | null, action: string): never {
  if (isMissingTable(error)) throw new Error(SETUP_MESSAGE);
  throw new Error(`Unable to ${action}: ${error?.message ?? "unknown error"}`);
}

/** Reads every row, a thousand at a time (the API returns at most 1,000 per request). */
export async function selectAll<T>(
  query: (
    from: number,
    to: number,
  ) => PromiseLike<{ data: unknown; error: { message: string } | null }>,
  action: string,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await query(from, from + 999);
    if (error) fail(error, action);
    const page = (data ?? []) as T[];
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
}

type Caller = { userId: string; email: string; isAdmin: boolean; profile: LmsProfile | null };

/** Who is asking. Admins always get in; anyone else needs an active learner account. */
async function caller(context: { userId: string; claims: unknown }): Promise<Caller> {
  const claims = context.claims as Record<string, unknown>;
  const email = typeof claims["email"] === "string" ? (claims["email"] as string) : "";
  const isAdmin = isAdminEmail(email);
  const { data, error } = await lmsDb()
    .from("lms_profiles")
    .select("*")
    .eq("id", context.userId)
    .maybeSingle();
  if (error) fail(error, "load your account");
  const profile = (data as LmsProfile | null) ?? null;
  if (!isAdmin) {
    if (!profile)
      throw new Error(
        "NO_ACCESS: This account doesn't have access to the learning platform. Ask the Elite Forums team for your login details.",
      );
    if (profile.status !== "active")
      throw new Error(
        "NO_ACCESS: Your access has been paused. Contact the Elite Forums team if you think this is a mistake.",
      );
  }
  return { userId: context.userId, email, isAdmin, profile };
}

async function enrollmentsFor(userId: string) {
  const { data, error } = await lmsDb().from("lms_enrollments").select("*").eq("user_id", userId);
  if (error) fail(error, "load your programmes");
  return ((data ?? []) as LmsEnrollment[]).filter((row) => row.status !== "dropped");
}

async function certificatesFor(userId: string, email: string) {
  const { data, error } = await lmsDb()
    .from("lms_certificates")
    .select("*")
    // Emails are stored lower-case, so certificates issued before the account existed match too.
    .or(`user_id.eq.${userId},recipient_email.eq."${email.toLowerCase().replace(/["\\]/g, "")}"`)
    .eq("revoked", false)
    .order("issued_on", { ascending: false });
  if (error) fail(error, "load your certificates");
  return (data ?? []) as LmsCertificate[];
}

/** The signed-in person: learner profile, admin flag, and whether setup is needed. */
export const getLmsMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      const me = await caller(context);
      const seen = me.profile?.last_seen_at ? new Date(me.profile.last_seen_at).getTime() : 0;
      if (me.profile && Date.now() - seen > 5 * 60_000)
        await lmsDb()
          .from("lms_profiles")
          .update({ last_seen_at: new Date().toISOString() })
          .eq("id", me.userId);
      return { ...me, setupRequired: false };
    } catch (error) {
      if (error instanceof Error && error.message === SETUP_MESSAGE) {
        const claims = context.claims as Record<string, unknown>;
        if (isAdminEmail(claims["email"]))
          return {
            userId: context.userId,
            email: String(claims["email"]),
            isAdmin: true,
            profile: null,
            setupRequired: true,
          };
      }
      throw error;
    }
  });

/** Everything on the learner's home page. Admins see every programme as a preview. */
export const getLmsHome = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const me = await caller(context);
    const db = lmsDb();
    const enrollments = me.profile ? await enrollmentsFor(me.userId) : [];
    let programs: LmsProgram[] = [];
    if (me.isAdmin && enrollments.length === 0) {
      const { data, error } = await db.from("lms_programs").select("*").order("position");
      if (error) fail(error, "load programmes");
      programs = (data ?? []) as LmsProgram[];
    } else if (enrollments.length) {
      const { data, error } = await db
        .from("lms_programs")
        .select("*")
        .in(
          "id",
          enrollments.map((row) => row.program_id),
        )
        .eq("published", true)
        .order("position");
      if (error) fail(error, "load your programmes");
      programs = (data ?? []) as LmsProgram[];
    }
    const programIds = programs.map((program) => program.id);
    const cohortIds = enrollments.map((row) => row.cohort_id).filter(Boolean) as string[];
    const none = ["00000000-0000-0000-0000-000000000000"];
    const [modules, lessons, progress, cohorts, sessions, announcements] = await Promise.all([
      db
        .from("lms_modules")
        .select("id, program_id, position")
        .in("program_id", programIds.length ? programIds : none),
      db
        .from("lms_lessons")
        .select("id, program_id, module_id, position, title, kind, duration_minutes")
        .in("program_id", programIds.length ? programIds : none)
        .eq("published", true),
      db
        .from("lms_progress")
        .select("lesson_id, program_id, completed_at")
        .eq("user_id", me.userId),
      db
        .from("lms_cohorts")
        .select("*")
        .in("id", cohortIds.length ? cohortIds : none),
      db
        .from("lms_sessions")
        .select("*")
        .in("cohort_id", cohortIds.length ? cohortIds : none)
        .gte("starts_at", new Date(Date.now() - 3 * 3600_000).toISOString())
        .order("starts_at")
        .limit(8),
      db.from("lms_announcements").select("*").order("created_at", { ascending: false }).limit(60),
    ]);
    for (const result of [modules, lessons, progress, cohorts, sessions, announcements])
      if (result.error) fail(result.error, "load your dashboard");
    const programSet = new Set(programIds);
    const cohortSet = new Set(cohortIds);
    return {
      me,
      enrollments,
      programs,
      modules: (modules.data ?? []) as Pick<LmsModule, "id" | "program_id" | "position">[],
      lessons: (lessons.data ?? []) as Pick<
        LmsLesson,
        "id" | "program_id" | "module_id" | "position" | "title" | "kind" | "duration_minutes"
      >[],
      progress: (progress.data ?? []) as {
        lesson_id: string;
        program_id: string;
        completed_at: string;
      }[],
      cohorts: (cohorts.data ?? []) as LmsCohort[],
      sessions: (sessions.data ?? []) as LmsSession[],
      announcements: ((announcements.data ?? []) as LmsAnnouncement[])
        .filter((row) => me.isAdmin || announcementFor(row, programSet, cohortSet))
        .slice(0, 8),
      certificates: me.profile ? await certificatesFor(me.userId, me.email) : [],
    };
  });

/** One programme with its curriculum, the learner's progress, cohort schedule and news. */
export const getLmsProgram = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ programId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const me = await caller(context);
    const db = lmsDb();
    const { data: programRow, error } = await db
      .from("lms_programs")
      .select("*")
      .eq("id", data.programId)
      .maybeSingle();
    if (error) fail(error, "load the programme");
    const program = programRow as LmsProgram | null;
    const { data: enrollmentRow } = await db
      .from("lms_enrollments")
      .select("*")
      .eq("user_id", me.userId)
      .eq("program_id", data.programId)
      .maybeSingle();
    const enrollment = enrollmentRow as LmsEnrollment | null;
    const allowed =
      program &&
      (me.isAdmin || (program.published && enrollment && enrollment.status !== "dropped"));
    if (!allowed) throw new Error("NOT_FOUND: This programme isn't available on your account.");

    let lessonQuery = db.from("lms_lessons").select("*").eq("program_id", program.id);
    if (!me.isAdmin) lessonQuery = lessonQuery.eq("published", true);
    const cohortId = enrollment?.cohort_id ?? null;
    const [modules, lessons, progress, submissions, cohort, sessions, announcements] =
      await Promise.all([
        db.from("lms_modules").select("*").eq("program_id", program.id).order("position"),
        lessonQuery,
        db
          .from("lms_progress")
          .select("lesson_id, completed_at")
          .eq("user_id", me.userId)
          .eq("program_id", program.id),
        db
          .from("lms_submissions")
          .select("*")
          .eq("user_id", me.userId)
          .eq("program_id", program.id),
        cohortId
          ? db.from("lms_cohorts").select("*").eq("id", cohortId).maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        cohortId
          ? db.from("lms_sessions").select("*").eq("cohort_id", cohortId).order("starts_at")
          : Promise.resolve({ data: [], error: null }),
        db
          .from("lms_announcements")
          .select("*")
          .or(`program_id.eq.${program.id},and(program_id.is.null,cohort_id.is.null)`)
          .order("created_at", { ascending: false })
          .limit(40),
      ]);
    for (const result of [modules, lessons, progress, submissions, cohort, sessions, announcements])
      if (result.error) fail(result.error, "load the programme");
    const moduleRows = (modules.data ?? []) as LmsModule[];
    return {
      isAdmin: me.isAdmin,
      program,
      enrollment,
      modules: moduleRows,
      lessons: orderLessons(moduleRows, (lessons.data ?? []) as LmsLesson[]),
      completed: ((progress.data ?? []) as { lesson_id: string; completed_at: string }[]).map(
        (row) => row.lesson_id,
      ),
      submissions: (submissions.data ?? []) as LmsSubmission[],
      cohort: (cohort.data ?? null) as LmsCohort | null,
      sessions: (sessions.data ?? []) as LmsSession[],
      announcements: ((announcements.data ?? []) as LmsAnnouncement[]).filter(
        (row) => !row.cohort_id || row.cohort_id === cohortId || me.isAdmin,
      ),
    };
  });

/** The lesson, if the caller may open it, with the programme it belongs to. */
async function openLesson(me: Caller, lessonId: string) {
  const db = lmsDb();
  const { data, error } = await db.from("lms_lessons").select("*").eq("id", lessonId).maybeSingle();
  if (error) fail(error, "load the lesson");
  const lesson = data as LmsLesson | null;
  if (!lesson || (!lesson.published && !me.isAdmin))
    throw new Error("This lesson isn't available.");
  if (!me.profile) throw new Error("Progress is only saved for learner accounts.");
  const { data: enrollment } = await db
    .from("lms_enrollments")
    .select("status")
    .eq("user_id", me.userId)
    .eq("program_id", lesson.program_id)
    .maybeSingle();
  if (!enrollment || (enrollment as { status: string }).status === "dropped")
    throw new Error("You aren't enrolled in this programme.");
  return lesson;
}

export const setLessonComplete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ lessonId: z.string().uuid(), complete: z.boolean() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const me = await caller(context);
    const lesson = await openLesson(me, data.lessonId);
    const db = lmsDb();
    const { error } = data.complete
      ? await db
          .from("lms_progress")
          .upsert(
            { user_id: me.userId, lesson_id: lesson.id, program_id: lesson.program_id },
            { onConflict: "user_id,lesson_id", ignoreDuplicates: true },
          )
      : await db.from("lms_progress").delete().eq("user_id", me.userId).eq("lesson_id", lesson.id);
    if (error) fail(error, "save your progress");
    return { ok: true };
  });

export const submitAssignment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        lessonId: z.string().uuid(),
        body: z.string().trim().max(20000),
        link: z.string().trim().url("Enter a full link starting with https://").or(z.literal("")),
      })
      .refine((value) => value.body || value.link, "Write an answer or add a link.")
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const me = await caller(context);
    const lesson = await openLesson(me, data.lessonId);
    if (lesson.kind !== "assignment") throw new Error("This lesson doesn't take submissions.");
    const db = lmsDb();
    const now = new Date().toISOString();
    const { error } = await db.from("lms_submissions").upsert(
      {
        user_id: me.userId,
        lesson_id: lesson.id,
        program_id: lesson.program_id,
        body: data.body,
        link: data.link || null,
        status: "submitted",
        reviewed_at: null,
        updated_at: now,
      },
      { onConflict: "user_id,lesson_id" },
    );
    if (error) fail(error, "send your submission");
    await db
      .from("lms_progress")
      .upsert(
        { user_id: me.userId, lesson_id: lesson.id, program_id: lesson.program_id },
        { onConflict: "user_id,lesson_id", ignoreDuplicates: true },
      );
    return { ok: true };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        fullName: z.string().trim().min(2, "Enter your name").max(120),
        phone: z.string().trim().max(30),
        organisation: z.string().trim().max(160),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const me = await caller(context);
    if (!me.profile) throw new Error("Admin accounts don't have a learner profile.");
    const { error } = await lmsDb()
      .from("lms_profiles")
      .update({
        full_name: data.fullName,
        phone: data.phone || null,
        organisation: data.organisation || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", me.userId);
    if (error) fail(error, "save your details");
    return { ok: true };
  });

export const changeMyPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ password: z.string().min(8, "Use at least 8 characters").max(72) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const me = await caller(context);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(me.userId, {
      password: data.password,
    });
    if (error) throw new Error(`Unable to change your password: ${error.message}`);
    if (me.profile)
      await lmsDb()
        .from("lms_profiles")
        .update({ must_change_password: false, updated_at: new Date().toISOString() })
        .eq("id", me.userId);
    return { ok: true };
  });

/** Public: the details printed on a certificate, for its verification page. */
export const getPublicCertificate = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z
      .object({
        serial: z
          .string()
          .trim()
          .toUpperCase()
          .regex(/^[A-Z0-9-]{6,40}$/),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { data: row, error } = await lmsDb()
      .from("lms_certificates")
      .select("serial, recipient_name, title, program_title, description, issued_on, revoked")
      .eq("serial", data.serial)
      .maybeSingle();
    if (error) {
      console.error("Unable to load certificate", error.message);
      return null;
    }
    return (row as PublicCertificate | null) ?? null;
  });
