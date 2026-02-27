INSERT INTO public.user_roles (user_id, role)
VALUES ('c29693b7-095c-415b-aba5-05ed2003a5f0', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
