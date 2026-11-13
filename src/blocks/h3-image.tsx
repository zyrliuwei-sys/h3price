import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Plus,
  ScanLine,
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { H3_IMAGE_CREDITS } from '@/lib/h3-image';
import { m } from '@/paraglide/messages.js';
import { Footer } from '@/blocks/footer';
import {
  H3ImageGeneratorBlock,
  h3ImagePrompts,
} from '@/blocks/h3-image-generator';
import { Header } from '@/blocks/header';

import '@fontsource/libre-baskerville/400-italic.css';

export function H3ImagePage() {
  const [selectedPrompt, setSelectedPrompt] = useState<{
    prompt: string;
    id: number;
  }>();
  const examples = [
    {
      key: 'worlds',
      image: 'worlds',
      title: m['h3_image.gallery.worlds.title'](),
      text: m['h3_image.gallery.worlds.text'](),
      alt: m['h3_image.gallery.worlds.alt'](),
      prompt: h3ImagePrompts.worlds,
    },
    {
      key: 'product',
      image: 'product',
      title: m['h3_image.gallery.product.title'](),
      text: m['h3_image.gallery.product.text'](),
      alt: m['h3_image.gallery.product.alt'](),
      prompt: h3ImagePrompts.product,
    },
    {
      key: 'interior',
      image: 'interior',
      title: m['h3_image.gallery.interior.title'](),
      text: m['h3_image.gallery.interior.text'](),
      alt: m['h3_image.gallery.interior.alt'](),
      prompt: h3ImagePrompts.interior,
    },
    {
      key: 'type',
      image: 'type',
      title: m['h3_image.gallery.type.title'](),
      text: m['h3_image.gallery.type.text'](),
      alt: m['h3_image.gallery.type.alt'](),
      prompt: h3ImagePrompts.poster,
    },
  ];
  const guide = [
    {
      title: m['h3_image.guide.one.title'](),
      text: m['h3_image.guide.one.text'](),
    },
    {
      title: m['h3_image.guide.two.title'](),
      text: m['h3_image.guide.two.text'](),
    },
    {
      title: m['h3_image.guide.three.title'](),
      text: m['h3_image.guide.three.text'](),
    },
  ];
  const faqs = [
    {
      question: m['h3_image.faq.what.question'](),
      answer: m['h3_image.faq.what.answer'](),
    },
    {
      question: m['h3_image.faq.resolution.question'](),
      answer: m['h3_image.faq.resolution.answer'](),
    },
    {
      question: m['h3_image.faq.text.question'](),
      answer: m['h3_image.faq.text.answer'](),
    },
    {
      question: m['h3_image.faq.credits.question'](),
      answer: m['h3_image.faq.credits.answer'](),
    },
    {
      question: m['h3_image.faq.video.question'](),
      answer: m['h3_image.faq.video.answer'](),
    },
    {
      question: m['h3_image.faq.references.question'](),
      answer: m['h3_image.faq.references.answer'](),
    },
  ];
  function usePrompt(prompt: string) {
    setSelectedPrompt({ prompt, id: Date.now() });
    document.getElementById('create')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'start',
    });
  }
  return (
    <div className="h3-image-page min-h-screen bg-[#101113] text-[#f2eee7]">
      <Header />
      <main>
        <section className="mx-auto max-w-7xl px-5 pt-14 pb-12 sm:px-8 sm:pt-20 lg:pb-16">
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-[#c6a77c] uppercase">
            <span className="size-1.5 rounded-full bg-[#eab574]" />
            MINIMAX / H3-IMAGE
            <span className="ml-auto text-neutral-600">STILL STUDIO — 01</span>
          </div>
          <div className="mt-9 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
            <h1 className="text-5xl leading-[1.06] font-medium tracking-[-0.055em] text-balance sm:text-7xl lg:text-[88px]">
              H3 Image.
              <br />
              <span className="h3-image-serif mt-3 block text-[0.8em] tracking-[-0.04em] text-[#e8bc86]">
                {m['h3_image.hero.title']()}
              </span>
            </h1>
            <div className="max-w-md pb-1">
              <p className="text-base leading-8 text-[#a7a39e] sm:text-lg">
                {m['h3_image.hero.description']()}
              </p>
              <a
                href="#create"
                className="mt-6 inline-flex min-h-11 items-center gap-4 border-b border-[#eab574]/50 pb-1 text-sm text-[#e8bc86]"
              >
                {m['h3_image.hero.cta']()}
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-2 border-t border-white/10 pt-5 text-xs text-neutral-400">
            {[
              m['h3_image.hero.text_to_image'](),
              m['h3_image.hero.resolutions'](),
              m['h3_image.hero.png'](),
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <Check className="size-3 text-[#c6a77c]" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </section>

        <section
          id="create"
          aria-labelledby="h3-image-create-title"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-20 sm:px-8 lg:pb-28"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2
              id="h3-image-create-title"
              className="font-mono text-xs tracking-[0.15em] text-neutral-400 uppercase"
            >
              01 / {m['h3_image.create.title']()}
            </h2>
            <span className="text-[11px] text-neutral-600">
              {m['h3_image.create.note']()}
            </span>
          </div>
          <H3ImageGeneratorBlock selectedPrompt={selectedPrompt} />
        </section>

        <section
          aria-labelledby="h3-image-gallery-title"
          className="border-t border-white/[0.07] bg-[#141517] py-16 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="font-mono text-[10px] tracking-[0.18em] text-[#bd9d74] uppercase">
              02 / {m['h3_image.gallery.eyebrow']()}
            </p>
            <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <h2
                id="h3-image-gallery-title"
                className="max-w-xl text-3xl leading-tight font-medium tracking-[-0.04em] text-balance sm:text-5xl"
              >
                {m['h3_image.gallery.title']()}
              </h2>
              <p className="max-w-sm text-sm leading-7 text-neutral-400">
                {m['h3_image.gallery.description']()}
              </p>
            </div>
            <div className="mt-10 grid gap-x-7 gap-y-12 md:grid-cols-2">
              {examples.map((example, index) => (
                <article key={example.key} className="group min-w-0">
                  <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#202125]">
                    <img
                      src={`/h3-image/${example.image}.webp`}
                      alt={example.alt}
                      width={1000}
                      height={667}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[3/2] w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.025]"
                    />
                    <span className="absolute top-4 left-4 rounded bg-black/65 px-2 py-1 font-mono text-[10px] tracking-wider text-white/75">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <h3 className="text-xl font-medium tracking-tight">
                      {example.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => usePrompt(example.prompt)}
                      className="flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs text-[#d8b588] transition-colors hover:border-[#eab574]/50"
                    >
                      {m['h3_image.gallery.try']()}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="mt-2 max-w-lg text-sm leading-7 text-neutral-400">
                    {example.text}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-10 text-xs leading-6 text-neutral-400">
              {m['h3_image.gallery.attribution']()}{' '}
              <a
                href="https://fal.ai/minimax-h3-image"
                className="text-[#c6a77c] underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                fal.ai ↗
              </a>
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:py-28">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-[#bd9d74] uppercase">
              03 / {m['h3_image.guide.eyebrow']()}
            </p>
            <h2 className="mt-5 text-3xl leading-tight font-medium tracking-[-0.04em] text-balance sm:text-5xl">
              {m['h3_image.guide.title']()}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-8 text-neutral-400">
              {m['h3_image.guide.description']()}
            </p>
            <div className="mt-7 rounded-xl border border-[#eab574]/15 bg-[#eab574]/[0.025] p-5">
              <p className="text-xs text-[#c6a77c]">
                {m['h3_image.guide.formula_label']()}
              </p>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                {m['h3_image.guide.formula']()}
              </p>
            </div>
          </div>
          <ol className="border-t border-white/10">
            {guide.map((item, index) => (
              <li
                key={item.title}
                className="grid grid-cols-[36px_1fr] gap-4 border-b border-white/10 py-7"
              >
                <span className="pt-1 font-mono text-xs text-[#bd9d74]">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-xl font-medium tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-8 text-neutral-400">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="grid overflow-hidden rounded-2xl border border-white/10 lg:grid-cols-2">
            <img
              src="/h3-image/keyframe.webp"
              alt={m['h3_image.video.alt']()}
              width={1000}
              height={667}
              loading="lazy"
              decoding="async"
              className="h-full min-h-64 w-full object-cover"
            />
            <div className="flex flex-col justify-center bg-[#191a1d] p-7 sm:p-10">
              <ScanLine className="size-6 text-[#d8b588]" aria-hidden="true" />
              <p className="mt-6 font-mono text-[10px] tracking-[0.16em] text-[#bd9d74] uppercase">
                04 / {m['h3_image.video.eyebrow']()}
              </p>
              <h2 className="mt-4 text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
                {m['h3_image.video.title']()}
              </h2>
              <p className="mt-5 text-sm leading-8 text-neutral-400">
                {m['h3_image.video.text']()}
              </p>
              <Link
                href="/text-to-video"
                className="mt-7 inline-flex min-h-11 items-center gap-3 self-start text-sm font-medium text-[#eab574]"
              >
                {m['h3_image.video.cta']()}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-[#141517] py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-9 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="font-mono text-[10px] tracking-[0.18em] text-[#bd9d74] uppercase">
                05 / {m['h3_image.pricing.eyebrow']()}
              </p>
              <h2 className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">
                {m['h3_image.pricing.title']()}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-neutral-400">
                {m['h3_image.pricing.description']()}
              </p>
              <Link
                href="/pricing"
                className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm text-[#eab574]"
              >
                {m['h3_image.pricing.cta']()}
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(H3_IMAGE_CREDITS).map(([size, credits]) => (
                <div
                  key={size}
                  className={`flex flex-col justify-center rounded-xl border px-4 py-7 ${size === '2K' ? 'border-[#eab574]/35 bg-[#eab574]/[0.035]' : 'border-white/10'}`}
                >
                  <span className="font-mono text-xs text-[#c6a77c]">
                    {size}
                  </span>
                  <span className="mt-5 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                    {credits}
                  </span>
                  <span className="mt-2 text-[11px] leading-5 text-neutral-400">
                    {m['h3_image.pricing.per_image']()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-28">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-[#bd9d74] uppercase">
              06 / FAQ
            </p>
            <h2 className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">
              {m['h3_image.faq.title']()}
            </h2>
            <p className="mt-5 text-xs leading-7 text-neutral-400">
              {m['h3_image.sources.label']()}
              <br />
              <a
                href="https://github.com/MiniMax-AI/MiniMax-H3-Image"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c6a77c] underline underline-offset-4"
              >
                MiniMax H3 Image ↗
              </a>
              <br />
              <a
                href="https://fal.ai/models/minimax/h3-image/text-to-image/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c6a77c] underline underline-offset-4"
              >
                fal API ↗
              </a>
            </p>
          </div>
          <div className="border-t border-white/10">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border-b border-white/10 py-5"
              >
                <summary className="flex min-h-10 cursor-pointer list-none items-start justify-between gap-5 text-sm leading-7 font-medium [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <Plus className="mt-1 size-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-4 pr-5 text-sm leading-8 text-neutral-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
