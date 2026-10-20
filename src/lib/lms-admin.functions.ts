import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  COHORT_STATUSES,
  ENROLLMENT_STATUSES,
  LESSON_KINDS,
  PROGRAM_KINDS,
  SUBMISSION_STATUSES,
  certificateSerial,
  generatePassword,
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
  type ProgressRow,
} from "./lms";
import { SETUP_MESSAGE, isAdminEmail, isMissingTable, lmsDb, selectAll } from "./lms.functions";

function assertAdmin(context: { claims: unknown }) {
  const claims = context.claims as Record<string, unknown>;
  if (!isAdminEmail(claims["email"]))
    throw new Error("Forbidden: this account is not an administrator.");
}

function fail(error: { message: string; code?: string } | null, action: string): never {
  if (isMissingTable(error)) throw new Error(SETUP_MESSAGE);
  throw new Error(`Unable to ${action}: ${error?.message ?? "unknown error"}`);
}

const now = () => new Date().toISOString();

/** Runs `task` over `items`, a few at a time, keeping the original order. */
async function inBatches<T, R>(items: T[], size: number, task: (item: T) => Promise<R>) {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += size)
    results.push(...(await Promise.all(items.slice(i, i + size).map(task))));
  return results;
}

const uuid = z.string().uuid();
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null);
const link = z
  .string()
  .trim()
  .max(2000)
  .refine(
    (value) => !value || /^https?:\/\//i.test(value) || value.startsWith("/"),
    "Enter a full link starting with https://",
  )
  .transform((value) => value || null);
const day = z
  .string()
  .trim()
  .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), "Use a valid date")
  .transform((value) => value || null);

export const getLmsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    assertAdmin(context);
    const db = lmsDb();
    const all = <T>(table: string, order: string, ascending = true) =>
      selectAll<T>(
        (from, to) => db.from(table).select("*").order(order, { ascending }).range(from, to),
        `load ${table.replace("lms_", "")}`,
      );
    try {
      const [
        profiles,
        programs,
        cohorts,
        enrollments,
        modules,
        lessons,
        progress,
        sessions,
        announcements,
        certificates,
        submissions,
      ] = await Promise.all([
        all<LmsProfile>("lms_profiles", "created_at", false),
        all<LmsProgram>("lms_programs", "position"),
        all<LmsCohort>("lms_cohorts", "created_at", false),
        all<LmsEnrollment>("lms_enrollments", "created_at"),
        all<LmsModule>("lms_modules", "position"),
        all<LmsLesson>("lms_lessons", "position"),
        selectAll<ProgressRow>(
          (from, to) => db.from("lms_progress_summary").select("*").range(from, to),
          "load progress",
        ),
        all<LmsSession>("lms_sessions", "starts_at"),
        all<LmsAnnouncement>("lms_announcements", "created_at", false),
        all<LmsCertificate>("lms_certificates", "created_at", false),
        db
          .from("lms_submissions")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(1000)
          .then(({ data, error }) => {
            if (error) fail(error, "load submissions");
            return (data ?? []) as LmsSubmission[];
          }),
      ]);
      return {
        setupRequired: false,
        profiles,
        programs,
        cohorts,
        enrollments,
        modules,
        lessons,
        progress,
        sessions,
        announcements,
        certificates,
        submissions,
      };
    } catch (error) {
      if (error instanceof Error && error.message === SETUP_MESSAGE)
        return {
          setupRequired: true,
          profiles: [] as LmsProfile[],
          programs: [] as LmsProgram[],
          cohorts: [] as LmsCohort[],
          enrollments: [] as LmsEnrollment[],
          modules: [] as LmsModule[],
          lessons: [] as LmsLesson[],
          progress: [] as ProgressRow[],
          sessions: [] as LmsSession[],
          announcements: [] as LmsAnnouncement[],
          certificates: [] as LmsCertificate[],
          submissions: [] as LmsSubmission[],
        };
      throw error;
    }
  });

/* ----------------------------------------------------------------- People */

const newUser = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: z.string().trim().max(30).optional(),
  organisation: z.string().trim().max(160).optional(),
  password: z
    .string()
    .max(72)
    .refine((value) => !value || value.length >= 8, "Passwords need at least 8 characters")
    .optional(),
  cohortId: uuid.nullable().optional(),
  programId: uuid.nullable().optional(),
});

