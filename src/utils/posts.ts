import { getCollection, type CollectionEntry } from 'astro:content';

export function getPostSlug(post: CollectionEntry<'posts'>): string {
  return post.id.replace(/\.md$/, '');
}

export async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts');

  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
