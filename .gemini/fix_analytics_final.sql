-- DEFINITIVE DB FIX FOR MOENVIRON ANALYTICS
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/wmeijbrqjuhvnksiijcz/sql

-- ============================================================
-- 1. Ensure page_views table has all required columns
-- ============================================================
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'page_views' AND column_name = 'device_type') THEN
        ALTER TABLE public.page_views ADD COLUMN device_type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'page_views' AND column_name = 'ip_hash') THEN
        ALTER TABLE public.page_views ADD COLUMN ip_hash TEXT;
    END IF;
END $$;

-- ============================================================
-- 2. RLS Policies — INSERT (public) + SELECT (authenticated)
-- ============================================================
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Drop any old policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.page_views;
DROP POLICY IF EXISTS "Public can insert page views" ON public.page_views;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.page_views;
DROP POLICY IF EXISTS "Authenticated users can read page views" ON public.page_views;

-- Anyone (including anonymous visitors) can INSERT page views
CREATE POLICY "Allow anonymous inserts" 
ON public.page_views 
FOR INSERT 
TO public
WITH CHECK (true);

-- Authenticated users (admins) can SELECT/read all page views
CREATE POLICY "Authenticated users can read page views"
ON public.page_views
FOR SELECT
TO authenticated
USING (true);

-- ============================================================
-- 3. Grant permissions
-- ============================================================
GRANT INSERT ON TABLE public.page_views TO anon;
GRANT INSERT ON TABLE public.page_views TO authenticated;
GRANT SELECT ON TABLE public.page_views TO authenticated;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================
-- 4. Force PostgREST to reload schema cache immediately
-- ============================================================
NOTIFY pgrst, 'reload schema';

-- ============================================================
-- Verify everything worked:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'page_views';
-- SELECT * FROM pg_policies WHERE tablename = 'page_views';
-- ============================================================
