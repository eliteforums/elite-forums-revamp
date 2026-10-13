import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  INTERESTS,
  ambassadorSchema,
  collegeSchema,
  contactSchema,
  eventRegSchema,
  studentSchema,
} from "@/lib/schemas";
import {
  submitAmbassador,
  submitCollege,
  submitContact,
  submitEventReg,
  submitStudent,
} from "@/lib/submissions.functions";
import {
  Consent,
  Field,
  Honeypot,
  SubmitRow,
  Success,
  chk,
  inputCls,
  useFormSubmit,
  val,
} from "./kit";

const inv = (e: Record<string, string>, k: string) => ({
  id: k,
  name: k,
  "aria-invalid": !!e[k],
  "aria-describedby": e[k] ? `${k}-error` : undefined,
});

export function StudentForm() {
  const f = useFormSubmit(studentSchema, submitStudent, (fd) => ({
    full_name: val(fd, "full_name"),
    email: val(fd, "email"),
    institution: val(fd, "institution"),
    course_year: val(fd, "course_year"),
    city: val(fd, "city"),
    interests: fd.getAll("interests").map(String),
    preferred_channel: val(fd, "preferred_channel"),
    phone: val(fd, "phone"),
    consent: chk(fd, "consent"),
    marketing_opt_in: chk(fd, "marketing_opt_in"),
    website: val(fd, "website"),
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e: any = f.errors;
  if (f.state === "success")
    return (
      <Success title="You're in the community.">
        <p>
          Thanks for registering. Our team reviews every registration and will reach out on your
          preferred channel as new programs open up.
        </p>
        <p className="mt-3">Next step: browse what's coming up.</p>
        <Button asChild variant="ink" className="mt-6">
          <Link to="/events">See events</Link>
        </Button>
      </Success>
    );
  return (
    <form onSubmit={f.onSubmit} noValidate className="relative grid gap-5 md:grid-cols-2">
      <Honeypot />
      <Field label="Full name" name="full_name" error={e.full_name}>
        <input className={inputCls} autoComplete="name" {...inv(e, "full_name")} />
      </Field>
      <Field label="Email address" name="email" error={e.email}>
        <input type="email" className={inputCls} autoComplete="email" {...inv(e, "email")} />
      </Field>
      <Field label="College, company or organisation" name="institution" error={e.institution}>
        <input className={inputCls} {...inv(e, "institution")} />
      </Field>
      <Field
        label="Course and year, or current role"
        name="course_year"
        optional
        error={e.course_year}
      >
        <input
          className={inputCls}
          placeholder="B.Tech 2nd year, or Product designer"
          {...inv(e, "course_year")}
        />
      </Field>
      <Field label="City" name="city" error={e.city}>
        <input className={inputCls} autoComplete="address-level2" {...inv(e, "city")} />
      </Field>
      <Field label="Preferred communication" name="preferred_channel" error={e.preferred_channel}>
        <select className={inputCls} defaultValue="" {...inv(e, "preferred_channel")}>
          <option value="" disabled>
            Choose one
          </option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="phone">Phone call</option>
        </select>
      </Field>
      <Field
        label="Phone or WhatsApp"
        name="phone"
        optional
        error={e.phone}
        className="md:col-span-2"
      >
        <input type="tel" className={inputCls} autoComplete="tel" {...inv(e, "phone")} />
      </Field>
      <fieldset className="md:col-span-2">
        <legend className="text-sm font-medium">Entrepreneurship interests</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <label key={i} className="cursor-pointer">
              <input type="checkbox" name="interests" value={i} className="peer sr-only" />
              <span className="inline-block rounded-full border border-input px-4 py-2 text-sm transition-colors peer-checked:border-electric peer-checked:bg-electric peer-checked:text-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                {i}
              </span>
            </label>
          ))}
        </div>
        {e.interests && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {e.interests}
          </p>
        )}
      </fieldset>
      <div className="space-y-3 md:col-span-2">
        <Consent error={e.consent} />
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="marketing_opt_in"
            className="mt-0.5 h-4 w-4 accent-[var(--electric)]"
          />
          <span>Send me updates about future programs and events. You can opt out anytime.</span>
        </label>
      </div>
      <div className="md:col-span-2">
        <SubmitRow state={f.state} message={f.message} label="Join the Community" />
      </div>
    </form>
  );
}

