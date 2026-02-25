-- Create site_content table for CMS
CREATE TABLE public.site_content (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_name TEXT NOT NULL,
    section_key TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(page_name, section_key)
);

-- Create impact_metrics table for sustainability tracking
CREATE TABLE public.impact_metrics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    description TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create digital_library table for downloadable assets
CREATE TABLE public.digital_library (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    download_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table for e-commerce
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    sale_price NUMERIC,
    currency TEXT NOT NULL DEFAULT 'GBP',
    category TEXT NOT NULL DEFAULT 'general',
    images TEXT[] DEFAULT '{}',
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    sku TEXT UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table for e-commerce
CREATE TABLE public.orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address JSONB NOT NULL DEFAULT '{}',
    billing_address JSONB,
    items JSONB NOT NULL DEFAULT '[]',
    subtotal NUMERIC NOT NULL DEFAULT 0,
    shipping_cost NUMERIC NOT NULL DEFAULT 0,
    tax NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'GBP',
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_intent_id TEXT,
    mpesa_checkout_id TEXT,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create newsletter_subscribers table
CREATE TABLE public.newsletter_subscribers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    source TEXT DEFAULT 'website',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- site_content policies (public read, admin write)
CREATE POLICY "Anyone can view active site content" ON public.site_content
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage site content" ON public.site_content
    FOR ALL USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- impact_metrics policies (public read, admin write)
CREATE POLICY "Anyone can view impact metrics" ON public.impact_metrics
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage impact metrics" ON public.impact_metrics
    FOR ALL USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- digital_library policies (public read, admin write)
CREATE POLICY "Anyone can view active library items" ON public.digital_library
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage library items" ON public.digital_library
    FOR ALL USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- products policies (public read, admin write)
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- orders policies (users see own orders, admins see all)
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all orders" ON public.orders
    FOR ALL USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- newsletter_subscribers policies
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage subscribers" ON public.newsletter_subscribers
    FOR ALL USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create updated_at triggers for all new tables
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON public.site_content
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_impact_metrics_updated_at
    BEFORE UPDATE ON public.impact_metrics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_digital_library_updated_at
    BEFORE UPDATE ON public.digital_library
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_site_content_page_section ON public.site_content(page_name, section_key);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_featured ON public.products(featured) WHERE featured = true;
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);