# 04 — Page Structure & Sections

## Site map

```
/                           Home (5 sections)
/about                      About (5 sections)
/projects                   Projects hub (5 sections)
/projects/[slug]            Project detail (full)
/services                   Services hub (5 sections)
/services/[slug]            Service detail (full)
/categories                 Categories hub (5 sections)
/categories/[slug]          Category detail (full)
/apps                       Apps hub (custom)
/apps/[slug]                App detail (full + download)
/contact                    Contact (flexible)
/login                      Auth
/signup                     Auth
/admin                      Admin dashboard
/admin/projects             CRUD
/admin/services             CRUD
/admin/categories           CRUD
/admin/apps                 CRUD + APK upload
/admin/contacts             View submissions
/admin/downloads            Download analytics
```

---

## Global layout

**Header nav:** Home · About · Projects · Services · Categories · Apps · Contact · Login

**Footer:** QuoreStack © · Quoreeb Adebayo · Social links · "Built with Next.js & Supabase"

---

## Home `/` — 5 sections

| # | Section ID | Heading animation | Content |
|---|------------|-------------------|---------|
| 1 | `hero` | glitch-reveal | Name, tagline, CTA buttons (View Work · Download Apps) |
| 2 | `stats` | slide-mask | Years experience, projects shipped, apps built, technologies |
| 3 | `featured-services` | typewriter | 3–4 service cards → link to `/services/[slug]` |
| 4 | `featured-projects` | split-chars-rise | 3 featured web projects → `/projects/[slug]` |
| 5 | `cta` | neon-flicker | Hire me / Contact + marquee tech stack |

---

## About `/about` — 5 sections

| # | Section | Animation | Content |
|---|---------|-----------|---------|
| 1 | `intro` | glitch-reveal | Photo, bio, location, availability |
| 2 | `journey` | slide-mask | Timeline / career story |
| 3 | `skills` | typewriter | Skill categories with progress or tags |
| 4 | `tools` | split-chars-rise | Tech stack grid (React, Node, Supabase, etc.) |
| 5 | `values` | neon-flicker | Work philosophy, what you offer clients |

---

## Projects hub `/projects` — 5 sections

| # | Section | Animation | Content |
|---|---------|-----------|---------|
| 1 | `hero` | glitch-reveal | "Selected Work" intro |
| 2 | `filters` | slide-mask | Category pills → link to `/categories/[slug]` |
| 3 | `grid` | typewriter | All project cards (click → detail) |
| 4 | `process` | split-chars-rise | How you deliver projects (discovery → deploy) |
| 5 | `cta` | neon-flicker | Start a project → `/contact` |

### Project detail `/projects/[slug]` — full page

| Block | Fields from CMS |
|-------|---------------|
| Hero | Title, client type, year, hero image |
| Overview | Long description, role, duration |
| Gallery | Image carousel |
| Tech stack | Tags + explanation |
| Live links | Demo URL, GitHub (if public) |
| Results | Metrics / outcomes |
| Related | Other projects in same category |

---

## Services hub `/services` — 5 sections

| # | Section | Animation | Content |
|---|---------|-----------|---------|
| 1 | `hero` | glitch-reveal | "What I Build" |
| 2 | `overview` | slide-mask | Brief intro to service offerings |
| 3 | `service-grid` | typewriter | Service cards → `/services/[slug]` |
| 4 | `workflow` | split-chars-rise | Engagement process steps |
| 5 | `cta` | neon-flicker | Get a quote → `/contact` |

### Service detail `/services/[slug]` — full page

| Block | Content |
|-------|---------|
| Hero | Service name, icon, short pitch |
| Description | Full service explanation |
| Deliverables | Bullet list |
| Technologies used | Stack tags |
| Pricing note | "Starting from" or "Custom quote" |
| Related projects | Projects that used this service |
| CTA | Contact button |

**Example services:**
- Full Stack Web Development
- Mobile App Development (Android)
- API & Backend Development
- UI/UX Implementation
- Database Design & Supabase Integration
- MVP / Prototype Development

---

## Categories hub `/categories` — 5 sections

Categories group projects, services, and apps by domain.

| # | Section | Animation | Content |
|---|---------|-----------|---------|
| 1 | `hero` | glitch-reveal | "Explore by Category" |
| 2 | `category-grid` | slide-mask | Category cards → `/categories/[slug]` |
| 3 | `popular` | typewriter | Most viewed / featured category highlight |
| 4 | `cross-link` | split-chars-rise | How categories map to services |
| 5 | `cta` | neon-flicker | Browse all projects |

### Category detail `/categories/[slug]` — full page

| Block | Content |
|-------|---------|
| Hero | Category name, description, icon |
| Stats | Count of projects, apps, services in category |
| Projects | Filtered project list |
| Apps | Filtered app list (if any) |
| Services | Related services |
| Description | Long-form category explanation |

**Example categories:**
- E-Commerce
- FinTech
- Health & Wellness
- Education
- SaaS / Dashboards
- Mobile Utilities

---

## Apps hub `/apps` — CUSTOM layout (not 5 sections)

| Block | Description |
|-------|-------------|
| Featured hero | Spotlight one app with mockup |
| Search / filter | By category or tag |
| App grid | Cards: icon, name, short desc, version badge |
| Trust strip | "Sign up to download" + install note |
| FAQ | Android sideload instructions summary |

### App detail `/apps/[slug]` — full product page

| Block | Content |
|-------|---------|
| Hero | Icon, name, tagline, version, size, updated date |
| Screenshots | Swipeable gallery |
| Description | Full markdown description |
| Features | Feature list with icons |
| Tech stack | Flutter, React Native, Kotlin, etc. |
| Requirements | Min Android version |
| Install guide | Step-by-step sideload |
| Download CTA | **Login gate** → signed APK URL |
| Changelog | Version history |
| Related apps | Suggestions |

---

## Contact `/contact` — flexible (NOT 5 sections)

| Block | Content |
|-------|---------|
| Hero | Short headline |
| Form | name, email, subject, message, service interest dropdown |
| Info sidebar | Email, social, response time |

Form submission → `contact_submissions` table in Supabase.

---

## Auth pages

| Page | Notes |
|------|-------|
| `/login` | Email + password; link to signup; redirect `?next=` param |
| `/signup` | Email, password, full name; email confirm optional |

Cyber-styled minimal forms — centered glass panel.

---

## Admin pages

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard stats (counts, recent downloads) |
| `/admin/projects` | List + create/edit |
| `/admin/services` | List + create/edit |
| `/admin/categories` | List + create/edit |
| `/admin/apps` | List + create/edit + APK upload |
| `/admin/contacts` | Read-only inbox |
| `/admin/downloads` | Download log table |

Admin UI: cleaner, less animation — prioritize function.

---

## Click-through rules

| From | Click target | Goes to |
|------|--------------|---------|
| Project card | entire card or "View" | `/projects/[slug]` |
| Service card | entire card | `/services/[slug]` |
| Category card | entire card | `/categories/[slug]` |
| App card | entire card | `/apps/[slug]` |
| Category pill on projects | pill | `/categories/[slug]` |
| Download button | CTA | Auth check → download flow |

**Never** use modals for full detail — always dedicated pages (better SEO, shareable URLs).

---

## SEO metadata per page type

| Page | `title` pattern |
|------|-----------------|
| Home | `QuoreStack — Full Stack Developer` |
| Project | `{title} — Project | QuoreStack` |
| Service | `{title} — Services | QuoreStack` |
| Category | `{title} — Category | QuoreStack` |
| App | `{title} — App | QuoreStack` |

Use `generateMetadata` in Next.js with Supabase data.
