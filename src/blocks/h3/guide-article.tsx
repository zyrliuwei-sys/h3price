import { m } from '@/paraglide/messages.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { GuideArticle } from '@/components/h3/guide-article';
import { getGuideMeta, GUIDE_SLUGS, type GuideSlug } from '@/content/guides';
import { getGuideContent } from '@/content/guides/content';

export function H3GuideArticle({
  slug,
  locale,
}: {
  slug: GuideSlug;
  locale: string;
}) {
  const meta = getGuideMeta(slug, locale);
  const Content = getGuideContent(slug, locale);
  const relatedSlug = GUIDE_SLUGS.find((item) => item !== slug)!;
  const related = getGuideMeta(relatedSlug, locale);
  const date = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${meta.publishedAt}T00:00:00Z`));

  return (
    <div className="min-h-screen bg-[#08090a] text-white">
      <Header />
      <main>
        <GuideArticle
          key={`${slug}-${locale}`}
          meta={meta}
          date={date}
          readTime={m['h3.guides.minutes']({ minutes: meta.readMinutes })}
          labels={{
            back: m['h3.guides.back'](),
            summary: m['h3.guides.summary'](),
            contents: m['h3.guides.contents'](),
            updated: m['h3.guides.updated'](),
            continue: m['h3.guides.continue'](),
            copy: m['h3.guides.copy'](),
            copied: m['h3.guides.copied'](),
            failed: m['h3.guides.copy_failed'](),
          }}
          related={{
            href: `/guides/${relatedSlug}`,
            title: related.title,
            category: related.category,
          }}
        >
          <Content />
        </GuideArticle>
      </main>
      <Footer />
    </div>
  );
}
