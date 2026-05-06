import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

export const collections = { stewards, programs, catalog };
