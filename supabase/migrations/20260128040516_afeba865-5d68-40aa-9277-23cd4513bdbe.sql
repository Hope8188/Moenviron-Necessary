-- Add notes column to impact_metrics
ALTER TABLE public.impact_metrics ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add missing columns to orders table
ALTER TABLE public.orders 
    ADD COLUMN IF NOT EXISTS user_email TEXT,
    ADD COLUMN IF NOT EXISTS user_name TEXT,
    ADD COLUMN IF NOT EXISTS total_amount NUMERIC,
    ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
    ADD COLUMN IF NOT EXISTS mpesa_transaction_id TEXT,
    ADD COLUMN IF NOT EXISTS tracking_carrier TEXT,
    ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE,
    ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Update existing orders: copy customer_email to user_email if empty
UPDATE public.orders SET user_email = customer_email WHERE user_email IS NULL;
UPDATE public.orders SET user_name = customer_name WHERE user_name IS NULL;
UPDATE public.orders SET total_amount = total WHERE total_amount IS NULL;

-- Create payment_configurations table
CREATE TABLE public.payment_configurations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'stripe',
    connection_type TEXT NOT NULL DEFAULT 'api_keys',
    stripe_publishable_key TEXT,
    stripe_account_id TEXT,
    is_test_mode BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_default BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reports table
CREATE TABLE public.reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    report_type TEXT DEFAULT 'Impact',
    status TEXT DEFAULT 'draft',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Payment configurations policies (admin only)
CREATE POLICY "Admins can manage payment configurations" ON public.payment_configurations
    FOR ALL USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Reports policies (public read, admin write)
CREATE POLICY "Anyone can view published reports" ON public.reports
    FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage reports" ON public.reports
    FOR ALL USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add triggers
CREATE TRIGGER update_payment_configurations_updated_at
    BEFORE UPDATE ON public.payment_configurations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();