# 03 — Cyber-Realistic Design System

## Design direction: Cyber-Realistic

A blend of **cyberpunk aesthetics** with **real-world professionalism** — dark, neon-accented, grid-heavy, glass panels, scanlines (subtle), but still readable and client-friendly (not chaotic).

Think: *Tron meets modern dev portfolio* — credible for hiring clients, visually distinctive for brand recall.

---

## Color palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0a0e17` | Page background |
| `--bg-secondary` | `#111827` | Cards, sections |
| `--bg-glass` | `rgba(17, 24, 39, 0.6)` | Glassmorphism panels |
| `--neon-cyan` | `#00f0ff` | Primary accent, links, glow |
| `--neon-magenta` | `#ff00aa` | Secondary accent |
| `--neon-green` | `#39ff14` | Success, "online" indicators |
| `--text-primary` | `#e5e7eb` | Body text |
| `--text-muted` | `#9ca3af` | Secondary text |
| `--border-glow` | `rgba(0, 240, 255, 0.3)` | Card borders |
| `--grid-line` | `rgba(0, 240, 255, 0.06)` | Background grid |

### CSS variables (add to `globals.css`)

```css
:root {
  --bg-primary: #0a0e17;
  --bg-secondary: #111827;
  --neon-cyan: #00f0ff;
  --neon-magenta: #ff00aa;
  --neon-green: #39ff14;
  --font-display: 'Orbitron', sans-serif;
  --font-body: 'Rajdhani', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / headings | **Orbitron** | 600–900 | Futuristic, geometric |
| Body | **Rajdhani** | 400–600 | Clean, readable |
| Code / labels | **JetBrains Mono** | 400 | Tags, version numbers |

Load via `next/font/google`.

---

## Visual elements

### Background layers (every page)
1. **Base:** solid `--bg-primary`
2. **Grid:** CSS repeating linear-gradient (perspective optional)
3. **Noise overlay:** low-opacity PNG or CSS noise (3–5%)
4. **Ambient glow orbs:** blurred cyan/magenta circles (fixed, pointer-events: none)
5. **Optional scanlines:** `repeating-linear-gradient` at 2% opacity

### Cards & panels
- `backdrop-blur-md` + semi-transparent bg
- 1px border with gradient or cyan glow on hover
- Corner accents (small L-shaped borders — cyber HUD feel)
- Hover: slight scale `1.02`, border glow intensifies

### Buttons
| Variant | Style |
|---------|-------|
| Primary | Cyan fill, dark text, glow shadow |
| Secondary | Transparent, cyan border |
| Ghost | Text only, underline on hover |
| Danger | Magenta accent (admin delete) |

---

## Section heading animations (required)

**Rule:** Each of the 5 sections on a hub page MUST use a **different** heading animation variant.

Assign animations by section index (rotate through variants):

| Section # | Animation name | Behavior |
|-----------|----------------|----------|
| 1 | `glitch-reveal` | Text glitches in with RGB split, settles |
| 2 | `slide-mask` | Heading slides up from behind a horizontal mask |
| 3 | `typewriter` | Characters appear one by one with blinking cursor |
| 4 | `split-chars-rise` | Each letter rises from below with stagger |
| 5 | `neon-flicker` | Opacity flicker then stable glow |

### Implementation pattern

```tsx
// components/animations/SectionHeading.tsx
const variants = {
  'glitch-reveal': { /* framer motion variants */ },
  'slide-mask': { /* ... */ },
  'typewriter': { /* GSAP or motion */ },
  'split-chars-rise': { /* split text per char */ },
  'neon-flicker': { /* keyframes */ },
};

export function SectionHeading({
  title,
  animation,
  index,
}: {
  title: string;
  animation: keyof typeof variants;
  index: 1 | 2 | 3 | 4 | 5;
}) {
  // Use useInView (Intersection Observer) — animate once when scrolled into view
}
```

**Libraries:**
- `framer-motion` — primary for reveal animations
- `gsap` + `@gsap/react` + `ScrollTrigger` — scroll-linked parallax on sections
- Split text manually or use `split-type` package

**Accessibility:**
- Respect `prefers-reduced-motion`: fall back to simple fade-in
- Keep headings as semantic `<h2>` — animation wraps inner spans only

---

## Mouse animation (required)

### Layer 1: Custom cursor
- Hide default cursor on desktop (`cursor: none` on `body`)
- Render custom cursor component:
  - Outer ring (slow follow, cyan stroke)
  - Inner dot (instant follow, solid cyan)
  - Scale up on hover over links/buttons
  - Magenta pulse on clickable cards

### Layer 2: Cursor trail (optional, performance-aware)
- Canvas or CSS: 8–12 trailing particles fading out
- Disable on mobile/touch (`pointer: coarse` media query)

### Layer 3: Interactive glow
- Radial gradient follows mouse position on page background
- Update via `mousemove` with `requestAnimationFrame` throttling

```tsx
// components/animations/CyberCursor.tsx
'use client';
// - useEffect for mousemove
// - Render fixed position divs
// - Cleanup on unmount
// - Skip if prefers-reduced-motion or touch device
```

**Package alternative:** `cursor-effects` or build custom — custom preferred for brand uniqueness.

---

## Page transition animation

- Route change: brief scan-line wipe or fade (200–300ms)
- Use `template.tsx` in Next.js app router with Framer Motion `AnimatePresence`

---

## Component checklist

| Component | Location |
|-----------|----------|
| `CyberCursor` | Root layout (public routes only) |
| `SectionHeading` | All 5-section hub pages |
| `GlowCard` | Project/Service/Category cards |
| `NeonButton` | CTAs |
| `GridBackground` | Layout wrapper |
| `PageTransition` | `template.tsx` |
| `StatCounter` | Home section (animated count-up) |
| `MarqueeStrip` | Optional footer tech stack ticker |

---

## Apps page — different visual treatment

Apps section uses **product showcase** layout rather than 5 equal sections:

- **Hero banner** — featured app with device mockup
- **Filter bar** — categories/tags
- **App grid** — large cards with icon + screenshot
- **Detail page sections:**
  1. Hero (icon, name, version, download CTA)
  2. Screenshot gallery (carousel)
  3. Features list
  4. Tech stack & architecture
  5. Install instructions (Android sideload steps)
  6. Changelog / version history (optional)
  7. Related apps

Still uses cyber styling but information-dense like an app store listing.

---

## Contact page — simplified layout

Not forced to 5 sections. Suggested structure:

1. **Hero** — "Let's build something"
2. **Contact form** — name, email, message, project type
3. **Direct links** — email, social, availability note

---

## Responsive breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `< 768px` | Disable custom cursor; reduce animations; stack sections |
| `768–1024px` | 2-column grids |
| `> 1024px` | Full effects enabled |

---

## Design reference keywords

Use these when generating assets or reviewing UI:

> Dark UI · Neon cyan accents · Glassmorphism · HUD corners · Grid floor · Glow borders · Monospace labels · Hex patterns · Data streams · Holo cards

---

## Figma / mood board (optional)

Before coding Phase 3, sketch:
- Home hero wireframe
- One hub page with 5 labeled sections
- One detail page (project)
- App detail page
- Color swatches + font samples
