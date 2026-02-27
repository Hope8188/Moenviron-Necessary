-- Create admin_messages table for admin chat functionality
CREATE TABLE IF NOT EXISTS public.admin_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL,
    recipient_id UUID,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all messages (global) or messages where they are sender/recipient
CREATE POLICY "Admins can view relevant messages"
ON public.admin_messages
FOR SELECT
TO authenticated
USING (
    is_admin(auth.uid()) AND (
        recipient_id IS NULL OR 
        sender_id = auth.uid() OR 
        recipient_id = auth.uid()
    )
);

-- Allow admins to send messages
CREATE POLICY "Admins can send messages"
ON public.admin_messages
FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()) AND sender_id = auth.uid());

-- Enable realtime for admin chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_messages;

-- Add tracking columns to orders table if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tracking_number') THEN
        ALTER TABLE public.orders ADD COLUMN tracking_number TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tracking_carrier') THEN
        ALTER TABLE public.orders ADD COLUMN tracking_carrier TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipped_at') THEN
        ALTER TABLE public.orders ADD COLUMN shipped_at TIMESTAMP WITH TIME ZONE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivered_at') THEN
        ALTER TABLE public.orders ADD COLUMN delivered_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Add responsibilities column to user_roles if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_roles' AND column_name = 'responsibilities') THEN
        ALTER TABLE public.user_roles ADD COLUMN responsibilities TEXT;
    END IF;
END $$;