-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add user_id to memorials table
ALTER TABLE public.memorials ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update memorials RLS policies
DROP POLICY IF EXISTS "Anyone can create memorials" ON public.memorials;
DROP POLICY IF EXISTS "Anyone can update memorials" ON public.memorials;
DROP POLICY IF EXISTS "Anyone can view memorials" ON public.memorials;

CREATE POLICY "Anyone can view memorials" 
ON public.memorials 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create memorials" 
ON public.memorials 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memorials" 
ON public.memorials 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memorials" 
ON public.memorials 
FOR DELETE 
USING (auth.uid() = user_id);

-- Update memorial_photos RLS policies
DROP POLICY IF EXISTS "Anyone can create memorial photos" ON public.memorial_photos;
DROP POLICY IF EXISTS "Anyone can update memorial photos" ON public.memorial_photos;
DROP POLICY IF EXISTS "Anyone can delete memorial photos" ON public.memorial_photos;

CREATE POLICY "Memorial owners can create photos" 
ON public.memorial_photos 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.memorials 
    WHERE memorials.id = memorial_photos.memorial_id 
    AND memorials.user_id = auth.uid()
  )
);

CREATE POLICY "Memorial owners can update photos" 
ON public.memorial_photos 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.memorials 
    WHERE memorials.id = memorial_photos.memorial_id 
    AND memorials.user_id = auth.uid()
  )
);

CREATE POLICY "Memorial owners can delete photos" 
ON public.memorial_photos 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.memorials 
    WHERE memorials.id = memorial_photos.memorial_id 
    AND memorials.user_id = auth.uid()
  )
);

-- Update timeline_events RLS policies
DROP POLICY IF EXISTS "Anyone can create timeline events" ON public.timeline_events;
DROP POLICY IF EXISTS "Anyone can update timeline events" ON public.timeline_events;
DROP POLICY IF EXISTS "Anyone can delete timeline events" ON public.timeline_events;

CREATE POLICY "Memorial owners can create timeline events" 
ON public.timeline_events 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.memorials 
    WHERE memorials.id = timeline_events.memorial_id 
    AND memorials.user_id = auth.uid()
  )
);

CREATE POLICY "Memorial owners can update timeline events" 
ON public.timeline_events 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.memorials 
    WHERE memorials.id = timeline_events.memorial_id 
    AND memorials.user_id = auth.uid()
  )
);

CREATE POLICY "Memorial owners can delete timeline events" 
ON public.timeline_events 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.memorials 
    WHERE memorials.id = timeline_events.memorial_id 
    AND memorials.user_id = auth.uid()
  )
);

-- Add trigger for profiles timestamps
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();