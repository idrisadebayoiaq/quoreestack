UPDATE public.services SET meta_title = replace(meta_title, 'QuoreStack', 'QuoreeStack') WHERE meta_title LIKE '%QuoreStack%';
UPDATE public.blogs SET long_description = replace(long_description, 'QuoreStack', 'QuoreeStack') WHERE long_description LIKE '%QuoreStack%';
UPDATE public.blogs SET tags = array_replace(tags, 'QuoreStack', 'QuoreeStack') WHERE 'QuoreStack' = ANY(tags);
UPDATE public.testimonials SET quote = replace(quote, 'QuoreStack', 'QuoreeStack') WHERE quote LIKE '%QuoreStack%';
