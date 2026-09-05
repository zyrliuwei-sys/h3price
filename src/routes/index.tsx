import { createFileRoute } from '@tanstack/react-router';

import { h3RouteHead } from '@/lib/h3-route-head';
import { SITE_URL } from '@/lib/h3-seo';
import { FAL_H3_MAX_MODEL_URL, REGULAR } from '@/lib/pricing';
import { m } from '@/paraglide/messages.js';
import { ProactivReferenceLanding } from '@/blocks/proactiv-reference-landing';

function HomePage() {
  const faqs = m['reference.faq.records']()
    .split('\n')
    .filter(Boolean)
    .map((record) => {
      const [question, answer] = record.split('||');
      return { question: question ?? '', answer: answer ?? '' };
    });
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'MiniMax H3 Max by fal',
      url: SITE_URL,
      brand: {
        '@type': 'Brand',
        name: 'fal',
      },
      offers: {
        '@type': 'Offer',
        url: FAL_H3_MAX_MODEL_URL,
        price: String(REGULAR['768p']),
        priceCurrency: 'USD',
        description: 'Published regular API price per second at 768p.',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <>
      <ProactivReferenceLanding />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}

export const Route = createFileRoute('/')({
  head: () => h3RouteHead('home'),
  component: HomePage,
});