export type CreatedUser = {
  email: string;
  fullName: string;
  outcome: "created" | "existing" | "linked" | "failed";
  password?: string;
  message?: string;
};

/** Resolves a cohort or programme choice into the enrolment it means. */
async function enrolmentTarget(programId?: string | null, cohortId?: string | null) {
  if (cohortId) {
    const { data, error } = await lmsDb()
      .from("lms_cohorts")
      .select("id, program_id")
      .eq("id", cohortId)
      .maybeSingle();
    if (error) fail(error, "find the cohort");
    if (!data) throw new Error("That cohort no longer exists.");
    return { program_id: (data as LmsCohort).program_id, cohort_id: cohortId };
  }
  return programId ? { program_id: programId, cohort_id: null } : null;
}

async function enrol(userIds: string[], target: { program_id: string; cohort_id: string | null }) {
  if (!userIds.length) return;
  const { error } = await lmsDb()
    .from("lms_enrollments")
    .upsert(
      userIds.map((user_id) => ({ user_id, ...target, status: "active", updated_at: now() })),
      { onConflict: "user_id,program_id" },
    );
  if (error) fail(error, "enrol learners");
}

/** Login accounts by email, read only when a new account clashes with an existing login. */
async function authUsersByEmail() {
  const map = new Map<string, string>();
  for (let page = 1; page < 50; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`Unable to look up existing logins: ${error.message}`);
    for (const user of data.users) if (user.email) map.set(user.email.toLowerCase(), user.id);
    if (data.users.length < 1000) break;
  }
  return map;
}

export const createLmsUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        users: z.array(newUser).min(1).max(500),
        cohortId: uuid.nullable().optional(),
        programId: uuid.nullable().optional(),
        mustChangePassword: z.boolean().default(true),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const db = lmsDb();
    const seen = new Set<string>();
    const users = data.users.filter((user) => !seen.has(user.email) && seen.add(user.email));
    const existing = new Map<string, string>();
    for (let i = 0; i < users.length; i += 200) {
      const { data: rows, error } = await db
        .from("lms_profiles")
        .select("id, email")
        .in(
          "email",
          users.slice(i, i + 200).map((user) => user.email),
        );
      if (error) fail(error, "check existing learners");
      for (const row of (rows ?? []) as { id: string; email: string }[])
        existing.set(row.email, row.id);
    }
    let logins: Map<string, string> | null = null;
    const targets = new Map<string, { program_id: string; cohort_id: string | null } | null>();
    const targetFor = async (user: z.infer<typeof newUser>) => {
      const cohortId = user.cohortId ?? data.cohortId ?? null;
      const programId = user.programId ?? data.programId ?? null;
      const key = `${cohortId}|${programId}`;
      if (!targets.has(key)) targets.set(key, await enrolmentTarget(programId, cohortId));
      return targets.get(key)!;
    };

    const results = await inBatches(users, 4, async (user): Promise<CreatedUser> => {
      const base = { email: user.email, fullName: user.fullName };
      try {
        const target = await targetFor(user);
        const known = existing.get(user.email);
        if (known) {
          if (target) await enrol([known], target);
          return {
            ...base,
            outcome: "existing",
            message: target ? "Already a learner; enrolled." : "Already a learner.",
          };
        }
        const password = user.password || generatePassword();
        let id: string | undefined;
        let outcome: CreatedUser["outcome"] = "created";
        const created = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password,
          email_confirm: true,
          user_metadata: { full_name: user.fullName },
        });
        if (created.error) {
          if (!/already|exists|registered/i.test(created.error.message))
            throw new Error(created.error.message);
          logins ??= await authUsersByEmail();
          id = logins.get(user.email);
          if (!id) throw new Error(created.error.message);
          outcome = "linked";
        } else id = created.data.user.id;
        const { error } = await db.from("lms_profiles").insert({
          id,
          email: user.email,
          full_name: user.fullName,
          phone: user.phone || null,
          organisation: user.organisation || null,
          must_change_password: outcome === "created" && data.mustChangePassword,
        });
        if (error) fail(error, "save the learner");
        if (target) await enrol([id], target);
        return outcome === "created"
          ? { ...base, outcome, password }
          : {
              ...base,
              outcome,
              message: "This email already had a login, so its password was kept.",
            };
      } catch (error) {
        return {
          ...base,
          outcome: "failed",
          message: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });
    return { results };
  });

