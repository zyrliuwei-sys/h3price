import { ArrowRight, BookOpen, Clock3 } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import type { GuideMeta, GuideSlug } from '@/content/guides';

type GuideListProps = {
  eyebrow: string;
  title: string;
  description: string;
  readLabel: string;
  minutesLabel: (minutes: number) => string;
  guides: { slug: GuideSlug; meta: GuideMeta }[];
};

export function GuideList({
  eyebrow,
  title,
  description,
  readLabel,
  minutesLabel,
  guides,
}: GuideListProps) {
  return (
    <section
      id="guides"
      aria-labelledby="guides-title"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-5 pt-4 pb-20 sm:px-8 md:pb-32"
    >
      <div className="border-t border-white/10 pt-14 sm:pt-20">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-cyan-200 uppercase">
          <BookOpen className="size-4" aria-hidden="true" />
          {eyebrow}
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
          <h2
            id="guides-title"
            className="max-w-2xl text-3xl leading-tight font-medium tracking-[-0.045em] text-balance sm:text-5xl"
          >
            {title}
          </h2>
          <p className="max-w-lg text-base leading-7 text-neutral-400">
            {description}
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {guides.map(({ slug, meta }, index) => (
            <article key={slug} className="group min-w-0">
              <Link
                href={`/guides/${slug}`}
                className="block rounded-2xl outline-offset-8 focus-visible:outline-2 focus-visible:outline-cyan-200"
              >
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101519] transition-colors group-hover:border-cyan-200/40">
                  <img
                    src={meta.image}
                    alt={meta.imageAlt}
                    width={1200}
                    height={680}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[30/17] w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
                  />
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-400">
                  <span
                    className={index === 0 ? 'text-cyan-200' : 'text-[#f0ab96]'}
                  >
                    {meta.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="size-3.5" aria-hidden="true" />
                    {minutesLabel(meta.readMinutes)}
                  </span>
                </div>
                <h3 className="mt-3 max-w-xl text-xl leading-snug font-medium tracking-[-0.025em] text-balance text-white transition-colors group-hover:text-cyan-100 sm:text-2xl">
                  {meta.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-400">
                  {meta.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white">
                  {readLabel}
                  <ArrowRight
                    className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
