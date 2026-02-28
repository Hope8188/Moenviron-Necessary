-- COMPREHENSIVE SUPABASE FIX (v5 — fixes infinite recursion)
-- Run in SQL Editor: https://supabase.com/dashboard/project/wmeijbrqjuhvnksiijcz/sql
--
-- The key fix: SECURITY DEFINER functions bypass RLS, preventing
-- infinite recursion when policies reference user_roles.
-- ============================================================

-- ============================================================
-- 0. Helper functions (MUST be created BEFORE policies that use them)
-- ============================================================

-- Check if the current user is an admin (bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = 'admin'
  );
$$;

-- Check if the current user has any staff role (not 'user')
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text != 'user'
  );
$$;

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
DROP POLICY IF EXISTS "pv_insert" ON public.page_views;
DROP POLICY IF EXISTS "pv_select" ON public.page_views;

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views (analytics tracking)
CREATE POLICY "pv_insert"
ON public.page_views FOR INSERT TO public
WITH CHECK (true);

-- Authenticated users can read page views (admin dashboard)
CREATE POLICY "pv_select"
ON public.page_views FOR SELECT TO authenticated
USING ((select auth.uid()) is not null);

-- ============================================================
-- 2. products: use is_staff() to avoid recursion
-- ============================================================
DROP POLICY IF EXISTS "products_public_read" ON public.products;
DROP POLICY IF EXISTS "products_write_admin" ON public.products;
DROP POLICY IF EXISTS "products_read_all" ON public.products;
DROP POLICY IF EXISTS "products_admin_write" ON public.products;
DROP POLICY IF EXISTS "prod_read" ON public.products;
DROP POLICY IF EXISTS "prod_write" ON public.products;

-- Anyone can read active products
CREATE POLICY "prod_read"
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Staff can manage products
CREATE POLICY "prod_write"
ON public.products FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

-- ============================================================
-- 3. site_content: use is_staff() to avoid recursion
-- ============================================================
DROP POLICY IF EXISTS "site_content_public_read" ON public.site_content;
DROP POLICY IF EXISTS "site_content_write_admin" ON public.site_content;
DROP POLICY IF EXISTS "site_content_read_all" ON public.site_content;
DROP POLICY IF EXISTS "site_content_admin_write" ON public.site_content;
DROP POLICY IF EXISTS "sc_read" ON public.site_content;
DROP POLICY IF EXISTS "sc_write" ON public.site_content;

CREATE POLICY "sc_read"
ON public.site_content FOR SELECT TO public
USING (true);

CREATE POLICY "sc_write"
ON public.site_content FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

-- ============================================================
-- 4. user_roles: use is_admin() to avoid recursion
-- ============================================================
DROP POLICY IF EXISTS "user_roles_select_owner" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_update_admin" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_read" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_admin_manage" ON public.user_roles;
DROP POLICY IF EXISTS "ur_read" ON public.user_roles;
DROP POLICY IF EXISTS "ur_manage" ON public.user_roles;

-- Users can see their own roles; admins can see all
CREATE POLICY "ur_read"
ON public.user_roles FOR SELECT TO authenticated
USING (
  user_id = (select auth.uid())
  OR public.is_admin()
);

-- Only admins can insert/update/delete roles
CREATE POLICY "ur_manage"
ON public.user_roles FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

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
-- 7. product_performance_stats: Fix RLS
-- ============================================================
ALTER TABLE IF EXISTS public.product_performance_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pps_insert" ON public.product_performance_stats;
DROP POLICY IF EXISTS "pps_select" ON public.product_performance_stats;
DROP POLICY IF EXISTS "pps_update" ON public.product_performance_stats;

CREATE POLICY "pps_insert"
ON public.product_performance_stats FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "pps_update"
ON public.product_performance_stats FOR UPDATE TO public
USING (true)
WITH CHECK (true);

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

-- Grant execute on helper functions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;

NOTIFY pgrst, 'reload schema';
