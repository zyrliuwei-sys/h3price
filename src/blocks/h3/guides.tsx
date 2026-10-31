import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { GuideList } from '@/components/h3/guide-list';
import { getGuideMeta, GUIDE_SLUGS } from '@/content/guides';

export function H3Guides() {
  const locale = getLocale();
  return (
    <GuideList
      eyebrow={m['h3.guides.eyebrow']()}
      title={m['h3.guides.title']()}
      description={m['h3.guides.description']()}
      readLabel={m['h3.guides.read']()}
      minutesLabel={(minutes) => m['h3.guides.minutes']({ minutes })}
      guides={GUIDE_SLUGS.map((slug) => ({
        slug,
        meta: getGuideMeta(slug, locale),
      }))}
    />
  );
}
