/**
 * Editable site content.
 *
 * Every piece of public copy is declared here with its default. The admin
 * console builds its content editor from this file, and saves only the fields
 * an administrator changed to the `site_content` table (one row per page, keyed
 * by page id). Pages read values through `useContent` in `content-context.tsx`.
 *
 * Text marked "rich" supports two things: a new line starts a new line on the
 * page, and *asterisks* highlight a word in the brand colour.
 */

import { FAQS } from "./faqs";
import {
  COOKIES_DEFAULTS,
  PRIVACY_DEFAULTS,
  REFUNDS_DEFAULTS,
  TERMS_DEFAULTS,
} from "./legal-defaults";

export type Item = Record<string, string | string[]>;

type ItemFieldDef = {
  type: "text" | "textarea" | "lines" | "select";
  label: string;
  options?: readonly string[];
};

export type FieldDef =
  | {
      type: "text" | "textarea" | "rich" | "image" | "doc" | "toggle";
      label: string;
      default: string;
      hint?: string;
    }
  | { type: "lines"; label: string; default: string[]; hint?: string }
  | {
      type: "items";
      label: string;
      itemName: string;
      fields: Record<string, ItemFieldDef>;
      default: Item[];
      hint?: string;
      /** Items map onto fixed links or icons, so they cannot be added or removed. */
      fixed?: boolean;
    };

/**
 * A section with an `id` can be switched off in the admin console; pages check
 * it with `c.on(id)`. `note` explains a switch-only section whose words are
 * edited elsewhere.
 */
export type SectionDef = {
  title: string;
  id?: string;
  note?: string;
  fields: Record<string, FieldDef>;
};
/** `seo` holds the page's default search title and description, editable per page. */
export type PageDef = {
  id: string;
  label: string;
  path?: string;
  seo?: { title: string; description: string; noindex?: boolean };
  sections: SectionDef[];
};

const text = (label: string, value: string, hint?: string): FieldDef => ({
  type: "text",
  label,
  default: value,
  ...(hint ? { hint } : {}),
});
const area = (label: string, value: string): FieldDef => ({
  type: "textarea",
  label,
  default: value,
});
const rich = (label: string, value: string): FieldDef => ({
  type: "rich",
  label,
  default: value,
  hint: "New line = line break. *Asterisks* highlight words in the brand colour.",
});
const image = (label: string): FieldDef => ({
  type: "image",
  label,
  default: "",
  hint: "Paste an image link (https://…). Leave empty to use the built-in photo.",
});
const lines = (label: string, value: string[], hint?: string): FieldDef => ({
  type: "lines",
  label,
  default: value,
  hint: hint ?? "One per line.",
});
const items = (
  label: string,
  itemName: string,
  fields: Record<string, ItemFieldDef>,
  value: Item[],
  options: { fixed?: boolean; hint?: string } = {},
): FieldDef => ({ type: "items", label, itemName, fields, default: value, ...options });

/** Icons a card can show; pages map these names to drawings. */
export const ICON_NAMES = [
  "Rocket",
  "Flask",
  "Building",
  "Users",
  "Sparkles",
  "Network",
  "Briefcase",
  "Lightbulb",
  "Cpu",
  "Graduation cap",
];

const LINK_FIELDS = {
  label: { type: "text", label: "Label" },
  link: { type: "text", label: "Link" },
} as const;

const TITLE_BODY = {
  title: { type: "text", label: "Title" },
  body: { type: "textarea", label: "Description" },
} as const;

const hero = (eyebrow: string, title: string, intro: string): Record<string, FieldDef> => ({
  "hero.eyebrow": text("Small label above the title", eyebrow),
  "hero.title": rich("Title", title),
  "hero.intro": area("Introduction", intro),
});

