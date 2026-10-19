import { z } from "zod";
import {
  ACKNOWLEDGEMENTS,
  COMMON_SECTIONS,
  PROGRAMS,
  PROGRAM_SECTIONS,
  type Question as ProgrammeQuestion,
} from "./program-application";

/**
 * Every public form is described here as data, so the admin console can edit
 * its questions, labels, options and messages. A form's stored configuration
 * (site_content row "form.<id>") replaces the defaults below, with one rule:
 * questions saved to a database column ("core" questions) can be relabelled,
 * moved, made optional or hidden, but never removed or retyped into something
 * the column cannot hold. Questions an administrator adds are saved in the
 * submission's `answers`.
 */

export const QUESTION_TYPES = [
  "text",
  "textarea",
  "email",
  "tel",
  "url",
  "date",
  "number",
  "select",
  "radio",
  "multi",
  "checkbox",
] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  text: "Short answer",
  textarea: "Paragraph",
  email: "Email address",
  tel: "Phone number",
  url: "Web link",
  date: "Date",
  number: "Number",
  select: "Dropdown (pick one)",
  radio: "Multiple choice (pick one)",
  multi: "Checkboxes (pick any)",
  checkbox: "Single tick box (yes / agree)",
};

export type Question = {
  key: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  hint?: string;
  placeholder?: string;
  /** Half width on desktop. */
  half?: boolean;
  hidden?: boolean;
};
export type FormSection = { id: string; title: string; questions: Question[] };
export type Programme = { id: string; label: string; blurb: string; sections: FormSection[] };
export type FormConfig = {
  submitLabel: string;
  successTitle: string;
  successBody: string;
  sections: FormSection[];
  /** Programme application only: the programmes and their own questions. */
  programmes?: Programme[];
  /** Programme application only: shown after the programme's questions. */
  endSections?: FormSection[];
};

export const FORM_IDS = [
  "programme",
  "community",
  "college",
  "ambassador",
  "contact",
  "event",
] as const;
export type FormId = (typeof FORM_IDS)[number];

/** What a database column can hold, which limits the question types that may feed it. */
type ColumnKind = "text" | "array" | "boolean" | "yesno";
type FormMeta = {
  label: string;
  table:
    | "program_applications"
    | "student_registrations"
    | "college_applications"
    | "ambassador_applications"
    | "contact_enquiries"
    | "event_registrations";
  columns: Record<string, ColumnKind>;
  /** Columns every submission must fill (name, email, consent): never hidden or optional. */
  locked: string[];
};

export const FORM_META: Record<FormId, FormMeta> = {
  programme: {
    label: "Programme application",
    table: "program_applications",
    columns: {
      full_name: "text",
      email: "text",
      phone: "text",
      whatsapp_available: "yesno",
      city: "text",
      profile_url: "text",
      applicant_type: "text",
      startup_name: "text",
      website_url: "text",
      industry: "text",
      stage: "text",
      why_join: "text",
      biggest_challenge: "text",
      expected_outcome: "text",
      heard_from: "text",
      terms_agreed: "boolean",
      contact_ok: "boolean",
      accuracy_confirmed: "boolean",
      consent: "boolean",
    },
    locked: ["full_name", "email", "consent"],
  },
  community: {
    label: "Community registration",
    table: "student_registrations",
    columns: {
      full_name: "text",
      email: "text",
      institution: "text",
      course_year: "text",
      city: "text",
      interests: "array",
      preferred_channel: "text",
      phone: "text",
      consent: "boolean",
      marketing_opt_in: "boolean",
    },
    locked: ["full_name", "email", "consent"],
  },
  college: {
    label: "College partnership",
    table: "college_applications",
    columns: {
      institution_name: "text",
      website: "text",
      city: "text",
      state: "text",
      ecell_name: "text",
      community_size: "text",
      rep_name: "text",
      rep_designation: "text",
      email: "text",
      phone: "text",
      current_activities: "text",
      support_needed: "text",
      additional_info: "text",
      consent: "boolean",
    },
    locked: ["institution_name", "rep_name", "email", "consent"],
  },
  ambassador: {
    label: "Campus ambassador application",
    table: "ambassador_applications",
    columns: {
      name: "text",
      email: "text",
      college: "text",
      course_year: "text",
      availability: "text",
      profile_url: "text",
      experience: "text",
      motivation: "text",
      consent: "boolean",
    },
    locked: ["name", "email", "consent"],
  },
  contact: {
    label: "Contact enquiry",
    table: "contact_enquiries",
    columns: { name: "text", email: "text", topic: "text", message: "text", consent: "boolean" },
    locked: ["name", "email", "consent"],
  },
  event: {
    label: "Event registration",
    table: "event_registrations",
    columns: { name: "text", email: "text", institution: "text", consent: "boolean" },
    locked: ["name", "email", "consent"],
  },
};

