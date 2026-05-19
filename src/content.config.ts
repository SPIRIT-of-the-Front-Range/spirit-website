import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared visual enums used by multiple collections
const pillarColor = z.enum(['clay', 'creek', 'sage', 'grass']);
const treatment = z.enum([
  'natural',
  'duotone-sage',
  'duotone-clay',
  'duotone-creek',
  'duotone-clay-deep',
  'duotone-ink',
]);

const stewards = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stewards' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    email: z.string().optional(),
    pronouns: z.string().optional(),
    photo: z.string().optional(),
    bioShort: z.string().optional(),
    website: z.string().optional(),       // personal site or org link
    websiteLabel: z.string().optional(),  // optional display label (default: domain)
    order: z.number().default(0),
    links: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  }),
});

const programs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/programs' }),
  schema: z.object({
    title: z.string(),
    abbrev: z.string().optional(),
    pillar: z.enum(['allocation', 'coordination', 'belonging', 'culturing']).optional(),
    pillarLabel: z.string().optional(),
    shortDescription: z.string(),
    status: z.enum(['active', 'upcoming', 'concluded']).default('active'),
    order: z.number().default(0),
    nextEventDate: z.string().optional(),
    nextEventUrl: z.string().optional(),
    // Detail-page extras (all optional so listing remains valid)
    detail: z.object({
      tagline: z.string().optional(),
      heroImage: z.string().optional(),
      heroAlt: z.string().optional(),
      heroTreatment: treatment.optional(),
      heroBrightness: z.number().optional(),
      heroPlateCaption: z.string().optional(),
      tone: z.enum(['clay', 'creek', 'sage', 'grass']).optional(),
      sections: z.array(z.object({
        eyebrow: z.string().optional(),
        heading: z.string(),
        italicHeading: z.string().optional(),
        body: z.string(),
      })).optional(),
      pullQuote: z.object({
        text: z.string(),
        attribution: z.string().optional(),
      }).optional(),
      signup: z.object({
        eyebrow: z.string(),
        heading: z.string(),
        italicHeading: z.string().optional(),
        body: z.string(),
        ctaLabel: z.string(),
        ctaHref: z.string(),
      }).optional(),
    }).optional(),
  }),
});

const writings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writings' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.string(),                // ISO yyyy-mm-dd
    excerpt: z.string(),
    kind: z.enum(['essay', 'talk', 'article', 'paper', 'interview']).default('essay'),
    url: z.string().optional(),      // external link (Substack etc.)
    publication: z.string().optional(), // e.g., "omniharmonic"
    tone: z.enum(['clay', 'creek', 'sage', 'grass']).default('clay'),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    tags: z.array(z.string()).optional(),
  }),
});

const catalog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/catalog' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['book', 'organization', 'tool', 'practice', 'place', 'podcast', 'essay']),
    author: z.string().optional(),
    source: z.string().optional(),
    url: z.string().optional(),
    price: z.string().optional(),
    year: z.union([z.number(), z.string()]).optional(),
    pillars: z.array(z.string()).optional(),
    curator: z.string().optional(),
    tone: z.enum(['clay', 'creek', 'sage', 'grass']).default('clay'),
    order: z.number().default(0),
  }),
});

