/**
 * Default questions of the programme application. They seed the "Programme
 * application" form in `forms.ts`; once edited in the admin console, the saved
 * version is used instead.
 */

export const PROGRAMS = [
  {
    id: "cohort",
    label: "Startup Cohort Program",
    blurb: "A structured 90-day cohort for founders working on an idea or product.",
  },
  {
    id: "incubation",
    label: "Startup Incubation Program",
    blurb: "Sustained incubation with workspace, mentorship and technology support.",
  },
  {
    id: "coworking",
    label: "Coworking Space Membership",
    blurb: "A professional, collaborative workspace for founders, teams and freelancers.",
  },
] as const;

export type ProgramId = (typeof PROGRAMS)[number]["id"];

export type Question = {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "multi" | "date" | "url" | "email" | "tel";
  options?: readonly string[];
  optional?: boolean;
  hint?: string;
  placeholder?: string;
  /** Render at half width on desktop. */
  half?: boolean;
};

export type Section = { title: string; questions: Question[] };

const YES_NO = ["Yes", "No"] as const;

export const STAGES = [
  "Idea Stage",
  "Research and Validation",
  "MVP or Prototype",
  "Launched Product",
  "Early Traction",
  "Revenue-Generating Startup",
  "Established Business",
] as const;

export const HEARD_FROM = [
  "LinkedIn",
  "Instagram",
  "College",
  "Referral",
  "Event",
  "Website",
  "Other",
] as const;

const SUPPORT_AREAS = [
  "Product development",
  "Market access",
  "Mentorship",
  "Fundraising preparation",
  "Business operations",
  "Hiring",
] as const;

export const COMMON_SECTIONS: Section[] = [
  {
    title: "Personal and professional details",
    questions: [
      { key: "full_name", label: "Full name", type: "text", half: true },
      { key: "email", label: "Email address", type: "email", half: true },
      { key: "phone", label: "Mobile number", type: "tel", half: true },
      {
        key: "whatsapp_available",
        label: "Is this number available on WhatsApp?",
        type: "select",
        options: YES_NO,
        half: true,
      },
      { key: "city", label: "City and current location", type: "text", half: true },
      {
        key: "profile_url",
        label: "LinkedIn profile or professional portfolio",
        type: "url",
        optional: true,
        placeholder: "https://linkedin.com/in/…",
        half: true,
      },
    ],
  },
  {
    title: "Startup or work profile",
    questions: [
      {
        key: "applicant_type",
        label: "You are applying as",
        type: "select",
        options: ["Individual", "Founder", "Co-founder", "Established team"],
        half: true,
      },
      {
        key: "startup_name",
        label: "Startup or company name",
        type: "text",
        optional: true,
        hint: "If applicable.",
        half: true,
      },
      {
        key: "website_url",
        label: "Website, product link or social media page",
        type: "url",
        optional: true,
        placeholder: "https://",
        half: true,
      },
      {
        key: "industry",
        label: "Which industry best describes your work?",
        type: "text",
        placeholder: "Fintech, edtech, SaaS, D2C…",
        half: true,
      },
      {
        key: "stage",
        label: "What stage are you currently at?",
        type: "select",
        options: STAGES,
      },
    ],
  },
  {
    title: "Expectations and readiness",
    questions: [
      { key: "why_join", label: "Why do you want to join Elite Forums?", type: "textarea" },
      {
        key: "biggest_challenge",
        label: "What is the biggest challenge you are currently facing?",
        type: "textarea",
      },
      {
        key: "expected_outcome",
        label: "What do you expect to achieve through this program?",
        type: "textarea",
      },
      {
        key: "heard_from",
        label: "How did you hear about Elite Forums?",
        type: "select",
        options: HEARD_FROM,
      },
    ],
  },
];

