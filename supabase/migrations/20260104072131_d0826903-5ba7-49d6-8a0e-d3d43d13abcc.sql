-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access
CREATE POLICY "Public can view assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'assets');