INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('site-assets', 'site-assets', true, false)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Give access to upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-assets');
CREATE POLICY "Give public access to view" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "Give access to update" ON storage.objects FOR UPDATE USING (bucket_id = 'site-assets');
CREATE POLICY "Give access to delete" ON storage.objects FOR DELETE USING (bucket_id = 'site-assets');
