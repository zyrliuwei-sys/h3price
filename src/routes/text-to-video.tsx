import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { useRouter } from '@/core/i18n/navigation';
import {
  SITE_URL,
  siteSeo,
  TEXT_TO_VIDEO_SOCIAL_IMAGE_URL,
} from '@/lib/motion-control-seo';
import { TextToVideo } from '@/blocks/text-to-video';

const textToVideoSearchSchema = z.object({
  prompt: z.string().max(4000).optional(),
});
const canonicalUrl = `${SITE_URL}${siteSeo.textToVideo.path}`;

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: siteSeo.textToVideo.title.split(' | ')[0],
      item: canonicalUrl,
    },
  ],
};

function TextToVideoRoute() {
  const { prompt } = Route.useSearch();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== 'Escape' ||
        event.defaultPrevented ||
        event.isComposing
      ) {
        return;
      }

      event.preventDefault();
      router.push('/');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return <TextToVideo initialPrompt={prompt} showTemplateFeed={false} />;
}

export const Route = createFileRoute('/text-to-video')({
  validateSearch: textToVideoSearchSchema,
  head: () => ({
    meta: [
      { title: siteSeo.textToVideo.title },
      { name: 'description', content: siteSeo.textToVideo.description },
      { name: 'robots', content: 'index,follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: siteSeo.textToVideo.title },
      {
        property: 'og:description',
        content: siteSeo.textToVideo.description,
      },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:image', content: TEXT_TO_VIDEO_SOCIAL_IMAGE_URL },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: siteSeo.textToVideo.title },
      {
        name: 'twitter:description',
        content: siteSeo.textToVideo.description,
      },
      {
        name: 'twitter:image',
        content: TEXT_TO_VIDEO_SOCIAL_IMAGE_URL,
      },
      { 'script:ld+json': breadcrumbStructuredData },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
  }),
  component: TextToVideoRoute,
});
