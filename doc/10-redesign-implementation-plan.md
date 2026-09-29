# 10 — Redesign implementation plan

Follow this file in order. Do not start a phase until the previous phase’s checks pass.

Design decisions live in [09 — Redesign analysis report](./09-redesign-analysis-report.md). This plan assumes that direction: **Atelier** (bone pages, ink hero and footer, copper accent, Fraunces + Source Sans 3), Three.js **only in the homepage hero**.

Old cyber docs (`03`, `07`) are not the build order for this work.

---

## Rules for every phase

- One phase at a time. Do not restyle a page and add a new product feature in the same change unless this plan says so.
- Keep admin, auth, messages, and app downloads working. The redesign is the public site.
- Do not invent client names, metrics, social URLs, or email addresses. If a value is missing, leave a clearly labeled placeholder in content and skip the UI until you have the real value.
- Every animated component must do nothing decorative when `prefers-reduced-motion: reduce` is set.
- After a public UI phase, check the changed flow in the browser (desktop and a narrow viewport) before moving on.
- Schema changes go through a Supabase migration, then regenerate `src/types/database.types.ts`.

---

## Phase 0 — Content decisions (no visual rebuild)

**Goal:** know which words and numbers are allowed on the new site.

### Steps

1. Confirm the production canonical URL is `https://quoreestack.online`, and that `hello@quoreestack.online` can receive mail. If the mailbox is not ready, keep a single contact address and do not print an address that bounces.
2. For each published project, write:
   - origin: `client` | `own_product` | `concept`
   - one paragraph for the problem that is **not** the short description
   - one paragraph for what you built
   - results you can source, or remove the result
3. Decide what to do with the Northline Labs and Lumen Studio testimonials. Publish only quotes you can tie to real work.
4. Collect, if you have them: GitHub URL, LinkedIn URL, Calendly stays as the booking link, WhatsApp stays as the number already in `site_settings.contact`.
5. Pick final homepage positioning:
   - Headline direction: local-business websites that generate leads.
   - Supporting line: apps and backends when the product needs them.
   - Optional keep: “Systems that ship.”

### Checks

- [ ] A short content sheet exists (can live at the bottom of this file as you fill it, or in the CMS draft fields) for all six projects.
- [ ] No metric remains unless it has a baseline and a timeframe, or it is clearly qualitative (“Faster inquiries”).
- [ ] S. A. Thornton duration is one number, not both “1 day” and “2–3 weeks”.
- [ ] You have a yes/no on Northline and Lumen.

**Do not start Phase 1 until those four checks are done.** The rest of the plan can be coded around drafts, but empty problem sections should not ship.

---

## Phase 1 — Trust and metadata fixes on the current theme

**Goal:** stop the live site showing the worst gaps before the visual rebuild. Small, reversible edits.

### Steps

1. **Canonical URL**
   - Set production `NEXT_PUBLIC_SITE_URL` to `https://quoreestack.online`.
   - Add `alternates.canonical` from `siteConfig.url` in the root metadata.
   - Confirm `sitemap.ts` and Open Graph use that host. Do not hardcode a second domain in components.
2. **Footer**
   - Remove the Admin link.
   - Read the public email from `site_settings.contact.email` instead of a hardcoded Gmail string. Switch the stored value to `hello@quoreestack.online` only after Phase 0 confirms the inbox.
3. **Stats**
   - Change `StatCounter` so the server-rendered text is the real value.
   - Count-up may replace that text after hydration only when motion is allowed and the block is in view.
   - Homepage keeps using `getTrackRecord()`. Do not display `site_settings.stats`.
4. **Case study empty states**
   - Link Starlights and AK Plumbing to a real category (add a `local-services` category if none fits — do this in Phase 4’s migration if you would rather not touch taxonomy twice; until then, hide the “No category assigned” block when both sides are empty).
   - Stop rendering `short_description` as “The problem” if it duplicates the hero summary. Show the problem section only when a dedicated field exists (Phase 4). Until then, retitle or remove the duplicate block.