export function CollegeForm() {
  const keys = [
    "institution_name",
    "website",
    "city",
    "state",
    "ecell_name",
    "rep_name",
    "rep_designation",
    "email",
    "phone",
    "community_size",
    "current_activities",
    "support_needed",
    "additional_info",
    "url_hp",
  ];
  const f = useFormSubmit(collegeSchema, submitCollege, (fd) => ({
    ...Object.fromEntries(keys.map((k) => [k, val(fd, k)])),
    consent: chk(fd, "consent"),
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e: any = f.errors;
  if (f.state === "success")
    return (
      <Success title="Application received.">
        <p>
          Thank you for applying. Our partnerships team reviews each application and will contact
          the representative by email to schedule an introductory conversation.
        </p>
      </Success>
    );
  const txt = (k: string, label: string, opt = false, ph?: string) => (
    <Field label={label} name={k} error={e[k]} optional={opt}>
      <input className={inputCls} placeholder={ph} {...inv(e, k)} />
    </Field>
  );
  return (
    <form onSubmit={f.onSubmit} noValidate className="relative grid gap-5 md:grid-cols-2">
      <Honeypot name="url_hp" />
      {txt("institution_name", "Institution name")}
      {txt("website", "Institution website", true, "https://")}
      {txt("city", "City")}
      {txt("state", "State")}
      {txt("ecell_name", "E-Cell or club name", true)}
      {txt("community_size", "Approximate community size", true, "e.g. 150 members")}
      {txt("rep_name", "Representative name")}
      {txt("rep_designation", "Representative designation")}
      <Field label="Email address" name="email" error={e.email}>
        <input type="email" className={inputCls} {...inv(e, "email")} />
      </Field>
      {txt("phone", "Contact number", true)}
      <Field
        label="Current entrepreneurship activities"
        name="current_activities"
        optional
        error={e.current_activities}
        className="md:col-span-2"
      >
        <textarea rows={3} className={inputCls} {...inv(e, "current_activities")} />
      </Field>
      <Field
        label="What support does your college need?"
        name="support_needed"
        error={e.support_needed}
        className="md:col-span-2"
      >
        <textarea rows={3} className={inputCls} {...inv(e, "support_needed")} />
      </Field>
      <Field
        label="Additional information"
        name="additional_info"
        optional
        error={e.additional_info}
        className="md:col-span-2"
      >
        <textarea rows={3} className={inputCls} {...inv(e, "additional_info")} />
      </Field>
      <div className="md:col-span-2">
        <Consent error={e.consent} />
      </div>
      <div className="md:col-span-2">
        <SubmitRow state={f.state} message={f.message} label="Submit Application" />
      </div>
    </form>
  );
}

export function AmbassadorForm() {
  const keys = [
    "name",
    "email",
    "college",
    "course_year",
    "experience",
    "motivation",
    "availability",
    "profile_url",
    "website",
  ];
  const f = useFormSubmit(ambassadorSchema, submitAmbassador, (fd) => ({
    ...Object.fromEntries(keys.map((k) => [k, val(fd, k)])),
    consent: chk(fd, "consent"),
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e: any = f.errors;
  if (f.state === "success")
    return (
      <Success title="Application sent.">
        <p>
          Thanks for stepping up. Shortlisted applicants are invited to a short conversation with
          the team. We'll email you either way.
        </p>
      </Success>
    );
  return (
    <form onSubmit={f.onSubmit} noValidate className="relative grid gap-5 md:grid-cols-2">
      <Honeypot />
      <Field label="Name" name="name" error={e.name}>
        <input className={inputCls} {...inv(e, "name")} />
      </Field>
      <Field label="Email" name="email" error={e.email}>
        <input type="email" className={inputCls} {...inv(e, "email")} />
      </Field>
      <Field label="College" name="college" error={e.college}>
        <input className={inputCls} {...inv(e, "college")} />
      </Field>
      <Field label="Course and year" name="course_year" error={e.course_year}>
        <input className={inputCls} {...inv(e, "course_year")} />
      </Field>
      <Field label="Estimated availability" name="availability" error={e.availability}>
        <select className={inputCls} defaultValue="" {...inv(e, "availability")}>
          <option value="" disabled>
            Choose one
          </option>
          <option>2–4 hours / week</option>
          <option>4–8 hours / week</option>
          <option>8+ hours / week</option>
        </select>
      </Field>
      <Field
        label="Social or professional profile"
        name="profile_url"
        optional
        error={e.profile_url}
      >
        <input
          className={inputCls}
          placeholder="https://linkedin.com/in/…"
          {...inv(e, "profile_url")}
        />
      </Field>
      <Field
        label="Relevant experience"
        name="experience"
        optional
        error={e.experience}
        className="md:col-span-2"
      >
        <textarea rows={3} className={inputCls} {...inv(e, "experience")} />
      </Field>
      <Field
        label="Why do you want to be an ambassador?"
        name="motivation"
        error={e.motivation}
        className="md:col-span-2"
      >
        <textarea rows={4} className={inputCls} {...inv(e, "motivation")} />
      </Field>
      <div className="md:col-span-2">
        <Consent error={e.consent} />
      </div>
      <div className="md:col-span-2">
        <SubmitRow state={f.state} message={f.message} label="Apply Now" />
      </div>
    </form>
  );
}

export function ContactForm({ defaultTopic = "" }: { defaultTopic?: string }) {
  const f = useFormSubmit(contactSchema, submitContact, (fd) => ({
    name: val(fd, "name"),
    email: val(fd, "email"),
    topic: val(fd, "topic"),
    message: val(fd, "message"),
    consent: chk(fd, "consent"),
    website: val(fd, "website"),
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e: any = f.errors;
  if (f.state === "success")
    return (
      <Success title="Message received.">
        <p>Thanks for reaching out. The right person on our team will reply by email.</p>
      </Success>
    );
  return (
    <form onSubmit={f.onSubmit} noValidate className="relative grid gap-5 md:grid-cols-2">
      <Honeypot />
      <Field label="Name" name="name" error={e.name}>
        <input className={inputCls} {...inv(e, "name")} />
      </Field>
      <Field label="Email" name="email" error={e.email}>
        <input type="email" className={inputCls} {...inv(e, "email")} />
      </Field>
      <Field
        label="Topic"
        name="topic"
        error={e.topic ? "Choose a topic" : undefined}
        className="md:col-span-2"
      >
        <select className={inputCls} defaultValue={defaultTopic} {...inv(e, "topic")}>
          <option value="" disabled>
            Choose one
          </option>
          <option value="college">College partnerships</option>
          <option value="student">Community enquiries</option>
          <option value="events">Events</option>
          <option value="mentor">Mentors and founders</option>
          <option value="sponsorship">Sponsorship and collaboration</option>
          <option value="data_deletion">Request data deletion</option>
          <option value="other">Something else</option>
        </select>
      </Field>
      <Field label="Message" name="message" error={e.message} className="md:col-span-2">
        <textarea rows={5} className={inputCls} {...inv(e, "message")} />
      </Field>
      <div className="md:col-span-2">
        <Consent error={e.consent} />
      </div>
      <div className="md:col-span-2">
        <SubmitRow state={f.state} message={f.message} label="Send Message" />
      </div>
    </form>
  );
}

export function EventRegisterForm({ slug, title }: { slug: string; title: string }) {
  const f = useFormSubmit(eventRegSchema, submitEventReg, (fd) => ({
    event_slug: slug,
    name: val(fd, "name"),
    email: val(fd, "email"),
    institution: val(fd, "institution"),
    consent: chk(fd, "consent"),
    website: val(fd, "website"),
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e: any = f.errors;
  if (f.state === "success")
    return (
      <Success title="You're registered.">
        <p>
          Your spot for {title} is noted. Details and joining instructions will be emailed before
          the event.
        </p>
      </Success>
    );
  return (
    <form onSubmit={f.onSubmit} noValidate className="relative grid gap-5">
      <Honeypot />
      <Field label="Name" name="name" error={e.name}>
        <input className={inputCls} {...inv(e, "name")} />
      </Field>
      <Field label="Email" name="email" error={e.email}>
        <input type="email" className={inputCls} {...inv(e, "email")} />
      </Field>
      <Field label="College, company or organisation" name="institution" error={e.institution}>
        <input className={inputCls} {...inv(e, "institution")} />
      </Field>
      <Consent error={e.consent} />
      <SubmitRow state={f.state} message={f.message} label="Register" />
    </form>
  );
}
