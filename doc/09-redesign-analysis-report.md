# 09 — Redesign analysis report

**Status:** analysis only. Do not start visual or feature work until [10 — Redesign implementation plan](./10-redesign-implementation-plan.md) Phase 0 is accepted.  
**Reviewed:** codebase in this repo, and the live Supabase project (`public` schema).  
**Date:** 29 September 2026.

This report checks the external review against the current code and database, then gives a design and animation direction for the full visual rebuild.

Documents `01`–`08` describe the original cyber-realistic build. They stay as history. For theme, motion, and the next build order, this file and `10` replace `03` and `07`.

---

## 1. What the site actually is

QuoreeStack is a Next.js 15 App Router portfolio with a Supabase CMS, admin, client messages, and Android app downloads.

| Area | Current state |
|------|----------------|
| Public routes | Home, Work, Services, Apps, Pricing, Industries, Stack, Blog, Reviews, FAQ, About, Contact, Start a project, Process detail, Portal entry, Privacy, Terms |
| CMS | Projects, services, categories, blogs, testimonials, client logos, mobile apps, site settings |
| Auth | Profiles (`user` / `admin`), conversations, messages |
| Motion today | Framer Motion reveals, a custom cursor, a raw WebGL shader in the hero (not Three.js), CSS grid and HUD corners |
| Theme today | Dark “Signal Blue”: `#06080f` background, `#3d8bff` accent, Orbitron + Rajdhani + JetBrains Mono |

The information architecture is worth keeping. The visual system is not. Orbitron, corner brackets, a hidden cursor, and a neon HUD read as a template cyber portfolio. The clients who convert from the current work (plumbing, building services, a creative studio) need a site that feels precise and calm.

---

## 2. Verdict on the external review

### Agree, and the code or data confirms it

| Finding | Evidence |
|---------|----------|
| Placeholder copy on case studies | Starlights Visuals and AK Plumbing Co. have **no category links**. The case study page then renders the exact empty state: “No category assigned. This case study has not been mapped to a public domain yet.” |
| “The problem” repeats the short description | `projects/[slug]/page.tsx` renders `short_description` under “The problem” and `long_description` under “How it was built”. There is no separate problem field. |
| Unsourced metrics | Starlights results include “+38% inquiries”. AK Plumbing results include “2.4× calls”. Neither row stores a baseline or timeframe. |
| Concept work is mixed with client work | X-Relax is `Personal Project`. S. A. Thornton is `Self-Initiated Project` with duration `1 DAY`, while its results say `2–3 weeks`. Nike Reimagined is `Personal Concept`. Lucenta is `Personal Project`. The UI does not label these differently from paid client work. |
| Gmail in the footer | Footer hardcodes `adebayoquoreeb@gmail.com`. The same address is stored in `site_settings.contact.email`. |
| Public Admin link | Footer links to `/login?next=/admin`. |
| Socials do not match the brand | `src/lib/socials.ts` and `site_settings.social` only list X, Instagram, and Facebook for `@idrisadebayoiaq`. Twitter metadata uses that handle. GitHub and LinkedIn are absent. |
| Canonical / share URL can be the wrong host | `metadataBase` and the sitemap use `NEXT_PUBLIC_SITE_URL`, which defaults to `http://localhost:3000`. There is **no** `alternates.canonical`. If production env is still the Vercel host, `og:url` and the sitemap will advertise `quoreestack.vercel.app`. The domain fix is an env and DNS task, not a hardcoded string in the repo. |
| Stats can flash `0+` | `StatCounter` initializes React state to `0` and only counts up after the section is in view. The server HTML is `0+`. `getTrackRecord()` does compute real counts (published projects, apps, distinct tech tags, years since 2023). `site_settings.stats` (`projects: 5`) is stale and unused by the homepage. |
| Oversized images | Hero and process heroes use `sizes="100vw"`. Next.js default device sizes include 3840, so a wide viewport requests a 3840-wide image. |
| Testimonials exist but are weak proof | Homepage already renders featured testimonials. All four avatars are Dicebear initials, not photos. None have a website URL (the column does not exist). Two quotes (Northline Labs, Lumen Studio) have **no matching project**. |
| Booking exists but is easy to miss | `site_settings.contact.booking_url` is already `https://calendly.com/quoreebadebayo`. It appears on Contact, not beside “Start a project” on the homepage. |
| WhatsApp exists but is not global | The number is in `site_settings.contact.whatsapp` and is used on Contact only. There is no floating button. |
| Case studies are not Client → Problem → Solution → Results → Tech → Timeline → Testimonial | The page is a looser stack, and problem text is the blurb. |
| No architecture case study | The strongest technical products (Lucenta, X-Relax, EPIC TRANSPORT) are not written as backend or mobile case studies with a diagram. |
| Portal is not shown | `/portal` only redirects to login or messages. There is no public demo. |
| No project filters on `/projects` | Domain chips link out to `/categories/[slug]`. There is no industry, service, or tech filter on the work grid. |
| Pricing is naira and dollars only | MVP Sprint is “From ₦800,000 / $600”. No pound display. |
| JSON-LD is only a Person | Root layout emits one `Person` node. No `ProfessionalService`, `Review`, or `FAQPage`. |
| Positioning is broader than the proof | Homepage line is “Systems that ship.” Industries already has a local-business group, but the hero does not lead with it. |

