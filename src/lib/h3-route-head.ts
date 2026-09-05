import {
  canonicalUrl,
  DEFAULT_SOCIAL_IMAGE_URL,
  h3PageSeo,
  type H3PageKey,
} from '@/lib/h3-seo';

export function h3RouteHead(pageKey: H3PageKey) {
  const page = h3PageSeo[pageKey];
  const canonical = canonicalUrl(page.path);

  return {
    meta: [
      { title: page.title },
      { name: 'description', content: page.description },
      { name: 'robots', content: 'index,follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: page.title },
      { property: 'og:description', content: page.description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: DEFAULT_SOCIAL_IMAGE_URL },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: page.title },
      { name: 'twitter:description', content: page.description },
      { name: 'twitter:image', content: DEFAULT_SOCIAL_IMAGE_URL },
    ],
    links: [{ rel: 'canonical', href: canonical }],
  };
}
