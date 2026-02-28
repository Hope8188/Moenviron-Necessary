-- FINAL DEFINITIVE DB FIX FOR MOENVIRON ANALYTICS
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/wmeijbrqjuhvnksiijcz/sql)

-- 1. Ensure page_views table has all required columns
DO $$ 
BEGIN 
    -- Add device_type if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'page_views' AND column_name = 'device_type') THEN
        ALTER TABLE public.page_views ADD COLUMN device_type TEXT;
    END IF;
    
    -- Add ip_hash if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'page_views' AND column_name = 'ip_hash') THEN
        ALTER TABLE public.page_views ADD COLUMN ip_hash TEXT;
    END IF;
END $$;

-- 2. Ensure RLS is active and allows anonymous inserts
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.page_views;
DROP POLICY IF EXISTS "Public can insert page views" ON public.page_views;

CREATE POLICY "Allow anonymous inserts" 
ON public.page_views 
FOR INSERT 
TO public
WITH CHECK (true);

-- 3. Grant table permissions
GRANT INSERT ON TABLE public.page_views TO anon;
GRANT INSERT ON TABLE public.page_views TO authenticated;

-- 4. Grant sequence permissions (vital for ID generation)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 5. IMPORTANT: Force PostgREST to reload the schema cache
-- This stops the "Could not find column... in schema cache" error immediately.
NOTIFY pgrst, 'reload schema';

-- Verify:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'page_views';
