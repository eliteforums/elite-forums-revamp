/** Shapes and helpers shared by the learning platform's pages and server functions. */

export const PROGRAM_KINDS = [
  "cohort",
  "incubation",
  "course",
  "bootcamp",
  "fellowship",
  "workshop",
  "membership",
] as const;
export const COHORT_STATUSES = ["upcoming", "active", "completed", "archived"] as const;
export const LESSON_KINDS = ["video", "reading", "assignment", "live", "resource"] as const;
export const ENROLLMENT_STATUSES = ["active", "completed", "dropped"] as const;
export const SUBMISSION_STATUSES = ["submitted", "approved", "changes_requested"] as const;

export type ProgramKind = (typeof PROGRAM_KINDS)[number];
export type LessonKind = (typeof LESSON_KINDS)[number];

export const PROGRAM_KIND_LABELS: Record<ProgramKind, string> = {
  cohort: "Cohort programme",
  incubation: "Incubation programme",
  course: "Self-paced course",
  bootcamp: "Bootcamp",
  fellowship: "Fellowship",
  workshop: "Workshop series",
  membership: "Membership",
};

export const LESSON_KIND_LABELS: Record<LessonKind, string> = {
  video: "Video",
  reading: "Reading",
  assignment: "Assignment",
  live: "Live class",
  resource: "Resource",
};

export const SUBMISSION_LABELS: Record<(typeof SUBMISSION_STATUSES)[number], string> = {
  submitted: "Awaiting review",
  approved: "Approved",
  changes_requested: "Changes requested",
};

export type LmsProfile = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  organisation: string | null;
  status: "active" | "suspended";
  must_change_password: boolean;
  last_seen_at: string | null;
  created_at: string;
};

export type LmsProgram = {
  id: string;
  slug: string;
  title: string;
  kind: ProgramKind;
  summary: string;
  description: string;
  cover_image: string | null;
  certificate_title: string | null;
  published: boolean;
  position: number;
  created_at: string;
};

export type LmsCohort = {
  id: string;
  program_id: string;
  name: string;
  starts_on: string | null;
  ends_on: string | null;
  status: (typeof COHORT_STATUSES)[number];
  meeting_url: string | null;
  community_url: string | null;
  notes: string;
  created_at: string;
};

export type LmsEnrollment = {
  id: string;
  user_id: string;
  program_id: string;
  cohort_id: string | null;
  status: (typeof ENROLLMENT_STATUSES)[number];
  created_at: string;
};

export type LmsModule = {
  id: string;
  program_id: string;
  title: string;
  summary: string;
  position: number;
};

export type LmsLesson = {
  id: string;
  program_id: string;
  module_id: string;
  title: string;
  kind: LessonKind;
  body: string;
  video_url: string | null;
  resource_url: string | null;
  resource_label: string | null;
  duration_minutes: number | null;
  position: number;
  published: boolean;
};