### Partly true, or already built

| Finding | What is actually in the repo |
|---------|------------------------------|
| “Reviews page exists but isn’t surfaced” | Homepage `TestimonialsGrid` already loads featured testimonials, and the footer links to `/reviews`. The gap is proof quality (photos, links, matching case studies), not a missing section. |
| “Process step 03 shows `/process/build`” | `src/lib/process.ts` step `build` has title **Build** and a real description. The homepage card renders that title. Treat the live-site report as something to re-check after deploy. The source does not print the raw path as the heading. |
| “Add a sitemap, custom 404, and loading states” | `src/app/sitemap.ts`, `(public)/not-found.tsx`, `(public)/loading.tsx`, and `apps/loading.tsx` exist. There is no root `src/app/not-found.tsx`, so some unknown URLs can still hit Next’s default 404. Loading UI is a pulse skeleton, not a designed state. |
| “Respect `prefers-reduced-motion`” | `usePrefersReducedMotion` already gates the hero shader and the stat count-up. The custom cursor, marquee, and several Framer reveals still need a pass. Reduced motion does not fix the `0+` HTML, because the first paint is still zero. |
| “Add analytics” | No Plausible, Vercel Analytics, or GA4 package is installed. Lead storage in `contact_submissions` is the only conversion record. |

### Outside the codebase

| Finding | How to handle it |
|---------|------------------|
| Register the `quorestack` spelling and redirect it | Registrar and DNS. The app should keep one canonical host: `https://quoreestack.online`. |
| Replace `@idrisadebayoiaq` | Needs the real GitHub, LinkedIn, and any new handles. Do not invent them in code. |
| `hello@quoreestack.online` | Needs the mailbox to exist before the footer changes, or messages will bounce. |

---

## 3. Database snapshot

Row counts from SQL (not the compact table listing, which under-counted some tables):

| Table | Rows | Notes |
|-------|------|--------|
| `projects` | 6 published | All featured. Only 4 have category links. |
| `categories` | 4 published | E-Commerce, Mobile Apps, SaaS & Dashboards, APIs & Backend. No “local services” category, which is the niche with the clearest client sites. |
| `services` | 4 | Used by footer and project links. |
| `blogs` | 9 published | Not shown on the homepage. |
| `testimonials` | 4 published, all featured | Dicebear avatars. No `project_id`, no `website_url`. |
| `client_logos` | 4 published | AK Plumbing and S. A. Thornton logos link to `*.vercel.app` hosts. |
| `mobile_apps` | 2 published | X-Relax 1.0.15 and EPIC TRANSPORT 1.0.0, both with download URLs. |
| `site_settings` | 7 keys | `about`, `availability`, `contact`, `hero`, `packages`, `social`, `stats`. |
| `contact_submissions` | 1 | |
| `profiles` | 2 | |
| `conversations` / `messages` / `downloads` / `app_versions` | 0 | Portal and APK version history are unused in data. |

### Project proof map

