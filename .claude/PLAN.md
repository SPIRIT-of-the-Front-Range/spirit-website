# Spirit of the Front Range — Website Plan

**Status:** Approved — building v1 (May 2026)
**Replacing:** Squarespace site at spiritofthefrontrange.org
**Deployment target:** GitHub Pages (custom domain)

## Why we're building this

The current Squarespace site is generic and doesn't reflect the voice or aesthetic of a bioregional non-profit. We are ethically opposed to relying on Squarespace as a platform. The new site needs to:

1. Feel **exquisite, editorial, and interactive** — not like a wiki, not like a SaaS template
2. Channel the aesthetic of the **Whole Earth Catalog** (editorial structure, "Access to Tools" energy) crossed with the **Front Range** (muted earth-tone palette, hand-drawn maps, reverence for place)
3. Be **editable by non-technical collaborators** through a Google-Docs-style interface
4. Stay **free of vendor lock-in** — git as source of truth, GitHub Pages for hosting, no proprietary CMS database

## Architecture (one-line summary)

**Astro** for the frontend + **Decap CMS** for content editing + **GitHub Pages** for hosting + linked third parties (Every.org/Donorbox, Substack, Formspree) for transactional pieces.

See `architecture.md` for the full stack, why each choice was made, and what the alternatives were.

## Aesthetic (one-line summary)

Two reference axes held in tension: **Whole Earth Catalog** (editorial structure, dense type, marginalia, "tools" catalog) and **Front Range** (sage/grass/creek/clay palette, hand-drawn topography, generous whitespace, paper grain).

See `aesthetic.md` for palette, typography directions, motion principles, and the "deliberately avoid" list.

## Sitemap (8 pages)

```
/                Home
/mission         Vision · Mission · Strategy (combined)
/programs        Four pillars + program cards
/the-commons     Front Range Bioregional Commons explainer
/stewards        Team bios
/catalog         ★ WEC-style index of bioregional resources (the distinctive page)
/donate          Fund the Commons
/connect         Contact + newsletter + podcast
```

See `content-model.md` for the per-page content schema and how Decap exposes each page to editors.

## Build sequence

1. **Aesthetic proof:** scaffold Astro project + build home hero + first scroll section + one interactive moment. User reviews on a deployed preview before committing to full build.
2. **Foundation:** finalize design system (tokens, type, motion primitives) → component library
3. **Content collections + pages:** wire up content schemas, build each page template
4. **Decap CMS:** configure `admin/` route, define collections, test full editor flow
5. **Interactive set pieces:** Front Range panorama hero, four-pillar weaving, bioregion map, catalog hover-marginalia
6. **Donations + forms:** integrate Every.org or Donorbox + Formspree
7. **GH Actions deploy:** automate build → deploy on push to `main`, set up custom domain
8. **Content migration:** port existing Squarespace copy into the new templates
9. **Editor onboarding:** walk team through Decap, document common edits

## Open decisions (need user input before/during build)

- **Typography direction:** classical editorial (Tiempos/GT Sectra) vs. vintage utilitarian WEC (Univers + slab serif) vs. let-me-pick-and-react. _Default if not chosen: I'll prepare two directional samples in the proof._
- **Donations provider:** Every.org (free, mission-aligned) vs. Donorbox (more polished embed) vs. Open Collective (radical transparency). _Default: stub with Every.org link, swap later._
- **Photography:** do we have existing Front Range / team / program photos, or do we treat photography as a v1.5 deliverable and rely on illustration + texture for v1?
- **Catalog curation:** the `/catalog` page needs editorially-curated entries (orgs, books, tools) to be interesting. Who on the team owns this content?

## Reference links

- Current site: https://www.spiritofthefrontrange.org/
- Whole Earth aesthetic reference: https://wholeearth.info/
- Prior interactive piece (tone reference): https://api.anthropic.com/v1/design/h/nOD776R4zMtPJ5sjNnrnyQ?open_file=index.html
- Front Range Commons (sister entity): https://www.frontrangecommons.org/
- Mystery Works podcast: https://www.themysteryworks.com/

## Source documents

The org's voice, programs, governance structure, and founding story are captured in:

- `SPIRIT Works Projects.md` — programs, mission/vision copy, four pillars
- `Spirit of the Front Range Legal Formation.md` — bylaws, articles, legal structure
- `Spirit of the Front Range Governance Design Synthesis Apr 29 2026.md` — governance architecture (board → stewardship council → circles → projects), Spirit/Commons relationship

Always pull voice and program copy from these source documents, not from the existing Squarespace site (which is a watered-down version).