5. **Images**
   - In `next.config.ts`, set `images.deviceSizes` to something like `[640, 768, 1024, 1280, 1536, 1920]` so the optimizer does not offer 3840.
   - Replace `sizes="100vw"` on heroes with a size that matches the visible column.
6. **Socials**
   - Drive footer, JSON-LD `sameAs`, and Twitter `creator` from one source (`site_settings.social` with a code fallback).
   - Add GitHub and LinkedIn keys. Leave them out of the UI until URLs exist.
7. **Process**
   - Open `/` and `/process/build` in the browser. Confirm step 03 shows “Build” and its description. If production still shows the raw path, fix that render before any restyle.

### Checks

- [ ] View source on the homepage stats: the numbers are not `0`.
- [ ] Shared-link debugger (or the page `<meta>`) shows `quoreestack.online`, not `vercel.app` or `localhost`.
- [ ] Footer has no Admin link.
- [ ] Starlights and AK Plumbing case studies do not show the placeholder category sentence.
- [ ] A phone-width screenshot request is well under 3840px wide (check the image request URL).

---

## Phase 2 — Atelier design system (tokens only)

**Goal:** new color, type, and focus styles, before rearranging pages.

### Steps

1. Replace the palette and font variables in `src/app/globals.css` with the Atelier tokens from doc 09.
2. Load Fraunces and Source Sans 3 in `src/app/layout.tsx`. Remove Orbitron and Rajdhani.
3. Restyle primitives so later pages inherit the system:
   - `NeonButton` → rename in place or restyle as a plain button (filled copper, ink text; secondary is an ink outline). Avoid a wide rename if it touches every page in one risky diff; restyle first, rename in a follow-up if you want.
   - `GlowCard`, `hud-corners`, grid background: stop using them on public pages.
   - `CyberCursor`: remove it from `(public)/layout.tsx`.
   - `GridBackground`: remove it from the public layout.
   - `MarqueeStrip`: stop using infinite motion on the public footer.
4. Focus states: 2px copper outline, visible on keyboard. Do not remove outlines.
5. Reduced motion: disable smooth scroll and transform hovers when the media query matches.

### Checks

- [ ] Public pages no longer show a custom cursor.
- [ ] Tabbing from the logo through the header reaches every link, with a visible focus ring.
- [ ] Body text contrast on bone background stays readable (aim for WCAG AA).
- [ ] Admin UI can keep a denser dark chrome if restyling it would slow this phase. Do not block the public site on an admin reskin.

---

## Phase 3 — Shell: header, footer, 404, loading

**Goal:** the frame of the site matches Atelier. Page interiors can still look temporary for one phase.

### Steps

1. Rebuild `Header` / `SiteHeader`:
   - Wordmark “QuoreStack”, no neon QS badge required.
   - Nav: Work, Services, Apps, Pricing, About. Move Blog, FAQ, Stack, Industries, Reviews into a simple “More” group or the footer so the bar is short.
   - Actions: “Book a call” (Calendly from settings) and “Start a project”.
   - Mobile: a normal full-screen or dropdown menu. No cursor effects.
2. Rebuild `Footer`:
   - Email, location, socials, WhatsApp text link, availability.
   - No Admin link.
   - Static technology list, not a marquee.
3. Add `src/app/not-found.tsx` using the same shell, with a link home and a link to `/start`.
4. Restyle `(public)/loading.tsx` to bone skeletons, no cyan blocks.
5. Add a small WhatsApp button fixed to the bottom corner, fed by `site_settings.contact.whatsapp`. Hide it on `/admin` and `/login`. Include a visible text label (“WhatsApp”), not only an icon.

### Checks

- [ ] Homepage, a case study, `/start`, and a missing URL all show the new header and footer.
- [ ] Booking button opens the existing Calendly URL.
- [ ] WhatsApp opens `wa.me` with the stored number.
- [ ] Keyboard users can open and close the mobile nav.

---

## Phase 4 — Case study model and honest project pages

**Goal:** the database can store a real case study, and the page renders it.

### Migration (projects)

