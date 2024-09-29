import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

type WorkType = {
  title: string;
  description: string;
  workflow?: WorkType[];
}

const work = z.lazy(() =>
  z.object({
    title: z.string(),
    description: z.string(),
    workflow: z.array(work).default([]),
    priority: z.enum(['A', 'B', 'C']).optional(),
    weight: z.enum(['light', 'heavy']).optional(),
    duration: z.coerce.string().time().optional(),
    references: z.array(z.string()).optional(),
  })
);

const workflow = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string(),
    workflow: z.array(work),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = {
  "blog": blog,
  "workflow": workflow,
};