export const updateLmsUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: uuid,
        fullName: z.string().trim().min(1).max(120),
        email: z.string().trim().toLowerCase().email(),
        phone: z.string().trim().max(30),
        organisation: z.string().trim().max(160),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const db = lmsDb();
    const { data: current, error: readError } = await db
      .from("lms_profiles")
      .select("email")
      .eq("id", data.id)
      .single();
    if (readError) fail(readError, "find the learner");
    if ((current as { email: string }).email !== data.email) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(data.id, {
        email: data.email,
        email_confirm: true,
      });
      if (error) throw new Error(`Unable to change the login email: ${error.message}`);
    }
    const { error } = await db
      .from("lms_profiles")
      .update({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        organisation: data.organisation || null,
        updated_at: now(),
      })
      .eq("id", data.id);
    if (error) fail(error, "save the learner");
    return { ok: true };
  });

export const resetLmsPasswords = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        ids: z.array(uuid).min(1).max(500),
        password: z.string().min(8).max(72).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const db = lmsDb();
    const { data: rows, error } = await db
      .from("lms_profiles")
      .select("id, email, full_name")
      .in("id", data.ids);
    if (error) fail(error, "find the learners");
    const profiles = (rows ?? []) as Pick<LmsProfile, "id" | "email" | "full_name">[];
    const results = await inBatches(profiles, 4, async (profile): Promise<CreatedUser> => {
      const password = data.password ?? generatePassword();
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(profile.id, {
        password,
      });
      if (authError)
        return {
          email: profile.email,
          fullName: profile.full_name,
          outcome: "failed",
          message: authError.message,
        };
      await db
        .from("lms_profiles")
        .update({ must_change_password: true, updated_at: now() })
        .eq("id", profile.id);
      return { email: profile.email, fullName: profile.full_name, outcome: "created", password };
    });
    return { results };
  });

export const bulkLmsUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        ids: z.array(uuid).min(1).max(1000),
        action: z.enum(["suspend", "activate", "delete"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const db = lmsDb();
    const { data: rows, error } = await db
      .from("lms_profiles")
      .select("id, email")
      .in("id", data.ids);
    if (error) fail(error, "find the learners");
    const profiles = (rows ?? []) as { id: string; email: string }[];
    const failures: string[] = [];
    if (data.action === "delete") {
      await inBatches(profiles, 4, async (profile) => {
        if (isAdminEmail(profile.email)) {
          // An administrator keeps their login; only the learner profile goes.
          const { error: deleteError } = await db
            .from("lms_profiles")
            .delete()
            .eq("id", profile.id);
          if (deleteError) failures.push(`${profile.email}: ${deleteError.message}`);
          return;
        }
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(profile.id);
        if (deleteError) failures.push(`${profile.email}: ${deleteError.message}`);
      });
    } else {
      const suspend = data.action === "suspend";
      await inBatches(profiles, 4, async (profile) => {
        if (isAdminEmail(profile.email)) return;
        const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(profile.id, {
          ban_duration: suspend ? "876000h" : "none",
        });
        if (banError) failures.push(`${profile.email}: ${banError.message}`);
      });
      const { error: updateError } = await db
        .from("lms_profiles")
        .update({ status: suspend ? "suspended" : "active", updated_at: now() })
        .in(
          "id",
          profiles.map((profile) => profile.id),
        );
      if (updateError) fail(updateError, "update the learners");
    }
    return { ok: failures.length === 0, failures };
  });

/* -------------------------------------------------------------- Enrolment */

export const enrolLmsUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        userIds: z.array(uuid).min(1).max(2000),
        programId: uuid.nullable().optional(),
        cohortId: uuid.nullable().optional(),
      })
      .refine((value) => value.programId || value.cohortId, "Choose a programme or cohort.")
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const target = await enrolmentTarget(data.programId, data.cohortId);
    for (let i = 0; i < data.userIds.length; i += 500)
      await enrol(data.userIds.slice(i, i + 500), target!);
    return { ok: true };
  });

