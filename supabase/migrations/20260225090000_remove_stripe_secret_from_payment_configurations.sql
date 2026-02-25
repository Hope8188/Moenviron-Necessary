-- Remove any stored Stripe secret keys from payment configurations
ALTER TABLE public.payment_configurations
  DROP COLUMN IF EXISTS stripe_secret_key;

-- Ensure RLS is enabled and admin-only access is enforced
ALTER TABLE public.payment_configurations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage payment configurations" ON public.payment_configurations;
DROP POLICY IF EXISTS "Admins can manage payment configs" ON public.payment_configurations;

CREATE POLICY "Admins can manage payment configurations"
  ON public.payment_configurations
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
