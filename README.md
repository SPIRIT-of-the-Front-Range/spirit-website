# SPIRIT of the Front Range — Website

A custom Astro + Decap CMS site for [Spirit of the Front Range](https://www.spiritofthefrontrange.org/), a bioregional backbone non-profit on the Colorado Front Range.

**Aesthetic:** Whole Earth Catalog (1970s editorial, marginalia, "Access to Tools" catalog) crossed with the Front Range landscape (sage / grass / creek / clay palette).
**Stack:** Astro 5 · Tailwind CSS 4 · Decap CMS · GitHub Pages
**Planning docs:** see `.claude/PLAN.md`, `.claude/architecture.md`, `.claude/aesthetic.md`, `.claude/content-model.md`.

---

## Run locally

```sh
npm install
npm run dev        # development at http://localhost:4321
npm run build      # production build → ./dist
npm run preview    # serve the production build locally
```

Node 22+ recommended. Built and verified on Node 25.

## Project structure

```
src/
├── components/
│   ├── primitives/        Mark, Header, Footer
│   ├── editorial/         Pillar, CatalogEntry, StewardCard, PullQuote, …
│   └── interactive/       PanoramaHero, PillarWeave, BioregionMap (SVG)
├── content/
│   ├── stewards/          one .md per team member
│   ├── programs/          one .md per program
│   └── catalog/           one .md per catalog entry
├── layouts/Base.astro
├── pages/                 one .astro per route
└── styles/global.css      design tokens + base + utilities

public/
├── admin/                 Decap CMS (config.yml + index.html shell)
├── images/                community photos, illustrations, uploads
├── CNAME                  custom domain
└── favicon.svg

.github/workflows/
└── deploy.yml             GitHub Actions → GitHub Pages
```

## Editing content via the CMS

The site uses **Decap CMS** for non-technical editing. Editors can edit Stewards, Programs, and Catalog Entries through a Google-Docs-style WYSIWYG that commits markdown back to git.

### Local CMS dev (no auth needed)

```sh
npm run dev      # one terminal — site at http://localhost:4321
npm run cms      # another terminal — Decap proxy server
```

Then open **http://localhost:4321/admin/index.html** — works immediately, no GitHub auth required.

### CMS — production OAuth setup (one-time)

For the live CMS at `https://www.spiritofthefrontrange.org/admin/` to work, you need a GitHub OAuth App + a small auth proxy. The simplest path:

1. **Create a GitHub OAuth App**: GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - Application name: `SPIRIT CMS`
   - Homepage URL: `https://www.spiritofthefrontrange.org`
   - Authorization callback URL: `https://decap-oauth.YOUR-WORKER.workers.dev/callback` (you'll create this in step 2)
   - Save the `Client ID` and generate a `Client secret`.

2. **Deploy a Cloudflare Workers OAuth proxy** (free, ~30 lines): see [the Decap docs](https://decapcms.org/docs/external-oauth-clients/). The official template is at https://github.com/sterlingwes/cloudflare-decap-cms-oauth.
   - Set `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` env vars to the values from step 1.

3. **Update `public/admin/config.yml`**: uncomment the `base_url` line and point it at your Worker URL:
   ```yaml
   backend:
     name: github
     repo: SPIRIT-of-the-Front-Range/spirit-website
     branch: main
     base_url: https://decap-oauth.YOUR-WORKER.workers.dev
   ```

4. **Remove `local_backend: true`** from `config.yml` (keep it only if you want both local and prod working from same config).

Editable collections:
- **Stewards** — team bios, roles, email
- **Programs** — Commons Teach-Ins, Solidarity Suppers, etc.
- **Catalog** — bioregional resources index

Workflow: editor opens admin → fills in form → publishes → a PR is opened on GitHub → maintainer merges → GH Actions rebuilds and deploys the site (~90s).

## TODOs before public launch

1. Configure CMS OAuth proxy (above)
2. Update `everyOrgUrl` in `src/pages/donate.astro` once Every.org page is live; flip `everyOrgReady = true`
3. Update `<form action>` in `src/pages/connect.astro` to a real Formspree endpoint
4. Confirm `public/CNAME` matches your final custom domain
5. In GitHub repo Settings → Pages: set Source to "GitHub Actions"

## Deploy

The `.github/workflows/deploy.yml` workflow builds and deploys to GitHub Pages automatically on push to `main`. To enable:

1. In GitHub: **Settings → Pages → Source: GitHub Actions**
2. Push to `main` — the site builds and deploys in ~90 seconds
3. Set up the custom domain in **Settings → Pages → Custom domain** (matches the `public/CNAME` file)

## Design system

All design tokens live in `src/styles/global.css` under `@theme`:

- **Colors:** `bone`, `bone-deep`, `ink`, `shadow`, `grass`, `sage`, `creek`, `clay`, `sky`, `rule` (each + `-deep` variant). Available as Tailwind classes (`bg-bone`, `text-clay-deep`, etc.).
- **Type:** `font-display` (Bricolage Grotesque), `font-body` (Public Sans), `font-serif` (Fraunces), `font-mono` (JetBrains Mono). Self-hosted via @fontsource.
- **Type scale:** fluid (clamp-based), `text-display-xl` down to `text-micro`.
- **Editorial utilities:** `.eyebrow`, `.dropcap`, `.marginalia`, `.paper`, `.pullquote`, `.catalog-entry`, `.rule`, `.rule-double`, `.rule-bold`, `.num-badge`, etc.

See `.claude/aesthetic.md` for the full direction (palette logic, motion principles, "deliberately avoid" list).
