/** Shared content types. Editable copy itself is declared in `site-content.ts`. */
import { resolveImage } from "./content-context";
import { contentReader, itemLines, itemText, type ContentOverrides } from "./site-content";

export type EventItem = {
  slug: string;
  sample: boolean;
  type: "Workshop" | "Hackathon" | "Founder Connect" | "Bootcamp";
  title: string;
  date: string; // ISO
  format: "Online" | "In-person";
  city?: string;
  location: string;
  summary: string;
  image: string;
  registration_url?: string | null;
  agenda: { time: string; item: string }[];
  eligibility: string;
  organizer: string;
};

const todayIso = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
};

export type EventStatus = "Upcoming" | "Happening today" | "Already completed";

export function eventStatus(event: Pick<EventItem, "date">): EventStatus {
  const today = todayIso();
  if (event.date > today) return "Upcoming";
  if (event.date === today) return "Happening today";
  return "Already completed";
}

export const isUpcoming = (e: EventItem) => eventStatus(e) !== "Already completed";

export type Article = {
  slug: string;
  sample: boolean;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  body: string[];
};

/** Articles as edited in the admin console (or the defaults). */
export function articlesFrom(overrides: ContentOverrides): Article[] {
  return contentReader("resources", overrides)
    .items("articles")
    .filter((item) => itemText(item, "slug") && itemText(item, "title"))
    .map((item) => ({
      slug: itemText(item, "slug"),
      sample: itemText(item, "sample") === "yes",
      category: itemText(item, "category"),
      title: itemText(item, "title"),
      excerpt: itemText(item, "excerpt"),
      image: resolveImage(itemText(item, "image"), "students"),
      readTime: itemText(item, "readTime"),
      body: itemLines(item, "body"),
    }));
}
