import { defineCollection, z } from 'astro:content';
import { LIFE_CATEGORY_SLUGS, POST_CATEGORY_SLUGS } from '../config/categories';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    category: z.enum(POST_CATEGORY_SLUGS).optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const lifeCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string(),
    category: z.enum(LIFE_CATEGORY_SLUGS),
    link: z.string().optional(),
    date: z.date(),
  }),
});

export const collections = {
  posts: postsCollection,
  life: lifeCollection,
};