export const updateLmsEnrollments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        ids: z.array(uuid).min(1).max(2000),
        action: z.enum(["status", "cohort", "remove"]),
        status: z.enum(ENROLLMENT_STATUSES).optional(),
        cohortId: uuid.nullable().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const db = lmsDb();
    const query =
      data.action === "remove"
        ? db.from("lms_enrollments").delete().in("id", data.ids)
        : db
            .from("lms_enrollments")
            .update(
              data.action === "status"
                ? { status: data.status ?? "active", updated_at: now() }
                : { cohort_id: data.cohortId ?? null, updated_at: now() },
            )
            .in("id", data.ids);
    const { error } = await query;
    if (error) fail(error, "update the enrolments");
    return { ok: true };
  });

/* ------------------------------------------------- Programmes and content */

const recordInput = z.discriminatedUnion("entity", [
  z.object({
    entity: z.literal("program"),
    id: uuid.optional(),
    data: z.object({
      slug: z
        .string()
        .trim()
        .regex(/^[a-z0-9-]{1,80}$/, "Use lowercase letters, numbers and hyphens"),
      title: z.string().trim().min(1, "Add a title").max(180),
      kind: z.enum(PROGRAM_KINDS),
      summary: z.string().trim().max(500),
      description: z.string().trim().max(20000),
      cover_image: link,
      certificate_title: optionalText(180),
      published: z.boolean(),
    }),
  }),
  z.object({
    entity: z.literal("module"),
    id: uuid.optional(),
    data: z.object({
      program_id: uuid,
      title: z.string().trim().min(1, "Add a title").max(180),
      summary: z.string().trim().max(1000),
    }),
  }),
  z.object({
    entity: z.literal("lesson"),
    id: uuid.optional(),
    data: z.object({
      program_id: uuid,
      module_id: uuid,
      title: z.string().trim().min(1, "Add a title").max(180),
      kind: z.enum(LESSON_KINDS),
      body: z.string().max(50000),
      video_url: link,
      resource_url: link,
      resource_label: optionalText(120),
      duration_minutes: z.number().int().min(0).max(1440).nullable(),
      published: z.boolean(),
    }),
  }),
  z.object({
    entity: z.literal("cohort"),
    id: uuid.optional(),
    data: z.object({
      program_id: uuid,
      name: z.string().trim().min(1, "Add a name").max(140),
      starts_on: day,
      ends_on: day,
      status: z.enum(COHORT_STATUSES),
      meeting_url: link,
      community_url: link,
      notes: z.string().trim().max(5000),
    }),
  }),
  z.object({
    entity: z.literal("session"),
    id: uuid.optional(),
    data: z.object({
      cohort_id: uuid,
      title: z.string().trim().min(1, "Add a title").max(180),
      description: z.string().trim().max(5000),
      starts_at: z.string().datetime({ offset: true }),
      duration_minutes: z.number().int().min(5).max(1440),
      meeting_url: link,
      recording_url: link,
    }),
  }),
  z.object({
    entity: z.literal("announcement"),
    id: uuid.optional(),
    data: z.object({
      program_id: uuid.nullable(),
      cohort_id: uuid.nullable(),
      title: z.string().trim().min(1, "Add a title").max(180),
      body: z.string().trim().max(10000),
      pinned: z.boolean(),
    }),
  }),
]);

const TABLES = {
  program: "lms_programs",
  module: "lms_modules",
  lesson: "lms_lessons",
  cohort: "lms_cohorts",
  session: "lms_sessions",
  announcement: "lms_announcements",
} as const;

export type LmsEntity = keyof typeof TABLES;

export const saveLmsRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => recordInput.parse(data))
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const db = lmsDb();
    const table = TABLES[data.entity];
    const row: Record<string, unknown> = { ...data.data, updated_at: now() };
    if (data.entity === "announcement" && data.data.cohort_id) {
      const target = await enrolmentTarget(null, data.data.cohort_id);
      row["program_id"] = target!.program_id;
    }
    if (!data.id && data.entity !== "cohort" && data.entity !== "session") {
      // New items go to the end of their list.
      const scope =
        data.entity === "lesson"
          ? { column: "module_id", value: data.data.module_id }
          : data.entity === "module"
            ? { column: "program_id", value: data.data.program_id }
            : null;
      if (data.entity !== "announcement") {
        let query = db.from(table).select("position").order("position", { ascending: false });
        if (scope) query = query.eq(scope.column, scope.value);
        const { data: last } = await query.limit(1).maybeSingle();
        row["position"] = ((last as { position: number } | null)?.position ?? -1) + 1;
      }
    }
    const { data: saved, error } = await (
      data.id ? db.from(table).update(row).eq("id", data.id) : db.from(table).insert(row)
    )
      .select("id")
      .single();
    if (error) {
      if (error.code === "23505" && data.entity === "program")
        throw new Error("Another programme already uses that link name. Choose a different one.");
      fail(error, `save the ${data.entity}`);
    }
    return { id: (saved as { id: string }).id };
  });

