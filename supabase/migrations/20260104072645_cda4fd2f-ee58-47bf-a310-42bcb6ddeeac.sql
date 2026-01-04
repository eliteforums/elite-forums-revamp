-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  gradient TEXT NOT NULL DEFAULT 'from-blue-500 via-purple-500 to-pink-500',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_logos table
CREATE TABLE public.client_logos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  quote TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create training_programs table
CREATE TABLE public.training_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Code',
  duration TEXT NOT NULL DEFAULT '8-12 weeks',
  level TEXT NOT NULL DEFAULT 'Beginner to Advanced',
  category TEXT,
  gradient TEXT NOT NULL DEFAULT 'from-blue-500 to-cyan-500',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (website visitors can view)
CREATE POLICY "Anyone can view active projects" ON public.projects FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active client logos" ON public.client_logos FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active team members" ON public.team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active training programs" ON public.training_programs FOR SELECT USING (is_active = true);

-- Authenticated users (admins) can manage all content
CREATE POLICY "Admins can view all projects" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admins can view all client logos" ON public.client_logos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert client logos" ON public.client_logos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update client logos" ON public.client_logos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete client logos" ON public.client_logos FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admins can view all team members" ON public.team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert team members" ON public.team_members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update team members" ON public.team_members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete team members" ON public.team_members FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admins can view all training programs" ON public.training_programs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert training programs" ON public.training_programs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update training programs" ON public.training_programs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete training programs" ON public.training_programs FOR DELETE TO authenticated USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_client_logos_updated_at BEFORE UPDATE ON public.client_logos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_training_programs_updated_at BEFORE UPDATE ON public.training_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();