// Singleton page content — one markdown file per page. Schema below covers
// the mission page's shape; other pages will add their own optional fields
// via passthrough as we extend this in Phase 1.
const cardSchema = z.object({
  number: z.string(),
  color: pillarColor,
  title: z.string(),
  body: z.string(),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z
    .object({
      seo: z.object({
        title: z.string(),
        description: z.string(),
      }),
      cover: z
        .object({
          eyebrow: z.string(),
          title: z.string(),
          italicTitle: z.string(),
          subtitle: z.string(),
          imageSrc: z.string(),
          imageAlt: z.string(),
          plateCaption: z.string().default(''),
          treatment: treatment,
          brightness: z.number(),
          donateCtaLabel: z.string().optional(),
        })
        .optional(),
      homeCover: z
        .object({
          eyebrow: z.string(),
          titleLine1: z.string(),
          titleSmall: z.string(),
          titleLine2: z.string(),
          tagline: z.string(),
          imageSrc: z.string(),
          imageAlt: z.string().default(''),
          primaryCtaLabel: z.string(),
          primaryCtaHref: z.string(),
          secondaryCtaLabel: z.string(),
          secondaryCtaHref: z.string(),
          captionLabel: z.string(),
          captionLocation: z.string(),
          captionCredit: z.string(),
        })
        .optional(),
      spreads: z
        .object({
          vision: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              marginalia: z.string(),
              body: z.string(),
              image: z.string(),
              imageAlt: z.string(),
              imageCaption: z.string(),
            })
            .optional(),
          mission: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              marginalia: z.string(),
              body: z.string(),
              italicNote: z.string().optional(),
              image: z.string(),
              imageAlt: z.string(),
              imageCaption: z.string(),
            })
            .optional(),
          strategy: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              marginalia: z.string(),
              intro: z.string(),
              weaveCaption: z.string(),
              pillars: z.array(cardSchema),
            })
            .optional(),
          commitments: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              items: z.array(cardSchema),
            })
            .optional(),
          fourWays: z
            .object({
              sectionLabel: z.string(),
              marginaliaPrimary: z.string(),
              marginaliaSecondary: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              subheading: z.string(),
              cards: z.array(
                z.object({
                  number: z.string(),
                  color: pillarColor,
                  eyebrow: z.string(),
                  title: z.string(),
                  body: z.string(),
                  ctaLabel: z.string(),
                  ctaHref: z.string(),
                }),
              ),
            })
            .optional(),
          newsletter: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              body: z.string(),
              formAction: z.string(),
              formEyebrow: z.string().default('★ Subscribe'),
              submitLabel: z.string().default('★ Subscribe'),
              footnote: z.string(),
            })
            .optional(),
          roots: z
            .object({
              sectionLabel: z.string(),
              marginaliaPrimary: z.string(),
              marginaliaSecondary: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              headingTail: z.string().default(''),
              body: z.string(),
            })
            .optional(),
          cascade: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              headingTail: z.string().default(''),
              tiers: z.array(
                z.object({
                  number: z.string(),
                  tier: z.string(),
                  title: z.string(),
                  body: z.string(),
                }),
              ),
            })
            .optional(),
          contribute: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              headingTail: z.string().default(''),
              fallbackEyebrow: z.string(),
              fallbackHeading: z.string(),
              fallbackBody: z.string(),
              fallbackCtaLabel: z.string(),
              fallbackCtaHref: z.string(),
              donateCtaLabel: z.string().default('★ Donate via Every.org →'),
              taxNote: z.string(),
            })
            .optional(),
          manifesto: z
            .object({
              sectionLabel: z.string(),
              marginaliaPrimary: z.string(),
              marginaliaSecondary: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              headingTail: z.string().default(''),
              body: z.string(),
            })
            .optional(),
          team: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              countLabel: z.string().default('N = 5'),
            })
            .optional(),
          futureBoard: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              body: z.string(),
            })
            .optional(),
          getInvolved: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              body: z.string(),
              primaryCtaLabel: z.string(),
              primaryCtaHref: z.string(),
              secondaryCtaLabel: z.string(),
              secondaryCtaHref: z.string(),
            })
            .optional(),
          sections: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
            })
            .optional(),
          entries: z
            .object({
              sectionLabel: z.string(),
              marginaliaPrimary: z.string(),
              marginaliaSecondary: z.string(),
              issueFooter: z.string(),
            })
            .optional(),
          inBrief: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              body: z.string(),
            })
            .optional(),
          glossary: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              caption: z.string(),
              terms: z.array(
                z.object({
                  number: z.string(),
                  color: pillarColor,
                  term: z.string(),
                  pronunciation: z.string(),
                  body: z.string(),
                }),
              ),
            })
            .optional(),
          relationship: z
            .object({
              sectionLabel: z.string(),
              marginalia: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              spiritCard: z.object({
                eyebrow: z.string(),
                title: z.string(),
                items: z.array(z.string()),
              }),
              commonsCard: z.object({
                eyebrow: z.string(),
                title: z.string(),
                items: z.array(z.string()),
              }),
              ctaLabel: z.string(),
              ctaHref: z.string(),
            })
            .optional(),
          philosophy: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              headingTail: z.string().default(''),
              body: z.string(),
              italicLine: z.string(),
              marginalia: z.string(),
              marginaliaNumber: z.string().default('N° 02.1'),
              imageCaption: z.string(),
              imagePlate: z.string().default('Plate II'),
            })
            .optional(),
          stewardsNote: z
            .object({
              sectionLabel: z.string(),
              subLabel: z.string(),
              quote: z.string(),
              attribution: z.string(),
            })
            .optional(),
          vessel: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              headingTail: z.string().default(''),
              body: z.string(),
              primaryCtaLabel: z.string(),
              primaryCtaHref: z.string(),
              secondaryCtaLabel: z.string(),
              secondaryCtaHref: z.string(),
              editorsNoteTitle: z.string(),
              editorsNoteBody: z.string(),
              languageNoteTitle: z.string(),
              languageNoteQuote: z.string(),
              languageNoteAttribution: z.string(),
              diagramCaption: z.string().default('Fig. 04 · the lattice'),
            })
            .optional(),
          pillars: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              intro: z.string(),
              caption: z.string(),
              footnote: z.string(),
              items: z.array(
                z.object({
                  number: z.string(),
                  color: pillarColor,
                  pillar: z.string(),
                  title: z.string(),
                  body: z.string(),
                  outcome: z.string(),
                  photoCaption: z.string(),
                }),
              ),
            })
            .optional(),
          ethics: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              headingTail: z.string().default(''),
              intro: z.string(),
              items: z.array(
                z.object({
                  number: z.string(),
                  color: pillarColor,
                  title: z.string(),
                  body: z.string(),
                }),
              ),
              closingNote: z.string().optional(),
            })
            .optional(),
          homeGlossary: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              intro: z.string(),
              terms: z.array(
                z.object({
                  number: z.string(),
                  color: pillarColor,
                  term: z.string(),
                  body: z.string(),
                }),
              ),
              ctaLabel: z.string().optional(),
              ctaHref: z.string().optional(),
            })
            .optional(),
          programsTeaser: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              intro: z.string(),
              caption: z.string(),
              footnote: z.string(),
              ctaLabel: z.string(),
              ctaHref: z.string(),
            })
            .optional(),
          commonsTeaser: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              subEyebrow: z.string().optional(),
              heading: z.string(),
              italicHeading: z.string(),
              headingTail: z.string().default(''),
              intro: z.string().optional(),
              body: z.string(),
              stickerQuote: z.string().optional(),
              stickerLabel: z.string().default('N° 07.1'),
              imageSrc: z.string().optional(),
              imageCaption: z.string().optional(),
              imageOverlay: z.string().optional(),
              primaryCtaLabel: z.string(),
              primaryCtaHref: z.string(),
              secondaryCtaLabel: z.string(),
              secondaryCtaHref: z.string(),
            })
            .optional(),
          ethicsTeaser: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              headingTail: z.string().default(''),
              body: z.string(),
              ctaLabel: z.string(),
              ctaHref: z.string(),
            })
            .optional(),
          funding: z
            .object({
              sectionLabel: z.string(),
              eyebrow: z.string(),
              heading: z.string(),
              italicHeading: z.string(),
              headingTail: z.string().default(''),
              body: z.string(),
              primaryCtaLabel: z.string(),
              primaryCtaHref: z.string(),
              secondaryCtaLabel: z.string(),
              secondaryCtaHref: z.string(),
              cascadeTitle: z.string(),
              cascadeTiers: z.array(
                z.object({
                  number: z.string(),
                  title: z.string(),
                  caption: z.string(),
                }),
              ),
              cascadeCaption: z.string(),
              footerLeft: z.string(),
              footerCenter: z.string(),
              footerRight: z.string(),
            })
            .optional(),
        })
        .optional(),
      pullQuote: z
        .object({
          text: z.string(),
          attribution: z.string().optional(),
        })
        .optional(),
      closing: z
        .object({
          eyebrow: z.string(),
          text: z.string(),
          ctaLabel: z.string(),
          ctaHref: z.string(),
        })
        .optional(),
    })
    .passthrough(),
});