export const deleteLmsRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        entity: z.enum(Object.keys(TABLES) as [LmsEntity, ...LmsEntity[]]),
        id: uuid,
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const { error } = await lmsDb().from(TABLES[data.entity]).delete().eq("id", data.id);
    if (error) fail(error, `delete the ${data.entity}`);
    return { ok: true };
  });

/** Saves a new order for modules, lessons or programmes (and a lesson's module, when moved). */
export const reorderLmsRecords = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        entity: z.enum(["program", "module", "lesson"]),
        ids: z.array(uuid).min(1).max(500),
        moduleId: uuid.optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const db = lmsDb();
    await inBatches(
      data.ids.map((id, position) => ({ id, position })),
      8,
      async ({ id, position }) => {
        const { error } = await db
          .from(TABLES[data.entity])
          .update(
            data.entity === "lesson" && data.moduleId
              ? { position, module_id: data.moduleId }
              : { position },
          )
          .eq("id", id);
        if (error) fail(error, "save the order");
      },
    );
    return { ok: true };
  });

/** Copies a programme's modules and lessons into a new, unpublished programme. */
export const duplicateLmsProgram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: uuid }).parse(data))
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const db = lmsDb();
    const { data: source, error } = await db
      .from("lms_programs")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) fail(error, "find the programme");
    const program = source as LmsProgram;
    const { id: _id, created_at: _created, ...fields } = program;
    const { data: copy, error: copyError } = await db
      .from("lms_programs")
      .insert({
        ...fields,
        slug: `${program.slug}-copy-${Math.random().toString(36).slice(2, 6)}`.slice(0, 80),
        title: `${program.title} (copy)`,
        published: false,
        position: program.position + 1,
      })
      .select("id")
      .single();
    if (copyError) fail(copyError, "copy the programme");
    const newId = (copy as { id: string }).id;
    const [{ data: modules }, { data: lessons }] = await Promise.all([
      db.from("lms_modules").select("*").eq("program_id", program.id),
      db.from("lms_lessons").select("*").eq("program_id", program.id),
    ]);
    for (const module of (modules ?? []) as LmsModule[]) {
      const { data: newModule, error: moduleError } = await db
        .from("lms_modules")
        .insert({
          program_id: newId,
          title: module.title,
          summary: module.summary,
          position: module.position,
        })
        .select("id")
        .single();
      if (moduleError) fail(moduleError, "copy a module");
      const rows = ((lessons ?? []) as LmsLesson[])
        .filter((lesson) => lesson.module_id === module.id)
        .map(({ id: _lessonId, ...lesson }) => ({
          ...lesson,
          program_id: newId,
          module_id: (newModule as { id: string }).id,
          created_at: undefined,
          updated_at: now(),
        }));
      if (rows.length) {
        const { error: lessonError } = await db.from("lms_lessons").insert(rows);
        if (lessonError) fail(lessonError, "copy the lessons");
      }
    }
    return { id: newId };
  });

/* ----------------------------------------------------------------- Reviews */

export const reviewLmsSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: uuid,
        status: z.enum(SUBMISSION_STATUSES),
        feedback: z.string().trim().max(10000),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const { error } = await lmsDb()
      .from("lms_submissions")
      .update({
        status: data.status,
        feedback: data.feedback || null,
        reviewed_at: data.status === "submitted" ? null : now(),
      })
      .eq("id", data.id);
    if (error) fail(error, "save the review");
    return { ok: true };
  });

/* ------------------------------------------------------------ Certificates */

