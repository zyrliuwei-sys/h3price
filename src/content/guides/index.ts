import { guideMetadata } from './metadata';

export type { GuideMeta } from './metadata';

export const GUIDE_SLUGS = [
  'minimax-h3-flashgen-4step',
  'minimax-h3-vbvr',
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export function isGuideSlug(slug: string): slug is GuideSlug {
  return GUIDE_SLUGS.some((value) => value === slug);
}

export function getGuideMeta(slug: GuideSlug, locale: string) {
  return guideMetadata[slug]![locale === 'zh' ? 'zh' : 'en'];
}
