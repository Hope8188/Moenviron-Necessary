-- Run AFTER fix_supabase_performance.sql
-- This ensures jackblessed191@gmail.com has admin role

-- First, find the user ID
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'jackblessed191@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User not found!';
    RETURN;
  END IF;

  RAISE NOTICE 'User ID: %', v_user_id;

  -- Insert admin role if not exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Admin role ensured for jackblessed191@gmail.com';
END $$;
