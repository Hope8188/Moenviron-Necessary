-- Create payment_configurations table
CREATE TABLE IF NOT EXISTS public.payment_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'stripe',
    is_test_mode BOOLEAN NOT NULL DEFAULT true,
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    stripe_account_id TEXT,
    stripe_publishable_key TEXT,
    stripe_connect_id TEXT,
    connection_type TEXT NOT NULL DEFAULT 'api_keys',
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_configurations_is_default ON public.payment_configurations(is_default);
CREATE INDEX IF NOT EXISTS idx_payment_configurations_is_active ON public.payment_configurations(is_active);
