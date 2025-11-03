-- Create storage buckets for memorial files
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('memorial-images', 'memorial-images', true),
  ('memorial-audio', 'memorial-audio', true);

-- Create storage policies for memorial images
CREATE POLICY "Anyone can view memorial images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'memorial-images');

CREATE POLICY "Anyone can upload memorial images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'memorial-images');

CREATE POLICY "Anyone can update memorial images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'memorial-images');

CREATE POLICY "Anyone can delete memorial images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'memorial-images');

-- Create storage policies for memorial audio
CREATE POLICY "Anyone can view memorial audio" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'memorial-audio');

CREATE POLICY "Anyone can upload memorial audio" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'memorial-audio');

CREATE POLICY "Anyone can update memorial audio" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'memorial-audio');

CREATE POLICY "Anyone can delete memorial audio" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'memorial-audio');

-- Create memorials table
CREATE TABLE public.memorials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  death_date DATE NOT NULL,
  brief_description TEXT,
  life_story TEXT,
  background_image TEXT,
  profile_image TEXT,
  music_file TEXT,
  music_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memorials ENABLE ROW LEVEL SECURITY;

-- Create policies for memorials (public access)
CREATE POLICY "Anyone can view memorials" 
ON public.memorials FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create memorials" 
ON public.memorials FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update memorials" 
ON public.memorials FOR UPDATE 
USING (true);

-- Create memorial photos table
CREATE TABLE public.memorial_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memorial_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for memorial photos
CREATE POLICY "Anyone can view memorial photos" 
ON public.memorial_photos FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create memorial photos" 
ON public.memorial_photos FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update memorial photos" 
ON public.memorial_photos FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete memorial photos" 
ON public.memorial_photos FOR DELETE 
USING (true);

-- Create timeline events table
CREATE TABLE public.timeline_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- Create policies for timeline events
CREATE POLICY "Anyone can view timeline events" 
ON public.timeline_events FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create timeline events" 
ON public.timeline_events FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update timeline events" 
ON public.timeline_events FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete timeline events" 
ON public.timeline_events FOR DELETE 
USING (true);

-- Create tributes table
CREATE TABLE public.tributes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tributes ENABLE ROW LEVEL SECURITY;

-- Create policies for tributes
CREATE POLICY "Anyone can view tributes" 
ON public.tributes FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create tributes" 
ON public.tributes FOR INSERT 
WITH CHECK (true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for memorials
CREATE TRIGGER update_memorials_updated_at
BEFORE UPDATE ON public.memorials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_memorials_slug ON public.memorials(slug);
CREATE INDEX idx_memorial_photos_memorial_id ON public.memorial_photos(memorial_id);
CREATE INDEX idx_timeline_events_memorial_id ON public.timeline_events(memorial_id);
CREATE INDEX idx_tributes_memorial_id ON public.tributes(memorial_id);