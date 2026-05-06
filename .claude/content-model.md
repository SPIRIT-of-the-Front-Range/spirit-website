# Content Model & Editor Workflow

## How content flows

```
Editor opens admin.spiritofthefrontrange.org
  → Signs in with GitHub (via Cloudflare Workers OAuth proxy)
  → Sees Decap WYSIWYG admin UI
  → Edits a page or adds a steward bio
  → Hits "Publish" → Decap commits to main branch
  → GitHub Actions builds Astro site
  → Deploys to GitHub Pages
  → Live in ~1–2 minutes
```

The editor never sees code, never opens a terminal, never deals with markdown syntax (Decap renders it as a rich-text editor for body fields). All edits are commits — full audit trail in git history.

## Page-level content (`src/content/pages/`)

Each page in the sitemap has one markdown file with structured frontmatter + body copy. The Astro page template consumes the file and renders it inside the appropriate layout.

### `home.md`

```yaml
---
hero_eyebrow: "We care for the place we share."
hero_headline: "SPIRIT of the Front Range is mobilizing neighborhoods and organizations."
hero_subhead: "A bioregional backbone non-profit supporting local resilience and bioregional regeneration."
hero_panorama: "/images/front-range-panorama.svg"
mission_quote: "Our mutual relationship to where we live implies our mutual responsibility for that place."
mission_quote_attribution: "Benjamin Life"
show_donate_banner: true
featured_programs: [commons-teach-ins, solidarity-suppers, neighborhood-resiliency]
---

(Body copy — markdown — appears in the editorial section below the hero.)
```

### `mission.md`

```yaml
---
title: "Our Mission"
subtitle: "A more beautiful Front Range."
vision_statement: "Our vision is a remembering — remembering our embedded belonging to the living world."
strategy_statement: "Real connections in their organic form."
pillars: [allocation, coordination, belonging, culturing]
---

(Body copy explaining the mission, vision, and strategy in the org's voice.)
```

### `the-commons.md`

```yaml
---
title: "The Front Range Bioregional Commons"
relationship: "Spirit feeds and protects the Commons but does not control it."
external_link: "https://www.frontrangecommons.org/"
---

(Body copy — what is a bioregion, what is a commons, how Spirit relates to the Commons.)
```

### `donate.md`

```yaml
---
title: "Fund the Commons"
provider: "every.org"  # or "donorbox" / "open-collective"
provider_url: "https://www.every.org/spirit-of-the-front-range"
funding_cascade:
  - tier: "Spirit Operations"
    description: "Salaries, infrastructure, legal compliance for the 501(c)(3) backbone."
  - tier: "Common Steward Stipends"
    description: "Compensation for the people running day-to-day Commons operations."
  - tier: "Commons Grant Pool"
    description: "Quadratically-allocated funds for regenerative projects across the Front Range."
transparency_note: "At least 50% of total funds raised flow to programmatic disbursement."
---
```

(The `funding_cascade` field exposes the three-tier funding structure we agreed on in governance design — see `Spirit of the Front Range Governance Design Synthesis Apr 29 2026.md` §5.)

## Collections (multiple-entry content)

### Stewards (`src/content/stewards/`)

One `.md` file per team member.

```yaml
---
name: "Josie Siegel"
role: "Steward · Programming Circle Lead"
pronouns: "she/her"
photo: "/images/stewards/josie.jpg"
bio_short: "Josie weaves cultural programming and Solidarity Suppers across the Front Range."
order: 1
links:
  - label: "Email"
    url: "mailto:josie@..."
---

(Long-form bio in markdown.)
```

Decap exposes this as: a list view of stewards (drag-to-reorder), each opens a form with name/role/photo/bio fields.

### Programs (`src/content/programs/`)

One `.md` per program (CTI, Solidarity Suppers, Neighborhood Resiliency, Regenerative Project Allocation Rounds).