export const PROGRAM_SECTIONS: Record<ProgramId, Section[]> = {
  cohort: [
    {
      title: "Idea and problem validation",
      questions: [
        {
          key: "idea_summary",
          label: "Describe your startup idea in 2–3 sentences.",
          type: "textarea",
        },
        {
          key: "problem",
          label: "What problem are you solving, and who experiences it?",
          type: "textarea",
        },
        {
          key: "current_solutions",
          label: "How do people currently solve this problem?",
          type: "textarea",
        },
        {
          key: "customer_research",
          label:
            "Have you spoken to potential customers or conducted market research? Describe what you learned.",
          type: "textarea",
        },
        {
          key: "differentiation",
          label: "What makes your proposed solution different from existing alternatives?",
          type: "textarea",
        },
      ],
    },
    {
      title: "Team and execution",
      questions: [
        {
          key: "team_size",
          label: "How many co-founders or team members do you have?",
          type: "text",
          half: true,
        },
        {
          key: "hours_per_week",
          label: "How many hours per week can the founding team commit?",
          type: "select",
          options: ["Under 10 hours", "10–20 hours", "20–40 hours", "40+ hours"],
          half: true,
        },
        {
          key: "team_skills",
          label: "What relevant skills or experience does your team bring?",
          type: "textarea",
        },
        {
          key: "milestone_owner",
          label: "Who will be responsible for executing the startup's milestones?",
          type: "text",
        },
        {
          key: "can_attend_sessions",
          label:
            "Can you attend the scheduled weekend sessions and participate in progress reviews?",
          type: "select",
          options: YES_NO,
        },
      ],
    },
    {
      title: "Product and 90-day goals",
      questions: [
        {
          key: "built_so_far",
          label: "What have you built so far?",
          type: "select",
          options: ["Idea", "Research", "Wireframes", "Prototype", "MVP", "Live product"],
        },
        {
          key: "milestones_90d",
          label: "What are the three most important milestones you want to achieve in 90 days?",
          type: "textarea",
        },
        {
          key: "support_needed",
          label: "What support do you need most?",
          type: "multi",
          options: [
            "Product development",
            "Technical guidance",
            "Market research",
            "Business model",
            "Pitch deck",
            "Fundraising preparation",
            "Mentorship",
          ],
        },
        {
          key: "progress_evidence",
          label:
            "What evidence would demonstrate that your startup has made meaningful progress after 90 days?",
          type: "textarea",
        },
        {
          key: "blockers",
          label: "What is currently preventing you from achieving these goals?",
          type: "textarea",
        },
      ],
    },
    {
      title: "Commitment and program fit",
      questions: [
        {
          key: "why_this_program",
          label: "Why have you chosen the Elite Forums Startup Cohort Program?",
          type: "textarea",
        },
        {
          key: "comfortable_with_feedback",
          label:
            "Are you comfortable sharing progress, receiving feedback, and presenting your work to mentors?",
          type: "select",
          options: YES_NO,
        },
        {
          key: "prior_programs",
          label:
            "Have you participated in any accelerator, incubator, or startup program before? What did you learn?",
          type: "textarea",
          optional: true,
        },
        {
          key: "funding_focus",
          label:
            "Are you looking for funding immediately, or are you currently focused on validation and product development?",
          type: "select",
          options: [
            "Looking for funding immediately",
            "Focused on validation and product development",
            "Both",
          ],
        },
        {
          key: "anything_else",
          label: "Is there anything else the selection committee should know?",
          type: "textarea",
          optional: true,
        },
      ],
    },
  ],
  incubation: [
    {
      title: "Business readiness and traction",
      questions: [
        {
          key: "product_available",
          label: "Is your product available to customers?",
          type: "select",
          options: ["Yes", "In private beta or pilot", "Not yet"],
          half: true,
        },
        {
          key: "demo_url",
          label: "Demo or product link",
          type: "url",
          optional: true,
          placeholder: "https://",
          half: true,
        },
        {
          key: "target_customer",
          label: "Who is your target customer, and how large or reachable is your target market?",
          type: "textarea",
        },
        {
          key: "traction",
          label: "Have you acquired any of the following?",
          type: "multi",
          options: [
            "Users",
            "Paying customers",
            "Pilot customers",
            "Strategic partners",
            "None yet",
          ],
        },
        {
          key: "traction_metrics",
          label:
            "If you have traction, share relevant metrics such as active users, paying customers, monthly revenue, or pilot results.",
          type: "textarea",
          optional: true,
          hint: "Optional for early-stage startups.",
        },
        {
          key: "business_model",
          label: "What is your business model, and how do you plan to generate revenue?",
          type: "textarea",
        },
        {
          key: "legal_entity",
          label: "Is the startup legally registered?",
          type: "select",
          options: [
            "Not registered",
            "Sole proprietorship",
            "Partnership firm",
            "LLP",
            "Private Limited",
            "One Person Company",
            "Other",
          ],
          half: true,
        },
        {
          key: "registration_status",
          label: "Registration status",
          type: "text",
          optional: true,
          hint: "For example: registered in 2025, or application in progress.",
          half: true,
        },
      ],
    },
    {
      title: "Incubation requirements",
      questions: [
        {
          key: "why_incubation",
          label: "Why does your startup need incubation at this stage?",
          type: "textarea",
        },
        {
          key: "support_areas",
          label: "Which areas require the most support?",
          type: "multi",
          options: SUPPORT_AREAS,
        },
        {
          key: "centre_usage",
          label: "How frequently would your team use the incubation center?",
          type: "select",
          options: ["Daily", "3–4 days a week", "1–2 days a week", "Occasionally"],
          half: true,
        },
        {
          key: "workspace_seats",
          label: "How many team members need workspace access?",
          type: "text",
          half: true,
        },
        {
          key: "facilities_needed",
          label: "Would you require any of the following?",
          type: "multi",
          options: [
            "Conference-room access",
            "Mentor meetings",
            "Product-development assistance",
            "None of these",
          ],
        },
        {
          key: "tech_services",
          label:
            "What technology services would you potentially require from the Elite Forums Innovation Lab?",
          type: "textarea",
          optional: true,
        },
      ],
    },
    {
      title: "Growth and fundraising plans",
      questions: [
        {
          key: "milestones_90d",
          label: "What are your main business milestones for the next 90 days?",
          type: "textarea",
        },
        {
          key: "funding_raised",
          label:
            "Have you raised any external funding or received grants? If yes, share the type and stage of funding.",
          type: "textarea",
          hint: "Write “None” if you have not raised anything yet.",
        },
        {
          key: "plans_to_raise",
          label: "Do you plan to raise funding in the next 6–12 months?",
          type: "select",
          options: ["Yes", "No", "Not sure yet"],
        },
        {
          key: "funding_target",
          label: "What amount or funding range are you targeting, and what will it be used for?",
          type: "textarea",
          optional: true,
        },
        {
          key: "wants_scheme_support",
          label:
            "Would you like support identifying relevant government schemes, grants, or investor opportunities?",
          type: "select",
          options: YES_NO,
        },
        {
          key: "team_capability",
          label: "What makes your team capable of executing this business?",
          type: "textarea",
        },
      ],
    },
    {
      title: "Commitment and fit",
      questions: [
        {
          key: "decision_maker",
          label: "Who is the primary decision-maker for the startup?",
          type: "text",
        },
        {
          key: "will_attend_and_report",
          label:
            "Is the founding team prepared to attend mentor sessions and report on agreed milestones?",
          type: "select",
          options: YES_NO,
        },
        {
          key: "expected_value",
          label: "What specific value do you expect from the Elite Forums incubation ecosystem?",
          type: "textarea",
        },
        {
          key: "accepts_it_charges",
          label:
            "Are you comfortable with a defined scope and separately agreed charges for substantial IT development projects?",
          type: "select",
          options: YES_NO,
        },
      ],
    },
  ],
  coworking: [
    {
      title: "Work and team details",
      questions: [
        { key: "professional_role", label: "What is your professional role?", type: "text" },
        {
          key: "work_type",
          label: "What type of work will you conduct from the coworking space?",
          type: "textarea",
        },
        {
          key: "member_count",
          label: "How many people will use the membership?",
          type: "text",
          half: true,
        },
        {
          key: "desks_required",
          label: "How many desks do you require?",
          type: "text",
          half: true,
        },
        {
          key: "member_names",
          label:
            "Please provide the names of the team members who will regularly use the facility.",
          type: "textarea",
        },
      ],
    },
    {
      title: "Space requirements",
      questions: [
        {
          key: "days_per_week",
          label: "How many days per week do you plan to work from the center?",
          type: "select",
          options: ["1–2 days", "3–4 days", "5 days", "6–7 days"],
          half: true,
        },
        {
          key: "joining_date",
          label: "What is your preferred joining date?",
          type: "date",
          half: true,
        },
        {
          key: "conference_room",
          label: "Will you require conference-room access? If yes, approximately how often?",
          type: "select",
          options: ["No", "Occasionally", "About once a week", "Several times a week"],
        },
        {
          key: "accommodations",
          label: "Do you need any specific workspace arrangements or accessibility accommodations?",
          type: "textarea",
          optional: true,
        },
      ],
    },
    {
      title: "Professional fit",
      questions: [
        {
          key: "hoping_to_gain",
          label: "What are you hoping to gain from working in the Elite Forums environment?",
          type: "textarea",
        },
        {
          key: "wants_mentorship",
          label:
            "Would startup mentorship or guidance from the Innovation Lab team be useful to you?",
          type: "select",
          options: ["Yes", "No", "Maybe"],
        },
        {
          key: "follows_policies",
          label:
            "Are you willing to follow the center's policies concerning noise, guests, shared facilities, security, and working hours?",
          type: "select",
          options: YES_NO,
        },
        {
          key: "reviewed_membership_terms",
          label:
            "Have you reviewed the membership fee, desk allocation, access hours, conference-room pricing, and cancellation terms?",
          type: "select",
          options: YES_NO,
        },
        {
          key: "anything_else",
          label: "Is there anything else we should know before confirming your membership?",
          type: "textarea",
          optional: true,
        },
      ],
    },
  ],
};

/** Final acknowledgements; every one must be ticked to submit. */
export const ACKNOWLEDGEMENTS = [
  {
    key: "terms_agreed",
    label: "I have read and agree to the program's fees, scope, and applicable terms.",
  },
  {
    key: "contact_ok",
    label: "I agree to be contacted by Elite Forums regarding my application.",
  },
  { key: "accuracy_confirmed", label: "I confirm that the information submitted is accurate." },
  {
    key: "consent",
    label:
      "I consent to the use of my application data for admissions and program administration, as described in the privacy notice.",
  },
] as const;
