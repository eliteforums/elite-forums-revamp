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
  agenda: { time: string; item: string }[];
  eligibility: string;
  organizer: string;
};

export const isUpcoming = (e: EventItem) => new Date(e.date) >= new Date(new Date().toDateString());

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
