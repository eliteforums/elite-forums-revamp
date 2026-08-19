CREATE TABLE public.certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_id text NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  college text NOT NULL,
  department text NOT NULL,
  course text NOT NULL,
  completion_date date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.certificates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can generate a certificate"
  ON public.certificates FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can view certificates"
  ON public.certificates FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can delete certificates"
  ON public.certificates FOR DELETE TO authenticated USING (true);