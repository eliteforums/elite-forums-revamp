CREATE TABLE public.student_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL, email text NOT NULL, institution text NOT NULL,
  course_year text, city text NOT NULL, interests text[] NOT NULL DEFAULT '{}',
  preferred_channel text NOT NULL, phone text, consent boolean NOT NULL DEFAULT false,
  marketing_opt_in boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.college_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name text NOT NULL, website text, city text NOT NULL, state text NOT NULL,
  ecell_name text, rep_name text NOT NULL, rep_designation text NOT NULL, email text NOT NULL,
  phone text, community_size text, current_activities text, support_needed text NOT NULL,
  additional_info text, consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.ambassador_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, email text NOT NULL, college text NOT NULL, course_year text NOT NULL,
  experience text, motivation text NOT NULL, availability text NOT NULL, profile_url text,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.contact_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, email text NOT NULL, topic text NOT NULL, message text NOT NULL,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug text NOT NULL, name text NOT NULL, email text NOT NULL, institution text NOT NULL,
  consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_slug, email)
);
DO $$ DECLARE t text; BEGIN
FOREACH t IN ARRAY ARRAY['student_registrations','college_applications','ambassador_applications','contact_enquiries','event_registrations'] LOOP
  EXECUTE format('GRANT INSERT ON public.%I TO anon, authenticated', t);
  EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  EXECUTE format('CREATE POLICY "Public can submit" ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (consent = true)', t);
END LOOP; END $$;