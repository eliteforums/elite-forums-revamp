
CREATE TABLE public.student_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  college TEXT NOT NULL,
  review TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
ON public.student_reviews FOR SELECT
USING (is_approved = true);

-- Anyone can insert reviews (public form)
CREATE POLICY "Anyone can submit reviews"
ON public.student_reviews FOR INSERT
WITH CHECK (true);

-- Admins can view all reviews
CREATE POLICY "Admins can view all reviews"
ON public.student_reviews FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Admins can delete reviews
CREATE POLICY "Admins can delete reviews"
ON public.student_reviews FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Admins can update reviews
CREATE POLICY "Admins can update reviews"
ON public.student_reviews FOR UPDATE
USING (auth.uid() IS NOT NULL);