Add nullable columns, all optional so current rows keep working:

| Column | Type | Purpose |
|--------|------|---------|
| `origin` | text check in `client`, `own_product`, `concept` | Badge on cards and the case study |
| `problem` | text | Shown as “The problem” |
| `solution` | text | Shown as “What we built” |
| `timeline_notes` | text | Shown as “Timeline” |
| `testimonial_id` | uuid → `testimonials.id` | Replaces the company-name guess |

On `testimonials`, add nullable `website_url` and `project_id`.

### Steps

1. Write the migration and regenerate types.
2. Fill the six projects from the Phase 0 sheet. Set `origin`. Link Starlights and AK Plumbing to categories. Add a published category such as Local services if you need it, and stop filing a building-company site under “SaaS & Dashboards” unless that is actually true.
3. Rebuild `projects/[slug]/page.tsx` in this order:
   1. Client (or origin badge) and summary
   2. Problem
   3. Solution
   4. Results (only stored, sourced metrics)
   5. Tech
   6. Timeline
   7. Testimonial, only when `testimonial_id` is set
   8. Gallery
   9. Related work and “Start a similar project”
4. Remove the duplicate problem block and the “No category assigned” empty state for visitors. Editors can still see missing links in admin.
5. Card grid: show origin badge. Concept and own-product projects must not look like unnamed client logos.
6. Admin project form: fields for the new columns.

### Checks

- [ ] Each published case study shows problem text that is different from the hero summary.
- [ ] Starlights and AK Plumbing show a category.
- [ ] Nike Reimagined is visibly a concept.
- [ ] A testimonial renders only when linked, and Northline/Lumen are either linked to real work or unpublished.
- [ ] Related projects still render.

---

## Phase 5 — Homepage composition

**Goal:** the homepage sells the niche and proves it, in the new layout. Still no Three.js.

### Section order

1. **Hero (dark).** Positioning headline, one sentence, availability, “Start a project”, “Book a 20-min call”. Poster image only in this phase.
2. **Selected work.** Three client or own-product projects. Thornton, Nike, and any concept sit behind a filter or a “Also exploring” note, not in the first three if stronger client work exists. Starlights and AK Plumbing should be in this first row once their case studies are fixed.
3. **Short about.** Portrait, two sentences, link to `/about`.
4. **Testimonials.** Name, role, company, link to their site when `website_url` exists. Photo if you have one; otherwise initials you draw in CSS, not a third-party avatar service.
5. **Services.** Three, linking to real service pages.
6. **Pricing strip.** The three packages, with the public MVP price. Link to `/pricing` for terms.
7. **How engagements work.** Deposit, milestones, revisions, code and hosting ownership, support after launch. This can be a short block that also lives in full on `/pricing`.
8. **Process.** The five existing steps, titled, with descriptions. No raw slugs.
9. **Numbers.** Server-rendered track record.
10. **FAQ preview and final call to action.**

### Checks

- [ ] A visitor can see who the work is for, a price, and two ways to make contact without scrolling through every section.
- [ ] Testimonials on the homepage match published, defensible rows.
- [ ] No section depends on Three.js yet.
- [ ] Reduced motion: sections appear immediately, no slide-offscreen content that never arrives.

---

## Phase 6 — Homepage hero in Three.js

**Goal:** one scene, as specified in doc 09. Replace `HeroWebGL`.

### Steps

1. Add `three` as a dependency. Do not add a postprocessing package in this phase.
2. New client component, for example `src/components/hero/HeroScene.tsx`:
   - dynamic import from the hero with `ssr: false`
   - dispose geometry, material, and renderer on unmount
   - pause when `document.hidden` or the hero is off screen
   - `devicePixelRatio` max 1.25
   - skip entirely under 768px or when reduced motion is set
3. Keep the poster underneath. Fade the canvas in after the first frame.
4. Remove `HeroAppStage` from the hero if it competes with the scene. Product UI belongs in case studies.
5. Delete or stop importing the old shader component once the new scene is the only canvas.

### Checks

