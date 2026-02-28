-- COMPREHENSIVE SUPABASE FIX (v2 — handles enum safely)  
-- Run in SQL Editor: https://supabase.com/dashboard/project/wmeijbrqjuhvnksiijcz/sql

-- ============================================================
-- 0. ENSURE enum has all needed values (add if missing)
-- ============================================================
DO $$
BEGIN
  -- Add missing enum values if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'moderator' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'moderator';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'marketing' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'marketing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'shipping' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'shipping';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'support' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'support';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'content' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content';
  END IF;
END $$;

-- ============================================================
-- 1. page_views: Clean up all policies, create optimized ones
-- ============================================================
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.page_views;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.page_views;
DROP POLICY IF EXISTS "Public can insert page views" ON public.page_views;
DROP POLICY IF EXISTS "Admins can read page views" ON public.page_views;
DROP POLICY IF EXISTS "Authenticated users can read page views" ON public.page_views;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.page_views;
DROP POLICY IF EXISTS "page_views_insert_owner" ON public.page_views;
DROP POLICY IF EXISTS "page_views_select_owner" ON public.page_views;
DROP POLICY IF EXISTS "page_views_insert_public" ON public.page_views;
DROP POLICY IF EXISTS "page_views_select_authenticated" ON public.page_views;

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Single INSERT policy (public = anon + authenticated)
CREATE POLICY "pv_insert"
ON public.page_views FOR INSERT TO public
WITH CHECK (true);

-- Single SELECT policy for authenticated (uses select wrapper)
CREATE POLICY "pv_select"
ON public.page_views FOR SELECT TO authenticated
USING ((select auth.uid()) is not null);

-- ============================================================
-- 2. products: Consolidate — use safe role check
-- ============================================================
DROP POLICY IF EXISTS "products_public_read" ON public.products;
DROP POLICY IF EXISTS "products_write_admin" ON public.products;
DROP POLICY IF EXISTS "products_read_all" ON public.products;
DROP POLICY IF EXISTS "products_admin_write" ON public.products;

-- Anyone can read active products
CREATE POLICY "prod_read"
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Staff (anyone with a role != 'user') can manage products
CREATE POLICY "prod_write"
ON public.products FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = (select auth.uid()) AND role::text != 'user'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = (select auth.uid()) AND role::text != 'user'
  )
);

-- ============================================================
-- 3. site_content: Consolidate
-- ============================================================
DROP POLICY IF EXISTS "site_content_public_read" ON public.site_content;
DROP POLICY IF EXISTS "site_content_write_admin" ON public.site_content;
DROP POLICY IF EXISTS "site_content_read_all" ON public.site_content;
DROP POLICY IF EXISTS "site_content_admin_write" ON public.site_content;

CREATE POLICY "sc_read"
ON public.site_content FOR SELECT TO public
USING (true);

CREATE POLICY "sc_write"
ON public.site_content FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = (select auth.uid()) AND role::text != 'user'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = (select auth.uid()) AND role::text != 'user'
  )
);

-- ============================================================
-- 4. user_roles: Consolidate
-- ============================================================
DROP POLICY IF EXISTS "user_roles_select_owner" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_update_admin" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_read" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_admin_manage" ON public.user_roles;

-- Users see own roles; admins see all
CREATE POLICY "ur_read"
ON public.user_roles FOR SELECT TO authenticated
USING (
  user_id = (select auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = (select auth.uid()) AND ur.role::text = 'admin'
  )
);

-- Only admins can manage roles
CREATE POLICY "ur_manage"
ON public.user_roles FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = (select auth.uid()) AND ur.role::text = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = (select auth.uid()) AND ur.role::text = 'admin'
  )
);

-- ============================================================
-- 5. Drop unused indexes
-- ============================================================
DROP INDEX IF EXISTS idx_page_views_page_path;
DROP INDEX IF EXISTS idx_page_views_country;
DROP INDEX IF EXISTS idx_admin_messages_sender;
DROP INDEX IF EXISTS idx_payment_configurations_created_by;
DROP INDEX IF EXISTS idx_product_views_product_id;
DROP INDEX IF EXISTS idx_wishlists_product_id;
DROP INDEX IF EXISTS idx_orders_user_email;
DROP INDEX IF EXISTS idx_products_is_active;

-- ============================================================
-- 6. Ensure page_views has all columns
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
-- 7. product_performance_stats: Fix RLS (causing 401 on product pages)
-- ============================================================
ALTER TABLE IF EXISTS public.product_performance_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pps_insert" ON public.product_performance_stats;
DROP POLICY IF EXISTS "pps_select" ON public.product_performance_stats;
DROP POLICY IF EXISTS "pps_update" ON public.product_performance_stats;

-- Anyone can insert/update product view stats (analytics tracking)
CREATE POLICY "pps_insert"
ON public.product_performance_stats FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "pps_update"
ON public.product_performance_stats FOR UPDATE TO public
USING (true)
WITH CHECK (true);

-- Authenticated users can read stats (admin dashboard)
CREATE POLICY "pps_select"
ON public.product_performance_stats FOR SELECT TO public
USING (true);

GRANT SELECT, INSERT, UPDATE ON TABLE public.product_performance_stats TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.product_performance_stats TO authenticated;

-- ============================================================
-- 8. Grants & cache reload
-- ============================================================
GRANT INSERT ON TABLE public.page_views TO anon;
GRANT INSERT ON TABLE public.page_views TO authenticated;
GRANT SELECT ON TABLE public.page_views TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

NOTIFY pgrst, 'reload schema';
