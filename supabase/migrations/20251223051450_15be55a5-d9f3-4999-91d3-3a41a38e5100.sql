-- Create storage bucket for study notes PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-notes', 'study-notes', true);

-- Allow anyone to view files (public bucket)
CREATE POLICY "Public can view study notes"
ON storage.objects FOR SELECT
USING (bucket_id = 'study-notes');

-- Allow anyone to upload files (for now, since no auth)
CREATE POLICY "Anyone can upload study notes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'study-notes');

-- Allow anyone to delete their uploads
CREATE POLICY "Anyone can delete study notes"
ON storage.objects FOR DELETE
USING (bucket_id = 'study-notes');

-- Create textbook_references table to persist references with PDFs
CREATE TABLE public.textbook_references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  pages TEXT,
  notes TEXT,
  pdf_url TEXT,
  pdf_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.textbook_references ENABLE ROW LEVEL SECURITY;

-- Allow public access for now (no auth)
CREATE POLICY "Anyone can view references"
ON public.textbook_references FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert references"
ON public.textbook_references FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can delete references"
ON public.textbook_references FOR DELETE
USING (true);