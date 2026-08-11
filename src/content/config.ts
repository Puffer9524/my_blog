import { defineCollection, z } from 'astro:content';
import { LIFE_CATEGORY_SLUGS, POST_CATEGORY_SLUGS } from '../config/categories';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    category: z.enum(POST_CATEGORY_SLUGS).optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const lifeBaseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.string(),
  link: z.string().optional(),
  date: z.date(),
});

const lifeCollection = defineCollection({
  type: 'content',
  schema: z.discriminatedUnion('category', [
    lifeBaseSchema.extend({
      category: z.literal('photography'),
      images: z.array(z.string()).min(1),
    }),
    lifeBaseSchema.extend({
      category: z.enum(
        LIFE_CATEGORY_SLUGS.filter((category) => category !== 'photography') as [
          Exclude<(typeof LIFE_CATEGORY_SLUGS)[number], 'photography'>,
          ...Exclude<(typeof LIFE_CATEGORY_SLUGS)[number], 'photography'>[],
        ],
      ),
      images: z.never().optional(),
    }),
  ]),
});

const aboutCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
  life: lifeCollection,
  about: aboutCollection,
};
