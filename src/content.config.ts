import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Una categoria = un file content/<nome>.md. I file che iniziano con "_" sono ignorati.
const categories = defineCollection({
  loader: glob({ pattern: ['*.md', '!_*.md'], base: './content' }),
  schema: z.object({
    title: z.string().min(1),
    when: z.string().default(''),
    order: z.number().default(999),
  }),
});

export const collections = { categories };
