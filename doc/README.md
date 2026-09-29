# QuoreStack — Implementation Documentation

> **Brand:** QuoreStack  
> **Owner:** Quoreeb Adebayo — Full Stack Developer  
> **Backend:** Supabase (`aztmrbygerrqkragsncz`)  
> **Repo:** `denstore`

## Current work: public redesign

The site structure is already built. The next effort is a full visual rebuild plus the content and trust fixes from the September 2026 review. Follow these two documents. Do not restyle from `03` or re-sequence from `07`.

| Doc | Purpose |
|-----|---------|
| [09 — Redesign analysis report](./09-redesign-analysis-report.md) | What the review got right, what the code already does, design direction (Atelier), and where Three.js should and should not go |
| [10 — Redesign implementation plan](./10-redesign-implementation-plan.md) | Step-by-step phases. Start at Phase 0. Do not build until that phase’s checks pass |

Documents `01`–`08` below are the original cyber-realistic build plan. They remain as history for schema, routes, and deployment.

---

This folder also contains the original implementation plan for the QuoreStack portfolio platform — a cyber-realistic full-stack developer portfolio with gated APK downloads, dynamic content, and an admin CMS.

---

## Brand decision

| Option | Name | Best for |
|--------|------|----------|
| **Recommended** | **QuoreStack** | Memorable, tech-forward, signals full-stack; works with cyber aesthetic |
| Alternative | Quoreeb Nexus | Personal name + futuristic feel |
| Alternative | QuoreForge | Emphasizes building/crafting |
| Formal | Quoreeb Adebayo Dev | Maximum personal branding |

**Use:** **QuoreStack** as the primary brand  
**Subtitle:** *Full Stack Development by Quoreeb Adebayo*  
**Suggested domain:** `quorestack.dev` or `quorestack.io`

---

## Document index

| # | Document | Purpose |
|---|----------|---------|
| 01 | [Brand & Project Overview](./01-brand-and-overview.md) | Vision, goals, user roles, success criteria |
| 02 | [Architecture & Tech Stack](./02-architecture-and-stack.md) | Frontend, backend, folder structure, env vars |
| 03 | [Cyber-Realistic Design System](./03-design-system-cyber-realistic.md) | Colors, typography, animations, mouse effects |
| 04 | [Page Structure & Sections](./04-page-structure-and-sections.md) | Every route, 5-section rule, detail pages |
| 05 | [Supabase MCP Playbook](./05-supabase-mcp-playbook.md) | Step-by-step MCP tool usage for all Supabase work |
| 06 | [Database Schema & Migrations](./06-database-schema-and-migrations.md) | Tables, RLS, storage buckets, SQL migrations |
| 07 | [Implementation Phases (Start → End)](./07-implementation-phases.md) | **Main timeline — follow this day by day** |
| 08 | [Testing & Deployment](./08-testing-and-deployment.md) | QA checklist, Vercel deploy, go-live |
| 09 | [Redesign analysis report](./09-redesign-analysis-report.md) | Review verdict, content gaps, Atelier direction, animation placement |
| 10 | [Redesign implementation plan](./10-redesign-implementation-plan.md) | **Follow this for the redesign — phase by phase** |

---

## Quick start

**Redesign (current):** read **09**, then follow **10** from Phase 0. Use **05** for any Supabase migration, and run `get_advisors` after it.

**Original build (already shipped):** **01** and **04** for scope, **07** for the old timeline, **03** for the cyber theme that the redesign replaces.

---

## Supabase project (current state)

| Item | Value |
|------|-------|
| Project URL | `https://aztmrbygerrqkragsncz.supabase.co` |
| Tables | None yet (greenfield) |
| Migrations | None yet |
| MCP config | `.cursor/mcp.json` |

---

## Page count summary

| Page type | Section rule |
|-----------|--------------|
| Home, About, Projects, Services, Categories (hub) | **5 sections each** |
| Contact | **Flexible** (hero + form + info — not forced to 5) |
| Apps hub & App detail | **Custom layout** (full product-style detail) |
| Detail pages (`/projects/[slug]`, `/services/[slug]`, `/categories/[slug]`) | **Full detail** case-study layout |
