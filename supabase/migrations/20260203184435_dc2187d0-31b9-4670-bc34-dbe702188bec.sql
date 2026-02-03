-- Create careers table for job listings
CREATE TABLE public.careers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT NOT NULL DEFAULT 'Remote',
  type TEXT NOT NULL DEFAULT 'Full-time',
  description TEXT NOT NULL,
  requirements TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- Public read policy for active careers
CREATE POLICY "Anyone can view active careers"
ON public.careers
FOR SELECT
USING (is_active = true);

-- Admin policies
CREATE POLICY "Admins can view all careers"
ON public.careers
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert careers"
ON public.careers
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update careers"
ON public.careers
FOR UPDATE
USING (true);

CREATE POLICY "Admins can delete careers"
ON public.careers
FOR DELETE
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_careers_updated_at
BEFORE UPDATE ON public.careers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();