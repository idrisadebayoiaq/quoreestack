-- Replace unsourced growth metrics with qualitative outcomes.
UPDATE public.projects
SET results = '[{"label":"Outcome","value":"More qualified inquiries"},{"label":"Delivery","value":"3 weeks"},{"label":"Platform","value":"Next.js"}]'::jsonb
WHERE slug = 'starlights-visuals';

UPDATE public.projects
SET results = '[{"label":"Lead flow","value":"Call + WhatsApp CTAs"},{"label":"Delivery","value":"2 weeks"},{"label":"Market","value":"Nigeria"}]'::jsonb
WHERE slug = 'ak-plumbing-co';

-- S. A. Thornton is self-initiated: one consistent duration, and no place in the client logo strip.
UPDATE public.projects
SET duration = '1 day',
    results = '[{"label":"Lead clarity","value":"Faster inquiries"},{"label":"Delivery","value":"1 day"},{"label":"Focus","value":"Service brand"}]'::jsonb
WHERE slug = 's-a-thornton-building-services';

UPDATE public.client_logos SET status = 'draft' WHERE slug = 'sa-thornton';

-- Only testimonials from verifiable clients stay public.
UPDATE public.testimonials SET status = 'draft', featured = false
WHERE slug IN ('daniel-ibe-northline', 'sara-mensah-lumen');
