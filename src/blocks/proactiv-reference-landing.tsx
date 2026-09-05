import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  Code2,
  Mail,
  MessageCircleMore,
  Share2,
  Sparkles,
  UsersRound,
  WandSparkles,
} from 'lucide-react';

import { useRouter } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import {
  ProactivHeroComposer,
  type ProactivHeroComposerLabels,
} from '@/components/proactiv/proactiv-hero-composer';

type ReferenceRecord = readonly [string, ...string[]];

function parseRecords(value: string): ReferenceRecord[] {
  return value
    .split('\n')
    .filter(Boolean)
    .map((record) => record.split('||') as ReferenceRecord);
}

const composerLabels = (): ProactivHeroComposerLabels => ({
  addReference: m['proactiv.hero.composer.add_reference'](),
  aspectRatio: m['proactiv.hero.composer.aspect_ratio'](),
  avatar: m['proactiv.hero.composer.avatar'](),
  duration: m['proactiv.hero.composer.duration'](),
  durationLoading: m['proactiv.hero.composer.duration_loading'](),
  durationPending: m['proactiv.hero.composer.duration_pending'](),
  durationUnavailable: m['proactiv.hero.composer.duration_unavailable'](),
  durationUnsupported: m['proactiv.hero.composer.duration_unsupported'](),
  generate: m['proactiv.hero.composer.generate'](),
  generated: m['proactiv.hero.composer.generated'](),
  image: m['proactiv.hero.composer.image'](),
  imageModel: m['proactiv.hero.composer.image_model'](),
  model: m['proactiv.hero.composer.model'](),
  placeholder: m['proactiv.hero.composer.placeholder'](),
  product: m['proactiv.hero.composer.product'](),
  removeAttachment: m['proactiv.hero.composer.remove_attachment'](),
  resolution: m['proactiv.hero.composer.resolution'](),
  textModel: m['proactiv.hero.composer.text_model'](),
  video: m['proactiv.hero.composer.video'](),
  videoModel: m['proactiv.hero.composer.video_model'](),
});

const featureIcons = [Share2, BarChart3, Bot, UsersRound, WandSparkles];
const toolIcons = [Mail, Share2, Code2, Bot];
const h3MaxVideoReel = [
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/hero-1984.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/feature-scooter-spot.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/feature-balloon-keyframes.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/feature-character-sf.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/feature-jazz-trio.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/feature-metamorphosis.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/feature-vase-painting.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/example-tideflats.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/example-pixel-platformer.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/example-chef.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/example-claymation.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/example-espresso.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/example-hummingbird.mp4',
] as const;
const toolVideos = [
  '/proactiv-reference/showcase-videos/fashion-editorial.mp4',
  '/proactiv-reference/showcase-videos/neon-city.mp4',
  '/proactiv-reference/showcase-videos/dragon-flight.mp4',
  '/proactiv-reference/showcase-videos/alpine-train.mp4',
];

