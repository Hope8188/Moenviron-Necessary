-- ============================================================
-- FIX: Admin Staff Invitation & Role Assignment System
-- Run this in Supabase SQL Editor
-- ============================================================

-- STEP 1: Ensure ALL role values exist in the app_role enum
-- The original migration only had ('admin', 'moderator', 'user')
-- but the frontend tries to use 'marketing', 'shipping', 'support', 'content'
DO $$
BEGIN
  -- Add missing enum values safely
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'marketing'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'shipping'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'support'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'moderator'; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- STEP 2: Add responsibilities column to user_roles if missing
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS responsibilities TEXT;

-- STEP 3: Recreate is_admin() to include ALL staff roles (and moderator)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role::text IN ('admin', 'moderator', 'marketing', 'shipping', 'support', 'content')
    )
$$;

-- STEP 4: Recreate is_staff() helper (used in AuthContext)
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role::text IN ('admin', 'moderator', 'marketing', 'shipping', 'support', 'content')
    )
$$;

-- STEP 5: Fix RLS on user_roles - ensure admins can INSERT/UPDATE/DELETE
-- Drop conflicting policies first
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- Recreate clean policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- STEP 6: Fix RLS on site_content - ensure admins can READ and WRITE pending_invitations
DROP POLICY IF EXISTS "Anyone can view active site content" ON public.site_content;
DROP POLICY IF EXISTS "Anyone can view site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;
DROP POLICY IF EXISTS "Public can read site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can write site content" ON public.site_content;

-- Anyone can read site_content (products page, CMS, etc.)
CREATE POLICY "Public can read site content"
ON public.site_content FOR SELECT
USING (true);

-- Admins can insert
CREATE POLICY "Admins can insert site content"
ON public.site_content FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Admins can update
CREATE POLICY "Admins can update site content"
ON public.site_content FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admins can delete
CREATE POLICY "Admins can delete site content"
ON public.site_content FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- STEP 7: Ensure jackblessed191@gmail.com has admin role
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'jackblessed191@gmail.com';

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    RAISE NOTICE 'Admin role ensured for jackblessed191@gmail.com (%)' , v_user_id;
  ELSE
    RAISE NOTICE 'User jackblessed191@gmail.com not found in auth.users';
  END IF;
END $$;

-- STEP 8: Notify PostgREST to reload schema (picks up new columns + enum values)
NOTIFY pgrst, 'reload schema';

-- Done! The invitation system should now work end-to-end.
