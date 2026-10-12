export const siteConfig = {
  name: 'PufferSite',
  description: 'Puffer的个人博客。',
  language: 'zh-CN',
  homeCover: {
    image: 'public/life/photo1.jpeg',
    alt: '图片',
    position: 'center center',
  },
  intro: {
    title: '你好，我是 Puffer',
    subtitle: '记录生活、技术与成长。',
    typeSpeed: 90,
    startDelay: 400,
  },
  author: {
    name: 'Puffer',
    avatar: '/cat.png',
    bio: '爵士好猫，路过可以摸摸。',
    signature: 'Build, learn, repeat.',
  },
} as const;