const BASE_PAGES: PageDef[] = [
  {
    id: "global",
    label: "Header, footer & banner",
    sections: [
      {
        title: "Header",
        fields: {
          "nav.items": items(
            "Menu",
            "Menu link",
            LINK_FIELDS,
            [
              { label: "Home", link: "/" },
              { label: "Innovation Lab", link: "/innovation-lab" },
              { label: "Ecosystem", link: "/ecosystem" },
              { label: "For Colleges", link: "/colleges" },
              { label: "Events", link: "/events" },
              { label: "Community", link: "/community" },
            ],
            {
              hint:
                "Links: " +
                "A page path such as /events or /apply?program=cohort, or a full https:// link.",
            },
          ),
          "header.partner": text("Second button", "Partner College"),
          "header.partnerLink": text("Second button link", "/colleges"),
          "header.join": text("Main button", "Join Community"),
          "header.joinLink": text("Main button link", "/community"),
          "header.mobileJoin": text("Mobile menu: join button", "Join the Community"),
          "header.mobilePartner": text("Mobile menu: partner button", "Partner Your College"),
        },
      },
      {
        title: "Footer",
        fields: {
          "footer.tagline": area(
            "Tagline under the logo",
            "A community for aspiring founders. Started in Mumbai, building for all of India.",
          ),
          "footer.explore.title": text("Column 1 title", "Explore"),
          "footer.involved.title": text("Column 2 title", "Get involved"),
          "footer.legal.title": text("Column 3 title", "Legal"),
          "footer.links": items(
            "Footer links",
            "Footer link",
            {
              column: {
                type: "select",
                label: "Column",
                options: ["Column 1", "Column 2", "Column 3"],
              },
              ...LINK_FIELDS,
            },
            [
              ...[
                ["Innovation Lab", "/innovation-lab"],
                ["Ecosystem", "/ecosystem"],
                ["Events", "/events"],
                ["Resources", "/resources"],
                ["FAQs", "/faqs"],
                ["Partner Network", "/network"],
              ].map(([label, link]) => ({ column: "Column 1", label: label!, link: link! })),
              ...[
                ["Join the Community", "/community"],
                ["Apply to a Program", "/apply"],
                ["Partner Your College", "/colleges"],
                ["Campus Ambassadors", "/campus-ambassadors"],
                ["Contact", "/contact"],
              ].map(([label, link]) => ({ column: "Column 2", label: label!, link: link! })),
              ...[
                ["Privacy", "/privacy"],
                ["Terms", "/terms"],
                ["Refund policy", "/refunds"],
                ["Cookie policy", "/cookies"],
                ["Delete my data", "/data-deletion"],
              ].map(([label, link]) => ({ column: "Column 3", label: label!, link: link! })),
            ],
            {
              hint:
                "Links: " +
                "A page path such as /events or /apply?program=cohort, or a full https:// link.",
            },
          ),
          "footer.copyright": text("Copyright line", "Elite Forums. All rights reserved."),
          "footer.strapline": text("Strapline", "Where ambition meets opportunity"),
        },
      },
      {
        title: "Closing banner (bottom of most pages)",
        fields: {
          "cta.eyebrow": text("Small label", "Make your next move"),
          "cta.title": area("Title", "The next entrepreneurial community could start with you."),
          "cta.primary": text("Main button", "Join the Community"),
          "cta.secondary": text("Second button", "Partner Your College"),
          "cta.primaryLink": text(
            "Main button link",
            "/community",
            "A page path such as /events, or a full https:// link.",
          ),
          "cta.secondaryLink": text(
            "Second button link",
            "/colleges",
            "A page path such as /events, or a full https:// link.",
          ),
        },
      },
      {
        title: "Cookie banner",
        fields: {
          "cookies.eyebrow": text("Small label", "Your privacy choices"),
          "cookies.title": text("Title", "Cookies on Elite Forums"),
          "cookies.body": area(
            "Message",
            "We use essential browser storage for security, authentication and form operation. Optional analytics help us understand page usage. The Google tag starts with analytics storage denied; accepting enables measurement.",
          ),
          "cookies.accept": text("Accept button", "Accept optional cookies"),
          "cookies.essential": text("Essential-only button", "Essential only"),
        },
      },
      {
        title: "Page not found (404)",
        fields: {
          "notFound.eyebrow": text("Small label", "404 · Lost in the ecosystem"),
          "notFound.title": text("Title", "Page not found"),
          "notFound.body": area(
            "Message",
            "The page you're looking for doesn't exist or has been moved.",
          ),
          "notFound.button": text("Button", "Go home"),
        },
      },
    ],
  },
  {
    id: "home",
    label: "Homepage",
    path: "/",
    seo: {
      title: "Startup Community for Aspiring Founders in India",
      description:
        "Join an India-focused startup community for student entrepreneurs and aspiring founders, with practical programmes, events and college partnerships.",
    },
    sections: [
      {
        title: "Hero",
        fields: {
          ...hero(
            "Building India’s startup ecosystem",
            "Where *founder*\nambition meets\n*opportunity.*",
            "Elite Forums is for anyone who wants to become a founder — students, working professionals and first-time builders. We started in Mumbai, India’s financial capital, and are growing across colleges and cities to make India a startup hub.",
          ),
          "hero.primary": text("Main button", "Join the Community"),
          "hero.secondary": text("Second button", "Partner Your College"),
          "hero.primaryLink": text(
            "Main button link",
            "/community",
            "A page path such as /events, or a full https:// link.",
          ),
          "hero.secondaryLink": text(
            "Second button link",
            "/colleges",
            "A page path such as /events, or a full https:// link.",
          ),
          "hero.scroll": text("Scroll hint", "Ideas start here."),
          "hero.image": image("Background photo"),
        },
      },
      {
        title: "Three pillars under the hero",
        id: "pillars",
        fields: {
          pillars: items("Pillars", "Pillar", TITLE_BODY, [
            { title: "Aspiring founders", body: "Where ambition finds its people" },
            { title: "Colleges & E-Cells", body: "Where communities take shape" },
            { title: "Founders & mentors", body: "Where experience opens doors" },
          ]),
        },
      },
      {
        title: "Ecosystem grid",
        id: "grid",
        note: "Its words are edited under Shared sections.",
        fields: {},
      },
      {
        title: "Mission",
        id: "mission",
        note: "Its words are edited under Shared sections.",
        fields: {},
      },
      {
        title: "Two ways to join",
        id: "join",
        note: "Its words are edited under Shared sections.",
        fields: {},
      },
      {
        title: "FAQ preview",
        id: "faqs",
        note: "Its questions are edited under FAQs.",
        fields: {},
      },
      {
        title: "Closing banner",
        id: "cta",
        note: "Its words are edited under Header, footer & banner.",
        fields: {},
      },
    ],
  },
  {
    id: "sections",
    label: "Shared sections",
    path: "/",
    sections: [
      {
        title: "Ecosystem grid (homepage and Ecosystem page)",
        fields: {
          "grid.eyebrow": text("Small label", "The ecosystem"),
          "grid.title": rich("Title", "A world of *possibility.*"),
          "grid.link": text("Link text", "Explore the ecosystem"),
          "grid.linkTo": text(
            "Link destination",
            "/ecosystem",
            "A page path such as /events, or a full https:// link.",
          ),
          "grid.brand.tagline": text("Logo tile: tagline", "Ideas. People. Possibilities."),
          "grid.network.title": rich("Network tile: title", "From Mumbai.\nTo all of India."),
          "grid.network.body": text(
            "Network tile: caption",
            "One network, built to make India a startup hub.",
          ),
          "grid.community.eyebrow": text("Photo tile: small label", "The power of community"),
          "grid.community.title": rich("Photo tile: title", "Build together.\nGrow together."),
          "grid.community.image": image("Photo tile: photo"),
          "grid.principles.eyebrow": text("Principles tile: small label", "Our principles"),
          "grid.principles.items": lines("Principles", [
            "Innovation",
            "Collaboration",
            "Learning",
            "Entrepreneurship",
          ]),
          "grid.founder.eyebrow": text("Founder tile: small label", "Conversations that matter"),
          "grid.founder.title": rich("Founder tile: title", "Founder\nconnect"),
          "grid.founder.link": text(
            "Founder tile: link",
            "/events",
            "A page path such as /events, or a full https:// link.",
          ),
          "grid.founder.image": image("Founder tile: photo"),
          "grid.next.eyebrow": text("Green tile: small label", "Your next chapter"),
          "grid.next.title": rich("Green tile: title", "Your idea.\nYour city.\nYour next move."),
          "grid.next.link": text(
            "Green tile: link",
            "/community",
            "A page path such as /events, or a full https:// link.",
          ),
        },
      },
      {
        title: "Mission (homepage and Ecosystem page)",
        fields: {
          "mission.eyebrow": text("Small label", "Mission"),
          "mission.title": rich(
            "Title",
            "Entrepreneurship should be a *community,* not a solo journey.",
          ),
          "mission.p1": area(
            "First paragraph",
            "Great ideas exist everywhere — in classrooms, offices and living rooms. But turning them into something meaningful takes more than ambition. It takes people who believe in you, spaces to experiment, and the right opportunities at the right time.",
          ),
          "mission.p2": area(
            "Second paragraph",
            "Elite Forums exists to bring those pieces together for anyone who wants to become a founder. We began in Mumbai, India’s financial capital, with college communities at the heart of our work — and we’re scaling across the country with one vision: to make India a startup hub.",
          ),
          "mission.steps.eyebrow": text("Steps: small label", "How the ecosystem works"),
          "mission.steps": items("Steps", "Step", TITLE_BODY, [
            {
              title: "Start with people",
              body: "Welcome anyone with the ambition to build — students, working professionals and first-time founders.",
            },
            {
              title: "Build communities",
              body: "Grow active, inclusive communities across colleges and cities, where ideas find their people.",
            },
            {
              title: "Create experiences",
              body: "Bring learning to life through workshops, hackathons, founder conversations and collaborative projects.",
            },
            {
              title: "Scale across India",
              body: "Connect communities, mentors and industry partners so opportunity travels from Mumbai to the whole nation.",
            },
          ]),
        },
      },
      {
        title: "Two ways to join (homepage and Ecosystem page)",
        fields: {
          "join.eyebrow": text("Small label", "Two ways to join"),
          "join.title": rich("Title", "Find your path into\nthe *ecosystem.*"),
          "join.paths": items(
            "Paths",
            "Path",
            {
              tag: { type: "text", label: "Small label" },
              title: { type: "text", label: "Title" },
              benefits: { type: "lines", label: "Benefits (one per line)" },
              label: { type: "text", label: "Button" },
              link: { type: "text", label: "Button link (e.g. /community)" },
              icon: { type: "select", label: "Icon", options: ICON_NAMES },
            },
            [
              {
                tag: "For aspiring founders",
                title: "Discover your entrepreneurial community.",
                benefits: [
                  "Meet ambitious builders and aspiring founders",
                  "Learn through practical workshops",
                  "Build at hackathons and collaborative events",
                  "Get closer to founders and mentors",
                  "Discover opportunities beyond your own circle",
                ],
                label: "Explore the Community",
                link: "/community",
                icon: "Sparkles",
              },
              {
                tag: "For colleges & E-Cells",
                title: "Build a stronger entrepreneurship culture on campus.",
                benefits: [
                  "Strengthen your college’s E-Cell",
                  "Connect students with the wider ecosystem",
                  "Co-host workshops and hackathons",
                  "Bring founder conversations to campus",
                  "Support your next generation of student leaders",
                ],
                label: "Become a Partner",
                link: "/colleges",
                icon: "Network",
              },
            ],
          ),
        },
      },
    ],
  },
  {
    id: "lab",
    label: "Innovation Lab",
    path: "/innovation-lab",
    seo: {
      title: "Startup Innovation Lab",
      description:
        "See how the Elite Forums Innovation Lab helps turn community ideas into technology, working products and new ventures.",
    },
    sections: [
      {
        title: "Hero",
        fields: {
          ...hero(
            "Innovation Laboratory",
            "Here we build\n*technology and startups.*",
            "The Innovation Laboratory is the building arm of Elite Forums — where ideas from the community become working technology and new ventures.",
          ),
          "hero.primary": text("Main button", "Build with us"),
          "hero.secondary": text("Second button", "Join the Community"),
          "hero.primaryLink": text(
            "Main button link",
            "/contact",
            "A page path such as /events, or a full https:// link.",
          ),
          "hero.secondaryLink": text(
            "Second button link",
            "/community",
            "A page path such as /events, or a full https:// link.",
          ),
        },
      },
      {
        title: "Impact figures",
        id: "stats",
        fields: {
          "stats.eyebrow": text("Small label", "Innovation Lab impact"),
          "stats.title": text("Title", "Ideas built into real outcomes."),
          "stats.items": items("Lab figures", "Figure", TITLE_BODY, [
            { title: "25+", body: "Projects built" },
            { title: "1,500+", body: "People trained" },
            { title: "50+", body: "Technologies discovered and used" },
          ]),
        },
      },
      {
        title: "What we build",
        id: "tracks",
        fields: {
          "tracks.eyebrow": text("Small label", "What we build"),
          "tracks.title": rich("Title", "Two things. Done properly."),
          tracks: items(
            "Tracks",
            "Track",
            {
              icon: { type: "select", label: "Icon", options: ICON_NAMES },
              tag: { type: "text", label: "Small label" },
              title: { type: "text", label: "Title" },
              body: { type: "textarea", label: "Description" },
            },
            [
              {
                icon: "Cpu",
                tag: "Technology",
                title: "We build technology.",
                body: "Ideas become prototypes and prototypes become products. The lab is where builders get hands-on and ship real technology.",
              },
              {
                icon: "Rocket",
                tag: "Startups",
                title: "We build startups.",
                body: "Strong ideas and committed teams are shaped into ventures — from the first problem statement to a company that can stand on its own.",
              },
            ],
          ),
        },
      },
      {
        title: "How the lab works",
        id: "stages",
        fields: {
          "technologies.eyebrow": text("Technology focus: small label", "Technology focus"),
          "technologies.title": rich(
            "Technology focus: title",
            "We work on ambitious *frontier technologies.*",
          ),
          "technologies.intro": area(
            "Technology focus: introduction",
            "Our Innovation Lab explores and builds products across emerging technology domains.",
          ),
          technologies: lines("Technologies", [
            "Artificial Intelligence (AI)",
            "Internet of Things (IoT)",
            "Software as a Service (SaaS)",
            "Manufacturing",
            "Research and Development (R&D)",
            "Patent Technology",
            "Machine Learning (ML)",
            "Chip Design",
          ]),
          "stages.eyebrow": text("Small label", "How the lab works"),
          "stages.title": rich("Title", "From idea to venture."),
          stages: items("Stages", "Stage", TITLE_BODY, [
            {
              title: "Explore",
              body: "Start from a real problem worth solving and the people who have it.",
            },
            {
              title: "Prototype",
              body: "Build a working version quickly and put it in front of users.",
            },
            { title: "Launch", body: "Turn what works into a product, a team and a startup." },
          ]),
          "stages.image": image("Photo"),
          "cta.title": area(
            "Closing banner title",
            "Have something worth building? Bring it to the lab.",
          ),
        },
      },
      {
        title: "Technology focus",
        id: "technologies",
        note: "Its words are edited in the What we build section above.",
        fields: {},
      },
      {
        title: "Closing banner",
        id: "cta",
        note: "Its title is edited in How the lab works; buttons under Header, footer & banner.",
        fields: {},
      },
    ],
  },
  {
    id: "colleges",
    label: "For Colleges & programmes",
    path: "/colleges",
    seo: {
      title: "Startup Programs for Colleges and E-Cells",
      description:
        "Explore incubation-centre setup and operations, founder sessions, mentoring and entrepreneurship programmes for colleges and student startup teams in India.",
    },
    sections: [
      {
        title: "Hero",
        fields: hero(
          "For colleges & E-Cells",
          "Bring founders to your campus.",
          "We help colleges set up and run incubation centres, bring founders to campus for practical sessions, and provide mentoring to student startup teams.",
        ),
      },
      {
        title: "What we offer colleges",
        id: "offer",
        fields: {
          offer: items("Offers", "Offer", TITLE_BODY, [
            {
              title: "Workshops",
              body: "Hands-on sessions on startup fundamentals, run on your campus.",
            },
            {
              title: "Hackathons",
              body: "Co-hosted build weekends with problem briefs and mentors.",
            },
            {
              title: "Founder sessions",
              body: "Conversations with early-stage founders, online or in person, paired with practical mentoring for student startup teams.",
            },
            {
              title: "E-Cell support",
              body: "Formats and playbooks to help your student community grow.",
            },
            {
              title: "Incubation centre setup",
              body: "We help colleges plan and establish an incubation centre with a clear model for supporting student founders.",
            },
            {
              title: "Incubation centre operations",
              body: "We help colleges run their incubation centre through founder programming and ongoing support for student startups.",
            },
            {
              title: "Technical support",
              body: "Student startup teams can get technical guidance and product-building support from the Elite Forums Innovation Lab.",
            },
            {
              title: "Coworking and meeting room discounts",
              body: "Student founders can access discounted rates for coworking space and meeting-room bookings through our programmes.",
            },
          ]),
        },
      },
      {
        title: "Founder programmes",
        id: "programmes",
        fields: {
          "programmes.eyebrow": text("Small label", "Founder facilities"),
          "programmes.title": rich("Title", "Three ways to\n*build further.*"),
          "programmes.intro": area(
            "Introduction",
            "Choose the facility that fits your stage. Every programme is designed to bring founders closer to mentorship, execution support, workspace and the wider startup ecosystem.",
          ),
          programmes: items(
            "Programmes",
            "Programme",
            {
              eyebrow: { type: "text", label: "Small label" },
              title: { type: "text", label: "Name" },
              programme: {
                type: "text",
                label: "Application programme code (from Forms → Programme application)",
              },
              icon: { type: "select", label: "Icon", options: ICON_NAMES },
              price: { type: "text", label: "Price badge" },
              intro: { type: "textarea", label: "Introduction" },
              benefits: { type: "lines", label: "Benefits (one per line)" },
            },
            [
              {
                eyebrow: "For founders building from zero",
                title: "Startup Cohort Program",
                programme: "cohort",
                icon: "Rocket",
                price: "INR 5,000 + taxes*",
                intro:
                  "A structured 90-day journey for selected founders and startup teams who want practical support from idea validation to a stronger launch-ready foundation.",
                benefits: [
                  "Guaranteed incubation support for 90 days",
                  "Mentorship from startup and domain experts",
                  "Startup connect ecosystem and founder's connect",
                  "Product development and research guidance",
                  "Pitch deck preparation and investor readiness",
                  "Guidance on fundraising and government grants",
                  "Legal aid and assistance for startup-related needs",
                  "Bank and NBFC finance guidance: prepare a business plan, cash-flow projections and loan documents, understand application steps, and explore suitable lender options; approval and loan terms depend on lender eligibility",
                  "Private investor readiness: shape your funding ask and pitch, prepare for due diligence, and explore introductions to relevant private or angel investors when available; investment is not guaranteed",
                  "Access to the Elite Forums Innovation Lab and its IT team for the full cohort",
                  "Workspace access: Saturdays from 3:00 PM onward and Sundays from 9:00 AM onward",
                  "Guidance on market research, customer discovery and product building",
                  "Additional founder learning, connections and programme opportunities",
                ],
              },
              {
                eyebrow: "For startups ready to accelerate",
                title: "Incubation Program",
                programme: "incubation",
                icon: "Flask",
                price: "INR 5,000 + taxes*",
                intro:
                  "Everything included in the Startup Cohort experience, with a focused incubation environment for founders who want consistent access to people, space and execution support.",
                benefits: [
                  "Guaranteed incubation support for 90 days",
                  "All core Startup Cohort Program benefits",
                  "Latest updates about relevant startup events",
                  "Regular founder's connect opportunities",
                  "Workspace access: Saturdays from 3:00 PM onward and Sundays from 9:00 AM onward",
                  "Mentorship from our experts whenever the founder team is present",
                  "Discounts on coworking space and meeting-room bookings",
                  "Special IT project-development pricing, advertised at up to 4x cheaper than typical market cost",
                  "Cloud credits to help reduce infrastructure costs for your startup, subject to provider eligibility and availability",
                  "Practical support through the Elite Forums Innovation Lab team",
                ],
              },
              {
                eyebrow: "For teams looking for flexible workspace",
                title: "Coworking Space Membership",
                programme: "coworking",
                icon: "Building",
                price: "From INR 7,000/month*",
                intro:
                  "A professional, founder-friendly workspace with the practical facilities teams need to work consistently and stay connected to the startup ecosystem.",
                benefits: [
                  "Weekend access: Saturdays from 3:00 PM onward and Sundays from 9:00 AM onward",
                  "Shared monthly coworking starts at INR 7,000 for a minimum team of 5 people",
                  "Dedicated coworking space: INR 15,000 per month with weekday access for 4 days per week",
                  "Discounts on additional coworking space and meeting-room bookings",
                  "Wi-Fi access for the team",
                  "Dedicated charging ports",
                  "Pantry access",
                  "Professional working environment",
                  "Air-conditioned, temperature-controlled space",
                  "Quick-commerce options available within approximately 7 minutes",
                  "Guidance from startup mentors or the Elite Forums Innovation Lab team",
                ],
              },
            ],
            {
              hint: "Each card's button opens the application form for its programme code.",
            },
          ),
          "programmes.link": text("Card link text", "Apply for this programme"),
          "programmes.footnote": area(
            "Footnote",
            "*Startup Cohort and Incubation Program fees are INR 5,000 plus applicable taxes. Shared coworking starts at INR 7,000 per month for a team of at least 5; dedicated coworking is INR 15,000 per month with weekday access for 4 days per week. Confirm applicable taxes, availability and booking terms before enrolment.",
          ),
        },
      },
      {
        title: "Partnership form heading",
        id: "form",
        fields: {
          "form.eyebrow": text("Small label", "Apply"),
          "form.title": text("Title", "Partner your college"),
        },
      },
    ],
  },
  {
    id: "community",
    label: "Community",
    path: "/community",
    seo: {
      title: "Startup Community for Students and Founders",
      description:
        "Join Elite Forums to learn with aspiring founders, take part in workshops and hackathons, and connect with student entrepreneurs across India.",
    },
    sections: [
      {
        title: "Hero",
        fields: hero(
          "Community",
          "Join people who build.",
          "Get early access to events, founder sessions and resources for aspiring founders — whether you’re a student, a working professional or building your first startup.",
        ),
      },
      {
        title: "Form heading",
        fields: {
          "form.eyebrow": text("Small label", "Register"),
          "form.title": text("Title", "Your details"),
        },
      },
      {
        title: "Community network",
        id: "stats",
        fields: {
          "stats.eyebrow": text("Small label", "The network"),
          "stats.title": text("Title", "A growing ecosystem of people and places."),
          "stats.items": items("Network figures", "Figure", TITLE_BODY, [
            {
              title: "500+",
              body: "Founders",
            },
            {
              title: "50+",
              body: "Angel Investors",
            },
            {
              title: "10+",
              body: "VCs",
            },
            {
              title: "10+",
              body: "Incubation centre connections",
            },
          ]),
        },
      },
    ],
  },
  {
    id: "apply",
    label: "Programme application",
    path: "/apply",
    seo: {
      title: "Apply to Startup Incubation and Cohort Programs",
      description:
        "Apply to the Elite Forums Startup Cohort, Startup Incubation Program or Coworking Space Membership in India.",
    },
    sections: [
      {
        title: "Hero",
        fields: hero(
          "Program admissions",
          "Apply to build\n*with Elite Forums.*",
          "One application for the Startup Cohort Program, the Startup Incubation Program and Coworking Space Membership. Choose your program and answer the questions that apply to it.",
        ),
      },
      {
        title: "How admission works",
        id: "steps",
        fields: {
          "steps.eyebrow": text("Small label", "How admission works"),
          "steps.title": text("Title", "Four steps."),
          steps: items("Steps", "Step", TITLE_BODY, [
            {
              title: "Application form",
              body: "Common questions, followed by the section for your program.",
            },
            {
              title: "Internal review",
              body: "We assess fit, support requirements, eligibility and readiness.",
            },
            {
              title: "Interview or facility visit",
              body: "Cohort and incubation applicants are interviewed; coworking applicants get a tour or onboarding call.",
            },
            {
              title: "Offer and onboarding",
              body: "We confirm scope, fees, duration, house rules and payment terms before admission.",
            },
          ]),
          "form.eyebrow": text("Form: small label", "Application"),
          "form.title": text("Form: title", "Your application"),
        },
      },
    ],
  },
  {
    id: "ecosystem",
    label: "Ecosystem",
    path: "/ecosystem",
    seo: {
      title: "Startup Ecosystem for Aspiring Founders",
      description:
        "Explore how aspiring founders, college E-Cells, mentors and industry partners connect through the Elite Forums startup ecosystem.",
    },
    sections: [
      {
        title: "Hero",
        fields: hero(
          "The ecosystem",
          "Connected people.\n*Bigger possibilities.*",
          "A shared space for aspiring founders, college communities, mentors and partners to learn, build and grow together.",
        ),
      },
      {
        title: "Ecosystem grid",
        id: "grid",
        note: "Its words are edited under Shared sections.",
        fields: {},
      },
      {
        title: "Mission",
        id: "mission",
        note: "Its words are edited under Shared sections.",
        fields: {},
      },
      {
        title: "Two ways to join",
        id: "join",
        note: "Its words are edited under Shared sections.",
        fields: {},
      },
      {
        title: "Closing banner",
        id: "cta",
        note: "Its words are edited under Header, footer & banner.",
        fields: {},
      },
    ],
  },
  {
    id: "events",
    label: "Events page",
    path: "/events",
    seo: {
      title: "Startup Events, Workshops and Hackathons in India",
      description:
        "Find startup workshops, hackathons and founder conversations for students and aspiring entrepreneurs in India.",
    },
    sections: [
      {
        title: "Hero",
        fields: hero(
          "Experiences that move you forward",
          "Show up.\n*Build something.*",
          "Workshops, build weekends and honest founder conversations. Find the experience that sparks your next step.",
        ),
      },
      {
        title: "Calendar section",
        id: "calendar",
        fields: {
          "calendar.eyebrow": text("Small label", "Live event calendar"),
          "calendar.title": text("Title", "What’s happening next."),
          "calendar.intro": area(
            "Introduction",
            "Browse upcoming events and register through our event partner.",
          ),
          "list.empty": text("Message when no events match", "No events in this selection."),
        },
      },
      {
        title: "Elite Forums events",
        id: "list",
        fields: {
          "list.eyebrow": text("Small label", "Elite Forums events"),
          "list.title": text("Title", "Hosted by us."),
          "list.all": text("Filter: all types", "All"),
          "list.dates": lines(
            "Date filter options",
            ["All dates", "Upcoming", "Past"],
            "Three lines, in this order: all, upcoming, past.",
          ),
          "list.more": text("Card link", "Explore event"),
        },
      },
      {
        title: "Closing banner",
        id: "cta",
        note: "Its words are edited under Header, footer & banner.",
        fields: {},
      },
      {
        title: "Event detail pages",
        note: "Wording shared by every event's own page. Each event's details are edited under Events.",
        fields: {
          "detail.about": text("Description heading", "About this event"),
          "detail.agenda": text("Agenda heading", "Agenda"),
          "detail.back": text("Back link", "Back to all events"),
          "detail.completed": text("Badge on past events", "Event completed"),
          "detail.date": text("Fact label: date", "Date"),
          "detail.time": text("Fact label: time", "Time"),
          "detail.where": text("Fact label: format and location", "Format & location"),
          "detail.entry": text("Fact label: entry", "Entry"),
          "detail.seats": text("Fact label: seats", "Seats"),
          "detail.who": text("Fact label: who can join", "Who can join"),
          "detail.organiser": text("Fact label: organiser", "Organised by"),
          "detail.reserveTitle": text("Registration box title", "Reserve your spot."),
          "detail.reserveBody": text(
            "Registration box text (form on page)",
            "Joining details are emailed to you before the event.",
          ),
          "detail.partnerBody": text(
            "Registration box text (partner link)",
            "Registration is handled by our event partner.",
          ),
          "detail.registerButton": text("Partner registration button", "Register for this event"),
          "detail.mobileButton": text("Phone register bar button", "Reserve your spot"),
          "detail.endedTitle": text("Past event title", "This event has taken place."),
          "detail.endedBody": area(
            "Past event text",
            "Registration is closed. See what\u2019s coming up next, or join the community to hear about new events first.",
          ),
          "detail.endedPrimary": text("Past event: main button", "See upcoming events"),
          "detail.endedPrimaryLink": text("Past event: main button link", "/events"),
          "detail.endedSecondary": text("Past event: second button", "Join the Community"),
          "detail.endedSecondaryLink": text("Past event: second button link", "/community"),
        },
      },
    ],
  },
  {
    id: "resources",
    label: "Resources & articles",
    path: "/resources",
    seo: {
      title: "Startup Guides for Students and Aspiring Founders",
      description:
        "Explore practical startup guides on testing ideas, building campus E-Cells and learning to launch as a student founder.",
    },
    sections: [
      {
        title: "Hero",
        fields: hero(
          "Ideas worth sharing",
          "Read. Learn.\n*Make your move.*",
          "Practical perspectives for your first idea, your next build, or the community you’re creating.",
        ),
      },
      {
        title: "Articles",
        fields: {
          articles: items(
            "Articles",
            "Article",
            {
              title: { type: "text", label: "Title" },
              slug: { type: "text", label: "Web address (lowercase-with-hyphens)" },
              category: {
                type: "select",
                label: "Category",
                options: ["Founder Interview", "Guide", "Event Recap", "Student Story", "Learning"],
              },
              readTime: { type: "text", label: "Reading time" },
              excerpt: { type: "textarea", label: "Summary" },
              image: {
                type: "text",
                label: "Photo: students, founder, hackathon, or an image link",
              },
              sample: {
                type: "select",
                label: "Show “Sample content” badge",
                options: ["yes", "no"],
              },
              body: { type: "lines", label: "Body (one paragraph per line)" },
            },
            [
              {
                slug: "how-to-start-an-ecell",
                sample: "yes",
                category: "Guide",
                title: "How to start an E-Cell that students actually show up for",
                excerpt:
                  "A practical starting framework for student leaders building an entrepreneurship community from scratch.",
                image: "students",
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
                sample: "yes",
                category: "Learning",
                title: "Validating a startup idea while you're still in college",
                excerpt:
                  "Cheap, fast ways to test whether a problem is worth solving — before you write a line of code.",
                image: "founder",
                readTime: "5 min",
                body: [
                  "Your biggest advantage as a student is access: to peers, professors, and a campus full of potential early users.",
                  "Write down the problem in one sentence. Find ten people who have it. Ask how they solve it today and what that costs them.",
                  "If nobody is trying to solve it, it may not be painful enough. If everyone is hacking together a workaround, you may have found something.",
                ],
              },
              {
                slug: "what-a-hackathon-teaches",
                sample: "yes",
                category: "Event Recap",
                title: "What a weekend hackathon can teach a first-time builder",
                excerpt:
                  "An illustrative recap format showing how event stories will be presented on Elite Forums.",
                image: "hackathon",
                readTime: "4 min",
                body: [
                  "Hackathons compress months of learning into a weekend: scoping, teamwork, shipping, and presenting under pressure.",
                  "This article is placeholder content demonstrating the recap layout. Real recaps will be published after Elite Forums events take place.",
                ],
              },
            ],
          ),
          "list.empty": text(
            "Message when search finds nothing",
            "No resources match your search.",
          ),
        },
      },
      {
        title: "Article page",
        fields: {
          "article.back": text("Back link", "Back to resources"),
        },
      },
    ],
  },
  {
    id: "network",
    label: "Partner Network",
    path: "/network",
    seo: {
      title: "Startup and College Partner Network",
      description:
        "Connect your college, E-Cell, startup community or organisation with the Elite Forums entrepreneurship network.",
    },
    sections: [
      {
        title: "Hero",
        fields: hero(
          "Partner network",
          "Different cities.\n*Shared ambition.*",
          "College E-Cells, startup communities, mentors and industry partners — stronger when connected.",
        ),
      },
      {
        title: "Who the network is for",
        id: "groups",
        fields: {
          "groups.eyebrow": text("Small label", "Better together"),
          "groups.title": text("Title", "Find your place in the network."),
          groups: items("Groups", "Group", TITLE_BODY, [
            {
              title: "College communities",
              body: "Build your E-Cell’s reach and connect students with meaningful entrepreneurial experiences.",
            },
            {
              title: "Founders & mentors",
              body: "Help aspiring founders navigate their next step through practical advice and honest conversations.",
            },
            {
              title: "Industry partners",
              body: "Collaborate on programmes, share challenges and support emerging entrepreneurial talent.",
            },
          ]),
        },
      },
      {
        title: "Partner institutions",
        id: "partners",
        fields: {
          "partners.title": text("Title", "Partner institutions"),
          partners: items(
            "Partners",
            "Partner",
            {
              name: { type: "text", label: "Name" },
              city: { type: "text", label: "City" },
              type: { type: "text", label: "Type (college, E-Cell, company…)" },
            },
            [],
            { hint: "Add only confirmed partners." },
          ),
          "partners.empty": text(
            "Message while the list is empty",
            "Confirmed partner institutions will be listed here.",
          ),
          "partners.cta": text("Button", "Discuss a collaboration"),
          "partners.ctaLink": text(
            "Button link",
            "/contact",
            "A page path such as /events, or a full https:// link.",
          ),
        },
      },
      {
        title: "Closing banner",
        id: "cta",
        note: "Its words are edited under Header, footer & banner.",
        fields: {},
      },
    ],
  },
  {
    id: "ambassadors",
    label: "Campus Ambassadors",
    path: "/campus-ambassadors",
    seo: {
      title: "Campus Ambassador Program for Students",
      description:
        "Represent Elite Forums on your campus, connect student entrepreneurs and help grow a practical entrepreneurship community.",
    },
    sections: [
      {
        title: "Hero",
        fields: hero(
          "Campus ambassadors",
          "Be the spark\non *your campus.*",
          "Bring people together, champion student ideas and help your campus connect with the wider entrepreneurship ecosystem.",
        ),
      },
      {
        title: "What ambassadors do",
        id: "roles",
        fields: {
          roles: items("Roles", "Role", TITLE_BODY, [
            {
              title: "Lead a community",
              body: "Connect interested students, welcome new members and work with your E-Cell.",
            },
            {
              title: "Create momentum",
              body: "Help coordinate campus conversations, workshops and collaborative experiences.",
            },
            {
              title: "Grow your network",
              body: "Work alongside student leaders from other campuses and meet builders beyond your college.",
            },
          ]),
        },
      },
      {
        title: "Form heading",
        fields: {
          "form.eyebrow": text("Small label", "Your next move"),
          "form.title": text("Title", "Apply to lead."),
          "form.intro": area(
            "Introduction",
            "Tell us about your campus, your experience and what you’d like to build.",
          ),
        },
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    seo: {
      title: "Contact Elite Forums",
      description:
        "Contact Elite Forums about college and E-Cell partnerships, events, founder programmes, mentorship or collaboration.",
    },
    sections: [
      {
        title: "Hero",
        fields: hero(
          "Contact",
          "Good things start\nwith a *conversation.*",
          "A campus collaboration, a founder session, or an idea we should hear — we’d love to connect.",
        ),
      },
      {
        title: "Beside the form",
        fields: {
          "side.eyebrow": text("Small label", "Get in touch"),
          "side.title": text("Title", "Let’s talk."),
          "side.intro": area(
            "Introduction",
            "Tell us what you have in mind and the team will reply by email.",
          ),
          topics: items("Topics", "Topic", TITLE_BODY, [
            {
              title: "Colleges & E-Cells",
              body: "Partnerships, campus programmes and community support.",
            },
            {
              title: "Founders & mentors",
              body: "Share your experience with the next generation.",
            },
            {
              title: "Aspiring founders & partners",
              body: "Events, opportunities and ideas for collaboration.",
            },
          ]),
        },
      },
    ],
  },
];

const doc = (label: string, value: string): FieldDef => ({
  type: "doc",
  label,
  default: value,
  hint: "Blank line = new paragraph. “## ” starts a heading, “- ” a bullet point, **bold**, [link text](/path).",
});

const legalPage = (
  id: string,
  label: string,
  path: string,
  defaults: typeof PRIVACY_DEFAULTS,
  seo: { title: string; description: string; noindex?: boolean },
): PageDef => ({
  id,
  label,
  path,
  seo,
  sections: [
    { title: "Hero", fields: hero(defaults.eyebrow, defaults.title, defaults.intro) },
    {
      title: "Policy text",
      fields: {
        updated: text("Last updated line", defaults.updated),
        notice: area("Notice box (leave empty to hide)", defaults.notice),
        body: doc("Policy", defaults.body),
      },
    },
  ],
});

const EXTRA_PAGES: PageDef[] = [
  {
    id: "faqs",
    label: "FAQs",
    path: "/faqs",
    seo: {
      title: "Startup Community and Program FAQs",
      description:
        "Answers about Elite Forums, its founder community, startup programmes, coworking membership, college partnerships, applications and events in India.",
    },
    sections: [
      {
        title: "Hero",
        fields: hero(
          "Frequently asked questions",
          "Start with the answers.",
          "A clear guide to the Elite Forums community, founder programmes, college partnerships and events.",
        ),
      },
      {
        title: "Questions and answers",
        fields: {
          "list.eyebrow": text("Small label", "Answers for founders"),
          "list.title": text("Title on the FAQs page", "Clear answers before you begin."),
          "list.previewTitle": text("Title on the homepage preview", "Frequently asked questions."),
          "list.previewCount": text("How many questions the homepage shows", "5"),
          "list.more": text("Homepage link to all FAQs", "View all FAQs"),
          faqs: items(
            "Questions",
            "Question",
            {
              question: { type: "text", label: "Question" },
              answer: { type: "textarea", label: "Answer" },
            },
            FAQS.map((faq) => ({ question: faq.question, answer: faq.answer })),
          ),
        },
      },
    ],
  },
  legalPage("privacy", "Privacy policy", "/privacy", PRIVACY_DEFAULTS, {
    title: "Privacy Policy",
    description:
      "Learn what personal information Elite Forums collects, how it is used, and how to exercise your privacy choices.",
  }),
  legalPage("terms", "Terms of use", "/terms", TERMS_DEFAULTS, {
    title: "Terms of Use",
    description:
      "Read the terms for using the Elite Forums website, community, events and programmes.",
  }),
  legalPage("refunds", "Refund policy", "/refunds", REFUNDS_DEFAULTS, {
    title: "Refund and Cancellation Policy",
    description:
      "Understand refund requests, participant cancellations and event changes for paid Elite Forums programmes.",
  }),
  legalPage("cookies", "Cookie policy", "/cookies", COOKIES_DEFAULTS, {
    title: "Cookie Policy",
    description:
      "Learn how Elite Forums uses essential browser storage and optional analytics cookies, and how to control your choice.",
  }),
  {
    id: "dataDeletion",
    label: "Data deletion request",
    path: "/data-deletion",
    seo: {
      title: "Request Data Deletion",
      description:
        "Request access, correction or deletion of your personal information held by Elite Forums.",
      noindex: true,
    },
    sections: [
      {
        title: "Hero",
        fields: hero(
          "Your privacy rights",
          "Request data deletion",
          "Tell us which personal data you want us to review, correct or delete.",
        ),
      },
      {
        title: "Beside the form",
        fields: {
          "steps.title": text("Title", "What happens next"),
          steps: lines("Steps", [
            "We verify the request and identify records associated with your details.",
            "We assess legal, safety, fraud-prevention and record-keeping exceptions.",
            "We delete, anonymise or explain why specific records must be retained.",
            "We confirm the outcome using the contact details you provide.",
          ]),
          note: doc(
            "Note",
            "Do not include passwords, payment details, government identity numbers or other sensitive information. Requests are handled under applicable law and our [Privacy Policy](/privacy).",
          ),
        },
      },
    ],
  },
];

/**
 * Every page gets a "Search & sharing" section, and every switchable section a
 * show/hide field ("show.<id>", "on" or "off").
 */
export const CONTENT_PAGES: PageDef[] = [...BASE_PAGES, ...EXTRA_PAGES].map((page) => ({
  ...page,
  sections: [
    ...page.sections.map((section) =>
      section.id
        ? {
            ...section,
            fields: {
              [`show.${section.id}`]: {
                type: "toggle",
                label: "Show this section",
                default: "on",
              } satisfies FieldDef,
              ...section.fields,
            },
          }
        : section,
    ),
    ...(page.seo
      ? [
          {
            title: "Search & sharing",
            fields: {
              "seo.title": text("Search title", page.seo.title),
              "seo.description": area("Search description", page.seo.description),
              "seo.image": {
                type: "image",
                label: "Sharing image",
                default: "",
                hint: "Shown in WhatsApp, LinkedIn and other link previews (1200×630 works best). Leave empty for the site default.",
              } satisfies FieldDef,
              "seo.keywords": text("Keywords", "", "Comma-separated."),
              "seo.noindex": {
                type: "toggle",
                label: "Hide this page from search engines",
                default: page.seo.noindex ? "on" : "off",
              } satisfies FieldDef,
            },
          },
        ]
      : []),
  ],
}));

/** Saved overrides: page id → field key → value. */
export type ContentValue = string | string[] | Item[];
export type ContentOverrides = Record<string, Record<string, ContentValue>>;

const FIELDS: Record<string, Record<string, FieldDef>> = Object.fromEntries(
  CONTENT_PAGES.map((page) => [
    page.id,
    Object.assign({}, ...page.sections.map((section) => section.fields)),
  ]),
);

export const fieldDef = (page: string, key: string): FieldDef | undefined => FIELDS[page]?.[key];

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "string");

/** A saved value is only used when it has the shape the field expects. */
export function isValidValue(def: FieldDef, value: unknown): boolean {
  if (def.type === "lines") return isStringList(value);
  if (def.type === "items")
    return (
      Array.isArray(value) &&
      value.every(
        (entry) =>
          entry !== null &&
          typeof entry === "object" &&
          !Array.isArray(entry) &&
          Object.values(entry).every((v) => typeof v === "string" || isStringList(v)),
      )
    );
  return typeof value === "string";
}

/** The value to show for a field: the saved override when valid, otherwise the default. */
export function resolveField(page: string, key: string, overrides: ContentOverrides): unknown {
  const def = fieldDef(page, key);
  if (!def) {
    if (import.meta.env.DEV) console.warn(`Unknown content field ${page}.${key}`);
    return "";
  }
  const saved = overrides[page]?.[key];
  return saved !== undefined && isValidValue(def, saved) ? saved : def.default;
}

export type ContentReader = {
  /** A single piece of text. */
  t: (key: string) => string;
  /** A list of short strings. */
  list: (key: string) => string[];
  /** A repeatable group; `text`/`lines` read one entry's fields safely. */
  items: (key: string) => Item[];
  /** Whether a switchable section (or a toggle field) is on. */
  on: (id: string) => boolean;
};

export function contentReader(page: string, overrides: ContentOverrides): ContentReader {
  return {
    t: (key) => String(resolveField(page, key, overrides) ?? ""),
    list: (key) => {
      const value = resolveField(page, key, overrides);
      return isStringList(value) ? value : [];
    },
    items: (key) => {
      const value = resolveField(page, key, overrides);
      return Array.isArray(value) ? (value as Item[]) : [];
    },
    on: (id) => {
      const key = id.includes(".") ? id : `show.${id}`;
      return resolveField(page, key, overrides) !== "off";
    },
  };
}

/** Read a text field of a repeatable item. */
export const itemText = (item: Item, key: string): string => {
  const value = item[key];
  return typeof value === "string" ? value : "";
};
/** Read a one-per-line field of a repeatable item. */
export const itemLines = (item: Item, key: string): string[] => {
  const value = item[key];
  return Array.isArray(value) ? value : [];
};
