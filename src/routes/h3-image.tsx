import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { SITE_URL } from '@/lib/h3-seo';
import { m } from '@/paraglide/messages.js';
import { getLocale, localizeUrl } from '@/paraglide/runtime.js';
import { H3ImagePage } from '@/blocks/h3-image';

export const Route = createFileRoute('/h3-image')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['h3_image.meta.title']({}, { locale }),
      description: m['h3_image.meta.description']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description } = loaderData;
    const canonical = localizeUrl(`${SITE_URL}/h3-image`, { locale }).href;
    const image = `${SITE_URL}/h3-image/editorial.webp`;
    const localized = { locale };
    const faqs = [
      [
        m['h3_image.faq.what.question']({}, localized),
        m['h3_image.faq.what.answer']({}, localized),
      ],
      [
        m['h3_image.faq.resolution.question']({}, localized),
        m['h3_image.faq.resolution.answer']({}, localized),
      ],
      [
        m['h3_image.faq.text.question']({}, localized),
        m['h3_image.faq.text.answer']({}, localized),
      ],
      [
        m['h3_image.faq.credits.question']({}, localized),
        m['h3_image.faq.credits.answer']({}, localized),
      ],
      [
        m['h3_image.faq.video.question']({}, localized),
        m['h3_image.faq.video.answer']({}, localized),
      ],
      [
        m['h3_image.faq.references.question']({}, localized),
        m['h3_image.faq.references.answer']({}, localized),
      ],
    ];
    return {
      meta: [
        { title: `${title} | ${envConfigs.app_name}` },
        { name: 'description', content: description },
        { name: 'robots', content: 'index,follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonical },
        { property: 'og:image', content: image },
        { property: 'og:image:width', content: '1800' },
        { property: 'og:image:height', content: '1013' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
      links: [
        { rel: 'canonical', href: canonical },
        ...(['en', 'zh'] as const).map((language) => ({
          rel: 'alternate',
          hrefLang: language,
          href: localizeUrl(`${SITE_URL}/h3-image`, { locale: language }).href,
        })),
        {
          rel: 'alternate',
          hrefLang: 'x-default',
          href: `${SITE_URL}/h3-image`,
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'H3 Image',
              description,
              url: canonical,
              image,
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'Web',
              inLanguage: locale,
              provider: {
                '@type': 'Organization',
                name: envConfigs.app_name,
                url: SITE_URL,
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(([question, answer]) => ({
                '@type': 'Question',
                name: question,
                acceptedAnswer: { '@type': 'Answer', text: answer },
              })),
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
                  name: 'H3 Image',
                  item: canonical,
                },
              ],
            },
          ]).replace(/</g, '\\u003c'),
        },
      ],
    };
  },
  component: H3ImagePage,
});
