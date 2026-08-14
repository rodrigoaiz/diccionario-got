import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const entries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/entries' }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    nameEs: z.string(),
    nameEn: z.string(),
    type: z.enum(['Lugar', 'Personaje', 'Casa', 'Dragon', 'Evento', 'Organizacion']),
    continuity: z.string(),
    region: z.string(),
    aliases: z.array(z.string()),
    summary: z.string(),
    accent: z.enum(['rust', 'ochre', 'moss']),
    editorialStatus: z.enum(['revisada', 'pendiente-de-verificar']).default('pendiente-de-verificar'),
    mapStatus: z.enum(['aproximada', 'pendiente']).default('pendiente'),
    wikidataId: z.string().optional(),
    sourceCategories: z.array(z.string()).optional(),
    sources: z.array(
      z.object({
        name: z.string(),
        url: z.url(),
        consulted: z.string(),
        confidence: z.string(),
      }),
    ),
  }),
});

export const collections = { entries };
