# QuoreStack — Implementation Documentation

> **Brand:** QuoreStack  
> **Owner:** Quoreeb Adebayo — Full Stack Developer  
> **Backend:** Supabase (`aztmrbygerrqkragsncz`)  
> **Repo:** `denstore`

This folder contains the complete implementation plan for the QuoreStack portfolio platform — a cyber-realistic full-stack developer portfolio with gated APK downloads, dynamic content, and an admin CMS.

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

---

## Quick start

1. Read **01** and **04** to understand scope.
2. Follow **07** phase by phase.
3. For every Supabase task, use **05** (MCP tools — do not guess SQL in production without migrations).
4. Apply design rules from **03** as you build each page.
5. Run security checks from **05** (`get_advisors`) after each migration.

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
