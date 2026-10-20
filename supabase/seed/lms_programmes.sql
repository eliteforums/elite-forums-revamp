-- Seed: the three programmes shown on the website (For Colleges → Founder
-- facilities), added to the learning platform so they appear in /lms/manage.
--
-- Run in the Supabase SQL editor after migrations 0007 and 0008. Safe to run
-- more than once: a programme whose short name already exists is left as it is,
-- so edits made in the admin are never overwritten.
--
-- The programmes are published with no modules yet. Add modules, lessons and
-- cohorts from Manage → Programmes and Manage → Cohorts. Learners only see a
-- programme once you enrol them in it.

-- Same as migration 0008, so this file also works on its own.
alter table public.lms_programs drop constraint if exists lms_programs_kind_check;
alter table public.lms_programs
  add constraint lms_programs_kind_check
  check (kind in ('cohort', 'incubation', 'course', 'bootcamp', 'fellowship', 'workshop', 'membership'));

insert into public.lms_programs
  (slug, title, kind, summary, description, certificate_title, published, position)
values
  (
    'startup-cohort-program',
    'Startup Cohort Program',
    'cohort',
    $$A structured 90-day journey for selected founders and startup teams who want practical support from idea validation to a stronger launch-ready foundation.$$,
    $$For founders building from zero.

A structured 90-day journey for selected founders and startup teams who want practical support from idea validation to a stronger launch-ready foundation.

## What's included
- Guaranteed incubation support for 90 days
- Mentorship from startup and domain experts
- Startup connect ecosystem and founder's connect
- Product development and research guidance
- Pitch deck preparation and investor readiness
- Guidance on fundraising and government grants
- Legal aid and assistance for startup-related needs
- Bank and NBFC finance guidance: prepare a business plan, cash-flow projections and loan documents, understand application steps, and explore suitable lender options; approval and loan terms depend on lender eligibility
- Private investor readiness: shape your funding ask and pitch, prepare for due diligence, and explore introductions to relevant private or angel investors when available; investment is not guaranteed
- Access to the Elite Forums Innovation Lab and its IT team for the full cohort
- Workspace access: Saturdays from 3:00 PM onward and Sundays from 9:00 AM onward
- Guidance on market research, customer discovery and product building
- Additional founder learning, connections and programme opportunities

## Fee
INR 5,000 + applicable taxes.$$,
    'Certificate of Completion',
    true,
    0
  ),
  (
    'incubation-program',
    'Incubation Program',
    'incubation',
    $$Everything included in the Startup Cohort experience, with a focused incubation environment for founders who want consistent access to people, space and execution support.$$,
    $$For startups ready to accelerate.

Everything included in the Startup Cohort experience, with a focused incubation environment for founders who want consistent access to people, space and execution support.

## What's included
- Guaranteed incubation support for 90 days
- All core Startup Cohort Program benefits
- Latest updates about relevant startup events
- Regular founder's connect opportunities
- Workspace access: Saturdays from 3:00 PM onward and Sundays from 9:00 AM onward
- Mentorship from our experts whenever the founder team is present
- Discounts on coworking space and meeting-room bookings
- Special IT project-development pricing, advertised at up to 4x cheaper than typical market cost
- Cloud credits to help reduce infrastructure costs for your startup, subject to provider eligibility and availability
- Practical support through the Elite Forums Innovation Lab team

## Fee
INR 5,000 + applicable taxes.$$,
    'Certificate of Incubation',
    true,
    1
  ),
  (
    'coworking-space-membership',
    'Coworking Space Membership',
    'membership',
    $$A professional, founder-friendly workspace with the practical facilities teams need to work consistently and stay connected to the startup ecosystem.$$,
    $$For teams looking for flexible workspace.

A professional, founder-friendly workspace with the practical facilities teams need to work consistently and stay connected to the startup ecosystem.

## What's included
- Weekend access: Saturdays from 3:00 PM onward and Sundays from 9:00 AM onward
- Shared monthly coworking starts at INR 7,000 for a minimum team of 5 people
- Dedicated coworking space: INR 15,000 per month with weekday access for 4 days per week
- Discounts on additional coworking space and meeting-room bookings
- Wi-Fi access for the team
- Dedicated charging ports
- Pantry access
- Professional working environment
- Air-conditioned, temperature-controlled space
- Quick-commerce options available within approximately 7 minutes
- Guidance from startup mentors or the Elite Forums Innovation Lab team

## Fee
From INR 7,000 per month. Confirm applicable taxes, availability and booking terms before enrolment.$$,
    'Certificate of Membership',
    true,
    2
  )
on conflict (slug) do nothing;

-- Shows what is now in the table.
select position, title, kind, published from public.lms_programs order by position;
