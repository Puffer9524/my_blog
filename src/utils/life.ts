import { getCollection, type CollectionEntry } from 'astro:content';
import {
  FEATURED_LIFE_CATEGORY_SLUGS,
  lifePostTagAliases,
  type FeaturedLifeCategory,
} from '../config/categories';
import { getPublishedPosts } from './posts';

export interface LifeSectionData {
  category: FeaturedLifeCategory;
  items: CollectionEntry<'life'>[];
  posts: CollectionEntry<'posts'>[];
}

export function postMatchesLifeCategory(
  tags: string[],
  category: FeaturedLifeCategory,
): boolean {
  const normalizedTags = new Set(
    tags.map((tag) => tag.trim().toLocaleLowerCase()),
  );

  return lifePostTagAliases[category].some((alias) =>
    normalizedTags.has(alias.toLocaleLowerCase()),
  );
}

export async function getLifeSections(): Promise<LifeSectionData[]> {
  const [items, posts] = await Promise.all([
    getCollection('life'),
    getPublishedPosts(),
  ]);
  const sortedItems = items.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return FEATURED_LIFE_CATEGORY_SLUGS.map((category) => ({
    category,
    items: sortedItems.filter((item) => item.data.category === category),
    posts: posts.filter((post) =>
      postMatchesLifeCategory(post.data.tags, category),
    ),
  }));
}