export function ProactivReferenceLanding() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [yearly, setYearly] = useState(false);
  const testimonials = useMemo(
    () => parseRecords(m['reference.testimonials.records']()),
    []
  );
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const features = parseRecords(m['reference.features.records']());
  const tools = parseRecords(m['reference.tools.records']());
  const tiers = parseRecords(m['reference.pricing.tiers']());
  const faqs = parseRecords(m['reference.faq.records']());

  useEffect(() => {
    if (testimonials.length < 2) return;
    const id = window.setInterval(() => {
      setActiveTestimonial((current) =>
        current + 1 === testimonials.length ? 0 : current + 1
      );
    }, 7000);
    return () => window.clearInterval(id);
  }, [testimonials.length]);

  const scrollToComposer = () => {
    document.getElementById('proactiv-reference-composer')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const activeQuote = testimonials[activeTestimonial] ?? testimonials[0];

  return (
    <div className="proactiv-reference relative isolate overflow-hidden bg-[#08090a] text-white">
      <Header />
      <AmbientLight />
      <main>
        <section className="relative mx-auto flex min-h-[840px] max-w-7xl flex-col items-center px-5 pt-24 pb-20 sm:px-8 md:min-h-[1120px] md:pt-36">
          <video
            aria-hidden="true"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            src="/proactiv-reference/hero-background-minimax-h3.mp4"
            className="pointer-events-none absolute inset-y-0 left-1/2 z-0 h-full w-screen max-w-none -translate-x-1/2 object-cover opacity-70 motion-reduce:hidden"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 z-10 h-full w-screen max-w-none -translate-x-1/2 bg-[linear-gradient(180deg,rgba(8,9,10,0.56)_0%,rgba(8,9,10,0.64)_30%,rgba(8,9,10,0.86)_74%,#08090a_100%)]"
          />
          <h1 className="proactiv-reference-heading relative z-20 max-w-6xl text-center text-4xl leading-[1.03] font-semibold tracking-[-0.055em] sm:text-6xl lg:text-8xl">
            {m['reference.hero.title']()}
          </h1>
          <p className="relative z-20 mt-6 max-w-3xl text-center text-base leading-7 text-neutral-300 sm:mt-8 sm:text-xl sm:leading-8">
            {m['reference.hero.description']()}
          </p>

          <div className="relative z-20 mt-12 w-full px-0 sm:mt-16 md:px-12">
            <div className="absolute -inset-x-10 -inset-y-16 -z-10 rounded-[4rem] bg-[radial-gradient(circle_at_50%_0%,rgba(57,195,239,0.18),transparent_53%)] blur-2xl" />
            <div className="proactiv-reference-console relative mx-auto max-w-6xl rounded-[28px] border-4 border-neutral-900 bg-[#161719] p-1.5 shadow-[0_9px_20px_rgba(0,0,0,0.4),0_37px_37px_rgba(0,0,0,0.32),0_84px_50px_rgba(0,0,0,0.2)] md:p-2">
              <div className="absolute top-0 left-[12%] h-px w-2/3 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
              <div className="rounded-[18px] border border-white/10 bg-[#0e1011] p-2 sm:p-3">
                <div id="proactiv-reference-composer" className="scroll-mt-24">
                  <ProactivHeroComposer
                    appearance="console"
                    allowVideoMode={false}
                    compactAction
                    labels={composerLabels()}
                    requireReferences={false}
                    onGenerate={({ prompt }) => {
                      router.push(
                        `/text-to-image?prompt=${encodeURIComponent(prompt)}`
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-5 pt-16 sm:px-8 md:pt-24">
          <AmbientLight />
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 md:flex-row md:items-start">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-[-0.045em] text-white md:text-4xl">
                {m['reference.cta.title']()}
              </h2>
              <p className="mt-7 text-base leading-7 text-neutral-400">
                {m['reference.cta.description']()}
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToComposer}
              className="group inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-base font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              {m['reference.hero.cta']()}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="relative z-10 mx-auto mt-16 max-w-6xl overflow-hidden rounded-t-[28px] border-x border-t border-white/15 bg-[#141414] p-3 shadow-[0_-10px_70px_rgba(255,255,255,0.08)] sm:p-5">
            <H3MaxVideoReel />
          </div>
        </section>

        <section
          id="features"
          className="relative mx-auto max-w-5xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-32"
        >
          <SectionIntro
            icon={<Sparkles className="size-5 text-cyan-300" />}
            title={m['reference.features.title']()}
            description={m['reference.features.description']()}
          />
          <div className="mt-12 grid grid-cols-1 gap-2 lg:grid-cols-3">
            {features.map(([title, description], index) => (
              <FeatureCard
                key={title}
                title={title}
                description={description ?? ''}
                index={index}
                className={index === 0 ? 'lg:col-span-2' : ''}
              />
            ))}
          </div>
        </section>

        <section className="relative bg-[#08090a] py-20 md:py-36">
          <div className="px-5 sm:px-8">
            <SectionIntro
              icon={<Code2 className="size-5 text-cyan-300" />}
              title={m['reference.tools.title']()}
              description={m['reference.tools.description']()}
            />
          </div>
          <div className="mx-auto mt-12 max-w-7xl px-5 sm:px-8">
            {tools.map(([title, description], index) => (
              <article
                key={title}
                className={`group grid gap-8 border-t border-white/10 py-12 last:border-b lg:items-center lg:gap-20 lg:py-24 ${
                  index % 2 === 0
                    ? 'lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.85fr)]'
                    : 'lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.7fr)]'
                }`}
              >
                <div className={index % 2 === 0 ? 'lg:order-2' : undefined}>
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-[inset_0_1px_10px_rgba(255,255,255,0.08)]">
                    {(() => {
                      const Icon = toolIcons[index] ?? Bot;
                      return <Icon className="size-6 text-cyan-300" />;
                    })()}
                  </div>
                  <h3 className="text-3xl font-bold tracking-[-0.04em] text-white lg:text-4xl">
                    {title}
                  </h3>
                  <p className="mt-3 max-w-sm text-base leading-7 text-neutral-400">
                    {description}
                  </p>
                </div>
                <div
                  className={`relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900 p-3 shadow-2xl ${
                    index % 2 === 0 ? 'lg:order-1' : ''
                  }`}
                >
                  <video
                    src={toolVideos[index]}
                    aria-label={title}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="aspect-[16/10] w-full rounded-lg object-cover opacity-85 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
                  />
                  <div className="absolute right-8 bottom-3 left-8 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden py-20 md:py-32">
          <AmbientLight />
          <SectionIntro
            icon={<WandSparkles className="size-5 text-cyan-300" />}
            title={m['reference.testimonials.title']()}
            description={m['reference.testimonials.description']()}
          />
          <div className="relative mx-auto mt-14 min-h-[420px] max-w-7xl px-5 sm:px-8">
            <div className="pointer-events-none absolute inset-0 grid grid-cols-2 gap-3 [mask-image:radial-gradient(circle_at_center,transparent_0%,black_73%)] opacity-20 md:grid-cols-4">
              {testimonials.map(([name, designation, quote], index) => (
                <div
                  key={`${name}-${index}`}
                  className="rounded-xl border border-white/15 bg-white/5 p-5"
                >
                  <p className="text-sm font-semibold text-white">{quote}</p>
                  <p className="mt-6 text-xs font-semibold">{name}</p>
                  <p className="mt-1 text-xs text-neutral-400">{designation}</p>
                </div>
              ))}
            </div>
            {activeQuote ? (
              <div className="relative z-10 mx-auto flex min-h-[385px] max-w-3xl flex-col items-center justify-center text-center">
                <div className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-b from-white/25 to-transparent p-px">
                  <img
                    src={activeQuote[3] ?? ''}
                    alt={activeQuote[0]}
                    className="size-[76px] rounded-full object-cover"
                  />
                </div>
                <blockquote className="mt-7 text-lg leading-8 font-bold text-transparent [-webkit-background-clip:text] [background:linear-gradient(90deg,rgba(229,229,229,.55),#fff,rgba(229,229,229,.55))] sm:text-2xl sm:leading-10">
                  {activeQuote[2]}
                </blockquote>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {testimonials.map(([name, designation], index) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setActiveTestimonial(index)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        activeTestimonial === index
                          ? 'border-cyan-300/60 bg-white/10 text-white'
                          : 'border-white/10 bg-neutral-900/70 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold">{name}</span>
                      <span className="hidden text-neutral-500 sm:inline">
                        {' '}
                        — {designation}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section
          id="pricing"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-32"
        >
          <SectionIntro
            icon={<BarChart3 className="size-5 text-cyan-300" />}
            title={m['reference.pricing.title']()}
            description={m['reference.pricing.description']()}
          />
          <div className="mt-9 flex justify-center">
            <button
              type="button"
              role="switch"
              aria-checked={yearly}
              onClick={() => setYearly((value) => !value)}
              className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-neutral-300"
            >
              <span className={!yearly ? 'text-white' : ''}>
                {m['reference.pricing.monthly']()}
              </span>
              <span className="flex h-5 w-9 items-center rounded-full bg-neutral-700 p-0.5">
                <span
                  className={`size-4 rounded-full bg-white transition-transform ${yearly ? 'translate-x-4' : ''}`}
                />
              </span>
              <span className={yearly ? 'text-white' : ''}>
                {m['reference.pricing.yearly']()}
              </span>
            </button>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map(
              ([title, description, monthly, annual, cta, features], index) => {
                const featured = index === 2;
                const price =
                  title === 'Enterprise'
                    ? 'Custom'
                    : `$${yearly ? annual : monthly} / ${yearly ? 'year' : 'month'}`;
                return (
                  <article
                    key={title}
                    className={`relative flex min-h-[500px] flex-col rounded-xl border p-6 ${
                      featured
                        ? 'overflow-hidden border-cyan-200/20 bg-[radial-gradient(circle_at_top,rgba(38,38,38,1),#0a0a0a_70%)]'
                        : 'border-white/10 bg-white/[0.025]'
                    }`}
                  >
                    {featured ? (
                      <span className="absolute top-0 left-[15%] h-px w-[70%] bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
                    ) : null}
                    <h3 className="text-base font-medium">{title}</h3>
                    <p className="mt-4 text-lg font-medium text-neutral-300">
                      {price}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-neutral-400">
                      {description}
                    </p>
                    <ul className="mt-5 space-y-3">
                      {features?.split('~~').map((feature) => (
                        <li
                          key={feature}
                          className="flex gap-2 text-sm leading-5 text-neutral-300"
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-neutral-200" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={scrollToComposer}
                      className={`mt-auto inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
                        featured
                          ? 'bg-white text-black hover:bg-neutral-200'
                          : 'bg-neutral-800 text-white hover:bg-neutral-700'
                      }`}
                    >
                      {cta}
                    </button>
                  </article>
                );
              }
            )}
          </div>
          <LogoMarquee />
          <div className="mx-auto mt-20 max-w-3xl">
            <h2 className="proactiv-reference-heading text-center text-3xl font-medium tracking-[-0.04em] sm:text-5xl">
              {m['reference.faq.title']()}
            </h2>
            <div className="mt-14 grid gap-4">
              {faqs.map(([question, answer], index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={question}
                    className="overflow-hidden rounded-xl bg-neutral-900"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-5 p-5 text-left text-base font-bold"
                    >
                      {question}
                      <ChevronDown
                        className={`size-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen ? (
                      <p className="px-5 pb-5 text-base leading-7 text-neutral-400">
                        {answer}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function H3MaxVideoReel() {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3"
    >
      {h3MaxVideoReel.map((src, index) => (
        <H3MaxVideoClip key={src} src={src} index={index} />
      ))}
    </div>
  );
}

function H3MaxVideoClip({ src, index }: { src: string; index: number }) {
  const clipRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(index === 0);
  const isLead = index === 0;

  useEffect(() => {
    if (shouldLoad) return;

    const clip = clipRef.current;
    if (!clip || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '320px 0px' }
    );
    observer.observe(clip);

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={clipRef}
      className={`group relative overflow-hidden rounded-lg bg-black ${
        isLead ? 'sm:col-span-2 lg:col-span-3' : ''
      }`}
    >
      {shouldLoad ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          src={src}
          className={`w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-100 ${
            isLead ? 'aspect-[16/7] sm:aspect-[16/6]' : 'aspect-[16/10]'
          }`}
        />
      ) : (
        <div
          className={
            isLead ? 'aspect-[16/7] sm:aspect-[16/6]' : 'aspect-[16/10]'
          }
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/[0.04]" />
    </div>
  );
}

function AmbientLight() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[800px] overflow-hidden"
    >
      <div className="absolute -top-[420px] -left-24 h-[1050px] w-[440px] -rotate-45 bg-[radial-gradient(ellipse,rgba(255,255,255,0.09),rgba(255,255,255,0.015)_45%,transparent_72%)]" />
      <div className="absolute -top-[400px] left-48 h-[920px] w-[260px] -rotate-45 bg-[radial-gradient(ellipse,rgba(255,255,255,0.05),transparent_72%)]" />
    </div>
  );
}

function SectionIntro({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative z-10 text-center">
      <div className="mx-auto flex size-11 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-[inset_0_1px_12px_rgba(255,255,255,0.08)]">
        {icon}
      </div>
      <h2 className="proactiv-reference-heading mt-5 text-3xl font-medium tracking-[-0.045em] sm:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  index,
  className,
}: {
  title: string;
  description: string;
  index: number;
  className?: string;
}) {
  const Icon = featureIcons[index] ?? Sparkles;
  return (
    <article
      className={`group overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] p-8 shadow-[inset_2px_4px_16px_rgba(248,248,248,0.06)] ${className ?? ''}`}
    >
      <div className="flex h-48 items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_67%)]">
        <div className="relative flex size-24 items-center justify-center rounded-2xl border border-white/15 bg-neutral-900 shadow-[0_0_42px_rgba(57,195,239,0.12)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
          <Icon className="size-10 text-cyan-300" />
          <span className="absolute -right-4 -bottom-4 flex size-10 items-center justify-center rounded-full border border-white/15 bg-neutral-800 text-xs text-neutral-300">
            0{index + 1}
          </span>
        </div>
      </div>
      <h3 className="pt-7 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-400">
        {description}
      </p>
    </article>
  );
}

function LogoMarquee() {
  const logos = [
    'netflix',
    'google',
    'meta',
    'onlyfans',
    'netflix',
    'google',
    'meta',
    'onlyfans',
  ];
  const ext: Record<string, string> = { google: 'webp' };
  return (
    <div className="relative mt-20 overflow-hidden py-7">
      <p className="mb-5 text-center text-sm text-neutral-400">
        Trusted by big industries
      </p>
      <div className="proactiv-reference-marquee flex w-max items-center gap-14 opacity-75 grayscale">
        {logos.map((logo, index) => (
          <img
            key={`${logo}-${index}`}
            src={`/proactiv-reference/logos/${logo}.${ext[logo] ?? 'png'}`}
            alt={logo}
            className="h-11 w-28 object-contain"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}
