-- Add is_active column to site_content
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;