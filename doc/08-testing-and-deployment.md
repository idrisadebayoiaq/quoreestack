# 08 — Testing & Deployment

## Pre-deployment testing checklist

### Authentication
- [ ] Signup with new email creates `profiles` row
- [ ] Login with correct credentials succeeds
- [ ] Login with wrong password fails gracefully
- [ ] Logout clears session
- [ ] Protected download redirects to signup when logged out
- [ ] `?next=` redirect works after login
- [ ] Admin routes block non-admin users (redirect or 403)
- [ ] Admin routes accessible with admin account

### Public pages
- [ ] Home loads with 5 sections, each with distinct heading animation
- [ ] About loads with 5 sections
- [ ] Projects hub loads with 5 sections + project cards
- [ ] Services hub loads with 5 sections + service cards
- [ ] Categories hub loads with 5 sections + category cards
- [ ] Contact page loads (not forced to 5 sections)
- [ ] Apps hub loads with custom layout
- [ ] All nav links work
- [ ] Footer links and social icons work

### Detail pages
- [ ] `/projects/[slug]` renders full content from Supabase
- [ ] `/services/[slug]` renders full content
- [ ] `/categories/[slug]` shows filtered related content
- [ ] `/apps/[slug]` renders product-style detail page
- [ ] Invalid slug returns 404 page
- [ ] Related content sections show linked items
- [ ] SEO metadata correct (view page source)

### Apps & downloads
- [ ] App catalog shows published apps only
- [ ] Draft apps hidden from public
- [ ] Download button requires login
- [ ] Logged-in download returns signed URL
- [ ] Signed URL downloads valid APK file
- [ ] Download logged in `downloads` table
- [ ] Install instructions visible on app detail page
- [ ] Expired signed URL fails (test after 15 min)

### Admin panel
- [ ] Create category → appears on public site when published
- [ ] Edit service → changes reflect on detail page
- [ ] Upload project images → display correctly
- [ ] Upload app icon + screenshots → display correctly
- [ ] Upload APK → creates version, sets latest
- [ ] Replace APK with new version → old version archived
- [ ] Delete item → removed from public site
- [ ] Contact submissions visible in admin inbox
- [ ] Download analytics show in admin

### Contact form
- [ ] Validation errors show for empty/invalid fields
- [ ] Successful submit shows confirmation
- [ ] Submission appears in admin inbox
- [ ] Submission stored in `contact_submissions` table

### Design & animations
- [ ] Cyber cursor works on desktop public pages
- [ ] Cursor disabled on mobile / touch devices
- [ ] Cursor disabled on admin pages
- [ ] Each section heading animates on scroll into view
- [ ] 5 different animation types used per hub page
- [ ] `prefers-reduced-motion` disables heavy animations
- [ ] Page transitions work between routes
- [ ] No layout shift during animation load
- [ ] Glass cards, neon buttons, grid background render correctly

### Responsive
- [ ] Mobile (375px): all pages readable, nav works
- [ ] Tablet (768px): grids adapt
- [ ] Desktop (1280px+): full effects enabled
- [ ] Images responsive, no overflow

### Performance
- [ ] Lighthouse Performance ≥ 85 on Home
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Lighthouse SEO ≥ 90
- [ ] No console errors on any page
- [ ] Images use `next/image` with proper sizing

---

## Supabase security audit (MCP)

Run before every deploy:

```
MCP: get_advisors { type: "security" }
MCP: get_advisors { type: "performance" }
```

### Expected clean state
- All public tables have RLS enabled
- No tables exposed without policies
- `apks` bucket is private (no public SELECT policy)
- Edge Function has `verify_jwt: true`
- Service role key NOT in client bundle (grep codebase)

### Verify no secrets in repo
```bash
# Run locally before push
grep -r "service_role" src/
grep -r "SUPABASE_SERVICE" src/app/
# Should return nothing in client-side code
```

---

## Deployment: Vercel

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial QuoreStack portfolio"
git remote add origin https://github.com/<your-username>/quorestack.git
git push -u origin main
```

### Step 2 — Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import GitHub repository
3. Framework preset: **Next.js**
4. Root directory: `./`

### Step 3 — Environment variables (Vercel dashboard)

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://aztmrbygerrqkragsncz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | From MCP `get_publishable_keys` |
| `NEXT_PUBLIC_SITE_URL` | `https://quorestack.dev` |
| `NEXT_PUBLIC_BRAND_NAME` | `QuoreStack` |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase Dashboard (server only) |

### Step 4 — Supabase Auth redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

| Setting | Value |
|---------|-------|
| Site URL | `https://quorestack.dev` |
| Redirect URLs | `https://quorestack.dev/**`, `http://localhost:3000/**` |

### Step 5 — Custom domain
1. Vercel → Project → Settings → Domains
2. Add `quorestack.dev` (or your domain)
3. Configure DNS per Vercel instructions
4. SSL auto-provisioned

### Step 6 — Production smoke test
- [ ] Visit production URL
- [ ] Signup/login on production
- [ ] Download APK on production
- [ ] Submit contact form on production
- [ ] Admin panel works on production

---

## MCP post-deploy monitoring

Weekly or after issues:

```
MCP: get_logs { service: "auth" }
MCP: get_logs { service: "storage" }
MCP: get_logs { service: "edge-function" }
MCP: get_logs { service: "postgres" }
```

---

## Rollback plan

| Issue | Action |
|-------|--------|
| Bad deploy | Vercel → Deployments → Promote previous |
| Bad migration | Apply corrective migration via MCP (never delete migrations) |
| Auth broken | Check redirect URLs in Supabase dashboard |
| Downloads broken | Check Edge Function logs, verify APK path in DB |

---

## Launch checklist (final)

```
□ All Phase 12 tests pass
□ get_advisors security — no critical issues
□ Production env vars set
□ Auth redirect URLs configured
□ Custom domain + SSL active
□ Real content populated (≥ 2 projects, ≥ 1 app, ≥ 3 services)
□ Favicon and OG image set
□ robots.txt + sitemap.xml (optional: next-sitemap)
□ Privacy note on contact/signup (email collection)
□ Share test link with one person for feedback
□ Go live 🚀
```

---

## Optional enhancements (post-MVP)

| Feature | Effort | Notes |
|---------|--------|-------|
| Email on contact submit | Medium | Edge Function + Resend/SendGrid |
| Play Store link field | Low | Add column to `mobile_apps` |
| Blog / articles | Medium | New `posts` table |
| Dark/light toggle | Low | Cyber theme is dark-only by design |
| i18n | High | Multi-language support |
| TestFlight links | Low | External URL field for iOS |
| RSS feed | Low | For blog if added |
| Sitemap auto-generation | Low | `next-sitemap` package |
