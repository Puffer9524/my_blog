export const POST_CATEGORY_SLUGS = [
  'frontend',
  'backend',
  'tools',
  'life',
] as const;

export type PostCategory = (typeof POST_CATEGORY_SLUGS)[number];

export const postCategoryLabels: Record<PostCategory, string> = {
  frontend: '前端开发',
  backend: '后端技术',
  tools: '工具分享',
  life: '生活随笔',
};

export const postCategories = POST_CATEGORY_SLUGS.map((slug) => ({
  slug,
  label: postCategoryLabels[slug],
}));

export const LIFE_CATEGORY_SLUGS = [
  'music',
  'movie',
  'reading',
  'photography',
  'travel',
  'gaming',
  'anime',
  'other',
] as const;

export type LifeCategory = (typeof LIFE_CATEGORY_SLUGS)[number];

export const lifeCategoryLabels: Record<LifeCategory, string> = {
  music: '音乐',
  movie: '电影',
  reading: '阅读',
  photography: '摄影',
  travel: '旅行',
  gaming: '游戏',
  anime: '番剧',
  other: '其他',
};

export const FEATURED_LIFE_CATEGORY_SLUGS = [
  'music',
  'photography',
  'gaming',
  'anime',
] as const;

export type FeaturedLifeCategory = (typeof FEATURED_LIFE_CATEGORY_SLUGS)[number];

export const lifePostTagAliases: Record<FeaturedLifeCategory, readonly string[]> = {
  music: ['音乐', 'music'],
  photography: ['摄影', 'photography', 'photo'],
  gaming: ['游戏', 'gaming', 'game'],
  anime: ['番剧', '动漫', 'anime'],
};
