# Architecture

## The stack

| Layer | Choice | Notes |
|---|---|---|
| Site generator | **Astro** (latest) | Static output, content collections, "islands" architecture |
| Styling | **Tailwind CSS** + custom CSS for editorial set pieces | Tailwind for speed, hand-rolled CSS where it earns its weight |
| Content authoring | **Decap CMS** (formerly Netlify CMS) | Static admin page at `/admin/`, commits to GitHub via OAuth |
| Content storage | **Markdown + MDX + YAML** in `/content/` | Source of truth is git |
| Interactive islands | **React** (default) for components needing state; **vanilla JS** for tiny effects; **GSAP** + **Motion One** for animation; **Three.js / R3F** if we add 3D | Astro lets us pick per-island |
| Maps | **MapLibre GL** with a custom hand-drawn style, OR pure SVG for the bioregion map | Decide during build — SVG is more controllable visually |
| Smooth scroll | **Lenis** | Used selectively, not site-wide if it hurts accessibility |
| Hosting | **GitHub Pages** via GitHub Actions | Free, no vendor lock-in |
| Domain | `spiritofthefrontrange.org` (custom) | Configured via CNAME + GH Pages settings |
| Donations | **Every.org** (default) — link or embed | Decision still open; see PLAN.md |
| Newsletter | **Substack** embed | Already in use |
| Forms (contact, volunteer) | **Formspree** or **Tally** | Free tier suffices for v1 |
| Analytics | **Plausible** (optional) or none | Aligns with non-extractive ethos |
| Image handling | Astro's built-in `<Image>` (sharp-based) | Auto WebP/AVIF, responsive srcsets |
| Fonts | Self-hosted via `@fontsource/*` packages or local `.woff2` | No Google Fonts CDN — privacy + perf |

## Why Astro over the alternatives

The user's concern: "won't a markdown SSG feel bland like a wiki?" The answer is no, and the reasoning matters for future decisions:

**The SSG choice does not determine how the site looks or feels.** It determines how content is authored and how the site is built. The visual layer is CSS, components, and JS — all fully under our control regardless of SSG.

That said, here's the comparison we walked through:

- **Astro** — picks itself: zero JS by default (typography breathes), opt-in islands for interactivity, framework-agnostic (use React/Svelte/Three.js per island), first-class MDX, easy GH Pages deploy, excellent content collections API.
- **Next.js** — overkill for a static site, ships JS by default, "appy" feel by default, would fight us on the editorial register.
- **SvelteKit** — would be great but locks us into Svelte for islands; smaller ecosystem for the libraries we want (R3F, etc).
- **Eleventy** — most editorial-feeling but more glue code for any interactive island; we'd be hand-rolling the parts Astro gives us.

## Why Decap CMS

- **Frontend-agnostic** — just edits files in `/content/`, doesn't care that we use Astro
- **Free, open-source, self-contained** — runs as a static admin page, no server
- **Git-based** — every edit is a commit, full history, no proprietary database
- **GitHub OAuth** — editors sign in with GitHub, but never see code (admin UI is WYSIWYG)
- **Configurable schema** — we define exactly what fields each page/collection has, so editors fill in structured forms instead of free-text-everywhere

**The one gotcha:** Decap needs an OAuth proxy because GitHub doesn't allow client-side OAuth for security reasons. Two options:
- **Netlify Identity** (free, easy, one-click — but ties us to Netlify for auth even though hosting stays GH Pages)
- **Self-hosted OAuth proxy** on Cloudflare Workers (free tier, ~30 lines of code, no third-party dep)

Decision: start with Cloudflare Workers OAuth proxy for ideological consistency (no Netlify), but Netlify Identity is the fallback if the Workers route hits friction.

## Why GitHub Pages

- **Free, predictable, no vendor lock**
- **Git push = deploy** with GitHub Actions
- **Custom domain support** built-in
- **Tradeoff:** static-only — no server-side anything. For v1 marketing site that's fine. If we later need member portals, gated content, DAO-integrated voting, etc., we'd migrate to Cloudflare Pages or Vercel (both also support Astro and would be drop-in upgrades).

## Folder structure (target)

```
spirit-website/
├── .claude/                         # planning docs (this folder)
├── .github/workflows/deploy.yml     # GH Actions: build + deploy on push
├── public/                          # static assets served as-is (favicon, CNAME, admin/)
│   ├── admin/
│   │   ├── index.html               # Decap CMS shell
│   │   └── config.yml               # Decap collection definitions
│   └── fonts/
├── src/
│   ├── components/                  # reusable Astro/React components
│   │   ├── editorial/               # Pillar, Marginalia, CatalogEntry, etc.
│   │   ├── interactive/             # PanoramaHero, PillarWeave, BioregionMap (islands)
│   │   └── primitives/              # Button, Link, Section
│   ├── content/                     # CONTENT (edited by humans, structured by collections)
│   │   ├── pages/                   # markdown for each page's body copy
│   │   ├── stewards/                # one .md per team member
│   │   ├── programs/                # one .md per program
│   │   └── catalog/                 # one .md per catalog entry
│   ├── content.config.ts            # Astro content collection schemas (Zod)
│   ├── layouts/                     # page shells (Default, Editorial, Catalog)
│   ├── pages/                       # routes (one .astro per /url)
│   │   ├── index.astro
│   │   ├── mission.astro
│   │   ├── programs.astro
│   │   ├── the-commons.astro
│   │   ├── stewards.astro
│   │   ├── catalog.astro
│   │   ├── donate.astro
│   │   └── connect.astro
│   ├── styles/                      # global CSS + design tokens
│   │   ├── tokens.css               # palette, type scale, spacing
│   │   ├── reset.css
│   │   └── global.css
│   └── lib/                         # helpers (formatters, etc.)
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Build & deploy

- `npm run dev` — local dev server with HMR
- `npm run build` — produce static `dist/` for deploy
- `npm run preview` — serve `dist/` locally for verification
- GH Actions workflow watches `main`, builds, deploys to `gh-pages` branch (or uses Pages' new "build from Actions" mode)
- Editor commits via Decap → workflow runs → site updates within ~1–2 min

## Performance budget

- **Lighthouse Performance ≥ 95** on home page
- **First Contentful Paint < 1.0s** on 4G
- **No layout shift** on hero
- **Total JS shipped < 100kb** on pages without 3D islands; ≤ 250kb where the bioregion map / 3D scene loads
- **Images:** AVIF with WebP fallback, lazy-loaded below the fold
- **Fonts:** subset, preload critical weights, `font-display: swap`

## Accessibility commitments

- WCAG 2.1 AA at minimum
- All interactive moments have **reduced-motion alternatives** (respect `prefers-reduced-motion`)
- All copy reaches AAA contrast on body text, AA on display
- Semantic HTML first; ARIA only where semantic HTML can't express intent
- Keyboard-navigable everywhere; visible focus rings tuned to the design palette
