# 07 — Implementation Phases (Start → End)

> **Follow this document sequentially.** Each phase has tasks, deliverables, and MCP checkpoints.

**Estimated timeline:** 3–4 weeks (solo, part-time) · 1.5–2 weeks (full-time)

---

## Phase 0: Planning & setup (Day 1)

### Tasks
- [ ] Read all docs in `/doc`
- [ ] Register domain (`quorestack.dev` or similar)
- [ ] Gather content assets (photos, screenshots, APKs, copy)
- [ ] Confirm Supabase MCP connected (`.cursor/mcp.json`)

### MCP checkpoint
```
get_project_url
get_publishable_keys
list_tables { verbose: true }
```

### Deliverable
Environment ready, content folder prepared locally.

---

## Phase 1: Supabase foundation (Day 1–2)

### Tasks
- [x] Apply Migration 001 (`initial_schema`) via MCP
- [x] Apply Migration 002 (`storage_buckets_and_policies`) via MCP
- [x] Apply Migration 003 (`security_hardening`) via MCP
- [x] Run `get_advisors` security + performance
- [x] Fix critical advisor warnings (function search_path, RPC revoke, app_versions_public view)
- [x] Run `generate_typescript_types`
- [x] Save migration SQL files to `supabase/migrations/`

### MCP checkpoint
```
apply_migration → list_tables → get_advisors → generate_typescript_types
```

### Deliverable
Database, RLS, storage buckets live. Types generated.

---

## Phase 2: Next.js project scaffold (Day 2–3)

### Tasks
- [x] Next.js 15 + TypeScript + Tailwind App Router scaffolded
- [x] Install dependencies (`@supabase/*`, framer-motion, gsap, forms, lucide, etc.)
- [x] `components.json` for shadcn/ui (components added in Phase 3+)
- [x] Configure `.env` with Supabase URL + publishable + service role keys
- [x] Create Supabase clients (`lib/supabase/client.ts`, `server.ts`, `middleware.ts`)
- [x] Set up root `middleware.ts` for session refresh + admin guard
- [x] Add fonts: Orbitron, Rajdhani, JetBrains Mono
- [x] Create folder structure per doc 02
- [x] Production build verified (`npm run build`)

### Deliverable
Running dev server with Supabase connected.

---

## Phase 3: Design system & global UI (Day 3–5)

### Tasks
- [x] Implement CSS variables / cyber theme in `globals.css`
- [x] Build `GridBackground` component
- [x] Build `CyberCursor` (mouse animation) — desktop only
- [x] Build `SectionHeading` with 5 animation variants
- [x] Build `GlowCard`, `NeonButton`, `PageTransition`
- [x] Build `Header` + `Footer` with QuoreStack branding
- [x] Add `prefers-reduced-motion` fallbacks
- [x] Test responsive breakpoints (mobile menu, cursor disabled on touch)
- [x] `StatCounter` + `MarqueeStrip`
- [x] Public layout + home 5-section showcase

### Deliverable
Reusable cyber-realistic component library.

---

## Phase 4: Auth pages (Day 5–6)

### Tasks
- [x] `/login` page (email + password)
- [x] `/signup` page (email, password, full name)
- [x] Handle `?next=` redirect after login
- [x] Sign out action in header (`AuthNav`)
- [x] Auth callback route `/auth/callback`
- [x] Middleware: redirect authed users from login/signup; protect `/admin`
- [x] Role escalation protection trigger (`protect_profile_role`)
- [ ] Create your account → promote to admin via MCP (after you sign up):
  ```sql
  UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
  ```
- [x] Build verified

### MCP checkpoint
```
get_logs { service: "auth" }
```

### Deliverable
Working authentication with admin role assigned (promote after first signup).

---

## Phase 5: Public hub pages — 5 sections each (Day 6–10)

Build in this order:

### 5.1 Home `/`
- [x] 5 sections with unique heading animations (doc 04)
- [x] Fetch featured content from Supabase
- [x] Stats counter animation

### 5.2 About `/about`
- [x] 5 sections: intro, journey, skills, tools, values
- [x] Pull bio from `site_settings` or hardcode initially

### 5.3 Projects hub `/projects`
- [x] 5 sections including project grid
- [x] Cards link to `/projects/[slug]`

### 5.4 Services hub `/services`
- [x] 5 sections including service grid
- [x] Cards link to `/services/[slug]`

### 5.5 Categories hub `/categories`
- [x] 5 sections including category grid
- [x] Cards link to `/categories/[slug]`

### Also
- [x] Seeded sample categories (4), services (4), projects (3), site_settings
- [x] Admin: `adebayoquoreeb@gmail.com` promoted

### Deliverable
All hub pages live with animations and Supabase data.

---

## Phase 6: Detail pages (Day 10–13)

### Tasks
- [x] `/projects/[slug]` — full case study layout
- [x] `/services/[slug]` — full service detail
- [x] `/categories/[slug]` — filtered projects/apps/services
- [x] Implement `generateStaticParams` + `generateMetadata` for SEO
- [x] Related content sections at bottom of each detail page
- [x] 404 handling for invalid slugs

### Deliverable
All click-through detail pages functional.

---

## Phase 7: Apps section — custom layout (Day 13–16)

### Tasks
- [x] `/apps` — featured hero, filter, grid (NOT 5-section layout)
- [x] `/apps/[slug]` — full product page:
  - Gallery, features, tech stack, install guide
  - Download button with auth gate
