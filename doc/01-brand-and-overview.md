# 01 — Brand & Project Overview

## Project name: QuoreStack

**QuoreStack** blends your first name (*Quoreeb*) with *Stack*, signaling full-stack engineering. It is short, brandable, domain-friendly, and fits a cyber-realistic visual identity.

- **Legal / footer name:** Quoreeb Adebayo
- **Title:** Full Stack Developer
- **Tagline options:**
  - *Building digital systems from interface to infrastructure.*
  - *Full stack. Full send.*
  - *Code the core. Ship the stack.*

---

## What you're building

A personal portfolio website that doubles as:

1. **Professional showcase** — web projects, services, tech categories
2. **Mobile app distribution hub** — clients browse apps publicly; APK download requires signup
3. **Admin CMS** — you upload/manage all content without redeploying

---

## User roles

| Role | Description | Capabilities |
|------|-------------|--------------|
| **Visitor** | Anonymous user | Browse portfolio, view app catalog |
| **Registered user** | Signed-up client/visitor | Download APKs, optional profile |
| **Admin** | You (Quoreeb) | CRUD all content, upload APKs, view analytics |

---

## Core features

### Public portfolio
- Cyber-realistic UI with animated section headings (unique animation per section)
- Custom mouse cursor / trail effects
- Home, About, Projects, Services, Categories — each with 5 sections
- Click-through to **full detail pages** for projects, services, and categories

### Apps (different layout)
- `/apps` — catalog hub (not limited to 5 generic sections)
- `/apps/[slug]` — rich product page: gallery, features, tech stack, version, install guide, download CTA

### Auth-gated downloads
- Signup/login required before APK download
- Signed URLs (short-lived) via Supabase Edge Function
- Download event logging

### Admin panel
- Protected `/admin` routes
- Manage projects, services, categories, apps
- Upload images, icons, screenshots, APK files

---

## Success criteria (definition of done)

- [ ] All public pages live with cyber-realistic design and animations
- [ ] Each hub page has exactly 5 distinct sections with unique heading animations
- [ ] Project, service, and category detail pages render full CMS content
- [ ] Apps section has custom layout with gated download flow
- [ ] Admin can CRUD all entities without touching code
- [ ] RLS enabled on all tables; `get_advisors` security check passes
- [ ] Site deployed on custom or Vercel domain with HTTPS
- [ ] Contact form stores submissions in Supabase

---

## Non-goals (MVP)

- Play Store integration (add later as external link field)
- Payment / invoicing
- Multi-admin teams
- Native mobile app for the portfolio itself
- iOS IPA distribution (Android APK only for MVP)

---

## Content you'll need to prepare

| Asset | Quantity (start) |
|-------|------------------|
| Professional headshot / avatar | 1 |
| Web project screenshots | 3–6 projects |
| App icons + screenshots | 2–4 apps |
| APK files | Same as apps |
| Service descriptions | 4–6 services |
| Category definitions | 4–6 (e.g. Web Apps, Mobile, APIs, UI/UX) |
| Bio / about copy | 1–2 paragraphs |
| Social links | GitHub, LinkedIn, Twitter/X, email |
