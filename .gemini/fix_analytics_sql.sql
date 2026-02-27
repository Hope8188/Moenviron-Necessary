-- SQL for Supabase Editor to fix Analytics tracking
-- Ensures the page_views table is writable by anonymous users

-- 1. Ensure RLS is active
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.page_views;
DROP POLICY IF EXISTS "Public can insert page views" ON public.page_views;
DROP POLICY IF EXISTS "Anyone can track views" ON public.page_views;

-- 3. Create the definitive public insert policy
CREATE POLICY "Allow anonymous inserts" 
ON public.page_views 
FOR INSERT 
TO public
WITH CHECK (true);

-- 4. Ensure public roles have permissions to insert
GRANT INSERT ON TABLE public.page_views TO anon;
GRANT INSERT ON TABLE public.page_views TO authenticated;

-- 5. If using sequences for IDs, grant usage
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verification query:
-- SELECT * FROM pg_policies WHERE tablename = 'page_views';