// Site-wide settings — header/footer/nav/social/donate URL. Singleton.
const settings = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/settings' }),
  schema: z.object({
    siteName: z.string(),
    issueNumber: z.string(),
    establishedYear: z.string(),
    wordmarkSrc: z.string(),
    header: z.object({
      donateLabel: z.string(),
      mobileDonateLabel: z.string(),
      nav: z.array(z.object({ label: z.string(), href: z.string() })),
    }),
    footer: z.object({
      tagline: z.object({
        eyebrow: z.string(),
        heading: z.string(),
        italicHeading: z.string(),
        body: z.string(),
      }),
      primaryCtaLabel: z.string(),
      primaryCtaHref: z.string(),
      secondaryCtaLabel: z.string(),
      secondaryCtaHref: z.string(),
      siteColumnTitle: z.string(),
      siteLinks: z.array(z.object({ label: z.string(), href: z.string() })),
      reachUsTitle: z.string(),
      email: z.string(),
      externalLinks: z.array(z.object({ label: z.string(), href: z.string() })),
      editorSignInLabel: z.string(),
      colophon: z.string(),
      copyrightSuffix: z.string(),
    }),
    donation: z.object({
      url: z.string(),
      ready: z.boolean(),
    }),
  }),
});

export const collections = { stewards, programs, catalog, writings, pages, settings };