const KIND_TYPES: Record<ColumnKind, QuestionType[]> = {
  text: ["text", "textarea", "email", "tel", "url", "date", "number", "select", "radio"],
  array: ["multi"],
  boolean: ["checkbox"],
  yesno: ["select", "radio"],
};

/** Question types a question may switch to. */
export function allowedTypes(form: FormId, key: string): readonly QuestionType[] {
  const kind = FORM_META[form].columns[key];
  return kind ? KIND_TYPES[kind] : QUESTION_TYPES;
}

const q = (
  key: string,
  label: string,
  type: QuestionType,
  required: boolean,
  extra: Partial<Question> = {},
): Question => ({ key, label, type, required, ...extra });

const CONSENT_LABEL =
  "I consent to Elite Forums collecting and using these details to respond to me, as described in the [privacy policy](/privacy). I also agree to the [terms of service](/terms).";
const consent = q("consent", CONSENT_LABEL, "checkbox", true);

const fromProgramme = (question: ProgrammeQuestion): Question => ({
  key: question.key,
  label: question.label,
  type: question.type,
  required: !question.optional,
  ...(question.options ? { options: [...question.options] } : {}),
  ...(question.hint ? { hint: question.hint } : {}),
  ...(question.placeholder ? { placeholder: question.placeholder } : {}),
  ...(question.half ? { half: true } : {}),
});
const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const DEFAULT_FORMS: Record<FormId, FormConfig> = {
  programme: {
    submitLabel: "Submit Application",
    successTitle: "Application received.",
    successBody:
      "Thanks for applying to the {programme}. Our team reviews every application and will contact you about the next step — an interview, or a facility visit for coworking members.\n\n[See upcoming events](/events)",
    sections: COMMON_SECTIONS.map((section) => ({
      id: slug(section.title),
      title: section.title,
      questions: section.questions.map(fromProgramme),
    })),
    programmes: PROGRAMS.map((programme) => ({
      id: programme.id,
      label: programme.label,
      blurb: programme.blurb,
      sections: PROGRAM_SECTIONS[programme.id].map((section) => ({
        id: slug(section.title),
        title: section.title,
        questions: section.questions.map(fromProgramme),
      })),
    })),
    endSections: [
      {
        id: "acknowledgements",
        title: "Acknowledgements",
        questions: ACKNOWLEDGEMENTS.map((ack) =>
          q(
            ack.key,
            ack.key === "consent"
              ? "I consent to the use of my application data for admissions and program administration, as described in the [privacy notice](/privacy)."
              : ack.label,
            "checkbox",
            true,
          ),
        ),
      },
    ],
  },
  community: {
    submitLabel: "Join the Community",
    successTitle: "You're in the community.",
    successBody:
      "Thanks for registering. Our team reviews every registration and will reach out on your preferred channel as new programs open up.\n\n[See upcoming events](/events)",
    sections: [
      {
        id: "details",
        title: "",
        questions: [
          q("full_name", "Full name", "text", true, { half: true }),
          q("email", "Email address", "email", true, { half: true }),
          q("institution", "College, company or organisation", "text", true, { half: true }),
          q("course_year", "Course and year, or current role", "text", false, {
            half: true,
            placeholder: "B.Tech 2nd year, or Product designer",
          }),
          q("city", "City", "text", true, { half: true }),
          q("preferred_channel", "Preferred communication", "select", true, {
            half: true,
            options: ["Email", "WhatsApp", "Phone call"],
          }),
          q("phone", "Phone or WhatsApp", "tel", false),
          q("interests", "Entrepreneurship interests", "multi", true, {
            options: [
              "Founder learning",
              "Workshops",
              "Hackathons",
              "Startup ideas",
              "Networking",
              "Mentorship",
            ],
          }),
          consent,
          q(
            "marketing_opt_in",
            "Send me updates about future programs and events. You can opt out anytime.",
            "checkbox",
            false,
          ),
        ],
      },
    ],
  },
  college: {
    submitLabel: "Submit Application",
    successTitle: "Application received.",
    successBody:
      "Thank you for applying. Our partnerships team reviews each application and will contact the representative by email to schedule an introductory conversation.",
    sections: [
      {
        id: "details",
        title: "",
        questions: [
          q("institution_name", "Institution name", "text", true, { half: true }),
          q("website", "Institution website", "url", false, {
            half: true,
            placeholder: "https://",
          }),
          q("city", "City", "text", true, { half: true }),
          q("state", "State", "text", true, { half: true }),
          q("ecell_name", "E-Cell or club name", "text", false, { half: true }),
          q("community_size", "Approximate community size", "text", false, {
            half: true,
            placeholder: "e.g. 150 members",
          }),
          q("rep_name", "Representative name", "text", true, { half: true }),
          q("rep_designation", "Representative designation", "text", true, { half: true }),
          q("email", "Email address", "email", true, { half: true }),
          q("phone", "Contact number", "tel", false, { half: true }),
          q("current_activities", "Current entrepreneurship activities", "textarea", false),
          q("support_needed", "What support does your college need?", "textarea", true),
          q("additional_info", "Additional information", "textarea", false),
          consent,
        ],
      },
    ],
  },
  ambassador: {
    submitLabel: "Apply Now",
    successTitle: "Application sent.",
    successBody:
      "Thanks for stepping up. Shortlisted applicants are invited to a short conversation with the team. We'll email you either way.",
    sections: [
      {
        id: "details",
        title: "",
        questions: [
          q("name", "Name", "text", true, { half: true }),
          q("email", "Email", "email", true, { half: true }),
          q("college", "College", "text", true, { half: true }),
          q("course_year", "Course and year", "text", true, { half: true }),
          q("availability", "Estimated availability", "select", true, {
            half: true,
            options: ["2–4 hours / week", "4–8 hours / week", "8+ hours / week"],
          }),
          q("profile_url", "Social or professional profile", "url", false, {
            half: true,
            placeholder: "https://linkedin.com/in/…",
          }),
          q("experience", "Relevant experience", "textarea", false),
          q("motivation", "Why do you want to be an ambassador?", "textarea", true),
          consent,
        ],
      },
    ],
  },
  contact: {
    submitLabel: "Send Message",
    successTitle: "Message received.",
    successBody: "Thanks for reaching out. The right person on our team will reply by email.",
    sections: [
      {
        id: "details",
        title: "",
        questions: [
          q("name", "Name", "text", true, { half: true }),
          q("email", "Email", "email", true, { half: true }),
          q("topic", "Topic", "select", true, {
            options: [
              "College partnerships",
              "Community enquiries",
              "Events",
              "Mentors and founders",
              "Sponsorship and collaboration",
              "Request data deletion",
              "Something else",
            ],
          }),
          q("message", "Message", "textarea", true),
          consent,
        ],
      },
    ],
  },
  event: {
    submitLabel: "Register",
    successTitle: "You're registered.",
    successBody:
      "Your spot for {event} is noted. Details and joining instructions will be emailed before the event.",
    sections: [
      {
        id: "details",
        title: "",
        questions: [
          q("name", "Name", "text", true),
          q("email", "Email", "email", true),
          q("institution", "College, company or organisation", "text", true),
          consent,
        ],
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Stored configuration → a safe, complete form                        */
/* ------------------------------------------------------------------ */

const optional = <T extends z.ZodTypeAny>(schema: T) => schema.optional().catch(undefined);
const questionInput = z.object({
  key: z
    .string()
    .trim()
    .regex(/^[a-z][a-z0-9_]{0,59}$/),
  label: z.string().trim().max(600),
  type: z.enum(QUESTION_TYPES),
  required: z.boolean(),
  options: optional(z.array(z.string().trim().max(200)).max(60)),
  hint: optional(z.string().max(400)),
  placeholder: optional(z.string().max(200)),
  half: optional(z.boolean()),
  hidden: optional(z.boolean()),
});
const sectionInput = z.object({
  id: z.string().trim().max(80),
  title: z.string().trim().max(200),
  questions: z.array(questionInput).max(80),
});
export const formConfigInput = z.object({
  submitLabel: z.string().trim().min(1).max(80),
  successTitle: z.string().trim().max(160),
  successBody: z.string().trim().max(1000),
  sections: z.array(sectionInput).max(30),
  programmes: optional(
    z
      .array(
        z.object({
          id: z
            .string()
            .trim()
            .regex(/^[a-z0-9-]{1,40}$/),
          label: z.string().trim().min(1).max(120),
          blurb: z.string().trim().max(300),
          sections: z.array(sectionInput).max(30),
        }),
      )
      .max(20),
  ),
  endSections: optional(z.array(sectionInput).max(10)),
});

const clean = (question: Question): Question => {
  const out: Question = {
    key: question.key,
    label: question.label,
    type: question.type,
    required: question.required,
  };
  if (question.options?.length) out.options = question.options.filter(Boolean);
  if (question.hint) out.hint = question.hint;
  if (question.placeholder) out.placeholder = question.placeholder;
  if (question.half) out.half = true;
  if (question.hidden) out.hidden = true;
  return out;
};

/** Apply the column rules to a stored (or default) configuration. */
export function normaliseForm(form: FormId, raw: unknown): FormConfig {
  const fallback = DEFAULT_FORMS[form];
  const parsed = formConfigInput.safeParse(raw);
  const config: FormConfig = parsed.success ? (parsed.data as FormConfig) : fallback;
  const meta = FORM_META[form];
  const defaults = new Map(
    [
      ...fallback.sections,
      ...(fallback.endSections ?? []),
      ...(fallback.programmes ?? []).flatMap((p) => p.sections),
    ]
      .flatMap((section) => section.questions)
      .map((question) => [question.key, question]),
  );
  const fix = (sections: FormSection[]): FormSection[] => {
    const seen = new Set<string>();
    return sections.map((section) => ({
      ...section,
      questions: section.questions
        .filter((question) => {
          // Keys are unique within one list of sections (a programme may reuse another's keys).
          if (seen.has(question.key)) return false;
          seen.add(question.key);
          return true;
        })
        .map((question) => {
          const kind = meta.columns[question.key];
          let next = clean(question);
          if (kind && !KIND_TYPES[kind].includes(next.type)) {
            const original = defaults.get(question.key);
            next = { ...next, type: original?.type ?? KIND_TYPES[kind][0]! };
            if (original?.options && !next.options) next.options = original.options;
          }
          if (meta.locked.includes(question.key)) next = { ...next, required: true, hidden: false };
          if (next.hidden) next.required = false;
          return next;
        }),
    }));
  };
  const result: FormConfig = {
    submitLabel: config.submitLabel || fallback.submitLabel,
    successTitle: config.successTitle,
    successBody: config.successBody,
    sections: fix(config.sections.length ? config.sections : fallback.sections),
  };
  if (form === "programme") {
    result.programmes = (
      config.programmes?.length ? config.programmes : (fallback.programmes ?? [])
    ).map((programme) => ({ ...programme, sections: fix(programme.sections) }));
    result.endSections = fix(config.endSections ?? fallback.endSections ?? []);
  }
  // Every column question must still be asked somewhere (hidden is fine).
  const present = new Set(
    [
      ...result.sections,
      ...(result.endSections ?? []),
      ...(result.programmes ?? []).flatMap((p) => p.sections),
    ].flatMap((section) => section.questions.map((question) => question.key)),
  );
  const missing = Object.keys(meta.columns).filter((key) => !present.has(key));
  if (missing.length) {
    const target = result.endSections?.length ? result.endSections : result.sections;
    const last = target[target.length - 1] ?? { id: "details", title: "", questions: [] };
    if (!target.length) target.push(last);
    for (const key of missing) {
      const original = defaults.get(key);
      if (original) last.questions.push({ ...original, hidden: !meta.locked.includes(key) });
    }
  }
  return result;
}

export type FormOverrides = Partial<Record<FormId, unknown>>;

/** Forms as configured: stored settings for `form.<id>` keys, or the defaults. */
export const resolveForm = (form: FormId, stored: FormOverrides): FormConfig =>
  normaliseForm(form, stored[form] ?? DEFAULT_FORMS[form]);

/** The sections someone fills in, in order, for a form (and programme). */
export function formSections(config: FormConfig, programme?: string): FormSection[] {
  const chosen = config.programmes?.find((p) => p.id === programme);
  return [...config.sections, ...(chosen?.sections ?? []), ...(config.endSections ?? [])];
}

/** Every question with its text, for showing answers in the admin console. */
export function questionLabels(config: FormConfig): Map<string, string> {
  return new Map(
    [
      ...config.sections,
      ...(config.endSections ?? []),
      ...(config.programmes ?? []).flatMap((p) => p.sections),
    ]
      .flatMap((section) => section.questions)
      .map((question) => [question.key, question.label.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")]),
  );
}

/* ------------------------------------------------------------------ */
/* Validation, shared by the browser and the server                    */
/* ------------------------------------------------------------------ */

function questionSchema(question: Question): z.ZodTypeAny {
  const message = "This question is required";
  const options = question.options?.filter(Boolean) ?? [];
  switch (question.type) {
    case "checkbox":
      return question.required
        ? z.literal(true, { errorMap: () => ({ message: "Please tick to continue" }) })
        : z.boolean();
    case "multi": {
      const list = options.length
        ? z.array(z.enum(options as [string, ...string[]]))
        : z.array(z.string().max(200));
      return question.required ? list.min(1, "Pick at least one option") : list;
    }
    case "select":
    case "radio": {
      const choice = options.length
        ? z.enum(options as [string, ...string[]], {
            errorMap: () => ({ message: "Choose an option" }),
          })
        : z.string().trim().min(1, "Choose an option");
      return question.required ? choice : choice.optional().or(z.literal(""));
    }
    default: {
      // Required answers report "required" before any format message.
      let text = question.required ? z.string().trim().min(1, message) : z.string().trim();
      if (question.type === "email") text = text.email("Enter a valid email").max(255);
      else if (question.type === "url")
        text = text.url("Enter a full link starting with https://").max(300);
      else if (question.type === "tel")
        text = text.regex(/^[+0-9 ()-]{7,20}$/, "Enter a valid number");
      else if (question.type === "date") text = text.date("Choose a date");
      else if (question.type === "number") text = text.regex(/^-?\d+(\.\d+)?$/, "Enter a number");
      else text = text.max(question.type === "textarea" ? 4000 : 300, "This answer is too long");
      return question.required ? text : text.optional().or(z.literal(""));
    }
  }
}

export function formSchema(config: FormConfig, programme?: string) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const section of formSections(config, programme))
    for (const question of section.questions)
      if (!question.hidden) shape[question.key] = questionSchema(question);
  return z.object(shape);
}

/** Read a submitted <form> into values for the visible questions. */
export function readForm(fd: FormData, config: FormConfig, programme?: string) {
  const values: Record<string, unknown> = {};
  for (const section of formSections(config, programme))
    for (const question of section.questions) {
      if (question.hidden) continue;
      if (question.type === "multi") values[question.key] = fd.getAll(question.key).map(String);
      else if (question.type === "checkbox") values[question.key] = fd.get(question.key) === "on";
      else values[question.key] = String(fd.get(question.key) ?? "");
    }
  return values;
}

/** Split validated values into database columns and extra answers. */
export function toRow(form: FormId, values: Record<string, unknown>) {
  const meta = FORM_META[form];
  const row: Record<string, unknown> = {};
  const answers: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    const kind = meta.columns[key];
    const empty = value === "" || value === undefined || (Array.isArray(value) && !value.length);
    if (kind === "yesno") row[key] = value === "Yes";
    else if (kind)
      row[key] = empty ? (kind === "array" ? [] : kind === "boolean" ? false : null) : value;
    else if (!empty) answers[key] = value;
  }
  return { row, answers };
}
