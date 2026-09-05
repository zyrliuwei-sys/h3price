export const SITE_URL = 'https://h3price.com';

export const DEFAULT_SOCIAL_IMAGE_URL = `${SITE_URL}/proactiv/showcase-videos/neon-dancer.jpg`;
export const TEXT_TO_IMAGE_SOCIAL_IMAGE_URL = `${SITE_URL}/imgs/image/meigen-2010358364048597154.jpg`;

export const siteSeo = {
  home: {
    title: 'h3price ai - AI Video Generation Platform',
    description:
      'Create cinematic AI video from your ideas with h3price ai. Explore modern video generation workflows built for fast creative direction.',
    path: '/',
  },
  textToImage: {
    title: 'Uncensored AI Image Editor - Free Text to Image Generator',
    description:
      'Uncensored AI image editor: turn text into images without filters or restrictions. Free to use, no signup, full creative direction. Try it now.',
    path: '/text-to-image',
  },
} as const;