- [x] Deploy `download-apk` Edge Function via MCP
- [x] Client-side download flow:
  1. Click Download
  2. If not logged in → redirect signup
  3. Call Edge Function → receive signed URL
  4. Redirect to signed URL
- [x] Android install instructions component

### MCP checkpoint
```
deploy_edge_function (download-apk)
list_edge_functions
get_logs (edge-function, storage)
```

### Deliverable
Complete app showcase with gated APK download.

---

## Phase 8: Contact page (Day 16–17)

### Tasks
- [x] `/contact` — flexible layout (hero + form + info)
- [x] Form validation with Zod
- [x] Submit to `contact_submissions` via Supabase
- [x] Success/error toast states
- [x] Optional: rate limiting (simple debounce)

### Deliverable
Working contact form storing to Supabase.

---

## Phase 9: Admin panel (Day 17–22)

### Tasks
- [x] Protect `/admin/*` in middleware (admin role only)
- [x] Admin layout (sidebar nav, no cyber cursor)
- [x] Dashboard with counts (projects, apps, downloads, contacts)
- [x] CRUD: Categories
- [x] CRUD: Services (with deliverables JSON editor)
- [x] CRUD: Projects (gallery upload, category/service relations)
- [x] CRUD: Apps (icon/screenshots upload)
- [x] APK upload to `apks` bucket + create `app_versions` row
- [x] Mark version as `is_latest`
- [x] Contact inbox (read/unread toggle)
- [x] Download analytics table

### Upload flow for APK (admin)
1. Select `.apk` file
2. Upload to `apks/{app-slug}/v{version}/app.apk` via Supabase Storage
3. Insert row in `app_versions` with path, size, version
4. Set `is_latest = true`

### MCP checkpoint (after admin testing)
```
get_advisors { type: "security" }
get_logs { service: "storage" }
```

### Deliverable
Full CMS — manage all content without code changes.

---

## Phase 10: Content population (Day 22–24)

### Tasks
- [x] Add real categories (4–6)
- [x] Add services (4–6) with full descriptions
- [ ] Add web projects (3–6) with real client screenshots
- [ ] Add mobile apps (2–4) with APKs
- [x] Fill site_settings (hero, stats, social links)
- [x] Write About page copy
- [x] Optional: run seed SQL via MCP `execute_sql`

### Deliverable
Portfolio populated with real work samples.

---

## Phase 11: Polish & animations (Day 24–26)

### Tasks
- [x] Audit all 5-section pages — verify unique heading animation per section
- [x] Verify mouse cursor works on all public pages, disabled on admin/mobile
- [x] Page transition animations between routes
- [x] Loading skeletons for data fetching
- [x] Open Graph images / meta tags for all pages
- [x] Favicon + QuoreStack logo
- [x] Smooth scroll for anchor links

### Deliverable
Production-quality visual polish.

---

## Phase 12: Testing (Day 26–28)

See [08-testing-and-deployment.md](./08-testing-and-deployment.md) for full checklist.

### Critical paths to test
- [ ] Anonymous browse all public pages
- [ ] Signup → login → download APK → file installs on Android
- [ ] Admin CRUD all entities
- [ ] Contact form submission
- [ ] Detail page links from hub cards
- [ ] 404 pages
- [ ] Mobile responsive (no cursor, reduced animations)

### MCP checkpoint
```
get_advisors { type: "security" }
get_advisors { type: "performance" }
```

### Deliverable
All tests pass, advisors clean.

---

## Phase 13: Deployment (Day 28–30)

### Tasks
- [x] Push repo to GitHub
- [x] Connect Vercel project
- [ ] Set production env vars in Vercel
- [ ] Configure custom domain + SSL
- [ ] Update Supabase Auth redirect URLs for production domain
- [ ] Production smoke test
- [ ] Share link with a test client

### Deliverable
**QuoreStack live at your domain.**

---

## Phase 14: Post-launch (ongoing)

- [ ] Monitor `get_logs` weekly for errors
- [ ] Run `get_advisors` after any schema change
- [ ] Add new projects/apps via admin as you build them
- [ ] Optional: email notifications on contact submit (Edge Function)
- [ ] Optional: Google Analytics / Plausible
- [ ] Optional: Play Store links when console access available

---

## Progress tracker

Copy this to track your progress:

| Phase | Status | Date completed |
|-------|--------|----------------|
| 0 — Planning | ⬜ | |
| 1 — Supabase | ✅ | 2026-07-20 |
| 2 — Scaffold | ✅ | 2026-07-20 |
| 3 — Design system | ✅ | 2026-07-20 |
| 4 — Auth | ✅ | 2026-07-20 |
| 5 — Hub pages | ✅ | 2026-07-20 |
| 6 — Detail pages | ✅ | 2026-07-21 |
| 7 — Apps + download | ✅ | 2026-07-21 |
| 8 — Contact | ✅ | 2026-07-21 |
| 9 — Admin | ✅ | 2026-07-21 |
| 10 — Content | 🟨 Partial — real APKs/media needed | |
| 11 — Polish | ✅ | 2026-07-21 |
| 12 — Testing | 🟨 In progress | |
| 13 — Deploy | 🟨 Vercel configuration in progress | |
| 14 — Post-launch | ⬜ | |

---

## Quick reference: which doc to read when

| When you need... | Read |
|------------------|------|
| Brand/name decisions | 01 |
| Folder structure, env vars | 02 |
| Colors, fonts, animations | 03 |
| Page sections content | 04 |
| Supabase MCP commands | 05 |
| SQL migrations | 06 |
| What to build next | **07 (this doc)** |
| Testing & deploy | 08 |
