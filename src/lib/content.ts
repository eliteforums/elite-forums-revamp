/**
 * Site content. Everything marked `sample: true` is illustrative placeholder
 * content for development and must be replaced with verified information
 * before launch.
 */
import hackathon from "@/assets/hackathon.jpg";
import students from "@/assets/students.jpg";
import founder from "@/assets/founder.jpg";

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

export const EVENTS: EventItem[] = [
  {
    slug: "founder-connect-concept",
    sample: true,
    type: "Founder Connect",
    title: "Founder Connect: From Idea to First Users",
    date: "2026-12-05",
    format: "Online",
    location: "Live online session",
    summary:
      "An illustrative format for a fireside conversation where an early-stage founder walks aspiring founders through validating an idea and finding first users.",
    image: founder,
    agenda: [
      { time: "18:00", item: "Welcome and context" },
      { time: "18:10", item: "Founder story and lessons" },
      { time: "18:50", item: "Open Q&A" },
    ],
    eligibility: "Open to all registered community members.",
    organizer: "Elite Forums",
  },
  {
    slug: "campus-hackathon-concept",
    sample: true,
    type: "Hackathon",
    title: "Campus Build Weekend",
    date: "2027-01-23",
    format: "In-person",
    city: "To be announced",
    location: "Partner campus, to be announced",
    summary:
      "A sample 36-hour build weekend concept where interdisciplinary student teams prototype solutions to real campus problems.",
    image: hackathon,
    agenda: [
      { time: "Day 1", item: "Kick-off, team formation, problem briefs" },
      { time: "Day 2", item: "Build sprint with mentor check-ins" },
      { time: "Day 2 PM", item: "Demos and feedback" },
    ],
    eligibility: "Teams of 2–4 students from any discipline.",
    organizer: "Elite Forums with a partner E-Cell",
  },
  {
    slug: "startup-basics-workshop-concept",
    sample: true,
    type: "Workshop",
    title: "Startup Basics Workshop",
    date: "2026-09-12",
    format: "In-person",
    city: "To be announced",
    location: "Partner campus",
    summary:
      "A sample hands-on workshop concept covering problem discovery, customer interviews, and simple prototyping.",
    image: students,
    agenda: [
      { time: "10:00", item: "Problem discovery" },
      { time: "11:30", item: "Customer interview practice" },
      { time: "13:30", item: "Paper prototyping" },
    ],
    eligibility: "First- and second-year students.",
    organizer: "Elite Forums",
  },
];

export const isUpcoming = (e: EventItem) => new Date(e.date) >= new Date(new Date().toDateString());

export type Article = {
  slug: string;
  sample: boolean;
  category: "Founder Interview" | "Guide" | "Event Recap" | "Student Story" | "Learning";
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  body: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "how-to-start-an-ecell",
    sample: true,
    category: "Guide",
    title: "How to start an E-Cell that students actually show up for",
    excerpt:
      "A practical starting framework for student leaders building an entrepreneurship community from scratch.",
    image: students,
    readTime: "6 min",
    body: [
      "Most campus clubs start with energy and fade by the second semester. The ones that last share a few habits: a clear reason to exist, a small committed core team, and a rhythm of activities that students can count on.",
      "Start by talking to twenty students. Ask what they want to learn, build, or meet. Their answers become your first calendar.",
      "Then pick one recurring format — a fortnightly build night, a monthly founder conversation — and run it consistently before adding anything else.",
      "Finally, document everything. A simple shared record of what worked lets the next batch of leaders keep the community alive.",
    ],
  },
  {
    slug: "validating-ideas-as-a-student",
    sample: true,
    category: "Learning",
    title: "Validating a startup idea while you're still in college",
    excerpt:
      "Cheap, fast ways to test whether a problem is worth solving — before you write a line of code.",
    image: founder,
    readTime: "5 min",
    body: [
      "Your biggest advantage as a student is access: to peers, professors, and a campus full of potential early users.",
      "Write down the problem in one sentence. Find ten people who have it. Ask how they solve it today and what that costs them.",
      "If nobody is trying to solve it, it may not be painful enough. If everyone is hacking together a workaround, you may have found something.",
    ],
  },
  {
    slug: "what-a-hackathon-teaches",
    sample: true,
    category: "Event Recap",
    title: "What a weekend hackathon can teach a first-time builder",
    excerpt:
      "An illustrative recap format showing how event stories will be presented on Elite Forums.",
    image: hackathon,
    readTime: "4 min",
    body: [
      "Hackathons compress months of learning into a weekend: scoping, teamwork, shipping, and presenting under pressure.",
      "This article is placeholder content demonstrating the recap layout. Real recaps will be published after Elite Forums events take place.",
    ],
  },
];

/** Approved partner institutions. Leave empty until partnerships are confirmed. */
export const PARTNERS: { name: string; city: string; type: string }[] = [];
