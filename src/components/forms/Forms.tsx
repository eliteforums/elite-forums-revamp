import { DynamicForm } from "./DynamicForm";

/** The website's forms. Questions, labels and messages are edited in the admin console (Forms). */
export const StudentForm = () => <DynamicForm form="community" />;
export const CollegeForm = () => <DynamicForm form="college" />;
export const AmbassadorForm = () => <DynamicForm form="ambassador" />;

export function ContactForm({ defaultTopic = "" }: { defaultTopic?: string }) {
  return <DynamicForm form="contact" defaults={{ topic: defaultTopic }} />;
}

export function EventRegisterForm({ slug, title }: { slug: string; title: string }) {
  return <DynamicForm form="event" eventSlug={slug} vars={{ event: title }} />;
}
