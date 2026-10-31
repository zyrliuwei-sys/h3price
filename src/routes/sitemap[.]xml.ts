import { createFileRoute } from '@tanstack/react-router';

import { h3PageSeo, SITE_URL } from '@/lib/h3-seo';
import { baseLocale, localizeUrl, type Locale } from '@/paraglide/runtime.js';
import { getGuideMeta, GUIDE_SLUGS } from '@/content/guides';

const STATIC_PATHS = [
  ...Object.values(h3PageSeo).map((page) => page.path),
  '/pricing',
  '/text-to-video',
  '/privacy-policy',
  '/terms-of-service',
];

type Entry = {
  path: string;
  lastModified?: string;
  changeFrequency: string;
  priority: number;
  locale?: Locale;
};

function urlFor(path: string, locale: Locale = baseLocale): string {
  return localizeUrl(`${SITE_URL}${path || '/'}`, {
    locale,
  }).href;
}

function entryXml(e: Entry): string {
  return [
    '  <url>',
    `    <loc>${urlFor(e.path, e.locale)}</loc>`,
    e.lastModified ? `    <lastmod>${e.lastModified}</lastmod>` : null,
    `    <changefreq>${e.changeFrequency}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const entries: Entry[] = STATIC_PATHS.map((path) => ({
          path,
          changeFrequency: 'weekly',
          priority: path === '/' ? 1 : 0.8,
        }));
        for (const slug of GUIDE_SLUGS) {
          for (const locale of ['en', 'zh'] as const) {
            entries.push({
              path: `/guides/${slug}`,
              locale,
              lastModified: getGuideMeta(slug, locale).publishedAt,
              changeFrequency: 'monthly',
              priority: 0.8,
            });
          }
        }

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...entries.map(entryXml),
          '</urlset>',
          '',
        ].join('\n');

        return new Response(xml, {
          headers: { 'Content-Type': 'application/xml' },
        });
      },
    },
  },
});