| Project | Origin in data | Category linked | Risk |
|---------|----------------|-----------------|------|
| Starlights Visuals | Creative studio | No | Empty category state on the case study. Metric “+38% inquiries” has no source. |
| AK Plumbing Co. | Local service business | No | Same empty state. Metric “2.4× calls” has no source. Logo URL is a Vercel host. |
| S. A. Thornton | Self-initiated | SaaS & Dashboards (a poor fit) | Duration says 1 day and results say 2–3 weeks. Should be labeled self-initiated. |
| X-Relax | Personal project | Mobile, APIs, SaaS | Good product evidence if labeled as your own product. |
| Lucenta | Personal project | APIs, SaaS | Best candidate for a technical case study. |
| Nike Reimagined | Personal concept | SaaS, E-Commerce | Must stay labeled as a concept. Do not present it as client work. |

### Testimonial proof map

| Quote | Matching public project |
|-------|-------------------------|
| Tunde Adebayo, Starlights Visuals | Yes |
| Amaka Okoro, AK Plumbing Co. | Yes |
| Daniel Ibe, Northline Labs | No project |
| Sara Mensah, Lumen Studio | No project |

Before the redesign features these more loudly, confirm Northline and Lumen are real engagements you can stand behind. If they are, add the work or a short note of what shipped. If they are not, unpublish them. Generated faces or initials next to an unverifiable company will cost more trust than an empty slot.

---

## 4. Design opinion

### Do not restyle the cyber theme

A new neon palette on the same HUD, cursor, and Orbitron type will still look like the current site. The rebuild should change structure, type, color, and motion together.

### Recommended style: Atelier

A product studio, not a sci-fi dashboard. Quiet surfaces, one warm accent, large readable type, and WebGL used as atmosphere in one place.

This fits both audiences:

- A building company or plumber should be able to read a price and a case study without fighting glow and a missing cursor.
- A product client should still see that you can handle interface, motion, and engineering.

**Palette**

| Token | Value | Role |
|-------|-------|------|
| `--ink` | `#141311` | Text, dark hero, footer |
| `--bone` | `#f4f0e8` | Page background |
| `--paper` | `#fffdf8` | Cards |
| `--copper` | `#b85c38` | Single accent: links, primary button, focus ring |
| `--sage` | `#3e6b58` | Availability and success only |
| `--line` | `rgba(20,19,17,0.12)` | Borders |
| `--muted` | `#5e5952` | Secondary text |

No magenta, no cyan glow, no grid overlay, no scanlines.

**Type**

| Role | Face | Why |
|------|------|-----|
| Display | Fraunces (optical size, soft serif) | Editorial, memorable, not a crypto/cyber default |
| Body | Source Sans 3 | Long case studies stay readable |
| Meta | JetBrains Mono, smaller and rarer | Labels and prices only |

Drop Orbitron and Rajdhani.

**Layout**

- Light pages, with a dark hero and a dark footer as a frame.
- More whitespace, fewer bordered glass cards.
- One primary action per view: “Start a project”. Secondary: “Book a 20-min call”.
- Work shown as large images with a one-line outcome, not equal neon tiles.
- Custom cursor removed. It hides the pointer, hurts accessibility, and feels like a theme.

**Positioning**

Lead with the work you can prove, then show range.

> Websites that turn local businesses into leads — plus the apps and backends behind them.

Keep “Systems that ship.” as a short supporting line if you like it. Do not make “full stack” the headline. The industries page can stay broad. The homepage should not.

Label every project `Client`, `Own product`, or `Concept` in the UI.

---

## 5. Where Three.js / WebGL should live

The hero already runs a hand-written WebGL shader (`HeroWebGL`). That is the right *slot* and the wrong *implementation* for the new theme: a full-viewport cyan grid does not match Atelier, and a second WebGL context beside drifting app screenshots will fight the content.

### Use Three.js in one signature place

**Homepage hero only**, loaded with `next/dynamic` and `ssr: false`.

Scene idea: three thin glass planes (interface, API, data) floating in a shallow stack, slowly drifting, with a soft copper light. Mouse movement shifts the camera a few degrees. No particles, no bloom, no postprocessing.

Behavior:

- Poster image paints immediately. The canvas fades in after the scene is ready, so there is no blank hero.
- Pause the render loop when the tab is hidden or the hero leaves the viewport.
- Cap `devicePixelRatio` at `1.25`.
- On viewports under 768px, skip the canvas and keep the poster. Phones should not pay for a scene they mostly cover with text.
- If WebGL fails, the poster remains. No error UI.
- `prefers-reduced-motion`: static poster only.