- [ ] Desktop: scene moves slightly with the pointer and stays behind the headline (headline remains readable).
- [ ] Mobile width: no canvas, poster still looks intentional.
- [ ] `prefers-reduced-motion`: no canvas, no drift.
- [ ] Leaving the homepage does not leave a running animation (CPU settles).
- [ ] WebGL disabled or blocked: poster only, no console error shown to the user.

---

## Phase 7 — Conversion and proof extras

**Goal:** the professional signals from the review, on top of a stable design.

Do these as separate small steps. Ship each one before starting the next.

1. **Pricing page terms.** Full “How engagements work” section. Multi-currency guide prices (₦ / $ / £) as a toggle stored as three strings per package, not a live exchange rate.
2. **Work filters.** On `/projects`, filter the list by category, linked service, and tech tag already on the project. Filtering can be query-string based so links are shareable (`/projects?tech=Next.js`).
3. **Portal preview.** New public route with static images of milestones, status, and invoices. Copy should say it is a preview of the client portal. Do not use real client data.
4. **One technical case study.** Expand Lucenta or EPIC TRANSPORT with an architecture section (a simple diagram image is enough) and a short API note. Add gallery images you actually have. Do not invent Lighthouse scores or a walkthrough video.
5. **Analytics.** One provider. Events: start project click, booking click, WhatsApp click, contact form success.
6. **Structured data and OG.**
   - `ProfessionalService` with area served, url, and price range from the MVP package.
   - `FAQPage` on the FAQ route.
   - `Review` only for testimonials that survived Phase 0.
   - Default OG image plus a generated image for project and blog routes.
7. **Capabilities PDF.** Only after homepage and pricing copy are final. One page, linked from Pricing or About.

### Checks

- [ ] Filter URLs survive refresh.
- [ ] Portal preview has no login and no private rows.
- [ ] Form submit still lands in `contact_submissions`.
- [ ] Rich results test (or a manual JSON-LD read) shows the new types and the canonical host.

---

## Phase 8 — Optional, after traffic

Only start these if Phases 0–7 are in production.

1. **Estimator.** Project type, a few features, timeline. Output a range and a prefilled `/start` link. Copy must say the range is a guide and the real quote comes after a brief.
2. **Lead magnet.** A checklist PDF plus an email field. Needs a place to store subscribers (new table and a privacy note) and a reason to email them. Skip if you will not send the mail.
3. **Domain alias.** Redirect the other spelling at DNS. No application code required if the host can redirect.

---

## Suggested file map

| Phase | Main files |
|-------|------------|
| 1 | `src/lib/utils.ts`, `src/app/layout.tsx`, `Footer.tsx`, `StatCounter.tsx`, `projects/[slug]/page.tsx`, `next.config.ts`, `src/lib/socials.ts` |
| 2 | `globals.css`, `layout.tsx`, button/card primitives, `(public)/layout.tsx` |
| 3 | `Header.tsx`, `SiteHeader.tsx`, `Footer.tsx`, `src/app/not-found.tsx`, `loading.tsx`, new WhatsApp component |
| 4 | new SQL migration, `database.types.ts`, project admin form, project detail page, `ContentCards.tsx` |
| 5 | `src/app/(public)/page.tsx`, pricing and process sections |
| 6 | `HeroBackground.tsx`, new `HeroScene.tsx`, remove old `HeroWebGL.tsx` usage |
| 7 | `pricing/page.tsx`, `projects/page.tsx`, new portal preview route, one project’s content, analytics, JSON-LD |

---

## Definition of done

The redesign is complete when all of the following are true:

- The public site uses Atelier type and color, with one Three.js hero that respects reduced motion and small screens.
- No visitor-facing placeholder (“No category assigned”, unsourced percentages, `0+`, Admin link, wrong canonical host).
- Every featured case study has origin, problem, solution, and sourced or qualitative results.
- Homepage offers a brief and a 20-minute call, and WhatsApp is one click away.
- Pricing explains how money, revisions, ownership, and support work.
- GitHub and LinkedIn appear only if the URLs are real.
