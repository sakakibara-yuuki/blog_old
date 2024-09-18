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

const work: z.ZodType<WorkType> = z.lazy(() =>
  z.object({
    title: z.string(),
    description: z.string(),
    workflow: z.array(work).default([]),
  })
);

const workflow = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    workflow: z.array(work),
  }),
});

const guideline = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    guideline: z.array(z.object({
      id: z.number(),
      priority: z.enum(['A', 'B', 'C']),
      level: z.enum(['A', 'B', 'C']),
      content: z.string(),
      reason: z.string().optional(),
      references: z.array(z.string()).optional(),
    })),
  }),
});

export const collections = {
  "blog": blog,
  "workflow": workflow,
  "guideline": guideline,
};
