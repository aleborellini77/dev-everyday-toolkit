import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const schema = z.object({
  title: z.string().min(1),
  when: z.string().default(''),
  order: z.number().default(999),
});

// Una categoria = un file content/<nome>.md. I file che iniziano con "_" sono ignorati.
const categories = defineCollection({
  loader: glob({ pattern: ['*.md', '!_*.md'], base: './content' }),
  schema,
});

// Un percorso di diagnosi = un file content/percorsi/<nome>.md.
const paths = defineCollection({
  loader: glob({ pattern: ['*.md', '!_*.md'], base: './content/percorsi' }),
  schema,
});

export const collections = { categories, paths };