### Do not use Three.js here

| Place | Use instead |
|-------|-------------|
| Every section background | Nothing. Bone paper is the design. |
| Process steps | A CSS or SVG line that draws on scroll. Cheaper and clearer. |
| Project cards | Image scale and a one-line caption shift. CSS only. |
| Case study heroes | A real screenshot in a browser or phone frame, plus a before/after slider if you have both images. |
| Stats | The final number in server HTML. A short count-up may run only after hydration, starting from the real value already in the DOM (`0+` must never be the HTML). |
| Cursor | Remove it. |
| Page transitions | A 200ms opacity fade. No 3D camera flights between routes. |

### Motion budget

- One WebGL canvas on the site.
- Framer Motion only for in-view fades of text blocks, disabled when reduced motion is on.
- No marquees that run forever. The current tech strip can become a static row.
- Target: hero scene under ~1.5 MB of JS for `three`, and a stable 60fps on a mid-range laptop. If it drops frames, simplify the scene before adding effects.

---

## 6. What else will make it feel professional

Ordered by how much trust they add versus how much work they are. Phase numbers match the implementation plan.

### Do these with the theme change

1. **Honest case studies.** Separate problem, solution, and results. Link categories. Mark origin. Drop or source “+38%” and “2.4×”.
2. **Real contact surface.** `hello@quoreestack.online` once the inbox exists, Calendly beside the main button, WhatsApp as a small floating action (not a second hero).
3. **Remove the Admin footer link.** Keep `/login` and `/admin` reachable by URL.
4. **Canonical host.** Set `NEXT_PUBLIC_SITE_URL=https://quoreestack.online` in production and emit `alternates.canonical`.
5. **Stats that match the HTML.** Server-render the counts from `getTrackRecord()`. Ignore the stale `site_settings.stats` object or delete it later.
6. **Social proof you can defend.** Photos or no photo. Company link. Only quotes tied to a public project, until the other two are verified.
7. **Engagement terms** on Pricing: deposit, milestones, revision count, who owns code and hosting, what support is included after launch.
8. **GitHub and LinkedIn** once you supply the URLs. Read them from `site_settings.social` so the footer and JSON-LD stay in sync.
9. **Image sizes.** Cap `images.deviceSizes`, and set `sizes` from the real layout width.
10. **Root 404** that uses the new layout, plus designed loading states.

### Do these after the new shell is stable

11. **Public portal preview** at something like `/portal/preview`: static screenshots of milestones, status, and invoices. Do not expose a real client login.
12. **Work filters** on `/projects` for industry, service, and tech, driven by data you already store once categories are fixed.
13. **One technical case study** (Lucenta or EPIC TRANSPORT) with a simple architecture diagram and what the API is responsible for.
14. **JSON-LD** for `ProfessionalService`, `FAQPage` on `/faq`, and `Review` only for testimonials you are willing to stand behind. Per-route OG images via `next/og`.
15. **Analytics** on “Start a project”, “Book a call”, and WhatsApp clicks. Plausible or Vercel Analytics is enough. Do not add three tools.
16. **Currency display** for ₦ / $ / £ on the same package, as a toggle that does not pretend to be a live FX quote. Label it “guide price”.

### Later, only if the above is live

17. **Cost estimator.** Useful, and easy to mislead. Ship ranges (“marketing site, typically X–Y”) that prefill `/start`, not a fake exact quote.
18. **One-page capabilities PDF.** A designed export of services, two case studies, and pricing. Skip it until the copy is final or you will regenerate it immediately.
19. **Lead magnet / email capture.** Lowest priority. You do not yet have enough traffic data to know which page should collect emails. Fix conversion paths first.
20. **Alternate domain redirect** (`quorestack.*` → `quoreestack.online`) at the registrar.

### Do not add

- A second WebGL scene, a particle field, or a custom cursor.
- Lighthouse badges or “60-second videos” until you actually have the scores and the recordings.
- More industries or services before the six case studies are categorized and labeled.
- Fake client logos, stock portraits, or testimonials without a project.

---

## 7. Recommended build order (summary)

Content truth first, then the visual system, then the hero scene, then conversion extras. Building Three.js on top of placeholder case studies will make the gaps more visible.

Full steps, files, and acceptance checks are in [10 — Redesign implementation plan](./10-redesign-implementation-plan.md).
