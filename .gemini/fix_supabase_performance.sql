-- COMPREHENSIVE SUPABASE PERFORMANCE FIX
-- Run in SQL Editor: https://supabase.com/dashboard/project/wmeijbrqjuhvnksiijcz/sql
-- Resolves: auth_rls_initplan, multiple_permissive_policies, unused indexes

-- ============================================================
-- 1. CLEAN UP page_views: Remove duplicate/overlapping policies
-- ============================================================

-- Drop ALL existing policies on page_views
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.page_views;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.page_views;
DROP POLICY IF EXISTS "Public can insert page views" ON public.page_views;
DROP POLICY IF EXISTS "Admins can read page views" ON public.page_views;
DROP POLICY IF EXISTS "Authenticated users can read page views" ON public.page_views;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.page_views;
DROP POLICY IF EXISTS "page_views_insert_owner" ON public.page_views;
DROP POLICY IF EXISTS "page_views_select_owner" ON public.page_views;

-- Recreate with OPTIMIZED policies (using (select auth.uid()) instead of auth.uid())
-- Single INSERT policy for all roles
CREATE POLICY "page_views_insert_public"
ON public.page_views
FOR INSERT
TO public
WITH CHECK (true);

-- Single SELECT policy for authenticated users (using select wrapper for performance)
CREATE POLICY "page_views_select_authenticated"
ON public.page_views
FOR SELECT
TO authenticated
USING ((select auth.uid()) is not null);

-- ============================================================
-- 2. FIX products: Consolidate duplicate SELECT policies
-- ============================================================
DROP POLICY IF EXISTS "products_public_read" ON public.products;
DROP POLICY IF EXISTS "products_write_admin" ON public.products;

-- Public read: anyone can view products
CREATE POLICY "products_read_all"
ON public.products
FOR SELECT
TO public
USING (is_active = true);

-- Admin write: only admins can insert/update/delete
CREATE POLICY "products_admin_write"
ON public.products
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = (select auth.uid())
    AND role IN ('admin', 'moderator', 'content')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = (select auth.uid())
    AND role IN ('admin', 'moderator', 'content')
  )
);

-- ============================================================
-- 3. FIX site_content: Consolidate duplicate SELECT policies
-- ============================================================
DROP POLICY IF EXISTS "site_content_public_read" ON public.site_content;
DROP POLICY IF EXISTS "site_content_write_admin" ON public.site_content;

-- Public read
CREATE POLICY "site_content_read_all"
ON public.site_content
FOR SELECT
TO public
USING (true);

-- Admin write
CREATE POLICY "site_content_admin_write"
ON public.site_content
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = (select auth.uid())
    AND role IN ('admin', 'moderator', 'content')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = (select auth.uid())
    AND role IN ('admin', 'moderator', 'content')
  )
);

-- ============================================================
-- 4. FIX user_roles: Consolidate duplicate SELECT policies
-- ============================================================
DROP POLICY IF EXISTS "user_roles_select_owner" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_update_admin" ON public.user_roles;

-- Users can see their own roles, admins can see all
CREATE POLICY "user_roles_read"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  user_id = (select auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = (select auth.uid())
    AND ur.role = 'admin'
  )
);

-- Admins can manage roles
CREATE POLICY "user_roles_admin_manage"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = (select auth.uid())
    AND ur.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = (select auth.uid())
    AND ur.role = 'admin'
  )
);

-- ============================================================
-- 5. Remove unused indexes (safe to drop, never been used)
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
-- 6. Grant permissions
-- ============================================================
GRANT INSERT ON TABLE public.page_views TO anon;
GRANT INSERT ON TABLE public.page_views TO authenticated;
GRANT SELECT ON TABLE public.page_views TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================
-- 7. Force schema cache reload
-- ============================================================
NOTIFY pgrst, 'reload schema';

-- ============================================================
-- Verify: Run these to confirm
-- SELECT policyname, roles, cmd FROM pg_policies WHERE tablename = 'page_views';
-- SELECT policyname, roles, cmd FROM pg_policies WHERE tablename = 'products';
-- SELECT policyname, roles, cmd FROM pg_policies WHERE tablename = 'site_content';
-- SELECT policyname, roles, cmd FROM pg_policies WHERE tablename = 'user_roles';
-- ============================================================