```yaml
---
title: "Commons Teach-Ins"
slug: "commons-teach-ins"
abbreviation: "CTI"
pillar: "culturing"
short_description: "Educate denizens on the historical, social, ecological, and cultural roots of 'the Commons'."
icon: "/images/icons/cti.svg"
status: "active"  # active | upcoming | concluded
next_event_date: "2026-06-15"
next_event_url: "https://..."
---

(Long-form description.)
```

### Catalog (`src/content/catalog/`) — the WEC-style index

This is the page that distinguishes the site. One `.md` per entry. Decap categorizes by `kind` and `pillar`.

```yaml
---
title: "The Patterning Instinct"
kind: "book"  # book | organization | tool | practice | place | podcast
author: "Jeremy Lent"
source: "https://..."
price: "$24.95"
year: 1998
image: "/images/catalog/patterning-instinct.jpg"
pillars: [belonging, culturing]
curator: "K Ma"
curator_note: "On how worldviews shape civilizations. Useful for understanding why 'the commons' isn't a policy proposal, it's a cosmology shift."
related: [the-commons-strategy, regenesis]
---

(Optional longer description.)
```

The catalog is the editorial heart — it positions Spirit as connective tissue, not just another non-profit. **Curation is editor work, not designer work.** The team needs to commit to seeding it with 20–30 entries at launch and growing from there.

## Decap CMS configuration sketch

`public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: spirit-of-the-front-range/website
  branch: main
  base_url: https://decap-oauth.spirit-frontrange.workers.dev  # Cloudflare OAuth proxy

media_folder: "public/images/uploads"
public_folder: "/images/uploads"

collections:
  - name: pages
    label: "Pages"
    files:
      - file: "src/content/pages/home.md"
        label: "Home"
        name: home
        fields:
          - { label: "Hero eyebrow", name: hero_eyebrow, widget: string }
          - { label: "Hero headline", name: hero_headline, widget: text }
          - # ... etc
      # ... one entry per page

  - name: stewards
    label: "Team Members"
    folder: "src/content/stewards"
    create: true
    fields:
      - { label: "Name", name: name, widget: string }
      - { label: "Role", name: role, widget: string }
      - { label: "Photo", name: photo, widget: image }
      - { label: "Bio (short)", name: bio_short, widget: text }
      - { label: "Bio (long)", name: body, widget: markdown }
      - { label: "Display order", name: order, widget: number }

  - name: catalog
    label: "Catalog Entries"
    folder: "src/content/catalog"
    create: true
    fields:
      - { label: "Title", name: title, widget: string }
      - label: "Kind"
        name: kind
        widget: select
        options: [book, organization, tool, practice, place, podcast]
      - { label: "Curator's note", name: curator_note, widget: text }
      # ... etc
```

The full schema is finalized during build step 4 (Decap setup). The principle: **every editor field maps to a known location in a template**, so editors can't accidentally break layout.

## Editor permissions & workflow

- **Editors authenticate via GitHub OAuth** — they need a GitHub account, but it's free
- **All edits go through `main`** for v1 (simple). If we need review workflow later, Decap supports an "editorial workflow" mode that creates PRs.
- **Image uploads** are committed to the repo at `public/images/uploads/` — keep file sizes reasonable (Astro's `<Image>` will optimize on build, but huge raw uploads bloat the repo). We'll set a soft limit of 2MB per image in editor docs.
- **No deletion of pages from Decap** — page-level files are pinned. New blog-style content (if we ever add it) goes through a folder collection where create/delete is allowed.

## Onboarding doc (to be written during build step 9)

A simple `EDITOR-GUIDE.md` lives at the repo root with:
- How to sign in
- How to edit an existing page
- How to add a new steward / program / catalog entry
- Image guidelines (size, aspect ratio, format)
- Voice & tone notes (cribbed from `aesthetic.md`)
- "If something looks broken" troubleshooting

This is the artifact non-technical collaborators reference, not the planning docs in `.claude/`.
