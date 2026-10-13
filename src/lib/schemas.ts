import { z } from "zod";

const req = (label: string, max = 200) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);
const opt = (max = 500) => z.string().trim().max(max).optional().or(z.literal(""));
const email = z.string().trim().min(1, "Email is required").email("Enter a valid email").max(255);
const consent = z.literal(true, { errorMap: () => ({ message: "Please accept to continue" }) });
const honeypot = z.string().max(0).optional();

export const INTERESTS = [
  "Founder learning",
  "Workshops",
  "Hackathons",
  "Startup ideas",
  "Networking",
  "Mentorship",
] as const;

export const studentSchema = z.object({
  full_name: req("Full name", 120),
  email,
  institution: req("College or institution"),
  course_year: opt(120),
  city: req("City", 100),
  interests: z.array(z.string().max(60)).min(1, "Pick at least one interest").max(10),
  preferred_channel: z.enum(["email", "whatsapp", "phone"], {
    errorMap: () => ({ message: "Choose a channel" }),
  }),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9 ()-]{7,20}$/, "Enter a valid number")
    .optional()
    .or(z.literal("")),
  consent,
  marketing_opt_in: z.boolean(),
  website: honeypot,
});

export const collegeSchema = z.object({
  institution_name: req("Institution name"),
  website: z.string().trim().url("Enter a valid URL").max(300).optional().or(z.literal("")),
  city: req("City", 100),
  state: req("State", 100),
  ecell_name: opt(200),
  rep_name: req("Representative name", 120),
  rep_designation: req("Designation", 120),
  email,
  phone: opt(30),
  community_size: opt(60),
  current_activities: opt(2000),
  support_needed: req("Support needed", 2000),
  additional_info: opt(2000),
  consent,
  url_hp: honeypot,
});

export const ambassadorSchema = z.object({
  name: req("Name", 120),
  email,
  college: req("College"),
  course_year: req("Course and year", 120),
  experience: opt(2000),
  motivation: req("Motivation", 2000),
  availability: req("Availability", 120),
  profile_url: z.string().trim().url("Enter a valid URL").max(300).optional().or(z.literal("")),
  consent,
  website: honeypot,
});

export const contactSchema = z.object({
  name: req("Name", 120),
  email,
  topic: z.enum(["college", "student", "events", "mentor", "sponsorship", "other"]),
  message: req("Message", 4000),
  consent,
  website: honeypot,
});

export const eventRegSchema = z.object({
  event_slug: req("Event", 120),
  name: req("Name", 120),
  email,
  institution: req("Institution"),
  consent,
  website: honeypot,
});

export type FieldErrors = Record<string, string>;
export function flatten(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const i of err.issues) {
    const k = String(i.path[0] ?? "form");
    if (!out[k]) out[k] = i.message;
  }
  return out;
}
