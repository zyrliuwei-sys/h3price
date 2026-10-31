import type { GuideSlug } from './index';
import FlashgenEn from './minimax-h3-flashgen-4step.en.mdx';
import FlashgenZh from './minimax-h3-flashgen-4step.zh.mdx';
import VbvrEn from './minimax-h3-vbvr.en.mdx';
import VbvrZh from './minimax-h3-vbvr.zh.mdx';

// Only the article route imports this module; the homepage uses metadata.
const content = {
  'minimax-h3-flashgen-4step': { en: FlashgenEn, zh: FlashgenZh },
  'minimax-h3-vbvr': { en: VbvrEn, zh: VbvrZh },
};

export function getGuideContent(slug: GuideSlug, locale: string) {
  return content[slug][locale === 'zh' ? 'zh' : 'en'];
}
