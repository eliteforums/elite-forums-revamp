-- Adds "incubation" and "membership" programme types to the learning platform,
-- matching the Incubation Program and Coworking Space Membership on the website.
-- Idempotent: safe to run more than once.

alter table public.lms_programs drop constraint if exists lms_programs_kind_check;
alter table public.lms_programs
  add constraint lms_programs_kind_check
  check (kind in ('cohort', 'incubation', 'course', 'bootcamp', 'fellowship', 'workshop', 'membership'));