export type LmsSubmission = {
  id: string;
  user_id: string;
  lesson_id: string;
  program_id: string;
  body: string;
  link: string | null;
  status: (typeof SUBMISSION_STATUSES)[number];
  feedback: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LmsSession = {
  id: string;
  cohort_id: string;
  title: string;
  description: string;
  starts_at: string;
  duration_minutes: number;
  meeting_url: string | null;
  recording_url: string | null;
};

export type LmsAnnouncement = {
  id: string;
  program_id: string | null;
  cohort_id: string | null;
  title: string;
  body: string;
  pinned: boolean;
  created_at: string;
};

export type LmsCertificate = {
  id: string;
  serial: string;
  user_id: string | null;
  recipient_name: string;
  recipient_email: string | null;
  title: string;
  program_id: string | null;
  cohort_id: string | null;
  program_title: string | null;
  description: string | null;
  issued_on: string;
  revoked: boolean;
  created_at: string;
};

export type ProgressRow = {
  user_id: string;
  program_id: string;
  completed: number;
  last_activity: string | null;
};

/** What a certificate's public page shows; never includes the email address. */
export type PublicCertificate = Pick<
  LmsCertificate,
  "serial" | "recipient_name" | "title" | "program_title" | "description" | "issued_on" | "revoked"
>;

/** Lessons in teaching order: by module position, then lesson position. */
export function orderLessons<T extends Pick<LmsLesson, "module_id" | "position">>(
  modules: Pick<LmsModule, "id" | "position">[],
  lessons: T[],
): T[] {
  const moduleOrder = new Map(
    [...modules].sort((a, b) => a.position - b.position).map((m, index) => [m.id, index]),
  );
  return [...lessons]
    .filter((lesson) => moduleOrder.has(lesson.module_id))
    .sort(
      (a, b) =>
        moduleOrder.get(a.module_id)! - moduleOrder.get(b.module_id)! || a.position - b.position,
    );
}

export const percent = (done: number, total: number) =>
  total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;

/** The address to embed for a video link, or null when it should open as a plain link. */
export function videoEmbedUrl(raw: string | null | undefined): string | null {
  const value = (raw ?? "").trim();
  if (!value) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const id =
      url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.match(/(\d{5,})/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (host === "loom.com") {
    const id = url.pathname.match(/\/(?:share|embed)\/([\w-]+)/)?.[1];
    return id ? `https://www.loom.com/embed/${id}` : null;
  }
  if (host === "drive.google.com") {
    const id = url.pathname.match(/\/file\/d\/([\w-]+)/)?.[1];
    return id ? `https://drive.google.com/file/d/${id}/preview` : null;
  }
  return null;
}

/**
 * Reads pasted spreadsheet rows (comma- or tab-separated, quotes allowed). The
 * first row is treated as headings when it names a known column.
 */
export function parseTable(text: string): string[][] {
  const rows: string[][] = [];
  const source = text.replace(/\r\n?/g, "\n");
  const delimiter = source.split("\n", 1)[0]!.includes("\t") ? "\t" : ",";
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < source.length; i++) {
    const char = source[i]!;
    if (quoted) {
      if (char === '"' && source[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"' && cell.trim() === "") {
      quoted = true;
      cell = "";
    } else if (char === delimiter) {
      row.push(cell.trim());
      cell = "";
    } else if (char === "\n") {
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

/** Spreadsheet text for a download, quoting cells that need it. */
export function toCsv(rows: (string | number | null | undefined)[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? "");
          return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(","),
    )
    .join("\n");
}

export function downloadFile(name: string, contents: string, type = "text/csv") {
  const url = URL.createObjectURL(new Blob([contents], { type: `${type};charset=utf-8` }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// No 0/O, 1/l/I: these get misread when credentials are copied by hand.
const READABLE = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SERIAL_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomString(length: number, alphabet: string) {
  const bytes = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

/** A 14-character password such as "kT7m-Qx4p-Wz9r". */
export const generatePassword = () =>
  [0, 1, 2].map(() => randomString(4, READABLE)).join("-") + randomString(2, "23456789");

/** A certificate number such as "EF-2026-7K3M9Q". */
export const certificateSerial = (issuedOn: string) =>
  `EF-${issuedOn.slice(0, 4)}-${randomString(6, SERIAL_CHARS)}`;

export const certificatePath = (serial: string) => `/certificates/${serial}`;

export function formatDate(value: string | null | undefined, withYear = true) {
  if (!value) return "";
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const cohortDates = (cohort: Pick<LmsCohort, "starts_on" | "ends_on"> | null | undefined) =>
  cohort?.starts_on
    ? `${formatDate(cohort.starts_on)}${cohort.ends_on ? ` – ${formatDate(cohort.ends_on)}` : ""}`
    : "";

/** Announcements a learner sees: everyone's, their programmes', their cohorts'. */
export function announcementFor(
  announcement: Pick<LmsAnnouncement, "program_id" | "cohort_id">,
  programIds: Set<string>,
  cohortIds: Set<string>,
) {
  if (announcement.cohort_id) return cohortIds.has(announcement.cohort_id);
  if (announcement.program_id) return programIds.has(announcement.program_id);
  return true;
}

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
