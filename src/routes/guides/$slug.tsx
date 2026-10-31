import { createFileRoute, notFound } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { SITE_URL } from '@/lib/h3-seo';
import { getLocale, localizeUrl } from '@/paraglide/runtime.js';
import { H3GuideArticle } from '@/blocks/h3/guide-article';
import { getGuideMeta, isGuideSlug } from '@/content/guides';

export const Route = createFileRoute('/guides/$slug')({
  loader: ({ params }) => {
    if (!isGuideSlug(params.slug)) throw notFound();
    const locale = getLocale();
    return {
      slug: params.slug,
      locale,
      meta: getGuideMeta(params.slug, locale),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { meta, locale, slug } = loaderData;
    const path = `/guides/${slug}`;
    const canonical = localizeUrl(`${SITE_URL}${path}`, { locale }).href;
    const title = `${meta.title} | ${envConfigs.app_name}`;
    const image = `${SITE_URL}${meta.image.replace(/\.svg$/, '.png')}`;
    return {
      meta: [
        { title },
        { name: 'description', content: meta.description },
        { name: 'robots', content: 'index,follow' },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: meta.description },
        { property: 'og:url', content: canonical },
        { property: 'og:image', content: image },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '680' },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:alt', content: meta.imageAlt },
        { property: 'article:published_time', content: meta.publishedAt },
        { property: 'og:locale', content: locale === 'zh' ? 'zh_CN' : 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: meta.description },
        { name: 'twitter:image', content: image },
      ],
      links: [
        { rel: 'canonical', href: canonical },
        ...(['en', 'zh'] as const).map((language) => ({
          rel: 'alternate',
          hrefLang: language,
          href: localizeUrl(`${SITE_URL}${path}`, { locale: language }).href,
        })),
        { rel: 'alternate', hrefLang: 'x-default', href: `${SITE_URL}${path}` },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: meta.title,
              description: meta.description,
              datePublished: meta.publishedAt,
              dateModified: meta.publishedAt,
              inLanguage: locale,
              image,
              mainEntityOfPage: canonical,
              author: {
                '@type': 'Organization',
                name: envConfigs.app_name,
                url: SITE_URL,
              },
              publisher: {
                '@type': 'Organization',
                name: envConfigs.app_name,
                url: SITE_URL,
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: envConfigs.app_name,
                  item: localizeUrl(`${SITE_URL}/`, { locale }).href,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: meta.title,
                  item: canonical,
                },
              ],
            },
          ]).replace(/</g, '\\u003c'),
        },
      ],
    };
  },
  component: GuidePage,
});

function GuidePage() {
  const { slug, locale } = Route.useLoaderData();
  return <H3GuideArticle slug={slug} locale={locale} />;
}
