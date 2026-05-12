import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sectionFolio = z.object({
  folio: z.string().optional(),
  folioNum: z.string().optional(),
  marginaliaNumber: z.string().optional(),
  marginaliaLabel: z.string().optional(),
  marginaliaBody: z.string().optional(),
});

const missionPageSchema = z.object({
  title: z.string(),
  description: z.string(),
  cover: z.object({
    folio: z.string(),
    sectionLabel: z.string(),
    eyebrow: z.string(),
    title: z.string(),
    italicTitle: z.string().optional(),
    subtitle: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    plateCaption: z.string().optional(),
    treatment: z.string().optional(),
    brightness: z.number().optional(),
  }),
  vision: sectionFolio.extend({
    eyebrow: z.string(),
    headline: z.string(),
    italicHeadline: z.string().optional(),
    body: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    imageCaption: z.string().optional(),
  }),
  mission: sectionFolio.extend({
    eyebrow: z.string(),
    headline: z.string(),
    italicHeadline: z.string().optional(),
    body: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    imageCaption: z.string().optional(),
  }),
  pullQuote: z.object({
    text: z.string(),
    attribution: z.string().optional(),
  }),
  strategy: sectionFolio.extend({
    eyebrow: z.string(),
    headline: z.string(),
    italicHeadline: z.string().optional(),
    lead: z.string(),
    pillarWeaveCaption: z.string().optional(),
    pillars: z.array(z.object({
      number: z.string(),
      tone: z.enum(['clay', 'creek', 'sage', 'grass']),
      label: z.string(),
      body: z.string(),
    })),
  }),
  commitments: z.object({
    folio: z.string().optional(),
    eyebrow: z.string(),
    headline: z.string(),
    items: z.array(z.object({
      number: z.string(),
      tone: z.enum(['clay', 'creek', 'sage', 'grass']),
      title: z.string(),
      body: z.string(),
    })),
  }),
  closing: z.object({
    eyebrow: z.string(),
    text: z.string(),
    ctaLabel: z.string(),
    ctaUrl: z.string(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: missionPageSchema.partial().extend({
    title: z.string(),
    description: z.string(),
  }),
});

const stewards = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stewards' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    email: z.string().optional(),
    pronouns: z.string().optional(),
    photo: z.string().optional(),
    bioShort: z.string().optional(),
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

export const collections = { pages, stewards, programs, catalog };
