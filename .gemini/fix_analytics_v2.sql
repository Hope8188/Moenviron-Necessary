-- SQL for Supabase Editor to fix Analytics tracking and schema mismatch
-- Adds missing columns and ensures permissions

-- 1. Check and add missing columns to page_views
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'page_views' AND column_name = 'device_type') THEN
        ALTER TABLE public.page_views ADD COLUMN device_type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'page_views' AND column_name = 'ip_hash') THEN
        ALTER TABLE public.page_views ADD COLUMN ip_hash TEXT;
    END IF;
END $$;

-- 2. Ensure RLS is active
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- 3. Create/Replace the definitive public insert policy
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.page_views;
CREATE POLICY "Allow anonymous inserts" 
ON public.page_views 
FOR INSERT 
TO public
WITH CHECK (true);

-- 4. Grant permissions
GRANT INSERT ON TABLE public.page_views TO anon;
GRANT INSERT ON TABLE public.page_views TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
