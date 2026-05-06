# Aesthetic Direction

> The Front Range meets the Whole Earth Catalog for the 21st-century bioregional movement.

## The two reference axes

We hold two influences in tension. Neither alone is right.

### Axis 1: Whole Earth Catalog — *structure & voice*

The WEC influence is **not** about earth tones (despite the name). It's about:

- **Editorial structure** — multi-column layouts, generous gutters, dense-but-breathable information design
- **"Access to Tools" pattern** — every catalog entry has a name, source, price, image, and a curator's annotation. The format dignifies the things being catalogued.
- **Utilitarian typography** — workhorse type doing real work; not decorative
- **Marginalia** — small annotations in the margins (hand-drawn arrows, page references, curator's voice)
- **Reverence for the things being shared** — the design treats every tool, book, idea as worth your attention
- **Black-and-white archival photography** with a single accent color
- **Letterpress / risograph / newsprint texture** — physical materials, not digital gloss

### Axis 2: Front Range — *palette & materiality*

The Front Range layer brings:

- **Muted earth-tone palette** (see below)
- **Hand-drawn topography** — a recurring motif of the Front Range corridor (mountains West, plains East, watersheds running through)
- **Generous whitespace** — the high plains have room to breathe; so should the page
- **Paper grain texture** on key surfaces
- **Watercolor + ink illustration** — never stock photography of "diverse hands together"
- **Sense of place** — the design should feel rooted in *this specific bioregion*, not a generic "nature non-profit"

## Color palette (initial — to be tuned)

```css
--bone:   #F2EAD8;  /* page background, warm off-white */
--ink:    #2A2A28;  /* warm near-black, body text */
--grass:  #A8AB7A;  /* dry tall grass — primary warm */
--sage:   #8FA48B;  /* soft sage — primary cool */
--creek:  #5C7E8A;  /* muted blue creek — accent / link */
--clay:   #B8704D;  /* red rock / canyon — secondary accent */
--sky:    #C9D6DC;  /* high plains sky — large surface tints */
--shadow: #4A4A45;  /* deep warm gray for secondary text */
```

**Usage rules:**
- `--bone` is the default page background, always
- `--ink` is body text; never use pure black
- `--creek` for links and primary interactive elements
- `--clay` for emphasis and call-to-action only — sparingly, like punctuation
- `--grass` and `--sage` for large surface tints (section backgrounds, illustrations)
- `--sky` for cool surface tints (rare — when we want sense of openness)
- All colors should pass AA contrast on `--bone`; `--ink` and `--shadow` should pass AAA

## Typography

**Direction is open** (one of the open decisions). Two candidates I'd recommend, both work with the brief:

### Direction A: Classical editorial
- **Display:** GT Sectra, Tiempos Headline, or Domaine Display (high-contrast serif with subtle modulation)
- **Body:** Söhne, Inter, or GT America (clean grotesque)
- **Marginalia/captions:** italic of the body face, slightly smaller
- **Feel:** literary magazine, contemporary editorial, restrained luxury

### Direction B: Vintage utilitarian (more WEC-faithful)
- **Display:** Caslon Egyptian, Stratos, or Söhne Breit (slab/grotesque hybrids)
- **Body:** Univers, Helvetica Neue, or Söhne (workhorse sans)
- **Marginalia:** typewriter face like JetBrains Mono or IBM Plex Mono, small
- **Feel:** newsprint, almanac, technical manual — but considered

### Free/open-source equivalents (likely default for v1)

If we want to avoid licensing fees on launch, the best free pairings:
- **A:** Fraunces (display) + Inter (body) — Fraunces has the modulation we want, fully variable
- **B:** Bricolage Grotesque (display) + Public Sans (body) + JetBrains Mono (marginalia)

## Type scale (modular, target — to refine in proof)

```
Display XL    72 / 1.05      hero headline
Display L     54 / 1.10      section headlines
Display M     40 / 1.15      page titles
H1            32 / 1.20
H2            24 / 1.30
H3            20 / 1.35
Body L        20 / 1.55      lead paragraphs
Body          17 / 1.65      default
Caption       14 / 1.45      marginalia, image captions
Micro         12 / 1.40      footer, fine print
```

Use a **fluid scale** with `clamp()` so type respects viewport without stepwise breakpoints feeling jumpy.

## Layout principles

- **Asymmetric grids** — never the centered-card-grid look
- **Editorial columns** — body text in 2 columns on desktop where appropriate; single column on mobile
- **Marginalia gutter** — reserve a margin column on desktop for annotations, captions, footnotes
- **Generous vertical rhythm** — 1.5× your instinct for section spacing
- **Hero treatments differ per page** — not the same template seven times

## Motion principles

Motion should feel like *weather*, not like *transitions*. Slow, considered, suggestive of natural systems.

- **Default easing:** custom curve close to `cubic-bezier(0.22, 1, 0.36, 1)` — ease-out with long tail
- **Default duration:** 600–900ms for meaningful motion, 200–300ms for micro-interactions
- **Scroll-driven > timeline-driven** where possible (feels like the user is moving through the landscape, not being shown things)
- **Reduce or eliminate** for `prefers-reduced-motion` users (offer static alternatives, not just zero motion)

## Distinctive interactive set pieces

These are the moments that distinguish this from a Squarespace template. Each is a meaningful island, not decoration:

1. **Front Range Panorama Hero** — a wide hand-drawn watercolor panorama (mountains West → grasslands East), revealed by horizontal scroll or parallax as you progress down the page. The four pillar words appear written into the landscape as you scroll past them.
2. **The Pillar Weave** — four colored threads (Allocation, Coordination, Belonging, Culturing) that braid together as you scroll. SVG + GSAP, ~30kb, runs at 60fps, has a static reduced-motion alternative.
3. **The Bioregion Map** — interactive SVG of the Front Range corridor with clickable points: partner organizations, neighborhoods, watersheds, programs. Hovering a point reveals a marginalia card.
4. **The Catalog (`/catalog`)** — WEC-style multi-column index. Hover an entry to reveal the curator's marginalia annotation in a margin gutter (not a tooltip — actually positioned in the page margin, like the original WEC).
5. **Editorial typography moments** — drop caps, decorative initials on section starts, hanging quotation marks, true small caps. Small details, but they signal craft.

## What to deliberately avoid

These are tells of the SaaS / Squarespace / generic non-profit aesthetic. Avoid:

- ❌ Stock photography of "diverse hands together" or any stock photography at all
- ❌ Hero video loops
- ❌ Animated gradients, glassmorphism, neumorphism
- ❌ Card-grid-card-grid-card-grid layouts
- ❌ Emojis as iconography
- ❌ Centered hero with two CTA buttons
- ❌ Tailwind defaults (slate-700 text on white, indigo-500 buttons) — every default must be overridden
- ❌ Lottie animations of generic abstract shapes
- ❌ "Trusted by" logo soup
- ❌ Testimonial carousels
- ❌ "Get started" / "Learn more" verbs everywhere — write specific verbs ("Step into the Commons", "Read the bylaws", "Find your neighborhood")

## Voice & tone

Pulled from the org's own writing in `SPIRIT Works Projects.md`. The voice is:

- **Reverent without being precious** — talks about the land like it's family, but doesn't get mystical-mushy
- **Specific, not abstract** — "the red rocks of the South, the high plains to the North" beats "our beautiful region"
- **Plural** — "we", "our", "the denizens of the Commons" — never "you should"
- **Embodied** — "we come together", "we walk", "we listen" — verbs of presence, not extraction
- **Long-form when it matters** — the org has a real philosophy (institutional self-negation, non-enclosure of the commons); the design should give that room

Sample voice from the source: *"Our mutual relationship to where we live implies our mutual responsibility for that place. This relationship cannot be enclosed because it is, by definition, a commons."*

When generating UI copy for buttons, microcopy, error states, etc., write in this register. Never default to SaaS copywriting ("Oops! Something went wrong 🙈").
