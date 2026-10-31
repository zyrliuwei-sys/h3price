import {
  Children,
  isValidElement,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { MDXProvider } from '@mdx-js/react';
import { ArrowLeft, ArrowRight, Check, Copy } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';

import { Link } from '@/core/i18n/navigation';
import type { GuideMeta } from '@/content/guides';

function plainText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child): string => {
      if (typeof child === 'string' || typeof child === 'number')
        return String(child);
      if (isValidElement<{ children?: ReactNode }>(child))
        return plainText(child.props.children);
      return '';
    })
    .join('');
}

function CopyableCode({
  children,
  labels,
}: {
  children?: ReactNode;
  labels: { copy: string; copied: string; failed: string };
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const codeElement = Children.toArray(children).find((child) =>
    isValidElement(child)
  );
  const language = isValidElement<{ className?: string }>(codeElement)
    ? codeElement.props.className?.replace('language-', '').toUpperCase()
    : undefined;
  useEffect(() => {
    if (status === 'idle') return;
    const timer = window.setTimeout(() => setStatus('idle'), 2500);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <div className="guide-code-block">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="font-mono text-xs text-neutral-400">
          {language ?? 'TEXT'}
        </span>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(plainText(children).trim());
              setStatus('copied');
            } catch {
              setStatus('failed');
            }
          }}
          className="flex min-h-9 items-center gap-2 rounded-md px-2 text-xs text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-200"
        >
          {status === 'copied' ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          <span aria-live="polite">
            {status === 'copied'
              ? labels.copied
              : status === 'failed'
                ? labels.failed
                : labels.copy}
          </span>
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}

type GuideArticleProps = {
  meta: GuideMeta;
  children: ReactNode;
  date: string;
  readTime: string;
  labels: {
    back: string;
    summary: string;
    contents: string;
    updated: string;
    continue: string;
    copy: string;
    copied: string;
    failed: string;
  };
  related: { href: string; title: string; category: string };
};

export function GuideArticle({
  meta,
  children,
  date,
  readTime,
  labels,
  related,
}: GuideArticleProps) {
  const [activeSection, setActiveSection] = useState(
    meta.sections[0]?.id ?? ''
  );

  useEffect(() => {
    setActiveSection(meta.sections[0]?.id ?? '');
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-10% 0px -65% 0px' }
    );
    for (const section of meta.sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [meta]);

  const components: MDXComponents = {
    a: ({ href = '', children: linkChildren, ...props }) =>
      href.startsWith('/') ? (
        <Link href={href} {...props}>
          {linkChildren}
        </Link>
      ) : (
        <a href={href} {...props}>
          {linkChildren}
        </a>
      ),
    pre: ({ children: code }) => (
      <CopyableCode labels={labels}>{code}</CopyableCode>
    ),
    table: ({ children: rows, ...props }) => (
      <div className="guide-table-scroll">
        <table {...props}>{rows}</table>
      </div>
    ),
  };

  return (
    <article className="mx-auto w-full max-w-6xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16 sm:pb-28">
      <Link
        href="/#guides"
        className="inline-flex min-h-10 items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {labels.back}
      </Link>
      <header className="mt-10 max-w-4xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
          {meta.category}
        </p>
        <h1 className="mt-5 text-4xl leading-[1.12] font-medium tracking-[-0.045em] text-balance text-white sm:text-5xl lg:text-6xl">
          {meta.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-400">
          {meta.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-6 text-neutral-400">
          <span>
            {labels.updated} <time dateTime={meta.publishedAt}>{date}</time>
          </span>
          <span>{readTime}</span>
        </div>
      </header>
      <figure className="mt-10 mb-12">
        <img
          src={meta.image}
          alt={meta.imageAlt}
          width={1200}
          height={680}
          fetchPriority="high"
          className="aspect-[30/17] w-full rounded-2xl border border-white/10 bg-[#101519]"
        />
        <figcaption className="mt-3 text-center text-xs leading-6 text-neutral-500">
          {meta.imageCaption}
        </figcaption>
      </figure>
      <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
        <div className="min-w-0">
          <div className="mb-12 border-l-2 border-cyan-200 bg-cyan-200/[0.04] px-6 py-5">
            <p className="text-xs font-semibold tracking-widest text-cyan-200 uppercase">
              {labels.summary}
            </p>
            <p className="mt-3 text-base leading-8 text-neutral-200">
              {meta.takeaway}
            </p>
          </div>
          <details className="mb-10 rounded-xl border border-white/10 px-5 py-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-medium">
              {labels.contents}
            </summary>
            <nav
              aria-label={labels.contents}
              className="mt-4 grid gap-3 text-sm text-neutral-400"
            >
              {meta.sections.map((section) => (
                <a
                  href={`#${section.id}`}
                  key={section.id}
                  className="py-1 hover:text-cyan-200"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </details>
          <MDXProvider components={components}>
            <div className="h3-guide-prose">{children}</div>
          </MDXProvider>
          <Link
            href={related.href}
            className="group mt-14 block rounded-xl border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-cyan-200/40"
          >
            <span className="text-xs text-neutral-400">
              {labels.continue} · {related.category}
            </span>
            <span className="mt-3 flex items-start justify-between gap-5 text-lg leading-7 font-medium text-white">
              {related.title}
              <ArrowRight
                className="mt-1 size-5 shrink-0 text-cyan-200 transition-transform motion-safe:group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>
        <aside className="hidden lg:block">
          <nav
            aria-label={labels.contents}
            className="sticky top-28 border-l border-white/10 pl-6"
          >
            <p className="mb-5 text-xs font-semibold tracking-wider text-white uppercase">
              {labels.contents}
            </p>
            <div className="grid gap-1">
              {meta.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  aria-current={
                    activeSection === section.id ? 'location' : undefined
                  }
                  className={`-ml-6 border-l py-2 pl-6 text-xs leading-5 transition-colors ${activeSection === section.id ? 'border-cyan-200 text-cyan-200' : 'border-transparent text-neutral-400 hover:text-white'}`}
                >
                  {section.title}
                </a>
              ))}
            </div>
          </nav>
        </aside>
      </div>
    </article>
  );
}