export const issueLmsCertificates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        recipients: z
          .array(
            z.object({
              userId: uuid.nullable().optional(),
              name: z.string().trim().min(1, "Each certificate needs a name").max(160),
              email: z.string().trim().toLowerCase().email().or(z.literal("")).optional(),
            }),
          )
          .min(1)
          .max(1000),
        title: z.string().trim().min(1, "Add a certificate title").max(180),
        programId: uuid.nullable().optional(),
        cohortId: uuid.nullable().optional(),
        programTitle: z.string().trim().max(240).optional(),
        description: z.string().trim().max(1000).optional(),
        issuedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        skipDuplicates: z.boolean().default(true),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const db = lmsDb();
    let programTitle = data.programTitle || null;
    if (!programTitle && data.programId) {
      const [{ data: program }, { data: cohort }] = await Promise.all([
        db.from("lms_programs").select("title").eq("id", data.programId).maybeSingle(),
        data.cohortId
          ? db.from("lms_cohorts").select("name").eq("id", data.cohortId).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      programTitle =
        [(program as { title: string } | null)?.title, (cohort as { name: string } | null)?.name]
          .filter(Boolean)
          .join(" · ") || null;
    }
    // Certificates already given for the same award, to avoid issuing twice.
    const skipped: string[] = [];
    let recipients = data.recipients;
    if (data.skipDuplicates) {
      let query = db
        .from("lms_certificates")
        .select("user_id, recipient_email, recipient_name")
        .eq("title", data.title)
        .eq("revoked", false);
      query = data.programId
        ? query.eq("program_id", data.programId)
        : query.is("program_id", null);
      const { data: issued, error } = await query.limit(5000);
      if (error) fail(error, "check existing certificates");
      const rows = (issued ?? []) as Pick<
        LmsCertificate,
        "user_id" | "recipient_email" | "recipient_name"
      >[];
      const users = new Set(rows.map((row) => row.user_id).filter(Boolean));
      const emails = new Set(rows.map((row) => row.recipient_email).filter(Boolean));
      const names = new Set(
        rows.filter((row) => !row.user_id && !row.recipient_email).map((row) => row.recipient_name),
      );
      recipients = recipients.filter((recipient) => {
        const duplicate =
          (recipient.userId && users.has(recipient.userId)) ||
          (recipient.email && emails.has(recipient.email)) ||
          (!recipient.userId && !recipient.email && names.has(recipient.name));
        if (duplicate) skipped.push(recipient.name);
        return !duplicate;
      });
    }
    const issued: LmsCertificate[] = [];
    for (let i = 0; i < recipients.length; i += 200) {
      const chunk = recipients.slice(i, i + 200);
      for (let attempt = 0; ; attempt++) {
        const { data: rows, error } = await db
          .from("lms_certificates")
          .insert(
            chunk.map((recipient) => ({
              serial: certificateSerial(data.issuedOn),
              user_id: recipient.userId ?? null,
              recipient_name: recipient.name,
              recipient_email: recipient.email || null,
              title: data.title,
              program_id: data.programId ?? null,
              cohort_id: data.cohortId ?? null,
              program_title: programTitle,
              description: data.description || null,
              issued_on: data.issuedOn,
            })),
          )
          .select("*");
        // A clash between random certificate numbers is very unlikely; draw new ones.
        if (error?.code === "23505" && attempt < 3) continue;
        if (error) fail(error, "issue the certificates");
        issued.push(...((rows ?? []) as LmsCertificate[]));
        break;
      }
    }
    return { issued, skipped };
  });

export const updateLmsCertificates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        ids: z.array(uuid).min(1).max(1000),
        action: z.enum(["revoke", "restore", "delete", "edit"]),
        fields: z
          .object({
            recipient_name: z.string().trim().min(1).max(160),
            recipient_email: z.string().trim().toLowerCase().email().or(z.literal("")),
            title: z.string().trim().min(1).max(180),
            program_title: z.string().trim().max(240),
            description: z.string().trim().max(1000),
            issued_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          })
          .optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const db = lmsDb();
    const table = db.from("lms_certificates");
    const query =
      data.action === "delete"
        ? table.delete().in("id", data.ids)
        : data.action === "edit"
          ? table
              .update({
                ...data.fields,
                recipient_email: data.fields?.recipient_email || null,
                program_title: data.fields?.program_title || null,
                description: data.fields?.description || null,
                updated_at: now(),
              })
              .in("id", data.ids.slice(0, 1))
          : table
              .update({ revoked: data.action === "revoke", updated_at: now() })
              .in("id", data.ids);
    const { error } = await query;
    if (error) fail(error, "update the certificates");
    return { ok: true };
  });
